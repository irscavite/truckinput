const FIREBASE_BASE_URL = "https://truckmonitoring-bffa5-default-rtdb.asia-southeast1.firebasedatabase.app";

const $ = (id) => document.getElementById(id);

const state = {
  matchedMovementId: null,
  matchedActiveKey: null,
  matchedRecord: null,
  historyRecords: [],
};

function firebaseUrl(path = "") {
  return `${FIREBASE_BASE_URL}/${path}.json`;
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateRangeEpoch(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const start = new Date(year, month - 1, day, 0, 0, 0, 0);
  const end = new Date(year, month - 1, day, 23, 59, 59, 999);
  return { start: start.getTime(), end: end.getTime() };
}

function dateKeyFromIso(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return localDateKey();
  return localDateKey(date);
}

function formatHistoryDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function normalizePlate(value) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function cleanText(value) {
  return value.trim().replace(/\s+/g, " ").toUpperCase();
}

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatInterval(timeIn, timeOut) {
  if (!timeIn) return "—";

  const start = new Date(timeIn).getTime();
  const end = timeOut ? new Date(timeOut).getTime() : Date.now();

  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return "—";

  let totalMinutes = Math.floor((end - start) / 60000);
  const days = Math.floor(totalMinutes / 1440);
  totalMinutes %= 1440;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours || days) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);

  return `${parts.join(" ")}${timeOut ? "" : " (ongoing)"}`;
}

function showToast(message, type = "success") {
  const toast = $("toast");
  toast.textContent = message;
  toast.className = `toast show ${type === "error" ? "error" : ""}`;
  setTimeout(() => {
    toast.className = "toast";
  }, 3200);
}


function showYardAlert(id, message, type = "warning") {
  const el = $(id);
  if (!el) return;
  if (!message) {
    el.textContent = "";
    el.className = "yard-alert hidden";
    return;
  }
  el.textContent = message;
  el.className = `yard-alert ${type}`;
}

async function findActiveTruckMatches(plateValue) {
  const typedKey = normalizePlate(plateValue);
  if (!typedKey || typedKey.length < 4) return [];

  const exact = await request(`active_trucks/${typedKey}`);
  if (exact) return [[typedKey, exact]];

  const activeTrucks = await request("active_trucks");
  const entries = activeTrucks ? Object.entries(activeTrucks) : [];
  return entries.filter(([key, record]) => {
    const fullKey = normalizePlate(record?.plateNumber || key);
    return fullKey.endsWith(typedKey);
  });
}

function setDbStatus(message, ok = true) {
  $("dbStatus").textContent = message;
  document.querySelector(".db-dot").style.background = ok ? "#12b76a" : "#f04438";
}

function updateClock() {
  const now = new Date();
  $("currentDate").textContent = now.toLocaleDateString("en-PH", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  $("currentTime").textContent = now.toLocaleTimeString("en-PH");
  $("inTimestamp").textContent = formatDateTime(now.toISOString());
  $("outTimestamp").textContent = formatDateTime(now.toISOString());
}

setInterval(updateClock, 1000);
updateClock();

document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active-view"));
    $(btn.dataset.view).classList.add("active-view");

    const titleMap = {
      inView: "Truck IN",
      outView: "Truck OUT",
      historyView: "Movement History",
    };
    $("pageTitle").textContent = titleMap[btn.dataset.view];

    if (btn.dataset.view === "historyView") {
      loadHistory();
    }
  });
});

function toggleContainerInput(radioName, wrapperId, inputId) {
  const selected = document.querySelector(`input[name="${radioName}"]:checked`)?.value;
  const wrapper = $(wrapperId);
  const input = $(inputId);

  if (selected === "no") {
    wrapper.classList.remove("hidden");
    input.required = true;
  } else {
    wrapper.classList.add("hidden");
    input.required = false;
    input.value = "";
  }
}

document.querySelectorAll('input[name="inBare"]').forEach((radio) => {
  radio.addEventListener("change", () => toggleContainerInput("inBare", "inContainerWrap", "inContainer"));
});

