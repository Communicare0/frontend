import { useEffect, useState } from "react";
import { NavigationType, useNavigate } from "react-router-dom";
import {
    fetchMyFriends,
    fetchIncomingRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
} from "@/services/friendApi";
import ChatSideNav from "@/components/chat/ChatSideNav";
import { createChatRoom } from "@/services/chatApi";
import { getCurrentUserId } from "@/services/authToken";

import s from "@styles/modules/chat/FriendPage.module.css";

export default function FriendPage() {
    const [friends, setFriends] = useState([]);
    const [incoming, setIncoming] = useState([]);
    const [friendCode, setFriendCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [myUserId, setMyUserId] = useState(null);

    const navigate = useNavigate();

    const reload = async () => {
        try {
            setLoading(true);

            const meId = getCurrentUserId();
            setMyUserId(meId);

            const [friendsData, incomingData] = await Promise.all([
                fetchMyFriends(),
                fetchIncomingRequests(),
            ]);

            setFriends(friendsData || []);
            setIncoming(incomingData || []);
        } catch (err) {
            console.error(err);
            setError(err.message ||"친구 정보 로딩 실패");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        reload();
    }, []);

    const handleAddFriend = async (e) => {
        e.preventDefault();
        if(!friendCode.trim()) return;
        try {
            await sendFriendRequest(friendCode.trim());
            setFriendCode("");
            await reload();
        } catch (err) {
            console.error(err);
            setError(err.message || "친구 요청 실패");
        }
    };

    const handleAccept = async (friendshipId) => {
        try {
            await acceptFriendRequest(friendshipId);
            await reload();
        } catch (err) {
            console.error(err);
            setError(err.message || "친구 요청 수락 실패");
        }
    };

    const handleReject = async (friendshipId) => {
        try {
            await rejectFriendRequest(friendshipId);
            await reload();
        } catch (err) {
            console.error(err);
            setError(err.message || "친구 요청 거절 실패");
        }
    };

    const handleStartChat = async (friendship) => {
        try {
            if(!myUserId) {
                setError("사용자 정보를 확인할 수 없습니다. 다시 로그인해 주세요.");
                return;
            }

            const { requesterId, addresseeId } = friendship;
            const isRequesterMe = requesterId === myUserId;
            const otherId = isRequesterMe ? addresseeId : requesterId;

            const payload = {
                chatRoomType: "DIRECT",
                title: null,
                photoUrl: null,
                memberIds: [myUserId, otherId],
            };

            await createChatRoom(payload);

            navigate("/chat");
        } catch (err) {
            console.error(err);
            setError(err.message || "채팅방 생성 실패");
        }
    };

    return (
        <div className={s.pageWrapper}>
            <ChatSideNav />

            <div className={s.mainWrapper}>
                <aside className={s.sidebar}>
                    <h2 className={s.sideBarTitle}>My Friend</h2>
                    {loading && <div className={s.status}>로딩 중...</div>}
                    <ul className={s.friendList}>
                        {friends.map((f) => {
                            if(!myUserId) return null;
                            const { requesterId, requesterNickname, addresseeNickname } = f;
                            const isRequesterMe = requesterId === myUserId;
                            const friendName = isRequesterMe
                                ? addresseeNickname
                                : requesterNickname;

                            return (
                                <li key={f.friendshipId} className={s.friendItem}>
                                    <div className={s.friendInfo}>
                                        <div className={s.friendAvatar} />
                                        <div className={s.friendName}>{friendName || "Friend"}</div>
                                    </div>
                                    <button
                                        type="button"
                                        className={s.friendChatButton}
                                        onClick={() => handleStartChat(f)}
                                    >
                                        Chat
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </aside>

                <main className={s.main}>
                    <header className={s.header}>
                        <form className={s.addForm} onSubmit={handleAddFriend}>
                            <input
                                className={s.addInput}
                                placeholder="Add friend by code"
                                value={friendCode}
                                onChange={(e) => setFriendCode(e.target.value)}
                            />
                            <button className={s.addButton} type="submit">
                                Add
                            </button>
                        </form>
                    </header>

                    {error && <div className={s.error}>{error}</div>}

                    <section className={s.requestSection}>
                        <h3 className={s.sectionTitle}>Friend request</h3>
                        {incoming.length === 0 && (
                            <div claaName={s.status}>받은 친구 요청이 없습니다.</div>
                        )}
                        <ul className={s.requestList}>
                            {incoming.map((req) => (
                                <li key={req.friendshipId} className={s.requestItem}>
                                    <span className={s.request}>
                                        {req.requesterNickname || "Unknown"}
                                    </span>
                                    <div className={s.acceptButtons}>
                                        <button className={s.acceptButton} onClick={() => handleAccept(req.friendshipId)}>
                                            +
                                        </button>
                                        <button className={s.rejectButton} onClick={() => handleReject(req.friendshipId)}>
                                            x
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </main>
            </div>
        </div>
    );
}