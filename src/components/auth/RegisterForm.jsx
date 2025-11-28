import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import { register } from "@/services/authApi";
import s from "@styles/modules/auth/RegisterForm.module.css";

const requestEmailCode = async (/*email*/) => {
  await new Promise(r => setTimeout(r, 400));
  return { ok: true }; // 테스트용
  // return api("auth/email/send-code", { method:"POST", body: JSON.stringify({ email }) });
};

const verifyEmailCode = async ({ /*email,*/ code }) => {
  await new Promise(r => setTimeout(r, 400));
  if(code === "123456") return { ok: true }; // 테스트용
  const e = new Error("인증 코드가 올바르지 않습니다.");
  e.status = 400;
  throw e;
  // return api("/auth/email/verify", { method: "POST", body: JSON.stringify({ email, code }) });
};

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
  
  //이메일 인증 관련
  const [emailState, setEmailState] = useState("idle"); // idle|sending|codeSent|verifying|verified|expired|error
  const [timerSec, setTimerSec] = useState(0);
  const [emailCode, setEmailCode] = useState("");
  const timerRef = useRef(null);

  const ajouOk = useMemo(() => /^[\w.+-]+@ajou\.ac\.kr$/i.test(values.email), [values.email]);
  const canSend = ajouOk && (emailState === "idle" || emailState === "expired" || emailState === "error");

  const onChange = (k) => (e) => {
    setValues(v => ({ ...v, [k]: e.target.value }));
    setErrors(fe => ({ ...fe, [k]: "" }));
    setGlobalError("");
    if(k === "email" && emailState !== "idle" && emailState !== "verified") {
      clearInterval(timerRef.current);
      setTimerSec(0);
      setEmailState("idle");
      setEmailCode("");
    }
  };

  //타이머
  useEffect(() => {
    if(emailState !== "codeSent") return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimerSec((t) => {
        if(t <= 1) {
          clearInterval(timerRef.current);
          setEmailState("expired");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [emailState]);

  const mmss = useMemo(() => {
    const m = String(Math.floor(timerSec / 60)).padStart(1, "0");
    const s = String(timerSec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }, [timerSec]);

  const handleSendCode = async () => {
    if(!canSend) return;
    try {
      setEmailState("sending");
      await requestEmailCode(values.email);
      setEmailState("codeSent");
      setTimerSec(180);
    } catch (e) {
      setEmailState("error");
      setGlobalError(e.message || "인증 코드 전송 실패");
    };
  }

  const handleVerifyCode = async () => {
    if(emailCode.trim().length < 6) return;
     try {
      setEmailState("verifying");
      await verifyEmailCode({ email: values.email, code: emailCode.trim() });
      clearInterval(timerRef.current);
      setEmailState("verified");
      setTimerSec(0);
    } catch (e) {
      setEmailState("codeSent");
      setGlobalError(e.message || "인증 실패");
    }
  }

  // 간단한 클라이언트 검증
  const validate = () => {
    const newErrors = {};
    if (!values.name.trim())
      newErrors.name = "이름을 입력하세요.";
    if (!ajouOk)
      newErrors.email = "아주대학교 이메일만 사용 가능합니다.";
    if (values.password.length < 8)
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    if (values.password !== values.passwordConfirm)
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    if (emailState !== "verified")
      newErrors.email = (newErrors.email || "이메일 인증이 필요합니다.");
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
      <div className={s.row}>
        <Input
          name="email"
          type="email"
          placeholder="example@ajou.ac.kr"
          value={values.email}
          onChange={onChange("email")}
          className={`${s.input} ${s.flex1} ${emailState === "verified" ? s.inputOk : ""}`}
          disabled={emailState === "verified"}
        />
        {emailState === "codeSent" && <div className={s.timerBox}>{mmss}</div>}
        {(emailState !== "codeSent" && emailState !== "verified") && (
          <Button type="button" className={s.verifyBtn} onClick={handleSendCode} disabled={!canSend}>
            인증
          </Button>
        )}
        {emailState === "verified" && <div className={s.verifiedBadge} aria-label="verified" />}
      </div>
      <FormError message={errors.email} />

      {/* 인증 코드 박스 (codeSent / error / expired 에서 노출) */}
      {(emailState === "codeSent" || emailState === "error" || emailState === "expired") && (
        <div className={s.noticeBox}>
          <div className={s.noticeHead}>
            <span className={s.mailIcon} /> 인증 코드가 전송되었습니다
          </div>
          <div className={s.codeRow}>
            <Input
              name="code"
              placeholder="6자리 코드 입력"
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value)}
              className={`${s.input} ${s.flex1}`}
              maxLength={6}
            />
            <Button type="button" className={s.codeConfirmBtn} onClick={handleVerifyCode} disabled={emailCode.length < 6}>
              확인
            </Button>
          </div>
          {emailState === "expired" && <div className={s.inlineError}>인증 코드가 만료되었습니다. 다시 전송해주세요</div>}
        </div>
      )}

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

      <Button type="submit" className={s.submitBtn} disabled={emailState !== "verified"}>
        회원가입
      </Button>

      <p className={s.footerText}>
        이미 계정이 있으신가요?{" "}
        <a href="/login" className={s.link} onClick={handleLoginClick}>로그인</a>
      </p>
    </form>
  );
}
