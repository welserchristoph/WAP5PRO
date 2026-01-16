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
                'refresh_token': oldRefreshToken, // Wir schicken das alte...
                'client_id': 'client'
            })
        });

        if (response.ok) {
            const data = await response.json();
            
            // 1. Neues Access Token speichern
            localStorage.setItem('accessToken', data.access_token);
            
            // 2. WICHTIG: Das NEUE Refresh Token vom Server speichern!
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

        // Wenn 401, dann Refresh versuchen
        if (response.status === 401) {
            const success = await tryTokenRefresh();
            if (success) {
                // Frisches Token holen
                const newToken = localStorage.getItem('accessToken');
                const retryHeaders = {
                    ...headers,
                    'Authorization': `Bearer ${newToken}`
                };
                
                // WICHTIG: Den retry-Fetch direkt zurückgeben (return)
                console.log("Wiederhole Anfrage mit neuem Token...");
                return await fetch(`${BASE_URL}${endpoint}`, { ...options, headers: retryHeaders });
            } else {
                console.warn("Refresh fehlgeschlagen, logge aus...");
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                
                // Umleitung nur, wenn wir nicht schon beim Login sind
                //if (window.location.pathname !== '/login') {
                //    window.location.href = '/login';
                //}
                return null;
            }
        }

        return response;
    } catch (error) {
        console.error("Netzwerkfehler im apiRequest:", error);
        throw error; // Fehler weiterwerfen, damit Jonas' .catch() greift
    }
}