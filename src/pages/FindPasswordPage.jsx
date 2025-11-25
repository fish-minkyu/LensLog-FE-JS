import "../css/FindPasswordPage.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoHeader from "../components/LogoHeader";

// 비밀번호 찾기 페이지
const FindPasswordPage = () => {
    // 상태 관리
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [verifyCode, setVerifyCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // 에러 메시지 상태
    const [usernameErrorMsg, setUsernameErrorMsg] = useState("");
    const [emailErrorMsg, setEmailErrorMsg] = useState("");
    const [resultErrorMsg, setResultErrorMsg] = useState("");

    // 인증 요청 상태
    // 버튼 상태, false: 인증 요청, true: 가입하기
    const [isVerifiedRequested, setIsVerifiedRequested] = useState(false);

    const nav = useNavigate();

    // 타이머 상태(초 단위, 300초)
    const [timeLeft, setTimeLeft] = useState(300);

    // 타이머 로직: 인증 요청 상태이고 시간이 남아있을 때 작동
    useEffect(() => {
        let timerId;

        // 타이머 실행 조건: 인증 요청 상태(true)이고 시간이 남아있을 때
        if (isVerifiedRequested && timeLeft > 0) {
            timerId = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        }

        // 타이머 만료 로직: isVerifiedRequestd가 true인데 시간이 0이 되었을 때
        if (isVerifiedRequested && timeLeft === 0) {
            clearInterval(timerId); // 타이머 정리

            // 인증 상태 해제 -> 버튼 텍스트를 "인증 요청"으로 변경하고 성공 메시지를 숨김
            setIsVerifiedRequested(false);

            // 인증 만료 메시지 표시
            setResultErrorMsg(
                "인증 시간이 만료되었습니다. 다시 '인증 요청'을 해주세요."
            );

            // 입력된 인증번호 초기화
            setVerifyCode("");

            // 다음 요청을 위해 타이머를 초기값으로 재설정
            setTimeLeft(300);
        }

        // 컴포넌트 정리 시 타이머 해제
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

    // -------------- 요청 함수 --------------
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

    // 인증 확인
    const handleCheckVerification = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/verification/password",
                { username, email, provider: "local", verifyCode }
            );

            if (response.status === 200) {
                nav("/change/password", {
                    replace: true,
                    state: { username, email },
                });
            }
        } catch (error) {
            console.error("비밀번호 찾기 에러: ", error);
            if (error.response.status === 400) {
                setResultErrorMsg(
                    error.response?.data?.message ||
                        "인증번호가 일치하지 않습니다."
                );
            }

            if (error.response.status === 404) {
                setResultErrorMsg(
                    error.response?.data?.message ||
                        "일치하는 인증번호가 없습니다."
                );
            }
        }
    };

    // 버튼 클릭 핸들러(버튼 텍스트에 따라 호출 함수 분기)
    const handleButtonClick = () => {
        if (!isVerifiedRequested) {
            // 1. 모든 필드에 대해 즉시 유효성 검사 수행 및 에러 메시지 업데이트
            const usernameValid = validateRequired(username, "아이디") === "";
            const emailValid = validateRequired(email, "이메일") === "";

            setUsernameErrorMsg(
                usernameValid ? "" : validateRequired(username, "아이디")
            );
            setEmailErrorMsg(
                emailValid ? "" : validateRequired(email, "이메일")
            );

            // 2. 모든 필드가 유효하면 인증 요청
            if (usernameValid && emailValid) {
                handleRequestVerification();
            }
        } else {
            handleCheckVerification();
        }
    };

    // ------------ 버튼 활성화 조건 ------------
    const buttonText = isVerifiedRequested ? "비밀번호 찾기" : "인증 요청";

    // 인증 요청 버튼 활성화 조건 (필수 필드가 모두 채워지고 현재 에러가 없어야 함)
    const isRequestEnabled =
        username.trim() !== "" &&
        email.trim() !== "" &&
        !usernameErrorMsg &&
        !emailErrorMsg;

    // 비밀번호 찾기 버튼 활성화 조건
    const isFindPwdEnabled =
        isVerifiedRequested &&
        username.trim() !== "" &&
        email.trim() !== "" &&
        verifyCode.trim() !== "" &&
        !usernameErrorMsg &&
        !emailErrorMsg;

    // 최종 버튼 비활성화 조건: 로딩 중이거나, 로딩 중이 아니면서 버튼이 활성화될 조건을 충족하지 못한 경우
    const isButtonDisabled =
        isLoading ||
        (isVerifiedRequested && !isFindPwdEnabled) ||
        (!isVerifiedRequested && !isRequestEnabled);

    return (
        <div className="FindPasswordPage">
            <LogoHeader />
            <div className="content-wrapper">
                <h3 className="title">비밀번호 찾기</h3>

                <div className="user-info-wrapper">
                    <div className="input-group">
                        <div className="input-container">
                            <input
                                id="id"
                                className={
                                    usernameErrorMsg ? "input-error" : ""
                                }
                                type="text"
                                onChange={handleUsernameChange}
                                onBlur={handleUsernameBlur}
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
                        {usernameErrorMsg && (
                            <p className="error-message">{usernameErrorMsg}</p>
                        )}
                    </div>
                    <div className="input-group">
                        <div className="input-container">
                            <input
                                id="email"
                                className={emailErrorMsg ? "input-error" : ""}
                                type="email"
                                onChange={handleEmailChange}
                                onBlur={handleEmailBlur}
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
                        {emailErrorMsg && (
                            <p className="error-message">{emailErrorMsg}</p>
                        )}
                    </div>
                    <div className="input-group">
                        <div className="input-container">
                            <input
                                id="auth-number"
                                className="authentication-number"
                                type="text"
                                maxLength={6}
                                onChange={(e) => {
                                    setVerifyCode(e.target.value);
                                }}
                                disabled={!isVerifiedRequested || isLoading}
                            />
                            <label htmlFor="auth-number">
                                인증번호 6자리 입력
                            </label>
                        </div>
                    </div>
                </div>

                {/* 인증 메일 전송 성공 시 보여줄 메시지와 타이머 */}
                {isVerifiedRequested && (
                    <div className="verification-message">
                        <span className="success-text">
                            인증번호를 발송했습니다. 메일을 확인해주세요.
                        </span>
                        <span className="timer-text">
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                )}

                {/* 인증 실패 시 보여줄 메시지 */}
                {resultErrorMsg && (
                    <div className="verification-message">
                        <span className="fail-text">
                            {resultErrorMsg || "인증번호가 일치하지 않습니다."}
                        </span>
                    </div>
                )}
            </div>

            <button
                className={`find-password-button ${isLoading ? "loading" : ""}`}
                type="button"
                onClick={handleButtonClick}
                disabled={isButtonDisabled}
            >
                <span className="button-content">{buttonText}</span>
                {isLoading && <div className="spinner"></div>}
            </button>
        </div>
    );
};

export default FindPasswordPage;
