import "../css/Header.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoImage from "../assets/logo.svg";
import uploadImg from "../assets/upload-img.svg";
import LogoutModal from "./LogoutModal";

const Header = () => {
    const nav = useNavigate();
    const { isLoggedIn, user } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // 권한이 ROLE_ADMIN인지 확인하는 함수
    const isAdmin = () => {
        if (!user || !user.authority) return false;
        // authority가 "[ROLE_ADMIN]" 형식이므로 문자열에 ROLE_ADMIN이 포함되어 있는지 확인
        return user.authority.includes("ROLE_ADMIN");
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
                환영합니다! {user?.username || "사용자"}님
            </span>
            <span className="auth-separator">|</span>
            <button
                className="auth-link"
                onClick={() => {
                    setIsLogoutModalOpen(true);
                }}
            >
                로그아웃
            </button>
            {isAdmin() && (
                <>
                    <button
                        className="photo-upload-button"
                        onClick={() => nav("/upload")}
                    >
                        <img src={uploadImg} alt="업로드 이미지 아이콘" />
                    </button>
                </>
            )}
        </div>
    );

    // "isLoggedIn" 상태에 따라 우측에 표시할 콘텐츠를 결정
    const rightChildContent = isLoggedIn ? userMenu : authButtons;

    return (
        <>
            <header className="Header">
                <div className="header-item left-child">
                    <img
                        className="logo-image"
                        src={logoImage}
                        alt="logo"
                        onClick={() => {
                            nav("/");
                        }}
                    />
                </div>
                <div className="header-item right-child">
                    {rightChildContent}
                </div>
            </header>
            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
            />
        </>
    );
};

export default Header;
