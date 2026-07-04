function decodeToken(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

function updateUserInfo() {
    const token = localStorage.getItem('accessToken');
    if (token) {
        const payload = decodeToken(token);
        if (payload) {
            const profileName = document.getElementById('profileName');
            const profileRole = document.getElementById('profileRole');
            if (profileName) profileName.innerText = payload.username || 'Pengguna';
            if (profileRole) profileRole.innerText = payload.role || 'Citizen';
        }
    }
}

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    const username = usernameInput ? usernameInput.value : '';
    const password = passwordInput ? passwordInput.value : '';

    try {
        const response = await fetch('http://103.151.63.86:8001/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.status === 200) {
            localStorage.setItem('accessToken', data.access);
            alert('Login berhasil!');

            updateUserInfo();

            const loginSec = document.getElementById('loginSection');
            const dashSec = document.getElementById('dashboardSection');
            
            if (loginSec) loginSec.style.display = 'none';
            if (dashSec) dashSec.style.display = 'block';

            if (typeof loadDashboardData === 'function') {
                loadDashboardData();
            }
        } else {
            alert('Username atau password salah.');
        }
    } catch (error) {
        console.error(error);
        alert('Gagal terhubung ke server.');
    }
});

const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.addEventListener('click', function() {
        localStorage.removeItem('accessToken');
        alert('Anda telah keluar dari sistem.');
        
        const loginSec = document.getElementById('loginSection');
        const dashSec = document.getElementById('dashboardSection');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        
        if (dashSec) dashSec.style.display = 'none';
        if (loginSec) loginSec.style.display = 'block';
        if (usernameInput) usernameInput.value = '';
        if (passwordInput) passwordInput.value = '';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('accessToken')) {
        updateUserInfo();
        const loginSec = document.getElementById('loginSection');
        const dashSec = document.getElementById('dashboardSection');
        
        if (loginSec && dashSec) {
            loginSec.style.display = 'none';
            dashSec.style.display = 'block';
            
            if (typeof loadDashboardData === 'function') {
                loadDashboardData();
            }
        }
    }
});