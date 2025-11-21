import "../css/Modal.css";
import { useNavigate } from "react-router-dom";

const LoginRequiredModal = ({ isOpen, onClose, message }) => {
    const nav = useNavigate();

    // 모달이 닫힌 상태면 아무것도 렌더링 하지 않는다.
    if (!isOpen) return null;

    // 로그인 버튼 클릭 핸들러
    const handleGoToLogin = () => {
        onClose();
        nav("/login");
    };

    return (
        <div className="Modal" onClick={onClose}>
            {" "}
            {/* 외부 클릭 시 모달 닫기 */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {" "}
                {/* 모달 내부 클릭 시 이벤트 버블링 방지 */}
                <h3>로그인 필요한 기능입니다.</h3>
                <p>{message}</p>
                <div className="modal-actions">
                    <button className="modal-button" onClick={onClose}>
                        닫기
                    </button>
                    {/* 이제 onConfirm props 없이 내부에서 직접 처리 */}
                    <button
                        className="modal-button yes"
                        onClick={handleGoToLogin}
                    >
                        로그인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginRequiredModal;
