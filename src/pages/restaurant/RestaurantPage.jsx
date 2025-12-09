import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import s from "@styles/modules/restaurant/RestaurantPage.module.css";
import { getCurrentUserId } from "@/services/authToken";
import {
    fetchAllRestaurants,
    fetchRecommendedRestaurants,
    fetchReviewsByRestaurantId,
    createReview,
    updateReview,
    deleteReview,
    createRestaurant
} from "@/services/restaurantApi.js";

const displayValue = (value) => (value && value !== "NONE" ? value : "N/A");

const NATIONALITY_FLAG = {
    KOREAN: "🇰🇷",
    VIETNAMESE: "🇻🇳",
    CHINESE: "🇨🇳",
    MYANMARESE: "🇲🇲",
    JAPANESE: "🇯🇵",
    INDONESIAN: "🇮🇩",
    MALAYSIAN: "🇲🇾",
    EMIRATIS: "🇦🇪",
    NONE: "🏳️",
};

// --- 아이콘 컴포넌트 ---
const StarIcon = ({ fill, width = 16, height = 16, onClick, style }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill={fill ? "#FFC700" : "none"} xmlns="http://www.w3.org/2000/svg" onClick={onClick} style={style}>
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={fill ? "#FFC700" : "#d0d0d0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const LinkIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinecap="round" /></svg>;
const ProfileIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="7" r="4" fill="#6D28D9" fillOpacity="0.2" /><path d="M17.5 19.5c0-2.5-2.5-4.5-5.5-4.5s-5.5 2-5.5 4.5" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const FlagIcon = () => <span role="img" aria-label="Flag">🏳️</span>;
const PlusIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);

const INITIAL_USER_PROFILE = {
    userId: getCurrentUserId() || "N/A",
    nickname: "익명",
    studentId: "N/A",
    department: "N/A",
    nationality: "NONE",
    preferredFoodType: "NONE",
};

const RatingStars = ({ rating, size = 16 }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
        let fill = (i < fullStars) || (i === fullStars && hasHalfStar);
        stars.push(<StarIcon key={i} fill={fill} width={size} height={size} />);
    }
    return (<div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>{stars}</div>);
};

const RestaurantListItem = React.memo(({ restaurant, isSelected, onClick }) => {
    const avgRating = restaurant.avgRating ? parseFloat(restaurant.avgRating).toFixed(1) : '0.0';
    
    return (
        <div onClick={onClick} className={`${s.listItem} ${isSelected ? s.selected : ''}`}>
            <div className={s.itemInfo}>
                <h3 className={s.itemTitle}>{restaurant.name}</h3>
                <div className={s.itemRatingContainer}>
                    <span className={s.itemRatingText}>{avgRating}</span>
                    <RatingStars rating={restaurant.avgRating || 0} />
                    <span style={{ fontSize: '11px', color: '#888', marginLeft: '4px' }}>({restaurant.ratingCount || 0})</span>
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
});

// 백엔드가 준 데이터(RestaurantReviewResponse)를 그대로 믿고 UI에 바인딩합니다.
const mapReviewForUI = (review) => {
    return {
        restaurantReviewId: review.restaurantReviewId,
        authorId: review.authorId,
        rating: review.rating || 0,
        reason: review.reason || '리뷰 내용 없음', 
        
        // 닉네임: 무조건 익명
        authorNickname: "익명",
        
        // null 체크 정도만 수행하고 값은 그대로 씁니다.
        studentYear: review.authorStudentYear || 'N/A', 
        department: displayValue(review.authorDepartment),
        nationEmoji: NATIONALITY_FLAG[review.authorNationality] || NATIONALITY_FLAG["NONE"],
        
        createdAt: new Date(review.createdAt).toLocaleDateString(),
    };
};

const ReviewListItem = React.memo(({ review, currentUser, onEdit, onDelete }) => {
    const isMyReview = review.authorId === currentUser.userId;
    
    // UI 텍스트 설정
    const displayName = isMyReview ? "익명 (나)" : "익명";

    return (
        <div className={s.reviewItem}>
            <div className={s.reviewHeader}>
                <ProfileIcon />
                <div className={s.reviewMeta}>
                    <div className={s.reviewUserLine}>
                        <span className={s.reviewUsername}>{displayName}</span>
                        <RatingStars rating={review.rating} size={14} />
                    </div>
                    <div className={s.reviewUserInfo}>
                        <span>{review.studentYear}</span>
                        <span className={s.reviewSeparator}> / </span>
                        <span>{review.department}</span>
                        <span className={s.reviewSeparator}> • </span>
                        <span style={{ fontSize: '14px' }}>{review.nationEmoji}</span>
                    </div>
                </div>
            </div>
            <div className={s.reviewDivider} />
            <p className={s.reviewContent}>{review.reason}</p>

            {isMyReview && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                    <button onClick={(e) => { e.stopPropagation(); onEdit(review); }} style={{ padding: '4px 10px', borderRadius: '15px', border: '1px solid #ddd', backgroundColor: '#f0f0f0', fontSize: '12px', cursor: 'pointer' }}>수정</button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(review.restaurantReviewId); }} style={{ padding: '4px 10px', borderRadius: '15px', border: '1px solid #ddd', backgroundColor: '#ffe6e6', color: '#cc0000', fontSize: '12px', cursor: 'pointer' }}>삭제</button>
                </div>
            )}
        </div>
    );
});

