import { api } from "./apiClient";

export async function fetchBoardPosts({ category, sort, search }) {
    const params = new URLSearchParams();
    if(sort) params.set("sort", sort);
    if(search) params.set("q", search);

    const queryString = params.toString() ? `?${params.toString()}` : "";

    const res = await api(`/boards/${category}${queryString}`);

    if(!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const message = errorBody.message || "게시글을 불러오는데 실패했습니다.";
        const err = new Error(message);
        err.status = res.status;
        throw err;
    }

    return res.json();
}

export async function writePost({ category, payload }) {
    const res = await api(`/boards/${category}`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if(!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const message = errorBody.message || "게시글 작성에 실패했습니다.";
        const err = new Error(message);
        err.status = res.status;
        throw err;
    }

    return res.json();
}