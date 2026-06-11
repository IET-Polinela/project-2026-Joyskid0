function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const usernameInput = document.getElementById('loginUsername').value;
            const passwordInput = document.getElementById('loginPassword').value;

            const payload = {
                username: usernameInput,
                password: passwordInput
            };

            try {
                const response = await requestAPI('/api/token/', 'POST', payload);

                if (response.status === 200) {
                    const data = await response.json();
                    
                    localStorage.setItem('access_token', data.access);
                    localStorage.setItem('refresh_token', data.refresh);
                    
                    alert('Login Berhasil!');
                    window.location.hash = '#dashboard';
                } else {
                    alert('Login Gagal! Periksa kembali username dan password Anda.');
                }
            } catch (error) {
                alert('Tidak dapat terhubung ke server backend.');
            }
        });
    }
}

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
            document.getElementById('profileName').innerText = payload.username || 'Pengguna';
            document.getElementById('profileRole').innerText = payload.role || 'Citizen';
        }
    }
}

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

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

            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('dashboardSection').style.display = 'block';

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

document.getElementById('btnLogout').addEventListener('click', function() {
    localStorage.removeItem('accessToken');
    alert('Anda telah keluar dari sistem.');
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
});

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