import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { update } from "@/services/authApi";
import { fetchMyData } from "@/services/mypageApi";
import Nationalities from "@/pages/mypage/Nationalities";

import s from "@styles/modules/mypage/UpdateUserInfoPage.module.css";

export default function UpdateUserInfoPage() {

    const [form, setForm] = useState({
        department: "",
        studentId: "",
        nationality: "KOREAN",
        preferredFoodType: "NONE",
        language: "KO",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        async function loadMyInfo() {
            try {
                const data = await fetchMyData();

                setForm({
                    department: data.department ?? "",
                    studentId: data.studentId ?? "",
                    nationality: data.nationality ?? "KOREAN",
                    preferredFoodType: data.preferredFoodType ?? "NONE",
                    language: data.language ?? "KOREAN",
                });
            } catch (err) {
                console.error(err);
                setError("내 정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        }

        loadMyInfo();
    }, []);

    const handleChange = (key) => (e) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await update(form);
            setSuccess("저장되었습니다!");
        } catch (err) {
            console.error(err);
            setError("저장 중 오류가 발생했습니다.");
        }
    };

    const handleExit = () => {
        const ok = window.confirm(
            "변경 사항이 저장되지 않습니다. 정말 나가시겠습니까?"
        );
        if (ok) {
            navigate("/mypage");
        }
    }

    if (loading) {
        return <div className={s.updatepageLayer}>불러오는 중...</div>
    }

    return (
        <div className={s.updatepageLayer}>
            <form className={s.form} onSubmit={handleSubmit}>

                <label className={s.label}>학과</label>
                <select
                    value={form.department}
                    onChange={handleChange("department")}
                    className={s.input}
                >
                    <option value="간호학과"> 간호학과 </option>
                    <option value="건설시스템공학과"> 건설시스템공학과 </option>
                    <option value="건축학과"> 건축학과 </option>
                    <option value="경영인텔리전스학과"> 경영인텔리전스학과 </option>
                    <option value="경영학과"> 경영학과 </option>
                    <option value="경제정치사회융합학부"> 경제정치사회융합학부 </option>
                    <option value="경제학과"> 경제학과 </option>
                    <option value="교통시스템공학과"> 교통시스템공학과 </option>
                    <option value="국방디지털융합학과"> 국방디지털융합학과 </option>
                    <option value="국어국문학과"> 국어국문학과 </option>
                    <option value="국제경영학과"> 국제경영학과 </option>
                    <option value="국제학부"> 국제학부 </option>
                    <option value="글로벌경영학과"> 글로벌경영학과 </option>
                    <option value="금융공학과"> 금융공학과 </option>
                    <option value="기계공학과"> 기계공학과 </option>
                    <option value="디지털미디어학과"> 디지털미디어학과 </option>
                    <option value="문화콘텐츠학과"> 문화콘텐츠학과 </option>
                    <option value="물리학과"> 물리학과 </option>
                    <option value="미래모빌리티공학과"> 미래모빌리티공학과 </option>
                    <option value="불어불문학"> 불어불문학 </option>
                    <option value="사이버보안학과"> 사이버보안학과 </option>
                    <option value="사학과"> 사학과 </option>
                    <option value="사회학과"> 사회학과 </option>
                    <option value="산업공학과"> 산업공학과 </option>
                    <option value="생명과학과"> 생명과학과 </option>
                    <option value="소프트웨어학과"> 소프트웨어학과 </option>
                    <option value="수학과"> 수학과 </option>
                    <option value="스포츠레저학과"> 스포츠레저학과 </option>
                    <option value="심리학과"> 심리학과 </option>
                    <option value="약학과"> 약학과 </option>
                    <option value="영어영문학과"> 영어영문학과 </option>
                    <option value="융합시스템공학과"> 융합시스템공학과 </option>
                    <option value="응용화학과"> 응용화학과 </option>
                    <option value="응용화학생명공학과"> 응용화학생명공학과 </option>
                    <option value="의학과"> 의학과 </option>
                    <option value="인공지능융합학과"> 인공지능융합학과 </option>
                    <option value="자유전공학부"> 자유전공학부 </option>
                    <option value="전자공학과"> 전자공학과 </option>
                    <option value="정치외교학과"> 정치외교학과 </option>
                    <option value="지능형반도체공학과"> 지능형반도체공학과 </option>
                    <option value="첨단신소재공학과"> 첨단신소재공학과 </option>
                    <option value="프런티어과학학부"> 프런티어과학학부 </option>
                    <option value="행정학과"> 행정학과 </option>
                    <option value="화학공학과"> 화학공학과 </option>
                    <option value="화학과"> 화학과 </option>
                    <option value="환경안전공학과"> 환경안전공학과 </option>
                </select>

                <label className={s.label}>학번</label>
                <input
                    type="text"
                    value={form.studentId}
                    onChange={handleChange("studentId")}
                    className={s.input}
                    placeholder="예: 20230001"
                />

                <label className={s.label}>국적</label>
                <Nationalities value={form.nationality} onChange={handleChange("nationality")} className={s.input} />

                <label className={s.label}>선호 음식 타입</label>
                <select
                    value={form.preferredFoodType}
                    onChange={handleChange("preferredFoodType")}
                    className={s.input}
                >
                    <option value="NONE">상관없음</option>
                    <option value="HALAL">할랄</option>
                    <option value="KOSHER">코셔</option>
                    <option value="VEGAN">비건</option>
                </select>

                <label className={s.label}>언어</label>
                <select
                    value={form.language}
                    onChange={handleChange("language")}
                    className={s.input}
                >
                    <option value="KOREAN">한국어</option>
                    <option value="ENGLISH">영어</option>
                    <option value="VIETNAMESE">베트남어</option>
                </select>

                {error && <p className={s.error}>{error}</p>}
                {success && <p className={s.success}>{success}</p>}

                <div className={s.buttonRow}>
                    <button type="submit" className={s.saveBtn}>
                        저장하기
                    </button>
                    <button
                        type="button"
                        className={s.exitBtn}
                        onClick={handleExit}
                    >
                        나가기
                    </button>
                </div>
            </form>
        </div>
    )
}