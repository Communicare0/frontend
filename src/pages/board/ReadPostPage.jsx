// src/pages/board/ReadPostPage.jsx (수정된 부분)
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BoardMenu from "@/components/board/BoardMenu";
import { 
    fetchPostDetail, 
    fetchPostComments, 
    createComment, 
    updatePost, 
    deletePost, 
    updateComment, 
    deleteComment,
    likePost,      // 좋아요 API 추가
    unlikePost,    // 좋아요 취소 API 추가
    reportPost,    // 신고 API 추가
    likeComment,   // 댓글 좋아요 API 추가
    unlikeComment, // 댓글 좋아요 취소 API 추가
    reportComment, // 댓글 신고 API 추가
} from "@/services/boardApi"; 

import s from "@styles/modules/board/ReadPostPage.module.css";

// 임시 아이콘 컴포넌트 (기존 코드 유지)
const ArrowLeftIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const ShareIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 7.5L13.3333 3.33333M17.5 7.5L13.3333 11.6667M17.5 7.5H9.16667C8.44928 7.5 7.76159 7.79097 7.25825 8.3044C6.75492 8.81784 6.47917 9.51087 6.47917 10.2333V14.4167C6.47917 15.1391 6.75492 15.8322 7.25825 16.3456C7.76159 16.859 8.44928 17.15 9.16667 17.15H17.5" stroke="#6B7280" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" /></svg>;
// 좋아요 아이콘 (채워진 하트와 빈 하트)
const LikedIcon = ({ color = "#EF4444" }) => <svg width="20" height="20" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>;
const UnlikedIcon = ({ color = "#6B7280" }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>;
const CommentIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 17.5C10.663 17.5 11.313 17.3683 11.9213 17.112C12.5297 16.8557 13.0886 16.4795 13.5705 16.0098C14.0524 15.5402 14.4502 14.9818 14.7439 14.3644C15.0376 13.747 15.2215 13.0827 15.2866 12.4042C15.4058 11.1965 15.2036 9.9702 14.6974 8.84713C14.1912 7.72407 13.3934 6.74681 12.3853 6.00762C11.3771 5.26844 10.1983 4.78696 8.97191 4.59591C7.74556 4.40486 6.49504 4.50974 5.3435 4.90098C4.19196 5.29222 3.17066 5.95543 2.37895 6.83789C1.58724 7.72036 1.05607 8.78456 0.835467 9.94056C0.614868 11.0966 0.718872 12.2982 1.15177 13.4076C1.58466 14.517 2.33668 15.4851 3.32833 16.2238C3.89973 16.6433 4.54226 16.969 5.22558 17.1853C5.90891 17.4017 6.62688 17.505 7.34861 17.4907L10 17.5Z" stroke="#6B7280" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" /></svg>;

// 프로필 메타 컴포넌트 (학번/기수 추가 반영)
const UserProfileMeta = ({ userId, studentYear, subject, nationCode }) => (
    <div className={s.userProfileMeta}>
        <img className={s.profilePicture} src={`/profile/${userId}.png`} alt="프로필 사진" />
        <span className={s.profileUsername}>{userId}</span>
        <span className={s.profileSeparator}>/</span>
        <span className={s.profileYear}>{studentYear}</span> {/* 🚩 학번/기수 필드 */}
        <span className={s.profileSeparator}>/</span>
        <span className={s.profileInfo}>{subject}</span>
        <span className={s.profileSeparator}>/</span>
        <img className={s.nationIcon} src={`/flags/${nationCode}.png`} alt="국기 아이콘" />
    </div>
);

// 더미 학번/학과/국적 맵 (학번/기수 필드 추가)
const DUMMY_USER_INFO = {
    "user123": { studentYear: "20학번", subject: "경영학과", nationCode: "KR", isMe: true }, // 현재 사용자로 가정
    "author456": { studentYear: "22학번", subject: "컴퓨터공학", nationCode: "US", isMe: false },
    "commenter789": { studentYear: "23학번", subject: "경제학과", nationCode: "JP", isMe: false },
};
// 현재 로그인된 사용자의 ID (더미 데이터)
const currentUserId = "653c0e5d-8e07-4b4e-8e00-1d01d4e58ec5";



export default function ReadPostPage() {
    const { category, postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState("");
    
    // ... (mapComments 함수 및 reloadComments 함수 유지)
    function mapComments(commentResponses) {
        return commentResponses.map((c) => ({
        id: c.commentId,
        username: c.authorId ?? "익명",
        text: c.content,
        createdAt: new Date(c.createdAt).toLocaleString(),
        authorId: c.authorId,
        // 댓글 좋아요 상태 및 카운트 (API에서 받아온다고 가정)
        likes: c.likeCount || 0,
        isLiked: c.isLikedByMe || false,
        }));
    }

    async function reloadComments(currentPostId) {
        // ... (기존 로직 유지)
        const res = await fetchPostComments(currentPostId);
        const rawComments = Array.isArray(res) ? res : (res.comments || []);
        setComments(mapComments(rawComments));
    }


    // 로직: 게시물 데이터 로드 및 댓글 목록 로드
    useEffect(() => {
        async function loadPostData() {
            try {
               const [postData, commentRes] = await Promise.all([
                    fetchPostDetail(postId),
                    fetchPostComments(postId)
                ]);
                setPost({
                    id: postData.postId,
                    category: postData.category,
                    title: postData.title,
                    username: postData.userId, 
                    createdAt: new Date(postData.createdAt).toLocaleString(),
                    views: postData.viewCount,
                    // 좋아요 상태 및 카운트 (API에서 받아온다고 가정)
                    likes: postData.likeCount || 0,
                    isLiked: postData.isLikedByMe || false, 
                    text: postData.content,
                });

                const rawComments = Array.isArray(commentRes) ? commentRes : (commentRes.comments || []);
                setComments(mapComments(rawComments));
            } catch (err) {
                console.error(err);
                navigate(`/board/${category}`);
            }
        }

        loadPostData();
    }, [category, postId, navigate]);

    // 로직: 게시글 수정 핸들러
    const handlePostEdit = () => {
        navigate(`/board/${category}/write?postId=${postId}`);
    };

    // 로직: 게시글 삭제 핸들러
    const handlePostDelete = async () => {
        if (!window.confirm("게시글을 삭제하시겠습니까?")) return;
        try {
            await deletePost(postId);
            alert("게시글이 삭제되었습니다.");
            navigate(`/board/${category}`);
        } catch (err) {
            console.error("게시글 삭제 실패:", err);
            alert("게시글 삭제에 실패했습니다.");
        }
    };
    
    // 로직: 게시글 신고 핸들러
    const handlePostReport = async () => {
        const reason = prompt("게시글 신고 사유를 입력해 주세요.");
        if (!reason || !reason.trim()) return;

        try {
            await reportPost(postId, reason);
            alert("게시글이 신고되었습니다. 관리자 검토 후 처리됩니다.");
        } catch (err) {
            console.error("게시글 신고 실패:", err);
            alert("게시글 신고에 실패했습니다.");
        }
    };

    // 로직: 게시글 좋아요 토글 핸들러
    const handlePostLikeToggle = async () => {
        if (!post) return;
        try {
            if (post.isLiked) {
                await unlikePost(postId);
                setPost(p => ({ ...p, likes: p.likes - 1, isLiked: false }));
            } else {
                await likePost(postId);
                setPost(p => ({ ...p, likes: p.likes + 1, isLiked: true }));
            }
        } catch (err) {
            console.error("게시글 좋아요 토글 실패:", err);
            alert("좋아요 처리에 실패했습니다.");
        }
    };

    // 로직: 댓글 제출 핸들러 (기존 로직 유지)
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;
        
        try {
            await createComment({ postId, content: newCommentText.trim() });
            setNewCommentText("");
            await reloadComments(postId);
        } catch (err) {
            console.error("댓글 추가 실패:", err);
            alert("댓글 등록에 실패했습니다.");
        }
    };
    
    // 로직: 댓글 수정 핸들러
    const handleCommentEdit = async (commentId, currentContent) => {
        // ... (기존 로직 유지)
        const newContent = prompt("수정할 내용을 입력해주세요:", currentContent);
        if (!newContent || newContent.trim() === currentContent.trim()) return;

        try {
            await updateComment({ commentId, content: newContent.trim() });
            alert("댓글이 수정되었습니다.");
            await reloadComments(postId);
        } catch (err) {
            console.error("댓글 수정 실패:", err);
            alert("댓글 수정에 실패했습니다.");
        }
    };

    // 🚩 로직: 댓글 삭제 핸들러
    const handleCommentDelete = async (commentId) => {
        // ... (기존 로직 유지)
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
        try {
            await deleteComment({ commentId });
            alert("댓글이 삭제되었습니다.");
            await reloadComments(postId);
        } catch (err) {
            console.error("댓글 삭제 실패:", err);
            alert("댓글 삭제에 실패했습니다.");
        }
    };

    // 🚩 로직: 댓글 신고 핸들러
    const handleCommentReport = async (commentId) => {
        const reason = prompt("댓글 신고 사유를 입력해 주세요.");
        if (!reason || !reason.trim()) return;

        try {
            await reportComment(commentId, reason);
            alert("댓글이 신고되었습니다. 관리자 검토 후 처리됩니다.");
        } catch (err) {
            console.error("댓글 신고 실패:", err);
            alert("댓글 신고에 실패했습니다.");
        }
    };

    // 로직: 댓글 좋아요 토글 핸들러
    const handleCommentLikeToggle = async (commentId, isLiked) => {
        try {
            if (isLiked) {
                await unlikeComment(commentId);
            } else {
                await likeComment(commentId);
            }
            // 댓글 목록을 다시 로드하여 상태 갱신
            await reloadComments(postId);
        } catch (err) {
            console.error("댓글 좋아요 토글 실패:", err);
            alert("좋아요 처리에 실패했습니다.");
        }
    };


    if (!post) {
        return <div className={s.loading}>게시물 로드 중...</div>;
    }

    //게시글 작성자 정보 (더미)
    const postAuthorInfo = DUMMY_USER_INFO[post.username] || { studentYear: "??", subject: "알수없음", nationCode: "??", isMe: false };
    const isPostAuthor = post.username === currentUserId; // 현재 사용자가 작성자인지 확인

    return (
        <div className={s.boardPageContainer}>

            <BoardMenu />

            <div className={s.postDetailArea}>

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

                        {/* 작성자 정보 (프로필 정보 추가) */}
                        <div className={s.postAuthorInfo}>
                            <UserProfileMeta 
                                userId={post.username} 
                                studentYear={postAuthorInfo.studentYear} // 🚩 학번 전달
                                subject={postAuthorInfo.subject} 
                                nationCode={postAuthorInfo.nationCode} 
                            />
                            <div className={s.postMeta}>
                                <span className={s.postTime}>{post.createdAt}</span>
                                <span className={s.postSeparator}>•</span>
                                <span className={s.postViews}>조회 {post.views}</span>
                            </div>
                        </div>

                        {/* 게시물 본문 */}
                        <div className={s.postContent}>
                            <p>{post.text}</p>
                        </div>
                        
                        {/* 게시글 하단 컨트롤 영역 (좋아요, 공유, 수정/삭제/신고) */}
                        <div className={s.postFooterControls}>
                            <div className={s.interactionGroup}>
                                <button className={s.likeButton} onClick={handlePostLikeToggle}>
                                    {post.isLiked ? <LikedIcon /> : <UnlikedIcon />}
                                    <span>{post.likes}</span>
                                </button>
                                <button className={s.shareButton}>
                                    <ShareIcon />
                                </button>
                            </div>

                            <div className={s.postControls}>
                                {isPostAuthor ? (
                                    <>
                                        <button className={s.controlButton} onClick={handlePostEdit}>수정</button>
                                        <span className={s.postSeparator}>/</span>
                                        <button className={s.controlButton} onClick={handlePostDelete}>삭제</button>
                                    </>
                                ) : (
                                    <button className={s.controlButton} onClick={handlePostReport}>신고</button>
                                )}
                            </div>
                        </div>

                        {/* 댓글 입력 영역 복구 및 스타일링 */}
                        <section className={s.commentInputSection}>
                            <form className={s.commentForm} onSubmit={handleCommentSubmit}>
                                <textarea
                                    className={s.commentInput}
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
                        
                    </section>

                    {/* 댓글 목록 영역 */}
                    <section className={s.commentListSection}>
                        <h3 className={s.commentListTitle}>댓글 ({comments.length})</h3>
                        <div className={s.commentList}>
                            {comments.map((comment) => {
                                // 🚩 댓글 작성자 정보 (더미)
                                const commentAuthorInfo = DUMMY_USER_INFO[comment.authorId] || { studentYear: "??", subject: "알수없음", nationCode: "??", isMe: false };
                                const isCommentAuthor = comment.authorId === currentUserId; 
                                const commentMetaId = `comment-meta-${comment.id}`;

                                return (
                                    <div key={comment.id} className={s.commentItem}>
                                        {/* 댓글 작성자 프로필 정보 */}
                                        <div className={s.commentHeader}>
                                            <UserProfileMeta
                                                userId={comment.authorId}
                                                studentYear={commentAuthorInfo.studentYear} // 학번 전달
                                                subject={commentAuthorInfo.subject}
                                                nationCode={commentAuthorInfo.nationCode}
                                            />
                                        </div>
                                        
                                        <div className={s.commentBody}>
                                            <p className={s.commentText}>{comment.text}</p>
                                            
                                            {/* 댓글 하단 컨트롤 영역 (오른쪽 하단) */}
                                            <div className={s.commentFooterControls}>
                                                <div className={s.commentMetaInfo}>
                                                    <span className={s.commentTime}>{comment.createdAt}</span>
                                                    <span className={s.commentSeparator}>•</span>
                                                    {/* 댓글 좋아요 버튼 */}
                                                    <button className={s.commentLikeButton} onClick={() => handleCommentLikeToggle(comment.id, comment.isLiked)}>
                                                        {comment.isLiked ? <LikedIcon color="#EF4444" /> : <UnlikedIcon color="#6B7280" />}
                                                        <span>{comment.likes}</span>
                                                    </button>
                                                </div>

                                                <div className={s.commentControls}>
                                                    {isCommentAuthor ? (
                                                        <>
                                                            <button className={s.controlButton} onClick={() => handleCommentEdit(comment.id, comment.text)}>수정</button>
                                                            <span className={s.postSeparator}>/</span>
                                                            <button className={s.controlButton} onClick={() => handleCommentDelete(comment.id)}>삭제</button>
                                                        </>
                                                    ) : (
                                                        <button className={s.controlButton} onClick={() => handleCommentReport(comment.id)}>신고</button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}