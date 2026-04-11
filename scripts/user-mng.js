const API_URL = "http://localhost:3000/api/users";

//my array of users
let users = [];
let currentUser = null;

//initialising  page elements so i resuse them later without having to query the DOM again and again
const userSection = document.getElementById("userSection");
const detailSection = document.getElementById("userDetailSection");
const tbody = document.getElementById("userTableBody");

const detailName = document.getElementById("detailName");
const detailEmail = document.getElementById("detailEmail");
const detailRole = document.getElementById("detailRole");

const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");

const welcomeRow = document.getElementById("welcomeRow");

//functionality to open a  user on click and load the details view
async function openUsers(e) {
    //this prevents page reload
    if (e) e.preventDefault();

    localStorage.setItem("currentPage", "users");
    localStorage.removeItem("selectedUserId");

    currentUser = null;

    showUsersView();
    await loadUsers();
}

//fetch users from backend
async function loadUsers() {
    try {
        const res = await fetch(API_URL);
        users = await res.json();

        renderUsers();
        restoreUserAfterReload();

    } catch (err) {
        console.error(err);
        alert("Failed to load users");
    }
}

//restore selected user after reload
function restoreUserAfterReload() {
    const savedId = localStorage.getItem("selectedUserId");
    if (!savedId) return;

    const found = users.find(u => u._id === savedId);
    if (found) openUserDetails(found);
}

//render users table
function renderUsers() {
    tbody.innerHTML = "";

    let searchValue = searchInput.value.toLowerCase();
    let roleValue = roleFilter.value;

    let filtered = users;

    //hide welcome once data is shown
    if (welcomeRow) {
        welcomeRow.style.display = "none";
    }

    //search filter
    if (searchValue) {
        filtered = filtered.filter(u =>
            u.username.toLowerCase().includes(searchValue) ||
            u.email.toLowerCase().includes(searchValue)
        );
    }

     //role filter
    if (roleValue !== "all") {
        filtered = filtered.filter(u => u.role === roleValue);
    }

       if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3">No users</td></tr>`;
        return;
     }

    filtered.forEach(user => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
        `;

        tr.onclick = () => openUserDetails(user);

        tbody.appendChild(tr);
      });
}

//open user details view
function openUserDetails(user) {
    currentUser = user;

    localStorage.setItem("selectedUserId", user._id);
    localStorage.setItem("currentPage", "detail");

    showDetailView();

    detailName.textContent = user.username;
    detailEmail.textContent = user.email;
    detailRole.value = user.role;
}

//update user role
async function updateUser() {
    if (!currentUser) return;

    try {
        const res = await fetch(`${API_URL}/${currentUser._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: detailRole.value })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Update failed");
            return;
        }

        alert("User updated");
        await loadUsers();

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

//delete user
async function deleteUser() {
    if (!currentUser) return;
    if (!confirm("Delete this user?")) return;

    try {
        const res = await fetch(`${API_URL}/${currentUser._id}`, {
            method: "DELETE"
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Delete failed");
            return;
        }

        alert("User deleted");

        currentUser = null;
        localStorage.removeItem("selectedUserId");

        await loadUsers();
        goBack();

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

//go back to users list
function goBack() {
    currentUser = null;

    localStorage.setItem("currentPage", "users");
    localStorage.removeItem("selectedUserId");

    showUsersView();
}

//show users section
function showUsersView() {
    detailSection.classList.add("hidden");
    userSection.classList.remove("hidden");

    //reset welcome when returning
    if (welcomeRow && users.length === 0) {
        welcomeRow.style.display = "table-row";
    }
}

//show detail section
function showDetailView() {
    userSection.classList.add("hidden");
    detailSection.classList.remove("hidden");
}

//live search + filter
searchInput.addEventListener("input", renderUsers);
roleFilter.addEventListener("change", renderUsers);

//this makes the functions available in the global scope so i can call them from the HTML onclick attributes
window.openUsers = openUsers;
window.updateUser = updateUser;
window.deleteUser = deleteUser;
window.goBack = goBack;

//initial load + restore state
window.onload = async function () {
    await loadUsers();

    const page = localStorage.getItem("currentPage");
    const savedId = localStorage.getItem("selectedUserId");

    if (page === "detail" && savedId) {
        const user = users.find(u => u._id === savedId);
        if (user) openUserDetails(user);
        return;
    }

    if (page === "users") {
        showUsersView();
        return;
    }
};
