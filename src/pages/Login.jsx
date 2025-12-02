import "../css/Login.css";
import axios from "axios";
import API_ENDPOINTS from "../constants/api";
import Button from "../components/Button";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import kakao from "../assets/social-kakao.svg";
import google from "../assets/social-google.svg";
import naver from "../assets/social-naver.svg";
import eyeOpen from "../assets/open-eye.svg";
import eyeClosed from "../assets/closed-eye.svg";
import LogoHeader from "../components/LogoHeader";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const nav = useNavigate();
    const { login } = useAuth();

    // 1. 이메일 입력 필드의 값이 변경될 때 호출될 핸들러
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        setErrorMessage("");
    };

    // 2. 비밀번호 입력 필드의 값이 변경될 때 호출될 핸들러
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setErrorMessage("");
    };

    const onClickLogin = async () => {
        try {
            if (!username) {
                setErrorMessage("아이디를 입력해주세요.");
                return;
            }

            if (!password) {
                setErrorMessage("비밀번호를 입력해주세요.");
                return;
            }

            const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
                username: username,
                password: password,
            });

            if (response.status === 200) {
                const userData = response.data;
                login(userData);

                nav("/", { replace: true });
            }
        } catch (error) {
            console.error("로그인 에러:", error);
            if (error.response && error.response.status === 401) {
                setErrorMessage("아이디 또는 비밀번호가 잘못 되었습니다.");
            } else {
                setErrorMessage(
                    "로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
                );
            }
        }
    };

    const handleKakaoLogin = () => {
        window.location.href = API_ENDPOINTS.SOCIAL_LOGIN.KAKAO;
    };

    const handleGoogleLogin = () => {
        window.location.href = API_ENDPOINTS.SOCIAL_LOGIN.GOOGLE;
    };

    const handleNaverLogin = () => {
        window.location.href = API_ENDPOINTS.SOCIAL_LOGIN.NAVER;
    };

    return (
        <div className="Login">
            <LogoHeader />
            <div className="login-form">
                <div className="input-group">
                    <input
                        id="username"
                        className="input"
                        type="text"
                        placeholder=" "
                        onChange={handleUsernameChange}
                        required
                    />
                    <label htmlFor="username">ID</label>
                </div>

                <div className="input-group">
                    <input
                        id="password"
                        className="input"
                        type={passwordVisible ? "text" : "password"}
                        placeholder=" "
                        onChange={handlePasswordChange}
                    />
                    <label htmlFor="password">Password</label>
                    <img
                        className="password-visible-icon"
                        src={passwordVisible ? eyeOpen : eyeClosed}
                        alt={
                            passwordVisible
                                ? "비밀번호 숨기기"
                                : "비밀번호 보이기"
                        }
                        onClick={() => {
                            setPasswordVisible(!passwordVisible);
                        }}
                    />
                </div>

                {errorMessage && (
                    <div className="error-message">{errorMessage}</div>
                )}

                <Button type={"LOGIN"} text={"로그인"} onClick={onClickLogin} />

                <div className="link-button">
                    <Link to={"/find/id"}>아이디 찾기</Link>
                    <span className="separator">|</span>
                    <Link to={"/find/password"}>비밀번호 찾기</Link>
                    <span className="separator">|</span>
                    <Link to={"/register"}>회원가입</Link>
                </div>
            </div>

            <hr className="underline" />

            <div className="social-login">
                <button className="social-button" onClick={handleKakaoLogin}>
                    <img src={kakao} alt="카카오 로그인" />
                </button>
                <button className="social-button" onClick={handleGoogleLogin}>
                    <img src={google} alt="구글 로그인" />
                </button>
                <button className="social-button" onClick={handleNaverLogin}>
                    <img src={naver} alt="네이버 로그인" />
                </button>
            </div>
        </div>
    );
};

export default Login;
