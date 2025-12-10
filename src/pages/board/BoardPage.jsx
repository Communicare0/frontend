import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import BoardMenu from "@/components/board/BoardMenu";
import PostCard from "@/components/board/PostCard";
import { fetchBoardPosts } from "@/services/boardApi";

import s from "@styles/modules/board/BoardPage.module.css";

export default function BoardPage() {
    const { category } = useParams();
    const navigate = useNavigate();
    
    const [rawPosts, setRawPosts] =  useState([]);
    const [sortOption, setSortOption] =  useState("latest");
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function loadPosts() {
        
            try {
                const data = await fetchBoardPosts({ category });
                setRawPosts(data);
            } catch (err) {
                console.error(err);
            }
        }

        if(category) {
            loadPosts();
        }
    }, [category]);

    const posts = useMemo(() => {
        if(!rawPosts) return [];

        let filtered = rawPosts;
        if(search.trim()) {
            filtered = filtered.filter((p) => 
                p.title?.toLowerCase().includes(search.toLowerCase()) ||
                p.content?.toLowerCase().includes(search.toLowerCase())
            );
        }

        let sorted = filtered.slice();
        if(sortOption === "latest") {
            sorted.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if(sortOption === "like_desc") {
            sorted.sort((a,b) => b.likeCount - a.likeCount);
        } else if(sortOption === "view_desc") {
            sorted.sort((a,b) => b.viewCount - a.viewCount);
        }

        return sorted.map((p) => ({
            id: p.postId,
            title: p.title,
            text: p.content,
            studentYear: p.authorStudentYear,
            department: p.authorDepartment,
            nationality: p.authorNationality,
            createdAt: new Date(p.createdAt).toLocaleString(),
            likes: p.likeCount,
            view: p.viewCount,
            commentCount: 0,
        }));
    }, [rawPosts, sortOption, search]);

    const handleTopClick = () => {
        const contentEl = document.querySelector("[data-layout-content]");
        if(contentEl) {
            contentEl.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    const handleWriteClick = () => {
        //글쓰기 모달 또는 /board/:category/write로 이동
        navigate(`/board/${category}/write`);
    }

    return (
        <div className={s.boardLayout}>
            <BoardMenu />

            <section className={s.boardMain}>
                <header className={s.boardMainHeader}>
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="latest">최신순</option>
                        <option value="like_desc">좋아요순</option>
                        <option value="view_desc">조회순</option>
                    </select>

                    <div className={s.boardSearchWrapper}>
                        <input
                            className={s.boardSearchInput}
                            type="text"
                            placeholder="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </header>

                <div className={s.boardPostList}>
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            to={`/board/${category}/${post.id}`}
                            state={{ from: "board", category }}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <PostCard post={post} />
                        </Link>
                    ))}
                </div>
                        
                <button className={s.boardTopBtn} onClick={handleTopClick}>
                    Top
                </button>
                <button className={s.boardWriteBtn} onClick={handleWriteClick}>
                    <img src="/image/write.png" alt="write" style={{ width: 32, height: 32 }} />
                </button>
            </section>
        </div>
    );
}