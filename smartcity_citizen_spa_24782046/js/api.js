async function requestAPI(endpoint, method = 'GET', payload = null) {
    const baseUrl = 'http://103.151.63.86:8001/'; 
    const token = localStorage.getItem('accessToken');

    console.log('Token yang dikirim:', token);

    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers
    };

    if (payload && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(payload);
    }

    try {
        const response = await fetch(`${baseUrl}${endpoint.replace(/^\//, '')}`, options);

        console.log(`Status Response (${endpoint}):`, response.status);

        if (response.status === 401) {
            alert('Session login habis. Silakan login ulang.');
            localStorage.removeItem('accessToken');
            window.location.hash = 'login';
            if (typeof handleRouting === 'function') {
                handleRouting();
            }
            return null;
        }

        let data = {};
        try {
            data = await response.json();
        } catch {
            data = {};
        }

        return {
            status: response.status,
            data
        };

    } catch (error) {
        console.error('API Request Error:', error);
        alert('Gagal terhubung ke server Django.');
        return null;
    }
}