import { api } from "./apiClient";

export async function fetchMyData() {
    return api("/v1/me/profile");
}

export async function fetchFriendCode() {
    return api("/v1/me/friend-code");
}