import "../css/LogoHeader.css";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.svg";

const LogoHeader = () => {
    const nav = useNavigate();

    return (
        <div className="LogoHeader">
            <img
                className="logo-image"
                src={logoImage}
                alt="logo"
                onClick={() => nav("/")}
            />
        </div>
    );
};

export default LogoHeader;
