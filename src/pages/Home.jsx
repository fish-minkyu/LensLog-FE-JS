import "../css/Home.css";
import Header from "../components/Header";
import logoImage from "../assets/logo.svg";
import { useAuth } from "../context/AuthContext";
import { Link, replace, useNavigate } from "react-router-dom";
import Category from "../components/Category";
import Scroll from "../components/Scroll";
import axios from "axios";

const Home = () => {
    const nav = useNavigate();
    const { isLoggedIn, username, logout } = useAuth();

    const handleLogout = async () => {
        try {
            // HttpOnly 속성이 설정된 쿠키의 정보들을 직접 지울 수 없다.
            await axios.post("http://localhost:8080/api/auth/logout");
            logout();
        } catch (error) {
            console.error("로그아웃 실패", error);
            nav("/", { replace: true });
        }
    };

    // 로그인 안된 경우 로그인, 회원가입 버튼 컴포넌트
    const authButtons = (
        <div className="auth-links">
            <Link className="auth-link" to="/login">
                로그인
            </Link>
            <span className="auth-separator">|</span>
            <Link className="auth-link" to="/register">
                회원가입
            </Link>
        </div>
    );

    const userMenu = (
        <div className="auth-links">
            <span className="welcome-message">
                환영합니다! {username || "사용자"}님
            </span>
            <span className="auth-separator">|</span>
            <button className="auth-link" onClick={handleLogout}>
                로그아웃
            </button>
        </div>
    );

    const rightChildContent = isLoggedIn ? userMenu : authButtons;

    return (
        <div className="Home">
            <Header
                leftChild={
                    <img className="logo-image" src={logoImage} alt="logo" />
                }
                rightChild={rightChildContent}
            />
            <div className="body-container">
                <Category />
                <Scroll />
            </div>
        </div>
    );
};

export default Home;
