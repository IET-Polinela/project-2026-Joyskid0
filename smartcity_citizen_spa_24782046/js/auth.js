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
    const token = localStorage.getItem('access_token');
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
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');

    const username = usernameInput ? usernameInput.value : '';
    const password = passwordInput ? passwordInput.value : '';
    try {
        const response = await fetch('http://103.151.63.86:8001/api/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.status === 200) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh || '');
            updateUserInfo();
            window.location.hash = '#dashboard';
            if (typeof handleRouting === 'function') {
                handleRouting();
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
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        window.location.hash = '#login';
        if (typeof handleRouting === 'function') {
            handleRouting();
        }
    });
}