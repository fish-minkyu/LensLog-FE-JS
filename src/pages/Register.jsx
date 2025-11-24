import "../css/Register.css";
import { useEffect, useState } from "react";
import LogoHeader from "../components/LogoHeader";
import eyeOpen from "../assets/open-eye-gray.svg";
import eyeClosed from "../assets/closed-eye-gray.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    // 상태 관리
    const [username, setUsername] = useState(""); // 아이디
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [verifyCode, setVerifyCode] = useState("");
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

    // 비밀번호 visible
    const [passwordVisible, setPasswordVisible] = useState(false);

    // 에러 메시지 상태
    const [usernameErrorMsg, setUsernameErrorMsg] = useState("");
    const [nameErrorMsg, setNameErrorMsg] = useState("");
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
    const [emailErrorMsg, setEmailErrorMsg] = useState("");

    // 인증 요청 상태
    // 버튼 상태, false: 인증 요청, true: 가입하기
    const [isVerifiedRequested, setIsVerifiedRequested] = useState(false);

    const nav = useNavigate();

    // 타이머 상태(초 단위, 300초)
    const [timeLeft, setTimeLeft] = useState(300);

    // 타이머 로직: 인증 요청 상태이고 시간이 남아있을 때 작동
    useEffect(() => {
        let timerId;
        if (isVerifiedRequested && timeLeft > 0) {
            timerId = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft == 0) {
            // 시간이 다 되었을 때의 로직
            clearInterval(timerId);
        }

        return () => clearInterval(timerId);
    }, [isVerifiedRequested, timeLeft]);

    // 필수 정보 검사 함수
    const validateRequired = (value, fieldName) => {
        return value.trim() === "" ? `${fieldName}: 필수정보입니다.` : "";
    };

    // 시간을 MM:SS 형식으로 변환하는 함수
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `0${minutes} : ${
            remainingSeconds < 10 ? "0" : ""
        }${remainingSeconds}`;
    };

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

    // -------------- 핸들러 --------------
    // 핸들러: 아이디
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        setUsernameErrorMsg(""); // 입력 시 에러 메시지 숨김
    };
    const handleUsernameBlur = () => {
        const message = validateRequired(username, "아이디");
        setUsernameErrorMsg(message); // 포커스 해제 시 검사
    };

    // 핸들러: 이름
    const handleNameChange = (e) => {
        setName(e.target.value);
        setNameErrorMsg(""); // 입력 시 에러 메시지 숨김
    };
    const handleNameBlur = () => {
        const message = validateRequired(name, "이름");
        setNameErrorMsg(message);
    };

    // 핸들러: 비밀번호
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (passwordErrorMsg) {
            setPasswordErrorMsg("");
        }
    };
    const handlePasswordBlur = () => {
        const message = validatePassword(password);
        setPasswordErrorMsg(message);
    };

    // 핸들러: 이메일
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailErrorMsg("");
        // 이메일 변경 시 인증 상태 초기화
        if (isVerifiedRequested) {
            setIsVerifiedRequested(false);
        }
    };
    const handleEmailBlur = () => {
        const message = validateRequired(email, "이메일");
        setEmailErrorMsg(message);
    };

    // ------------- 요청 함수 -------------
    // 인증 요청
    const handleRequestVerification = async () => {
        if (email.trim() === "") {
            setEmailErrorMsg("이메일: 필수정보입니다.");
            return;
        }

        setIsLoading(true); // 로딩 시작

        try {
            await axios.post("http://localhost:8080/api/mail/send", { email });
            setIsVerifiedRequested(true);
        } catch (error) {
            console.error("인증 메일 발송 실패: ", error);
        } finally {
            setIsLoading(false); // 로딩 종료 (성공 / 실패 모두)
        }
    };

    // 회원가입 요청
    const handleSignUp = async () => {
        // 모든 필드에 대해 마지막 유효성 검사 수행
        const finalUsernameError = validateRequired(username, "아이디");
        const finalNameError = validateRequired(name, "이름");
        const finalPasswordError = validatePassword(password);
        const finalEmailError = validateRequired(email, "이메일");

        setUsernameErrorMsg(finalUsernameError);
        setNameErrorMsg(finalNameError);
        setPasswordErrorMsg(finalPasswordError);
        setEmailErrorMsg(finalEmailError);

        // 인증번호 입력 확인
        if (
            finalUsernameError ||
            finalNameError ||
            finalPasswordError ||
            finalEmailError ||
            verifyCode.trim() === ""
        ) {
            console.error(
                "모든 필수 정보를 올바르게 입력하고 인증번호를 확인해주세요."
            );
            return;
        }

        setIsLoading(true); // 로딩 시작

        const userDto = {
            username,
            name,
            password,
            email,
            provider: "local",
            authority: "ROLE_USER",
            verifyCode,
        };

        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/join",
                userDto
            );
            nav("/result/register", { replace: true });
        } catch (error) {
            console.error("회원가입 실패: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 버튼 클릭 핸들러(버튼 텍스트에 따라 호출 함수 분기)
    const handleButtonClick = () => {
        if (!isVerifiedRequested) {
            // 1. 모든 필드에 대해 즉시 유효성 검사 수행 및 에러 메시지 업데이트
            const usernameValid = validateRequired(username, "아이디") === "";
            const nameValid = validateRequired(name, "이름") === "";
            const passwordValid = validatePassword(password) === "";
            const emailValid = validateRequired(email, "이메일") === "";

            setUsernameErrorMsg(
                usernameValid ? "" : validateRequired(username, "아이디")
            );
            setNameErrorMsg(nameValid ? "" : validateRequired(name, "이름"));
            setPasswordErrorMsg(
                passwordValid ? "" : validatePassword(password)
            );
            setEmailErrorMsg(
                emailValid ? "" : validateRequired(email, "이메일")
            );

            // 2. 모든 필드가 유효하면 인증 요청
            if (usernameValid && nameValid && passwordValid && emailValid) {
                handleRequestVerification();
            }
        } else {
            handleSignUp();
        }
    };

    // ------------ 에러 메시지 렌더링 준비 ------------
    // 아이디, 이름, 비밀번호, 에러 메시지 수집
    const userInfoErrors = [
        usernameErrorMsg,
        nameErrorMsg,
        passwordErrorMsg,
    ].filter(Boolean);

    // 이메일 에러 메시지 수집
    const emailErrors = [emailErrorMsg].filter(Boolean);

    // ------------ 버튼 활성화 조건 ------------
    // 가입하기 버튼 활성화 조건
    const isSignUpEnabled =
        isVerifiedRequested &&
        username.trim() !== "" &&
        name.trim() !== "" &&
        password.trim() !== "" &&
        email.trim() !== "" &&
        verifyCode.trim() !== "" &&
        !userInfoErrors.length &&
        !emailErrors.length;

    const buttonText = isVerifiedRequested ? "가입하기" : "인증 요청";

    // 인증 요청 버튼 활성화 조건 (필수 필드가 모두 채워지고 현재 에러가 없어야 함)
    const isRequestEnabled =
        username.trim() !== "" &&
        name.trim() !== "" &&
        password.trim() !== "" &&
        email.trim() !== "" &&
        !userInfoErrors.length &&
        !emailErrors.length;

    // 최종 버튼 비활성화 조건: 로딩 중이거나, 로딩 중이 아니면서 버튼이 활성화될 조건을 충족하지 못한 경우
    const isButtonDisabled =
        isLoading ||
        (isVerifiedRequested && !isSignUpEnabled) ||
        (!isVerifiedRequested && !isRequestEnabled);

    return (
        <>
            <div className="Register">
                <LogoHeader />

                <div className="user-info-wrapper">
                    {/* 아이디 입력 그룹 */}
                    <div className="input-group">
                        <div className="input-container">
                            <input
                                id="id"
                                value={username}
                                className={
                                    usernameErrorMsg ? "input-error" : ""
                                }
                                onBlur={handleUsernameBlur}
                                onChange={handleUsernameChange}
                                required
                                disabled={isLoading}
                            />
                            <label
                                htmlFor="id"
                                className={
                                    usernameErrorMsg ? "input-error-label" : ""
                                }
                            >
                                아이디
                            </label>
                        </div>
                    </div>

                    {/* 이름 입력 그룹 */}
                    <div className="input-group">
                        <div className="input-container">
                            <input
                                id="name"
                                value={name}
                                className={nameErrorMsg ? "input-error" : ""}
                                onBlur={handleNameBlur}
                                onChange={handleNameChange}
                                required
                                disabled={isLoading}
                            />
                            <label
                                htmlFor="name"
                                className={
                                    nameErrorMsg ? "input-error-label" : ""
                                }
                            >
                                이름
                            </label>
                        </div>
                    </div>

                    {/* 비밀번호 입력 그룹 */}
                    <div className="input-group password-group">
                        <div className="input-container">
                            <input
                                id="password"
                                type={passwordVisible ? "text" : "password"}
                                value={password}
                                className={
                                    passwordErrorMsg ? "input-error" : ""
                                }
                                onBlur={handlePasswordBlur}
                                onChange={handlePasswordChange}
                                required
                                disabled={isLoading}
                            />
                            <label
                                htmlFor="password"
                                className={
                                    passwordErrorMsg ? "input-error-label" : ""
                                }
                            >
                                비밀번호
                            </label>
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
                    </div>

                    {/* 아이디, 이름, 비밀번호 에러 메시지 그룹화 및 표시 (비밀번호 input 아래) */}
                    {userInfoErrors.length > 0 && (
                        <div className="error-messages-group">
                            {userInfoErrors.map((msg, index) => (
                                <p
                                    key={`user-error-${index}`}
                                    className="error-message"
                                >
                                    {msg}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                <div className="email-wrapper">
                    {/* 이메일 입력 그룹 */}
                    <div className="input-group">
                        <div className="input-container">
                            <input
                                id="email"
                                type="email"
                                value={email}
                                className={emailErrorMsg ? "input-error" : ""}
                                onBlur={handleEmailBlur}
                                onChange={handleEmailChange}
                                required
                                disabled={isLoading}
                            />
                            <label
                                htmlFor="email"
                                className={
                                    emailErrorMsg ? "input-error-label" : ""
                                }
                            >
                                이메일
                            </label>
                        </div>
                    </div>

                    {/* 인증번호 입력 그룹 */}
                    <div className="input-group">
                        <input
                            id="auth-number"
                            className="authentication-number"
                            maxLength={6}
                            onChange={(e) => {
                                setVerifyCode(e.target.value);
                            }}
                            required
                            disabled={!isVerifiedRequested || isLoading}
                        />
                        <label htmlFor="auth-number">인증번호 6자리 입력</label>
                    </div>

                    {/* 이메일 에러 메시지 그룹화 및 표시 (인증번호 input 아래) */}
                    {emailErrors.length > 0 && (
                        <div className="error-messages-group">
                            {emailErrors.map((msg, index) => (
                                <p
                                    key={`email-error-${index}`}
                                    className="error-message"
                                >
                                    {msg}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {/* 인증 메일 전송 성공 시 보여줄 메시지와 타이머 */}
                {isVerifiedRequested && (
                    <div className="verification-messasge">
                        <span className="success-text">
                            인증번호를 발송했습니다. 메일을 확인해주세요.
                        </span>
                        <span className="timer-text">
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                )}

                <button
                    className={`register-btn ${isLoading ? "loading" : ""}`}
                    onClick={handleButtonClick}
                    disabled={isButtonDisabled}
                    type="button"
                >
                    {/* 로딩 중이 아닐 때는 텍스트를, 로딩 중일 때는 CSS가 텍스트를 숨기고 스피너를 보여준다. */}
                    <span className="button-content">{buttonText}</span>
                    {isLoading && <div className="spinner"></div>}
                </button>
            </div>
        </>
    );
};

export default Register;
