import "../css/Button.css";

const Button = ({ type, text, onClick }) => {
    return (
        <button className={`Button Button_${type}`} onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;
