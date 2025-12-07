import React, { useState, useEffect, useRef, useCallback } from "react";
// s는 RestaurantPage.module.css를 import 합니다.
import s from "@styles/modules/restaurant/RestaurantPage.module.css";
import { getCurrentUserId } from "@/services/authToken";
import {
    fetchAllRestaurants,
    fetchRecommendedRestaurants,
    fetchReviewsByRestaurantId,
    createReview,
    updateReview,
    deleteReview,
    createRestaurant,
    fetchMyProfile
} from "@/services/restaurantApi.js";

// --- 상수 및 헬퍼 함수 ---

const displayValue = (value) => value ? value : "N/A";

// 초기 사용자 프로필 상태 정의 (MeProfileResponse.java 기반)
const INITIAL_USER_PROFILE = {
    userId: getCurrentUserId() || "N/A",
    nickname: "Loading...",
    studentId: "NONE",
    department: "NONE",
    nationality: "NONE",
    preferredFoodType: "NONE", 
};

// 탭 상수
const TABS = {
    ALL: "ALL",
    RECOMMENDED: "RECOMMENDED",
};

// --- 아이콘 및 헬퍼 컴포넌트 ---

const ChevronDownIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const StarIcon = ({ fill, width = 16, height = 16, onClick, style }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill={fill ? "#FFC700" : "none"} xmlns="http://www.w3.org/2000/svg" onClick={onClick} style={style}>
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={fill ? "#FFC700" : "#d0d0d0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const LinkIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const ProfileIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="7" r="4" fill="#6D28D9" fillOpacity="0.2" /><path d="M17.5 19.5c0-2.5-2.5-4.5-5.5-4.5s-5.5 2-5.5 4.5" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const FlagIcon = () => <span role="img" aria-label="Flag">🇰🇷</span>; // 국적에 따라 동적으로 변경해야 함 (현재는 🇰🇷 더미)
const WriteIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16.5 3.5C17.757 2.243 19.757 2.243 21 3.5L20.5 4L19 2.5L16.5 4.5V3.5ZM16.5 3.5L19 6L18 7L15.5 5.5L16.5 3.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M15 5L18 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 19L11 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 13L3 21H11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 5.5L4 17.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const PlusIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);


const WriteReviewButton = ({ onClick }) => (
    <button onClick={onClick} className={s.writeReviewButton} style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 10 }}>
        <WriteIcon />
    </button>
);

const RegisterRestaurantButton = ({ onClick }) => (
    // RestaurantPage.module.css에는 .registerButton 클래스가 없으므로 인라인 스타일로 구현
    <button onClick={onClick} 
        style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '6px 12px', 
            borderRadius: '6px', 
            border: '1px solid #ddd', 
            backgroundColor: '#5b5bff', 
            color: 'white', 
            fontSize: '14px', 
            fontWeight: '600', 
            cursor: 'pointer', 
            marginLeft: '10px', 
            whiteSpace: 'nowrap', 
            transition: 'background-color 0.2s',
        }}>
        <PlusIcon style={{ marginRight: '4px' }} />
        <span>식당 등록</span>
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


const RestaurantListItem = React.memo(({ restaurant, isSelected, onClick }) => {
    const avgRating = restaurant.avgRating ? parseFloat(restaurant.avgRating).toFixed(1) : 'N/A';

    return (
        <div onClick={onClick} className={`${s.listItem} ${isSelected ? s.selected : ''}`}>
            <div className={s.itemInfo}>
                <h3 className={s.itemTitle}>{restaurant.name}</h3>
                <div className={s.itemRatingContainer}>
                    <span className={s.itemRatingText}>{avgRating}</span>
                    <RatingStars rating={restaurant.avgRating || 0} />
                </div>
                {/* 주소 정보 없음 대신 Google Map Link 유무 표시 */}
                <p className={s.itemAddress}>{restaurant.googleMapUrl ? 'Google Map Link' : '주소 정보 없음'}</p> 
                <div className={s.itemTagsAndLink}>
                    <span className={s.itemCategoryTag}>#{restaurant.restaurantType || 'NONE'}</span>
                    {restaurant.googleMapUrl && (<a href={restaurant.googleMapUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); }} className={s.itemMapLink}><LinkIcon style={{ marginRight: '4px' }} />Map Link</a>)}
                </div>
            </div>
            <div className={s.itemImagePlaceholder}><span>Image</span></div>
        </div>
    );
});


