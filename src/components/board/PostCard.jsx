import s from "@styles/modules/board/PostCard.module.css";

export default function PostCard({ post }) {
    return (
        <article className={s.postCard}>
            <h2 className={s.postCartTitle}>{post.title}</h2>
            <p className={s.postCardText}>{post.text}</p>

            <div className={s.postCardFooter}>
                <div className={s.postCardMeta}>
                    <span>{post.commentCount} comment</span>
                    <span>| {post.createdAt}</span>
                    <span>| {post.username}</span>
                </div>

                <div className={s.postCardLike}>
                    <span className={s.postCardLikeIcon}>
                        <img src="/image/like.svg" />
                    </span>
                    <span className={s.postCardLikeText}>{post.likes} Like</span>
                </div>
            </div>
        </article>
    );
}