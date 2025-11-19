import "../css/Detail.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";

const Detail = () => {
    const { photoId } = useParams();
    const nav = useNavigate();

    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPortrait, setIsPortrait] = useState(null); // true = 세로, false = 가로

    const getPhoto = async () => {
        try {
            setLoading(true);
            setError(null); // 이전 에러 메시지 초기화

            const response = await axios.get(
                `http://localhost:8080/api/photo/getOne/${photoId}`
            );
            setPhoto(response.data);
            setError(null);
        } catch (error) {
            console.error("사진을 가지고 올 수 없습니다.", error);
            setError("사진을 가지고 올 수 없습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPhoto();
    }, []);

    // 이미지 로드 후 사이즈 검사 함수
    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.target;
        setIsPortrait(naturalHeight > naturalWidth);
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;
    if (!photo) return null;

    return <div className="Detail">{/* <Header /> */}</div>;
};

export default Detail;