// 리뷰 객체를 UI에 필요한 형태로 매핑 (RestaurantReviewResponse.java 기반)
const mapReviewForUI = (review) => {
    const authorNickname = review.author?.nickname || `사용자-${String(review.authorId).substring(0, 4)}` || '익명';
    const authorStudentId = review.author?.studentId || 'N/A';
    const authorDepartment = review.author?.department || 'N/A';
    const authorNationality = review.author?.nationality || 'N/A';

    return {
        restaurantReviewId: review.restaurantReviewId,
        authorId: review.authorId,
        rating: review.rating || 0,
        reason: review.reason || '리뷰 내용 없음', 
        authorNickname: authorNickname,
        studentId: authorStudentId,
        department: authorDepartment,
        nationality: authorNationality,
        createdAt: review.createdAt,
    };
};

const ReviewListItem = React.memo(({ review, currentUser, onEdit, onDelete }) => {
    const isMyReview = review.authorId === currentUser.userId;

    return (
        <div className={s.reviewItem}>
            <div className={s.reviewHeader}>
                <ProfileIcon />
                <div className={s.reviewMeta}>
                    <div className={s.reviewUserLine}>
                        <span className={s.reviewUsername}>
                            {review.authorNickname}
                            {isMyReview && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#5b5bff', fontWeight: '500' }}> (나)</span>}
                        </span>
                        <RatingStars rating={review.rating} size={14} />
                    </div>
                    <div className={s.reviewUserInfo}>
                        <span>{displayValue(review.studentId)} / {displayValue(review.department)}</span>
                        <span className={s.reviewSeparator}>•</span>
                        <FlagIcon />
                        <span>{displayValue(review.nationality)}</span>
                    </div>
                </div>
            </div>
            <div className={s.reviewDivider} />
            <p className={s.reviewContent}>{review.reason}</p>

            {isMyReview && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                    <button onClick={() => onEdit(review)} style={{ padding: '4px 10px', borderRadius: '15px', border: '1px solid #ddd', backgroundColor: '#f0f0f0', fontSize: '12px', cursor: 'pointer' }}>수정</button>
                    <button onClick={() => onDelete(review.restaurantReviewId)} style={{ padding: '4px 10px', borderRadius: '15px', border: '1px solid #ddd', backgroundColor: '#ffe6e6', color: '#cc0000', fontSize: '12px', cursor: 'pointer' }}>삭제</button>
                </div>
            )}
        </div>
    );
});


