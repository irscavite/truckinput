const FIREBASE_BASE_URL = "https://truckmonitoring-bffa5-default-rtdb.asia-southeast1.firebasedatabase.app";

const $ = (id) => document.getElementById(id);

const state = {
  matchedMovementId: null,
  matchedActiveKey: null,
  matchedRecord: null,
  correctionCandidates: [],
  correctionSelected: null,
  correctionTargetKey: null,
  historyRecords: [],
  employeeAttendance: {},
};

// Ignore stale attendance loads when quickly switching between selected dates.
let employeeLoadToken = 0;


const EMPLOYEES = [
  {
    "id": "E001",
    "name": "ADRIAN FRANCISCO ROSEL"
  },
  {
    "id": "E002",
    "name": "JAYPEE LOPEZ"
  },
  {
    "id": "E003",
    "name": "LAURENCE REYES"
  },
  {
    "id": "E004",
    "name": "TRIXIELILY JALOG"
  },
  {
    "id": "E005",
    "name": "JOHN CHRISTIAN ARCENA"
  },
  {
    "id": "E006",
    "name": "CASABUENA, CARL JOHN SILOT"
  },
  {
    "id": "E007",
    "name": "TORRES, DAVE KENNETH"
  },
  {
    "id": "E008",
    "name": "LUIS PATRICK ESPINO"
  },
  {
    "id": "E009",
    "name": "KEVIN KLEIN GANADOS"
  },
  {
    "id": "E010",
    "name": "CORTISTA, JOHN PAUL"
  },
  {
    "id": "E011",
    "name": "CARBA, KURT ADLAN"
  },
  {
    "id": "E012",
    "name": "NORBERTO LASAGAS"
  },
  {
    "id": "E013",
    "name": "JOSE RIZAL MANGAHAS"
  },
  {
    "id": "E014",
    "name": "ANECITO CASAS"
  },
  {
    "id": "E015",
    "name": "SONNY BARTE"
  },
  {
    "id": "E016",
    "name": "REYNOLD TOLENTINAS"
  },
  {
    "id": "E017",
    "name": "RAMIL CABORNAY"
  },
  {
    "id": "E018",
    "name": "JOSE RODRIGUEZ"
  },
  {
    "id": "E019",
    "name": "RONIE BERDEN"
  },
  {
    "id": "E020",
    "name": "NECTOR NAPIRI"
  },
  {
    "id": "E021",
    "name": "CHRISTOPHER BERNAL"
  },
  {
    "id": "E022",
    "name": "TOMARONG, JOHN ARCEL"
  },
  {
    "id": "E023",
    "name": "VILLAS, ERMHAR"
  },
  {
    "id": "E024",
    "name": "JOHN HENRY SANTIAGO"
  },
  {
    "id": "E025",
    "name": "LOREN, BRIAN JOSEPH"
  },
  {
    "id": "E026",
    "name": "GREGORIO, ANGEL"
  },
  {
    "id": "E027",
    "name": "JOEL GENITA"
  },
  {
    "id": "E028",
    "name": "ANTONIO GARCIA"
  },
  {
    "id": "E029",
    "name": "ROY SUMBI"
  },
  {
    "id": "E030",
    "name": "CHRISTOPHER CAPOTE"
  },
  {
    "id": "E031",
    "name": "ERIC SACRO"
  },
  {
    "id": "E032",
    "name": "THOMAS FABELLO"
  },
  {
    "id": "E033",
    "name": "AQUINO, MARK CARLO"
  },
  {
    "id": "E034",
    "name": "ROLANDO LUCEÑO"
  },
  {
    "id": "E035",
    "name": "ROUIE JAY SUMBI"
  },
  {
    "id": "E036",
    "name": "RAMOS, LEONILO"
  },
  {
    "id": "E037",
    "name": "JUFER ZIPAGAN"
  },
  {
    "id": "E038",
    "name": "JENEFER ALBARADO"
  },
  {
    "id": "E039",
    "name": "GUILLERMO LUCEÑO"
  },
  {
    "id": "E040",
    "name": "PINCA, JASON"
  },
  {
    "id": "E041",
    "name": "MELCHOR LACSON JR."
  },
  {
    "id": "E042",
    "name": "PABLO LUCEÑO"
  },
  {
    "id": "E043",
    "name": "ROBERT SARSA"
  },
  {
    "id": "E044",
    "name": "GLEN LACABA"
  },
  {
    "id": "E045",
    "name": "REY REGIS"
  },
  {
    "id": "E046",
    "name": "RAFFY SALGADO"
  },
  {
    "id": "E047",
    "name": "ARJEN MATEO"
  },
  {
    "id": "E048",
    "name": "GERRY GALUPO"
  },
  {
    "id": "E049",
    "name": "EDGAR ABERILLA"
  },
  {
    "id": "E050",
    "name": "ARMIL OCOP"
  },
  {
    "id": "E051",
    "name": "RENANTE APAY"
  },
  {
    "id": "E052",
    "name": "PATRICK PANAGANIBAN"
  },
  {
    "id": "E053",
    "name": "ESTROPA, JULIUS G"
  },
  {
    "id": "E054",
    "name": "MELVIN PACUJAN"
  },
  {
    "id": "E055",
    "name": "DOMASIAN, ROGER"
  },
  {
    "id": "E056",
    "name": "JIMMY ABOBO"
  },
  {
    "id": "E057",
    "name": "BALLARAN, MARK ANTHONY"
  },
  {
    "id": "E058",
    "name": "ENCABO, JECKY"
  },
  {
    "id": "E059",
    "name": "REYES, RYAN ANTHONY"
  },
  {
    "id": "E060",
    "name": "AGGABAO, JEYWIL"
  },
  {
    "id": "E061",
    "name": "ZIPAGAN,JERICK"
  },
  {
    "id": "E062",
    "name": "CAÑALITA, JOHN MICHAEL"
  },
  {
    "id": "E063",
    "name": "SUSTAL, PAOLO RHAFAEL AMIEL"
  },
  {
    "id": "E064",
    "name": "RAANDAAN, ANTHONY"
  },
  {
    "id": "E065",
    "name": "AMAR, MARK JOSEPH ALFARO"
  },
  {
    "id": "E066",
    "name": "IGNACIO NOVELO JR."
  },
  {
    "id": "E067",
    "name": "JOHN CLAIRE BACCAY"
  },
  {
    "id": "E068",
    "name": "JOHN MARK BATOBALANI"
  },
  {
    "id": "E069",
    "name": "EDMER TUBINO"
  },
  {
    "id": "E070",
    "name": "JED PORLAJE"
  },
  {
    "id": "E071",
    "name": "RAFAEL SINFUEGO"
  },
  {
    "id": "E072",
    "name": "ADRIAN TEJADA"
  },
  {
    "id": "E073",
    "name": "SARANGILO, DANJO"
  },
  {
    "id": "E074",
    "name": "VINCENT BAKER"
  },
  {
    "id": "E075",
    "name": "LEMUEL VERALLO"
  },
  {
    "id": "E076",
    "name": "RICHARD CANEJA"
  },
  {
    "id": "E077",
    "name": "CONSTANTINO EMIT"
  },
  {
    "id": "E078",
    "name": "ADAO, MARLON JAMES"
  },
  {
    "id": "E079",
    "name": "HIPOLITO, JOEMAR"
  },
  {
    "id": "E080",
    "name": "ALMARINEZ, APOLINAR JR"
  },
  {
    "id": "E081",
    "name": "REDOBLADO, JOYADA"
  },
  {
    "id": "E082",
    "name": "JAYSON CONDES"
  },
  {
    "id": "E083",
    "name": "MONES, ERWIN"
  },
  {
    "id": "E084",
    "name": "JONATHAN BRICIO"
  },
  {
    "id": "E085",
    "name": "MARY JANE DAYTO"
  },
  {
    "id": "E086",
    "name": "JODYVIL DAMAYO"
  },
  {
    "id": "E087",
    "name": "HYACINTH MARANAN"
  },
  {
    "id": "E088",
    "name": "MACKIE ALLEN LACANG"
  },
  {
    "id": "E089",
    "name": "NOELITO LORENZO"
  },
  {
    "id": "E090",
    "name": "SAN PEDRO, EUGENE"
  },
  {
    "id": "E091",
    "name": "NERVIOL, WYRON MAICKOH"
  },
  {
    "id": "E092",
    "name": "PERALTA, JEFFERSON"
  },
  {
    "id": "E093",
    "name": "LOREN. JOHN ALVIN"
  },
  {
    "id": "E094",
    "name": "SAM TESSA ROSE MAMIIT"
  },
  {
    "id": "E095",
    "name": "SHEILA MAE EDIO"
  },
  {
    "id": "E096",
    "name": "MA. VICTORIA JOVEN"
  },
  {
    "id": "E097",
    "name": "JOCELYN BALINGCONGAN"
  },
  {
    "id": "E098",
    "name": "ELLAMAE MIRABALLES"
  },
  {
    "id": "E099",
    "name": "DASIG, JERRY BOY JR."
  },
  {
    "id": "E100",
    "name": "SOROSORO, ROBERT"
  }
];

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
      employeeView: "Employee IN / OUT",
      historyView: "Active Trucks",
    };
    $("pageTitle").textContent = titleMap[btn.dataset.view];

    if (btn.dataset.view === "employeeView") {
      loadEmployeeAttendance();
    }

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
  radio.addEventListener("change", () => {
    toggleContainerInput("inBare", "inContainerWrap", "inContainer");
  });
});

