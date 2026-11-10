/**
 * Cyber Security Attendance Portal — Emerson University Multan
 * 7th Semester (Evening, Section A, Session 2023–2027)
 *
 * NOTE ON AUTHENTICATION:
 * This portal is deployed as a static GitHub Pages website. Client-side authentication
 * (username/password verification in browser runtime) is provided for administrative
 * workflow demonstration and internal review. True enterprise security requires a secure,
 * authenticated backend with encrypted session tokens and access control.
 */

const WORKBOOK_URL = "7th Semester Attendance.xlsx";
const SAP_MAP_URL = "Sap ID or Student ID.txt";
const ACADEMIC = { program: "BS Cyber Security", semester: "7th Semester", section: "A", session: "2023–2027" };
const SUBJECTS = [
  { name: "Foreign Language", teacher: "Muhammad Ashraf", aliases: ["foriegn language", "foreign language"], icon: "language" },
  { name: "Digital Forensics", teacher: "Syed Waqas Shah", aliases: ["digital foriegnsics", "digital forensics"], icon: "forensics" },
  { name: "Embedded Systems", teacher: "Mr. Umair Abid", aliases: ["embedded systems", "embbeded systems"], icon: "embedded" },
  { name: "Parallel and Distributed Computing", teacher: "Aiman Ali Batool", aliases: ["parralel and distributed comput", "parallel and distributed comput", "parallel and distributed computing", "paralell and distributed computing"], icon: "parallel" },
  { name: "Analysis of Algorithms", teacher: "Kiran Shahzadi", aliases: ["analysis of algorithms"], icon: "algorithms" }
];

const ADMIN_CREDENTIALS = {
  username: "arif2743",
  password: "274300"
};
const AUTH_STORAGE_KEY = "eu_attendance_admin_auth";

let students = new Map();
let workbookWarnings = [];
let loading = false;
let studentsLoaded = false;
let sapMap = null;
let activeAdminSubjectIndex = 0;

const $ = (selector) => document.querySelector(selector);
const normalise = (value) => String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

const SUBJECT_ICONS = {
  language: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v11H11l-5 3v-3H4z"></path><path d="M8 9h8M8 13h5"></path></svg>',
  forensics: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"></circle><path d="m15.5 15.5 5 5M8 10.5l1.7 1.7 3.5-3.7"></path></svg>',
  embedded: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"></rect><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4M9 10h6v4H9z"></path></svg>',
  parallel: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="2.5"></circle><circle cx="18" cy="6" r="2.5"></circle><circle cx="12" cy="18" r="2.5"></circle><path d="M8.5 6h7M7.5 8l3.2 7.6m5.8-7.6L13.3 15.6"></path></svg>',
  algorithms: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-2-12-4 14"></path></svg>'
};

/* ─── AUTHENTICATION HELPERS ─── */

