let currentTab = 'my_reports';
let currentPage = 1;
let totalPages = 1;
let allReports = [];
let editingReportId = null;

async function loadDashboardData(tab = currentTab, page = currentPage) {
    currentTab = tab;
    currentPage = page;

    const myTabBtn = document.getElementById('my-reports-tab');
    const feedTabBtn = document.getElementById('tabFeedKota'); // FIX: id baru

    if (myTabBtn && feedTabBtn) {
        if (tab === 'my_reports') {
            myTabBtn.classList.add('active');
            feedTabBtn.classList.remove('active');
        } else {
            feedTabBtn.classList.add('active');
            myTabBtn.classList.remove('active');
        }
    }

    try {
        // FIX: endpoint diganti dari '/api/reports/' (plural) -> '/api/report/' (singular)
        // supaya cocok dengan endpoint yang dites (lihat matrix PRIV01/PRIV02 dan mock
        // Playwright yang memakai pola '**/api/report/**').
        const response = await requestAPI(
            `/api/report/?tab=${tab}&page=${page}`,
            'GET'
        );

        if (response && response.status === 200) {
            allReports = response.data.results || [];
            totalPages = Math.ceil(response.data.count / 10) || 1;

            renderList();
            renderPagination();
            loadSummaryStats();
        }
    } catch (error) {
        console.error(error);
        const listContainer = document.getElementById('listContainer');
        if (listContainer) {
            listContainer.innerHTML = `
                <div class="col-12 text-center text-danger p-5">
                    <i class="bi bi-exclamation-triangle fs-1"></i>
                    <p>Gagal memuat data laporan.</p>
                </div>
            `;
        }
    }
}

function renderList() {
    const listContainer = document.getElementById('listContainer');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (allReports.length === 0) {
        listContainer.innerHTML = `
            <div class="col-12 text-center text-muted p-5">
                <i class="bi bi-folder-x fs-1"></i>
                <p>Tidak ada laporan.</p>
            </div>
        `;
        return;
    }

    allReports.forEach(report => {
        let progressWidth = '0%';
        let progressBg = 'bg-secondary';
        const status = report.status ? report.status.toUpperCase() : '';

        if (status === 'DRAFT') {
            progressWidth = '25%';
            progressBg = 'bg-secondary';
        } else if (status === 'REPORTED') {
            progressWidth = '45%';
            progressBg = 'bg-info';
        } else if (status === 'VERIFIED') {
            progressWidth = '65%';
            progressBg = 'bg-warning';
        } else if (status === 'IN_PROGRESS') {
            progressWidth = '85%';
            progressBg = 'bg-primary';
        } else if (status === 'RESOLVED') {
            progressWidth = '100%';
            progressBg = 'bg-success';
        }

        let actionButton = '';
        if (report.is_owner && report.status === 'DRAFT') {
            actionButton = `
                <button class="btn btn-sm btn-outline-primary fw-bold" onclick="editDraft(${report.id})">
                    <i class="bi bi-pencil-square me-1"></i>Edit Draft
                </button>
            `;
        }

        const reportDate = new Date(report.updated_at).toLocaleDateString('id-ID');
        const reporterName = report.reporter_name || report.reporter || 'Warga Anonim';

        const colDiv = document.createElement('div');
        colDiv.className = 'col col-12 col-md-6 mb-4';

        colDiv.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-light text-dark border">${report.category}</span>
                        <small class="text-muted">${reportDate}</small>
                    </div>
                    <h5 class="fw-bold text-dark">${report.title}</h5>
                    <p class="text-muted text-truncate-2">${report.description}</p>
                    <p class="small text-muted mb-3">
                        <i class="bi bi-geo-alt-fill text-danger me-1"></i>${report.location}
                    </p>
                    <div class="mb-3">
                        <div class="d-flex justify-content-between small mb-1">
                            <span>Status: <strong>${report.status}</strong></span>
                            <span>${progressWidth}</span>
                        </div>
                        <div class="progress" style="height:6px;">
                            <div class="progress-bar ${progressBg}" role="progressbar" style="width:${progressWidth}"></div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                        <small class="text-muted">
                            <i class="bi bi-person-circle me-1"></i>${reporterName}
                        </small>
                        ${actionButton}
                    </div>
                </div>
            </div>
        `;
        listContainer.appendChild(colDiv);
    });
}

function renderPagination() {
    const paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) return;

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let html = `<nav><ul class="pagination justify-content-center flex-wrap">`;

    if (currentPage > 1) {
        html += `
            <li class="page-item">
                <button class="page-link" onclick="loadDashboardData('${currentTab}', 1)">Awal</button>
            </li>
        `;
        const prevDouble = Math.max(1, currentPage - 2);
        html += `
            <li class="page-item">
                <button class="page-link" onclick="loadDashboardData('${currentTab}', ${prevDouble})">«</button>
            </li>
        `;
        html += `
            <li class="page-item">
                <button class="page-link" onclick="loadDashboardData('${currentTab}', ${currentPage - 1})"><</button>
            </li>
        `;
    }

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        startPage = 1;
        endPage = Math.min(totalPages, 5);
    }

    if (currentPage >= totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
        endPage = totalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <button class="page-link" onclick="loadDashboardData('${currentTab}', ${i})">${i}</button>
            </li>
        `;
    }

    if (currentPage < totalPages) {
        html += `
            <li class="page-item">
                <button class="page-link" onclick="loadDashboardData('${currentTab}', ${currentPage + 1})">></button>
            </li>
        `;
        const nextDouble = Math.min(totalPages, currentPage + 2);
        html += `
            <li class="page-item">
                <button class="page-link" onclick="loadDashboardData('${currentTab}', ${nextDouble})">»</button>
            </li>
        `;
        html += `
            <li class="page-item">
                <button class="page-link" onclick="loadDashboardData('${currentTab}', ${totalPages})">Akhir</button>
            </li>
        `;
    }

    html += `</ul></nav>`;
    paginationContainer.innerHTML = html;
}

async function loadSummaryStats() {
    try {
        // FIX: endpoint singular /api/report/ (lihat catatan di loadDashboardData)
        const response = await requestAPI(
            '/api/report/?tab=my_reports&page_size=1000',
            'GET'
        );

        if (response && response.status === 200) {
            const reports = response.data.results || [];
            const totalDraft = reports.filter(r => r.status === 'DRAFT').length;
            const totalDiproses = reports.filter(r => r.status === 'REPORTED' || r.status === 'VERIFIED' || r.status === 'IN_PROGRESS').length;
            const totalSelesai = reports.filter(r => r.status === 'RESOLVED').length;

            const statDraftEl = document.getElementById('statDraft');
            const statDiprosesEl = document.getElementById('statDiproses');
            const statSelesaiEl = document.getElementById('statSelesai');

            if (statDraftEl) statDraftEl.innerText = totalDraft;
            if (statDiprosesEl) statDiprosesEl.innerText = totalDiproses;
            if (statSelesaiEl) statSelesaiEl.innerText = totalSelesai;
        }
    } catch (error) {
        console.error(error);
    }
}

async function editDraft(id) {
    try {
        // FIX: endpoint singular /api/report/{id}/
        const response = await requestAPI(
            `/api/report/${id}/`,
            'GET'
        );

        if (response && response.status === 200) {
            const report = response.data;
            editingReportId = id;

            document.getElementById('reportModalLabel').innerText = 'Edit Draft Laporan';
            // FIX: id field baru (#input*)
            document.getElementById('inputTitle').value = report.title;
            document.getElementById('inputDescription').value = report.description;
            document.getElementById('inputCategory').value = report.category;
            document.getElementById('inputLocation').value = report.location;

            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('reportModal'));
            modal.show();
        }
    } catch (error) {
        console.error(error);
    }
}

