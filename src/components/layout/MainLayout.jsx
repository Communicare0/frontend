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
                    <span className={s.logo} onClick={() => navigate("/home")}>
                        Communicare
                    </span>
                </div>

                <nav className={s.nav}>
                    <NavLink
                        to="/home"
                        className={({ isActive }) => 
                            isActive ? `${s.navItem} ${s.active}` : s.navItem
                        }
                    >
                        게시판
                    </NavLink>
                    <NavLink
                        to="/map"
                        className={({ isActive }) => 
                            isActive ? `${s.navItem} ${s.active}` : s.navItem
                        }
                    >
                        지도
                    </NavLink>
                    <NavLink
                        to="/chat"
                        className={({ isActive }) => 
                            isActive ? `${s.navItem} ${s.active}` : s.navItem
                        }
                    >
                        채팅
                    </NavLink>
                    <NavLink
                        to="/mypage"
                        className={({ isActive }) => 
                            isActive ? `${s.navItem} ${s.active}` : s.navItem
                        }
                    >
                        마이페이지
                    </NavLink>
                </nav>

                <div className={s.right}>
                    <button type="button" className={s.alarmBtn}>
                        <span className={s.alarmText}>알림</span>
                    </button>
                    <button type="button" className={s.logoutBtn} onClick={handleLogout}>
                        로그아웃
                    </button>
                </div>
            </header>

            <main className={s.content}>
                <Outlet />
            </main>
        </div>
    );
}