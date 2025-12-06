import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/services/authApi.js";
import { setAccessToken } from "@/services/authToken";
import useAuth from "@/hooks/useAuth";

import s from "@styles/modules/mypage/MyPage.module.css";

export default function MyPage() {
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const contentRef = useRef(null);
    const navigate = useNavigate();

    const { user } = useAuth();
    const email = user?.email; 

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
            
            {/* 이메일 관심 키워드 */}
            <div className={s.section}>
                <Link to={`/mypage/keyword`} className={s.sectionLink}>
                    이메일 관심 키워드
                </Link>
            </div>

            {/* 회원 탈퇴 */}
        </div>
    );
}