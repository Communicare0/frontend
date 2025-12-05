import { api } from "./apiClient";

const RESTAURANT_BASE_URL = "/v1/restaurants";
const REVIEW_BASE_URL = "/v1/reviews";

/**
 * 모든 식당 목록을 조회
 * @returns {Promise<Array<RestaurantResponse>>}
 */
export async function fetchAllRestaurants() {
    return api(RESTAURANT_BASE_URL);
}

/**
 * 특정 ID의 식당 상세 정보를 조회
 * @param {string} restaurantId 
 * @returns {Promise<RestaurantResponse>}
 */
export async function fetchRestaurantDetail(restaurantId) {
    return api(`${RESTAURANT_BASE_URL}/${restaurantId}`);
}

/**
 * 사용자 선호도 기반으로 추천 식당 목록을 조회
 * @returns {Promise<Array<RestaurantResponse>>}
 */
export async function fetchRecommendedRestaurants() {
    return api(`${RESTAURANT_BASE_URL}/recommendation`); 
}


/**
 * 새 식당을 생성
 * POST /v1/restaurants
 * @param {object} payload
 * @param {string} payload.name
 * @param {string} payload.googleMapUrl
 * @param {string} payload.restaurantType
 * @returns {Promise<RestaurantResponse>}
 */
export async function createRestaurant(payload) {
    return api(RESTAURANT_BASE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/**
 * 특정 식당 정보를 업데이트합니다.
 * @param {string} restaurantId
 * @param {object} payload - 업데이트할 정보 (name, googleMapUrl, restaurantType 등)
 * @returns {Promise<RestaurantResponse>}
 */
export async function updateRestaurant(restaurantId, payload) {
    return api(`${RESTAURANT_BASE_URL}/${restaurantId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

/**
 * 특정 식당을 삭제
 * DELETE /v1/restaurants/{restaurantId}
 * @param {string} restaurantId 
 * @returns {Promise<void>}
 */
export async function deleteRestaurant(restaurantId) {
    return api(`${RESTAURANT_BASE_URL}/${restaurantId}`, {
        method: "DELETE",
    });
}


/**
 * 특정 식당의 리뷰 목록을 최신순으로 조회
 * 백엔드: findReviewsByRestaurantId(UUID restaurantId)
 * @param {string} restaurantId 
 * @returns {Promise<Array<RestaurantReview>>}
 */
export async function fetchReviewsByRestaurantId(restaurantId) {
    return api(`${REVIEW_BASE_URL}/restaurant/${restaurantId}`);
}

/**
 * 특정 사용자가 작성한 리뷰 목록을 최신순으로 조회합니다.
 * 백엔드: findReviewsByUserId(UUID userId)
 * @param {string} userId 
 * @returns {Promise<Array<RestaurantReview>>}
 */
export async function fetchReviewsByUserId(userId) {
    return api(`${REVIEW_BASE_URL}/user/${userId}`);
}

/**
 * 새 리뷰를 작성
 * @param {object} payload
 * @param {string} payload.restaurantId - 식당 UUID
 * @param {number} payload.rating - 평점 (예: 1~5)
 * @param {string} [payload.ratingGoodReason]
 * @param {string} [payload.ratingBadReason]
 * @param {string} [payload.ratingOtherReason]
 * @returns {Promise<RestaurantReview>}
 */
export async function createReview(payload) {
    // 백엔드: createReview(UUID userId, CreateRestaurantReviewRequest request)
    return api(REVIEW_BASE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/**
 * 특정 리뷰를 업데이트합니다.
 * @param {string} reviewId - 리뷰 UUID
 * @param {object} payload - 업데이트할 정보 
 * @returns {Promise<RestaurantReview>}
 */
export async function updateReview(reviewId, payload) {
    // 백엔드: updateReview(UUID userId, UUID reviewId, UpdateRestaurantReviewRequest request)
    return api(`${REVIEW_BASE_URL}/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

/**
 * 특정 리뷰를 삭제
 * @param {string} reviewId - 리뷰 UUID
 * @returns {Promise<void>}
 */
export async function deleteReview(reviewId) {
    return api(`${REVIEW_BASE_URL}/${reviewId}`, {
        method: "DELETE",
    });
}
