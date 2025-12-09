import { useState } from "react";
import { translate } from "@/services/boardApi";

import s from "@styles/modules/board/PostCard.module.css";

export default function PostCard({ post }) {
    const [translatedTitle, setTranslatedTitle] = useState(post.title);
    const [translatedContent, setTranslatedContent] = useState(post.text);

    const handleTranslate = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const { translatedTitle, translatedContent } = await translate(post.id);

            setTranslatedTitle(translatedTitle);
            setTranslatedContent(translatedContent);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <article className={s.postCard}>
            <div className={s.translate}>
                <button onClick={handleTranslate}>
                    <img src="/image/translate.svg" alt="번역" style={{ width: 32, height: 32 }} />
                </button>
            </div>

            <h2 className={s.postCartTitle}>{translatedTitle}</h2>
            <p className={s.postCardText}>{translatedContent}</p>

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