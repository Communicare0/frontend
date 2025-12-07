import { API_BASE_URL } from "@/config/env";
import { getAccessToken } from "./authToken";

export async function api(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const baseHeaders = {
    "Content-Type": "application/json",
    ...(options.headers || {}), 
  }

  const isAuthPath = path.startsWith("/v1/user/");
  let headers = baseHeaders;

  if(!isAuthPath) {
    const token = getAccessToken();
    if(token) {
      headers = {
        ...baseHeaders,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    let message = "API 요청 실패";
    try {
        const errJson = JSON.parse(errorText);
        message = errJson.message || message;
    } catch {}
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  const text = await res.text();

  if (!text) return null;

  return JSON.parse(text);
}