import LoginForm from "@/components/auth/LoginForm";
import * as L from "../styles/styledLogin";

function LoginPage() {
  // 1. 상태 관리: 이메일과 비밀번호
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 라우팅 처리를 위한 Hook (react-router-dom 사용 가정)
  const navigate = useNavigate(); 

  // 2. 이벤트 핸들러: 로그인 버튼 클릭 처리
  const handleLogin = (e) => {
    e.preventDefault();
    
    // TODO: 실제 API 호출 로직을 여기에 구현합니다.
    console.log('로그인 시도:', { email, password });
    
    // 예시: 로그인 성공 후 메인 페이지로 이동
    // if (로그인 성공) {
    //   navigate('/main');
    // } else {
    //   alert('로그인에 실패했습니다.');
    // }
  };
  
  // 3. 이벤트 핸들러: 회원가입 링크 클릭 처리
  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate('/register'); // RegisterPage로 이동
  };

  // 4. 이벤트 핸들러: Google 로그인 버튼 클릭 처리
  const handleGoogleLogin = () => {
    // TODO: Google OAuth 연동 로직을 여기에 구현합니다.
    console.log('Google 로그인 시도');
  };

  return (
    // L.Space: styledLogin.jsx에서 정의된 흰색 카드 컨테이너 스타일
    <L.Space>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>Communicare</h2>
      
      {/* 폼 제출 시 handleLogin 함수 실행 */}
      <form onSubmit={handleLogin} style={{ width: '100%' }}>
        {/* 이메일 입력 필드 */}
        <L.InputField
          type="email"
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        {/* 비밀번호 입력 필드 */}
        <L.InputField
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {/* 로그인 버튼 */}
        <L.MainButton type="submit">로그인</L.MainButton>
      </form>
      
      {/* "또는" 구분선 */}
      <p style={{ margin: '20px 0', color: '#888', fontSize: '14px' }}>
          또는
      </p>
      
      {/* Google 로그인 버튼 */}
      <L.SocialButton as="button" onClick={handleGoogleLogin}>
        {/*  실제로는 Google 아이콘을 넣습니다. */}
        G Google 계정으로 로그인
      </L.SocialButton>
      
      {/* 회원가입 링크 */}
      <L.FooterLink>
        계정이 없으신가요? 
        <a href="/register" onClick={handleRegisterClick}>회원가입</a>
      </L.FooterLink>
      
    </L.Space>
  );
}
//*export default function LoginPage() { return <LoginForm /> };

