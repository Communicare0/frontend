import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BoardMenu from "@/components/board/BoardMenu";
/* import { 
    fetchPostDetail,
    fetchPostComments, 
    createComment 
} from "@/services/boardApi"; */

//개발용 모의(MOCK) API 함수 정의

const DUMMY_POST = {
    postId: "dummy-post-1",
    title: "개발용 더미 게시글입니다",
    text: "서버 연결 없이 UI 확인을 위해 로드된 임시 내용입니다.",
    username: "테스트 작성자",
    likeCount: 42,
    createdAt: new Date().toISOString(),
};

const DUMMY_COMMENTS = [
    {
        id: 1,
        username: "유저 A",
        age: 25,
        subject: "프론트",
        text: "첫 번째 댓글입니다.",
        likes: 12,
        isLiked: false,
        canReply: true,
        canEdit: true,
        canReport: true,
        replies: []
    },
    {
        id: 2,
        username: "유저 B",
        age: 30,
        subject: "백엔드",
        text: "두번째 댓글.",
        likes: 5,
        isLiked: true,
        canReply: true,
        canEdit: false,
        canReport: true,
        replies: [
            {
                id: 3,
                username: "답변자",
                age: 22,
                subject: "풀스택",
                text: "대댓글이 성공적으로 렌더링됩니다.",
                likes: 2,
                isLiked: false,
                canReply: false,
                canEdit: true,
                canReport: true,
            }
        ]
    }
];

// 모의 API 함수 정의
const fetchPostDetail = async (postId) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // 로딩 시뮬레이션
    return DUMMY_POST;
};

const fetchPostComments = async ({ postId }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return DUMMY_COMMENTS;
};

const createComment = async ({ postId, content }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, newComment: { id: Date.now(), content } }; 
};

// =================================================================

import s from "@styles/modules/board/ReadPostPage.module.css";

const ArrowLeftIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const ShareIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.59 13.51l6.83-3.79M15.41 12.49l-6.83 3.79" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const HeartIcon = ({ isLiked = false }) => <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "var(--heart-color)" : "none"} xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke={isLiked ? "none" : "currentColor"} strokeWidth="1.5" /></svg>;
const CommentIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const ProfileIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="7" r="3.5" /><path d="M19.998 18c-0.002-2.909-2.355-5.25-5.25-5.25h-5.5c-2.895 0-5.248 2.341-5.25 5.25v2.25h16.002v-2.25z" /></svg>;
const NationIcon = () => <span className={s.nationIcon} style={{ backgroundColor: '#EF4444', display: 'inline-block', width: '10px', height: '7px', borderRadius: '1px' }}></span>;


