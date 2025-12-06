import { api } from "./apiClient";

export async function fetchMyChatRooms() {
    return api("/v1/chat/rooms");
}

export async function createChatRoom(payload) {
    return api("/v1/chat/rooms", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function fetchRoomMessages(chatRoomId) {
    return api(`/v1/chat/messages/room/${chatRoomId}`);
}

export async function sendMessageRest({ chatRoomId, content }) {
    return api("v1/chat/messages", {
        method: "POST",
        body: JSON.stringify({ chatRoomId, content }),
    });
}