// src/pages/board/ReadPostPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import BoardMenu from "@/components/board/BoardMenu";
import useAuth from "@/hooks/useAuth";
import {
    fetchPostDetail,
    fetchPostComments,
    createComment,
    updatePost,
    deletePost,
    updateComment,
    deleteComment,
    likePost,
    unlikePost,
    reportPost,
    reportComment,
} from "@/services/boardApi";
import NationalityFlag from "@/components/ui/NationalityFlag";
import { translate } from "@/services/boardApi";

import s from "@styles/modules/board/ReadPostPage.module.css";

// 아이콘 컴포넌트
const ArrowLeftIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const LikedIcon = ({ color = "#EF4444" }) => <svg width="20" height="20" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>;
const UnlikedIcon = ({ color = "#6B7280" }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>;




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

export default function ReadPostPage() {
    const { category, postId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useAuth();
    const currentUserId = user?.id || user?.userId || null;

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState("");

    // 게시글 인라인 수정 관련 상태
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedContent, setEditedContent] = useState("");

    // 번역 관련
    const [translatedTitle, setTranslatedTitle] = useState();
    const [translatedContent, setTranslatedContent] = useState();

    const [isLoading, setIsLoading] = useState(false);

    function mapComments(commentResponses) {
        return commentResponses.map((c) => ({
            id: c.commentId,
            text: c.content,
            createdAt: new Date(c.createdAt).toLocaleString(),
            authorId: c.authorId,
            studentYear: c.authorStudentYear,
            department: c.authorDepartment,
            nationality: c.authorNationality,
            likes: c.likeCount || 0,
            isLiked: c.isLikedByMe || false,
        }));
    }

    async function reloadComments(currentPostId) {
        try {
            const res = await fetchPostComments(currentPostId);
            const rawComments = Array.isArray(res) ? res : (res.comments || []);
            setComments(mapComments(rawComments));
        } catch (err) {
            console.error("댓글 로드 실패:", err);
        }
    }

    const loadPostData = useCallback(async () => {
        try {
            const [postData, commentRes] = await Promise.all([
                fetchPostDetail(postId),
                fetchPostComments(postId),
            ]);

            const loadedPost = {
                id: postData.postId,
                category: postData.category,
                title: postData.title,

                authorId: postData.authorId ?? postData.userId,

                studentYear: postData.authorStudentYear,
                department: postData.authorDepartment,
                nationality: postData.authorNationality,

                createdAt: new Date(postData.createdAt).toLocaleString(),
                views: postData.viewCount,
                likes: postData.likeCount || 0,
                isLiked: postData.likedByCurrentUser || false,
                text: postData.content,
            };

            setPost(loadedPost);
            setEditedTitle(loadedPost.title);
            setEditedContent(loadedPost.text);

            setTranslatedTitle(loadedPost.title);
            setTranslatedContent(loadedPost.text);

            const rawComments = Array.isArray(commentRes)
                ? commentRes
                : (commentRes.comments || []);
            setComments(mapComments(rawComments));
        } catch(err) {
            console.error(err);
            navigate(`/board/${category}`);
        }
    }, [postId, category, navigate]);


    useEffect(() => {
        loadPostData();
    }, [loadPostData]);

    // 게시글 수정 모드 진입 핸들러
    const handlePostEdit = () => {
        // 인라인 수정 모드 활성화 및 현재 데이터로 임시 상태 초기화
        setEditedTitle(post.title);
        setEditedContent(post.text);
        setIsEditing(true);
    };

    // 게시글 저장 핸들러
    const handlePostSave = async () => {
        if (!editedTitle.trim() || !editedContent.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }
        if (!window.confirm("게시글을 수정하시겠습니까?")) return;

        try {
            await updatePost(postId, {
                title: editedTitle.trim(),
                content: editedContent.trim(),
            });

            // Post state 갱신 및 읽기 모드로 전환
            setPost(p => ({
                ...p,
                title: editedTitle.trim(),
                text: editedContent.trim()
            }));

            await loadPostData();
            
            setIsEditing(false);
            alert("게시글이 성공적으로 수정되었습니다.");

        } catch (err) {
            console.error("게시글 수정 실패:", err);
            alert("게시글 수정에 실패했습니다.");
        }
    };

    // 게시글 수정 취소 핸들러
    const handlePostCancel = () => {
        if (window.confirm("수정 사항을 취소하고 원래 상태로 되돌리시겠습니까?")) {
            // 임시 상태를 원래 post 상태로 복구
            setEditedTitle(post.title);
            setEditedContent(post.text);
            setIsEditing(false);
        }
    };

    // 게시글 삭제 핸들러
    const handlePostDelete = async () => {
        if (!window.confirm("게시글을 삭제하시겠습니까?")) return;
        try {
            await deletePost(postId);
            alert("게시글이 삭제되었습니다.");
            navigate(`/board/${category}`);
        } catch (err) {
            console.error("게시글 삭제 실패:", err);

            // API 에러 상태 코드를 포함하여 사용자에게 알려줍니다.
            const status = err.status || '알 수 없음';
            if (status === 403 || status === 401) {
                alert(`게시글 삭제에 실패했습니다: 접근 권한이 없거나 (HTTP ${status}), 로그인 상태를 확인해주세요.`);
            } else {
                alert(`게시글 삭제에 실패했습니다. (HTTP ${status})`);
            }
        }
    };

    // 게시글 신고 핸들러
    const handlePostReport = async () => {
        const reason = prompt("게시글 신고 사유를 입력해 주세요.");
        if (!reason || !reason.trim()) return;
        try {
            await reportPost(postId, reason);
            alert("게시글이 신고되었습니다. 관리자 검토 후 처리됩니다.");
        } catch (err) {
            console.error("게시글 신고 실패:", err);

            // API 에러 상태 코드를 포함하여 사용자에게 알려줍니다.
            const status = err.status || '알 수 없음';
            alert(`게시글 신고에 실패했습니다. (HTTP ${status})`);
        }
    };

    // 게시글 좋아요 토글 핸들러
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

    // 댓글 제출 핸들러
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

    // 댓글 수정 핸들러
    const handleCommentEdit = async (commentId, currentContent) => {
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

    // 댓글 삭제 핸들러
    const handleCommentDelete = async (commentId) => {
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

    // 댓글 신고 핸들러
    const handleCommentReport = async (commentId) => {
        const reason = prompt("댓글 신고 사유를 입력해 주세요.");
        if (!reason || !reason.trim()) return;
        try {
            await reportComment(commentId, reason);
            alert("댓글이 신고되었습니다. 관리자 검토 후 처리됩니다.");
        } catch (err) {
            console.error("댓글 신고 실패:", err);

            // API 에러 상태 코드를 포함하여 사용자에게 알려줍니다.
            const status = err.status || '알 수 없음';
            alert(`댓글 신고에 실패했습니다. (HTTP ${status})`);
        }
    };

    const handleBack = () => {
        const from = location.state?.from;

        if(from === "myboard") {
            navigate("/board/myboard");
            return;
        }
        if(from === "board") {
            navigate(`/board/${category}`);
            return;
        }
        if(window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/board")
        }
    };

    const handleTranslate = async () => {
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

    if (!post) {
        return <div className={s.loading}>게시물 로드 중...</div>;
    }

    const isPostAuthor = currentUserId && post.authorId === currentUserId;

    return (
        <div className={s.boardPageContainer}>

            <BoardMenu />

            <div className={s.postDetailArea}>

                <div className={s.postLayout}>
                    {/* 헤더 영역: 뒤로가기 버튼 */}
                    <header className={s.postHeader}>
                        <button
                            className={s.backButton}
                            onClick={handleBack}
                        >
                            <ArrowLeftIcon />
                        </button>

                        {!isEditing &&
                            <button className={s.translateButton} onClick={handleTranslate} type="button" disabled={isLoading}>
                                <img
                                    src="/image/translate.svg"
                                    alt="번역"
                                    className={isLoading ? s.translateLoading : ""}
                                />
                            </button>
                        }
                        
                    </header>

                    {/* 메인 콘텐츠 영역 */}
                    <section className={s.postMain}>

                        {/* 제목 영역: 수정 모드에 따라 input 또는 h1 렌더링 */}
                        {isEditing ? (
                            <input
                                className={s.editTitleInput}
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                disabled={!isEditing}
                            />
                        ) : (
                            <h1 className={s.postTitle}>{translatedTitle}</h1>
                        )}

                        {/* 작성자 정보 */}
                        <div className={s.postAuthorInfo}>
                            <UserProfileMeta
                                studentYear={post.studentYear}
                                department={post.department}
                                nationality={post.nationality}
                            />
                            <div className={s.postMeta}>
                                <span className={s.postTime}>{post.createdAt}</span>
                                <span className={s.postSeparator}>•</span>
                                <span className={s.postViews}>조회 {post.views}</span>
                            </div>
                        </div>

                        {/* 게시물 본문 */}
                        <div className={s.postContent}>
                            {/* 내용 영역: 수정 모드에 따라 textarea 또는 p 렌더링 */}
                            {isEditing ? (
                                <textarea
                                    className={s.editContentTextarea}
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    disabled={!isEditing}
                                />
                            ) : (
                                <p>{translatedContent}</p>
                            )}
                        </div>

                        {/* 게시글 하단 컨트롤 영역 (좋아요, 공유, 수정/삭제/신고/저장/취소) */}
                        <div className={s.postFooterControls}>
                            <div className={s.interactionGroup}>
                                <button className={s.likeButton} onClick={handlePostLikeToggle} disabled={isEditing}>
                                    {post.isLiked ? <LikedIcon /> : <UnlikedIcon />}
                                    <span>{post.likes}</span>
                                </button>
                            </div>

                            <div className={s.postControls}>
                                {isPostAuthor ? (
                                    isEditing ? (
                                        <>
                                            <button className={s.controlButton} onClick={handlePostSave}>저장</button>
                                            <span className={s.postSeparator}>/</span>
                                            <button className={s.controlButton} onClick={handlePostCancel}>취소</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className={s.controlButton} onClick={handlePostEdit}>수정</button>
                                            <span className={s.postSeparator}>/</span>
                                            <button className={s.controlButton} onClick={handlePostDelete}>삭제</button>
                                        </>
                                    )
                                ) : (
                                    <button className={s.controlButton} onClick={handlePostReport}>신고</button>
                                )}
                            </div>
                        </div>

                        {/* 댓글 입력 영역 */}
                        <section className={s.commentInputSection}>
                            <form className={s.commentForm} onSubmit={handleCommentSubmit}>
                                <textarea
                                    className={s.commentInput}
                                    value={newCommentText}
                                    onChange={(e) => setNewCommentText(e.target.value)}
                                    placeholder="댓글을 작성해 주세요..."
                                    disabled={isEditing} // 게시글 수정 중에는 댓글 입력 비활성화
                                />
                                <button
                                    type="submit"
                                    className={s.commentSubmitBtn}
                                    disabled={!newCommentText.trim() || isEditing}
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
                                const isCommentAuthor = currentUserId && comment.authorId == currentUserId;
                                return (
                                    <div key={comment.id} className={s.commentItem}>
                                        <div className={s.commentHeader}>
                                            <UserProfileMeta
                                                studentYear={comment.studentYear}
                                                department={comment.department}
                                                nationality={comment.nationality}
                                            />
                                        </div>

                                        <div className={s.commentBody}>
                                            <p className={s.commentText}>{comment.text}</p>

                                            <div className={s.commentFooterControls}>
                                                <div className={s.commentMetaInfo}>
                                                    {/*<span className={s.commentTime}>{comment.createdAt}</span>*/}
                                                </div>

                                                <div className={s.commentControls}>
                                                    {isCommentAuthor ? (
                                                        <>    
                                                            <button className={s.controlButton} onClick={() => handleCommentEdit(comment.id, comment.text)} disabled={isEditing}>수정</button>
                                                            <span className={s.postSeparator}>/</span>
                                                            <button className={s.controlButton} onClick={() => handleCommentDelete(comment.id)} disabled={isEditing}>삭제</button>
                                                        </>
                                                    ) : ( 
                                                        <button className={s.controlButton} onClick={() => handleCommentReport(comment.id)} disabled={isEditing}>신고</button>
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