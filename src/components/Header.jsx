import "../css/Header.css";
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import logoImage from "../assets/logo.svg";
import uploadImg from "../assets/upload-img.svg";

const Header = () => {
    const nav = useNavigate();
    const { isLoggedIn, user, logout } = useAuth();

    // 권한이 ROLE_ADMIN인지 확인하는 함수
    const isAdmin = () => {
        if (!user || !user.authority) return false;
        // authority가 "[ROLE_ADMIN]" 형식이므로 문자열에 ROLE_ADMIN이 포함되어 있는지 확인
        return user.authority.includes("ROLE_ADMIN");
    };

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
                환영합니다! {user?.username || "사용자"}님
            </span>
            <span className="auth-separator">|</span>
            <button className="auth-link" onClick={handleLogout}>
                로그아웃
            </button>
            {isAdmin() && (
                <>
                    <button
                        className="photo-upload-button"
                        onClick={() => nav("/admin")}
                    >
                        <img
                            src={uploadImg}
                            onClick={() => {
                                nav("/upload");
                            }}
                        />
                    </button>
                </>
            )}
        </div>
    );

    // "isLoggedIn" 상태에 따라 우측에 표시할 콘텐츠를 결정
    const rightChildContent = isLoggedIn ? userMenu : authButtons;

    return (
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
            <div className="header-item right-child">{rightChildContent}</div>
        </header>
    );
};

export default Header;
