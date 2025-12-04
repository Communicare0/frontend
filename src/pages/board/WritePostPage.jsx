import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { writePost } from "@/services/boardApi";
import s from "@styles/modules/board/WritePostPage.module.css";

export default function WritePostPage() {

    const navigate = useNavigate();
    const { category } = useParams();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const isDirty = title.trim() !== "" || content.trim() !== "";

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if(!isDirty) return;
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isDirty]);

    const handleSubmit =  async (e) => {
        e.preventDefault();

        if(!title.trim() || !content.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        const ok = window.confirm("이 내용으로 게시글을 등록하시겠습니까?");
        if(!ok) return;

        try {
            // 여기에 제출 로직
            
            await writePost({
                category,
                title: title.trim(),
                content: content.trim(),
                /*files,*/
            });
            
            navigate(`/board/${category}`);
        } catch (err) {
            console.error(err);
            alert("게시글 등록에 실패했습니다.");
        }
    };

    const handleCancel = () => {
        if(isDirty) {
            const ok = window.confirm("작성 중인 내용이 저장되지 않습니다. 정말 나가시겠습니까?");
            if(!ok) return;
        }
        navigate(`/board/${category}`);
    };

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    }

    const handleChangeContent = (e) => {
        setContent(e.target.value);
    }

    return (
        <div className={s.page}>
            <div className={s.card}>
                <form className={s.form} onSubmit={handleSubmit}>
                    <div className={s.body}>
                        <input
                            className={s.titleInput}
                            type="text"
                            placeholder="글 제목"
                            value={title}
                            onChange={handleChangeTitle}
                        />
                        <textarea
                            className={s.contentInput}
                            placeholder="내용"
                            value={content}
                            onChange={handleChangeContent}
                        />
                    </div>

                    <div className={s.divider} />

                    <div className={s.footer}>
                        <div className={s.footerRight}>
                            <button
                                type="button"
                                className={s.cancelBtn}
                                onClick={handleCancel}
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                className={s.submitBtn}
                            >
                                등록
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}