import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { update } from "@/services/authApi";
import { fetchMyData } from "@/services/mypageApi";

import s from "@styles/modules/mypage/UpdateUserInfoPage.module.css";

export default function UpdateUserInfoPage(){

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
        if(ok) {
            navigate("/mypage");
        }
    }

    if(loading) {
        return <div className={s.updatepageLayer}>불러오는 중...</div>
    }

    return (
        <div className={s.updatepageLayer}>
            <form className={s.form} onSubmit={handleSubmit}>
                
                <label className={s.label}>학과</label>
                <input
                    type="text"
                    value={form.department}
                    onChange={handleChange("department")}
                    className={s.input}
                />

                <label className={s.label}>학번</label>
                <input
                    type="text"
                    value={form.studentId}
                    onChange={handleChange("studentId")}
                    className={s.input}
                    placeholder="예: 20230001"
                />
                
                <label className={s.label}>국적</label>
                <select
                    value={form.nationality}
                    onChange={handleChange("nationality")}
                    className={s.input}
                >
                    <option value="KOREAN">한국</option>
                    <option value="VIETNAMESE">베트남</option>
                    <option value="CHINESE">중국</option>
                    <option value="MYANMARESE">미얀마</option>
                    <option value="JAPANESE">일본</option>
                    <option value="INDONESIAN">인도네시아</option>
                    <option value="MALAYSIAN">말레이시아</option>
                    <option value="EMIRATIS">아랍에미리트</option>
                </select>
                
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