// src/pages/restaurant/RestaurantPage.jsx
import React, { useState, useEffect, useRef } from "react";
import s from "@styles/modules/restaurant/RestaurantPage.module.css";
import { 
    fetchAllRestaurants, 
    fetchReviewsByRestaurantId, 
    createReview 
} from "@/services/restaurantApi"; 

// 임시 아이콘 컴포넌트
const ChevronDownIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const StarIcon = ({ fill, width = 16, height = 16 }) => <svg width={width} height={height} viewBox="0 0 24 24" fill={fill ? "#FFC700" : "none"} xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={fill ? "#FFC700" : "#d0d0d0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
// 링크 아이콘 추가
const LinkIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
// 임시 프로필 아이콘 (사용자 디자인 반영)
const ProfileIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="7" r="4" fill="#6D28D9" fillOpacity="0.2" /><path d="M17.5 19.5c0-2.5-2.5-4.5-5.5-4.5s-5.5 2-5.5 4.5" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
// 임시 국기 아이콘 (예시: 한국 국기)
const FlagIcon = () => <span role="img" aria-label="South Korea Flag">🇰🇷</span>;

const WriteIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 20H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.5 3.5C17.757 2.243 19.757 2.243 21 3.5L20.5 4L19 2.5L16.5 4.5V3.5ZM16.5 3.5L19 6L18 7L15.5 5.5L16.5 3.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 5L18 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 19L11 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 13L3 21H11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 5.5L4 17.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const WriteReviewButton = ({ onClick }) => (
    <button
        onClick={onClick}
        className={s.writeReviewButton}
        style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            zIndex: 10,
        }}
    >
        <WriteIcon />
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

    return (
        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            {stars}
        </div>
    );
};


const RestaurantListItem = ({ restaurant, isSelected, onClick }) => (
    <div
        onClick={onClick}
        className={`${s.listItem} ${isSelected ? s.selected : ''}`}
    >
        <div className={s.itemInfo}>
            <h3 className={s.itemTitle}>
                {restaurant.title}
            </h3>

            <div className={s.itemRatingContainer}>
                <span className={s.itemRatingText}>
                    {restaurant.rating?.toFixed(1) || 'N/A'}
                </span>
                <RatingStars rating={restaurant.rating} />
            </div>

            <p className={s.itemAddress}>
                {restaurant.address}
            </p>

            <div className={s.itemTagsAndLink}>
                {/* category는 백엔드 enum 값을 titleCase 등으로 변환하여 사용해야 함 */}
                <span className={s.itemCategoryTag}>
                    #{restaurant.restaurantType || 'GENERAL'} 
                </span>

                {restaurant.googleMapUrl && (
                    <a
                        href={restaurant.googleMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => { e.stopPropagation(); }}
                        className={s.itemMapLink}
                    >
                        <LinkIcon style={{ marginRight: '4px' }} />
                        Map Link
                    </a>
                )}
            </div>
        </div>

        <div className={s.itemImagePlaceholder}>
            {/* 임시 플레이스홀더 */}
            <span>Image</span> 
        </div>
    </div>
);

// 백엔드 리뷰 객체를 프론트엔드 컴포넌트 형식에 맞게 변환
const mapReviewForUI = (review) => {
    // 실제 백엔드 응답(RestaurantReview) 필드에 맞게 매핑
    return {
        id: review.restaurantReviewId,
        rating: review.rating,
        content: review.ratingGoodReason || review.ratingOtherReason || '리뷰 내용 없음', // 내용 필드 임시 매핑
        // 사용자 정보 (Author) 필드를 가정하여 매핑
        username: review.author.username || review.author.userId,
        studentId: review.author.studentId || 'N/A', 
        major: review.author.major || 'N/A',
        country: review.author.country || 'N/A', 
    };
};