function isAdminAuthenticated() {
  return sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

function setAdminAuthenticated(auth) {
  if (auth) {
    sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
  } else {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

/* ─── VIEW ROUTING ─── */

function showView(view) {
  const studentView = $("#studentPortalView");
  const loginView = $("#adminLoginView");
  const dashboardView = $("#adminDashboardView");

  if (view === "admin-dashboard") {
    studentView.hidden = true;
    loginView.hidden = true;
    dashboardView.hidden = false;
    renderAdminDashboard();
  } else if (view === "admin-login") {
    studentView.hidden = true;
    loginView.hidden = false;
    dashboardView.hidden = true;
    $("#adminLoginError").hidden = true;
    const userField = $("#adminUsername");
    if (userField) {
      userField.value = "";
      userField.focus();
    }
    const passField = $("#adminPassword");
    if (passField) passField.value = "";
  } else {
    // Default student portal
    studentView.hidden = false;
    loginView.hidden = true;
    dashboardView.hidden = true;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleRouting() {
  const hash = window.location.hash.toLowerCase();
  if (hash === "#admin" || hash === "#dashboard" || hash === "#login") {
    if (isAdminAuthenticated()) {
      showView("admin-dashboard");
    } else {
      showView("admin-login");
    }
  } else {
    showView("student");
  }
}

/* ─── REFERENCE CARDS (Student View) ─── */

function renderSubjectReference() {
  $("#subjectList").innerHTML = SUBJECTS.map((subject, index) => `
    <article class="subject-reference-card">
      <span class="subject-icon" aria-hidden="true">${SUBJECT_ICONS[subject.icon]}</span>
      <span class="subject-number">0${index + 1}</span>
      <h3>${escapeHtml(subject.name)}</h3>
      <p>${escapeHtml(subject.teacher)}</p>
    </article>
  `).join("");
}

/* ─── WORKBOOK PARSING ─── */

function parseSapMap(text) {
  const sapIdsByRoll = new Map();
  const rollsBySap = new Map();
  for (const line of text.split(/\r?\n/)) {
    const fields = line.split("|").map((part) => part.trim());
    const id = (fields[2] || "").replace(/\D/g, "");
    const roll = (fields[3] || "").match(/ECTE\d+/i)?.[0]?.toUpperCase();
    if (!id || !roll) continue;
    if (!sapIdsByRoll.has(roll)) sapIdsByRoll.set(roll, new Set());
    if (!rollsBySap.has(id)) rollsBySap.set(id, new Set());
    sapIdsByRoll.get(roll).add(id);
    rollsBySap.get(id).add(roll);
  }
  const rollConflicts = new Set([...sapIdsByRoll].filter(([, ids]) => ids.size > 1).map(([roll]) => roll));
  const sapConflicts = new Set([...rollsBySap].filter(([, rolls]) => rolls.size > 1).map(([id]) => id));
  const byRoll = new Map();
  const bySap = new Map();
  for (const [roll, ids] of sapIdsByRoll) {
    if (ids.size !== 1) continue;
    const id = [...ids][0];
    if (rollsBySap.get(id)?.size !== 1) continue;
    byRoll.set(roll, id);
    bySap.set(id, roll);
  }
  return { byRoll, bySap, rollConflicts, sapConflicts };
}

function readPercent(cell) {
  if (!cell || cell.v === null || cell.v === undefined || String(cell.v).trim() === "") {
    return { value: null, display: "No attendance data", valid: true, formulaWithoutSavedValue: Boolean(cell?.f) };
  }
  if (typeof cell.v === "number" && Number.isFinite(cell.v)) {
    const excelPercent = typeof cell.z === "string" && cell.z.includes("%");
    const value = excelPercent ? cell.v * 100 : cell.v;
    const valid = value >= 0 && value <= 100;
    const formatted = typeof cell.w === "string" && cell.w ? cell.w : String(value);
    return { value: valid ? value : null, display: valid ? `${formatted}${excelPercent || formatted.endsWith("%") ? "" : "%"}` : "Invalid Excel value", valid, formulaWithoutSavedValue: false };
  }
  const raw = String(cell.v).trim();
  const value = Number(raw.replace(/\s*%$/, ""));
  const valid = Number.isFinite(value) && value >= 0 && value <= 100;
  return { value: valid ? value : null, display: valid ? `${raw.replace(/\s*%$/, "")}%` : "Invalid Excel value", valid, formulaWithoutSavedValue: false };
}

function readTotal(cell) {
  if (!cell || cell.v === null || cell.v === undefined || String(cell.v).trim() === "") {
    return { value: null, display: "No data", valid: true, formulaWithoutSavedValue: Boolean(cell?.f) };
  }
  const value = typeof cell.v === "number" ? cell.v : Number(String(cell.v).trim());
  const valid = Number.isSafeInteger(value) && value >= 0;
  return { value: valid ? value : null, display: valid ? (cell.w || String(cell.v).trim()) : "Invalid Excel value", valid, formulaWithoutSavedValue: false };
}

function parseWorkbook(workbook, mapping) {
  const studentsByRoll = new Map();
  const warnings = [];
  const availableSubjects = new Set();
  const ambiguousRollNumbers = new Set();
  for (const subject of SUBJECTS) {
    const sheetName = workbook.SheetNames.find((name) => subject.aliases.includes(normalise(name)));
    if (!sheetName) {
      warnings.push(`Missing worksheet for ${subject.name}.`);
      continue;
    }
    const sheet = workbook.Sheets[sheetName];
    if (!sheet || !sheet["!ref"]) {
      warnings.push(`${subject.name}: worksheet is empty or has no readable range.`);
      continue;
    }
    availableSubjects.add(subject.name);
    const range = XLSX.utils.decode_range(sheet["!ref"]);
    const seen = new Set();
    let records = 0;
    let missingFormulaValues = false;
    for (let row = 7; row <= range.e.r + 1; row++) {
      // Intentionally reading only B, C, AJ, and AK from student rows.
      const rollNo = String(sheet[`B${row}`]?.v ?? "").trim().toUpperCase();
      const name = String(sheet[`C${row}`]?.v ?? "").trim();
      if (!rollNo && !name) continue;
      if (!/^ECTE\d+$/i.test(rollNo) || !name) {
        warnings.push(`${subject.name}: invalid student identity at row ${row} ignored.`);
        continue;
      }
      if (seen.has(rollNo)) {
        ambiguousRollNumbers.add(rollNo);
        warnings.push(`${subject.name}: duplicate roll number ${rollNo}; this student's result is hidden until corrected.`);
        continue;
      }
      seen.add(rollNo);
      records++;
      const total = readTotal(sheet[`AJ${row}`]);
      const percent = readPercent(sheet[`AK${row}`]);
      if (!total.valid) warnings.push(`${subject.name}, ${rollNo}: invalid AJ total attendance.`);
      if (!percent.valid) warnings.push(`${subject.name}, ${rollNo}: invalid AK percentage.`);
      if (total.formulaWithoutSavedValue || percent.formulaWithoutSavedValue) missingFormulaValues = true;
      if (!studentsByRoll.has(rollNo)) studentsByRoll.set(rollNo, { rollNo, name, sapId: mapping.byRoll.get(rollNo) || "", subjectRecords: new Map() });
      const student = studentsByRoll.get(rollNo);
      if (normalise(student.name) !== normalise(name)) {
        ambiguousRollNumbers.add(rollNo);
        warnings.push(`Name mismatch for ${rollNo} in ${subject.name}; this student's result is hidden until corrected.`);
      }
      student.subjectRecords.set(subject.name, { name: subject.name, teacher: subject.teacher, total, percent });
    }
    if (!records) warnings.push(`${subject.name}: no student records found.`);
    if (missingFormulaValues) warnings.push(`${subject.name}: one or more AJ/AK formulas have no saved result. Recalculate and save the workbook in Excel.`);
  }

  if (!availableSubjects.size) throw new Error("None of the five required subject worksheets were found in this workbook.");
  for (const rollNo of ambiguousRollNumbers) studentsByRoll.delete(rollNo);
  if (ambiguousRollNumbers.size) warnings.push(`${ambiguousRollNumbers.size} student record(s) with conflicting identities were excluded.`);

  for (const student of studentsByRoll.values()) {
    student.subjects = SUBJECTS.map((subject) => student.subjectRecords.get(subject.name) || {
      name: subject.name,
      teacher: subject.teacher,
      unavailable: true,
      total: { value: null, display: "No record", valid: true },
      percent: { value: null, display: "No record", valid: true }
    });
    delete student.subjectRecords;
  }
  const missingMappings = [...studentsByRoll.keys()].filter((roll) => !mapping.byRoll.has(roll)).length;
  if (missingMappings) warnings.push(`${missingMappings} student record(s) have no unique SAP ID mapping.`);
  if (mapping.rollConflicts.size) warnings.push(`${mapping.rollConflicts.size} conflicting roll mapping(s) were disabled.`);
  if (mapping.sapConflicts.size) warnings.push(`${mapping.sapConflicts.size} duplicate SAP ID(s) were disabled.`);
  if (!mapping.byRoll.size) warnings.push("SAP mapping file is missing or has no valid entries; roll-number search remains available.");
  return { students: studentsByRoll, warnings, availableSubjects };
}

async function loadWorkbook(file = null) {
  if (loading) return false;
  if (file && !/\.(xlsx|xls)$/i.test(file.name)) {
    showError("Choose an Excel workbook with an .xlsx or .xls file extension.");
    return false;
  }
  loading = true;
  setStatus(file ? "Reading selected workbook..." : "Refreshing workbook...", "loading");
  setBusy(true);
  hideError();
  try {
    if (!window.XLSX) throw new Error("The Excel reader library did not load. Check the internet connection and reload this page.");
    const [workbookResult, sapText] = await Promise.all([
      file
        ? file.arrayBuffer().then((bytes) => ({ bytes }))
        : fetch(new URL(WORKBOOK_URL, document.baseURI), { cache: "no-store" }).then(async (response) => {
            if (!response.ok) throw new Error(`Could not load ${WORKBOOK_URL} (HTTP ${response.status}).`);
            return { bytes: await response.arrayBuffer() };
          }),
      fetch(new URL(SAP_MAP_URL, document.baseURI), { cache: "no-store" }).then((response) => response.ok ? response.text() : "").catch(() => "")
    ]);
    sapMap = parseSapMap(sapText);
    const parsed = parseWorkbook(XLSX.read(workbookResult.bytes, { type: "array", cellDates: true, cellNF: true }), sapMap);
    students = parsed.students;
    workbookWarnings = parsed.warnings;
    studentsLoaded = true;
    const worksheetCount = parsed.availableSubjects.size;
    setStatus(`${students.size} students loaded · ${worksheetCount}/5 worksheets`, workbookWarnings.length ? "warning" : "ready");
    $("#workbookSummary").textContent = `${worksheetCount} of 5 subject worksheets available`;
    $("#lastUpdated").textContent = `Last successful refresh: ${new Date().toLocaleString()}`;

    // If a student query was active, update student report
    if ($("#studentId").value.trim()) renderStudent($("#studentId").value.trim());

    // If admin dashboard is active, refresh the dashboard table
    if (!$("#adminDashboardView").hidden) renderAdminDashboard();

    return true;
  } catch (error) {
    setStatus(studentsLoaded ? "Refresh failed · previously loaded data remains available" : "Workbook unavailable", "error");
    $("#workbookSummary").textContent = studentsLoaded
      ? "The last successfully loaded workbook is still available."
      : "Check the workbook path or choose a workbook file.";
    const message = error instanceof Error ? error.message : "An unexpected error occurred while loading the workbook.";
    if (!studentsLoaded) {
      showError("Attendance data is currently unavailable. Please try again later or contact the department.");
    } else {
      showError(`${message} ${file ? "Check the selected workbook and its required subject sheets." : "Choose a workbook or check the files beside index.html."}`);
    }
    return false;
  } finally {
    loading = false;
    setBusy(false);
  }
}

function setBusy(busy) {
  const search = $("#searchButton");
  const refresh = $("#refreshButton");
  if (search) search.disabled = busy;
  if (refresh) refresh.disabled = busy;
  const upload = $("#workbookUpload");
  if (upload) upload.disabled = busy;
  document.body.dataset.loading = String(busy);
}

function setStatus(message, state) {
  const element = $("#dataStatus");
  if (element) {
    element.textContent = message;
    element.dataset.state = state;
  }
  const indicator = $("#statusIndicator");
  if (indicator) indicator.dataset.state = state;
}

function showError(message) {
  const element = $("#errorMessage");
  if (element) {
    element.textContent = message;
    element.hidden = false;
  }
}

function hideError() {
  const element = $("#errorMessage");
  if (element) element.hidden = true;
}

function attendanceClass(percent) {
  if (percent === null || percent === undefined) return "no-data";
  if (percent >= 75) return "good";
  if (percent >= 50) return "watch";
  return "low";
}

function attendanceStatusLabel(percent) {
  if (percent === null || percent === undefined) return "No Data";
  if (percent >= 75) return "On Track";
  if (percent >= 50) return "Needs Attention";
  return "Below Target";
}

/* ─── STUDENT VIEW RENDERING ─── */

function renderStudent(query) {
  const lookup = normalise(query).replace(/\s+/g, "");
  const rollNo = lookup.toUpperCase();
  const student = /^ECTE\d+$/.test(rollNo)
    ? students.get(rollNo)
    : students.get(sapMap?.bySap.get(lookup) || "");
  if (!student) {
    $("#resultContainer").innerHTML = "";
    showError("No student record found for that roll number or SAP ID. Please check and try again.");
    return;
  }
  hideError();
  const attendanceTotal = student.subjects.reduce((sum, subject) => sum + (subject.total.value ?? 0), 0);
  const partialTotal = student.subjects.some((subject) => subject.unavailable || subject.total.value === null);
  const subjectsWithData = student.subjects.filter((subject) =>
    !subject.unavailable && (
      (subject.total.value !== null && subject.total.value > 0) ||
      subject.percent.value !== null
    )
  ).length;
  const cards = student.subjects.map((subject) => {
    const percent = subject.percent.value;
    const unavailable = subject.unavailable;
    const attendanceDisplay = unavailable ? "Subject record unavailable" : subject.percent.display;
    const totalDisplay = unavailable ? "No record" : subject.total.display;
    const percentLabel = percent === null ? "No percentage data available" : `${subject.percent.display} attendance`;
    const progressValue = percent === null ? "" : `aria-valuenow="${percent}"`;
    const status = attendanceStatusLabel(percent);
    return `<article class="attendance-card ${attendanceClass(percent)}"><div class="subject-heading"><div><h3>${escapeHtml(subject.name)}</h3><p>${escapeHtml(subject.teacher)}</p></div><span class="attendance-status">${status}</span></div><p class="subject-percent">${escapeHtml(attendanceDisplay)}</p><div class="progress-track" role="progressbar" aria-label="${escapeHtml(subject.name)}: ${escapeHtml(percentLabel)}" ${progressValue} aria-valuemin="0" aria-valuemax="100"><span style="width:${percent === null ? 0 : Math.max(0, Math.min(100, percent))}%"></span></div><dl class="subject-metrics"><div><dt>Total Attendance</dt><dd>${escapeHtml(totalDisplay)}</dd></div><div><dt>Attendance Percentage</dt><dd>${escapeHtml(attendanceDisplay)}</dd></div></dl></article>`;
  }).join("");
  const notes = workbookWarnings.length ? `<details class="data-notes"><summary>Data notes (${workbookWarnings.length})</summary><ul>${workbookWarnings.slice(0, 30).map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul></details>` : "";
  $("#resultContainer").innerHTML = `<section class="student-panel" aria-labelledby="studentName"><div class="student-header"><div class="student-identity"><p class="eyebrow">Student attendance report</p><h2 id="studentName">${escapeHtml(student.name)}</h2><p class="student-identifiers"><span>Roll Number <strong>${escapeHtml(student.rollNo)}</strong></span><span>SAP ID <strong>${escapeHtml(student.sapId || "Not listed")}</strong></span></p></div><div class="report-actions"><button class="button button-outline" type="button" data-action="back-to-search">← Back to Search</button><button class="button button-primary" type="button" data-action="print-report">Print Report</button></div></div><div class="academic-strip"><span>${escapeHtml(ACADEMIC.program)}</span><span>${escapeHtml(ACADEMIC.semester)}</span><span>Evening – Section ${escapeHtml(ACADEMIC.section)}</span><span>Session ${escapeHtml(ACADEMIC.session)}</span></div><div class="summary-grid"><div class="summary-card"><span>Combined Total Attendance${partialTotal ? " (partial)" : ""}</span><strong>${escapeHtml(String(attendanceTotal))}</strong><small>Sum of available subject totals</small></div><div class="summary-card"><span>Subjects with Attendance Data</span><strong>${subjectsWithData} <small>/ 5</small></strong><small>Based on saved attendance values</small></div></div><div class="attendance-section-heading"><h3>Subject Attendance</h3><p>Values shown exactly as recorded in the workbook.</p></div><div class="cards-grid">${cards}</div>${notes}<p class="overall-note">An overall attendance percentage is not shown because the available source data does not provide a dependable combined lecture count.</p></section>`;
  $("#resultContainer").scrollIntoView?.({ behavior: "smooth", block: "start" });
}

/* ─── ADMIN DASHBOARD RENDERING ─── */

function renderAdminSubjectTabs() {
  const tabsContainer = $("#adminSubjectTabs");
  if (!tabsContainer) return;

  tabsContainer.innerHTML = SUBJECTS.map((sub, idx) => `
    <button type="button" class="admin-subject-tab ${idx === activeAdminSubjectIndex ? 'active' : ''}" data-subject-index="${idx}" role="tab" aria-selected="${idx === activeAdminSubjectIndex}">
      <span class="subject-icon" aria-hidden="true">${SUBJECT_ICONS[sub.icon]}</span>
      <h4>${escapeHtml(sub.name)}</h4>
      <p>${escapeHtml(sub.teacher)}</p>
    </button>
  `).join("");
}

function renderAdminDashboard() {
  const activeSubject = SUBJECTS[activeAdminSubjectIndex];
  if (!activeSubject) return;

  renderAdminSubjectTabs();

  // Screen header
  $("#activeSubjectTitle").textContent = activeSubject.name;
  $("#activeSubjectTeacher").textContent = `Instructor: ${activeSubject.teacher}`;
  $("#adminSubjectIcon").innerHTML = SUBJECT_ICONS[activeSubject.icon];

  // Print header
  $("#printSubjectName").textContent = `Subject: ${activeSubject.name}`;
  $("#printTeacherName").textContent = `Instructor: ${activeSubject.teacher}`;
  const now = new Date();
  $("#printGeneratedDate").textContent = `Generated: ${now.toLocaleDateString("en-PK", { weekday: "short", year: "numeric", month: "short", day: "numeric" })} at ${now.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}`;

  // Collect student records for this subject
  const studentList = Array.from(students.values());
  studentList.sort((a, b) => a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true }));

  // Metrics computation
  let totalEnrolled = studentList.length;
  let countWithData = 0;
  let sumPercent = 0;
  let onTrackCount = 0;
  let watchCount = 0;
  let lowCount = 0;

  studentList.forEach((st) => {
    const subRecord = st.subjects.find((s) => s.name === activeSubject.name);
    const pVal = subRecord?.percent?.value;
    if (pVal !== null && pVal !== undefined) {
      countWithData++;
      sumPercent += pVal;
      if (pVal >= 75) onTrackCount++;
      else if (pVal >= 50) watchCount++;
      else lowCount++;
    }
  });

  const avgPercentStr = countWithData > 0 ? (sumPercent / countWithData).toFixed(1) + "%" : "No Data";

  $("#adminSubjectMetrics").innerHTML = `
    <div class="admin-metric-card">
      <span>Enrolled Students</span>
      <strong>${totalEnrolled}</strong>
      <small>Total in BS Cyber Security</small>
    </div>
    <div class="admin-metric-card">
      <span>Class Average</span>
      <strong>${avgPercentStr}</strong>
      <small>${countWithData} students with recorded %</small>
    </div>
    <div class="admin-metric-card good">
      <span>Eligible for Exams (≥ 75%)</span>
      <strong>${onTrackCount}</strong>
      <small>${countWithData > 0 ? Math.round((onTrackCount / countWithData) * 100) : 0}% of evaluated students</small>
    </div>
    <div class="admin-metric-card low">
      <span>Not Eligible (< 75%)</span>
      <strong>${watchCount + lowCount}</strong>
      <small>${watchCount + lowCount > 0 ? `${watchCount + lowCount} student(s) barred from exams` : 'All students eligible'}</small>
    </div>
  `;

  renderAdminTableRows();
}

function renderAdminTableRows() {
  const activeSubject = SUBJECTS[activeAdminSubjectIndex];
  const tableBody = $("#adminTableBody");
  if (!tableBody) return;

  if (!studentsLoaded) {
    tableBody.innerHTML = `<tr><td colspan="7" class="empty-table-msg">Loading attendance records from workbook…</td></tr>`;
    return;
  }

  const searchQuery = normalise($("#adminRosterSearch")?.value || "");
  const studentList = Array.from(students.values());
  studentList.sort((a, b) => a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true }));

  const filtered = studentList.filter((st) => {
    if (!searchQuery) return true;
    const matchRoll = normalise(st.rollNo).includes(searchQuery);
    const matchName = normalise(st.name).includes(searchQuery);
    const matchSap = normalise(st.sapId).includes(searchQuery);

    const subRecord = st.subjects.find((s) => s.name === activeSubject.name);
    const pVal = subRecord?.percent?.value;
    const isEligible = pVal !== null && pVal !== undefined && pVal >= 75;
    const isNotEligible = pVal !== null && pVal !== undefined && pVal < 75;

    const matchEligible = (searchQuery === "eligible" || searchQuery === "pass") && isEligible;
    const matchNotEligible = (searchQuery.includes("not") || searchQuery.includes("bar") || searchQuery.includes("fail") || searchQuery.includes("ineligible")) && isNotEligible;

    return matchRoll || matchName || matchSap || matchEligible || matchNotEligible;
  });

  if (!filtered.length) {
    tableBody.innerHTML = `<tr><td colspan="7" class="empty-table-msg">No students match "${escapeHtml($("#adminRosterSearch")?.value || "")}".</td></tr>`;
    return;
  }

  tableBody.innerHTML = filtered.map((st, idx) => {
    const subRecord = st.subjects.find((s) => s.name === activeSubject.name);
    const unavailable = subRecord?.unavailable;
    const totalDisp = unavailable ? "No record" : (subRecord?.total?.display || "No data");
    const percentDisp = unavailable ? "No record" : (subRecord?.percent?.display || "No data");
    const pVal = subRecord?.percent?.value;

    let eligibilityBadge = '<span class="eligibility-pill pending">Pending Data</span>';
    let rowClass = "";

    if (pVal !== null && pVal !== undefined) {
      if (pVal >= 75) {
        eligibilityBadge = '<span class="eligibility-pill eligible" title="Attendance ≥ 75%: Eligible to sit in examination">✓ Eligible</span>';
        rowClass = "row-eligible";
      } else {
        eligibilityBadge = '<span class="eligibility-pill not-eligible" title="Attendance < 75%: Not eligible to sit in examination">✕ Not Eligible</span>';
        rowClass = "row-not-eligible";
      }
    }

    return `
      <tr class="${rowClass}">
        <td style="color: var(--muted);">${idx + 1}</td>
        <td class="roll-cell">${escapeHtml(st.rollNo)}</td>
        <td class="sap-cell">${escapeHtml(st.sapId || "—")}</td>
        <td class="name-cell">${escapeHtml(st.name)}</td>
        <td>${eligibilityBadge}</td>
        <td class="num-col">${escapeHtml(totalDisp)}</td>
        <td class="num-col">${escapeHtml(percentDisp)}</td>
      </tr>
    `;
  }).join("");
}

/* ─── EVENT LISTENERS & INITIALIZATION ─── */

// Student search form
$("#searchForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = $("#studentId").value.trim();
  if (!query) {
    showError("Please enter your university roll number or SAP ID.");
    return;
  }
  if (!studentsLoaded && !(await loadWorkbook())) return;
  renderStudent(query);
});

