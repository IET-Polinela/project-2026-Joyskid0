function handleNavbar() {
    const navMenus = document.getElementById('nav-menus');
    if (!navMenus) return;

    const token = localStorage.getItem('accessToken');
    if (token) {
        navMenus.innerHTML = `
            <button class="btn btn-light text-primary fw-bold btn-sm px-3 shadow-sm" onclick="logout()">
                <i class="bi bi-box-arrow-right me-1"></i>Keluar
            </button>
        `;
    } else {
        navMenus.innerHTML = '';
    }
}

function logout() {
    localStorage.removeItem('accessToken');
    window.location.hash = '#login';
    handleRouting();
}

function renderDashboard() {
    const content = document.getElementById('app-content');
    if (!content) return;

    content.innerHTML = `
        <div class="row">
            <div class="col-lg-3 mb-4">
                <div class="card border-0 shadow-sm p-3 mb-3">
                    <button class="btn btn-primary fw-bold w-100" data-bs-toggle="modal" data-bs-target="#reportModal">
                        <i class="bi bi-plus-circle me-2"></i>Laporan Baru
                    </button>
                </div>
                <div class="card border-0 shadow-sm p-3">
                    <h6 class="fw-bold mb-3">Rekap Status Saya</h6>
                    <div class="d-flex justify-content-between mb-2">
                        <span><i class="bi bi-pencil text-secondary me-2"></i>Draft</span>
                        <span class="badge bg-secondary" id="statDraft">0</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span><i class="bi bi-hourglass-split text-warning me-2"></i>Diproses</span>
                        <span class="badge bg-warning text-dark" id="statDiproses">0</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span><i class="bi bi-check-circle text-success me-2"></i>Selesai</span>
                        <span class="badge bg-success" id="statSelesai">0</span>
                    </div>
                </div>
            </div>
            <div class="col-lg-9">
                <ul class="nav nav-tabs border-0 mb-3" id="dashboardTabs" role="tablist">
                    <li class="nav-item">
                        <button class="nav-link active fw-bold border-0" id="my-reports-tab" onclick="switchTab('my_reports')">
                            Laporan Saya
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link fw-bold border-0" id="feed-tab" onclick="switchTab('feed')">
                            Feed Kota
                        </button>
                    </li>
                </ul>
                <div class="row g-3" id="listContainer"></div>
                <div class="mt-4" id="paginationContainer"></div>
            </div>
        </div>
    `;
    
    if (typeof loadDashboardData === 'function') {
        setTimeout(() => {
            loadDashboardData('my_reports', 1);
        }, 100);
    }
}

function renderLogin() {
    const content = document.getElementById('app-content');
    if (!content) return;

    content.innerHTML = `
        <div class="row justify-content-center mt-5">
            <div class="col-md-4">
                <div class="card border-0 shadow p-4">
                    <h3 class="text-center fw-bold text-primary mb-4">Masuk Portal Warga</h3>
                    <div id="loginAlert"></div>
                    <form id="loginFormSPA">
                        <div class="mb-3">
                            <label class="form-label fw-bold">Username</label>
                            <input type="text" id="loginUsername" class="form-control" required>
                        </div>
                        <div class="mb-4">
                            <label class="form-label fw-bold">Password</label>
                            <input type="password" id="loginPassword" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100 fw-bold py-2">Masuk</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.getElementById('loginFormSPA').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('accessToken', data.access);
                window.location.hash = '#dashboard';
                handleRouting();
            } else {
                const alertContainer = document.getElementById('loginAlert');
                alertContainer.innerHTML = `<div class="alert alert-danger py-2 small">Username atau password salah!</div>`;
            }
        } catch (err) {
            console.error(err);
        }
    });
}

function handleRouting() {
    const token = localStorage.getItem('accessToken');
    const hash = window.location.hash || '#dashboard';

    handleNavbar();

    if (!token) {
        if (window.location.hash !== '#login') {
            window.location.hash = '#login';
        }
        renderLogin();
    } else {
        if (hash === '#login' || hash === '#dashboard') {
            window.location.hash = '#dashboard';
            renderDashboard();
        }
    }
}

window.addEventListener('hashchange', handleRouting);
window.addEventListener('DOMContentLoaded', handleRouting);