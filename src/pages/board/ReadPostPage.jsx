import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BoardMenu from "@/components/board/BoardMenu";
// import { fetchPostDetail, fetchPostComments } from "@/services/boardApi"; 

import s from "@styles/modules/board/ReadPostPage.module.css";

// 임시 아이콘 컴포넌트 
const ArrowLeftIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const ShareIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 7.5L13.3333 3.33333M17.5 7.5L13.3333 11.6667M17.5 7.5H9.16667C8.44928 7.5 7.76159 7.79097 7.25825 8.3044C6.75492 8.81784 6.47917 9.51087 6.47917 10.2333V14.4167C6.47917 15.1391 6.75492 15.8322 7.25825 16.3456C7.76159 16.859 8.44928 17.15 9.16667 17.15H17.5" stroke="#6B7280" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const LikeIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49999 17.5L2.5 10.8333V4.16667H7.49999C8.21738 4.16667 8.90507 4.45763 9.40841 4.97107C9.91174 5.48451 10.1875 6.17754 10.1875 6.9V9.16667M7.49999 17.5H12.5L15.4167 10.8333C15.4167 10.1109 15.7077 9.42322 16.2211 8.91989C16.7345 8.41655 17.4276 8.1408 18.15 8.1408H19.1667V4.16667H10.1875C9.46507 4.16667 8.77738 3.87571 8.26394 3.36231C7.75051 2.8489 7.45833 2.16122 7.45833 1.4388V1.04167C7.45833 0.817366 7.4116 0.596041 7.31956 0.392949C7.22752 0.189857 7.09115 0.00977464 6.91989 -0.161494C6.74862 -0.332763 6.5385 -0.470557 6.30537 -0.569591C6.07223 -0.668625 5.82025 -0.72591 5.56417 -0.738096L-0.00000109289 0L2.5 10.8333V17.5H7.49999Z" stroke="#EF4444" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const CommentIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 17.5C10.663 17.5 11.313 17.3683 11.9213 17.112C12.5297 16.8557 13.0886 16.4795 13.5705 16.0098C14.0524 15.5402 14.4502 14.9818 14.7439 14.3644C15.0376 13.747 15.2215 13.0827 15.2866 12.4042C15.4058 11.1965 15.2036 9.9702 14.6974 8.84713C14.1912 7.72407 13.3934 6.74681 12.3853 6.00762C11.3771 5.26844 10.1983 4.78696 8.97191 4.59591C7.74556 4.40486 6.49504 4.50974 5.3435 4.90098C4.19196 5.29222 3.17066 5.95543 2.37895 6.83789C1.58724 7.72036 1.05607 8.78456 0.835467 9.94056C0.614868 11.0966 0.718872 12.2982 1.15177 13.4076C1.58466 14.517 2.33668 15.4851 3.32833 16.2238C3.89973 16.6433 4.54226 16.969 5.22558 17.1853C5.90891 17.4017 6.62688 17.505 7.34861 17.4907L10 17.5Z" stroke="#6B7280" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" /></svg>;


