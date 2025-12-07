import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/services/authApi.js";
import { setAccessToken } from "@/services/authToken";
import useAuth from "@/hooks/useAuth";
import { fetchMyData, fetchFriendCode } from "@/services/mypageApi";

import s from "@styles/modules/mypage/MyPage.module.css";

export default function MyPage() {
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const contentRef = useRef(null);
    const navigate = useNavigate();
    const [info, setInfo] = useState({ user: null, friendCode: "" });

    const { user } = useAuth();
    const email = user?.email; 
    
    useEffect(() => {
        async function loadMyPageData() {
            try {
                const [userData, codeData] = await Promise.all([
                    fetchMyData(),
                    fetchFriendCode()
                ]);

                setInfo({
                    user: userData,
                    friendCode: codeData.friendCode,
                });

            } catch (err) {
                console.error(err);
            }
        }

        loadMyPageData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        console.log("email:", email);
        try {
            const data = await login({ email, password });
            setAccessToken(data.accessToken);
            navigate("/mypage/updateUserInfo");
        } catch (err) {
            const status = err.status;

            if(status === 400 || status === 401) {
                setError("비밀번호가 일치하지 않습니다.");
            } else {
                setError("잠시 후 다시 시도해 주세요.");
            }
        }
    };


    return (
        <div className={s.mypageLayout}>
            {/* 회원 정보 조회 */}
            <div className={s.section}>
                <h2 className={s.sectionTitle}>회원 정보</h2>

                <div className={s.basicInfo}>
                    <div className={s.infoRow}>
                        <span className={s.infoLabel}>학과</span>
                        <span className={s.infoValue}>{info.user?.department ?? "-"}</span>
                    </div>
                    <div className={s.infoRow}>
                        <span className={s.infoLabel}>학번</span>
                        <span className={s.infoValue}>{info.user?.studentId ?? "-"}</span>
                    </div>
                    <div className={s.infoRow}>
                        <span className={s.infoLabel}>국적</span>
                        <span className={s.infoValue}>{info.user?.nationality ?? "-"}</span>
                    </div>
                    <div className={s.infoRow}>
                        <span className={s.infoLabel}>선호 음식 타입</span>
                        <span className={s.infoValue}>{info.user?.preferredFoodType ?? "-"}</span>
                    </div>
                    <div className={s.infoRow}>
                        <span className={s.infoLabel}>언어</span>
                        <span className={s.infoValue}>{info.user?.language ?? "-"}</span>
                    </div>
                </div>

                <div className={s.friendCode}>
                    <span className={s.friendCodeLabel}>내 친구 코드</span>
                    <div className={s.friendCodeBox}>
                        {info.friendCode ?? "친구 코드가 아직 발급되지 않았습니다."}
                    </div>
                </div>
            </div>
            
            {/* 회원 정보 수정 */}
            <div className={s.section}>
                <button className={s.sectionBtn} onClick={() => setOpen(!open)}>
                    회원 정보 수정
                </button>

                <div ref={contentRef} className={`${s.expandable} ${open ? s.open : ""}`}>
                    <form onSubmit={handleSubmit} className={s.passwordForm}>
                        <input
                            type="password"
                            placeholder="현재 비밀번호"
                            className={s.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && <p className={s.error}>{error}</p>}
                        <button type="submit" className={s.submitBtn}>
                            확인
                        </button>
                    </form>
                </div>
            </div>

            {/* 내가 쓴 글 */}
            <div className={s.section}>
                <Link to={`/board/myboard`} className={s.sectionLink}>
                    내가 쓴 글
                </Link>
            </div>
            {/*
            이메일 관심 키워드 
            <div className={s.section}>
                <Link to={`/mypage/keyword`} className={s.sectionLink}>
                    이메일 관심 키워드
                </Link>
            </div>
            */}
            {/* 회원 탈퇴 */}
        </div>
    );
}