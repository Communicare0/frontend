import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BoardMenu from "@/components/board/BoardMenu";
import {
    fetchPostDetail,
    fetchPostComments,
    createComment,
    updatePost, // API 연동을 위해 임포트 유지
    deletePost, // API 연동을 위해 임포트 유지
    updateComment, // API 연동을 위해 임포트 유지
    deleteComment // API 연동을 위해 임포트 유지
} from "@/services/boardApi";

import s from "@styles/modules/board/ReadPostPage.module.css";

// ======================= 상수 및 아이콘 정의  =======================

const TEMP_USER_ID = "current-user-id-for-auth-check"; // 🚨 인증 Epic 구현 전 임시 사용자 ID
const IS_OWNER_ENABLED = true; // 🚨 UI 테스트를 위해 권한 임시 활성화

// API 호출 실패 시 사용될 임시 Mock 데이터 (게시글)
const FALLBACK_POST = {
    postId: "fallback-post",
    title: "⚠️ API 로드 실패: 임시 게시글",
    content: "서버 연결에 실패하여 표시되는 테스트 내용입니다.",
    author: { nickname: "테스트 관리자" },
    createdAt: new Date().toISOString(),
    likeCount: 99,
    viewCount: 1000,
};

// API 호출 실패 시 사용될 임시 Mock 데이터 (댓글)
const FALLBACK_COMMENTS = [
    { commentId: "fc-1", author: { nickname: "User A" }, content: "임시 댓글입니다. (수정/삭제 가능)", age: 20, subject: "컴퓨터", likes: 3, isLiked: false, canEdit: true, canReport: false },
    { commentId: "fc-2", author: { nickname: "User B" }, content: "서버 연결 확인 필요. (신고 가능)", age: 22, subject: "경영", likes: 1, isLiked: false, canEdit: false, canReport: true },
];

const ArrowLeftIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const ShareIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.59 13.51l6.83-3.79M15.41 12.49l-6.83 3.79" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const HeartIcon = ({ isLiked = false }) => <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "var(--heart-color)" : "none"} xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke={isLiked ? "none" : "currentColor"} strokeWidth="1.5" /></svg>;
const ProfileIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="7" r="3.5" /><path d="M19.998 18c-0.002-2.909-2.355-5.25-5.25-5.25h-5.5c-2.895 0-5.248 2.341-5.25 5.25v2.25h16.002v-2.25z" /></svg>;
const NationIcon = () => <span className={s.nationIcon} style={{ backgroundColor: '#EF4444', display: 'inline-block', width: '10px', height: '7px', borderRadius: '1px' }}></span>;

// 현재 백엔드 응답을 프론트엔드 UI 구조에 맞게 매핑하는 함수 (임시)
function mapPostData(postResponse) {
    if (!postResponse) return null;

    // 💡 권한 임시 활성화
    const isOwner = IS_OWNER_ENABLED; 

    return {
        id: postResponse.postId,
        category: postResponse.category,
        title: postResponse.title,
        text: postResponse.content,
        username: postResponse.author?.nickname || "익명",
        createdAt: new Date(postResponse.createdAt).toLocaleDateString(),
        likes: postResponse.likeCount || 0,
        views: postResponse.viewCount || 0,
        canEdit: postResponse.canEdit || isOwner, // Mock/Fallback 데이터에 canEdit이 없으면 isOwner 사용
        canDelete: postResponse.canDelete || isOwner, // Mock/Fallback 데이터에 canDelete가 없으면 isOwner 사용
    };
}

// 댓글 데이터 구조를 백엔드 응답에 맞게 매핑하는 함수  (임시)
function mapComments(commentResponses) {
    const rawComments = Array.isArray(commentResponses) ? commentResponses : (commentResponses.comments || []);

    return rawComments.map((c) => {
        // 💡 권한 임시 활성화
        const isOwner = IS_OWNER_ENABLED; 
        return {
            id: c.commentId,
            username: c.author?.nickname ?? "익명",
            text: c.content,
            age: c.age || 20, 
            subject: c.subject || "학과 미정", 
            likes: c.likes || 0,
            isLiked: c.isLiked || false,
            canEdit: c.canEdit || isOwner, // Mock/Fallback 데이터 필드 없으면 isOwner 사용
            canDelete: c.canDelete || isOwner,
            canReport: c.canReport || !isOwner, 
        };
    });
}


