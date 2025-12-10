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

export async function deletePost(postId) {
  return api(`/v1/posts/${postId}`, {
    method: "DELETE",
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

export async function likePost(postId) {
    return api(`/v1/posts/${postId}/like`, {
        method: "POST",
    });
}

export async function unlikePost(postId) {
    return api(`/v1/posts/${postId}/like`, {
        method: "DELETE",
    });
}

export async function reportPost(postId, reason) {
    return api(`/v1/reports/post/${postId}`, {
        method: "POST",
        body: JSON.stringify({ reason }),
    });
}

export async function likeComment(commentId) {
    return api(`/v1/comments/${commentId}/like`, {
        method: "POST",
    });
}

export async function unlikeComment(commentId) {
    return api(`/v1/comments/${commentId}/like`, {
        method: "DELETE",
    });
}

export async function reportComment(commentId, reason) {
    return api(`/v1/reports/comment/${commentId}`, {
        method: "POST",
        body: JSON.stringify({ reason }),
    });
}

export async function translate(postId) {
  return api(`/v1/posts/translate/${postId}`);
}