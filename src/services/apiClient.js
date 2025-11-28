import { API_BASE_URL } from "@/config/env";

export async function api(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(options.headers || {}),
  };

  if(!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers,
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