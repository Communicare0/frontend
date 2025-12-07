import { useLocation, useNavigate } from "react-router-dom";

import s from "@styles/modules/chat/ChatSideNav.module.css";

export default function ChatSideNav() {
    const location = useLocation();
    const navigate = useNavigate();

    const path = typeof location.pathname === "string" ? location.pathname : "";

    const isChats = path === "/chat" || location.pathname === "/chat/";
    const isFriend = path.startsWith("/chat/friend");

    return (
        <div className={s.sideNav}>
            <button
                type="button"
                className={`${s.navItem} ${isChats ? s.active : ""}`}
                onClick={() => navigate("/chat")}
            >
                <div className={s.iconBox}>
                    <span className={s.iconBubble} />
                </div>
                <span className={s.label}>chats</span>
            </button>

            <button
                type="button"
                className={`${s.navItem} ${isFriend ? s.active : ""}`}
                onClick={() => navigate("/chat/friend")}
            >
                <div className={s.iconBox}>
                    <span className={s.iconUserHead} />
                    <span className={s.iconUserBody} />
                </div>
                <span className={s.label}>friend</span>
            </button>
        </div>
    );
}