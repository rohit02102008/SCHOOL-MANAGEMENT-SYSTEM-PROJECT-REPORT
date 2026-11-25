
// SCHOOL MANAGEMENT SYSTEM

// DEMO LOGIN DETAILS
const accounts = {
    admin: {
        email: "admin@school.com",
        password: "admin123",
        name: "School Admin"
    },
    student: {
        email: "student@school.com",
        password: "student123",
        name: "Rahul Kumar"
    }
};

// SAMPLE DATA
const defaultStudents = [
    { id: 101, name: "Rahul Kumar", class: "10A", email: "student@school.com" },
    { id: 102, name: "Priya Sharma", class: "10B", email: "priya@school.com" },
    { id: 103, name: "Arun Kumar", class: "9A", email: "arun@school.com" },
    { id: 104, name: "Sneha Devi", class: "9B", email: "sneha@school.com" },
    { id: 105, name: "Karthik Raj", class: "8A", email: "karthik@school.com" }
];

const defaultTeachers = [
    { id: 1, name: "Mrs. Anitha", subject: "Mathematics", email: "anitha@school.com" },
    { id: 2, name: "Mr. Kumar", subject: "Science", email: "kumar@school.com" },
    { id: 3, name: "Mrs. Priya", subject: "English", email: "priya.t@school.com" },
    { id: 4, name: "Mr. Rajesh", subject: "Computer Science", email: "rajesh@school.com" }
];

const defaultAnnouncements = [
    {
        title: "Annual Sports Day",
        message: "Our school Annual Sports Day will be conducted next Friday."
    },
    {
        title: "Examination Notice",
        message: "The upcoming examination timetable will be announced soon."
    },
    {
        title: "Holiday Notice",
        message: "School will remain closed on the upcoming public holiday."
    }
];

const defaultTimetable = [
    ["Monday", "Mathematics", "English", "Science", "Computer"],
    ["Tuesday", "Science", "Mathematics", "English", "Social"],
    ["Wednesday", "English", "Computer", "Mathematics", "Science"],
    ["Thursday", "Social", "Science", "Computer", "English"],
    ["Friday", "Mathematics", "Social", "Science", "Computer"]
];

const defaultResults = [
    { name: "Rahul Kumar", math: 85, science: 90, english: 78 },
    { name: "Priya Sharma", math: 92, science: 88, english: 95 },
    { name: "Arun Kumar", math: 75, science: 82, english: 80 },
    { name: "Sneha Devi", math: 89, science: 91, english: 87 },
    { name: "Karthik Raj", math: 65, science: 70, english: 72 }
];

// LOAD DATA FROM LOCAL STORAGE
function loadData(key, defaultValue) {
    const saved = localStorage.getItem(key);

    if (saved === null) {
        return defaultValue;
    }

    try {
        return JSON.parse(saved);
    } catch {
        return defaultValue;
    }
}

let students = loadData("schoolStudents", defaultStudents);
let teachers = loadData("schoolTeachers", defaultTeachers);
let announcements = loadData("schoolAnnouncements", defaultAnnouncements);
let attendance = loadData("schoolAttendance", {});
let fees = loadData("schoolFees", {});
let results = loadData("schoolResults", defaultResults);

let currentUser = null;
let currentRole = null;

// SAVE DATA
function saveData() {
    localStorage.setItem("schoolStudents", JSON.stringify(students));
    localStorage.setItem("schoolTeachers", JSON.stringify(teachers));
    localStorage.setItem("schoolAnnouncements", JSON.stringify(announcements));
    localStorage.setItem("schoolAttendance", JSON.stringify(attendance));
    localStorage.setItem("schoolFees", JSON.stringify(fees));
    localStorage.setItem("schoolResults", JSON.stringify(results));
}

// TODAY'S DATE
document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

// LOGIN FUNCTION
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const account = accounts[role];

    if (email === account.email && password === account.password) {

        currentUser = account;
        currentRole = role;

        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");

        document.getElementById("userName").textContent = account.name;
        document.getElementById("userRole").textContent =
            role === "admin" ? "Administrator" : "Student";

        document.getElementById("userAvatar").textContent =
            account.name.charAt(0);

        // Hide admin features for students
        document.querySelectorAll(".admin-only").forEach(element => {
            element.style.display =
                role === "admin" ? "" : "none";
        });

        showPage("dashboard");
        renderAll();

    } else {
        document.getElementById("loginError").textContent =
            "Invalid email, password or login role!";
    }
});

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", function() {
    currentUser = null;
    currentRole = null;

    document.getElementById("app").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");

    document.getElementById("loginForm").reset();
    document.getElementById("loginError").textContent = "";

    showPage("dashboard");
});

