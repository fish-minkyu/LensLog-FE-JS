import "../css/Home.css";
import Header from "../components/Header";
import { useState } from "react";
import Category from "../components/Category";
import Scroll from "../components/Scroll";
import useScrollRestoration from "../hooks/useScrollRestoration";

const Home = () => {
    const [selectedCategoryId, setSelectedCategoryId] = useState("all");

    // 스크롤 복원
    useScrollRestoration("home-scroll");

    return (
        <div className="Home">
            <Header />
            <div className="body-container">
                <Category onCategoryChange={setSelectedCategoryId} />
                <Scroll categoryId={selectedCategoryId} />
            </div>
        </div>
    );
};

export default Home;
