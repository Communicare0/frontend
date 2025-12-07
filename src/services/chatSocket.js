// npmp install @stomp/stompjs sockjs

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getAccessToken } from "./authToken";
import { API_BASE_URL } from "@/config/env";

let stompClient = null;

export function connectChatSocket() {
    if(stompClient && stompClient.connected) {
        return stompClient;
    }

    const socketUrl = `${API_BASE_URL}/ws`;

    const socket = new SockJS(socketUrl);

    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        debug: () => {
            
        },
    });

    stompClient.activate();
    return stompClient;
}

export function subscribeRoom(chatRoomId, onMessage) {
    const client = connectChatSocket();

    const destination = `/topic/chat.room.${chatRoomId}`;

    if(client.connected) {
        return client.subscribe(destination, (frame) => {
            const body = JSON.parse(frame.body);
            onMessage(body);
        });
    }

    let subscription = null;
    client.onConnect = () => {
        subscription = client.subscribe(destination, (frame) => {
            const body = JSON.parse(frame.body);
            onMessage(body);
        });
    };

    return {
        unsubscribe: () => {
            if(subscription) {
                subscription.unsubscribe();
            }
        },
    };
}

export function sendChatMessageSocket({ chatRoomId, content }) {
    const client = connectChatSocket();

    const token = getAccessToken();
    if(!token) {
        throw new Error("로그인 토큰이 없습니다.");
    }

    const payload = JSON.stringify({ chatRoomId, content });

    client.publish({
        destination: "/app/chat.send",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: payload,
    });
}

export function disconnectChatSocket() {
    if(stompClient) {
        stompClient.deactivate();
        stompClient = null;
    }
}