const ACCESS_TOKEN_KEY = "accessToken";
const LOGIN_EMAIL_KEY = "loginEmail";


/*
localStorage => 직접 로그아웃 안하면 계속 로그인 유지
sessionStorage => 브라우저 껐다 키면 상태 초기화
*/
export function setAccessToken(token) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken() {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearAccessToken() {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(LOGIN_EMAIL_KEY);
}

export function getCurrentUserId() {
    const token = getAccessToken();
    if(!token) return null;

    try {
        const parts = token.split(".");
        if(parts.length !== 3) return null;

        const payloadBase64 = parts[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const json = JSON.parse(atob(payloadBase64));

        return json.sub || json.userId || null;
    } catch (e) {
        console.error("Failed to parse JWT payload", e);
        return null;
    }
}

export function setLoginEmail(email) {
    sessionStorage.setItem(LOGIN_EMAIL_KEY, email);
}

export function getLoginEmail() {
    return sessionStorage.getItem(LOGIN_EMAIL_KEY);
}