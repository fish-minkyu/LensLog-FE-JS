import "../css/ResultPasswordChangePage.css";
import { useNavigate } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";
import door from "../assets/door.svg";

// 비밀번호 변경완료 확인 화면 & 비밀번호 찾기 결과 화면
const ResultPasswordChangePage = () => {
    const nav = useNavigate();

    return (
        <div className="ResultPasswordChangePage">
            <LogoHeader />
            <img className="door-image" src={door} alt="door-image" />
            <div className="content-wrapper">
                <h3>비밀번호 변경이 완료되었습니다!</h3>
                <h3>새로운 비밀번호로 로그인해주세요.</h3>
            </div>

            <button
                className="go-to-login-button"
                onClick={() => {
                    nav("/login", { replace: true });
                }}
            >
                로그인 화면으로
            </button>
        </div>
    );
};

export default ResultPasswordChangePage;
