import { api } from "./apiClient";

export function login(payload) {
  return api("/auth/login", { method: "POST", body: JSON.stringify(payload) });
}

export function register(payload) {
  return api("/auth/register", { method: "POST", body: JSON.stringify(payload) });
}