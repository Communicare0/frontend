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
/*
import { API_BASE_URL } from "@/config/env";

// 🔥 팀원이 준 JWT 임시로 박아두기 (테스트 끝나면 꼭 지워)
const DEV_JWT = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2NTNjMGU1ZC04ZTA3LTRiNGUtOGUwMC0xZDAxZDRlNThlYzUiLCJpc3MiOiJDb21tdW5pY2FyZS1CYWNrZW5kIiwiaWF0IjoxNzY0NjAxNTk4LCJleHAiOjE3NjQ2MDUxOTh9.XN5H0mdujmh4-iGdVpf468ENma6IatsfEWzuD9WwBlI";

export async function api(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // 🔥 여기서 Authorization 자동 추가
  if (DEV_JWT) {
    headers["Authorization"] = `Bearer ${DEV_JWT}`;
  }

  const res = await fetch(url, {
    credentials: "include",
    headers,
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    // body가 비어있으면 json 파싱하다 터지니까 text로만 봄
    console.error("API error raw body:", text);

    let message = "API 요청 실패";
    try {
      const data = JSON.parse(text);
      if (data.message) message = data.message;
    } catch (_) {
      // 그냥 무시
    }

    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  // 정상일 때만 json 시도
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
*/