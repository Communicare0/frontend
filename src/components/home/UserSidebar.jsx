import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import s from "@styles/modules/home/UserSidebar.module.css";

export default function UserSidebar() {
    const navigate = useNavigate();
    const { user } = useAuth() || {};
    
    const handleMyPage = () => {
        navigate("/mypage");
    }

    return (
        <aside className={s.sidebar}>
            <div className={s.card}>
                <div className={s.avatarCircle} />

                <div className={s.infoRow}>
                    <span className={s.label}>닉네임</span>
                    <span className={s.value}>{user?.nickname || "닉네임"}</span>
                </div>
                <div className={s.infoRow}>
                    <span className={s.label}>국적</span>
                    <span className={s.value}>{user?.nation || "국적"}</span>
                </div>
                <div className={s.infoRow}>
                    <span className={s.label}>학과</span>
                    <span className={s.value}>{user?.major || "학과"}</span>
                </div>
                <div className={s.infoRow}>
                    <span className={s.label}>학번</span>
                    <span className={s.value}>{user?.studentId || "학번"}</span>
                </div>

                <p classNamr={s.hint}>정보를 입력하세요.</p>

                <button type="button" className={s.mypageBtn} onClick={handleMyPage}>
                    마이페이지로 이동
                </button>
            </div>
        </aside>
    );
}