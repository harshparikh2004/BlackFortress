// ===== DASHBOARD JS =====

document.addEventListener('DOMContentLoaded', function () {
    // Try to get user from localStorage or sessionStorage
    let user = null;
    if (localStorage.getItem('user')) {
        user = JSON.parse(localStorage.getItem('user'));
    } else if (sessionStorage.getItem('user')) {
        user = JSON.parse(sessionStorage.getItem('user'));
    }
    if (user) {
        document.getElementById('dashboardUsername').textContent = user.username || '';
        document.getElementById('dashboardEmail').textContent = user.email || '';
        document.getElementById('dashboardRole').textContent = user.role || 'User';
        document.getElementById('dashboardCreated').textContent = user.createdAt ? new Date(user.createdAt).toLocaleString() : '';
    } else {
        // If no user info, redirect to login
        window.location.href = 'login.html';
    }

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function () {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('authToken');
        window.location.href = 'login.html';
    });
});