export default function ReadPostPage() {
    const { category, postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState("");
    const [isPostLiked, setIsPostLiked] = useState(false);
    const [replyToCommentId, setReplyToCommentId] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [updateKey, setUpdateKey] = useState(0); 
    const effectRan = useRef(false);

    const loadPostData = async () => {
        try {
            const postDetail = await fetchPostDetail(postId); 
            
            const commentsData = await fetchPostComments({ postId });
            
            setPost({
                ...postDetail,
                likes: postDetail.likeCount || 0,
            }); 
            setComments(commentsData);
            
        } catch (err) {
            console.error("게시물 로드 실패:", err);
            alert("게시물 정보를 불러오는데 실패했거나 존재하지 않는 게시물입니다.");
            navigate(`/board/${category}`);
        }
    };

    useEffect(() => {
        if (process.env.NODE_ENV !== 'development' || !effectRan.current) {
            loadPostData();
            effectRan.current = true;
        }
    }, [category, postId, navigate]);
    
    const handlePostLikeToggle = () => {
        setPost(prev => ({
            ...prev,
            likes: prev.likes + (isPostLiked ? -1 : 1)
        }));
        setIsPostLiked(prev => !prev);
    };

    const handleCommentLikeToggle = (commentId) => {
        setComments(prevComments => prevComments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    isLiked: !comment.isLiked,
                    likes: comment.likes + (comment.isLiked ? -1 : 1)
                };
            }
            const updatedReplies = comment.replies.map(reply => {
                if (reply.id === commentId) {
                    return {
                        ...reply,
                        isLiked: !reply.isLiked,
                        likes: (reply.likes || 0) + (reply.isLiked ? -1 : 1)
                    };
                }
                return reply;
            });
            if (updatedReplies !== comment.replies) {
                return { ...comment, replies: updatedReplies };
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
            if (process.env.NODE_ENV !== 'production' && typeof fetchPostComments === 'function' && fetchPostComments.name === 'fetchPostComments') {
                 const commentsData = await fetchPostComments({ postId });
                 setComments(commentsData);
            } else {
                 // 실제 API 연결 가정 시:
                 const commentsData = await fetchPostComments({ postId });
                 setComments(commentsData);
            }
            
            setNewCommentText("");

        } catch (err) {
            console.error("댓글 등록 실패:", err);
            alert("댓글 등록에 실패했습니다.");
        }
    };

    const handleReplySubmit = async (e, parentId) => {
        e.preventDefault();
        const trimmedReply = replyText.trim();
        if (!trimmedReply) return;

        const newReply = {
            id: Date.now(),
            username: "답글 작성자",
            age: 22,
            subject: "답글 주제",
            text: trimmedReply,
            likes: 0,
            isLiked: false,
            canReport: true,
        };

        const updatedComments = comments.map(comment => {
            if (comment.id === parentId) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply]
                };
            }
            return comment;
        });

        setComments(updatedComments);
        setReplyToCommentId(null);
        setReplyText("");
        setUpdateKey(prev => prev + 1); 
    };

    const CommentItem = ({ comment, isReply = false }) => (
        <div key={comment.id} className={`${s.commentItem} ${isReply ? s.replyItem : ''}`}>
            
            {isReply && <div className={s.replyConnector}></div>} 

            <div className={s.commentMeta}>
                <ProfileIcon />
                <span className={s.commentUsername}>{comment.username}</span>
                <span className={s.commentUserInfo}>{comment.age} / {comment.subject} /</span>
                <NationIcon />
            </div>

            <div className={s.commentTextContainer}>
                <p className={s.commentText}>{comment.text}</p>

                <div className={s.commentActions}>
                    <div className={s.commentActionGroupLeft}>
                        {comment.likes !== undefined && (
                            <button className={s.commentLike} onClick={() => handleCommentLikeToggle(comment.id)}>
                                <HeartIcon isLiked={comment.isLiked} />
                                <span>{comment.likes}</span>
                            </button>
                        )}
                        {comment.canReply && (
                            <button
                                className={s.addCommentButton}
                                onClick={() => setReplyToCommentId(comment.id)}
                            >
                                <CommentIcon />
                                <span>Add comment</span>
                            </button>
                        )}
                    </div>

                    <div className={s.commentActionGroupRight}>
                        {comment.canEdit && <span className={s.actionText}>수정 / 삭제</span>}
                        {comment.canReport && <span className={`${s.actionText} ${s.reportText}`}>신고</span>}
                    </div>
                </div>
            </div>

            {replyToCommentId === comment.id && (
                <div className={s.replyInputSection}>
                    <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className={s.commentForm}>
                        <input
                            type="text"
                            className={s.commentInput}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`${comment.username}에게 답글`}
                        />
                        <button
                            type="submit"
                            className={s.commentSubmitBtn}
                            disabled={!replyText.trim()}
                        >
                            등록
                        </button>
                    </form>
                </div>
            )}

            {comment.replies && comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
        </div>
    );

    if (!post) {
        return <div className={s.loading}>게시물 로드 중...</div>;
    }

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
                                <span className={s.postUserInfo}>20 / subject / nation icon</span>
                                <NationIcon />
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
                                <span className={s.actionText}>수정 / 삭제</span>
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
                        <div className={s.commentList} key={updateKey}>
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