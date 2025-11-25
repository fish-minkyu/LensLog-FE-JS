import "../css/ResetPasswordPage.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import eyeOpen from "../assets/open-eye-gray.svg";
import eyeClosed from "../assets/closed-eye.svg";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// 비밀번호 변경 페이지(비밀번호를 모르고 있는 경우)
const ResetPasswordPage = () => {
    // 비밀번호 변경 폼의 상태 관리
    const [newPassword1, setNewPassword1] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // 비밀번호 visible
    const [passwordVisible1, setPasswordVisible1] = useState(false);
    const [passwordVisible2, setPasswordVisible2] = useState(false);

    // 에러 메시지 상태
    const [password1ErrorMsg, setPassword1ErrorMsg] = useState("");
    const [password2ErrorMsg, setPassword2ErrorMsg] = useState("");

    // FindPasswordPage에서 navigate에서 넘겨준 state 받기
    const location = useLocation();
    const state = location.state || {};
    const username = state.username || {};
    const email = state.email || {};

    const nav = useNavigate();

    // recaptcha가 준비되었는지 상태를 관리하는 ref
    const recaptchaReady = useRef(false);

    // ReCAPTCHA 스크립트를 동적으로 로드하는 useEffect
    useEffect(() => {
        const scriptId = "recaptcha-script";
        const existingScript = document.getElementById(scriptId);

        if (existingScript) {
            if (window.grecaptcha && window.grecaptcha.ready) {
                window.grecaptcha.ready(() => {
                    console.log("ReCAPTCHA ready (cached script).");
                    recaptchaReady.current = true;
                });
            }
            return;
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (window.grecaptcha) {
                window.grecaptcha.ready(() => {
                    recaptchaReady.current = true;
                });
            }
        };
    }, []);

    // 비밀번호 유효성 검사 정규식
    // 최소 8자, 영문 대문자 1개 이상, 득수문자 1개 이상
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    // 비밀번호 유효성 검사
    const validatePassword = (pwd) => {
        if (!pwd) {
            return "비밀번호: 필수정보입니다.";
        }
        if (!passwordRegex.test(pwd)) {
            return "비밀번호: 최소 8자의 영문 대/소문자, 숫자, 특수문자를 사용해주세요.";
        }

        return "";
    };

    // ------------- 핸들러 -------------
    const handlePassword1Change = (e) => {
        setNewPassword1(e.target.value);
        if (password1ErrorMsg) {
            setPassword1ErrorMsg("");
        }
    };
    const handlePassword1Blur = () => {
        const message = validatePassword(newPassword1);
        setPassword1ErrorMsg(message);
    };

    const handlePassword2Change = (e) => {
        setNewPassword2(e.target.value);
        if (password2ErrorMsg) {
            setPassword2ErrorMsg("");
        }
    };
    const handlePassword2Blur = () => {
        const message = validatePassword(newPassword2);
        setPassword2ErrorMsg(message);
    };

    // 비밀번호 변경 요청 함수
    const onClickSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // 메시지 초기화
        setLoading(true);

        // 클라이언트 측 유효성 검사
        if (!newPassword1 || !newPassword2) {
            setMessage("모든 비밀번호 필드를 입력해주세요.");
            setLoading(false);
            return;
        }

        if (newPassword1 !== newPassword2) {
            setMessage("비밀번호가 일치하지 않습니다.");
            setLoading(false);
            return;
        }

        try {
            if (!window.grecaptcha) {
                throw new Error("Recaptcha 객체가 로드되지 않았습니다.");
            }

            // ReCAPTCHA API가 아직 준비되지 않았다면 사용자에게 알리고 재시도를 유도합니다.
            if (!recaptchaReady.current) {
                setMessage(
                    "보안 인증(ReCAPTCHA) 서비스 준비 중입니다. 잠시 후 다시 시도해주세요."
                );
                setLoading(false);
                return;
            }

            // reCAPTCHA 객체와 execute 메서드 존재 여부 최종 확인
            if (!window.grecaptcha) {
                throw new Error("Recaptcha 객체가 로드되지 않았습니다.");
            }

            // 2. ready 함수 안에서 execute 실행 (Promise로 감싸서 처리)
            const recaptchaToken = await new Promise((resolve, reject) => {
                window.grecaptcha.ready(async () => {
                    try {
                        const token = await window.grecaptcha.execute(
                            RECAPTCHA_SITE_KEY,
                            {
                                action: "change_password",
                            }
                        );
                        resolve(token);
                    } catch (err) {
                        // 여기서 "No clients" 등의 구체적인 에러가 잡힘
                        reject(err);
                    }
                });
            });

            // 백엔드로 보낼 데이터 객체 구성
            const requestBody = {
                username,
                email,
                provider: "local",
                changePassword1: newPassword1,
                changePassword2: newPassword2,
                recaptchaResponse: recaptchaToken,
            };

            // 백엔드 API 호출
            const response = await axios.put(
                "http://localhost:8080/api/auth/change/password",
                requestBody,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // 요청 성공 시
            nav("/result/password", { replace: true });
        } catch (error) {
            console.error("비밀번호 변경 오류: ", error);
            if (axios.isAxiosError(error) && error.response) {
                setMessage(
                    `오류: ${
                        error.response.data.message ||
                        error.response.data ||
                        "서버 응답 오류"
                    }`
                );
            } else {
                setMessage(
                    `오류: ${
                        error.message || "알 수 없는 오류가 발생했습니다."
                    }`
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ResetPasswordPage">
            <Header />
            <div className="content-wrapper">
                <div className="content-header">
                    <h2>비밀번호 변경</h2>
                    <ul className="password-guidelines">
                        <li>
                            <span className="highlight">
                                다른 아이디/사이트에서 사용한 적 없는 비밀번호
                            </span>
                        </li>
                        <li>
                            <span className="highlight">
                                이전에 사용한 적 없는 비밀번호
                            </span>
                            가 안전합니다.
                        </li>
                    </ul>
                </div>

                <div className="input-wrapper">
                    <div className="input-group">
                        <input
                            id="password1"
                            className={password1ErrorMsg ? "input-error" : ""}
                            type={passwordVisible1 ? "text" : "password"}
                            onChange={handlePassword1Change}
                            onBlur={handlePassword1Blur}
                            required
                        />
                        <label
                            htmlFor="password1"
                            className={
                                password1ErrorMsg ? "input-error-label" : ""
                            }
                        >
                            새 비밀번호
                        </label>
                        <img
                            className="password-visible-icon"
                            src={passwordVisible1 ? eyeOpen : eyeClosed}
                            alt={
                                passwordVisible1
                                    ? "비밀번호 숨기기"
                                    : "비밀번호 보이기"
                            }
                            onClick={() => {
                                setPasswordVisible1(!passwordVisible1);
                            }}
                        />
                    </div>
                    {password1ErrorMsg && (
                        <p className="error-message">{password1ErrorMsg}</p>
                    )}
                    <div className="input-group">
                        <input
                            id="password2"
                            className={password2ErrorMsg ? "input-error" : ""}
                            type={passwordVisible2 ? "text" : "password"}
                            onChange={handlePassword2Change}
                            onBlur={handlePassword2Blur}
                            required
                        />
                        <label
                            htmlFor="password2"
                            className={
                                password2ErrorMsg ? "input-error-label" : ""
                            }
                        >
                            새 비밀번호 확인
                        </label>
                        <img
                            className="password-visible-icon"
                            src={passwordVisible2 ? eyeOpen : eyeClosed}
                            alt={
                                passwordVisible2
                                    ? "비밀번호 숨기기"
                                    : "비밀번호 보이기"
                            }
                            onClick={() => {
                                setPasswordVisible2(!passwordVisible2);
                            }}
                        />
                    </div>
                    {password2ErrorMsg && (
                        <p className="error-message">{password2ErrorMsg}</p>
                    )}
                </div>

                {message && (
                    <div>
                        <span>{message}</span>
                    </div>
                )}
                <button className="confirm-button" onClick={onClickSubmit}>
                    확인
                </button>
                <button
                    className="cancel-button"
                    onClick={() => {
                        nav("/", { replace: true });
                    }}
                >
                    취소
                </button>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
