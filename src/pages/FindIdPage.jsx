import "../css/FindIdPage.css";
import LogoHeader from "../components/LogoHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 아이디 찾기 입력 화면
const FindIdPage = () => {
    // 상태 관리
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // 에러 메시지 상태
    const [errorMessage, setErrorMessage] = useState("");

    const nav = useNavigate();

    // 핸들러: 이름
    const handleNamgeChange = (e) => {
        setName(e.target.value);
    };

    // 핸들러: 이메일
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const onClickFindID = async () => {
        try {
            if (!name) {
                setErrorMessage("이름을 입력해주세요.");
                return;
            }

            if (!email) {
                setErrorMessage("이메일을 입력헤주세요.");
                return;
            }

            const response = await axios.get(
                "http://localhost:8080/api/auth/find/username",
                { params: { name, email } }
            );
            // 성공 시 에러 메시지 초기화
            setErrorMessage("");
            nav("/result/id", {
                replace: true,
                state: { userInfo: response.data, name: name }, // 결과 페이지에서 location.state로 확인 가능
            });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setErrorMessage("입력하신 정보와 일치하는 아이디가 없습니다.");
            } else {
                console.error("아이디 찾기 중 오류 발생: ", error);
                setErrorMessage(
                    "아이디 찾기 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
                );
            }
        }
    };

    return (
        <div className="FindIdPage">
            <LogoHeader />
            <div className="input-wrapper">
                <h3 className="title">아이디 찾기</h3>

                <div className="input-group">
                    <div className="input-container">
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={handleNamgeChange}
                        />
                        <label>이름</label>
                    </div>
                </div>
                <div className="input-group">
                    <div className="input-container">
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <label>이메일</label>
                    </div>
                </div>

                {errorMessage && (
                    <div className="result-id-page-error-message">
                        <span className="error-text">{errorMessage}</span>
                    </div>
                )}
            </div>

            <button className="find-id-button" onClick={onClickFindID}>
                아이디 찾기
            </button>
        </div>
    );
};

export default FindIdPage;
