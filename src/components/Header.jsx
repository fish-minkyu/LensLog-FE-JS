import "../css/Header.css";
import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ leftChild, centerChild, rightChild }) => {
    const nav = useNavigate();

    const handleLogoClick = () => {
        nav("/");
    };

    return (
        <header className="Header">
            <div className="header-item left-child">
                {leftChild &&
                    React.cloneElement(leftChild, { onClick: handleLogoClick })}
            </div>
            <div className="header-item center-child">
                {centerChild &&
                    React.cloneElement(centerChild, {
                        onClick: handleLogoClick,
                    })}
            </div>
            <div className="header-item right-child">{rightChild}</div>
        </header>
    );
};

export default Header;
