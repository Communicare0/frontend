import { api } from "./apiClient";

export async function fetchBoardPosts({ category, sort, search }) {
    const params = new URLSearchParams();
    if(sort) params.set("sort", sort);
    if(search) params.set("q", search);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    return api(`/boards/${category}${queryString}`);
}

export async function fetchUserPosts() {
    return api(`/v1/posts/user`);
}

export async function writePost(payload) {
    return api(`/v1/posts/${payload.category}`, { method: "POST", body: JSON.stringify(payload) });
}

export async function updatePost(postId, payload) {
    return api(`/v1/posts/${postId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function createComment({ postId, content }) {
  return api(`/v1/comments`, {
    method: "POST",
    body: JSON.stringify({ postId, content }),
  });
}

export async function fetchPostComments({ postId }) {
  return api(`/v1/comments/post/${postId}`);
}

export async function updateComment({ commentId, content }) {
  return api(`/v1/comments/${commentId}`, {
    method: "PUT",
    body: JSON.stringify({ content }),
  });
}

export async function deleteComment({ commentId }) {
  return api(`/v1/comments/${commentId}`, {
    method: "DELETE",
  });
}

export async function testPost() {
    return api(`/v1/comments/post/11111111-2222-3333-4444-555555555555`);
}