export default function ReadPostPage() {
    const { category, postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState("");

    // 로직: 게시물 데이터 로드 및 댓글 목록 로드
    useEffect(() => {
        // 개발용 더미 데이터 로드
        const dummyPost = {
            id: postId,
            category: category,
            title: "Title",
            username: "User name",
            createdAt: "1시간 전",
            views: 45,
            likes: 12,
            text: "게시물 상세 내용입니다. 여기에 글의 본문이 표시됩니다. 피그마 이미지와 같이 내용이 길어질 경우 스크롤 될 수 있습니다. 모든 내용은 동적으로 표시됩니다.",
            comments: [
                { id: 1, username: "학생1", text: "좋은 정보 감사합니다!", createdAt: "10분 전" },
                { id: 2, username: "학생2", text: "저도 이 내용 궁금했어요.", createdAt: "5분 전" },
            ]
        };

        // 실제 API가 구현될경우 예시 코드
        // async function loadPostData() {
        //     try {
        //         const [postData, commentsData] = await Promise.all([
        //             fetchPostDetail(postId),
        //             fetchPostComments(postId)
        //         ]);
        //         setPost(postData);
        //         setComments(commentsData);
        //     } catch (err) {
        //         console.error(err);
        //         navigate(`/board/${category}`);
        //     }
        // }

        setPost(dummyPost);
        setComments(dummyPost.comments); // 더미 데이터의 댓글 목록 
    }, [category, postId, navigate]);

    // 로직: 댓글 제출 핸들러
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        // 실제 API 댓글 예시
        /*
        try {
            await addComment(postId, newCommentText);
            setNewCommentText("");
            // 댓글 목록 새로고침 (또는 낙관적 업데이트)
        } catch (err) {
            console.error("댓글 추가 실패:", err);
        }
        */

        // 개발용: 프론트엔드에 새 댓글 추가
        const newComment = {
            id: Date.now(),
            username: "현재 사용자",
            text: newCommentText.trim(),
            createdAt: "방금 전"
        };
        setComments((prev) => [...prev, newComment]);
        setNewCommentText("");
    };

    if (!post) {
        return <div className={s.loading}>게시물 로드 중...</div>;
    }

    return (
        <div className={s.boardPageContainer}>

            {/* ⬅️ 왼쪽 메뉴 영역 */}
            <BoardMenu />

            {/* ➡️ 오른쪽 게시물 상세 내용 영역 */}
            <div className={s.postDetailArea}>

                {/* 기존 게시물 상세 내용 (postLayout 스타일을 유지) */}
                <div className={s.postLayout}>
                    {/* 헤더 영역: 뒤로가기 */}
                    <header className={s.postHeader}>
                        <button
                            className={s.backButton}
                            onClick={() => navigate(`/board/${category}`)}
                        >
                            <ArrowLeftIcon />
                        </button>
                    </header>

                    {/* 메인 콘텐츠 영역 */}
                    <section className={s.postMain}>
                        <h1 className={s.postTitle}>{post.title}</h1>

                        {/* 작성자 정보 */}
                        <div className={s.postMeta}>
                            <span className={s.postUsername}>{post.username}</span>
                            <span className={s.postSeparator}>•</span>
                            <span className={s.postTime}>{post.createdAt}</span>
                            <span className={s.postSeparator}>•</span>
                            <span className={s.postViews}>조회 {post.views}</span>
                        </div>

                        {/* 게시물 본문 */}
                        <div className={s.postContent}>
                            <p>{post.text}</p>
                        </div>

                        {/* 좋아요/댓글 정보 */}
                        <div className={s.postActions}>
                            <button className={s.actionItem}>
                                <LikeIcon /> {post.likes}
                            </button>
                            <button className={s.actionItem}>
                                <CommentIcon /> {comments.length}
                            </button>
                            <button className={s.shareButton}>
                                <ShareIcon />
                            </button>
                        </div>
                    </section>

                    {/* 댓글 입력 영역 */}
                    <section className={s.commentInputSection}>
                        <form onSubmit={handleCommentSubmit} className={s.commentForm}>
                            <textarea
                                className={s.commentTextarea}
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                placeholder="댓글을 작성해 주세요..."
                            />
                            <button
                                type="submit"
                                className={s.commentSubmitBtn}
                                disabled={!newCommentText.trim()}
                            >
                                등록
                            </button>
                        </form>
                    </section>

                    {/* 댓글 목록 영역 */}
                    <section className={s.commentListSection}>
                        <h3 className={s.commentListTitle}>댓글 ({comments.length})</h3>
                        <div className={s.commentList}>
                            {comments.map((comment) => (
                                <div key={comment.id} className={s.commentItem}>
                                    <div className={s.commentMeta}>
                                        <span className={s.commentUsername}>{comment.username}</span>
                                        <span className={s.commentTime}>{comment.createdAt}</span>
                                    </div>
                                    <p className={s.commentText}>{comment.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}