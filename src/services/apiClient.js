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

  if(!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message = errorBody.message || "API 요청 실패";
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  if(res.status === 204) {
    return null;
  }

  return res.json();
}