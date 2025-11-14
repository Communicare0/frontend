import UserSidebar from "@/components/home/UserSidebar";
import BoardColumns from "@/components/home/BoardColumns";
import s from "@styles/modules/home/HomePage.module.css";

export default function HomePage() {
    return (
        <div className={s.wrapper}>
            <UserSidebar />
            <BoardColumns />
        </div>
    );
}