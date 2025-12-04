import React, { useState, useEffect } from "react";
import s from "@styles/modules/notification/NotificationPage.module.css";
import BoardMenu from "@/components/board/BoardMenu";
// 알림 목록 아이콘 (임시)
const MailIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6L12 13L2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const ClockIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 6V12L16 14" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;


// 임시 데이터 (실제는 API에서 가져옴)
const dummyNotifications = [
    {
        id: 1,
        type: "email",
        source: "아주대학교",
        title: "2024학년도 2학기 수강신청 일정 및 유의사항 안내",
        contentSnippet: "학생 여러분, 2024학년도 2학기 수강신청 일정을 안내합니다. 기간 내에 꼭 신청해 주시기 바랍니다. 변경된 사항으로는...",
        isRead: false,
        receivedAt: "10분 전"
    },
    {
        id: 2,
        type: "email",
        source: "유학생입학팀",
        title: "기숙사 외국인 학생 OT 일정 변경 공지 (필독)",
        contentSnippet: "국제 학생 여러분께, 기숙사 입실 오리엔테이션 일정이 부득이하게 변경되었습니다. 변경된 날짜와 장소는 반드시 확인...",
        isRead: false,
        receivedAt: "1시간 전"
    },
    {
        id: 3,
        type: "email",
        source: "아주대학교",
        title: "2024년 가을학기 장학금 신청 마감 임박 알림",
        contentSnippet: "장학금 신청 마감일이 3일 남았습니다. 신청 서류를 다시 한번 확인하시고 기한 내에 제출해 주시길 바랍니다. 문의사항은...",
        isRead: true,
        receivedAt: "어제"
    },
    {
        id: 4,
        type: "email",
        source: "유학생입학팀",
        title: "글로벌 학생 멘토링 프로그램 모집 안내",
        contentSnippet: "국제 학생들을 위한 멘토링 프로그램 참가자를 모집합니다. 선착순 마감이오니 관심 있는 학생들의 많은 참여 바랍니다. 상세 내용은...",
        isRead: true,
        receivedAt: "3일 전"
    }
];

// 알림 항목 컴포넌트
function NotificationItem({ notification, onClick }) {
    const { source, title, contentSnippet, isRead, receivedAt } = notification;

    // isRead 상태에 따라 스타일 클래스 적용
    const itemClassName = `${s.notificationItem} ${isRead ? s.read : s.unread}`;

    return (
        <div className={itemClassName} onClick={onClick}>
            {/* 읽음 표시자 */}
            {!isRead && <div className={s.unreadDot} />}
            
            {/* 메일 아이콘 */}
            <div className={s.iconWrapper}>
                <MailIcon />
            </div>

            {/* 알림 내용 */}
            <div className={s.contentWrapper}>
                <div className={s.header}>
                    <span className={s.sourceName}>[{source}]</span>
                    <span className={s.time}><ClockIcon /> {receivedAt}</span>
                </div>
                
                <h3 className={s.title}>{title}</h3>
                
                <div className={s.divider} />
                
                <p className={s.snippet}>{contentSnippet}...</p>
                
                <span className={s.goToMailbox}>메일함으로 이동 &gt;</span>
            </div>
        </div>
    );
}

// 메인 페이지 컴포넌트
export default function NotificationsPage() {
    <BoardMenu />
    const [notifications, setNotifications] = useState(dummyNotifications);

    // 알림 클릭 핸들러: 읽음 상태로 변경하고 해당 메일함으로 이동 (Task 5-3-2)
    const handleNotificationClick = (id) => {
        // 1. 읽음 상태 업데이트 (실제로는 API 호출 및 상태 갱신)
        setNotifications(prev => 
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        
        // 2. 메일함 페이지로 이동 (Task 5-3-2) - 현재는 콘솔 로그로 대체
        console.log(`알림 ID ${id} 클릭됨. 해당 메일함으로 이동 로직 구현 필요.`);
        alert("해당 메일함으로 이동하는 로직이 필요합니다.");
    };

    const handleReadAll = () => {
        // 전체 읽음 처리 (실제로는 API 호출 및 상태 갱신)
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        console.log("모든 알림을 읽음 처리했습니다.");
    };
    
    // 미확인 알림 개수 계산
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className={s.notificationPage}>
            <div className={s.container}>
                
                {/* 헤더 */}
                <header className={s.headerBar}>
                    <h1 className={s.pageTitle}>알림</h1>
                    {unreadCount > 0 && (
                        <button 
                            className={s.readAllButton}
                            onClick={handleReadAll}
                        >
                            모두 읽음으로 표시
                        </button>
                    )}
                </header>

                {/* 알림 목록 */}
                <div className={s.notificationList}>
                    {notifications.length === 0 ? (
                        <div className={s.emptyState}>
                            새로운 알림이 없습니다.
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <NotificationItem 
                                key={notification.id} 
                                notification={notification} 
                                onClick={() => handleNotificationClick(notification.id)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}