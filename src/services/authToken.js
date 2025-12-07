const ACCESS_TOKEN_KEY = "accessToken";

export function setAccessToken(token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getCurrentUserId() {
    const token = getAccessToken();
    if(!token) return null;

    try {
        const parts = token.split(".");
        if(parts.length !== 3) return null;

        const payloadBase64 = parts[1]
            .replace(/-/g, "+")
            .replace(/-/g, "/");

        const json = JSON.parse(atob(payloadBase64));

        return json.sub || json.userId || null;
    } catch (e) {
        console.error("Failed to parse JWT payload", e);
        return null;
    }
}