$("#clearButton")?.addEventListener("click", () => {
  $("#studentId").value = "";
  $("#resultContainer").innerHTML = "";
  hideError();
  $("#clearButton").disabled = true;
  $("#studentId").focus();
});

$("#studentId").addEventListener("input", () => {
  const clear = $("#clearButton");
  if (clear) clear.disabled = !$("#studentId").value.trim();
  if (!$("#errorMessage").hidden) hideError();
});

// Theme Toggle
$("#themeToggle")?.addEventListener("click", () => {
  const enabled = document.body.dataset.theme !== "dark";
  document.body.dataset.theme = enabled ? "dark" : "light";
  $("#themeToggle").setAttribute("aria-pressed", String(enabled));
  $("#themeToggle").setAttribute("aria-label", enabled ? "Switch to light theme" : "Switch to dark theme");
  $(".theme-toggle-label").textContent = enabled ? "Light mode" : "Dark mode";
  $("#themeToggle").querySelector("[aria-hidden='true']").textContent = enabled ? "☀" : "☾";
});

// Student report action buttons
$("#resultContainer").addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  if (button.dataset.action === "back-to-search") {
    $("#resultContainer").innerHTML = "";
    $("#studentId").value = "";
    $("#clearButton").disabled = true;
    hideError();
    $("#studentId").focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (button.dataset.action === "print-report") {
    window.print();
  }
});

