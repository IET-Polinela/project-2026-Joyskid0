function showSection(section) {
    const loginSec = document.getElementById('loginSection');
    const dashSec = document.getElementById('dashboardSection');
    if (section === 'login') {
        if (loginSec) loginSec.style.display = 'block';
        if (dashSec) dashSec.style.display = 'none';
    } else {
        if (loginSec) loginSec.style.display = 'none';
        if (dashSec) dashSec.style.display = 'block';
    }
}

function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.hash = '#login';
    handleRouting();
}

function handleRouting() {
    const token = localStorage.getItem('access_token');
    const hash = window.location.hash;

    if (!token) {
        if (window.location.hash !== '#login') {
            window.location.hash = '#login';
        }
        showSection('login');
    } else {
        if (hash === '#login' || hash === '') {
            window.location.hash = '#dashboard';
        }
        showSection('dashboard');
        if (typeof updateUserInfo === 'function') {
            updateUserInfo();
        }
        if (typeof loadDashboardData === 'function') {
            loadDashboardData('my_reports', 1);
        }
    }
}

window.addEventListener('hashchange', handleRouting);
window.addEventListener('DOMContentLoaded', handleRouting);