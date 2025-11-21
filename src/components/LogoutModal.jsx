import "../css/Modal.css";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogoutModal = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const nav = useNavigate();

    if (!isOpen) return null;

    const handleLogout = async () => {
        try {
            // HttpOnly 속성이 설정된 쿠키의 정보들을 직접 지울 수 없다.
            await axios.post("http://localhost:8080/api/auth/logout");
            logout();
            onClose();
        } catch (error) {
            console.error("로그아웃 실패", error);
            nav("/", { replace: true });
        }
    };

    return (
        <div className="Modal" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>정말 로그아웃을 하시겠습니까?</h3>
                <div className="modal-actions">
                    <button className="modal-button" onClick={onClose}>
                        {" "}
                        아니오
                    </button>
                    <button className="modal-button yes" onClick={handleLogout}>
                        예
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
