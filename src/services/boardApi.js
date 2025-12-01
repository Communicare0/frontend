import { api } from "./apiClient";

const CATEGORY_MAP = {
  free: "GENERAL",
  job: "QNA",
  university: "NOTICE",
};

export async function fetchBoardPosts({ category /*, sort, search*/ }) {
  const serverCategory = CATEGORY_MAP[category];
  if (!serverCategory) {
    throw new Error(`알 수 없는 카테고리: ${category}`);
  }

  // 백엔드는 현재 sort, search 안 받으니까 일단 쿼리스트링 빼는 게 “백엔드 기준”임
  return api(`/v1/posts/category/${serverCategory}`);
}

export async function fetchUserPosts() {
    return api(`/v1/posts/user`);
}

export async function fetchPostDetail(postId) {
    return api(`/v1/posts/${postId}`);
}

export async function writePost({ category, title, content }) {
  const serverCategory = CATEGORY_MAP[category]; // 매핑

  return api(`/v1/posts`, {
    method: "POST",
    body: JSON.stringify({
      title,
      content,
      category: serverCategory,
    }),
  });
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

export async function fetchPostComments(postId) {
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