document.querySelectorAll('input[name="outBare"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    toggleContainerInput("outBare", "outContainerWrap", "outContainer");
  });
});

$("outForm").addEventListener("reset", () => {
  setTimeout(() => {
    toggleContainerInput("outBare", "outContainerWrap", "outContainer");
    clearTimeout(lookupTimer);
    outLookupToken++;
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

  if (!truckPhotos.in1 && !truckPhotos.in2) { showToast("At least one Truck IN photo is required before submitting.", "error"); return; }

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
      inPhoto: truckPhotos.in1,
      inPhoto2: truckPhotos.in2,
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
        timeInEpoch: movement.timeInEpoch,
        inBare,
        inContainerNumber,
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

    invalidateActiveTruckCache();
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

// Lightweight active index: never fetch Movement History just to find a wrong plate.
// A short cache avoids repeated /active_trucks downloads while typing.
const activeTruckCache = { records: null, timestamp: 0, pending: null };
function invalidateActiveTruckCache() {
  activeTruckCache.records = null;
  activeTruckCache.timestamp = 0;
}
async function getActiveTruckIndex(force = false) {
  if (!force && activeTruckCache.records && Date.now() - activeTruckCache.timestamp < 15000) {
    return activeTruckCache.records;
  }
  if (!force && activeTruckCache.pending) return activeTruckCache.pending;
  const current = request("active_trucks").then((data) => {
    activeTruckCache.records = data || {};
    activeTruckCache.timestamp = Date.now();
    return activeTruckCache.records;
  });
  activeTruckCache.pending = current;
  try { return await current; }
  finally { if (activeTruckCache.pending === current) activeTruckCache.pending = null; }
}

// Optimal string alignment edit distance: one mistyped character or switched letters
// should rank more highly than unrelated plates. Suggestions are NEVER auto-selected.
function plateEditDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }
  return dp[a.length][b.length];
}

function getSimilarActivePlates(typedKey, activeTrucks, showAll = false) {
  const maxDifference = typedKey.length >= 6 ? 2 : 1;
  return Object.entries(activeTrucks || {})
    .filter(([, active]) => Boolean(active?.movementId))
    .map(([key, active]) => {
      const fullKey = normalizePlate(active.plateNumber || key);
      const distance = plateEditDistance(typedKey, fullKey);
      return { key, active, fullKey, distance };
    })
    .filter((item) => showAll || (typedKey.length >= 5 && item.distance <= maxDifference && item.distance > 0))
    .sort((a, b) => a.distance - b.distance || (b.active.timeIn || "").localeCompare(a.active.timeIn || ""))
    .slice(0, showAll ? 30 : 5);
}

let lookupTimer = null;
let outLookupToken = 0;
let correctionBusy = false;

function hidePlateCorrection() {
  state.correctionCandidates = [];
  state.correctionSelected = null;
  state.correctionTargetKey = null;
  $("similarPlatePanel").classList.add("hidden");
  $("plateCorrectionBox").classList.add("hidden");
  $("similarPlateList").innerHTML = "";
  $("plateCorrectionOperator").value = "";
  $("plateCorrectionReason").value = "";
}

function renderSimilarPlates(typedKey, activeTrucks, showAll = false) {
  state.correctionTargetKey = typedKey;
  state.correctionSelected = null;
  const candidates = getSimilarActivePlates(typedKey, activeTrucks, showAll);
  state.correctionCandidates = candidates;
  $("similarPlatePanel").classList.remove("hidden");
  $("plateCorrectionBox").classList.add("hidden");
  $("similarPlateTitle").textContent = showAll ? "Active IN records — choose carefully" : "Possible plate typos (active IN only)";
  $("similarPlateHint").textContent = showAll
    ? "Showing up to 30 active trucks nearest your search. Only choose the actual truck."
    : "These are suggestions, not verified matches. Compare the plate, trucking and original IN time before correcting.";
  $("similarPlateList").innerHTML = candidates.length
    ? candidates.map((item, i) => `
      <button type="button" class="similar-plate-option" data-candidate-index="${i}">
        <span class="similar-plate-main"><strong>${escapeHtml(item.active.plateNumber || item.key)}</strong>
          <span class="similar-plate-tag">${escapeHtml(item.distance === 1 ? "Very close" : `Difference: ${item.distance}`)}</span></span>
        <span class="similar-plate-meta">${escapeHtml(item.active.trucking || "Unknown trucking")} • IN: ${escapeHtml(formatDateTime(item.active.timeIn))}</span>
      </button>
    `).join("")
    : `<div class="similar-plate-empty">No close plate matches. You can search the active IN list manually.</div>`;
  $("showAllActiveBtn").classList.toggle("hidden", showAll);
}

$("outPlate").addEventListener("input", () => {
  clearTimeout(lookupTimer);
  outLookupToken++;
  const plate = $("outPlate").value;
  clearMatchedRecord(false);
  hidePlateCorrection();
  showYardAlert("outYardAlert", "");

  if (normalizePlate(plate).length < 4) {
    $("plateLookupStatus").textContent = "Waiting";
    $("plateLookupStatus").className = "lookup-status";
    return;
  }

  $("plateLookupStatus").textContent = "Searching...";
  $("plateLookupStatus").className = "lookup-status";
  const token = outLookupToken;
  lookupTimer = setTimeout(() => lookupActivePlate(plate, token), 350);
});

async function lookupActivePlate(plateValue, token = outLookupToken) {
  const typedKey = normalizePlate(plateValue);
  if (!typedKey || typedKey.length < 4) return;

  try {
    // Exact lookup is a single lightweight key fetch, not a full history request.
    const exact = await request(`active_trucks/${typedKey}`);
    if (token !== outLookupToken || normalizePlate($("outPlate").value) !== typedKey) return;
    let candidates = exact?.movementId ? [[typedKey, exact]] : [];
    let activeTrucks = null;
    if (!candidates.length) {
      activeTrucks = await getActiveTruckIndex();
      if (token !== outLookupToken || normalizePlate($("outPlate").value) !== typedKey) return;
      // Preserve original last-four lookup behavior.
      candidates = Object.entries(activeTrucks).filter(([key, active]) =>
        Boolean(active?.movementId) && normalizePlate(active.plateNumber || key).endsWith(typedKey)
      );
    }

    if (!candidates.length) {
      clearMatchedRecord(false);
      $("plateLookupStatus").textContent = "No exact IN";
      $("plateLookupStatus").className = "lookup-status not-found";
      showYardAlert("outYardAlert", "NO EXACT ACTIVE IN FOUND. Verify suggested plates before correcting; do not create a duplicate IN.", "warning");
      renderSimilarPlates(typedKey, activeTrucks || {}, false);
      return;
    }

    if (candidates.length > 1) {
      clearMatchedRecord(false);
      $("plateLookupStatus").textContent = "Multiple matches";
      $("plateLookupStatus").className = "lookup-status not-found";
      showYardAlert("outYardAlert", "MULTIPLE ACTIVE TRUCKS MATCH. Enter more plate characters before OUT.", "warning");
      return;
    }

    const [activeKey, active] = candidates[0];
    const movement = await request(`movements/${active.movementId}`);
    if (token !== outLookupToken || normalizePlate($("outPlate").value) !== typedKey) return;

    if (!movement || movement.status !== "OPEN" || normalizePlate(movement.plateNumber || movement.plateKey || activeKey) !== normalizePlate(activeKey)) {
      clearMatchedRecord(false);
      $("plateLookupStatus").textContent = "Record needs review";
      $("plateLookupStatus").className = "lookup-status not-found";
      showYardAlert("outYardAlert", "Active index and movement do not agree. Ask the supervisor to check the record.", "danger");
      return;
    }

    setMatchedActiveTruck(activeKey, active.movementId, movement, active);
  } catch (error) {
    if (token !== outLookupToken) return;
    console.error(error);
    clearMatchedRecord(false);
    $("plateLookupStatus").textContent = "Lookup error";
    $("plateLookupStatus").className = "lookup-status not-found";
    showYardAlert("outYardAlert", "Unable to check Firebase. Do not proceed with OUT until the lookup succeeds.", "danger");
    setDbStatus("Firebase Error", false);
  }
}

function setMatchedActiveTruck(activeKey, movementId, movement, active) {
  hidePlateCorrection();
  state.matchedMovementId = movementId;
  state.matchedActiveKey = activeKey;
  state.matchedRecord = movement;
  $("outPlate").value = movement.plateNumber || active.plateNumber || activeKey;
  $("matchedPlate").textContent = movement.plateNumber || active.plateNumber || activeKey;
  $("matchedTrucking").textContent = movement.trucking || active.trucking || "—";
  $("matchedTimeIn").textContent = formatDateTime(movement.timeIn);
  $("matchedPassThroughWrap").classList.toggle("hidden", !(movement.passThrough === true || active.passThrough === true));
  $("matchedCard").classList.remove("hidden");
  $("saveOutBtn").disabled = false;
  $("plateLookupStatus").textContent = "Ready for OUT";
  $("plateLookupStatus").className = "lookup-status found";
  showYardAlert("outYardAlert", movement.passThrough || active.passThrough
    ? "PASS THROUGH • ACTIVE IN FOUND • READY FOR OUT" : "ACTIVE IN FOUND • READY FOR OUT", "success");
  setDbStatus("Firebase Connected", true);
}

$("similarPlateList").addEventListener("click", async (event) => {
  const choice = event.target.closest("[data-candidate-index]");
  if (!choice || correctionBusy) return;
  const index = Number(choice.dataset.candidateIndex);
  const selected = state.correctionCandidates[index];
  if (!selected) return;
  const targetKey = state.correctionTargetKey;
  if (normalizePlate($("outPlate").value) !== targetKey) return;
  try {
    const [latestActive, movement] = await Promise.all([
      request(`active_trucks/${selected.key}`),
      request(`movements/${selected.active.movementId}`),
    ]);
    if (normalizePlate($("outPlate").value) !== targetKey) return;
    if (!latestActive || latestActive.movementId !== selected.active.movementId || !movement || movement.status !== "OPEN") {
      throw new Error("That IN has changed. Search again before correcting.");
    }
    state.correctionSelected = { key: selected.key, active: latestActive, movement };
    $("correctionOldPlate").textContent = movement.plateNumber || latestActive.plateNumber || selected.key;
    $("correctionTimeIn").textContent = formatDateTime(movement.timeIn);
    $("correctionTrucking").textContent = movement.trucking || latestActive.trucking || "—";
    $("correctPlateInput").value = $("outPlate").value.toUpperCase().trim();
    $("plateCorrectionBox").classList.remove("hidden");
    $("plateCorrectionBox").scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (error) {
    console.error(error);
    showToast(error.message || "Unable to open selected IN.", "error");
  }
});

$("showAllActiveBtn").addEventListener("click", async () => {
  const targetKey = state.correctionTargetKey;
  if (!targetKey) return;
  try {
    const all = await getActiveTruckIndex(true);
    if (normalizePlate($("outPlate").value) !== targetKey) return;
    renderSimilarPlates(targetKey, all, true);
  } catch (error) {
    showToast("Unable to load active IN records.", "error");
  }
});

$("cancelCorrectionBtn").addEventListener("click", () => {
  state.correctionSelected = null;
  $("plateCorrectionBox").classList.add("hidden");
});

$("applyCorrectionBtn").addEventListener("click", async () => {
  if (correctionBusy || !state.correctionSelected) return;
  const { key: oldKey, active: selectedActive, movement: selectedMovement } = state.correctionSelected;
  const currentInputKey = normalizePlate($("outPlate").value);
  const correctedPlate = cleanText($("correctPlateInput").value);
  const newKey = normalizePlate(correctedPlate);
  const operator = $("plateCorrectionOperator").value.trim();
  const reason = $("plateCorrectionReason").value.trim();
  if (currentInputKey !== state.correctionTargetKey) {
    showToast("Search plate changed. Please search again.", "error"); return;
  }
  if (newKey.length < 5 || !/[A-Z]/.test(newKey) || !/[0-9]/.test(newKey)) {
    showToast("Enter the COMPLETE correct plate (letters and numbers), not just the last four digits.", "error"); return;
  }
  if (newKey === normalizePlate(oldKey)) {
    showToast("This is already the saved plate number.", "error"); return;
  }
  if (!operator || reason.length < 5) {
    showToast("Enter your name and a correction reason (at least 5 characters).", "error"); return;
  }
  const oldPlate = selectedMovement.plateNumber || selectedActive.plateNumber || oldKey;
  if (!window.confirm(`CORRECT TRUCK IN?\n\nSaved plate: ${oldPlate}\nCorrect plate: ${correctedPlate}\nTrucking: ${selectedMovement.trucking || selectedActive.trucking || "—"}\nTime IN: ${formatDateTime(selectedMovement.timeIn)}\n\nConfirm you checked this is the SAME truck. This will update Firebase IN/active/history records, without changing original photos or timestamp.`)) return;

  const btn = $("applyCorrectionBtn");
  correctionBusy = true;
  btn.disabled = true;
  btn.textContent = "Correcting IN...";
  try {
    // Fresh checks reduce stale-record conflicts. For strict concurrency or role
    // enforcement, an authenticated server / Cloud Function is required.
    const movementId = selectedActive.movementId;
    const [freshOldActive, newActive, freshMovement] = await Promise.all([
      request(`active_trucks/${oldKey}`),
      request(`active_trucks/${newKey}`),
      request(`movements/${movementId}`),
    ]);
    if (!freshOldActive || freshOldActive.movementId !== movementId || !freshMovement || freshMovement.status !== "OPEN") {
      throw new Error("This truck's IN record changed. Refresh the search before correcting.");
    }
    if (newActive) throw new Error("That correct plate already has an active IN. Correction stopped to prevent duplicates.");
    if (normalizePlate(freshMovement.plateNumber || freshMovement.plateKey || oldKey) !== normalizePlate(oldKey)) {
      throw new Error("The original IN plate was changed by someone else. Please search again.");
    }
    const now = new Date().toISOString();
    const dateKey = dateKeyFromIso(freshMovement.timeIn);
    const originalDailyRecord = await request(`daily_movements/${dateKey}/${movementId}`);
    if (normalizePlate($("outPlate").value) !== currentInputKey ||
        state.correctionTargetKey !== currentInputKey ||
        state.correctionSelected?.active?.movementId !== movementId) {
      throw new Error("Search changed while checking the record. Start the correction again.");
    }
    const auditId = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const corrections = {
      [`movements/${movementId}/plateNumber`]: correctedPlate,
      [`movements/${movementId}/plateKey`]: newKey,
      [`movements/${movementId}/plateCorrectedAt`]: now,
      [`active_trucks/${oldKey}`]: null,
      [`active_trucks/${newKey}`]: {
        ...freshOldActive,
        plateNumber: correctedPlate,
        trucking: freshMovement.trucking || freshOldActive.trucking,
        timeIn: freshMovement.timeIn,
        timeInEpoch: freshMovement.timeInEpoch || new Date(freshMovement.timeIn).getTime(),
        passThrough: freshMovement.passThrough === true,
        inBare: freshMovement.inBare,
        inContainerNumber: freshMovement.inContainerNumber || "",
      },
      [`truck_registry/${newKey}/plateKey`]: newKey,
      [`truck_registry/${newKey}/plateNumber`]: correctedPlate,
      [`truck_registry/${newKey}/trucking`]: freshMovement.trucking || freshOldActive.trucking || "",
      [`truck_registry/${newKey}/lastTimeIn`]: freshMovement.timeIn,
      [`truck_registry/${newKey}/updatedAt`]: now,
      [`plate_corrections/${movementId}/${auditId}`]: {
        movementId, oldPlate, oldPlateKey: oldKey, correctedPlate, newPlateKey: newKey,
        trucking: freshMovement.trucking || "", timeIn: freshMovement.timeIn,
        correctedAt: now, operatorName: operator, reason,
      },
    };
    if (originalDailyRecord) {
      corrections[`daily_movements/${dateKey}/${movementId}/plateNumber`] = correctedPlate;
      corrections[`daily_movements/${dateKey}/${movementId}/plateKey`] = newKey;
      corrections[`daily_movements/${dateKey}/${movementId}/plateCorrectedAt`] = now;
    } else {
      // Older IN records may predate daily history. Mirror the complete original
      // record instead of accidentally creating a partial, misleading history row.
      corrections[`daily_movements/${dateKey}/${movementId}`] = {
        ...freshMovement, plateNumber: correctedPlate, plateKey: newKey, plateCorrectedAt: now,
      };
    }
    // A root multi-location PATCH is all-or-nothing at Firebase RTDB; original
    // IN photos, timeIn, and movement ID are not overwritten.
    await request("", { method: "PATCH", body: JSON.stringify(corrections) });
    invalidateActiveTruckCache();
    outLookupToken++;
    setMatchedActiveTruck(newKey, movementId, {
      ...freshMovement, plateNumber: correctedPlate, plateKey: newKey, plateCorrectedAt: now,
    }, { ...freshOldActive, plateNumber: correctedPlate });
    showToast(`IN corrected: ${oldPlate} → ${correctedPlate}. You can now process OUT.`);
  } catch (error) {
    console.error(error);
    showToast(error.message || "IN correction failed. No OUT was submitted.", "error");
    setDbStatus("Firebase Error", false);
  } finally {
    correctionBusy = false;
    btn.disabled = false;
    btn.textContent = "Correct IN & Continue OUT";
  }
});

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
    hidePlateCorrection();
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

  if (!truckPhotos.out1 && !truckPhotos.out2) { showToast("At least one Truck OUT photo is required before submitting.", "error"); return; }

  const saveBtn = $("saveOutBtn");
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";

  try {
    const movementId = state.matchedMovementId;
    const activeKey = state.matchedActiveKey;
    const [currentActive, currentMovement] = await Promise.all([
      request(`active_trucks/${activeKey}`),
      request(`movements/${movementId}`),
    ]);
    if (!currentActive || currentActive.movementId !== movementId ||
        !currentMovement || currentMovement.status !== "OPEN" ||
        normalizePlate(currentMovement.plateNumber || currentMovement.plateKey || "") !== activeKey) {
      clearMatchedRecord();
      throw new Error("IN record changed or was already OUT. Search the plate again.");
    }

    const outFields = {
      outBare, outContainerNumber,
      outPhoto: truckPhotos.out1, outPhoto2: truckPhotos.out2,
      timeOut: nowIso, timeOutEpoch: Date.now(),
      status: "CLOSED", updatedAt: nowIso,
    };
    const inDateKey = dateKeyFromIso(currentMovement.timeIn);
    const changes = { [`active_trucks/${activeKey}`]: null };
    for (const [field, value] of Object.entries(outFields)) {
      changes[`movements/${movementId}/${field}`] = value;
      changes[`daily_movements/${inDateKey}/${movementId}/${field}`] = value;
    }
    await request("", { method: "PATCH", body: JSON.stringify(changes) });
    invalidateActiveTruckCache();

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


function employeeRecordPath(dateKey, employeeId) {
  return `employee_attendance/${dateKey}/${employeeId}`;
}

function employeeStatus(record) {
  if (!record?.timeIn) return "NOT IN";
  if (record?.timeOut) return "OUT";
  return "IN";
}

function renderEmployeeAttendance() {
  const container = $("employeeList");
  if (!container) return;

  const selectedDate = $("employeeDate").value || localDateKey();
  const query = ($("employeeSearch").value || "").trim().toUpperCase();
  const filtered = EMPLOYEES.filter((employee) =>
    !query || employee.name.toUpperCase().includes(query)
  );

  // Each selected date has its own IN/OUT state. An incomplete IN is always
  // eligible for OUT on that same date, even after midnight or several days.
  const allRecords = EMPLOYEES.map((employee) => state.employeeAttendance[employee.id] || null);
  $("employeeTotalCount").textContent = EMPLOYEES.length;
  $("employeeInCount").textContent = allRecords.filter((record) => record?.timeIn && !record?.timeOut).length;
  $("employeeOutCount").textContent = allRecords.filter((record) => record?.timeOut).length;

  $("employeeDateNote").textContent = `Viewing ${formatHistoryDate(selectedDate)}. Each date has its own IN/OUT. An unfinished OUT remains available on its original date, even after midnight.`;

  if (!filtered.length) {
    container.innerHTML = `<div class="employee-loading">No employee matched “${escapeHtml($("employeeSearch").value.trim())}”.</div>`;
    return;
  }

  container.innerHTML = filtered.map((employee) => {
    const record = state.employeeAttendance[employee.id] || null;
    const status = employeeStatus(record);

    let action = "";
    if (!record?.timeIn) {
      action = `<button class="employee-action employee-in-btn" data-employee-action="in" data-employee-id="${employee.id}">IN</button>`;
    } else if (!record?.timeOut) {
      action = `<button class="employee-action employee-out-btn" data-employee-action="out" data-employee-id="${employee.id}">OUT</button>`;
    } else {
      action = `<span class="employee-done">DONE</span>`;
    }

    return `
      <div class="employee-row">
        <div class="employee-identity">
          <div class="employee-avatar">${escapeHtml(employee.name.charAt(0))}</div>
          <div>
            <strong>${escapeHtml(employee.name)}</strong>
            <span class="employee-status status-${status.toLowerCase().replaceAll(" ", "-")}">${status}</span>
          </div>
        </div>
        <div class="employee-time">
          <span>IN</span>
          <strong>${escapeHtml(formatDateTime(record?.timeIn))}</strong>
        </div>
        <div class="employee-time">
          <span>OUT</span>
          <strong>${escapeHtml(formatDateTime(record?.timeOut))}</strong>
        </div>
        <div class="employee-action-wrap">${action}</div>
      </div>
    `;
  }).join("");
}

async function loadEmployeeAttendance() {
  const selectedDate = $("employeeDate").value || localDateKey();
  const token = ++employeeLoadToken;
  $("employeeDate").value = selectedDate;
  $("employeeList").innerHTML = `<div class="employee-loading">Loading employee attendance...</div>`;

  try {
    // Load only the selected date. Never carry unfinished shifts into another date.
    const records = await request(`employee_attendance/${selectedDate}`);
    if (token !== employeeLoadToken || $("employeeDate").value !== selectedDate) return;
    state.employeeAttendance = records || {};
    renderEmployeeAttendance();
    setDbStatus("Firebase Connected", true);
  } catch (error) {
    if (token !== employeeLoadToken || $("employeeDate").value !== selectedDate) return;
    console.error("Employee attendance load failed:", error);
    state.employeeAttendance = {};
    $("employeeList").innerHTML = `<div class="employee-loading">Unable to load employee attendance. Please check Firebase connection/rules.</div>`;
    setDbStatus("Firebase Error", false);
    showToast("Employee attendance load failed.", "error");
  }
}

async function saveEmployeeAction(employeeId, action, button) {
  const employee = EMPLOYEES.find((item) => item.id === employeeId);
  if (!employee || (action !== "in" && action !== "out")) return;

  const selectedDate = $("employeeDate").value || localDateKey();
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Saving...";

  try {
    // Re-read this employee's selected-date record before saving. Past dates
    // have the same buttons as Today, but a completed record must not be lost.
    const currentRecord = await request(employeeRecordPath(selectedDate, employee.id));
    if ($("employeeDate").value !== selectedDate) {
      showToast("Selected date changed. Please retry on the intended date.", "error");
      return;
    }
    if (action === "in" && currentRecord?.timeIn) {
      showToast(`${employee.name} already has an IN on ${selectedDate}.`, "error");
      await loadEmployeeAttendance();
      return;
    }
    if (action === "out" && (!currentRecord?.timeIn || currentRecord?.timeOut)) {
      showToast(`${employee.name} has no unfinished IN on ${selectedDate}.`, "error");
      await loadEmployeeAttendance();
      return;
    }

    const now = new Date();
    const nowIso = now.toISOString();
    const nowEpoch = now.getTime();

    if (action === "in") {
      const payload = {
        employeeId: employee.id,
        employeeName: employee.name,
        date: selectedDate,
        timeIn: nowIso,
        timeInEpoch: nowEpoch,
        timeOut: null,
        timeOutEpoch: null,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      await request(employeeRecordPath(selectedDate, employee.id), {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      showToast(`${employee.name} IN recorded on ${selectedDate}.`);
    } else {
      // Save actual clock time (e.g. Oct 21 at 06:00) under the selected
      // original IN date (e.g. Oct 20); do not alter the Oct 21 record.
      const patch = {
        timeOut: nowIso,
        timeOutEpoch: nowEpoch,
        updatedAt: nowIso,
      };
      await request(employeeRecordPath(selectedDate, employee.id), {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      showToast(`${employee.name} OUT recorded for ${selectedDate}.`);
    }

    setDbStatus("Firebase Connected", true);
    await loadEmployeeAttendance();
  } catch (error) {
    console.error("Employee attendance save failed:", error);
    setDbStatus("Firebase Error", false);
    showToast(error.message || "Unable to save employee attendance.", "error");
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

$("employeeList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-employee-action]");
  if (!button) return;

  saveEmployeeAction(
    button.dataset.employeeId,
    button.dataset.employeeAction,
    button
  );
});

$("refreshEmployeeBtn").addEventListener("click", () => loadEmployeeAttendance());
$("employeeDate").addEventListener("change", () => loadEmployeeAttendance());
$("employeeTodayBtn").addEventListener("click", () => {
  $("employeeDate").value = localDateKey();
  loadEmployeeAttendance();
});
$("employeeSearch").addEventListener("input", () => renderEmployeeAttendance());

$("refreshHistoryBtn").addEventListener("click", () => loadHistory());
$("historyPlateSearch").addEventListener("input", renderHistory);

function loadLabel(bare, container) {
  if (bare === true) return "BARE";
  if (bare === false) return container || "WITH CONTAINER";
  return "—";
}

function movementLabel(record) {
  return record.passThrough === true ? "PASS THROUGH" : "REGULAR";
}

// Movement History tab now shows ACTIVE/INSIDE trucks only, including trucks
// which entered on previous days. Do not download daily_movements/movements
// for this list: those records include base64 photo payloads and get very large.
function renderHistory() {
  const body = $("historyBody");
  const query = normalizePlate($("historyPlateSearch").value || "");
  const records = state.historyRecords.filter((r) =>
    !query || normalizePlate(r.plateNumber || r.plateKey || "").includes(query)
  );

  const total = state.historyRecords.length;
  $("activeCount").textContent = total;
  $("regularCount").textContent = state.historyRecords.filter((r) => r.passThrough !== true).length;
  $("passThroughCount").textContent = state.historyRecords.filter((r) => r.passThrough === true).length;
  $("historyDateNote").textContent = query
    ? `${records.length} of ${total} active trucks match your plate search. Includes all IN dates.`
    : `Showing ${total} truck${total === 1 ? "" : "s"} currently INSIDE, regardless of IN date. OUT trucks are not shown.`;

  if (!records.length) {
    body.innerHTML = query
      ? `<tr><td colspan="8" class="empty-row">No active truck matches “${escapeHtml($("historyPlateSearch").value.trim())}”.</td></tr>`
      : `<tr><td colspan="8" class="empty-row">No active trucks currently inside the yard.</td></tr>`;
    return;
  }

  body.innerHTML = records.map((r) => `
    <tr data-record-id="${escapeHtml(r.id)}" class="${r.passThrough === true ? "pass-through-row" : ""}">
      <td><span class="status-pill status-open">INSIDE</span></td>
      <td><span class="movement-pill ${r.passThrough === true ? "movement-pass-through" : "movement-regular"}">${escapeHtml(movementLabel(r))}</span></td>
      <td>${escapeHtml(r.trucking || "—")}</td>
      <td><strong>${escapeHtml(r.plateNumber || "—")}</strong></td>
      <td>${typeof r.inBare === "boolean" ? escapeHtml(loadLabel(r.inBare, r.inContainerNumber)) : '<span class="details-hint">View IN Details</span>'}</td>
      <td>${escapeHtml(formatDateTime(r.timeIn))}</td>
      <td><strong>${escapeHtml(formatInterval(r.timeIn, null))}</strong></td>
      <td><div class="photo-links"><button class="photo-view-btn" type="button" data-view-truck-photos>📷 View IN Details / Photos</button></div></td>
    </tr>
  `).join("");
}

let latestActiveHistoryRequest = 0;
async function loadHistory() {
  const token = ++latestActiveHistoryRequest;
  const body = $("historyBody");
  $("historyDateNote").textContent = "Loading active truck list...";
  body.innerHTML = `<tr><td colspan="8" class="empty-row">Loading active trucks...</td></tr>`;

  try {
    // The active_trucks index is small and has no stored photo blobs.
    // Forced refresh bypasses its 15-second OUT fuzzy-search cache.
    const active = await getActiveTruckIndex(true);
    if (token !== latestActiveHistoryRequest) return;
    state.historyRecords = Object.entries(active || {})
      .filter(([, truck]) => truck && truck.movementId)
      .map(([key, truck]) => ({
        ...truck,
        id: String(truck.movementId),
        plateKey: key,
        plateNumber: truck.plateNumber || key,
        timeIn: truck.timeIn || null,
      }))
      .sort((a, b) => (new Date(b.timeIn).getTime() || 0) - (new Date(a.timeIn).getTime() || 0));
    renderHistory();
    setDbStatus("Firebase Connected", true);
  } catch (error) {
    if (token !== latestActiveHistoryRequest) return;
    console.error(error);
    state.historyRecords = [];
    body.innerHTML = `<tr><td colspan="8" class="empty-row">Unable to load active trucks. Check the Firebase connection and rules.</td></tr>`;
    $("activeCount").textContent = 0;
    $("regularCount").textContent = 0;
    $("passThroughCount").textContent = 0;
    $("historyDateNote").textContent = "Active truck loading failed.";
    setDbStatus("Firebase Error", false);
    showToast("Unable to load active trucks.", "error");
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

$("employeeDate").value = localDateKey();

toggleContainerInput("inBare", "inContainerWrap", "inContainer");
toggleContainerInput("outBare", "outContainerWrap", "outContainer");

// Photos are compressed locally before being saved alongside the movement in Firebase RTDB.
// This avoids any separate Storage bucket or credentials. Keep each photo small to limit RTDB usage.
const truckPhotos = { in1: null, in2: null, out1: null, out2: null };
async function compressTruckPhoto(file) {
  if (!file || !file.type.startsWith("image/")) throw new Error("Select a valid image.");
  const bitmap = await new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Unable to read the image.")); };
    img.src = url;
  });
  const scale = Math.min(1, 1280 / Math.max(bitmap.naturalWidth, bitmap.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(bitmap.naturalHeight * scale));
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  let data = "";
  for (const quality of [0.72, 0.55, 0.4, 0.28]) {
    data = canvas.toDataURL("image/jpeg", quality);
    if (data.length < 190000) break;
  }
  if (data.length > 250000) throw new Error("Photo too large after compression. Try a different photo.");
  return data;
}
// Live phone camera. Uses getUserMedia over HTTPS / localhost; native file capture remains a fallback.
let cameraStream = null;
let cameraSide = null;
let cameraFacing = "environment";
let cameraRequestToken = 0;
const photoVersion = { in1: 0, in2: 0, out1: 0, out2: 0 };
function setTruckPhoto(side, data) {
  truckPhotos[side] = data;
  const preview = $(`${side}PhotoPreview`);
  preview.src = data;
  preview.classList.remove("hidden");
  $(`${side}PhotoStatus`).textContent = `Ready • approximately ${Math.round(data.length * 0.75 / 1024)} KB`;
  $(`${side}RetakeBtn`).classList.remove("hidden");
}
function resetTruckPhoto(side) {
  photoVersion[side]++;
  truckPhotos[side] = null;
  $(`${side}Photo`).value = "";
  $(`${side}PhotoPreview`).removeAttribute("src");
  $(`${side}PhotoPreview`).classList.add("hidden");
  $(`${side}PhotoStatus`).textContent = side.endsWith("1") ? "Photo 1 (at least one photo required)" : "Photo 2 optional";
  $(`${side}RetakeBtn`).classList.add("hidden");
  if (cameraSide === side) closeTruckCamera();
}
function stopCameraStream() {
  if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
  cameraStream = null;
  $("cameraVideo").srcObject = null;
}
function closeTruckCamera() {
  cameraRequestToken++;
  stopCameraStream();
  cameraSide = null;
  $("cameraDialog").classList.add("hidden");
  document.body.classList.remove("camera-open");
}
async function startTruckCamera() {
  const token = ++cameraRequestToken;
  stopCameraStream();
  const video = $("cameraVideo");
  $("cameraSnap").disabled = true;
  $("cameraMessage").textContent = "Requesting camera access...";
  if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext) {
    $("cameraMessage").textContent = "Live camera needs HTTPS (or localhost) and browser camera permission. Use the phone camera button below instead.";
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:cameraFacing},width:{ideal:1280},height:{ideal:720}}});
    if (token !== cameraRequestToken || !cameraSide) { stream.getTracks().forEach(track => track.stop()); return; }
    cameraStream = stream;
    video.srcObject = stream;
    await video.play();
    if (token !== cameraRequestToken) return;
    $("cameraSnap").disabled = false;
    $("cameraMessage").textContent = "Position the truck in the frame, then tap Capture Photo.";
  } catch (error) {
    if (token !== cameraRequestToken) return;
    $("cameraMessage").textContent = error?.name === "NotAllowedError" ? "Camera permission denied. Allow camera access in browser settings, or use the phone camera button below." : "Live camera unavailable. Use Open Phone Camera / Gallery below.";
  }
}
function openTruckCamera(side) {
  cameraSide = side;
  cameraFacing = "environment";
  $("cameraTitle").textContent = `Truck ${side.slice(0, -1).toUpperCase()} • Photo ${side.slice(-1)}`;
  $("cameraDialog").classList.remove("hidden");
  document.body.classList.add("camera-open");
  startTruckCamera();
}
for (const side of ["in1", "in2", "out1", "out2"]) {
  $(`${side}CameraBtn`).addEventListener("click", () => openTruckCamera(side));
  $(`${side}RetakeBtn`).addEventListener("click", () => openTruckCamera(side));
  $(`${side}GalleryBtn`).addEventListener("click", () => $(`${side}Photo`).click());
  $(`${side}Photo`).addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const version = ++photoVersion[side];
    truckPhotos[side] = null;
    $(`${side}PhotoStatus`).textContent = "Compressing photo...";
    try {
      const data = await compressTruckPhoto(file);
      if (version !== photoVersion[side]) return;
      setTruckPhoto(side, data);
    } catch (error) {
      if (version !== photoVersion[side]) return;
      $(`${side}PhotoStatus`).textContent = error.message;
      showToast(error.message, "error");
    } finally {
      event.target.value = "";
    }
  });

}
for (const direction of ["in", "out"]) {
  $(`${direction}Form`).addEventListener("reset", () => setTimeout(() => { resetTruckPhoto(`${direction}1`); resetTruckPhoto(`${direction}2`); }, 0));
}
$("cameraClose").addEventListener("click", closeTruckCamera);
$("cameraDialog").addEventListener("click", event => { if (event.target === $("cameraDialog")) closeTruckCamera(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && cameraSide) closeTruckCamera(); });
$("cameraSwitch").addEventListener("click", () => { if (!cameraSide) return; cameraFacing = cameraFacing === "environment" ? "user" : "environment"; startTruckCamera(); });
$("cameraFallback").addEventListener("click", () => { const side = cameraSide; closeTruckCamera(); if (side) $(`${side}Photo`).click(); });
$("cameraSnap").addEventListener("click", async () => {
  const side = cameraSide;
  const video = $("cameraVideo");
  if (!side || !cameraStream || !video.videoWidth) return;
  const version = ++photoVersion[side];
  $("cameraSnap").disabled = true;
  $("cameraMessage").textContent = "Compressing captured photo...";
  try {
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 1280 / Math.max(video.videoWidth, video.videoHeight));
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Unable to capture photo.")), "image/jpeg", 0.85));
    const data = await compressTruckPhoto(blob);
    if (version !== photoVersion[side] || cameraSide !== side) return;
    setTruckPhoto(side, data);
    closeTruckCamera();
  } catch (error) {
    $("cameraMessage").textContent = error.message;
    $("cameraSnap").disabled = false;
    showToast(error.message, "error");
  }
});
document.addEventListener("visibilitychange", () => { if (document.hidden && cameraSide) closeTruckCamera(); });
function isValidTruckPhoto(photo) {
  return typeof photo === "string" && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(photo);
}
const historyPhotoFields = [
  ["inPhoto", "IN Photo 1"], ["inPhoto2", "IN Photo 2"],
  ["outPhoto", "OUT Photo 1"], ["outPhoto2", "OUT Photo 2"]
];
function closeHistoryPhotos() {
  latestPhotoRequest++;
  $("photoDialog").classList.add("hidden");
  $("photoDialogGrid").replaceChildren();
}
let latestPhotoRequest = 0;
$("historyBody").addEventListener("click", async (event) => {
  const btn = event.target.closest("[data-view-truck-photos]");
  if (!btn) return;
  const recordId = btn.closest("tr")?.dataset?.recordId;
  const active = state.historyRecords.find((item) => String(item.id) === recordId);
  if (!active) return;

  const token = ++latestPhotoRequest;
  $("photoDialogTitle").textContent = `Truck IN Details • ${active.plateNumber || "Unknown Plate"}`;
  $("photoDialogGrid").innerHTML = '<p class="history-detail-loading">Loading this truck’s IN details and photos...</p>';
  $("photoDialog").classList.remove("hidden");
  try {
    // Only THIS movement is requested, only AFTER a photo/details click.
    // Large photo strings never travel with the regular active-truck list.
    const record = await request(`movements/${active.id}`);
    if (token !== latestPhotoRequest || $("photoDialog").classList.contains("hidden")) return;
    if (!record) throw new Error("Original Truck IN movement not found.");
    const grid = $("photoDialogGrid");
    grid.replaceChildren();
    const summary = document.createElement("section");
    summary.className = "history-in-summary";
    const label = document.createElement("strong");
    label.textContent = `IN Load: ${loadLabel(record.inBare, record.inContainerNumber)}`;
    const time = document.createElement("span");
    time.textContent = `Time IN: ${formatDateTime(record.timeIn)}`;
    summary.append(label, time);
    grid.append(summary);
    // OUT photos are irrelevant to active IN records.
    historyPhotoFields.slice(0, 2).forEach(([field, fieldLabel]) => {
      const card = document.createElement("section");
      card.className = "history-photo-card";
      const heading = document.createElement("strong");
      heading.textContent = fieldLabel;
      card.append(heading);
      if (isValidTruckPhoto(record[field])) {
        const img = document.createElement("img");
        img.src = record[field];
        img.alt = `${fieldLabel} for ${record.plateNumber || "truck"}`;
        img.loading = "lazy";
        card.append(img);
      } else {
        const missing = document.createElement("p");
        missing.textContent = "No photo available";
        card.append(missing);
      }
      grid.append(card);
    });
  } catch (error) {
    if (token !== latestPhotoRequest || $("photoDialog").classList.contains("hidden")) return;
    console.error(error);
    $("photoDialogGrid").replaceChildren();
    const message = document.createElement("p");
    message.className = "history-detail-loading";
    message.textContent = error.message || "Could not load IN photos. Please try again.";
    $("photoDialogGrid").append(message);
  }
});
$("closePhotoDialog").addEventListener("click", closeHistoryPhotos);
$("photoDialog").addEventListener("click", (event) => {
  if (event.target === $("photoDialog")) closeHistoryPhotos();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !$("photoDialog").classList.contains("hidden")) closeHistoryPhotos();
});
