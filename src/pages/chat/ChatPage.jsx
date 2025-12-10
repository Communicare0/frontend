import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { fetchMyChatRooms, fetchRoomMessages } from "@/services/chatApi";
import { sendChatMessageSocket, subscribeRoom, disconnectChatSocket } from "@/services/chatSocket";
import ChatSideNav from "@/components/chat/ChatSideNav";
import { fetchMyFriends } from "@/services/friendApi";

import s from "@styles/modules/chat/ChatPage.module.css";
import { createChatRoom, leaveChatRoom } from "@/services/chatApi";
import { getCurrentUserId } from "@/services/authToken";

export default function ChatPage() {
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [error, setError] = useState(null);

    // 그룹 채팅 관련
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [friends, setFriends] = useState([]);
    const [groupTitle, setGroupTitle] = useState("");
    const [selectedFriendIds, setSelectedFriendIds] = useState([]);
    const [creatingGroup, setCreatingGroup] = useState(false);
    const [myUserId, setMyUserId] = useState(null);

    const [unreadCounts, setUnreadCounts] = useState({});
    const subscriptionsRef = useRef({});
    const selectedRoomIdRef = useRef(null);

    const location = useLocation();
    const initialRoomId = location.state?.initialRoomId || null;
    const initialRoomTitle = location.state?.initialRoomTitle || null;

    useEffect(() => {
        if(initialRoomId && !selectedRoomId) {
            setSelectedRoomId(initialRoomId);
        }
    }, [initialRoomId, selectedRoomId]);

    const loadRooms = useCallback(async () => {
        setLoadingRooms(true);
        try {
            const data = await fetchMyChatRooms();
            setRooms(data || []);
        } catch (err) {
            console.error(err);
            setError(err.message || "채팅방 목록 로딩 실패");
        } finally {
            setLoadingRooms(false);
        }
    }, []);

    useEffect(() => {
        selectedRoomIdRef.current = selectedRoomId;
    }, [selectedRoomId]);

    // 채팅방 목록 로딩
    useEffect(() => {
        let mounted = true;

        (async () => {
            const meId = getCurrentUserId();
            if(mounted) setMyUserId(meId);

            await loadRooms();

            try {
                const friendsData = await fetchMyFriends();
                if(mounted) setFriends(friendsData || []);
            } catch (err) {
                console.error(err);
            }
        })();

        return () => {
            mounted = false;
            Object.values(subscriptionsRef.current).forEach((sub) => {
                if(sub && sub.unsubscribe) sub.unsubscribe();
            });
            subscriptionsRef.current = {};
            disconnectChatSocket();
        };
    }, [loadRooms]);

    // 방 선택 시: 과거 메시지 + WebSocket 구독
    useEffect(() => {
        Object.values(subscriptionsRef.current).forEach((sub) => {
            if(sub && sub.unsubscribe) sub.unsubscribe();
        });
        subscriptionsRef.current = {};

        if(!rooms || rooms.length === 0 || !myUserId) return;

        const newSubs = {};

        rooms.forEach((room) => {
            const roomId = room.chatRoomId;
            const sub = subscribeRoom(roomId, (chatMessage) => {
                console.log(
                    "[WS] incoming",
                    {
                    chatMessage,
                    roomIdFromMsg: chatMessage.chatRoomId,
                    selectedRoomId: selectedRoomIdRef.current,
                    senderIdFromMsg: chatMessage.senderId,
                    myUserId,
                    willCountAsUnread:
                        chatMessage.chatRoomId !== selectedRoomIdRef.current &&
                        chatMessage.senderId &&
                        chatMessage.senderId !== myUserId,
                    }
                );
                const roomIdFromMsg = chatMessage.chatRoomId;
                const senderIdFromMsg = chatMessage.senderId;

                if(!roomIdFromMsg) return;

                setMessages((prev) => {
                    if(roomIdFromMsg === selectedRoomIdRef.current) {
                        if(chatMessage.chatMessageId && prev.some((m) => m.chatMessageId === chatMessage.chatMessageId)) {
                            return prev;
                        }
                        return [...prev, chatMessage];
                    }

                    return prev;
                });

                if(roomIdFromMsg !== selectedRoomIdRef.current && senderIdFromMsg && senderIdFromMsg !== myUserId) {
                    setUnreadCounts((prev) => ({
                        ...prev,
                        [roomIdFromMsg]: (prev[roomIdFromMsg] || 0) + 1,
                    }));
                }
            });

            newSubs[roomId] = sub;
        });

        subscriptionsRef.current = newSubs;

        return () => {
            Object.values(newSubs).forEach((sub) => {
                if(sub && sub.unsubscribe) sub.unsubscribe();
            });
        };
    }, [rooms, myUserId]);

    useEffect(() => {
        if(!selectedRoomId) return;
        
        let mounted = true;
        setLoadingMessages(true);
        setMessages([]);

        fetchRoomMessages(selectedRoomId)
            .then((data) => {
                if(!mounted) return;
                setMessages(data || []);
            })
            .catch((err) => {
                console.error(err);
                if(mounted) setError(err.message || "메시지 로딩 실패");
            })
            .finally(() => {
                if(mounted) setLoadingMessages(false);
            });

        setUnreadCounts((prev) => ({
            ...prev,
            [selectedRoomId]: 0,
        }));

        return () => {
            mounted = false;
        };
    }, [selectedRoomId]);

    const handleSend = (e) => {
        e.preventDefault();
        if(!input.trim() || !selectedRoomId) return;

        try {
            sendChatMessageSocket({
                chatRoomId: selectedRoomId,
                content: input.trim(),
            });
            setInput("");
        } catch (err) {
            console.error(err);
            setError(err.message || "메시지 전송 실패");
        }
    };

    const currentRoom = rooms.find((r) => r.chatRoomId === selectedRoomId);

    const getRoomDisplayTitle = (room) => {
        if(!room) return "Chat";

        if(room.title) return room.title;

        if(initialRoomTitle && room.chatRoomId === initialRoomId) {
            return initialRoomTitle;
        }

        if(room.chatRoomType === "DIRECT" && myUserId) {
            const members = room.memberIds || room.membersId || room.members || [];

            if(members.length === 2) {
                const otherId = members.find((id) => id !== myUserId);

                if(otherId) {
                    const friend = friends.find(
                        (f) =>
                            (f.requesterId === myUserId && f.addresseeId === otherId) ||
                            (f.addresseeId === myUserId && f.requesterId === otherId)
                    );

                    if(friend) {
                        const isRequesterMe = friend.requesterId === myUserId;
                        const friendName = isRequesterMe
                            ? friend.addresseeNickname
                            : friend.requesterNickname;
                        
                            if(friendName) return friendName;
                    }
                }
            }

            if(room.chatRoomId === selectedRoomId && messages.length > 0) {
                const otherMsg = messages.find((m) => m.senderId && m.senderId !== myUserId);
                if(otherMsg?.senderNickname) return otherMsg.senderNickname;
            }

            return "Direct chat";
        }

        return "No title";
    };

    const headerTitle = getRoomDisplayTitle(currentRoom);

    const toggleCreateGroup = async () => {
        const next = !showCreateGroup;
        setShowCreateGroup(next);
        if(next && friends.length === 0) {
            try {
                const data = await fetchMyFriends();
                setFriends(data || []);
            } catch (err) {
                console.error(err);
                setError(err.message || "친구 목록 로딩 실패");
            }
        }
    };

    const handleToggleFriendSelect = (friendId) => {
        setSelectedFriendIds((prev) =>
            prev.includes(friendId)
                ? prev.filter((id) => id !== friendId)
                : [...prev, friendId]
        );
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();

        if(!myUserId) {
            setError("사용자 정보를 확인할 수 없습니다. 다시 로그인해 주세요.");
            return;
        }

        if(selectedFriendIds.length === 0) {
            setError("그룹에 초대할 친구를 한 명 이상 선택해 주세요.")
            return;
        }

        setCreatingGroup(true);
        setError(null);

        try {
            const memberIds = Array.from(
                new Set([myUserId, ...selectedFriendIds])
            );

            const payload = {
                chatRoomType: "GROUP",
                title: groupTitle || "Group chat",
                photoUrl: null,
                memberIds,
            };

            const created = await createChatRoom(payload);

            await loadRooms();
            if(created && created.chatRoomId) {
                setSelectedRoomId(created.chatRoomId);
            }

            setGroupTitle("");
            setSelectedFriendIds([]);
            setShowCreateGroup(false);
        } catch (err) {
            console.error(err);
            setError(err.message || "그룹 채팅방 생성 실패");
        } finally {
            setCreatingGroup(false);
        }
    };

    const handleLeaveRoom = async () => {
        if(!selectedRoomId) return;
        
        const confirmLeave = window.confirm("이 채팅방에서 나가시겠습니까?");
        if(!confirmLeave) return;

        try {
            const leavingId = selectedRoomId;

            await leaveChatRoom(leavingId);

            const remainingRooms = rooms.filter((r) => r.chatRoomId !== leavingId);
            setRooms(remainingRooms);

            setMessages([]);
            setUnreadCounts((prev) => {
                const copy = { ...prev };
                delete copy[leavingId];
                return copy;
            });

            if(remainingRooms.length > 0) {
                setSelectedRoomId(remainingRooms[0].chatRoomId);
            } else {
                setSelectedRoomId(null);
            }

        } catch (err) {
            console.error(err);
            setError(err.message || "채팅방 나가기 실패");
        }
    };

    const hasSelectedRoom = !!selectedRoomId;

    return (
        <div className={s.pageWrapper}>
            <ChatSideNav />

            <div className={s.mainWrapper}>
                {/* 왼쪽: 채팅방 목록 + 그룹 생성 */}
                <aside className={s.sidebar}>
                    <div className={s.sidebarHeader}>
                        <h2 className={s.sidebarTitle}>My chats</h2>
                        <button
                        type="button"
                        className={s.newGroupButton}
                        onClick={toggleCreateGroup}
                        >
                        {showCreateGroup ? "Close" : "New group"}
                        </button>
                    </div>

                    {showCreateGroup && (
                        <form className={s.groupCreator} onSubmit={handleCreateGroup}>
                            <div className={s.groupTitleRow}>
                                <label className={s.groupTitleLabel}>Group name</label>
                                <input
                                    className={s.groupTitleInput}
                                    placeholder="Enter group name"
                                    value={groupTitle}
                                    onChange={(e) => setGroupTitle(e.target.value)}
                                />
                            </div>

                            <div className={s.groupFriendsBox}>
                                <div className={s.groupFriendsHeader}>Invite friends</div>
                                <div className={s.groupFriendsList}>
                                    {friends.length === 0 && (
                                        <div className={s.groupEmptyText}>
                                            친구 목록이 비어 있습니다.
                                        </div>
                                    )}
                                    {friends.map((f) => {
                                        // 이름 표시용
                                        if(!myUserId) return null;

                                        const {
                                            requesterId,
                                            requesterNickname,
                                            addresseeId,
                                            addresseeNickname,
                                            friendshipId,
                                        } = f;

                                        const isRequesterMe = requesterId === myUserId;

                                        const friendId = isRequesterMe ? addresseeId : requesterId;
                                        const friendName = isRequesterMe
                                            ? addresseeNickname
                                            : requesterNickname;
                                        
                                        const checked = selectedFriendIds.includes(friendId);
                                        
                                        return (
                                            <label
                                                key={friendshipId}
                                                className={s.friendSelectItem}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className={s.friendCheckbox}
                                                    checked={checked}
                                                    onChange={() => handleToggleFriendSelect(friendId)}
                                                />
                                                <span className={s.friendSelectName}>{friendName || "Friend"}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={s.groupCreateButton}
                                disabled={creatingGroup}
                            >
                                {creatingGroup ? "Creating..." : "Create group"}
                            </button>
                        </form>
                    )}

                    {loadingRooms && <div className={s.status}>채팅방 로딩 중...</div>}
                    {!loadingRooms && rooms.length === 0 && (
                        <div className={s.status}>참여 중인 채팅방이 없습니다.</div>
                    )}
                    <ul className={s.roomList}>
                        {rooms.map((room) => {
                            const isActive = room.chatRoomId === selectedRoomId;
                            const unread = unreadCounts[room.chatRoomId] || 0;

                            const displayTitle = getRoomDisplayTitle(room);
                            
                            return (
                                <li
                                    key={room.chatRoomId}
                                    className={isActive ? `${s.roomItem} ${s.roomItemActive}` : s.roomItem}
                                    onClick={() => setSelectedRoomId(room.chatRoomId)}
                                >
                                    <div className={s.roomAvatar} />
                                    <div className={s.roomText}>
                                        <div className={s.roomTitle}>{displayTitle}</div>
                                        <div className={s.roomLastMessage}>
                                            {room.lastMessageContent || "대화 내역 없음"}
                                        </div>
                                    </div>
                                    {unread > 0 && (
                                        <div className={s.unreadBadge}>
                                            {unread > 99 ? "99+" : unread}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </aside>

                {/* 오른쪽: 메시지 영역 */}
                <main className={s.chatMain}>
                    <header className={s.chatHeader}>
                        <h2 className={s.chatTitle}>
                            {hasSelectedRoom ? headerTitle : "채팅"}
                        </h2>
                        {hasSelectedRoom && (
                            <button
                                type="button"
                                className={s.leaveButton}
                                onClick={handleLeaveRoom}
                            >
                                나가기
                            </button>
                        )}
                    </header>
                    
                    {!hasSelectedRoom ? (
                        <div className={s.emptyState}>
                            채팅방을 왼쪽에서 선택하거나, 새로운 그룹을 생성해서 대화를 시작해 보세요.
                        </div>
                    ) : (
                        <>
                            {error && <div className={s.error}>{error}</div>}

                            <section className={s.messagesArea}>
                                {loadingMessages && (
                                    <div className={s.status}>메시지 로딩 중...</div>
                                )}
                                {!loadingMessages && messages.length === 0 && (
                                    <div className={s.status}>아직 메시지가 없습니다.</div>
                                )}
                                {messages.map((m) => {
                                    const isMine = myUserId && m.senderId === myUserId;
                                    const timeStr = new Date(m.createdAt).toLocaleTimeString(
                                        [],
                                        { hour: "2-digit", minute: "2-digit" }
                                    );

                                    return (
                                        <div
                                            key={m.chatMessageId}
                                            className={`${s.messageRow} ${
                                                isMine ? s.messageRowMine : s.messageRowOther
                                            }`}
                                        >
                                            {!isMine && <div className={s.messageAvatar} />}
                                            <div
                                                className={`${s.messageBubble} ${
                                                    isMine
                                                        ? s.messageBubbleMine
                                                        : s.messageBubbleOther
                                                }`}
                                            >
                                                <div className={s.messageMeta}>
                                                    {!isMine && (
                                                        <span className={s.senderName}>
                                                            {m.senderNickname}
                                                        </span>
                                                    )}
                                                    <span className={s.messageTime}>
                                                        {timeStr}
                                                    </span>
                                                </div>
                                                <div className={s.messageContent}>
                                                    {m.content}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </section>

                            <form className={s.inputBar} onSubmit={handleSend}>
                                <input
                                    className={s.input}
                                    placeholder="Input message"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <button className={s.sendButton} type="submit">
                                    Send
                                </button>
                            </form>
                        </>
                    )}
                </main>
            </div>
        </div>
  );
}