// --- 리뷰 입력/수정 폼 컴포넌트 ---
const ReviewForm = ({ initialData, onSubmit, onCancel, currentUser, selectedRestaurantName }) => {
    const [rating, setRating] = useState(initialData?.rating || 0);
    const [reason, setReason] = useState(initialData?.reason || '');
    const isEditing = !!initialData;
    const isLoading = false; // 로딩 상태 필요 시 추가

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0 || !reason.trim()) {
            alert("별점과 내용을 모두 입력해주세요.");
            return;
        }
        onSubmit({ rating, reason: reason.trim() });
    };

    return (
        <div className={s.reviewFormCard}>
             <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>
                {isEditing ? '리뷰 수정' : `리뷰 작성: ${selectedRestaurantName || '선택된 식당'}`}
            </h3>

            <form onSubmit={handleSubmit}>
                {/* 작성자 메타 정보 */}
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <ProfileIcon style={{ marginRight: '10px', width: '36px', height: '36px' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: '600', fontSize: '15px' }}>{currentUser.nickname}</span>
                            <div style={{ color: '#666', fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                                <span>{currentUser.studentId} / {currentUser.department}</span>
                                <span style={{ margin: '0 4px' }}>•</span>
                                <FlagIcon />
                                <span>{currentUser.nationality}</span>
                            </div>
                        </div>
                    </div>

                    {/* 별점 입력 */}
                    <div style={{ display: 'flex', gap: '8px', paddingTop: '5px' }}>
                        {[1, 2, 3, 4, 5].map((starValue) => (
                            <div key={starValue} onClick={() => setRating(starValue)} style={{ cursor: 'pointer' }}>
                                <StarIcon fill={starValue <= rating} width={24} height={24} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={s.reviewDivider} style={{ margin: '0 0 20px 0' }} />

                <textarea
                    placeholder="식당에 대한 소중한 리뷰를 작성해 주세요..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    style={{ width: '95%', maxWidth: '99%', minHeight: '120px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', resize: 'vertical', fontSize: '15px', outline: 'none', }}
                    disabled={isLoading}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <button type="button" onClick={onCancel} className={s.cancelBtn} style={{fontWeight: '600'}}>취소</button>
                    <button type="submit" disabled={rating === 0 || !reason.trim() || isLoading} className={s.submitBtn} style={{ 
                        backgroundColor: (rating === 0 || !reason.trim() || isLoading) ? '#ccc' : '#5b5bff',
                        cursor: (rating === 0 || !reason.trim() || isLoading) ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                    }}>
                        {isEditing ? '수정 완료' : '등록'}
                    </button>
                </div>
            </form>
        </div>
    );
};


// --- 식당 등록 오버레이 컴포넌트 ---
const RestaurantRegistrationCardOverlay = ({ onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [mapUrl, setMapUrl] = useState('');
    const [type, setType] = useState('NONE'); 

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !mapUrl) {
            alert("식당 이름과 Google Map URL을 입력해주세요.");
            return;
        }
        onSubmit({ name, googleMapUrl: mapUrl, restaurantType: type });
    };

    const restaurantTypes = [
        { value: 'NONE', label: '일반/기타' },
        { value: 'HALAL', label: '할랄 (Halal)' },
        { value: 'KOSHER', label: '코셔 (Kosher)' },
        { value: 'VEGAN', label: '비건 (Vegan)' },
        { value: 'KOREA', label: '한식' },
        { value: 'JAPAN', label: '일식' },
    ]; // 일부만 표시

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
            <div style={{ width: '100%', maxWidth: '350px', padding: '24px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)', textAlign: 'left', }}>
                <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>새 식당 등록 요청</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '5px' }}>식당 이름</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="식당 이름을 입력하세요" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '5px' }}>Google 지도 URL</label>
                        <input type="url" value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} placeholder="지도 URL을 붙여넣으세요" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    </div>
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '5px' }}>식당 타입</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', appearance: 'none', cursor: 'pointer' }}>
                            {restaurantTypes.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" onClick={onClose} className={s.cancelBtn} style={{fontWeight: '600'}}>취소</button>
                        <button type="submit" disabled={!name.trim() || !mapUrl.trim()} className={s.submitBtn} style={{ backgroundColor: (!name.trim() || !mapUrl.trim()) ? '#ccc' : '#5b5bff', fontWeight: '600' }}>등록 요청</button>
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
            <select value={value} onChange={(e) => onChange(e.target.value)} style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #ddd", backgroundColor: "#fff", fontSize: "14px", cursor: 'pointer', appearance: "none", paddingRight: "25px" }}>
                {options.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
            <ChevronDownIcon style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#666' }} />
        </div>
    );
};


// --- 메인 컴포넌트: RestaurantPage.jsx ---