const ReviewListItem = ({ review }) => {
    return (
        <div className={s.reviewItem}>
            <div className={s.reviewHeader}>
                <ProfileIcon />

                <div className={s.reviewMeta}>
                    <div className={s.reviewUserLine}>
                        <span className={s.reviewUsername}>
                            {review.username}
                        </span>
                        <RatingStars rating={review.rating} size={14} />
                    </div>

                    <div className={s.reviewUserInfo}>
                        <span>{review.studentId} / {review.major}</span>
                        <span className={s.reviewSeparator}>•</span>
                        <FlagIcon />
                        <span>{review.country}</span>
                    </div>
                </div>
            </div>

            <div className={s.reviewDivider} />

            <p className={s.reviewContent}>
                {review.content}
            </p>
        </div>
    );
}

const ReviewFormModal = ({ onClose, onSubmit, selectedRestaurantId }) => {
    // 현재 사용자 더미 정보 (실제 구현 시 로그인 사용자 정보 사용)
    const currentUser = {
        // 실제로는 Redux/Context 등에서 로그인 사용자 정보 가져옴
        username: "현재 사용자", 
        studentId: 23,
        major: "디자인학과",
        country: "미국",
    };

    const [rating, setRating] = useState(0);
    const [content, setContent] = useState(""); 

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0 || !content.trim()) {
            alert("별점과 내용을 모두 입력해주세요.");
            return;
        }
        
        const payload = {
            restaurantId: selectedRestaurantId,
            rating: rating,
            ratingGoodReason: content.trim(),
        };

        onSubmit(payload);
    };
    
    return (
        // 모달 오버레이 배경
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>

            {/* 리뷰 작성 폼 박스 */}
            <form onSubmit={handleSubmit} style={{
                width: '600px',
                backgroundColor: "#fff",
                borderRadius: "16px",
                padding: "30px",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
                maxHeight: '80vh',
                overflowY: 'auto',
            }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '20px', fontWeight: '700' }}>
                    리뷰 작성
                </h3>

                {/* 1. 사용자 정보 및 별점 입력 */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    {/* 프로필 정보 */}
                    <ProfileIcon />
                    <div style={{ marginLeft: '12px', flex: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '15px' }}>
                            {currentUser.username}
                        </div>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                            <span>{currentUser.studentId} / {currentUser.major}</span>
                            <span style={{ margin: '0 6px' }}>•</span>
                            <FlagIcon />
                            <span>{currentUser.country}</span>
                        </div>
                    </div>

                    {/* 별점 입력 (RatingStars 재사용 및 클릭 이벤트 추가) */}
                    <div style={{ display: 'flex', gap: '2px', cursor: 'pointer' }}>
                        {[1, 2, 3, 4, 5].map((starValue) => (
                            <div
                                key={starValue}
                                onClick={() => setRating(starValue)}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <StarIcon fill={starValue <= rating} width={24} height={24} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. 구분선 */}
                <div style={{ height: '1px', backgroundColor: '#e0e0e0', margin: '15px 0' }} />

                {/* 3. 리뷰 내용 입력 영역 */}
                <textarea
                    placeholder="식당에 대한 소중한 리뷰를 작성해 주세요..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{
                        width: '100%',
                        minHeight: '150px',
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        resize: 'vertical',
                        fontSize: '14px',
                        outline: 'none',
                    }}
                />

                {/* 4. 등록/취소 버튼 */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '20px',
                            border: '1px solid #ddd',
                            backgroundColor: '#f0f0f0',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '600',
                        }}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={rating === 0 || !content.trim()}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '20px',
                            border: 'none',
                            backgroundColor: (rating === 0 || !content.trim()) ? '#ccc' : '#5b5bff',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '600',
                            transition: 'background-color 0.2s',
                        }}
                    >
                        등록
                    </button>
                </div>
            </form>
        </div>
    );
};


