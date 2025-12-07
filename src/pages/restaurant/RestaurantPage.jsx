import React, { useState, useEffect, useRef } from "react";
import s from "@styles/modules/restaurant/RestaurantPage.module.css";
import { getCurrentUserId } from "@/services/authToken";
import {
    fetchAllRestaurants,
    fetchReviewsByRestaurantId,
    createReview,
    updateReview,
    deleteReview,
    createRestaurant,
    fetchMyProfile
} from "@/services/restaurantApi.js";

// null 또는 빈 문자열을 "NONE"으로 변환하는 헬퍼 함수
const displayValue = (value) => value ? value : "NONE";

// 초기 사용자 프로필 상태 정의
const INITIAL_USER_PROFILE = {
    userId: getCurrentUserId() || "N/A",
    nickname: "Loading...",
    studentId: "NONE", // NONE 처리로 초기화
    department: "NONE", // NONE 처리로 초기화
    nationality: "NONE", // NONE 처리로 초기화
};

// --- 아이콘 및 헬퍼 컴포넌트 ---

const ChevronDownIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const StarIcon = ({ fill, width = 16, height = 16 }) => <svg width={width} height={height} viewBox="0 0 24 24" fill={fill ? "#FFC700" : "none"} xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={fill ? "#FFC700" : "#d0d0d0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const LinkIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const ProfileIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="7" r="4" fill="#6D28D9" fillOpacity="0.2" /><path d="M17.5 19.5c0-2.5-2.5-4.5-5.5-4.5s-5.5 2-5.5 4.5" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const FlagIcon = () => <span role="img" aria-label="South Korea Flag">🇰🇷</span>;
const WriteIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16.5 3.5C17.757 2.243 19.757 2.243 21 3.5L20.5 4L19 2.5L16.5 4.5V3.5ZM16.5 3.5L19 6L18 7L15.5 5.5L16.5 3.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M15 5L18 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 19L11 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 13L3 21H11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 5.5L4 17.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const PlusIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);


const WriteReviewButton = ({ onClick }) => (
    <button onClick={onClick} className={s.writeReviewButton} style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 10, }}>
        <WriteIcon />
    </button>
);

const RegisterRestaurantButton = ({ onClick }) => (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#5b5bff', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginLeft: '10px', transition: 'background-color 0.2s', }}>
        <PlusIcon style={{ marginRight: '4px' }} />
        식당 등록
    </button>
);

const RatingStars = ({ rating, size = 16 }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
        let fill = false;
        if (i < fullStars) {
            fill = true;
        } else if (i === fullStars && hasHalfStar) {
            fill = true;
        }
        stars.push(<StarIcon key={i} fill={fill} width={size} height={size} />);
    }

    return (<div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>{stars}</div>);
};


const RestaurantListItem = ({ restaurant, isSelected, onClick }) => (
    <div onClick={onClick} className={`${s.listItem} ${isSelected ? s.selected : ''}`}>
        <div className={s.itemInfo}>
            <h3 className={s.itemTitle}>{restaurant.name}</h3>
            <div className={s.itemRatingContainer}>
                <span className={s.itemRatingText}>{restaurant.avgRating?.toFixed(1) || 'N/A'}</span>
                <RatingStars rating={restaurant.avgRating || 0} />
            </div>
            <p className={s.itemAddress}>{restaurant.googleMapUrl ? 'Google Map Link' : '주소 정보 없음'}</p>
            <div className={s.itemTagsAndLink}>
                <span className={s.itemCategoryTag}>#{restaurant.restaurantType || 'NONE'}</span>
                {restaurant.googleMapUrl && (<a href={restaurant.googleMapUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); }} className={s.itemMapLink}><LinkIcon style={{ marginRight: '4px' }} />Map Link</a>)}
            </div>
        </div>
        <div className={s.itemImagePlaceholder}><span>Image</span></div>
    </div>
);


