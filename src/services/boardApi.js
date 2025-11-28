import { api } from "./apiClient";

export async function fetchBoardPosts({ category, sort, search }) {
    const params = new URLSearchParams();
    if(sort) params.set("sort", sort);
    if(search) params.set("q", search);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    return api(`/boards/${category}${queryString}`);
}

export async function writePost({ category, title, content, files }) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    files.forEach((file) => {
        formData.append("attachments", file);
    });

    return api(`/boards/${category}`, { method: "POST", body: formData });
}

export async function testPost() {
    return api(`/v1/comments/post/11111111-2222-3333-4444-555555555555`);
}