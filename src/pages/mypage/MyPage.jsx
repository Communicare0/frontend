import { Link } from "react-router-dom";

import s from "@styles/modules/mypage/MyPage.module.css";

export default function MyPage() {
    return (
        <div className={s.mypageLayout}>
            
            {/* 회원 정보 수정 */}
            <div className={s.section}>
                <Link to={`/mypage/updateUserInfo`} className={s.sectionLink}>
                    회원 정보 수정
                </Link>
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