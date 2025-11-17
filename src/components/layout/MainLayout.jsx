import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import s from "@styles/modules/layout/MainLayout.module.css";

export default function MainLayout() {
    const navigate = useNavigate();
    const auth = useAuth();
    const logout = auth?.logout;
    
    const handleLogout = () => {
        if(logout) logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className={s.container}>
            <header className={s.header}>
                <div className={s.left}>
                    <span className={s.logo} onClick={() => navigate("/")}>
                        Communicare
                    </span>
                </div>

                <nav className={s.nav}>
                    <NavLink
                        to="/board/popularity"
                        className={({ isActive }) => 
                            isActive ? `${s.navItem} ${s.active}` : s.navItem
                        }
                    >
                        게시판
                    </NavLink>
                    <NavLink
                        to="/restaurant"
                        className={({ isActive }) => 
                            isActive ? `${s.navItem} ${s.active}` : s.navItem
                        }
                    >
                        식당
                    </NavLink>
                    <NavLink
                        to="/chat"
                        className={({ isActive }) => 
                            isActive ? `${s.navItem} ${s.active}` : s.navItem
                        }
                    >
                        채팅
                    </NavLink>
                </nav>

                <div className={s.right}>
                    <NavLink to="/mypage" className={s.mypageBtn}>
                        <img src="/image/user.svg" alt="마이페이지" className={s.mypageicon} />
                    </NavLink>
                    <NavLink to="/notifications" className={s.alarmBtn}>
                        <img src="/image/alarm.svg" alt="알림" className={s.icon} />
                        {/*{unreadCount > 0 && (
                            <span className={s.badge}>{unreadCount}</span>
                        )}*/}
                    </NavLink>
                    <button type="button" className={s.logoutBtn} onClick={handleLogout}>
                        로그아웃
                    </button>
                </div>
            </header>

            <main className={s.content} data-layout-content>
                <Outlet />
            </main>
        </div>
    );
}