export default function RestaurantPage() {
    // 1. 상태 관리
    const [currentUserProfile, setCurrentUserProfile] = useState(INITIAL_USER_PROFILE);
    const [restaurants, setRestaurants] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("NONE"); // 음식 타입 필터
    const [selectedFilter, setSelectedFilter] = useState("Recommendation"); // 정렬/추천 필터
    const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(false); 
    const [editingReview, setEditingReview] = useState(null); 
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false); 
    const [isLoading, setIsLoading] = useState(true);
    const reviewListRef = useRef(null);

    // 유도 상태
    const selectedRestaurant = restaurants.find(r => r.restaurantId === selectedRestaurantId);
    const currentReviewId = editingReview ? editingReview.restaurantReviewId : null;
    const hasMyReview = reviews.some(r => r.authorId === currentUserProfile.userId && r.restaurantReviewId !== currentReviewId);
    
    
    // 2. 식당 목록 로드 함수 (필터 변경 시 호출)
    const loadRestaurants = useCallback(async () => {
        setIsLoading(true);
        try {
            let data;
            
            if (selectedFilter === "Recommendation") {
                // 추천 로직 API 호출
                data = await fetchRecommendedRestaurants();
            } else {
                // 전체 목록 호출 (Rating, Distance, New 등)
                data = await fetchAllRestaurants();
            }

            setRestaurants(data || []);
            
            // 목록 로드 후 첫 항목 선택 또는 현재 항목 유지
            if (data && data.length > 0) {
                setSelectedRestaurantId(prevId => {
                    const exists = data.some(r => r.restaurantId === prevId);
                    return exists ? prevId : data[0].restaurantId;
                });
            } else {
                setSelectedRestaurantId(null);
            }

        } catch (error) {
            console.error("식당 목록 로드 오류:", error);
            setRestaurants([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedFilter]);

    // 3. 사용자 프로필 로드
    useEffect(() => {
        const loadUserProfile = async () => {
            if (!getCurrentUserId()) { return; } // 비로그인 시 로드 안함
            try {
                const profile = await fetchMyProfile();
                setCurrentUserProfile(prev => ({
                    ...prev,
                    ...profile,
                    preferredFoodType: displayValue(profile.preferredFoodType),
                    nickname: profile.nickname || 'User',
                }));
            } catch (error) {
                console.error("사용자 프로필 로드 오류:", error);
            }
        };

        loadUserProfile();
    }, []);

    // 4. 식당 목록 및 필터링 갱신
    useEffect(() => {
        loadRestaurants();
    }, [loadRestaurants, selectedFilter]);

    // 5. 선택된 식당의 리뷰 로드 (selectedRestaurantId 변경 시)
    useEffect(() => {
        const loadReviews = async () => {
            if (!selectedRestaurantId) {
                setReviews([]);
                setIsReviewFormOpen(false);
                setEditingReview(null);
                return;
            }

            try {
                const reviewData = await fetchReviewsByRestaurantId(selectedRestaurantId);
                const fetchedReviews = reviewData.restaurantReviews || [];
                
                // DTO 구조에 맞게 매핑
                setReviews(fetchedReviews.map(mapReviewForUI)); 

                setIsReviewFormOpen(false);
                setEditingReview(null);

                if (reviewListRef.current) {
                    reviewListRef.current.scrollTop = 0;
                }

            } catch (error) {
                console.error("리뷰 로드 오류:", error);
                setReviews([]);
            }
        };

        loadReviews();
    }, [selectedRestaurantId]);

    // 6. 필터링 및 정렬 (프론트엔드)
    const filterAndSortRestaurants = () => {
        let list = restaurants;

        // 1. 카테고리 필터링
        if (selectedCategory !== 'NONE') {
            list = list.filter(rest => rest.restaurantType === selectedCategory);
        }

        // 2. 정렬 (Recommendation은 서버 정렬 결과 사용)
        if (selectedFilter !== "Recommendation") {
             list = list.sort((a, b) => {
                const ratingA = a.avgRating || 0;
                const ratingB = b.avgRating || 0;

                switch (selectedFilter) {
                    case 'Rating': return ratingB - ratingA;
                    case 'Distance': return (a.distance || a.restaurantId) > (b.distance || b.restaurantId) ? 1 : -1;
                    case 'New': return (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0);
                    default: return 0;
                }
            });
        }
        return list;
    };

    const filteredAndSortedRestaurants = filterAndSortRestaurants();

    // 7. 리뷰 CRUD 핸들러
    const handleReviewSubmit = async (payload) => {
        if (!selectedRestaurantId) return;

        try {
            if (editingReview) {
                await updateReview(editingReview.restaurantReviewId, payload);
                alert("리뷰가 수정되었습니다.");
            } else {
                await createReview({ restaurantId: selectedRestaurantId, ...payload, });
                alert("리뷰가 작성되었습니다.");
            }

            // 성공 후 목록 새로고침 (selectedRestaurantId를 잠시 null로 했다가 다시 설정하여 useEffect 재실행)
            const idToReload = selectedRestaurantId;
            setSelectedRestaurantId(null); 
            setTimeout(() => setSelectedRestaurantId(idToReload), 10); 

        } catch (error) {
            console.error("리뷰 처리 오류:", error);
            alert(`리뷰 처리 중 오류가 발생했습니다: ${error.message}`);
        } finally {
            setEditingReview(null);
            setIsReviewFormOpen(false);
        }
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setIsReviewFormOpen(true);
    };

    const handleDeleteReview = async (reviewId) => {
        const ok = window.confirm("정말로 이 리뷰를 삭제하시겠습니까?");
        if (!ok) return;

        try {
            await deleteReview(reviewId);
            alert("리뷰가 삭제되었습니다.");

            // 성공 후 목록 새로고침
            const idToReload = selectedRestaurantId;
            setSelectedRestaurantId(null); 
            setTimeout(() => setSelectedRestaurantId(idToReload), 10); 

        } catch (error) {
            console.error("리뷰 삭제 오류:", error);
            alert(`리뷰 삭제 중 오류가 발생했습니다: ${error.message}`);
        }
    };

    const handleCancelReviewForm = () => {
        setIsReviewFormOpen(false);
        setEditingReview(null);
    };

    // 8. 식당 등록 핸들러
    const handleCloseRegisterForm = () => setIsRegisterFormOpen(false);
    
    const handleCreateRestaurant = async (payload) => {
        try {
            await createRestaurant(payload);
            alert("식당 등록 요청이 완료되었습니다. 관리자 승인 후 목록에 표시될 수 있습니다.");
            handleCloseRegisterForm();
            loadRestaurants(); // 목록 새로고침
        } catch (error) {
            console.error("식당 등록 오류:", error);
            alert(`식당 등록 중 오류가 발생했습니다: ${error.message}`);
        }
    };

    // 9. 리뷰 작성/수정 폼 렌더링
    const renderReviewForm = () => {
        if (!selectedRestaurant) return null;

        if (editingReview || isReviewFormOpen) {
            return (
                <ReviewForm 
                    initialData={editingReview} 
                    onSubmit={handleReviewSubmit} 
                    onCancel={handleCancelReviewForm} 
                    currentUser={currentUserProfile}
                    selectedRestaurantName={selectedRestaurant.name}
                />
            );
        }

        if (hasMyReview) {
            return <div className={s.noReviewMessage} style={{ padding: '16px' }}>이미 작성한 리뷰가 있습니다.</div>;
        }

        return <WriteReviewButton onClick={() => setIsReviewFormOpen(true)} />;
    };

    return (
        <div className={s.pageContainer}>
            <div className={s.mainContent}>
                {/* 식당 목록 영역 (왼쪽) */}
                <div className={s.listBox}>
                    {/* 상단 드롭다운 및 식당 등록 버튼 */}
                    <div className={s.dropdownContainer}>
                        <CategoryDropdown value={selectedCategory} onChange={setSelectedCategory} options={['NONE', 'HALAL', 'KOSHER', 'VEGAN', 'KOREA', 'JAPAN', 'CHINA', 'VIETNAM', 'INDIA', 'WEST']} />
                        <CategoryDropdown value={selectedFilter} onChange={setSelectedFilter} options={['Recommendation', 'Rating', 'Distance', 'New']} />
                        <RegisterRestaurantButton onClick={() => setIsRegisterFormOpen(true)} />
                    </div>
                    
                    {/* 식당 리스트 */}
                    <div className={`${s.listScrollArea} custom-scroll-list`}>
                        {isLoading ? (
                            <div className={s.noReviewMessage} style={{ color: '#888' }}>식당 목록 로드 중...</div>
                        ) : filteredAndSortedRestaurants.length > 0 ? (
                            filteredAndSortedRestaurants.map((rest) => (
                                <RestaurantListItem
                                    key={rest.restaurantId}
                                    restaurant={rest}
                                    isSelected={rest.restaurantId === selectedRestaurantId}
                                    onClick={() => setSelectedRestaurantId(rest.restaurantId)}
                                />
                            ))
                        ) : (
                            <div className={s.noReviewMessage} style={{ color: '#888' }}>
                                선택된 조건에 맞는 식당이 없습니다.
                            </div>
                        )}
                    </div>
                </div>

                {/* 식당 상세 정보 영역 (오른쪽) */}
                <div ref={reviewListRef} className={s.reviewBox}>
                    <h2 className={s.reviewTitle}>
                        {selectedRestaurant ? `${selectedRestaurant.name} ` : '식당을 선택해주세요.'} 리뷰 목록 ({selectedRestaurant ? reviews.length : 0}개)
                    </h2>
                    
                    {selectedRestaurant ? (
                        <>
                            {/* 리뷰 리스트 */}
                            <div className={s.reviewListScrollArea}>
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <ReviewListItem
                                            key={review.restaurantReviewId}
                                            review={review}
                                            currentUser={currentUserProfile}
                                            onEdit={handleEditReview}
                                            onDelete={handleDeleteReview}
                                        />
                                    ))
                                ) : (
                                    <div className={s.noReviewMessage}>{selectedRestaurant.name}에 대한 리뷰가 아직 없습니다.</div>
                                )}
                            </div>

                            {/* 리뷰 작성/수정 폼 또는 버튼 렌더링 */}
                            {renderReviewForm()}
                        </>
                    ) : (
                        <div className={s.noReviewMessage}>좌측 목록에서 식당을 선택하면 상세 정보와 리뷰를 볼 수 있습니다.</div>
                    )}
                </div>
            </div>
            
            {/* 식당 등록 폼 오버레이 */}
            {isRegisterFormOpen && (
                <RestaurantRegistrationCardOverlay 
                    onClose={handleCloseRegisterForm} 
                    onSubmit={handleCreateRestaurant} 
                />
            )}
        </div>
    );
}