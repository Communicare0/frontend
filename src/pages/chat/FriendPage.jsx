import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    fetchMyFriends,
    fetchIncomingRequests,
    fetchOutgoingRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    unfriend,
    cancelFriendRequest,
} from "@/services/friendApi";
import ChatSideNav from "@/components/chat/ChatSideNav";
import { createChatRoom, fetchMyChatRooms } from "@/services/chatApi";
import { getCurrentUserId } from "@/services/authToken";

import s from "@styles/modules/chat/FriendPage.module.css";

export default function FriendPage() {
    const [friends, setFriends] = useState([]);
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);
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

            const [friendsData, incomingData, outgoingData] = await Promise.all([
                fetchMyFriends(),
                fetchIncomingRequests(),
                fetchOutgoingRequests(),
            ]);

            setFriends(friendsData || []);
            setIncoming(incomingData || []);
            setOutgoing(outgoingData || []);
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

            /*
            알림 시스템 연동되면 여기서 "친구 요청 보냄" 알림 생성
            await createNotification({
                type: "FRIEND_REQUEST_SENT",
                targetUserId: ...,
                payload: { friendCOde: friendCode.trim() },
            });
            이런 식으로
            */
        } catch (err) {
            console.error(err);
            setError(err.message || "친구 요청 실패");
        }
    };

    const handleAccept = async (friendshipId) => {
        try {
            await acceptFriendRequest(friendshipId);
            await reload();

            /*
            알림 시스템 연동되면 여기서 "친구 요청 수락됨" 알림 생성
            await createNotification({
                type: "FRIEND_REQUEST_ACCEPTED",
                targetUserId: ...,
                payload: { friendshipId },
            });
            이런 식으로
            */
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

    const handleDeleteFriend = async (friendshipId) => {
        try {
            await unfriend(friendshipId);
            await reload();
        } catch (err) {
            console.error(err);
            setError(err.message || "친구 삭제 실패")
        }
    };

    const handleStartChat = async (friendship) => {
        try {
            if(!myUserId) {
                setError("사용자 정보를 확인할 수 없습니다. 다시 로그인해 주세요.");
                return;
            }

            const { requesterId, addresseeId, requesterNickname, addresseeNickname } = friendship;
            const isRequesterMe = requesterId === myUserId;
            const otherId = isRequesterMe ? addresseeId : requesterId;

            const friendName = isRequesterMe ? addresseeNickname : requesterNickname;

            const rooms = await fetchMyChatRooms();
            const existing = (rooms || []).find((r) => {
                if(r.chatRoomType !== "DIRECT") return false;
                const members = r.membersId || [];
                const hasMe = members.includes(myUserId);
                const hasOther = members.includes(otherId);
                return hasMe && hasOther && members.length === 2;
            });
            if(existing) {
                navigate("/chat", {
                    state: { initialRoomId: existing.chatRoomId },
                });
                return;
            }

            const payload = {
                chatRoomType: "DIRECT",
                title: friendName || null,
                photoUrl: null,
                memberIds: [myUserId, otherId],
            };

            const created = await createChatRoom(payload);

            navigate("/chat", {
                state: { initialRoomId: created.chatRoomId },
            });
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
                            const { requesterId, requesterNickname, addresseeNickname, friendshipId } = f;
                            const isRequesterMe = requesterId === myUserId;
                            const friendName = isRequesterMe
                                ? addresseeNickname
                                : requesterNickname;

                            return (
                                <li key={friendshipId} className={s.friendItem}>
                                    <div className={s.friendInfo}>
                                        <div className={s.friendAvatar} />
                                        <div className={s.friendName}>{friendName || "Friend"}</div>
                                    </div>
                                    <div className={s.friendButtons}>
                                        <button
                                            type="button"
                                            className={s.friendChatButton}
                                            onClick={() => handleStartChat(f)}
                                        >
                                            Chat
                                        </button>
                                        <button
                                            type="button"
                                            className={s.friendDeleteButton}
                                            onClick={() => handleDeleteFriend(friendshipId)}
                                        >
                                            삭제
                                        </button>
                                    </div>
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
                            <div className={s.status}>받은 친구 요청이 없습니다.</div>
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

                    <section className={s.requestSection}>
                        <h3 className={s.sectionTitle}>Sent requests</h3>
                        {outgoing.length === 0 && (
                            <div className={s.status}>보낸 친구 요청이 없습니다.</div>
                        )}
                        <ul className={s.requestList}>
                            {outgoing.map((req) => (
                                <li key={req.friendshipId} className={s.requestItem}>
                                    <span className={s.request}>
                                        {req.addresseeNickname || "Unknown"}
                                    </span>
                                    <span className={s.pendingText}>대기 중</span>
                                    <button
                                        className={s.cancelButton}
                                        onClick={async () => {
                                            await cancelFriendRequest(req.friendshipId);
                                            await reload();

                                            /* 알림 시스템 연동 시 "친구 요청 취소됨"같은 알림은 여기서 */
                                        }}
                                    >
                                        취소
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                </main>
            </div>
        </div>
    );
}