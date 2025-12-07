// src/services/restaurantApi.js
import { api } from "./apiClient";

// --- 식당 (Restaurant) API ---

// GET /v1/restaurants (모든 식당 조회)
export async function fetchAllRestaurants() {
    return api("/v1/restaurants");
}

// GET /v1/restaurants/{restaurantId} (특정 식당 상세 조회)
export async function fetchRestaurantDetail(restaurantId) {
    return api(`/v1/restaurants/${restaurantId}`);
}

// GET /v1/restaurants/recommended (추천 식당 조회)
export async function fetchRecommendedRestaurants() {
    return api(`/v1/restaurants/recommended`);
}

// POST /v1/restaurants (새 식당 등록)
export async function createRestaurant(payload) {
    return api("/v1/restaurants", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

// PUT /v1/restaurants/{restaurantId} (식당 정보 수정)
export async function updateRestaurant(restaurantId, payload) {
    return api(`/v1/restaurants/${restaurantId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

// DELETE /v1/restaurants/{restaurantId} (식당 삭제 - Soft Delete)
export async function deleteRestaurant(restaurantId) {
    return api(`/v1/restaurants/${restaurantId}`, {
        method: "DELETE",
    });
}


// --- 리뷰 (RestaurantReview) API ---

// GET /v1/restaurantReviews/restaurant/{restaurantId} (특정 식당 리뷰 조회)
export async function fetchReviewsByRestaurantId(restaurantId) {
    return api(`/v1/restaurantReviews/restaurant/${restaurantId}`);
}

// GET /v1/restaurantReviews/user (현재 로그인한 사용자의 리뷰 목록 조회)
export async function fetchReviewsByUserId() {
    return api(`/v1/restaurantReviews/user`);
}

// POST /v1/restaurantReviews (리뷰 생성)
export async function createReview(payload) {
    return api("/v1/restaurantReviews", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

// PUT /v1/restaurantReviews/{reviewId} (리뷰 수정)
export async function updateReview(reviewId, payload) {
    return api(`/v1/restaurantReviews/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

// DELETE /v1/restaurantReviews/{reviewId} (리뷰 삭제 - Soft Delete)
export async function deleteReview(reviewId) {
    return api(`/v1/restaurantReviews/${reviewId}`, {
        method: "DELETE",
    });
}

export async function fetchMyProfile() {
    return api(`/v1/me/profile`);
}