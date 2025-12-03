import "../css/Home.css";
import Header from "../components/Header";
import { useState } from "react";
import Category from "../components/Category";
import Scroll from "../components/Scroll";

const Home = () => {
    const [selectedCategoryId, setSelectedCategoryId] = useState("all");

    const handleCategoryChange = (categoryId) => {
        setSelectedCategoryId(categoryId);
    };

    return (
        <div className="Home">
            <Header />
            <div className="body-container">
                <Category onCategoryChange={setSelectedCategoryId} />
                <Scroll categoryId={selectedCategoryId} />
                <button className="about-button">
                    <img src="" alt="about-button" />
                </button>
            </div>
        </div>
    );
};

export default Home;
