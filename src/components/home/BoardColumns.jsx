import BoardColumn from "./BoardColumn";
import s from "@styles/modules/home/BoardColumns.module.css";

export default function BoardColumns() {
    return (
        <section className={s.columns}>
            <BoardColumn
                title="AJOU University"
                boardType="ajou"
                variant="ajou"
                badgeText={<img src="/image/ajou_board_icon.png" className={s.icon}/>}
            />
            <BoardColumn
                title="Restaurant"
                boardType="restaurant"
                variant="restaurant"
                badgeText={<img src="/image/restaurant_board_icon.png" className={s.icon}/>}
            />
            <BoardColumn
                title="Free board"
                boardType="free"
                variant="free"
                badgeText={<img src="image/free_board_icon.png" className={s.icon}/>}
            />
        </section>
    );
}