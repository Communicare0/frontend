import { useState } from "react";
import { ping } from "../api";

export default function Ping() {
    const [resp, setResp] = useState("");
    const [err, setErr] = useState("");

    if(import.meta.env.PROD) return null;

    const onPing = async () => {
        try {
            setErr("");
            const t = await ping();
            setResp(t);
        } catch(e) {
            setErr(e?.message || String(e));
        }
    };

    return (
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
            <button onClick={onPing}>Ping /health</button>
            <div>Response: {resp || "(no data)"}</div>
            {err && <div style={{ color: "tomato" }}>Error: {err}</div>}
        </div>
    );
}