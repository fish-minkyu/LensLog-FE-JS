import "../css/Register.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"; // 👈 useForm 훅 임포트
import LogoHeader from "../components/LogoHeader";
import eyeOpen from "../assets/open-eye-gray.svg";
import eyeClosed from "../assets/closed-eye-gray.svg";
import axios from "axios";
import API_ENDPOINTS from "../constants/api";
import { useNavigate } from "react-router-dom";

// 비밀번호 유효성 검사 정규식 (최소 8자, 영문 대문자 1개 이상, 특수문자 1개 이상)
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

const Register = () => {
    // 폼 상태, 유효성 검사, 제출 처리를 위한 useForm 훅 사용
    const {
        register,
        handleSubmit,
        watch,
        setValue, // 필드 값 강제 설정 함수
        setError, // 에러 강제 설정 함수
        clearErrors, // 에러 제거 함수
        formState: { errors, isValid, isSubmitting }, // 에러, 유효성 상태, 제출 중 상태
    } = useForm({
        mode: "onBlur", // 포커스가 해제될 때 유효성 검사
        defaultValues: {
            username: "",
            name: "",
            password: "",
            email: "",
            verifyCode: "",
        },
    });

    const nav = useNavigate();

    // 로컬 상태 관리 유지: 이메일 인증 관련
    const [isLoading, setIsLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isVerifiedRequested, setIsVerifiedRequested] = useState(false); // 버튼 상태: false: 인증 요청, true: 가입하기
    const [joinErrorMsg, setJoinErrorMsg] = useState(""); // 최종 회원가입 에러 메시지
    const [timeLeft, setTimeLeft] = useState(300); // 타이머 상태

    // watch로 폼 필드 값 실시간 감시 (인증 버튼 활성화/비활성화 로직에 필요)
    const emailValue = watch("email");
    const verifyCodeValue = watch("verifyCode");

    // 타이머 로직: 인증 요청 상태이고 시간이 남아있을 때 작동
    useEffect(() => {
        let timerId;
        if (isVerifiedRequested && timeLeft > 0) {
            timerId = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // 시간이 다 되면 인증 상태 초기화
            clearInterval(timerId);
            setIsVerifiedRequested(false);
            // 필요하다면 에러 메시지 설정
            setError("verifyCode", {
                type: "expired",
                message: "인증 시간이 초과되었습니다. 다시 요청해주세요.",
            });
        }

        return () => clearInterval(timerId);
    }, [isVerifiedRequested, timeLeft, setError]);

    // 이메일 변경 시 인증 상태 및 타이머 초기화
    useEffect(() => {
        if (isVerifiedRequested) {
            setIsVerifiedRequested(false);
            setTimeLeft(300);
            clearErrors("verifyCode"); // 인증번호 관련 에러 메시지 제거
            // 인증번호 필드 값도 초기화할 수 있음
            // setValue("verifyCode", "");
        }
    }, [emailValue]); // 이메일 값이 변경될 때마다 실행

    // 시간을 MM:SS 형식으로 변환하는 함수
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `0${minutes} : ${
            remainingSeconds < 10 ? "0" : ""
        }${remainingSeconds}`;
    };

    // ------------- 요청 함수 -------------

    // 인증 요청 (폼 제출과 별개로 작동)
    const handleRequestVerification = async () => {
        // 이메일 유효성 검사 (required, pattern)는 register 룰에 의해 자동으로 수행되지만,
        // 이 버튼은 handleSubmit 외부에서 호출되므로, watch와 errors를 이용해 수동 검사
        if (errors.email) {
            return;
        }

        setIsLoading(true);

        try {
            await axios.post(API_ENDPOINTS.EMAIL.SEND_EMAIL, {
                email: emailValue,
            });
            setIsVerifiedRequested(true); // 인증 상태 변경
            setTimeLeft(300); // 타이머 재설정
            clearErrors("verifyCode"); // 에러 초기화
        } catch (error) {
            console.error("인증 메일 발송 실패: ", error);
            // 서버에서 받은 에러 메시지 처리
            setError("email", {
                type: "server",
                message:
                    error.response?.data?.message ||
                    "인증 메일 발송에 실패했습니다.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // 회원가입 요청 (handleSubmit에 의해 호출)
    const handleSignUp = async (data) => {
        // data 객체는 { username, name, password, email, verifyCode }를 포함
        setIsLoading(true);

        const userDto = {
            username: data.username,
            name: data.name,
            password: data.password,
            email: data.email,
            provider: "local",
            authority: "ROLE_USER",
            verifyCode: data.verifyCode,
        };

        try {
            await axios.post(API_ENDPOINTS.AUTH.SIGN_UP, userDto);
            nav("/result/register", { replace: true });
        } catch (error) {
            console.error("회원가입 실패: ", error);
            const errorMessage =
                error.response?.data?.message || "회원가입에 실패했습니다.";

            // 서버 측 에러 처리
            if (errorMessage.includes("인증번호")) {
                setError("verifyCode", {
                    type: "server",
                    message: errorMessage,
                });
            } else if (errorMessage.includes("아이디")) {
                setError("username", { type: "server", message: errorMessage });
            } else if (errorMessage.includes("이메일")) {
                setError("email", { type: "server", message: errorMessage });
            } else {
                setJoinErrorMsg(errorMessage); // 기타 전역 에러
            }
        } finally {
            setIsLoading(false);
        }
    };

    // 폼 제출 핸들러: isVerifiedRequested 상태에 따라 분기
    const onSubmit = (data) => {
        if (!isVerifiedRequested) {
            // 인증 요청
            handleRequestVerification();
        } else {
            // 회원가입 요청
            handleSignUp(data);
        }
    };

    // ------------ 버튼 활성화 조건 ------------

    const buttonText = isVerifiedRequested ? "가입하기" : "인증 요청";

    // 기본 정보 (아이디, 이름, 비밀번호)가 모두 유효하고 에러가 없는지 확인
    const areBaseFieldsValid =
        !errors.username &&
        !errors.name &&
        !errors.password &&
        watch("username") &&
        watch("name") &&
        watch("password");

    // 인증 요청 버튼 활성화 조건: 기본 필드와 이메일 필드가 모두 유효할 때
    const isRequestEnabled = areBaseFieldsValid && !errors.email && emailValue;

    // 가입하기 버튼 활성화 조건: 기본 필드, 이메일, 인증번호 필드가 모두 유효하고 인증 요청 상태일 때
    const isSignUpEnabled =
        isVerifiedRequested &&
        areBaseFieldsValid &&
        !errors.email &&
        !errors.verifyCode &&
        emailValue &&
        verifyCodeValue.length === 6;

    // 최종 버튼 비활성화 조건
    const isButtonDisabled =
        isLoading ||
        (isVerifiedRequested && !isSignUpEnabled) ||
        (!isVerifiedRequested && !isRequestEnabled) ||
        isSubmitting;

    // 에러 메시지 렌더링 함수
    const renderErrorMessage = (error) => {
        if (error) {
            // 커스텀 메시지를 표시할 경우를 위한 맵핑
            switch (error.type) {
                case "required":
                    return "필수 정보입니다.";
                case "pattern":
                    return "최소 8자의 영문 대/소문자, 숫자, 특수문자를 사용해주세요.";
                case "maxLength":
                    return "인증번호는 6자리입니다.";
                case "server":
                case "expired":
                    return error.message; // 서버 또는 타이머 초과 에러 메시지
                default:
                    return error.message;
            }
        }
        return null;
    };

    return (
        <>
            {/* handleSubmit(onSubmit)으로 폼 제출을 래핑하여 유효성 검사 후 onSubmit이 호출되도록 함 */}
            <form onSubmit={handleSubmit(onSubmit)} className="Register">
                <LogoHeader />
                <div className="user-info-wrapper">
                    {/* 아이디 입력 그룹 */}
                    <div className="input-group">
                        <div className="input-container">
                            <input
                                id="id"
                                // 폼 등록 및 유효성 검사 규칙 설정
                                {...register("username", {
                                    required: true,
                                })}
                                className={errors.username ? "input-error" : ""}
                                required
                                disabled={isLoading || isSubmitting}
                            />
                            <label
                                htmlFor="id"
                                className={
                                    errors.username ? "input-error-label" : ""
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
                                {...register("name", {
                                    required: true,
                                })}
                                className={errors.name ? "input-error" : ""}
                                required
                                disabled={isLoading || isSubmitting}
                            />
                            <label
                                htmlFor="name"
                                className={
                                    errors.name ? "input-error-label" : ""
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
                                {...register("password", {
                                    required: true,
                                    pattern: passwordRegex,
                                })}
                                className={errors.password ? "input-error" : ""}
                                required
                                disabled={isLoading || isSubmitting}
                            />
                            <label
                                htmlFor="password"
                                className={
                                    errors.password ? "input-error-label" : ""
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

                    {/* 아이디, 이름, 비밀번호 에러 메시지 그룹화 및 표시 */}
                    <div className="error-messages-group">
                        {(errors.username ||
                            errors.name ||
                            errors.password) && (
                            <>
                                {errors.username && (
                                    <p className="error-message">
                                        아이디:{" "}
                                        {renderErrorMessage(errors.username)}
                                    </p>
                                )}
                                {errors.name && (
                                    <p className="error-message">
                                        이름: {renderErrorMessage(errors.name)}
                                    </p>
                                )}
                                {errors.password && (
                                    <p className="error-message">
                                        비밀번호:{" "}
                                        {renderErrorMessage(errors.password)}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className="email-wrapper">
                    {/* 이메일 입력 그룹 */}
                    <div className="input-group">
                        <div className="input-container">
                            <input
                                id="email"
                                type="email"
                                {...register("email", {
                                    required: true,
                                })}
                                className={errors.email ? "input-error" : ""}
                                required
                                disabled={
                                    isLoading ||
                                    isSubmitting ||
                                    isVerifiedRequested
                                } // 인증 요청 후에는 이메일 수정 불가
                            />
                            <label
                                htmlFor="email"
                                className={
                                    errors.email ? "input-error-label" : ""
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
                            {...register("verifyCode", {
                                required: isVerifiedRequested ? true : false, // 인증 요청 상태일 때만 필수
                                maxLength: 6,
                            })}
                            required
                            disabled={
                                !isVerifiedRequested ||
                                isLoading ||
                                isSubmitting
                            }
                        />
                        <label htmlFor="auth-number">인증번호 6자리 입력</label>
                    </div>

                    {/* 이메일/인증번호 에러 메시지 그룹화 및 표시 */}
                    <div className="error-messages-group">
                        {errors.email && (
                            <p className="error-message">
                                이메일: {renderErrorMessage(errors.email)}
                            </p>
                        )}
                        {errors.verifyCode && (
                            <p className="error-message">
                                인증번호:{" "}
                                {renderErrorMessage(errors.verifyCode)}
                            </p>
                        )}
                    </div>
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

                {/* 회원가입 실패 시, 보여줄 메시지 (폼 제출 전역 에러) */}
                {joinErrorMsg && (
                    <div className="error-message">
                        <p>{joinErrorMsg}</p>
                    </div>
                )}

                <button
                    className={`register-btn ${
                        isLoading || isSubmitting ? "loading" : ""
                    }`}
                    disabled={isButtonDisabled}
                    type="submit" // 폼 제출을 위해 type="submit"으로 변경
                >
                    <span className="button-content">{buttonText}</span>
                    {(isLoading || isSubmitting) && (
                        <div className="spinner"></div>
                    )}
                </button>
            </form>
        </>
    );
};

export default Register;