export default function ReadPostPage() {
    const { category, postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState("");
    const [isPostLiked, setIsPostLiked] = useState(false);

    // 댓글 목록 새로고침
    const reloadComments = async (currentPostId) => {
        try {
            const res = await fetchPostComments(currentPostId);
            setComments(mapComments(res));
        } catch (err) {
            console.error("댓글 목록 로드 실패:", err);
        }
    }

    const loadPostData = async () => {
        try {
            const [postRes, commentRes] = await Promise.all([
                fetchPostDetail(postId),
                fetchPostComments(postId)
            ]);

            setPost(mapPostData(postRes));
            setComments(mapComments(commentRes));

        } catch (err) {
            console.error("게시물 로드 실패: API 호출 오류", err);
            
            // 🚨 API 호출 실패 시, fallback Mock 데이터를 사용하여 UI를 표시
            alert("⚠️ 서버 연결에 실패했습니다. 임시 Mock 데이터를 표시합니다. 콘솔에서 오류를 확인하세요.");
            setPost(mapPostData(FALLBACK_POST));
            setComments(mapComments(FALLBACK_COMMENTS));
        }
    };

    useEffect(() => {
        loadPostData();
    }, [category, postId, navigate]);

    // 좋아요 기능은 현재 백엔드 API 미지원으로 프론트엔드 상태만 임시 업데이트
    const handlePostLikeToggle = () => {
        setPost(prev => ({
            ...prev,
            likes: prev.likes + (isPostLiked ? -1 : 1)
        }));
        setIsPostLiked(prev => !prev);
    };

    // 댓글 좋아요 기능은 현재 백엔드 API 미지원으로 프론트엔드 상태만 임시 업데이트
    const handleCommentLikeToggle = (commentId) => {
        setComments(prevComments => prevComments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    isLiked: !comment.isLiked,
                    likes: (comment.likes || 0) + (comment.isLiked ? -1 : 1)
                };
            }
            return comment;
        }));
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const trimmedComment = newCommentText.trim();
        if (!trimmedComment) return;

        try {
            await createComment({ postId, content: trimmedComment });
            await reloadComments(postId);
            setNewCommentText("");

        } catch (err) {
            console.error("댓글 등록 실패:", err);
            alert("댓글 등록에 실패했습니다. (API 오류)");
        }
    };

    // ======================== 핸들러 함수 ========================

    const handleDeletePost = async () => {
        if (!window.confirm("게시글을 삭제하시겠습니까?")) return;

        try {
            // 🚨 deletePost(userId, postId)
            await deletePost(TEMP_USER_ID, post.id); 
            alert("게시글이 삭제되었습니다.");
            navigate(`/board/${category}`);
        } catch (err) {
            console.error("게시글 삭제 실패:", err);
            alert("게시글 삭제에 실패했습니다. (API 오류 또는 권한 없음)");
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            // 🚨 deleteComment({ userId, commentId })
            await deleteComment({ userId: TEMP_USER_ID, commentId }); 
            alert("댓글이 삭제되었습니다.");
            await reloadComments(postId);
        } catch (err) {
            console.error("댓글 삭제 실패:", err);
            alert("댓글 삭제에 실패했습니다. (API 오류 또는 권한 없음)");
        }
    };

    // 💡 게시글 수정 페이지 이동 핸들러 (WritePostPage로 연결)
    const handleEditPost = () => {
        // routes.jsx에 추가된 경로로 이동
        navigate(`/board/${category}/${postId}/edit`); 
    };
    
    // 댓글 수정 로직 (현재는 API 호출만 준비 - 인라인 수정 UI 구현 필요)
    const handleEditComment = async (commentId) => {
        const newContent = prompt("수정할 댓글 내용을 입력해주세요:");
        if (!newContent || newContent.trim() === "") return;

        try {
            // 🚨 updateComment({ commentId, content })
            await updateComment({ commentId, content: newContent.trim() });
            alert("댓글이 수정되었습니다.");
            await reloadComments(postId); 
        } catch (err) {
            console.error("댓글 수정 실패:", err);
            alert("댓글 수정에 실패했습니다. (API 오류 또는 권한 없음)");
        }
    };

    // ======================== 컴포넌트 렌더링 ========================

    const CommentItem = ({ comment }) => (
        <div key={comment.id} className={s.commentItem}> 
            <div className={s.commentMeta}>
                <ProfileIcon />
                <span className={s.commentUsername}>{comment.username}</span>
                <span className={s.commentUserInfo}>{comment.age} / {comment.subject}</span>
                <NationIcon />
            </div>

            <div className={s.commentTextContainer}>
                <p className={s.commentText}>{comment.text}</p>

                <div className={s.commentActions}>
                    <div className={s.commentActionGroupLeft}>
                        <button className={s.commentLike} onClick={() => handleCommentLikeToggle(comment.id)}>
                            <HeartIcon isLiked={comment.isLiked} />
                            <span>{comment.likes}</span>
                        </button>
                    </div>
                    <div className={s.commentActionGroupRight}>
                        {/* 💡 댓글 수정/삭제 핸들러 연결 */}
                        {(comment.canEdit || comment.canDelete) && (
                            <>
                                <span
                                    className={s.actionText}
                                    onClick={() => handleEditComment(comment.id)} 
                                >
                                    수정
                                </span>
                                <span
                                    className={s.actionText}
                                    onClick={() => handleDeleteComment(comment.id)} 
                                >
                                    / 삭제
                                </span>
                            </>
                        )}
                        {/* 신고 버튼 */}
                        {comment.canReport && <span className={`${s.actionText} ${s.reportText}`}>신고</span>}
                    </div>
                </div>
            </div>
        </div>
    );

    if (!post) {
        return <div className={s.loading}>게시물 로드 중...</div>;
    }

    const totalComments = comments.length;

    return (
        <div className={s.boardPageContainer}>
            <BoardMenu />
            <div className={s.postDetailArea}>
                <div className={s.postLayout}>

                    <header className={s.postHeader}>
                        <button
                            className={s.backButton}
                            onClick={() => navigate(`/board/${category}`)}
                        >
                            <ArrowLeftIcon />
                        </button>
                        <div className={s.postProfile}>
                            <ProfileIcon />
                            <div className={s.postProfileMeta}>
                                <span className={s.postUsername}>{post.username}</span>
                                <span className={s.postUserInfo}>20 / subject</span>
                                <NationIcon />
                                <span className={s.postTime}>
                                    {post.createdAt}
                                </span>
                            </div>
                        </div>
                    </header>

                    <section className={s.postMain}>
                        <h1 className={s.postTitle}>{post.title}</h1>
                        <div className={s.postContent}>
                            <p>{post.text}</p>
                        </div>

                        <div className={s.postActionsRow}>
                            <div className={s.actionGroup}>
                                <button className={s.likeButton} onClick={handlePostLikeToggle}>
                                    <HeartIcon isLiked={isPostLiked} />
                                    <span className={s.likeCount}>{post.likes}</span>
                                </button>
                                <button className={s.shareButton}>
                                    share
                                    <ShareIcon />
                                </button>
                            </div>
                            <div className={s.editDeleteGroup}>
                                {/* 💡 게시글 수정/삭제 핸들러 연결 */}
                                {(post.canEdit || post.canDelete) && (
                                    <>
                                        <span
                                            className={s.actionText}
                                            onClick={handleEditPost} // 수정 페이지 이동
                                        >
                                            수정
                                        </span>
                                        <span
                                            className={s.actionText}
                                            onClick={handleDeletePost} // 삭제 API 호출
                                        >
                                            / 삭제
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className={s.commentInputSection}>
                        <form onSubmit={handleCommentSubmit} className={s.commentForm}>
                            <input
                                type="text"
                                className={s.commentInput}
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                placeholder="Add comment"
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

                    <section className={s.commentListSection}>
                        <h3 className={s.commentListTitle}>댓글 ({totalComments})</h3>
                        <div className={s.commentList}>
                            {comments.map((comment) => (
                                <CommentItem key={comment.id} comment={comment} />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}