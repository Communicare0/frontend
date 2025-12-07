import { API_BASE_URL } from "@/config/env";
import { getAccessToken } from "./authToken";

const NO_AUTH_PATHS = [
  "/v1/user/login/email",
  "/v1/user/signup/email",
];

export async function api(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const baseHeaders = {
    "Content-Type": "application/json",
    ...(options.headers || {}), 
  };

  const needsAuth = !NO_AUTH_PATHS.includes(path);

  let headers = baseHeaders;
  if(needsAuth) {
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