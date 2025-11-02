import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import { register } from "@/services/authApi";
import s from "@styles/modules/auth/RegisterForm.module.css";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  // 인풋 변경 핸들러
  const handleChange = (key) => (e) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setGlobalError("");
  };

  // 간단한 클라이언트 검증
  const validate = () => {
    const newErrors = {};
    if (!values.name.trim()) newErrors.name = "이름을 입력하세요.";
    if (!values.email.match(/^[\w.+-]+@ajou\.ac\.kr$/))
      newErrors.email = "아주대학교 이메일만 사용 가능합니다.";
    if (values.password.length < 8)
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    if (values.password !== values.passwordConfirm)
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    return newErrors;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      // fetch에서 status 확인
      if (!res.ok) {
        const data = await res.json();
        setGlobalError(data.message || "회원가입 실패");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setGlobalError("서버와의 연결에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <h1 className={s.title}>Communicare</h1>

      <label className={s.label}>이름</label>
      <Input
        name="name"
        placeholder="홍길동"
        value={values.name}
        onChange={handleChange("name")}
        className={s.input}
      />
      <FormError message={errors.name} />

      <label className={s.label}>아주대학교 이메일</label>
      <div className={s.row}>
        <Input
          name="email"
          type="email"
          placeholder="example@ajou.ac.kr"
          value={values.email}
          onChange={handleChange("email")}
          className={s.input}
        />
        <Button type="button" className={s.verifyBtn} disabled>
          인증
        </Button>
      </div>
      <FormError message={errors.email} />

      <label className={s.label}>비밀번호 (8자 이상)</label>
      <Input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange("password")}
        className={s.input}
      />
      <FormError message={errors.password} />

      <label className={s.label}>비밀번호 확인</label>
      <Input
        name="passwordConfirm"
        type="password"
        value={values.passwordConfirm}
        onChange={handleChange("passwordConfirm")}
        className={s.input}
      />
      <FormError message={errors.passwordConfirm} />

      <FormError message={globalError} />

      <Button type="submit" className={s.submitBtn} disabled={loading}>
        {loading ? "처리 중..." : "회원가입"}
      </Button>

      <p className={s.footerText}>
        이미 계정이 있으신가요?{" "}
        <a href="/login" className={s.link}>로그인</a>
      </p>
    </form>
  );
}