// Workbook actions (Admin card)
$("#refreshButton")?.addEventListener("click", () => loadWorkbook());
$("#workbookUpload")?.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (file) loadWorkbook(file);
  event.target.value = "";
});

// Admin Login Form
$("#adminLoginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = $("#adminUsername")?.value.trim() || "";
  const pass = $("#adminPassword")?.value || "";
  const errEl = $("#adminLoginError");

  if (user === ADMIN_CREDENTIALS.username && pass === ADMIN_CREDENTIALS.password) {
    setAdminAuthenticated(true);
    errEl.hidden = true;
    window.location.hash = "#admin";
    showView("admin-dashboard");
  } else {
    errEl.textContent = "Invalid username or password. Please try again.";
    errEl.hidden = false;
  }
});

// Return to Student Portal buttons
$("#backToStudentBtn")?.addEventListener("click", () => {
  window.location.hash = "#home";
  showView("student");
});

$("#adminToStudentBtn")?.addEventListener("click", () => {
  window.location.hash = "#home";
  showView("student");
});

// Admin Logout
$("#adminLogoutBtn")?.addEventListener("click", () => {
  setAdminAuthenticated(false);
  window.location.hash = "#admin";
  showView("admin-login");
});

// Admin Subject Tabs
$("#adminSubjectTabs")?.addEventListener("click", (e) => {
  const tab = e.target.closest("[data-subject-index]");
  if (!tab) return;
  const idx = parseInt(tab.dataset.subjectIndex, 10);
  if (!isNaN(idx) && idx !== activeAdminSubjectIndex) {
    activeAdminSubjectIndex = idx;
    const searchInput = $("#adminRosterSearch");
    if (searchInput) searchInput.value = "";
    renderAdminDashboard();
  }
});

// Admin Table Search
$("#adminRosterSearch")?.addEventListener("input", () => {
  renderAdminTableRows();
});

// Admin Print Button
$("#printSubjectAttendanceBtn")?.addEventListener("click", () => {
  window.print();
});

// Routing listeners
window.addEventListener("hashchange", handleRouting);

// Boot
renderSubjectReference();
handleRouting();
loadWorkbook();