document.querySelectorAll('input[name="outBare"]').forEach((radio) => {
  radio.addEventListener("change", () => toggleContainerInput("outBare", "outContainerWrap", "outContainer"));
});

$("outForm").addEventListener("reset", () => {
  setTimeout(() => {
    toggleContainerInput("outBare", "outContainerWrap", "outContainer");
    clearMatchedRecord();
  }, 0);
});

async function request(path, options = {}) {
  const response = await fetch(firebaseUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Firebase ${response.status}: ${text}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function requestDailyMovements(dateKey) {
  // Fast path only: load exactly one daily bucket.
  // No legacy fallback here, so Movement History does not trigger extra Firebase reads.
  return await request(`daily_movements/${dateKey}`);
}

async function findTruckProfileMatches(plateValue) {
  const typedKey = normalizePlate(plateValue);
  if (!typedKey || typedKey.length < 4) return [];

  // Exact match is fastest when the full plate is already known.
  const exact = await request(`truck_registry/${typedKey}`);
  if (exact) {
    return [{ key: typedKey, profile: exact }];
  }

  // For last-4 (or other suffix) lookup, read the lightweight permanent
  // truck registry and match the suffix. This lets old saved profiles work
  // immediately even if they were created before a suffix index existed.
  const registry = await request("truck_registry");
  const entries = registry ? Object.entries(registry) : [];

  return entries
    .filter(([key, profile]) => {
      const fullKey = normalizePlate(profile?.plateNumber || key);
      return fullKey.endsWith(typedKey);
    })
    .map(([key, profile]) => ({ key, profile }));
}

let inLookupTimer = null;
let inLookupToken = 0;
let inMatchedProfileKey = null;

function resetInPlateLookup(clearTrucking = false) {
  inMatchedProfileKey = null;
  showYardAlert("inYardAlert", "");
  $("saveInBtn").disabled = false;
  $("inPlateLookupStatus").textContent = "Waiting";
  $("inPlateLookupStatus").className = "lookup-status";
  $("inPlateHint").textContent = "Enter the last 4 digits to retrieve a saved truck.";
  if (clearTrucking) $("inTrucking").value = "";
}

$("inPlate").addEventListener("input", () => {
  clearTimeout(inLookupTimer);
  const typedValue = $("inPlate").value;
  const typedKey = normalizePlate(typedValue);
  const token = ++inLookupToken;
  inMatchedProfileKey = null;

  if (typedKey.length < 4) {
    resetInPlateLookup(false);
    return;
  }

  $("inPlateLookupStatus").textContent = "Searching...";
  $("inPlateLookupStatus").className = "lookup-status";
  $("inPlateHint").textContent = "Checking saved truck records...";

  inLookupTimer = setTimeout(async () => {
    try {
      const matches = await findTruckProfileMatches(typedValue);
      if (token !== inLookupToken) return;

      if (matches.length === 1) {
        const { key, profile } = matches[0];
        const fullPlate = profile.plateNumber || key;
        inMatchedProfileKey = normalizePlate(fullPlate);
        $("inPlate").value = fullPlate;
        if (profile.trucking) $("inTrucking").value = profile.trucking;

        const activeMatches = await findActiveTruckMatches(fullPlate);
        if (token !== inLookupToken) return;

        if (activeMatches.length === 1) {
          const [, active] = activeMatches[0];
          $("inPlateLookupStatus").textContent = "Still inside";
          $("inPlateLookupStatus").className = "lookup-status not-found";
          $("inPlateHint").textContent = "This truck already has an active IN record.";
          showYardAlert("inYardAlert", `THIS TRUCK IS STILL IN THE YARD${active?.timeIn ? ` • IN: ${formatDateTime(active.timeIn)}` : ""}. Complete the OUT transaction before another IN.`, "danger");
          $("saveInBtn").disabled = true;
          return;
        }

        $("inPlateLookupStatus").textContent = "Record found";
        $("inPlateLookupStatus").className = "lookup-status found";
        $("inPlateHint").textContent = "Saved plate and trucking loaded automatically. Truck is cleared for IN.";
        showYardAlert("inYardAlert", "TRUCK CLEARED FOR IN", "success");
        $("saveInBtn").disabled = false;
        return;
      }

      if (matches.length > 1) {
        $("inPlateLookupStatus").textContent = "Multiple matches";
        $("inPlateLookupStatus").className = "lookup-status not-found";
        $("inPlateHint").textContent = "More than one saved plate matches. Type more plate characters.";
        return;
      }

      $("inPlateLookupStatus").textContent = "New truck";
      $("inPlateLookupStatus").className = "lookup-status not-found";
      showYardAlert("inYardAlert", "");
      $("saveInBtn").disabled = false;
      $("inPlateHint").textContent = typedKey.length === 4
        ? "No saved match. Enter the FULL plate number and Trucking to create a new record."
        : "No saved match. Complete the full plate number and Trucking to create a new record.";
    } catch (error) {
      console.error("IN plate profile lookup failed:", error);
      if (token !== inLookupToken) return;
      $("inPlateLookupStatus").textContent = "Lookup error";
      $("inPlateLookupStatus").className = "lookup-status not-found";
      $("inPlateHint").textContent = "Could not check saved trucks. You can still enter the full plate and Trucking.";
    }
  }, 300);
});

$("inForm").addEventListener("reset", () => {
  setTimeout(() => {
    toggleContainerInput("inBare", "inContainerWrap", "inContainer");
    $("inPassThrough").checked = false;
    resetInPlateLookup(false);
  }, 0);
});

$("inForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const trucking = cleanText($("inTrucking").value);
  const plateNumber = cleanText($("inPlate").value);
  const plateKey = normalizePlate(plateNumber);
  const inBare = document.querySelector('input[name="inBare"]:checked').value === "yes";
  const inContainerNumber = inBare ? "" : cleanText($("inContainer").value);
  const passThrough = $("inPassThrough").checked;

  if (!plateKey) {
    showToast("Invalid plate number.", "error");
    return;
  }

  // A 4-character value is only allowed as a lookup key. If there was no
  // saved match, require the user to enter the complete plate before saving.
  if (plateKey.length <= 4 && inMatchedProfileKey !== plateKey) {
    showToast("No saved truck found. Enter the FULL plate number and Trucking.", "error");
    $("inPlate").focus();
    return;
  }

  if (!trucking) {
    showToast("Enter the Trucking company for this new truck.", "error");
    $("inTrucking").focus();
    return;
  }

  const saveBtn = $("saveInBtn");
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";

  try {
    setDbStatus("Checking plate...", true);

    const activeExisting = await request(`active_trucks/${plateKey}`);
    if (activeExisting) {
      showYardAlert("inYardAlert", "THIS TRUCK IS STILL IN THE YARD. Complete the OUT transaction before another IN.", "danger");
      throw new Error("This truck is still in the yard.");
    }

    const nowIso = new Date().toISOString();
    const movement = {
      trucking,
      plateNumber,
      plateKey,
      inBare,
      inContainerNumber,
      passThrough,
      timeIn: nowIso,
      timeInEpoch: Date.now(),
      status: "OPEN",
      createdAt: nowIso,
    };

    const created = await request("movements", {
      method: "POST",
      body: JSON.stringify(movement),
    });

    const movementId = created.name;
    const movementDateKey = dateKeyFromIso(nowIso);

    // Mirror each movement under its IN date for fast daily history loading.
    await request(`daily_movements/${movementDateKey}/${movementId}`, {
      method: "PUT",
      body: JSON.stringify(movement),
    });

    await request(`active_trucks/${plateKey}`, {
      method: "PUT",
      body: JSON.stringify({
        movementId,
        trucking,
        plateNumber,
        passThrough,
        timeIn: nowIso,
      }),
    });

    // Permanent plate master: keeps trucking information even after the truck OUTs.
    await request(`truck_registry/${plateKey}`, {
      method: "PUT",
      body: JSON.stringify({
        plateKey,
        plateNumber,
        trucking,
        lastTimeIn: nowIso,
        updatedAt: nowIso,
      }),
    });

    $("inForm").reset();
    setDbStatus("Firebase Connected", true);
    showToast(`Truck IN saved: ${plateNumber}`);
  } catch (error) {
    console.error(error);
    setDbStatus("Firebase Error", false);
    showToast(error.message || "Unable to save Truck IN.", "error");
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Save Truck IN";
  }
});

let lookupTimer = null;

$("outPlate").addEventListener("input", () => {
  clearTimeout(lookupTimer);
  const plate = $("outPlate").value;

  clearMatchedRecord(false);
  showYardAlert("outYardAlert", "");

  if (normalizePlate(plate).length < 4) {
    $("plateLookupStatus").textContent = "Waiting";
    $("plateLookupStatus").className = "lookup-status";
    return;
  }

  $("plateLookupStatus").textContent = "Searching...";
  $("plateLookupStatus").className = "lookup-status";

  lookupTimer = setTimeout(() => lookupActivePlate(plate), 350);
});

async function lookupActivePlate(plateValue) {
  const typedKey = normalizePlate(plateValue);
  if (!typedKey || typedKey.length < 4) return;

  try {
    const activeTrucks = await request("active_trucks");
    const entries = activeTrucks ? Object.entries(activeTrucks) : [];

    // Full plate works as before. Partial OUT lookup matches suffix, so the last 4
    // characters are enough as long as exactly one active truck matches.
    let candidates = entries.filter(([key]) => key === typedKey);
    if (!candidates.length) {
      candidates = entries.filter(([key, record]) => {
        const normalizedFull = normalizePlate(record?.plateNumber || key);
        return normalizedFull.endsWith(typedKey);
      });
    }

    if (!candidates.length) {
      clearMatchedRecord(false);
      $("plateLookupStatus").textContent = "Not yet IN";
      $("plateLookupStatus").className = "lookup-status not-found";
      showYardAlert("outYardAlert", "THIS TRUCK IS NOT YET IN. No active IN record was found, so OUT cannot be recorded.", "danger");
      return;
    }

    if (candidates.length > 1) {
      clearMatchedRecord(false);
      $("plateLookupStatus").textContent = "Multiple matches";
      $("plateLookupStatus").className = "lookup-status not-found";
      showYardAlert("outYardAlert", "MULTIPLE ACTIVE TRUCKS MATCH. Type more plate characters to identify the correct truck.", "warning");
      showToast("More than one active plate matches those last digits. Type more plate characters.", "error");
      return;
    }

    const [activeKey, active] = candidates[0];
    if (!active?.movementId) {
      clearMatchedRecord(false);
      $("plateLookupStatus").textContent = "Not yet IN";
      $("plateLookupStatus").className = "lookup-status not-found";
      showYardAlert("outYardAlert", "THIS TRUCK IS NOT YET IN. No active IN record was found, so OUT cannot be recorded.", "danger");
      return;
    }

    const movement = await request(`movements/${active.movementId}`);

    if (!movement || movement.status !== "OPEN") {
      clearMatchedRecord(false);
      $("plateLookupStatus").textContent = "Not yet IN";
      $("plateLookupStatus").className = "lookup-status not-found";
      showYardAlert("outYardAlert", "THIS TRUCK IS NOT YET IN. No active IN record was found, so OUT cannot be recorded.", "danger");
      return;
    }

    state.matchedMovementId = active.movementId;
    state.matchedActiveKey = activeKey;
    state.matchedRecord = movement;

    // Replace a last-4 lookup with the saved complete plate number.
    $("outPlate").value = movement.plateNumber || active.plateNumber || activeKey;
    $("matchedPlate").textContent = movement.plateNumber || active.plateNumber || activeKey;
    $("matchedTrucking").textContent = movement.trucking || active.trucking || "—";
    $("matchedTimeIn").textContent = formatDateTime(movement.timeIn);
    if (movement.passThrough === true || active.passThrough === true) {
      $("matchedPassThroughWrap").classList.remove("hidden");
      $("matchedPassThrough").textContent = "PASS THROUGH";
    } else {
      $("matchedPassThroughWrap").classList.add("hidden");
    }
    $("matchedCard").classList.remove("hidden");
    $("saveOutBtn").disabled = false;

    $("plateLookupStatus").textContent = "Ready for OUT";
    $("plateLookupStatus").className = "lookup-status found";
    showYardAlert(
      "outYardAlert",
      movement.passThrough === true || active.passThrough === true
        ? "PASS THROUGH TRUCK • ACTIVE IN FOUND • CLEARED FOR OUT"
        : "ACTIVE IN FOUND • TRUCK CLEARED FOR OUT",
      "success"
    );
    setDbStatus("Firebase Connected", true);
  } catch (error) {
    console.error(error);
    clearMatchedRecord(false);
    $("plateLookupStatus").textContent = "Lookup error";
    $("plateLookupStatus").className = "lookup-status not-found";
    setDbStatus("Firebase Error", false);
  }
}

function clearMatchedRecord(resetStatus = true) {
  state.matchedMovementId = null;
  state.matchedActiveKey = null;
  state.matchedRecord = null;

  $("matchedPlate").textContent = "—";
  $("matchedTrucking").textContent = "—";
  $("matchedTimeIn").textContent = "—";
  $("matchedPassThrough").textContent = "PASS THROUGH";
  $("matchedPassThroughWrap").classList.add("hidden");
  $("matchedCard").classList.add("hidden");
  $("saveOutBtn").disabled = true;

  if (resetStatus) {
    $("plateLookupStatus").textContent = "Waiting";
    $("plateLookupStatus").className = "lookup-status";
    showYardAlert("outYardAlert", "");
  }
}

$("outForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!state.matchedMovementId || !state.matchedRecord) {
    showToast("No active IN record found for this plate.", "error");
    return;
  }

  const typedPlateKey = normalizePlate($("outPlate").value);
  if (typedPlateKey !== state.matchedActiveKey) {
    showToast("Plate number changed. Please wait for lookup.", "error");
    return;
  }

  const outBare = document.querySelector('input[name="outBare"]:checked').value === "yes";
  const outContainerNumber = outBare ? "" : cleanText($("outContainer").value);
  const nowIso = new Date().toISOString();

  const saveBtn = $("saveOutBtn");
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";

  try {
    await request(`movements/${state.matchedMovementId}`, {
      method: "PATCH",
      body: JSON.stringify({
        outBare,
        outContainerNumber,
        timeOut: nowIso,
        timeOutEpoch: Date.now(),
        status: "CLOSED",
        updatedAt: nowIso,
      }),
    });

    const inDateKey = dateKeyFromIso(state.matchedRecord.timeIn);
    await request(`daily_movements/${inDateKey}/${state.matchedMovementId}`, {
      method: "PATCH",
      body: JSON.stringify({
        outBare,
        outContainerNumber,
        timeOut: nowIso,
        timeOutEpoch: Date.now(),
        status: "CLOSED",
        updatedAt: nowIso,
      }),
    });

    await request(`active_trucks/${state.matchedActiveKey}`, {
      method: "DELETE",
    });

    const plate = state.matchedRecord.plateNumber;
    $("outForm").reset();
    clearMatchedRecord();

    setDbStatus("Firebase Connected", true);
    showToast(`Truck OUT saved: ${plate}`);
  } catch (error) {
    console.error(error);
    setDbStatus("Firebase Error", false);
    showToast(error.message || "Unable to save Truck OUT.", "error");
  } finally {
    saveBtn.textContent = "Save Truck OUT";
    if (state.matchedMovementId) {
      saveBtn.disabled = false;
    }
  }
});

