import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchUserPosts } from "@/services/boardApi";
import PostCard from "@/components/board/PostCard.jsx";

import s from "@styles/modules/board/MyBoardPage.module.css";

export default function MyBoardPage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function loadPosts() {
            try {
                const data = await fetchUserPosts();

                const normalized = data.map((p) => ({
                    id: p.postId,
                    title: p.title,
                    text: p.content,
                    username: p.userId,
                    createdAt: new Date(p.createdAt).toLocaleString(),
                    likes: p.likeCount,
                    commentCount: 0,
                    category: p.category,
                }));

                setPosts(normalized);

            } catch (err) {
                console.error(err);
            }
        }

        loadPosts();
    })
    return (
        <div className={s.myboardLayout}>
            <div className={s.myboardPostList}>
                {posts.map((p) => (
                    <Link
                        key={p.id}
                        to={`/board/${p.category}/${p.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <PostCard post={p} />
                    </Link>
                ))}
            </div>
        </div>
    )
}