const ReviewForm = ({ initialData, onSubmit, onCancel, currentUser, selectedRestaurantName }) => {
    const [rating, setRating] = useState(initialData?.rating || 0);
    const [reason, setReason] = useState(initialData?.reason || '');
    const isEditing = !!initialData;
    const isLoading = false;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0 || !reason.trim()) {
            alert("별점과 내용을 모두 입력해주세요.");
            return;
        }
        onSubmit({ rating, reason: reason.trim() });
    };


    const displayFlag = isEditing 
        ? initialData.nationEmoji 
        : (NATIONALITY_FLAG[currentUser.nationality] || NATIONALITY_FLAG["NONE"]);

    // 학번 (수정 시: 이미 포맷된 데이터 / 작성 시: 포맷팅 필요)
    let displayStudentYear = "N/A";
    if (isEditing) {
        displayStudentYear = initialData.studentYear;
    } else {
        // 작성 모드일 때만 로컬 데이터 포맷팅 수행
        if (currentUser.studentId && currentUser.studentId !== "N/A" && currentUser.studentId.length >= 4) {
            displayStudentYear = currentUser.studentId.substring(2, 4) + "학번";
        }
    }

    // 학과
    const displayDepartment = isEditing ? initialData.department : currentUser.department;

    return (
        <div className={s.reviewFormCard} style={{ width: '100%', maxWidth: '500px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
             <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>
                {isEditing ? '리뷰 수정' : `리뷰 작성: ${selectedRestaurantName || '식당'}`}
            </h3>
            <form onSubmit={handleSubmit}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <ProfileIcon style={{ marginRight: '10px', width: '36px', height: '36px' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: '600', fontSize: '15px' }}>익명 (나)</span>
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
                <div className={s.reviewDivider} style={{ margin: '0 0 20px 0' }} />
                <textarea
                    placeholder="식당에 대한 소중한 리뷰를 작성해 주세요..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className={s.reviewTextarea}
                    disabled={isLoading}
                />
                <div className={s.buttonGroup}>
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
    ];

    return (
        <div className={s.overlay}>
            <div className={s.registrationCard}>
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
                    <div className={s.buttonGroup}>
                        <button type="button" onClick={onClose} className={s.cancelBtn} style={{fontWeight: '600'}}>취소</button>
                        <button type="submit" disabled={!name.trim() || !mapUrl.trim()} className={s.submitBtn} style={{ backgroundColor: (!name.trim() || !mapUrl.trim()) ? '#ccc' : '#5b5bff', fontWeight: '600' }}>등록 요청</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CategoryDropdown = ({ value, onChange, options }) => {
    return (
        <div style={{ position: 'relative' }}>
            <select value={value} onChange={(e) => onChange(e.target.value)} style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #ddd", backgroundColor: "#fff", fontSize: "14px", cursor: 'pointer', appearance: "none", paddingRight: "25px" }}>
                {options.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#666' }}><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
    );
};

const WriteReviewButton = ({ onClick }) => (
    <button onClick={onClick} className={s.writeReviewButton} style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 10 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9M16.5 3.5L21 8M15 5L2 18V22H6L19 9L15 5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
);

const RegisterRestaurantButton = ({ onClick }) => (
    <button onClick={onClick} className={s.registerButton}>
        <PlusIcon style={{ marginRight: '4px' }} />
        <span>식당 등록</span>
    </button>
);


export default function RestaurantPage() {
    const [currentUserProfile, setCurrentUserProfile] = useState(INITIAL_USER_PROFILE);
    const [restaurants, setRestaurants] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("NONE");
    const [selectedFilter, setSelectedFilter] = useState("Recommendation");
    const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(false); 
    const [editingReview, setEditingReview] = useState(null); 
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false); 
    const [isLoading, setIsLoading] = useState(true);
    const reviewListRef = useRef(null);

    const selectedRestaurant = useMemo(() => restaurants.find(r => r.restaurantId === selectedRestaurantId), [restaurants, selectedRestaurantId]);
    const hasMyReview = useMemo(() => reviews.some(r => r.authorId === currentUserProfile.userId && r.restaurantReviewId !== (editingReview?.restaurantReviewId)), [reviews, currentUserProfile.userId, editingReview]);

    useEffect(() => {
        const loadUserProfileDefaults = () => {
            const currentId = getCurrentUserId();
            
            if (!currentId) {
                setCurrentUserProfile(prev => ({ ...prev, nickname: "게스트" }));
                return;
            }
            
            // 로컬 스토리지에서 정보 가져오기 (리뷰 작성 시 보여줄 데이터)
            const localProfileData = {
                studentId: localStorage.getItem('user_studentId') || "N/A",
                department: localStorage.getItem('user_department') || "N/A",
                nationality: localStorage.getItem('user_nationality') || "NONE",
                preferredFoodType: localStorage.getItem('user_foodType') || "NONE", 
            };

            setCurrentUserProfile(prev => ({
                ...prev,
                userId: currentId,
                nickname: "익명", // 기본적으로 익명
                ...localProfileData,
                preferredFoodType: displayValue(localProfileData.preferredFoodType),
            }));
        };

        loadUserProfileDefaults();
    }, []);

    const loadRestaurants = useCallback(async () => {
        setIsLoading(true);
        try {
            let data;
            if (selectedCategory === "Recommendation") { 
                data = await fetchRecommendedRestaurants();
            } else {
                data = await fetchAllRestaurants();
            }
            setRestaurants(data || []);
            
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
    }, [selectedCategory]);

    const loadReviews = useCallback(async (id) => {
        if (!id) { setReviews([]); return; }
        try {
            const timestamp = new Date().getTime();
            const reviewData = await fetchReviewsByRestaurantId(id, { cacheBuster: timestamp });
            
            let fetchedReviews = [];
            if (Array.isArray(reviewData)) {
                fetchedReviews = reviewData;
            } else if (reviewData && Array.isArray(reviewData.restaurantReviews)) {
                fetchedReviews = reviewData.restaurantReviews;
            } else {
                fetchedReviews = [];
            }

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
    }, []);

    useEffect(() => {
        loadRestaurants();
    }, [loadRestaurants]);

    useEffect(() => {
        loadReviews(selectedRestaurantId);
    }, [selectedRestaurantId, loadReviews]);

    const filteredAndSortedRestaurants = useMemo(() => {
        let list = restaurants;

        if (selectedCategory !== 'NONE' && selectedCategory !== 'Recommendation') {
            list = list.filter(rest => rest.restaurantType === selectedCategory);
        }
        
        if (selectedFilter !== "Recommendation") {
             list = list.sort((a, b) => {
                const ratingA = a.avgRating || 0;
                const ratingB = b.avgRating || 0;
                if (selectedFilter === 'Rating') return ratingB - ratingA;
                if (selectedFilter === 'New') return (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0);
                return 0;
            });
        }
        return list;
    }, [restaurants, selectedCategory, selectedFilter]);

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
            
            await loadReviews(selectedRestaurantId);
            await loadRestaurants();

        } catch (error) {
            console.error("리뷰 처리 오류:", error);
            await loadReviews(selectedRestaurantId);
            await loadRestaurants();
            alert(`처리 결과: ${error.message}`);
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
            
            await loadReviews(selectedRestaurantId);
            await loadRestaurants();
        } catch (error) {
            console.error("리뷰 삭제 오류:", error);
            // 204 이슈 대비 강제 갱신
            await loadReviews(selectedRestaurantId);
            await loadRestaurants();
        }
    };

    const handleCancelReviewForm = () => {
        setIsReviewFormOpen(false);
        setEditingReview(null);
    };

    const handleCreateRestaurant = async (payload) => {
        try {
            await createRestaurant(payload);
            alert("식당 등록 요청이 완료되었습니다.");
            setIsRegisterFormOpen(false);
            loadRestaurants();
        } catch (error) {
            console.error("식당 등록 오류:", error);
            alert(`식당 등록 중 오류가 발생했습니다: ${error.message}`);
        }
    };

    const renderReviewForm = () => {
        if (editingReview || isReviewFormOpen) {
            return (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    zIndex: 50,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backdropFilter: 'blur(4px)'
                }}>
                    <ReviewForm 
                        initialData={editingReview} 
                        onSubmit={handleReviewSubmit} 
                        onCancel={handleCancelReviewForm} 
                        currentUser={currentUserProfile}
                        selectedRestaurantName={selectedRestaurant ? selectedRestaurant.name : ''}
                    />
                </div>
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
                    <div className={s.dropdownContainer}>
                        <CategoryDropdown value={selectedCategory} onChange={setSelectedCategory} options={['NONE', 'Recommendation', 'HALAL', 'KOSHER', 'VEGAN', 'KOREA', 'JAPAN', 'CHINA', 'VIETNAM', 'INDIA', 'WEST']} />
                        <CategoryDropdown value={selectedFilter} onChange={setSelectedFilter} options={['Rating', 'Distance', 'New']} />
                        <RegisterRestaurantButton onClick={() => setIsRegisterFormOpen(true)} />
                    </div>
                    
                    <div className={`${s.listScrollArea} custom-scroll-list`}>
                        {isLoading ? (
                            <div className={s.noReviewMessage}>식당 목록 로드 중...</div>
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
                            <div className={s.noReviewMessage}>선택된 조건에 맞는 식당이 없습니다.</div>
                        )}
                    </div>
                </div>

                {/* 식당 상세 정보 영역 (오른쪽) */}
                <div ref={reviewListRef} className={s.reviewBox} style={{ position: 'relative' }}>
                    <h2 className={s.reviewTitle}>
                        {selectedRestaurant ? `${selectedRestaurant.name} ` : '식당을 선택해주세요.'} 리뷰 목록 ({selectedRestaurant ? reviews.length : 0}개)
                    </h2>
                    
                    {selectedRestaurant ? (
                        <>
                            {reviews.length > 0 ? (
                                <div className={s.reviewListScrollArea}>
                                    {reviews.map((review) => (
                                        <ReviewListItem
                                            key={review.restaurantReviewId}
                                            review={review}
                                            currentUser={currentUserProfile}
                                            onEdit={handleEditReview}
                                            onDelete={handleDeleteReview}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className={s.noReviewMessage}>{selectedRestaurant.name}에 대한 리뷰가 아직 없습니다.</div>
                            )}

                            {renderReviewForm()}
                        </>
                    ) : (
                        <div className={s.noReviewMessage}>좌측 목록에서 식당을 선택하면 상세 정보와 리뷰를 볼 수 있습니다.</div>
                    )}
                </div>
            </div>
            
            {isRegisterFormOpen && (
                <RestaurantRegistrationCardOverlay 
                    onClose={() => setIsRegisterFormOpen(false)} 
                    onSubmit={handleCreateRestaurant} 
                />
            )}
        </div>
    );
}