export default function RestaurantPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState("All"); // 기본 카테고리 'All'로 변경
    const [selectedFilter, setSelectedFilter] = useState("Rating");
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null); 
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    const reviewListRef = useRef(null);

    // --- 데이터 로딩 로직 ---

    // 1. 식당 목록 로드
    useEffect(() => {
        async function loadRestaurants() {
            try {
                // API 호출: 모든 식당 목록 조회
                const data = await fetchAllRestaurants();
                setRestaurants(data);

                // 목록 로드 후, 첫 번째 식당을 선택
                if (data.length > 0 && selectedRestaurantId === null) {
                    setSelectedRestaurantId(data[0].restaurantId);
                }
            } catch (error) {
                console.error("식당 목록 로드 실패:", error);
            }
        }
        loadRestaurants();
    }, []); 

    // 2. 선택된 식당에 대한 리뷰 목록 로드
    const loadReviews = async (id) => {
        if (!id) {
            setReviews([]);
            return;
        }
        try {
            // API 호출: 특정 식당 리뷰 목록 조회
            const data = await fetchReviewsByRestaurantId(id);
            // 백엔드 응답을 UI에서 사용할 형식으로 변환
            setReviews(data.map(mapReviewForUI));
        } catch (error) {
            console.error(`리뷰 목록 로드 실패 (ID: ${id}):`, error);
            setReviews([]);
        }
    };

    useEffect(() => {
        loadReviews(selectedRestaurantId);
    }, [selectedRestaurantId]); // 선택된 식당 ID가 바뀔 때마다 리뷰 목록 로드


    const filterAndSortRestaurants = () => {
        // 1. 카테고리 필터링 적용
        let list = restaurants.filter(rest => {
            if (selectedCategory === 'All') {
                return true;
            }
            // 백엔드 RestaurantType이 String으로 넘어온다고 가정
            return rest.restaurantType?.toUpperCase().includes(selectedCategory.toUpperCase().replace(/\s/g, '_')); 
        });

        // 2. 필터 타입에 따른 정렬 적용
        list = list.sort((a, b) => {
            // avgRating을 사용 
            const ratingA = a.avgRating || 0;
            const ratingB = b.avgRating || 0;

            switch (selectedFilter) {
                case 'Rating':
                    return ratingB - ratingA;
                case 'Distance':
                    return (a.distance || a.restaurantId) > (b.distance || b.restaurantId) ? 1 : -1;
                case 'New':
                    return (new Date(b.createdAt).getTime() || b.restaurantId) - (new Date(a.createdAt).getTime() || a.restaurantId);
                default:
                    return 0;
            }
        });

        return list;
    };
    
    const filteredAndSortedRestaurants = filterAndSortRestaurants();
    
    // 필터링/정렬 결과가 바뀔 때마다 첫 번째 항목을 선택
    useEffect(() => {
        if (filteredAndSortedRestaurants.length > 0) {
            const firstId = filteredAndSortedRestaurants[0].restaurantId;
            // 현재 선택된 ID가 목록의 첫 번째 ID와 다르면 업데이트
            if (selectedRestaurantId !== firstId) { 
                setSelectedRestaurantId(firstId);
            }
        } else if (restaurants.length > 0 && filteredAndSortedRestaurants.length === 0) {
            setSelectedRestaurantId(null);
        }
    }, [selectedCategory, selectedFilter, restaurants]);

    // 리뷰 목록 자동 스크롤
    useEffect(() => {
        if (reviewListRef.current) {
            reviewListRef.current.scrollTop = reviewListRef.current.scrollHeight;
        }
    }, [reviews]);

    // 리뷰 폼 닫기 핸들러
    const handleCloseForm = () => {
        setIsFormOpen(false);
    };

    // 리뷰 폼 제출 핸들러
    const handleSubmitReview = async (payload) => {
        try {
            await createReview(payload);
            
            alert("리뷰가 성공적으로 등록되었습니다!");
            setIsFormOpen(false);
            
            loadReviews(selectedRestaurantId);

            const updatedRestaurants = await fetchAllRestaurants();
            setRestaurants(updatedRestaurants);

        } catch (error) {
            console.error("리뷰 등록 실패:", error);
            alert("리뷰 등록에 실패했습니다: " + (error.message || "알 수 없는 오류"));
        }
    };

    const selectedRestaurant = restaurants.find(r => r.restaurantId === selectedRestaurantId);


    return (
        <div className={s.pageContainer}>
            <div className={s.mainContent}>

                {/* ⬅️ 식당 목록 박스 영역 (왼쪽) */}
                <div className={s.listBox}>

                    {/* 상단 카테고리 / 필터 드롭다운 */}
                    <div className={s.dropdownContainer}>
                        <CategoryDropdown
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            options={['All', 'HALAL', 'KOSHER', 'VEGAN', 'NONE']} // 백엔드 Enum 값 기반으로 옵션 변경
                        />
                        <CategoryDropdown
                            value={selectedFilter}
                            onChange={setSelectedFilter}
                            options={['Rating', 'Distance', 'New']}
                        />
                    </div>

                    {/* 식당 리스트: 필터링 및 정렬된 목록 사용 */}
                    <div className={`${s.listScrollArea} custom-scroll-list`}>
                        {restaurants.length === 0 && !selectedRestaurantId ? (
                             <div className={s.noReviewMessage} style={{ color: '#888' }}>
                                식당 목록을 로드 중이거나 등록된 식당이 없습니다.
                            </div>
                        ) : filteredAndSortedRestaurants.length > 0 ? (
                            filteredAndSortedRestaurants.map((rest) => (
                                <RestaurantListItem
                                    key={rest.restaurantId} // ID 필드명 변경
                                    restaurant={rest}
                                    isSelected={rest.restaurantId === selectedRestaurantId}
                                    onClick={() => setSelectedRestaurantId(rest.restaurantId)} // ID 필드명 변경
                                />
                            ))
                        ) : (
                            <div className={s.noReviewMessage} style={{ color: '#888' }}>
                                선택된 조건에 맞는 식당이 없습니다.
                            </div>
                        )}
                    </div>
                </div>

                {/* ➡️ 식당 상세 정보 영역 (오른쪽) */}
                <div
                    ref={reviewListRef}
                    className={s.reviewBox}
                >
                    <h2 className={s.reviewTitle}>
                        {selectedRestaurant ? `${selectedRestaurant.name} ` : ''} 리뷰 목록 ({reviews.length}개)
                    </h2>

                    {selectedRestaurantId && reviews.length > 0 ? (
                        reviews.map((review) => (
                            <ReviewListItem key={review.id} review={review} />
                        ))
                    ) : (
                        <div className={s.noReviewMessage}>
                            {selectedRestaurant ? `${selectedRestaurant.name}에 대한 리뷰가 아직 없습니다.` : '식당을 선택해주세요.'}
                        </div>
                    )}

                    {/* 리뷰 작성 버튼은 식당이 선택된 경우에만 노출 */}
                    {selectedRestaurantId && (
                        <WriteReviewButton onClick={() => setIsFormOpen(true)} />
                    )}
                </div>
            </div>
            {isFormOpen && selectedRestaurantId && (
                <ReviewFormModal
                    onClose={handleCloseForm}
                    onSubmit={handleSubmitReview}
                    selectedRestaurantId={selectedRestaurantId}
                />
            )}
        </div>
    );
}

// 상단 카테고리/필터 드롭다운 컴포넌트 
const CategoryDropdown = ({ value, onChange, options }) => {
    return (
        <div style={{ position: 'relative' }}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    backgroundColor: "#fff",
                    fontSize: "14px",
                    cursor: "pointer",
                    appearance: "none",
                    paddingRight: "25px"
                }}
            >
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            <ChevronDownIcon style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#666' }} />
        </div>
    );
};