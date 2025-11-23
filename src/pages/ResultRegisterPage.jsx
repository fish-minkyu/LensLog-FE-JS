import "../css/ResultRegisterPage.css";
import LogoHeader from "../components/LogoHeader";
import happyFace from "../assets/happy-face.svg";
import { useNavigate } from "react-router-dom";

const ResultRegisterPage = () => {
    const nav = useNavigate();

    return (
        <div className="ResultRegisterPage">
            <LogoHeader />
            <img className="happy-face" src={happyFace} alt="happy-face" />
            <div className="result-text">
                <h3>회원가입이 완료되었습니다.</h3>
                <h3>로그인 해주세요!</h3>
            </div>
            <button
                className="login-page-button"
                onClick={() => {
                    nav("/login");
                }}
            >
                로그인 화면으로
            </button>
        </div>
    );
};

export default ResultRegisterPage;
