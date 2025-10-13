const API = import.meta.env.VITE_API_URL;

export async function ping() {
    const r = await fetch(`${API}/health`);
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.text();
}

if(!API) {
    console.warn(
        "[env] VITE_API_URL이 비어 있습니다. Vercel/로컬 .env에 설정하세요."
    );
}