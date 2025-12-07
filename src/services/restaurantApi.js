// src/services/restaurantApi.js
import { api } from "./apiClient";

// --- 사용자 프로필 API (RestaurantPage에서 사용) ---


export async function fetchMyProfile() {
    // MeProfileResponse.java 및 User.java 구조를 기반으로 가정
    return api("/v1/user/me/profile");
}

// --- 식당 (Restaurant) API ---


export async function fetchAllRestaurants() {
    return api("/v1/restaurants");
}


export async function fetchRestaurantDetail(restaurantId) {
    return api(`/v1/restaurants/${restaurantId}`);
}


export async function fetchRecommendedRestaurants() {
    return api(`/v1/restaurants/recommended`);
}


export async function createRestaurant(payload) {
    return api("/v1/restaurants", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}


export async function updateRestaurant(restaurantId, payload) {
    return api(`/v1/restaurants/${restaurantId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}


export async function deleteRestaurant(restaurantId) {
    return api(`/v1/restaurants/${restaurantId}`, {
        method: "DELETE",
    });
}


// --- 리뷰 (RestaurantReview) API ---


export async function fetchReviewsByRestaurantId(restaurantId) {
    return api(`/v1/restaurantReviews/restaurant/${restaurantId}`);
}


export async function fetchReviewsByUserId() {
    return api(`/v1/restaurantReviews/user`);
}


export async function createReview(payload) {
    return api("/v1/restaurantReviews", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}


export async function updateReview(reviewId, payload) {
    return api(`/v1/restaurantReviews/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}


export async function deleteReview(reviewId) {
    return api(`/v1/restaurantReviews/${reviewId}`, {
        method: "DELETE",
    });
}