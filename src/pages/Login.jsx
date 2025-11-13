import "../css/Login.css";
import axios from "axios";
import Button from "../components/Button";
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 1. 이메일 입력 필드의 값이 변경될 때 호출될 핸들러
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    // 2. 비밀번호 입력 필드의 값이 변경될 때 호출될 핸들러
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const onClickLogin = async () => {
        const response = await axios.post(
            "http://localhost:8080/api/auth/login",
            { email: email, password: password }
        );
        console.log(response);

        if (response.status === 200) {
            alert("로그인 성공");
        }
    };

    return (
        <div className="Login">
            <div className="logo">Logo</div>
            <div className="login-form">
                <section className="email">
                    <input
                        className="input"
                        type="email"
                        onChange={handleEmailChange}
                    />
                </section>
                <section className="password">
                    <input
                        className="input"
                        type="password"
                        onChange={handlePasswordChange}
                    />
                </section>
                <Button text={"로그인"} onClick={onClickLogin} />
            </div>
        </div>
    );
};

export default Login;