$("refreshHistoryBtn").addEventListener("click", () => loadHistory());
$("historyDate").addEventListener("change", () => {
  $("historyPlateSearch").value = "";
  loadHistory();
});
$("todayHistoryBtn").addEventListener("click", () => {
  $("historyDate").value = localDateKey();
  $("historyPlateSearch").value = "";
  loadHistory();
});
$("historyPlateSearch").addEventListener("input", () => renderHistory());

function loadLabel(bare, container) {
  if (bare === true) return "BARE";
  if (bare === false) return container || "WITH CONTAINER";
  return "—";
}

function movementLabel(record) {
  return record.passThrough === true ? "PASS THROUGH" : "REGULAR";
}

function renderHistory() {
  const body = $("historyBody");
  const selectedDate = $("historyDate").value || localDateKey();
  const query = normalizePlate($("historyPlateSearch").value || "");
  const records = state.historyRecords.filter((r) => {
    if (!query) return true;
    return normalizePlate(r.plateNumber || r.plateKey || "").includes(query);
  });

  const dailyTotal = state.historyRecords.length;
  const filteredCount = records.length;
  $("totalCount").textContent = query ? `${filteredCount}/${dailyTotal}` : dailyTotal;
  $("completedCount").textContent = records.filter((r) => r.status === "CLOSED").length;

  $("historyDateNote").textContent = query
    ? `Showing ${filteredCount} matching truck${filteredCount === 1 ? "" : "s"} for ${formatHistoryDate(selectedDate)}.`
    : `Showing movements for ${formatHistoryDate(selectedDate)} only.`;

  if (!records.length) {
    body.innerHTML = query
      ? `<tr><td colspan="9" class="empty-row">No plate number matching “${escapeHtml($("historyPlateSearch").value.trim())}” for ${escapeHtml(formatHistoryDate(selectedDate))}.</td></tr>`
      : `<tr><td colspan="9" class="empty-row">No truck movements for ${escapeHtml(formatHistoryDate(selectedDate))}.</td></tr>`;
    return;
  }

  body.innerHTML = records.map((r) => `
    <tr class="${r.passThrough === true ? "pass-through-row" : ""}">
      <td>
        <span class="status-pill ${r.status === "CLOSED" ? "status-closed" : "status-open"}">
          ${r.status === "CLOSED" ? "OUT" : "INSIDE"}
        </span>
      </td>
      <td>
        <span class="movement-pill ${r.passThrough === true ? "movement-pass-through" : "movement-regular"}">
          ${escapeHtml(movementLabel(r))}
        </span>
      </td>
      <td>${escapeHtml(r.trucking || "—")}</td>
      <td><strong>${escapeHtml(r.plateNumber || "—")}</strong></td>
      <td>${escapeHtml(loadLabel(r.inBare, r.inContainerNumber))}</td>
      <td>${escapeHtml(formatDateTime(r.timeIn))}</td>
      <td>${escapeHtml(loadLabel(r.outBare, r.outContainerNumber))}</td>
      <td>${escapeHtml(formatDateTime(r.timeOut))}</td>
      <td><strong>${escapeHtml(formatInterval(r.timeIn, r.timeOut))}</strong></td>
    </tr>
  `).join("");
}

