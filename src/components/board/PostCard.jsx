import { useState } from "react";
import { translate } from "@/services/boardApi";
import NationalityFlag from "@/components/ui/NationalityFlag";

import s from "@styles/modules/board/PostCard.module.css";

// 프로필 메타 컴포넌트
const UserProfileMeta = ({ studentYear, department, nationality }) => (
    <div className={s.userProfileMeta}>
       <span className={s.profileYear}>{studentYear}</span>
        <span className={s.profileSeparator}>/</span>
        <span className={s.profileInfo}>{department}</span>
        <span className={s.profileSeparator}>/</span>
        <span className={s.profileNation}>
            <NationalityFlag nationality={nationality} size={18} />
        </span>
    </div>
);

export default function PostCard({ post }) {
    const [translatedTitle, setTranslatedTitle] = useState(post.title);
    const [translatedContent, setTranslatedContent] = useState(post.text);
    const [isLoading, setIsLoading] = useState(false);

    const handleTranslate = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);

        try {
            const { translatedTitle, translatedContent } = await translate(post.id);

            setTranslatedTitle(translatedTitle);
            setTranslatedContent(translatedContent);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <article className={s.postCard}>
            <div className={s.translate}>
                <button onClick={handleTranslate} disabled={isLoading}>
                    <img
                        src="/image/translate.svg"
                        alt="번역"
                        style={{ width: 32, height: 32 }}
                        className={isLoading ? s.translateLoading : ""}
                    />
                </button>
            </div>

            <h2 className={s.postCartTitle}>{translatedTitle}</h2>
            <p className={s.postCardText}>{translatedContent}</p>

            <div className={s.postCardFooter}>
                <div className={s.postCardMeta}>
                    <span>{post.createdAt} |</span>
                    <UserProfileMeta
                        studentYear={post.studentYear}
                        department={post.department}
                        nationality={post.nationality}
                    />
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