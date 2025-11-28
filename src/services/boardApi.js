import { api } from "./apiClient";

export async function fetchBoardPosts({ category, sort, search }) {
    const params = new URLSearchParams();
    if(sort) params.set("sort", sort);
    if(search) params.set("q", search);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    return api(`/boards/${category}${queryString}`);
}

export async function writePost(payload) {
    return api(`/boards/${payload.category}`, { method: "POST", body: JSON.stringify(payload) });
}

export async function testPost() {
    return api(`/v1/comments/post/11111111-2222-3333-4444-555555555555`);
}