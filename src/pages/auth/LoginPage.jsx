import LoginForm from '../../components/auth/LoginForm';
import s from '../../styles/modules/auth/LoginPage.module.css';

export default function LoginPage() {
     return (
        <div className={s.container}>
            <LoginForm />
        </div>
     );
}



