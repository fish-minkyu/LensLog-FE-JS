import "../css/Sample.css";
import Button from "../components/Button";
import { useState } from "react";

const Sample = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        // 실제 로그인 로직은 추후 연동
        alert(`email: ${email}\npassword: ${password}`);
    };

    return (
        <div className="Login">
            <div className="logo">로고</div>

            <div className="form">
                <div className="field underline">
                    <input
                        id="email"
                        type="email"
                        className="input"
                        placeholder=" "
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="fieldLabel" htmlFor="email">
                        Email
                    </label>
                </div>

                <div className="field underline passwordField">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="input"
                        placeholder=" "
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="fieldLabel" htmlFor="password">
                        Password
                    </label>
                    <button
                        type="button"
                        aria-label="비밀번호 보기"
                        className="eyeBtn"
                        onClick={() => setShowPassword((v) => !v)}
                    >
                        {/* 눈 아이콘 (SVG) */}
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
                                fill="currentColor"
                            />
                            <circle cx="12" cy="12" r="2.5" fill="#fff" />
                        </svg>
                    </button>
                </div>

                <Button text="로그인" onClick={handleLogin} />

                <div className="links">
                    <button type="button">아이디 찾기</button>
                    <span className="dot">|</span>
                    <button type="button">비밀번호 찾기</button>
                    <span className="dot">|</span>
                    <button type="button">회원가입</button>
                </div>
            </div>

            <hr className="divider" />

            <div className="socialRow">
                <button className="social kakao" aria-label="카카오로 로그인">
                    <span className="emoji">K</span>
                </button>
                <button className="social google" aria-label="구글로 로그인">
                    <span className="emoji">G</span>
                </button>
                <button className="social naver" aria-label="네이버로 로그인">
                    <span className="emoji">N</span>
                </button>
            </div>
        </div>
    );
};

export default Sample;
