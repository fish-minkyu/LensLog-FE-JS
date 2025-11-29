import "../css/FindIdPage.css";
import LogoHeader from "../components/LogoHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_ENDPOINTS from "../constants/api";
import { useForm } from "react-hook-form";

const FindIdPage = () => {
    const nav = useNavigate();

    // API 호출 실패 시 에러 메시지 (서버 에러용)
    const [apiError, setApiError] = useState("");

    // react-hook-form 설정
    const {
        register,
        handleSubmit,
        formState: { errors },
        // NOTE: 블러 시 유효성 검사를 위해 mode를 'onBlur'로 변경
    } = useForm({
        mode: "onBlur", // 블러 시 유효성 검사 실행
        defaultValues: {
            name: "",
            email: "",
        },
    });

    // 폼 제출 핸들러 (유효성 검사 통과 시 실행됨)
    const onSubmit = async (data) => {
        const { name, email } = data;

        // API 에러 메시지를 먼저 초기화
        setApiError("");

        try {
            const response = await axios.get(API_ENDPOINTS.AUTH.FIND_USERNAME, {
                params: { name, email },
            });

            // 성공 시 이동
            nav("/result/id", {
                replace: true,
                state: { userInfo: response.data, name: name },
            });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setApiError("입력하신 정보와 일치하는 아이디가 없습니다.");
            } else {
                console.error("아이디 찾기 중 오류 발생: ", error);
                setApiError(
                    "아이디 찾기 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
                );
            }
        }
    };

    return (
        <div className="FindIdPage">
            <LogoHeader />
            <form className="input-wrapper" onSubmit={handleSubmit(onSubmit)}>
                <h3 className="title">아이디 찾기</h3>

                {/* 이름 입력 */}
                <div className="input-group">
                    <div className="input-container">
                        <input
                            id="name"
                            type="text"
                            // errors.name이 있을 때만 에러 클래스 적용
                            className={errors.name ? "input-error" : ""}
                            {...register("name", {
                                // 요구사항에 맞춰 메시지 수정
                                required: "이름: 필수정보입니다.",
                            })}
                        />
                        <label
                            htmlFor="name"
                            className={errors.name ? "input-error-label" : ""}
                        >
                            이름
                        </label>
                    </div>
                    {/* 유효성 에러 메시지 표시 */}
                    {errors.name && (
                        <div className="result-id-page-error-message">
                            <span className="error-text">
                                {errors.name.message}
                            </span>
                        </div>
                    )}
                </div>

                {/* 이메일 입력 */}
                <div className="input-group">
                    <div className="input-container">
                        <input
                            id="email"
                            type="email"
                            // errors.email이 있을 때만 에러 클래스 적용
                            className={errors.email ? "input-error" : ""}
                            {...register("email", {
                                // 요구사항에 맞춰 메시지 수정
                                required: "이메일: 필수정보입니다.",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "유효한 이메일 형식이 아닙니다.",
                                },
                            })}
                        />
                        <label
                            htmlFor="email"
                            className={errors.email ? "input-error-label" : ""}
                        >
                            이메일
                        </label>
                    </div>
                    {/* 유효성 에러 메시지 표시 */}
                    {errors.email && (
                        <div className="result-id-page-error-message">
                            <span className="error-text">
                                {errors.email.message}
                            </span>
                        </div>
                    )}
                </div>

                {/* 서버 API 에러 메시지 표시 */}
                {apiError && (
                    <div className="result-id-page-error-message">
                        <span className="error-text">{apiError}</span>
                    </div>
                )}

                <button type="submit" className="find-id-button">
                    아이디 찾기
                </button>
            </form>
        </div>
    );
};

export default FindIdPage;