// PAGE NAVIGATION
function showPage(pageName) {

    // Prevent students opening admin-only pages
    if (
        currentRole === "student" &&
        ["students", "teachers"].includes(pageName)
    ) {
        pageName = "dashboard";
    }

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageName);

    if (!selectedPage) return;

    selectedPage.classList.add("active-page");

    const activeLink = document.querySelector(
        `.nav-link[data-page="${pageName}"]`
    );

    if (activeLink) {
        activeLink.classList.add("active");
    }

    document.getElementById("pageTitle").textContent =
        pageName.charAt(0).toUpperCase() + pageName.slice(1);
}

document.querySelectorAll(".nav-link").forEach(button => {
    button.addEventListener("click", function() {
        showPage(this.dataset.page);
    });
});

// RENDER ALL DATA
function renderAll() {
    saveData();
    renderDashboard();
    renderStudents();
    renderTeachers();
    renderAttendance();
    renderTimetable();
    renderResults();
    renderFees();
    renderAnnouncements();
}

// DASHBOARD
function renderDashboard() {

    document.getElementById("studentCount").textContent =
        students.length;

    document.getElementById("teacherCount").textContent =
        teachers.length;

    const today = new Date().toLocaleDateString("en-CA");

    const present = students.filter(student =>
        attendance[`${today}_${student.id}`] === "Present"
    ).length;

    document.getElementById("presentCount").textContent =
        present;

    let collected = students.reduce((total, student) => {
        return total + (
            fees[student.id] === "Paid" ? 5000 : 0
        );
    }, 0);

    document.getElementById("feeCount").textContent =
        "₹" + collected.toLocaleString("en-IN");

    const recent = announcements.slice(0, 3);

    document.getElementById("dashboardAnnouncements").innerHTML =
        recent.map(item => `
            <div class="announcement">
                <h4>${escapeHTML(item.title)}</h4>
                <p>${escapeHTML(item.message)}</p>
            </div>
        `).join("");
}

// STUDENT MANAGEMENT
function renderStudents(search = "") {

    const filtered = students.filter(student =>
        `${student.name} ${student.class} ${student.email}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const table = document.getElementById("studentTable");

    table.innerHTML = filtered.map(student => `
        <tr>
            <td>${student.id}</td>
            <td>${escapeHTML(student.name)}</td>
            <td>${escapeHTML(student.class)}</td>
            <td>${escapeHTML(student.email)}</td>
            <td class="admin-only">
                <button class="action-btn delete-btn"
                    onclick="deleteStudent(${student.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");

    if (currentRole === "student") {
        table.querySelectorAll(".admin-only").forEach(element => {
            element.style.display = "none";
        });
    }
}

// SEARCH STUDENTS
document.getElementById("studentSearch").addEventListener("input", function() {
    renderStudents(this.value);
});

// ADD STUDENT MODAL
const studentModal = document.getElementById("studentModal");

document.getElementById("addStudentBtn").addEventListener("click", function() {
    studentModal.classList.remove("hidden");
});

document.getElementById("closeStudentModal").addEventListener("click", function() {
    studentModal.classList.add("hidden");
});

// ADD NEW STUDENT
document.getElementById("studentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    if (currentRole !== "admin") return;

    const name = document.getElementById("newStudentName").value.trim();
    const studentClass = document.getElementById("newStudentClass").value.trim();
    const email = document.getElementById("newStudentEmail").value.trim();

    if (students.some(s => s.email.toLowerCase() === email.toLowerCase())) {
        alert("A student with this email already exists.");
        return;
    }

    const newStudent = {
        id: students.length
            ? Math.max(...students.map(s => s.id)) + 1
            : 101,
        name,
        class: studentClass,
        email
    };

    students.push(newStudent);

    saveData();
    renderAll();

    this.reset();
    studentModal.classList.add("hidden");

    alert("Student added successfully!");
});

// DELETE STUDENT
function deleteStudent(id) {

    if (currentRole !== "admin") return;

    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    students = students.filter(student => student.id !== id);

    delete fees[id];

    Object.keys(attendance).forEach(key => {
        if (key.endsWith(`_${id}`)) {
            delete attendance[key];
        }
    });

    saveData();
    renderAll();
}

// TEACHER MANAGEMENT
function renderTeachers() {

    document.getElementById("teacherTable").innerHTML =
        teachers.map(teacher => `
            <tr>
                <td>${teacher.id}</td>
                <td>${escapeHTML(teacher.name)}</td>
                <td>${escapeHTML(teacher.subject)}</td>
                <td>${escapeHTML(teacher.email)}</td>
            </tr>
        `).join("");
}

