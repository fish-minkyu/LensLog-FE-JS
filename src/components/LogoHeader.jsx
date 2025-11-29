import "../css/LogoHeader.css";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.svg";

const LogoHeader = ({ option }) => {
    const nav = useNavigate();

    return (
        <div className={`LogoHeader LogoHeader_${option}`}>
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
