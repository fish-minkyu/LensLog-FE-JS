import "../css/Home.css";
import Header from "../components/Header";
import logoImage from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import Category from "../components/Category";
import Scroll from "../components/Scroll";

const Home = () => {
    const nav = useNavigate();

    return (
        <div className="Home">
            <Header />
            <div className="body-container">
                <Category />
                <Scroll />
            </div> 
        </div>
    );
};

export default Home;
