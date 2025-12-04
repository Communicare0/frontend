// src/pages/restaurant/RestaurantPage.jsx
import React, { useState } from "react";
// import s from "@styles/modules/restaurant/RestaurantPage.module.css"; // TODO: 스타일 모듈 사용 시

// 임시 아이콘 컴포넌트
const ChevronDownIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const StarIcon = ({ fill }) => <svg width="16" height="16" viewBox="0 0 24 24" fill={fill ? "#FFC700" : "none"} xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={fill ? "#FFC700" : "#d0d0d0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
// 링크 아이콘 추가
const LinkIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;


// 더미 데이터: googleMapUrl 필드 추가
const dummyRestaurants = [
    { id: 1, title: "할랄 레스토랑 A", rating: 4.5, address: "수원시 팔달구 매산로", category: "Halal Certified", imageUrl: "", googleMapUrl: "https://maps.app.goo.gl/example1" },
    { id: 2, title: "무슬림 친화 마트 B", rating: 4.0, address: "수원시 영통구 봉영로", category: "Muslim Friendly", imageUrl: "", googleMapUrl: "https://maps.app.goo.gl/example2" },
    { id: 3, title: "터키 음식점 C", rating: 3.8, address: "서울시 용산구 이태원", category: "Self Certified", imageUrl: "", googleMapUrl: "https://maps.app.goo.gl/example3" },
    { id: 4, title: "아랍 카페 D", rating: 5.0, address: "서울시 마포구", category: "Cafe & Dessert", imageUrl: "", googleMapUrl: "https://maps.app.goo.gl/example4" },
    { id: 5, title: "인도 카레집 E", rating: 4.2, address: "부산시 해운대구", category: "Halal Certified", imageUrl: "", googleMapUrl: "https://maps.app.goo.gl/example5" },
    { id: 6, title: "할랄 닭갈비 F", rating: 4.7, address: "춘천시 동내면", category: "Korean Halal", imageUrl: "", googleMapUrl: "https://maps.app.goo.gl/example6" },
    { id: 7, title: "새로운 스팟 G", rating: 3.5, address: "광주시 북구", category: "New Spot", imageUrl: "", googleMapUrl: "" }, // 링크가 없는 경우 테스트
    { id: 8, title: "할랄 레스토랑 H", rating: 4.1, address: "수원시 팔달구 매산로", category: "Halal Certified", imageUrl: "", googleMapUrl: "https://maps.app.goo.gl/example8" },
];

// 평점 별점 UI 렌더링 함수
const RatingStars = ({ rating }) => {
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
        stars.push(<StarIcon key={i} fill={fill} />);
    }

    return (
        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            {stars}
        </div>
    );
};


/**
 * 식당 정보 박스 컴포넌트 (Task 및 Google Map Link 반영)
 * 식당이름, 평점 취합, 식당 주소, 식당 카테고리, 식당 이미지, 구글 지도 링크
 */
const RestaurantListItem = ({ restaurant, isSelected, onClick }) => (
    <div 
        onClick={onClick}
        style={{
            display: "flex",
            padding: "16px",
            marginBottom: "8px",
            backgroundColor: isSelected ? "#f5f5ff" : "#fff",
            borderRadius: "8px",
            border: isSelected ? "1px solid #5b5bff" : "1px solid #eee",
            boxShadow: isSelected ? "0 2px 8px rgba(91, 91, 255, 0.1)" : "none",
            cursor: "pointer",
            transition: "all 0.2s"
        }}
    >
        <div style={{ flex: 1, paddingRight: "16px" }}>
            {/* 식당이름 */}
            <h3 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 4px", color: "#333" }}>
                {restaurant.title}
            </h3>
            
            {/* 평점 취합 */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "16px", fontWeight: "600", color: "#333", marginRight: "6px" }}>
                    {restaurant.rating.toFixed(1)}
                </span>
                <RatingStars rating={restaurant.rating} />
            </div>
            
            {/* 식당 주소 */}
            <p style={{ fontSize: "14px", color: "#999", margin: "0 0 8px" }}>
                {restaurant.address}
            </p>
            
            {/* 카테고리 및 링크 영역 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* 식당 카테고리 태그 */}
                <span style={{
                    fontSize: "12px",
                    color: "#5b5bff",
                    backgroundColor: "#e8e8ff",
                    padding: "3px 8px",
                    borderRadius: "12px",
                    fontWeight: "500"
                }}>
                    #{restaurant.category}
                </span>

                {/* 구글 지도 링크 옵션 */}
                {restaurant.googleMapUrl && (
                    <a 
                        href={restaurant.googleMapUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        // 박스 클릭 이벤트와 충돌 방지를 위해 event.stopPropagation() 적용
                        onClick={(e) => { e.stopPropagation(); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            fontSize: '14px',
                            color: '#5b5bff',
                            fontWeight: '600',
                            transition: 'color 0.15s',
                        }}
                    >
                        <LinkIcon style={{ marginRight: '4px' }} />
                        Map Link
                    </a>
                )}
            </div>
        </div>
        
        {/* 식당 이미지 */}
        <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "6px",
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden"
        }}>
            <span style={{ fontSize: "12px", color: "#999" }}>{restaurant.imageUrl.split(' ')[2] || 'Image'}</span>
        </div>
    </div>
);


// 메인 페이지 컴포넌트 (이 부분은 이전과 동일합니다.)
export default function RestaurantPage() {
    const [selectedCategory, setSelectedCategory] = useState("Halal");
    const [selectedFilter, setSelectedFilter] = useState("Rating");
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(dummyRestaurants[0].id);

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            padding: "24px 0"
        }}>
            <div style={{ display: "flex", width: "1000px", maxWidth: "100%", gap: "24px", padding: "0 20px" }}>
                
                {/* ⬅️ 식당 목록 박스 영역 (왼쪽) */}
                <div style={{
                    width: "350px",
                    flexShrink: 0,
                    backgroundColor: "#f9f9f9",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                }}>
                    {/* 상단 카테고리 선택 분류 토글 */}
                    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                        <CategoryDropdown 
                            value={selectedCategory} 
                            onChange={setSelectedCategory} 
                            options={['Halal', 'Muslim Friendly', 'All']}
                        />
                         <CategoryDropdown 
                            value={selectedFilter} 
                            onChange={setSelectedFilter} 
                            options={['Rating', 'Distance', 'New']}
                        />
                    </div>

                    {/* 식당들 박스영역: 스크롤 바 & 마우스 스크롤 가능 */}
                    <div style={{
                        flex: 1,
                        overflowY: "auto", // 스크롤바 추가
                        paddingRight: "8px", 
                        WebkitOverflowScrolling: "touch",
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                    }}>
                        {/* 더미 리스트 렌더링 */}
                        {dummyRestaurants.map((rest) => (
                            <RestaurantListItem 
                                key={rest.id} 
                                restaurant={rest} 
                                isSelected={rest.id === selectedRestaurantId}
                                onClick={() => setSelectedRestaurantId(rest.id)}
                            />
                        ))}
                    </div>

                </div>

                {/* ➡️ 식당 상세 정보 영역 (오른쪽 - 현재는 빈 박스) */}
                <div style={{
                    flex: 1,
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    padding: "32px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    border: "1px solid #eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <h2 style={{ color: "#aaa" }}>식당 상세 정보 영역 (선택된 식당: {selectedRestaurantId})</h2>
                    {/* 여기에 Task 4-2-1 등 상세 정보 UI 구현 예정 */}
                </div>
            </div>
        </div>
    );
}

// 상단 카테고리/필터 드롭다운 컴포넌트 (이 부분은 이전과 동일합니다.)
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