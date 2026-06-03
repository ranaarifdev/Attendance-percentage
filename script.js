// ======================= STUDENT DATA (Converted from excel sheets into JS objects) =======================
// Based on provided attendance sheets + assignments/presentation statuses
// No marks or grades displayed, only submission status (Submitted/Not Submitted, Given/Not Given)

const studentsData = [
    { rollNo: "ECTE231122101", name: "Muhammad Shahzaib", attendancePercent: 48.48, quizzes: { q1: false, q2: false, q3: false }, assignments: { a1: true, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122102", name: "Misbah bibi", attendancePercent: 67.74, quizzes: { q1: true, q2: true, q3: false }, assignments: { a1: true, a2: true, a3: false }, presentation: true },
    { rollNo: "ECTE231122103", name: "Romaisa Khan", attendancePercent: 67.74, quizzes: { q1: false, q2: false, q3: false }, assignments: { a1: true, a2: true, a3: false }, presentation: true },
    { rollNo: "ECTE231122104", name: "Javed Iqbal", attendancePercent: 19.35, quizzes: { q1: false, q2: false, q3: false }, assignments: { a1: false, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122106", name: "Muhammad Sanawar Ali", attendancePercent: 48.39, quizzes: { q1: false, q2: true, q3: false }, assignments: { a1: true, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122107", name: "Hira Zafar", attendancePercent: 70.42, quizzes: { q1: true, q2: true, q3: true }, assignments: { a1: true, a2: true, a3: false }, presentation: true },
    { rollNo: "ECTE231122110", name: "Khansa Aamir", attendancePercent: 64.52, quizzes: { q1: true, q2: true, q3: false }, assignments: { a1: true, a2: true, a3: false }, presentation: false },
    { rollNo: "ECTE231122111", name: "Eman Razaq", attendancePercent: 67.74, quizzes: { q1: true, q2: true, q3: false }, assignments: { a1: true, a2: true, a3: false }, presentation: false },
    { rollNo: "ECTE231122112", name: "Muhammad Basit", attendancePercent: 96.77, quizzes: { q1: true, q2: true, q3: true }, assignments: { a1: true, a2: true, a3: false }, presentation: false },
    { rollNo: "ECTE231122116", name: "Khuzaima Khalil", attendancePercent: 48.39, quizzes: { q1: false, q2: true, q3: true }, assignments: { a1: true, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122118", name: "Allah Nawaz", attendancePercent: 41.94, quizzes: { q1: true, q2: true, q3: false }, assignments: { a1: true, a2: true, a3: false }, presentation: false },
    { rollNo: "ECTE231122119", name: "Muhammad Talha Zafar", attendancePercent: 96.77, quizzes: { q1: true, q2: true, q3: true }, assignments: { a1: true, a2: true, a3: false }, presentation: true },
    { rollNo: "ECTE231122120", name: "Ghulam Hussain", attendancePercent: 32.26, quizzes: { q1: false, q2: false, q3: false }, assignments: { a1: false, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122121", name: "Muhammad Zahid", attendancePercent: 87.10, quizzes: { q1: true, q2: false, q3: true }, assignments: { a1: true, a2: true, a3: false }, presentation: false },
    { rollNo: "ECTE231122122", name: "Muhammad Rayyan", attendancePercent: 48.39, quizzes: { q1: false, q2: false, q3: false }, assignments: { a1: true, a2: true, a3: false }, presentation: false },
    { rollNo: "ECTE231122123", name: "Muhammad Saad Habib", attendancePercent: 25.81, quizzes: { q1: false, q2: false, q3: false }, assignments: { a1: false, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122124", name: "Muhammad Imran", attendancePercent: 74.19, quizzes: { q1: true, q2: true, q3: true }, assignments: { a1: true, a2: true, a3: false }, presentation: false },
    { rollNo: "ECTE231122125", name: "Rashid Ali", attendancePercent: 67.74, quizzes: { q1: true, q2: true, q3: true }, assignments: { a1: true, a2: true, a3: false }, presentation: false },
    { rollNo: "ECTE231122126", name: "Muhammad Adnan Ali", attendancePercent: 70.97, quizzes: { q1: false, q2: true, q3: true }, assignments: { a1: true, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122127", name: "Muhammad Sameer Abbasi", attendancePercent: 29.03, quizzes: { q1: false, q2: false, q3: false }, assignments: { a1: false, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122128", name: "Hafiz Matti Ur Rehman", attendancePercent: 61.29, quizzes: { q1: false, q2: false, q3: true }, assignments: { a1: true, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122130", name: "Daneyal Maqsood", attendancePercent: 22.58, quizzes: { q1: false, q2: false, q3: false }, assignments: { a1: false, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122131", name: "Sharjeel Saqib", attendancePercent: 96.77, quizzes: { q1: true, q2: true, q3: true }, assignments: { a1: true, a2: true, a3: false }, presentation: true },
    { rollNo: "ECTE231122133", name: "Muhammad Hannan Haider", attendancePercent: 22.58, quizzes: { q1: false, q2: false, q3: false }, assignments: { a1: false, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122134", name: "Muneeb Ur Rehman", attendancePercent: 32.26, quizzes: { q1: false, q2: true, q3: false }, assignments: { a1: false, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122135", name: "Hafiz Hamid Ali", attendancePercent: 48.39, quizzes: { q1: true, q2: false, q3: false }, assignments: { a1: false, a2: false, a3: false }, presentation: true },
    { rollNo: "ECTE231122136", name: "Aurang Zaib", attendancePercent: 29.03, quizzes: { q1: false, q2: false, q3: false }, assignments: { a1: false, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122137", name: "Muhammad Mursaleen", attendancePercent: 80.65, quizzes: { q1: true, q2: true, q3: true }, assignments: { a1: true, a2: false, a3: false }, presentation: true },
    { rollNo: "ECTE231122139", name: "Abdullah Hamid", attendancePercent: 61.29, quizzes: { q1: true, q2: false, q3: true }, assignments: { a1: false, a2: true, a3: false }, presentation: false },
    { rollNo: "ECTE231122140", name: "Badar Ahmad", attendancePercent: 70.97, quizzes: { q1: false, q2: true, q3: false }, assignments: { a1: false, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122141", name: "Mehak Siddique", attendancePercent: 64.52, quizzes: { q1: true, q2: true, q3: false }, assignments: { a1: false, a2: true, a3: false }, presentation: true },
    { rollNo: "ECTE231122142", name: "Muhammad Hussain Shahzad", attendancePercent: 45.16, quizzes: { q1: false, q2: false, q3: false }, assignments: { a1: false, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122143", name: "Malik Shoaib Khan", attendancePercent: 25.81, quizzes: { q1: false, q2: false, q3: false }, assignments: { a1: false, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122145", name: "Muhammad Arif", attendancePercent: 100, quizzes: { q1: true, q2: true, q3: true }, assignments: { a1: true, a2: true, a3: false }, presentation: false },
    { rollNo: "ECTE231122146", name: "Waleed Saleem", attendancePercent: 77.42, quizzes: { q1: true, q2: false, q3: false }, assignments: { a1: true, a2: true, a3: false }, presentation: false },
    { rollNo: "ECTE231122147", name: "Muhammad Hamad Khalid", attendancePercent: 19.35, quizzes: { q1: false, q2: false, q3: false }, assignments: { a1: false, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122148", name: "Asad Muneer", attendancePercent: 38.71, quizzes: { q1: false, q2: false, q3: false }, assignments: { a1: true, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122150", name: "Faizan Ali Chohan", attendancePercent: 96.77, quizzes: { q1: true, q2: true, q3: true }, assignments: { a1: true, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122152", name: "Muhammad Abdullah", attendancePercent: 80.65, quizzes: { q1: true, q2: true, q3: true }, assignments: { a1: true, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122153", name: "Mahrukh Choudhary", attendancePercent: 48.39, quizzes: { q1: true, q2: true, q3: false }, assignments: { a1: false, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122154", name: "Shayan Ahmad", attendancePercent: 96.77, quizzes: { q1: true, q2: true, q3: false }, assignments: { a1: true, a2: true, a3: false }, presentation: true },
    { rollNo: "ECTE231122155", name: "Muhammad Aftab", attendancePercent: 77.42, quizzes: { q1: true, q2: true, q3: true }, assignments: { a1: true, a2: false, a3: false }, presentation: false },
    { rollNo: "ECTE231122156", name: "Usaid Iqbal", attendancePercent: 70.97, quizzes: { q1: false, q2: true, q3: true }, assignments: { a1: true, a2: false, a3: false }, presentation: false }
];

// Helper to get student by roll number
function getStudentByRoll(roll) {
    return studentsData.find(s => s.rollNo.toLowerCase() === roll.trim().toLowerCase());
}

// Render dynamic dashboard
function renderStudentDashboard(student) {
    if (!student) return;
    const attPercent = student.attendancePercent;
    const roundedPercent = Math.round(attPercent);
    const progressWidth = Math.min(100, Math.max(0, attPercent));

    // Quizzes mapping
    const quizItems = [
        { label: "Quiz 1", status: student.quizzes.q1 },
        { label: "Quiz 2", status: student.quizzes.q2 },
        { label: "Quiz 3", status: student.quizzes.q3 }
    ];
    const assignmentItems = [
        { label: "Assignment 1", status: student.assignments.a1 },
        { label: "Assignment 2", status: student.assignments.a2 },
        { label: "Assignment 3", status: student.assignments.a3 }
    ];
    const presentationGiven = student.presentation;

    const html = `
        <div class="profile-card">
            <div class="student-name-row">
                <div class="student-name"><i class="fas fa-user-graduate"></i> ${student.name}</div>
                <div class="roll-badge"><i class="fas fa-qrcode"></i> ${student.rollNo}</div>
            </div>
            
            <!-- Attendance section -->
            <div class="attendance-block">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <span style="font-weight: 500; color: #cbebff;"><i class="fas fa-calendar-check"></i> Attendance Percentage</span>
                    <span class="att-percent">${roundedPercent}%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-fill" style="width: ${progressWidth}%;"></div>
                </div>
                <div style="font-size: 0.75rem; margin-top: 8px; color:#93b7d4;">Total lectures tracked: based on university records</div>
            </div>
            
            <!-- Quizzes & Assignments + Presentation Grid -->
            <div class="stats-grid">
                <!-- QUIZ CARD -->
                <div class="status-card">
                    <div class="card-title"><i class="fas fa-pen-alt"></i> Quizzes Status</div>
                    ${quizItems.map(q => `
                        <div class="status-item">
                            <span class="status-label">${q.label}</span>
                            <span class="status-badge ${q.status ? 'submitted' : 'not-submitted'}">
                                ${q.status ? '<i class="fas fa-check-circle"></i> Submitted' : '<i class="fas fa-times-circle"></i> Not Submitted'}
                            </span>
                        </div>
                    `).join('')}
                </div>
                
                <!-- ASSIGNMENT CARD -->
                <div class="status-card">
                    <div class="card-title"><i class="fas fa-tasks"></i> Assignments Status</div>
                    ${assignmentItems.map(a => `
                        <div class="status-item">
                            <span class="status-label">${a.label}</span>
                            <span class="status-badge ${a.status ? 'submitted' : 'not-submitted'}">
                                ${a.status ? '<i class="fas fa-check-circle"></i> Submitted' : '<i class="fas fa-times-circle"></i> Not Submitted'}
                            </span>
                        </div>
                    `).join('')}
                </div>
                
                <!-- PRESENTATION CARD -->
                <div class="status-card">
                    <div class="card-title"><i class="fas fa-chalkboard"></i> Presentation</div>
                    <div class="presentation-solo">
                        <span class="status-label">Final Presentation</span>
                        <span class="status-badge ${presentationGiven ? 'submitted' : 'not-submitted'}" style="font-size:1rem;">
                            ${presentationGiven ? '<i class="fas fa-check-circle"></i> Given' : '<i class="fas fa-times-circle"></i> Not Given'}
                        </span>
                    </div>
                    <div style="margin-top: 12px; font-size:0.7rem; color:#98b8d4;"><i class="fas fa-info-circle"></i> Status based on submission</div>
                </div>
            </div>
        </div>
    `;
    document.getElementById("resultContainer").innerHTML = html;
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById("errorMsg");
    const errorSpan = document.getElementById("errorText");
    errorSpan.innerText = message || "Student not found! Please check roll number.";
    errorDiv.style.display = "flex";
    setTimeout(() => {
        if (errorDiv.style.display === "flex") errorDiv.style.display = "none";
    }, 3500);
}

function hideError() {
    document.getElementById("errorMsg").style.display = "none";
}

function handleSearch() {
    const rollInput = document.getElementById("rollInput").value;
    if (!rollInput.trim()) {
        showError("Please enter a Roll Number (e.g., ECTE231122145)");
        return;
    }
    const student = getStudentByRoll(rollInput);
    if (!student) {
        showError(`No record found for Roll Number: ${rollInput}`);
        document.getElementById("resultContainer").innerHTML = "";
        return;
    }
    hideError();
    renderStudentDashboard(student);
}

// Event listeners
document.getElementById("searchBtn").addEventListener("click", handleSearch);
document.getElementById("rollInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
});

// Initial welcome message
window.onload = () => {
    document.getElementById("resultContainer").innerHTML = `
        <div style="text-align: center; background: rgba(0,0,0,0.3); border-radius: 2rem; padding: 2rem; margin-top:1rem;">
            <i class="fas fa-search" style="font-size: 3rem; color: #3980b3;"></i>
            <p style="color:#bbdef5; margin-top:12px;">Enter your Roll Number above to view attendance & activity status</p>
            <p style="font-size:0.8rem; color:#6c9bc2;">Quiz / Assignment / Presentation statuses — </p>
        </div>
    `;
};
