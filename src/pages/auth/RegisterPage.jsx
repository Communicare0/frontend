import RegisterForm from "@/components/auth/RegisterForm";
import s from "./RegisterPage.module.css";

export default function RegisterPage() {
    return (
        <div className={s.screen}>
            <RegisterForm />
        </div>
    );
}