import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import BoardMenu from "@/components/board/BoardMenu";
import PostCard from "@/components/board/PostCard";
/*import { fetchBoardPosts } from "@/services/boardApi";*/
import { testPost } from "../../services/boardApi";/*
import { Test } from "@/components/board/Test";*/

import s from "@styles/modules/board/BoardPage.module.css";

export default function BoardPage() {
    const { category } = useParams();
    const navigate = useNavigate();
    
    const [posts, setPosts]=  useState([]);
    const [sortOption, setSortOption]=  useState("like_desc");
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function loadPosts() {
        
            /*try {
                const data = await fetchBoardPosts({
                    category,
                    sort: sortOption,
                    search,
                });

                setPosts(data);
            } catch (err) {
                console.error(err);
            }
        }

        if(category) {
            loadPosts();
        }*/
        

            //개발용 ====================================================
            try {
                const dummy = [
                    {
                        id: 1,
                        title: "Title",
                        text: "text",
                        commentCount: 3,
                        createdAt: "1 minute",
                        username: "User name",
                        likes: 100,
                    },
                    {
                        id: 2,
                        title: "Title",
                        text: "text",
                        commentCount: 3,
                        createdAt: "1 minute",
                        username: "User name",
                        likes: 100,
                    },
                    {
                        id: 3,
                        title: "Title",
                        text: "text",
                        commentCount: 3,
                        createdAt: "1 minute",
                        username: "User name",
                        likes: 100,
                    },
                    {
                        id: 4,
                        title: "Title",
                        text: "text",
                        commentCount: 3,
                        createdAt: "1 minute",
                        username: "User name",
                        likes: 100,
                    },
                    {
                        id: 5,
                        title: "Title",
                        text: "text",
                        commentCount: 3,
                        createdAt: "1 minute",
                        username: "User name",
                        likes: 100,
                    },
                    {
                        id: 6,
                        title: "Title",
                        text: "text",
                        commentCount: 3,
                        createdAt: "1 minute",
                        username: "User name",
                        likes: 100,
                    },
                    {
                        id: 7,
                        title: "Title",
                        text: "text",
                        commentCount: 3,
                        createdAt: "1 minute",
                        username: "User name",
                        likes: 100,
                    },
                    {
                        id: 8,
                        title: "Title",
                        text: "text",
                        commentCount: 3,
                        createdAt: "1 minute",
                        username: "User name",
                        likes: 100,
                    },
                    {
                        id: 9,
                        title: "Title",
                        text: "text",
                        commentCount: 3,
                        createdAt: "1 minute",
                        username: "User name",
                        likes: 100,
                    },
                ];
                setPosts(dummy);
            } catch (err) {
                console.error(err);
            }
        }

        loadPosts();
        // 개발용 =========================================
    }, [category, sortOption, search]);

    const handleSortToggle = () => {
        //실제 정렬 로직은 나중에
        setSortOption((prev) => prev === "like_desc" ? "latest" : "like_desc");
    };

    const handleSearchChange = (e) => {
        //실제로는 devounce + API 호출 or 프론트 필터링
        setSearch(e.target.value);
    }

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
                    <button className={s.boardSortBtn} onClick={handleSortToggle}>
                        {sortOption === "like_desc" ? "Like 30 up" : "Latest"}
                    </button>

                    <div className={s.boardSearchWrapper}>
                        <input
                            className={s.boardSearchInput}
                            type="text"
                            placeholder="search"
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </div>
                </header>

                <div className={s.boardPostList}>
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            to={`/board/${category}/${post.id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <PostCard post={post} />
                        </Link>
                    ))}
                </div>

                <button onClick={async () => {
                    try {
                        const res = await testPost();
                        console.log("응답 도착:", res);
                    } catch (e) {
                        console.error("요청 실패:", e);
                    }
                    }}>
                    test
                </button>
                        
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