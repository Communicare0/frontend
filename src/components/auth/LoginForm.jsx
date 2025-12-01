
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import { login } from "@/services/authApi";
import s from "@styles/modules/auth/LoginForm.module.css";
//추가한 부분=====================================================================
import useAuth from "@/hooks/useAuth";
// setUser 사용하기 위해 import====================================================

import { setAccessToken } from "@/services/authToken";

export default function LoginForm() {
    const navigate = useNavigate();

    //추가한 부분==================================================================
    const { setUser } = useAuth();
    //로그인 성공 시 전역 상태 저장===================================================

    const [values, setValues] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (key) => (e) => {
        setValues((prev) => ({ ...prev, [key]: e.target.value }));
        setErrors((prev) => ({ ...prev, [key]: "" }));
        setGlobalError("");
    };

    const validate = () => {
        const newErrors = {};
        if (!values.email.trim()) newErrors.email = "이메일을 입력해주세요.";
        if (!values.password) newErrors.password = "비밀번호를 입력해주세요.";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if(Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; 
        }

        setLoading(true);
        try {
            const data = await login({
                email: values.email,
                password: values.password,
            });
            
            setAccessToken(data.accessToken);
            
            setUser({
                id: data.userId,
                email: data.email,
                nickname: data.nickname,
            });

            navigate("/", { replace: true });
        } catch (err) {
            console.error(err);
            setGlobalError(err.message || "서버 연결에 실패했습니다.");
        } finally {
            setLoading(false);
        }
        
        /* 기존의 코드
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const res = await login({
                email: values.email,
                password: values.password,
            });

            if (!res.ok) {
                const data = await res.json();
                setGlobalError(data.message || "로그인에 실패했습니다.");
            } else {
                //추가 및 변경===============================================================
                const data = await res.json();
                setUser(data.user);
                navigate("/", { replace: true });
                //백엔드로부터 사용자 정보 받아 전역상태 저장 -> 홈화면으로 이동=====================
            }
        } catch (err) {
            console.error(err);
            setGlobalError("서버 연결에 실패했습니다.");
        } finally {
            setLoading(false);
        }*/
    };

    const handleGoogleLogin = () => {
        console.log('Google OAuth 시작');
    };

    const handleRegisterClick = (e) => {
        e.preventDefault();
        navigate("/register");
    };

    // 추가한 부분================================================================
    const handleDevLogin = () => {
        setUser({
            id: 1,
            email: "dev@ajou.ac.kr",
            nickname: "DevUser",
            major: "Software",
            nation: "KR",
            studentId: "202500000",
        });

        navigate("/", { replace: true });
    };
    // 개발용 강제 로그인 버튼 -> 추후 반드시 제거======================================

    const googleIconPath = '/image/google_icon.svg';
    const dividerLinePath = '/image/Vector 1.svg';
    
    return (
        <form className={s.form} onSubmit={handleSubmit}>
            <h1 className={s.title}>Communicare</h1>

            {/* 이메일 필드 */}
            <Input
                name="email"
                type="email"
                placeholder="example@ajou.ac.kr"
                value={values.email}
                onChange={handleChange("email")}
                className={s.input}
            />
            <FormError message={errors.email} />

            {/* 비밀번호 필드 */}
            <Input
                name="password"
                type="password"
                placeholder="********"
                value={values.password}
                onChange={handleChange("password")}
                className={s.input}
            />
            <FormError message={errors.password} />

            <FormError message={globalError} />

            <Button type="submit" className={s.submitBtn} disabled={loading}>
                {loading ? "로그인 중..." : "로그인"}
            </Button>

            <div className={s.dividerContainer}>
                <img src={dividerLinePath} alt="Divider line" className={s.dividerLine} />
                <p className={s.dividerText}>또는</p>
                <img src={dividerLinePath} alt="Divider line" className={s.dividerLine} />
            </div>

            <Button type="button" className={s.socialBtn} onClick={handleGoogleLogin}>
                <img src={googleIconPath} alt="Google logo" style={{ width: '18px', height: '18px' }} />
                Google 계정으로 로그인
            </Button>

            <p className={s.footerText}>
                계정이 없으신가요?{" "}
                <a
                    href="/register"
                    className={s.link}
                    onClick={handleRegisterClick}
                >
                    회원가입
                </a>
            </p>

            {/* 추가한 부분 =======================================================================*/}
            <Button 
                type="button"
                className={s.socialBtn}
                onClick={handleDevLogin}
                style={{ marginTop: "12px", background: "#ddd" }}
            >
                (개발용) 로그인 없이 홈으로 이동
            </Button>
            {/* 개발용 강제 로그인 버튼 -> 백엔드 연동 후 반드시 제거 =======================================*/}
        </form>
    );
}

/*1*/