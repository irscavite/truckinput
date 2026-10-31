TRUCKINPUT-MAIN — SMART PLATE MATCHING + ACTIVE TRUCKS
=========================================================

HOW TO USE
1. Open Truck OUT and type the real plate number.
2. If a direct IN is not found, the app suggests similar ACTIVE IN plates.
   The system still supports entering the last 4 characters for normal exact suffix lookup.
3. Compare the physical plate, trucking company, and Time IN. Click the correct active IN suggestion.
4. Confirm the complete correct plate, enter the correction operator's name and a reason.
5. Click "Correct IN & Continue OUT" and confirm carefully.
6. The original IN record is corrected; proceed with normal OUT and attach at least one OUT photo.

TECHNICAL NOTES
- OUT searches the active_trucks index, NOT full Movement History.
- Attempts exact active key first, then suffix match, then fuzzy suggestions if no match.
- Fuzzy matching handles single-character errors and nearby transpositions.
- Active index is cached for 15 seconds to speed up repeated searches.
- Fuzzy matches are suggestions only: nothing is automatically selected or corrected.
- "Show other active IN plates" displays up to 30 closest active records for manual verification.
- Before updating, verifies original IN is still OPEN and new plate is not active.
- Corrects plateNumber + plateKey in movements and daily_movements, changes active_trucks index,
  updates the correct plate in truck_registry, and adds plate_corrections/<movementId>/<eventId>.
- Original timeIn, IN photos, movement ID and trucking name are preserved.
- Existing old truck_registry entry is left intact: it may belong to a valid truck from prior history.
  If it is definitively invalid, review and clean it up separately.
- OUT saves changes and active index removal via a single root multi-location PATCH.

IMPORTANT BEFORE PRODUCTION
- Back up your Firebase Realtime Database and test on a staging copy before deploying.
- The current HTML/JS project has NO authenticated supervisor roles or secured back-end.
  Entering a name is an audit declaration, NOT identity verification or admin access control.
  Supervisor-only corrections require Firebase Authentication, security rules and/or a secure backend.
- Client-side prechecks prevent routine duplicates, but simultaneous multi-device edits are not
  strictly race-proof. Strong concurrency guarantees require server-side transactions.
- Firebase Realtime Database rules must allow the root multi-location PATCH and the new
  plate_corrections path for authorized users; otherwise the correction will be rejected.
- Never publish a version with public Firebase write rules on an untrusted network.
- No live changes to Firebase were performed in the preparation of this ZIP.

FILES
index.html — correction form and plate suggestions inside OUT
style.css  — suggestion cards and correction layout (responsive)
app.js     — fuzzy matcher, fast active IN search, correction sync, audit, OUT preflight


ACTIVE TRUCKS (FORMER MOVEMENT HISTORY TAB)
========================================
- Tab now lists ONLY trucks currently INSIDE from active_trucks, regardless of the IN date.
- Date filter, closed OUT entries, and daily history download removed from that page.
- Search filters only the active list, including full plates and partial suffixes.
- For NEW IN records, compact load details are stored on active_trucks with no photo bytes.
- Older active index entries may show "View IN Details" instead of a load type until opened.
- Photos and complete IN details are fetched only on demand for one movement at a time.
- Truck IN, Truck OUT, Smart Plate Correction, daily_movements, movements, and permanent
  historical Firebase data still exist and remain in their original paths.
- This changes the active-truck page only; it is NOT a history archive viewer.

SPECIFIC TO THIS UPDATED truckinput-main (2).zip
========================================
- Original Firebase URL kept: https://truckmonitoring-bffa5-default-rtdb.asia-southeast1.firebasedatabase.app
- The newer version has no Loaded Container checkbox. It stays removed.
- IN/OUT, employee attendance, truck registry and camera/photo features retained.
- No live Firebase changes were performed.