const mapReviewForUI = (review) => {
    return {
        id: review.restaurantReviewId,
        authorId: review.author?.userId || 'N/A',
        rating: review.rating || 0,
        content: review.reason || review.ratingGoodReason || review.ratingOtherReason || review.ratingBadReason || '리뷰 내용 없음',
        username: review.author?.nickname || review.author?.userId || '익명',
        studentId: review.author?.studentId || 'N/A',
        major: review.author?.department || 'N/A',
        country: review.author?.nationality || 'N/A',
    };
};

const ReviewListItem = ({ review, currentUser, onEdit, onDelete }) => {
    const isMyReview = review.authorId === currentUser.userId;

    return (
        <div className={s.reviewItem}>
            <div className={s.reviewHeader}>
                <ProfileIcon />
                <div className={s.reviewMeta}>
                    <div className={s.reviewUserLine}>
                        <span className={s.reviewUsername}>
                            {review.username}
                            {isMyReview && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#5b5bff', fontWeight: '500' }}> (나)</span>}
                        </span>
                        <RatingStars rating={review.rating} size={14} />
                    </div>
                    <div className={s.reviewUserInfo}>
                        {/* 리뷰 작성자 정보에 displayValue 적용 */}
                        <span>{displayValue(review.studentId)} / {displayValue(review.major)}</span>
                        <span className={s.reviewSeparator}>•</span>
                        <FlagIcon />
                        <span>{displayValue(review.country)}</span>
                    </div>
                </div>
            </div>
            <div className={s.reviewDivider} />
            <p className={s.reviewContent}>{review.content}</p>

            {isMyReview && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                    <button onClick={() => onEdit(review)} style={{ padding: '4px 10px', borderRadius: '15px', border: '1px solid #ddd', backgroundColor: '#f0f0f0', fontSize: '12px', cursor: 'pointer' }}>수정</button>
                    <button onClick={() => onDelete(review.id)} style={{ padding: '4px 10px', borderRadius: '15px', border: '1px solid #ddd', backgroundColor: '#ffe6e6', color: '#cc0000', fontSize: '12px', cursor: 'pointer' }}>삭제</button>
                </div>
            )}
        </div>
    );
}

// --- 리뷰 입력/수정 인라인 카드 컴포넌트 ---
const ReviewFormCard = ({ onClose, onSubmit, isUpdate = false, initialReview = {}, selectedRestaurantName, currentUser }) => {
    const isLoading = false;

    const [rating, setRating] = useState(initialReview.rating || 0);
    const [content, setContent] = useState(initialReview.content || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0 || !content.trim()) {
            alert("별점과 내용을 모두 입력해주세요.");
            return;
        }

        const payload = {
            reviewId: isUpdate ? initialReview.id : undefined,
            restaurantId: isUpdate ? undefined : initialReview.restaurantId,
            rating: rating,
            reason: content.trim(),
        };

        onSubmit(payload);
    };

    return (
        <div style={{ width: '100%', padding: '24px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', textAlign: 'left', marginTop: '16px', position: 'relative', boxSizing: 'border-box', }}>
            <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>
                {isUpdate ? '리뷰 수정' : `리뷰 작성: ${selectedRestaurantName}`}
            </h3>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <ProfileIcon style={{ marginRight: '10px', width: '36px', height: '36px' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: '600', fontSize: '15px' }}>{currentUser.nickname}</span>
                            <div style={{ color: '#666', fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                                {/* 🌟 NONE 처리된 현재 사용자 프로필 정보 표시 */}
                                <span>{currentUser.studentId} / {currentUser.department}</span>
                                <span style={{ margin: '0 4px' }}>•</span>
                                <FlagIcon />
                                <span>{currentUser.nationality}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', paddingTop: '5px' }}>
                        {[1, 2, 3, 4, 5].map((starValue) => (
                            <div key={starValue} onClick={() => setRating(starValue)} style={{ cursor: 'pointer' }}>
                                <StarIcon fill={starValue <= rating} width={24} height={24} />
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ height: '1px', backgroundColor: '#e0e0e0', margin: '0 0 20px 0' }} />

                <textarea
                    placeholder="식당에 대한 소중한 리뷰를 작성해 주세요..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ width: '95%', maxWidth: '99%', minHeight: '120px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', resize: 'vertical', fontSize: '15px', outline: 'none', }}
                    disabled={isLoading}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <button type="button" onClick={onClose} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', backgroundColor: '#f0f0f0', color: '#333', cursor: 'pointer', fontWeight: '600', }}>취소</button>
                    <button type="submit" disabled={rating === 0 || !content.trim() || isLoading} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: (rating === 0 || !content.trim() || isLoading) ? '#ccc' : '#5b5bff', color: 'white', cursor: (rating === 0 || !content.trim() || isLoading) ? 'not-allowed' : 'pointer', fontWeight: '600', transition: 'background-color 0.2s', }}>
                        {isUpdate ? '수정 완료' : '등록'}
                    </button>
                </div>
            </form>
        </div>
    );
};


