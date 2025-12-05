// src/pages/restaurant/RestaurantPage.jsx
import React, { useState, useEffect, useRef } from "react"; // ✨ useEffect, useRef 추가
import s from "@styles/modules/restaurant/RestaurantPage.module.css";

// 임시 아이콘 컴포넌트
const ChevronDownIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const StarIcon = ({ fill, width = 16, height = 16 }) => <svg width={width} height={height} viewBox="0 0 24 24" fill={fill ? "#FFC700" : "none"} xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={fill ? "#FFC700" : "#d0d0d0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
// 링크 아이콘 추가
const LinkIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
// 임시 프로필 아이콘 (사용자 디자인 반영)
const ProfileIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="7" r="4" fill="#6D28D9" fillOpacity="0.2" /><path d="M17.5 19.5c0-2.5-2.5-4.5-5.5-4.5s-5.5 2-5.5 4.5" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
// 임시 국기 아이콘 (예시: 한국 국기)
const FlagIcon = () => <span role="img" aria-label="South Korea Flag">🇰🇷</span>;

const INITIAL_REVIEWS = [
    {
        id: 101,
        postId: 1, // '할랄 레스토랑 A' 리뷰
        username: "학생1",
        studentId: 20,
        major: "컴퓨터공학",
        country: "한국",
        rating: 5.0,
        content: "정말 맛있는 할랄 음식점입니다! 깨끗하고 분위기도 좋아요. 특히 양고기 커리가 일품입니다."
    },
    {
        id: 102,
        postId: 1,
        username: "학생2",
        studentId: 22,
        major: "경영학",
        country: "말레이시아",
        rating: 4.0,
        content: "훌륭한 영감을 주는 글입니다. 제가 이 글에 쏟아부은 창의성을 정말 좋아합니다. 특히 색상 팔레트가 매우 좋습니다."
    },
    {
        id: 103,
        postId: 2, // '무슬림 친화 마트 B' 리뷰
        username: "학생3",
        studentId: 21,
        major: "국제학",
        country: "터키",
        rating: 4.5,
        content: "필요한 식재료가 많아서 자주 이용합니다. 주인분도 친절하세요. 번역 기능이 있으면 더 좋을 것 같아요."
    },
];

const dummyRestaurants = [
    { id: 1, title: "할랄 레스토랑 A", rating: 4.5, address: "수원시 팔달구 매산로", category: "Halal Certified", imageUrl: "", googleMapUrl: "https://maps.app.goo.gl/example1" },
    { id: 2, title: "무슬림 친화 마트 B", rating: 4.0, address: "수원시 영통구 봉영로", category: "Muslim Friendly", imageUrl: "", googleMapUrl: "https://maps.app.goo.gl/example2" },
    { id: 3, title: "터키 음식점 C", rating: 3.8, address: "서울시 용산구 이태원", category: "Self Certified", imageUrl: "", googleMapUrl: "https://maps.app.goo.gl/example3" },
    { id: 4, title: "아랍 카페 D", rating: 5.0, address: "서울시 마포구", category: "Cafe & Dessert", imageUrl: "", googleMapUrl: "https://maps.app.goo.gl/example4" },
    { id: 5, title: "인도 카레집 E", rating: 4.2, address: "부산시 해운대구", category: "Halal Certified", imageUrl: "", googleMapUrl: "https://maps.app.goo.gl/example5" },
    { id: 6, title: "할랄 닭갈비 F", rating: 4.7, address: "춘천시 동내면", category: "Korean Halal", imageUrl: "", googleMapUrl: "https://maps.app.goo.gl/example6" },
    { id: 7, title: "새로운 스팟 G", rating: 3.5, address: "광주시 북구", category: "New Spot", imageUrl: "", googleMapUrl: "" },
    { id: 8, title: "할랄 레스토랑 H", rating: 4.1, address: "수원시 팔달구 매산로", category: "Halal Certified", imageUrl: "", googleMapUrl: "https://maps.app.goo.gl/example8" },
];

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
        // ✨ className={s.listItem} 적용 및 조건부 클래스 사용
        className={`${s.listItem} ${isSelected ? s.selected : ''}`}
    >
        <div className={s.itemInfo}>
            <h3 className={s.itemTitle}>
                {restaurant.title}
            </h3>

            <div className={s.itemRatingContainer}>
                <span className={s.itemRatingText}>
                    {restaurant.rating.toFixed(1)}
                </span>
                <RatingStars rating={restaurant.rating} />
            </div>

            <p className={s.itemAddress}>
                {restaurant.address}
            </p>

            <div className={s.itemTagsAndLink}>
                <span className={s.itemCategoryTag}>
                    #{restaurant.category}
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
            <span>{restaurant.imageUrl.split(' ')[2] || 'Image'}</span>
        </div>
    </div>
);

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
        onSubmit({ rating, content: content.trim() });
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
    const [selectedCategory, setSelectedCategory] = useState("Halal");
    const [selectedFilter, setSelectedFilter] = useState("Rating");
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(dummyRestaurants[0].id);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [allReviews, setAllReviews] = useState(INITIAL_REVIEWS);
    const reviewListRef = useRef(null);

    const currentReviews = allReviews.filter(r => r.postId === selectedRestaurantId);


    const filterAndSortRestaurants = () => {
        // 1. 카테고리 필터링 적용
        let list = dummyRestaurants.filter(rest => {
            if (selectedCategory === 'All') {
                return true;
            }
            // 카테고리 포함 관계 필터링 (예: 'Halal' 선택 시 'Halal Certified' 포함)
            return rest.category.includes(selectedCategory);
        });

        // 2. 필터 타입에 따른 정렬 적용 (Sorting)
        list = list.sort((a, b) => {
            switch (selectedFilter) {
                case 'Rating':
                    // 평점 높은 순 (내림차순)
                    return b.rating - a.rating;
                case 'Distance':
                    // 거리 가까운 순 (오름차순, 임시 distance 필드가 있다고 가정)
                    // 실제 데이터가 없으면 임시로 id로 정렬하여 변화를 보여줌
                    return (a.distance || a.id) - (b.distance || b.id);
                case 'New':
                    // 최신 등록 순 (내림차순, 임시 createdAt 필드가 있다고 가정)
                    // 실제 데이터가 없으면 임시로 id 역순 정렬
                    return (b.createdAt?.getTime() || b.id) - (a.createdAt?.getTime() || a.id);
                default:
                    return 0;
            }
        });

        return list;
    };
    const filteredAndSortedRestaurants = filterAndSortRestaurants();
    // 필터링된 식당 목록이 바뀌면, 선택된 식당 ID를 첫 번째 항목으로 재설정 (목록이 비어있지 않은 경우)
    useEffect(() => {
        if (filteredAndSortedRestaurants.length > 0 && selectedRestaurantId !== filteredAndSortedRestaurants[0].id) {
            setSelectedRestaurantId(filteredAndSortedRestaurants[0].id);
        }
        // 필터링 결과가 바뀌어도 (정렬 순서만 바뀌어도), 첫 번째 항목으로 포커스를 옮김
    }, [selectedCategory, selectedFilter]);

    useEffect(() => {
        if (reviewListRef.current) {
            reviewListRef.current.scrollTop = reviewListRef.current.scrollHeight;
        }
    }, [currentReviews]);

    // 리뷰 작성 버튼 클릭 핸들러 (임시)
    const handleWriteReview = () => {
        setIsFormOpen(true);
    };

    // 리뷰 폼 닫기 핸들러
    const handleCloseForm = () => {
        setIsFormOpen(false);
    };

    // 리뷰 폼 제출 핸들러
    const handleSubmitReview = ({ rating, content }) => {
        const currentUser = {
            username: "현재 사용자",
            studentId: 23,
            major: "디자인학과",
            country: "미국",
        };

        const newReview = {
            id: Date.now(),
            postId: selectedRestaurantId,
            rating: rating,
            content: content,
            username: currentUser.username,
            studentId: currentUser.studentId,
            major: currentUser.major,
            country: currentUser.country,
        };

        setAllReviews(prevReviews => [...prevReviews, newReview]);

        alert("리뷰가 성공적으로 등록되었습니다!");
        setIsFormOpen(false);
    };
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
                            options={['All', 'Halal', 'Muslim Friendly', 'New Spot']}
                        />
                        <CategoryDropdown
                            value={selectedFilter}
                            onChange={setSelectedFilter}
                            options={['Rating', 'Distance', 'New']}
                        />
                    </div>

                    {/* 식당 리스트: 필터링 및 정렬된 목록 사용 */}
                    <div className={`${s.listScrollArea} custom-scroll-list`}>
                        {filteredAndSortedRestaurants.length > 0 ? (
                            filteredAndSortedRestaurants.map((rest) => (
                                <RestaurantListItem
                                    key={rest.id}
                                    restaurant={rest}
                                    isSelected={rest.id === selectedRestaurantId}
                                    onClick={() => setSelectedRestaurantId(rest.id)}
                                />
                            ))
                        ) : (
                            <div className={s.noReviewMessage} style={{ color: '#888' }}>
                                {/* 스타일 클래스를 재사용하고, color만 인라인으로 유지 */}
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
                        리뷰 목록 ({currentReviews.length}개)
                    </h2>

                    {currentReviews.length > 0 ? (
                        currentReviews.map((review) => (
                            <ReviewListItem key={review.id} review={review} />
                        ))
                    ) : (
                        <div className={s.noReviewMessage}>
                            선택된 식당에 대한 리뷰가 아직 없습니다.
                        </div>
                    )}

                    {/* 리뷰 작성 버튼 */}
                    <WriteReviewButton onClick={() => setIsFormOpen(true)} />
                </div>
            </div>
            {isFormOpen && (
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