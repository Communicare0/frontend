import { useNavigate } from "react-router-dom";
import s from "@styles/modules/home/BoardColumn.module.css";

const dummyRows = Array.from({ length: 10 }, (_, i) => ({
    id: i+1,
    title: "",
}));

export default function BoardColumn({ title, boardType, variant, badgeText }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/boards/${boardType}`);
    };

    return (
        <div
            className={`${s.column} ${s[variant] || ""}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
        >
            <div className={s.header}>
                <span className={s.title}>{title}</span>
                {badgeText && <span className={s.badge}>{badgeText}</span>}
            </div>

            <div className={s.list}>
                {dummyRows.map((row) => (
                    <div key={row.id} className={s.row} />
                ))}
            </div>
        </div>
    );
}