import { api } from "./apiClient";

export async function login({ email, password }) {
  return api("/v1/user/login/email", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register({ name, email, password }) {
  return api("/v1/user/signup/email", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      nickname: name,
    }),
  });
}

export async function update(payload) {
  return api("/v1/user/update", { method: "PUT", body: JSON.stringify(payload)})
}