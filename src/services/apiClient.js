import { API_BASE_URL } from "@/config/env";

export async function api(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if(!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message = errorBody.message || "API 요청 실패";
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return res.json();
}