// src/services/restaurantApi.js
import { api } from "./apiClient";

// --- 사용자 프로필 API (RestaurantPage에서 사용) ---

/**
 * 현재 로그인한 사용자의 프로필 정보를 조회합니다.
 * @returns {Promise<MeProfileResponse>}
 */
export async function fetchMyProfile() {
    // MeProfileResponse.java 및 User.java 구조를 기반으로 가정
    return api("/v1/user/me/profile");
}

// --- 식당 (Restaurant) API ---

/**
 * 모든 식당 목록을 조회합니다.
 * @returns {Promise<RestaurantResponse[]>}
 */
export async function fetchAllRestaurants() {
    return api("/v1/restaurants");
}

/**
 * 특정 식당의 상세 정보를 조회합니다.
 * @param {string} restaurantId
 * @returns {Promise<RestaurantResponse>}
 */
export async function fetchRestaurantDetail(restaurantId) {
    return api(`/v1/restaurants/${restaurantId}`);
}

/**
 * 사용자의 선호 음식 타입에 기반한 추천 식당 목록을 조회합니다.
 * (사용자 ID는 토큰에서 처리)
 * @returns {Promise<RestaurantResponse[]>}
 */
export async function fetchRecommendedRestaurants() {
    return api(`/v1/restaurants/recommended`);
}

/**
 * 새 식당 등록을 요청합니다.
 * @param {object} payload - { name, googleMapUrl, restaurantType }
 * @returns {Promise<RestaurantResponse>}
 */
export async function createRestaurant(payload) {
    return api("/v1/restaurants", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/**
 * 식당 정보를 수정합니다.
 * @param {string} restaurantId
 * @param {object} payload
 * @returns {Promise<RestaurantResponse>}
 */
export async function updateRestaurant(restaurantId, payload) {
    return api(`/v1/restaurants/${restaurantId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

/**
 * 식당을 삭제합니다 (Soft Delete).
 * @param {string} restaurantId
 * @returns {Promise<null>}
 */
export async function deleteRestaurant(restaurantId) {
    return api(`/v1/restaurants/${restaurantId}`, {
        method: "DELETE",
    });
}


// --- 리뷰 (RestaurantReview) API ---

/**
 * 특정 식당의 리뷰 목록을 조회합니다.
 * @param {string} restaurantId
 * @returns {Promise<RestaurantReviewListResponse>} (리뷰 목록을 포함)
 */
export async function fetchReviewsByRestaurantId(restaurantId) {
    return api(`/v1/restaurantReviews/restaurant/${restaurantId}`);
}

/**
 * 현재 로그인한 사용자의 리뷰 목록을 조회합니다.
 * @returns {Promise<RestaurantReviewResponse[]>}
 */
export async function fetchReviewsByUserId() {
    return api(`/v1/restaurantReviews/user`);
}

/**
 * 새 리뷰를 작성합니다.
 * @param {object} payload - { restaurantId, rating, reason }
 * @returns {Promise<RestaurantReviewResponse>}
 */
export async function createReview(payload) {
    return api("/v1/restaurantReviews", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/**
 * 리뷰를 수정합니다.
 * @param {string} reviewId
 * @param {object} payload - { rating, reason }
 * @returns {Promise<RestaurantReviewResponse>}
 */
export async function updateReview(reviewId, payload) {
    return api(`/v1/restaurantReviews/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

/**
 * 리뷰를 삭제합니다 (Soft Delete).
 * @param {string} reviewId
 * @returns {Promise<null>}
 */
export async function deleteReview(reviewId) {
    return api(`/v1/restaurantReviews/${reviewId}`, {
        method: "DELETE",
    });
}