// ATTENDANCE MANAGEMENT
function renderAttendance() {

    const today = new Date().toLocaleDateString("en-CA");

    document.getElementById("attendanceTable").innerHTML =
        students.map(student => {

            const key = `${today}_${student.id}`;
            const status = attendance[key] || "Not Marked";

            return `
                <tr>
                    <td>${escapeHTML(student.name)}</td>
                    <td>${escapeHTML(student.class)}</td>
                    <td>
                        <span class="status ${
                            status === "Present" ? "present" :
                            status === "Absent" ? "absent" : ""
                        }">
                            ${status}
                        </span>

                        ${currentRole === "admin" ? `
                            <button class="action-btn"
                                onclick="toggleAttendance(${student.id})">
                                Change
                            </button>
                        ` : ""}
                    </td>
                </tr>
            `;
        }).join("");
}

// MARK ATTENDANCE
function toggleAttendance(id) {

    if (currentRole !== "admin") return;

    const today = new Date().toLocaleDateString("en-CA");
    const key = `${today}_${id}`;

    attendance[key] =
        attendance[key] === "Present" ? "Absent" : "Present";

    saveData();
    renderAttendance();
    renderDashboard();
}

// TIMETABLE
function renderTimetable() {

    document.getElementById("timetableTable").innerHTML =
        defaultTimetable.map(day => `
            <tr>
                ${day.map(subject => `
                    <td>${escapeHTML(subject)}</td>
                `).join("")}
            </tr>
        `).join("");
}

// RESULTS
function renderResults() {

    document.getElementById("resultTable").innerHTML =
        results.map(student => {

            const total =
                student.math + student.science + student.english;

            const result = total >= 105 ? "Pass" : "Fail";

            return `
                <tr>
                    <td>${escapeHTML(student.name)}</td>
                    <td>${student.math}</td>
                    <td>${student.science}</td>
                    <td>${student.english}</td>
                    <td>${total}/300</td>
                    <td>
                        <span class="status ${
                            result === "Pass" ? "paid" : "unpaid"
                        }">${result}</span>
                    </td>
                </tr>
            `;
        }).join("");
}

// FEE MANAGEMENT
function renderFees() {

    document.getElementById("feeTable").innerHTML =
        students.map(student => {

            const status = fees[student.id] || "Unpaid";

            return `
                <tr>
                    <td>${escapeHTML(student.name)}</td>
                    <td>₹5,000</td>
                    <td>
                        <span class="status ${
                            status === "Paid" ? "paid" : "unpaid"
                        }">
                            ${status}
                        </span>
                    </td>
                    <td class="admin-only">
                        <button class="action-btn"
                            onclick="toggleFee(${student.id})">
                            Update
                        </button>
                    </td>
                </tr>
            `;
        }).join("");

    if (currentRole === "student") {
        document.querySelectorAll("#feeTable .admin-only")
            .forEach(element => element.style.display = "none");
    }
}

// UPDATE FEE STATUS
function toggleFee(id) {

    if (currentRole !== "admin") return;

    fees[id] = fees[id] === "Paid" ? "Unpaid" : "Paid";

    saveData();
    renderFees();
    renderDashboard();
}

// ANNOUNCEMENTS
function renderAnnouncements() {

    document.getElementById("announcementList").innerHTML =
        announcements.map(item => `
            <div class="announcement">
                <h4>📢 ${escapeHTML(item.title)}</h4>
                <p>${escapeHTML(item.message)}</p>
            </div>
        `).join("");
}

// ADD ANNOUNCEMENT
document.getElementById("addAnnouncementBtn")
    .addEventListener("click", function() {

        if (currentRole !== "admin") return;

        const title = prompt("Enter announcement title:");

        if (!title || !title.trim()) return;

        const message = prompt("Enter announcement message:");

        if (!message || !message.trim()) return;

        announcements.unshift({
            title: title.trim(),
            message: message.trim()
        });

        saveData();
        renderAnnouncements();
        renderDashboard();

        alert("Announcement added successfully!");
    });

// CONTACT FORM
document.getElementById("contactForm")
    .addEventListener("submit", function(e) {

        e.preventDefault();

        const name = document.getElementById("contactName").value;
        const message = document.getElementById("contactMessage").value;

        alert(
            "Thank you, " + name +
            "! Your message has been received in this demo."
        );

        this.reset();
    });

// BASIC HTML ESCAPING
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// INITIAL PAGE
showPage("dashboard");