async function loadHistory() {
  const body = $("historyBody");
  const selectedDate = $("historyDate").value || localDateKey();
  $("historyDate").value = selectedDate;
  $("historyDateNote").textContent = `Loading ${formatHistoryDate(selectedDate)}...`;
  body.innerHTML = `<tr><td colspan="9" class="empty-row">Loading selected date...</td></tr>`;

  try {
    const [movements, active] = await Promise.all([
      requestDailyMovements(selectedDate),
      request("active_trucks"),
    ]);

    state.historyRecords = movements
      ? Object.entries(movements).map(([id, record]) => ({ id, ...record }))
      : [];

    state.historyRecords.sort((a, b) => (b.timeInEpoch || 0) - (a.timeInEpoch || 0));

    $("activeCount").textContent = active ? Object.keys(active).length : 0;
    renderHistory();
    setDbStatus("Firebase Connected", true);
  } catch (error) {
    console.error(error);
    state.historyRecords = [];
    body.innerHTML = `<tr><td colspan="9" class="empty-row">Unable to load selected date. Please check Firebase connection/rules.</td></tr>`;
    $("totalCount").textContent = 0;
    $("completedCount").textContent = 0;
    setDbStatus("Firebase Error", false);
    showToast("History load failed. Please check Firebase connection/rules.", "error");
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

$("historyDate").value = localDateKey();

toggleContainerInput("inBare", "inContainerWrap", "inContainer");
toggleContainerInput("outBare", "outContainerWrap", "outContainer");
