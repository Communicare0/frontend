// src/services/restaurantApi.js
import { api } from "./apiClient";

const RESTAURANT_BASE_URL = "/v1/restaurants";
const REVIEW_BASE_URL = "/v1/reviews";

// --- 식당 (Restaurant) API ---

// GET /v1/restaurants (모든 식당 조회)
export async function fetchAllRestaurants() {
    return api(RESTAURANT_BASE_URL);
}

// GET /v1/restaurants/{restaurantId} (특정 식당 상세 조회)
export async function fetchRestaurantDetail(restaurantId) {
    return api(`${RESTAURANT_BASE_URL}/${restaurantId}`);
}

// GET /v1/restaurants/recommendation (추천 식당 조회)
export async function fetchRecommendedRestaurants() {
    return api(`${RESTAURANT_BASE_URL}/recommendation`); 
}

// POST /v1/restaurants (새 식당 등록)
export async function createRestaurant(payload) {
    return api(RESTAURANT_BASE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

// PUT /v1/restaurants/{restaurantId} (식당 정보 수정)
export async function updateRestaurant(restaurantId, payload) {
    return api(`${RESTAURANT_BASE_URL}/${restaurantId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

// DELETE /v1/restaurants/{restaurantId} (식당 삭제 - Soft Delete)
export async function deleteRestaurant(restaurantId) {
    return api(`${RESTAURANT_BASE_URL}/${restaurantId}`, {
        method: "DELETE",
    });
}


// --- 리뷰 (Review) API ---

// GET /v1/reviews/restaurant/{restaurantId} (특정 식당 리뷰 조회)
export async function fetchReviewsByRestaurantId(restaurantId) {
    return api(`${REVIEW_BASE_URL}/restaurant/${restaurantId}`);
}

// GET /v1/reviews/user/{userId} (특정 사용자 리뷰 조회)
export async function fetchReviewsByUserId(userId) {
    return api(`${REVIEW_BASE_URL}/user/${userId}`);
}

// POST /v1/reviews (새 리뷰 작성)
export async function createReview(payload) {
    return api(REVIEW_BASE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

// PUT /v1/reviews/{reviewId} (리뷰 수정)
export async function updateReview(reviewId, payload) {
    return api(`${REVIEW_BASE_URL}/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

// DELETE /v1/reviews/{reviewId} (리뷰 삭제 - Soft Delete)
export async function deleteReview(reviewId) {
    return api(`${REVIEW_BASE_URL}/${reviewId}`, {
        method: "DELETE",
    });
}