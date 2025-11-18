import "../css/Detail.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Detail = () => {
    const { photoId } = useParams();
    const nav = useNavigate();

    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const getPhoto = async () => {
        try {
            setLoading(true);
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
    }, [photoId]);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return <div>Detail</div>;
};

export default Detail;
