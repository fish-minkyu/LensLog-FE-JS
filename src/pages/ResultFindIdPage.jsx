import "../css/ResultFindIdPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";
import kakao from "../assets/social-kakao.svg";
import google from "../assets/social-google.svg";
import naver from "../assets/social-naver.svg";

// 아이디 찾기 결과 화면
const ResultFindIdPage = () => {
    const nav = useNavigate();
    const location = useLocation();

    // FindIdPage에서 navigate로 넘겨준 state 받기
    const state = location.state || {};
    const userList = state.userInfo || {};
    const searchedName = state.name || "";

    // 결과 건수
    const resultCount = userList.length;

    const onClickGoLogin = () => {
        nav("/login");
    };

    const onClickFindPw = () => {
        nav("/find/password");
    };

    // 1. 구분 컬럼 렌더링
    const renderProviderName = (provider) => {
        if (provider === "local") return "Lens Log";
        return "소셜";
    };

    // 2. 아이디 컬럼 렌더링
    const renderIdContent = (user) => {
        if (user.provider === "kakao") {
            return (
                <div className="social-box">
                    <img
                        className="social-icon"
                        src={kakao}
                        alt="카카오 아이콘"
                    />
                    <span>간편 로그인</span>
                </div>
            );
        } else if (user.provider === "naver") {
            return (
                <div className="social-box">
                    <img
                        className="social-icon"
                        src={naver}
                        alt="네이버 아이콘"
                    />
                    <span>간편 로그인</span>
                </div>
            );
        } else if (user.provider === "google") {
            return (
                <div className="social-box">
                    <img
                        className="social-icon"
                        src={google}
                        alt="구글 아이콘"
                    />
                    <span>간편 로그인</span>
                </div>
            );
        } else {
            return user.username || "아이디 정보 없음";
        }
    };

    return (
        <div className="ResultFindIdPage">
            <LogoHeader />
            <div className="content-wrapper">
                <h3 className="title">아이디 찾기</h3>

                <div className="summary-text">
                    <span className="name-highlight">{searchedName}</span>님의
                    아이디가{" "}
                    <span className="count-highlight">{resultCount}건</span>{" "}
                    검색되었습니다.
                </div>

                <table className="result-table">
                    <colgroup>
                        <col width="30%" />
                        <col width="40%" />
                        <col width="30%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>구분</th>
                            <th>아이디</th>
                            <th>가입일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.length > 0 ? (
                            userList.map((user, index) => (
                                <tr key={index}>
                                    <td>{renderProviderName(user.provider)}</td>
                                    <td>{renderIdContent(user)}</td>
                                    {/* 날짜가 "2025-11-23" 형태로 오므로 그대로 출력하거나 T 제거 */}
                                    <td>
                                        {user.createdDate
                                            ? user.createdDate.split("T")[0]
                                            : "-"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="no-result">
                                    검색된 정보가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="button-group">
                    <button className="login-button" onClick={onClickGoLogin}>
                        로그인
                    </button>
                    <button
                        className="find-password-button"
                        onClick={onClickFindPw}
                    >
                        비밀번호 찾기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultFindIdPage;
