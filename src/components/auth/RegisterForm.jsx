import { useMemo, useState } from "react";
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

  const ajouOk = useMemo(() => /^[\w.+-]+@ajou\.ac\.kr$/i.test(values.email), [values.email]);
  
  const onChange = (k) => (e) => {
    setValues(v => ({ ...v, [k]: e.target.value }));
    setErrors(fe => ({ ...fe, [k]: "" }));
    setGlobalError("");
  };

  // 간단한 클라이언트 검증
  const validate = () => {
    const newErrors = {};
    if (!values.name.trim())
      newErrors.name = "이름을 입력하세요.";
    if (!values.email.trim())
      newErrors.email = "이메일을 입력하세요.";
    else if (!ajouOk)
      newErrors.email = "아주대학교 이메일만 사용 가능합니다.";
    if (values.password.length < 8)
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    if (values.password !== values.passwordConfirm)
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";

    return newErrors;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    try {
      await register({ name: values.name.trim(), email: values.email.trim(), password: values.password });
      navigate("/login", { replace:true });
    } catch (err) {
      setGlobalError(err.message || "회원가입 실패");
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate("/login");
  }

  return (
    <form className={s.form} onSubmit={handleSubmit} noValidate>
      <img src="/image/Logo.png" className={s.logo}/>
      <h1 className={s.title}>Communicare</h1>

      <label className={s.label}>이름</label>
      <Input
        name="name"
        placeholder="홍길동"
        value={values.name}
        onChange={onChange("name")}
        className={s.input}
      />
      <FormError message={errors.name} />

      <label className={s.label}>아주대학교 이메일</label>
      
      <Input
        name="email"
        type="email"
        placeholder="example@ajou.ac.kr"
        value={values.email}
        onChange={onChange("email")}
        className={s.input}
      />
      <FormError message={errors.email} />

      <label className={s.label}>비밀번호 (8자 이상)</label>
      <Input
        name="password"
        type="password"
        value={values.password}
        onChange={onChange("password")}
        className={s.input}
      />
      <FormError message={errors.password} />

      <label className={s.label}>비밀번호 확인</label>
      <Input
        name="passwordConfirm"
        type="password"
        value={values.passwordConfirm}
        onChange={onChange("passwordConfirm")}
        className={s.input}
      />
      <FormError message={errors.passwordConfirm} />

      <FormError message={globalError} />

      <Button type="submit" className={s.submitBtn}>
        회원가입
      </Button>

      <p className={s.footerText}>
        이미 계정이 있으신가요?{" "}
        <a href="/login" className={s.link} onClick={handleLoginClick}>로그인</a>
      </p>
    </form>
  );
}