// --- 식당 등록 카드 오버레이 (생략) ---
const RestaurantRegistrationCardOverlay = ({ onClose, onSubmit }) => {
    const [name, setName] = useState("");
    const [googleMapUrl, setGoogleMapUrl] = useState("");
    const [restaurantType, setRestaurantType] = useState("NONE");

    const typeOptions = [
        { value: 'NONE', label: '일반/기타' },
        { value: 'HALAL', label: '할랄 (Halal)' },
        { value: 'KOSHER', label: '코셔 (Kosher)' },
        { value: 'VEGAN', label: '비건 (Vegan)' },
        { value: 'KOREA', label: '한식' },
        { value: 'JAPAN', label: '일식' },
        { value: 'CHINA', label: '중식' },
        { value: 'VIETNAM', label: '베트남/동남아' },
        { value: 'INDIA', label: '인도/남아시아' },
        { value: 'WEST', label: '양식/서양식' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !googleMapUrl.trim()) {
            alert("식당 이름과 지도 링크를 모두 입력해주세요.");
            return;
        }

        const payload = { name: name.trim(), googleMapUrl: googleMapUrl.trim(), restaurantType: restaurantType, };
        onSubmit(payload);
    };

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
            <div style={{ width: '100%', maxWidth: '300px', padding: '24px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)', textAlign: 'left', }}>
                <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>새 식당 등록</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '5px' }}>식당 이름</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="식당 이름을 입력하세요" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '5px' }}>Google 지도 URL</label>
                        <input type="url" value={googleMapUrl} onChange={(e) => setGoogleMapUrl(e.target.value)} placeholder="지도 URL을 붙여넣으세요" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    </div>
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '5px' }}>식당 타입</label>
                        <select value={restaurantType} onChange={(e) => setRestaurantType(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', appearance: 'none', cursor: 'pointer' }}>
                            {typeOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', backgroundColor: '#f0f0f0', cursor: 'pointer', fontWeight: '600', }}>취소</button>
                        <button type="submit" disabled={!name.trim() || !googleMapUrl.trim()} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: (!name.trim() || !googleMapUrl.trim()) ? '#ccc' : '#5b5bff', color: 'white', cursor: 'pointer', fontWeight: '600', transition: 'background-color 0.2s', }}>등록</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- CategoryDropdown 정의 ---
const CategoryDropdown = ({ value, onChange, options }) => {
    return (
        <div style={{ position: 'relative' }}>
            <select value={value} onChange={(e) => onChange(e.target.value)} style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #ddd", backgroundColor: "#fff", fontSize: "14px", cursor: "pointer", appearance: "none", paddingRight: "25px" }}>
                {options.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
            <ChevronDownIcon style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#666' }} />
        </div>
    );
};


// --- 메인 컴포넌트 ---
export default function RestaurantPage() {
    const [currentUserProfile, setCurrentUserProfile] = useState(INITIAL_USER_PROFILE);

    const [restaurants, setRestaurants] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState("NONE");
    const [selectedFilter, setSelectedFilter] = useState("Rating");

    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
    const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(false);

    const [editingReview, setEditingReview] = useState(null);

    const reviewListRef = useRef(null);

    useEffect(() => {
        async function loadUserProfile() {
            const currentId = getCurrentUserId();
            if (!currentId) {
                setCurrentUserProfile(prev => ({ ...prev, nickname: "게스트" }));
                return;
            }

            try {
                // fetchMyProfile API 호출
                const apiResponse = await fetchMyProfile();

                const detailedUser = {
                    userId: currentId,
                    // nickname 필드가 API 응답에 포함되어 있다고 가정
                    nickname: apiResponse.nickname || "User",
                    studentId: displayValue(apiResponse.studentId),
                    department: displayValue(apiResponse.department),
                    nationality: displayValue(apiResponse.nationality),
                };

                setCurrentUserProfile(detailedUser);

            } catch (error) {
                console.error("사용자 프로필 로드 실패:", error);
                // 닉네임 로드 실패 시, 최소 정보(ID)는 유지하고 닉네임만 실패 처리
                setCurrentUserProfile(prev => ({
                    ...prev,
                    nickname: "로드 실패",
                }));
            }
        }
        loadUserProfile();
    }, []);

    // 식당 목록 로드
    useEffect(() => {
        async function loadRestaurants() {
            try {
                const data = await fetchAllRestaurants();
                if (data && data.length > 0) {
                    setRestaurants(data);
                    if (!selectedRestaurantId) {
                        setSelectedRestaurantId(data[0].restaurantId);
                    }
                }
            } catch (error) {
                console.error("식당 목록 로드 실패 (API 오류):", error);
            }
        }
        loadRestaurants();
    }, []);

    // 선택된 식당에 대한 리뷰 목록 로드
    const loadReviews = async (id) => {
        if (!id) {
            setReviews([]);
            return;
        }
        if (currentUserProfile.userId === INITIAL_USER_PROFILE.userId) {
            setReviews([]);
            return;
        }

        try {
            console.log(`[API CALL] fetchReviewsByRestaurantId 호출 시작, ID: ${id}`); // 🌟 호출 시작 로그

            const data = await fetchReviewsByRestaurantId(id);

            console.log("[API RESPONSE] fetchReviewsByRestaurantId 응답 데이터:", data); // 🌟 응답 데이터 출력
            console.log(`[API RESPONSE] 리뷰 총 개수: ${data ? data.length : 0}`); // 🌟 개수 확인

            setReviews(data.map(mapReviewForUI));
        } catch (error) {
            console.error(`[API ERROR] 리뷰 목록 로드 실패 (ID: ${id}):`, error);
            setReviews([]);
        }
    };

    useEffect(() => {
        // currentUserProfile.userId가 로드될 때 (N/A가 아닐 때) 또는 식당이 바뀔 때 리뷰 로드
        loadReviews(selectedRestaurantId);
        setIsReviewFormOpen(false);
        setEditingReview(null);
    }, [selectedRestaurantId, currentUserProfile.userId]);

    // 리뷰 목록 자동 스크롤
    useEffect(() => {
        if (reviewListRef.current) {
            reviewListRef.current.scrollTop = reviewListRef.current.scrollHeight;
        }
    }, [reviews]);

    // 필터링 및 정렬 로직 (생략)
    const filterAndSortRestaurants = () => {
        let list = restaurants.filter(rest => {
            if (selectedCategory === 'NONE') { return true; }
            return rest.restaurantType === selectedCategory;
        });

        list = list.sort((a, b) => {
            const ratingA = a.avgRating || 0;
            const ratingB = b.avgRating || 0;

            switch (selectedFilter) {
                case 'Rating': return ratingB - ratingA;
                case 'Distance': return (a.distance || a.restaurantId) > (b.distance || b.restaurantId) ? 1 : -1;
                case 'New': return (new Date(b.createdAt).getTime() || b.restaurantId) - (new Date(a.createdAt).getTime() || a.restaurantId);
                default: return 0;
            }
        });
        return list;
    };

    const filteredAndSortedRestaurants = filterAndSortRestaurants();

    // 필터링/정렬 후 첫 번째 항목 선택 로직 (생략)
    useEffect(() => {
        if (filteredAndSortedRestaurants.length > 0) {
            const firstId = filteredAndSortedRestaurants[0].restaurantId;
            const isSelectedInList = filteredAndSortedRestaurants.some(r => r.restaurantId === selectedRestaurantId);

            if (!isSelectedInList || selectedRestaurantId !== firstId) {
                setSelectedRestaurantId(firstId);
            }
        } else if (restaurants.length > 0 && filteredAndSortedRestaurants.length === 0) {
            setSelectedRestaurantId(null);
        }
    }, [selectedCategory, selectedFilter, restaurants]);


    // --- 리뷰 관련 핸들러 ---

    const handleOpenCreateReviewForm = () => {
        setEditingReview(null);
        setIsReviewFormOpen(true);
    };

    const handleCloseReviewForm = () => {
        setIsReviewFormOpen(false);
        setEditingReview(null);
    };

    const handleReviewSubmit = async (payload) => {
        // 1. restaurantId를 payload에서 추출하거나, 현재 선택된 ID를 사용 (안전 확보)
        const restaurantId = payload.restaurantId || selectedRestaurantId;

        if (!restaurantId) {
            alert("리뷰를 등록/수정할 식당을 먼저 선택해주세요.");
            return;
        }

        // 2. submitPayload 준비: API에 restaurantId를 명시적으로 전달 (등록 시)
        const submitPayload = { ...payload, restaurantId: restaurantId };

        try {
            if (payload.reviewId) { // 리뷰 수정 로직
                const reviewId = payload.reviewId;

                // 수정 API 호출 (submitPayload는 rating, reason, restaurantId를 포함)
                await updateReview(reviewId, submitPayload);

                alert("리뷰가 성공적으로 수정되었습니다!");

            } else { // 리뷰 등록 로직
                // 등록 API 호출
                await createReview(submitPayload);

                alert("리뷰가 성공적으로 등록되었습니다.");
            }

            // 3. 리뷰 목록 갱신 (화면에 새 리뷰/수정된 리뷰 표시)
            await loadReviews(restaurantId);

            // 4. 식당 목록 갱신 (식당의 평균 별점, 리뷰 카운트 갱신)
            await fetchAllRestaurants();

            handleCloseReviewForm();

        } catch (error) {
            console.error("리뷰 처리 실패:", error);
            alert(`리뷰 처리(등록/수정)에 실패했습니다: ${error.message}`);
        }
    };

    // 리뷰 수정 버튼 클릭 핸들러
    const handleEditReview = (review) => {
        setIsReviewFormOpen(true);
        setEditingReview(review);
    }

    // 리뷰 삭제 버튼 클릭 핸들러
    const handleDeleteReview = async (reviewId) => {
        const ok = window.confirm("정말 이 리뷰를 삭제하시겠습니까? (Soft Delete)");
        if (!ok) return;

        try {
            await deleteReview(reviewId);
            alert("리뷰가 성공적으로 삭제되었습니다.");

            await loadReviews(selectedRestaurantId); // 리뷰 목록 갱신 (삭제 반영)

            await fetchAllRestaurants();
        } catch (error) {
            console.error("리뷰 삭제 실패:", error);
            alert("리뷰 삭제에 실패했습니다: " + (error.message || "알 수 없는 오류"));
        }
    }


    // --- 식당 등록 관련 핸들러 (생략) ---
    const handleCloseRegisterForm = () => { setIsRegisterFormOpen(false); };

    const handleCreateRestaurant = async (payload) => {
        try {
            const newRestaurantData = await createRestaurant(payload);

            alert(`식당 "${payload.name}"이 성공적으로 등록되었습니다!`);
            handleCloseRegisterForm();

            setRestaurants(prevRestaurants => [...prevRestaurants, newRestaurantData]);
            setSelectedRestaurantId(newRestaurantData.restaurantId);

        } catch (error) {
            console.error("식당 등록 실패:", error);
            alert("식당 등록에 실패했습니다: " + (error.message || "알 수 없는 오류"));
        }
    };

    const selectedRestaurant = restaurants.find(r => r.restaurantId === selectedRestaurantId);


    // 현재 표시해야 할 폼 결정
    const renderReviewForm = () => {
        if (!selectedRestaurantId) return null;

        const FormComponent = (editingReview || isReviewFormOpen) ? ReviewFormCard : WriteReviewButton;
        const formProps = editingReview ? {
            isUpdate: true, initialReview: editingReview
        } : isReviewFormOpen ? {
            isUpdate: false, initialReview: { restaurantId: selectedRestaurantId }, selectedRestaurantName: selectedRestaurant ? selectedRestaurant.name : '선택된 식당'
        } : {
            onClick: handleOpenCreateReviewForm
        };

        return (
            <FormComponent
                {...formProps}
                onClose={handleCloseReviewForm}
                onSubmit={handleReviewSubmit}
                currentUser={currentUserProfile}
            />
        );
    };


    return (
        <div className={s.pageContainer}>
            <div className={s.mainContent}>
                <div className={s.listBox}>
                    {/* 상단 드롭다운 및 식당 등록 버튼 */}
                    <div className={s.dropdownContainer}>
                        <CategoryDropdown value={selectedCategory} onChange={setSelectedCategory} options={['NONE', 'HALAL', 'KOSHER', 'VEGAN', 'KOREA', 'JAPAN', 'CHINA', 'VIETNAM', 'INDIA', 'WEST']} />
                        <CategoryDropdown value={selectedFilter} onChange={setSelectedFilter} options={['Rating', 'Distance', 'New']} />
                        <RegisterRestaurantButton onClick={() => setIsRegisterFormOpen(true)} />
                    </div>

                    {/* 식당 리스트 */}
                    <div className={`${s.listScrollArea} custom-scroll-list`}>
                        {filteredAndSortedRestaurants.length > 0 ? (
                            filteredAndSortedRestaurants.map((rest) => (
                                <RestaurantListItem key={rest.restaurantId} restaurant={rest} isSelected={rest.restaurantId === selectedRestaurantId} onClick={() => setSelectedRestaurantId(rest.restaurantId)} />
                            ))
                        ) : (<div className={s.noReviewMessage} style={{ color: '#888' }}>식당 목록을 로드 중이거나, 선택된 조건에 맞는 식당이 없습니다.</div>)}
                    </div>
                </div>

                {/* 식당 상세 정보 영역 (오른쪽) */}
                <div ref={reviewListRef} className={s.reviewBox}>
                    <h2 className={s.reviewTitle}>
                        {selectedRestaurant ? `${selectedRestaurant.name} ` : ''} 리뷰 목록 ({reviews.length}개)
                    </h2>

                    {selectedRestaurantId && reviews.length > 0 ? (
                        reviews.map((review) => (
                            <ReviewListItem key={review.id} review={review} currentUser={currentUserProfile} onEdit={handleEditReview} onDelete={handleDeleteReview} />
                        ))
                    ) : (<div className={s.noReviewMessage}>{selectedRestaurant ? `${selectedRestaurant.name}에 대한 리뷰가 아직 없습니다.` : '식당을 선택해주세요.'}</div>)}

                    {/* 리뷰 작성/수정 폼 또는 버튼 렌더링 */}
                    {renderReviewForm()}
                </div>
            </div>
            {/* 식당 등록 폼 오버레이 */}
            {isRegisterFormOpen && (<RestaurantRegistrationCardOverlay onClose={handleCloseRegisterForm} onSubmit={handleCreateRestaurant} />)}
        </div>
    );
}