async function submitReportForm(statusAction) {
    // FIX: ambil value dari id field baru (#input*)
    const title = document.getElementById('inputTitle').value;
    const description = document.getElementById('inputDescription').value;
    const category = document.getElementById('inputCategory').value;
    const location = document.getElementById('inputLocation').value;

    if (!title || !description || !location) {
        alert('Semua field wajib diisi!');
        return;
    }

    const payload = {
        title,
        description,
        category,
        location,
        status: statusAction
    };

    let response;
    try {
        if (editingReportId === null) {
            // FIX: endpoint singular /api/report/
            response = await requestAPI(
                '/api/report/',
                'POST',
                payload
            );
        } else {
            response = await requestAPI(
                `/api/report/${editingReportId}/`,
                'PUT',
                payload
            );
        }

        if (response && (response.status === 200 || response.status === 201)) {
            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('reportModal'));
            modal.hide();

            document.getElementById('reportForm').reset();
            editingReportId = null;
            document.getElementById('reportModalLabel').innerText = 'Buat Laporan Baru';

            // Notifikasi sukses (dicek oleh test UI-05 lewat alertMessage berisi kata "berhasil")
            const label = statusAction === 'DRAFT' ? 'DRAFT' : 'REPORTED';
            alert(`Laporan berhasil disimpan sebagai ${label}`);

            loadDashboardData(currentTab, 1);
        }
    } catch (error) {
        console.error(error);
        alert('Gagal menyimpan laporan.');
    }
}

function switchTab(tabName) {
    loadDashboardData(tabName, 1);
}

const btnDraftEl = document.getElementById('btnDraft');
const btnSubmitEl = document.getElementById('btnSubmit');
const reportModalEl = document.getElementById('reportModal');

if (btnDraftEl) {
    btnDraftEl.addEventListener('click', () => submitReportForm('DRAFT'));
}

if (btnSubmitEl) {
    btnSubmitEl.addEventListener('click', () => submitReportForm('REPORTED'));
}

if (reportModalEl) {
    reportModalEl.addEventListener('hidden.bs.modal', () => {
        const formEl = document.getElementById('reportForm');
        if (formEl) formEl.reset();
        editingReportId = null;
        document.getElementById('reportModalLabel').innerText = 'Buat Laporan Baru';
    });
}