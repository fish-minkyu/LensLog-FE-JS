import "../css/Button.css";

const Button = ({ type, text, onClick, disabled, children }) => {
    return (
        <button
            className={`Button Button_${type}`}
            onClick={onClick}
            disabled={disabled}
        >
            {/* children이 있다면 children을 렌더링 (스피너 로직을 위해) */}
            {children || text}
        </button>
    );
};

export default Button;
