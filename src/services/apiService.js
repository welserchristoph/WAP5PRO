const BASE_URL = "http://localhost:3000/api";

async function tryTokenRefresh() {
    const oldRefreshToken = localStorage.getItem('refreshToken');
    if (!oldRefreshToken) return false;

    try {
        const response = await fetch(`${BASE_URL}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                'grant_type': 'refresh_token',
                'refresh_token': oldRefreshToken, 
                'client_id': 'client'
            })
        });

        if (response.ok) {
            const data = await response.json();
            
            localStorage.setItem('accessToken', data.access_token);
            
            if (data.refresh_token) {
                console.log("Neues Refresh Token erhalten und gespeichert.");
                localStorage.setItem('refreshToken', data.refresh_token);
            }
            
            return true;
        }
    } catch (e) {
        console.error("Refresh Fehler:", e);
    }
    return false;
}

export async function apiRequest(endpoint, options = {}) {
    let token = localStorage.getItem('accessToken');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        let response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

        if (response.status === 401) {
            const success = await tryTokenRefresh();
            if (success) {
                const newToken = localStorage.getItem('accessToken');
                const retryHeaders = {
                    ...headers,
                    'Authorization': `Bearer ${newToken}`
                };
                
                console.log("Wiederhole Anfrage mit neuem Token...");
                return await fetch(`${BASE_URL}${endpoint}`, { ...options, headers: retryHeaders });
            } else {
                console.warn("Refresh fehlgeschlagen, logge aus...");
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                
                return null;
            }
        }

        return response;
    } catch (error) {
        console.error("Netzwerkfehler im apiRequest:", error);
        throw error;
    }
}