import { NavLink } from "react-router-dom";
import s from "@styles/modules/board/BoardMenu.module.css";

const MENUS = [
    { label: "학교 공지사항", value: "university" },
    { label: "자유게시판", value: "free" },
    { label: "여행게시판", value: "job" },
];

export default function BoardMenu() {
    return (
        <aside className={s.boardMenu}>
            <ul>
                <h3 className={s.boardMenuTitle}>메뉴</h3>
                {MENUS.map((m) => (
                    <li key={m.value}>
                        <NavLink
                            to={`/board/${m.value}`}
                            className={({ isActive }) => 
                                isActive ? `${s.boardMenuItem} ${s.boardMenuItemActive}` : s.boardMenuItem
                            }
                        >
                            {m.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    );
}