import { api } from "./apiClient";

export async function sendFriendRequest(friendCode) {
    return api("/v1/friendships/request", {
        method: "POST",
        body: JSON.stringify({ friendCode }),
    });
}

export async function fetchIncomingRequests(status = "PENDING") {
    const query = status ? `?status=${status}` : "";
    return api(`/v1/friendships/incoming${query}`);
}

export async function fetchOutgoingRequests(status = "PENDING") {
    const query = status ? `?status=${status}` : "";
    return api(`/v1/friendships/outgoing${query}`);
}

export async function fetchMyFriends() {
    return api("/v1/friendships/my");
}

export async function acceptFriendRequest(friendshipId) {
    return api(`/v1/friendships/${friendshipId}/accept`, {
        method: "POST",
    });
}

export async function rejectFriendRequest(friendshipId) {
    return api(`/v1/friendships/${friendshipId}/reject`, {
        method: "POST",
    });
}

export async function unfriend(friendshipId) {
    return api(`/v1/friendships/${friendshipId}`, {
        method: "DELETE",
    });
}

export async function cancelFriendRequest(friendshipId) {
    return api(`/v1/friendships/${friendshipId}/cancel`, {
        method: "POST",
    });
}