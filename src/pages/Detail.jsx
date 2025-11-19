import "../css/Detail.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import leftArrow from "../assets/left-arrow.svg";
import heartEmpty from "../assets/heart-empty.svg";
import heartFull from "../assets/heart-full.svg";

const Detail = () => {
    const { photoId } = useParams();
    const nav = useNavigate();

    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPortrait, setIsPortrait] = useState(null); // true = 세로, false = 가로
    const [imageAspect, setImageAspect] = useState(null); // width / height
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                setLoading(true);
                setError(null); // 이전 에러 메시지 초기화

                const response = await axios.get(
                    `http://localhost:8080/api/photo/getOne/${photoId}`
                );
                setPhoto(response.data);
            } catch (error) {
                console.error("사진을 가지고 올 수 없습니다.", error);
                setError("사진을 가지고 올 수 없습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchPhoto();
    }, [photoId]);

    // 이미지 로드 후 사이즈 검사 함수
    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.target;
        setIsPortrait(naturalHeight >= naturalWidth);
        if (naturalWidth && naturalHeight) {
            setImageAspect(naturalWidth / naturalHeight);
        }
    };

    // 좋아요 토글 함수
    const toggleLike = () => {
        setLiked((prev) => !prev);
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;
    if (!photo) return null;

    const orientationClass =
        isPortrait === null ? "pending" : isPortrait ? "portrait" : "landscape";

    const landscapeWidth =
        isPortrait === false && imageAspect
            ? Math.min(imageAspect * 640, 1260)
            : null;

    const landscapeStyle =
        landscapeWidth !== null ? { maxWidth: `${landscapeWidth}px` } : {};

    return (
        <div className="Detail">
            <Header />
            <div className="detail-body">
                <button
                    className="back-button"
                    onClick={() => nav(-1)}
                    aria-label="뒤로가기"
                >
                    <img src={leftArrow} alt="뒤로가기" />
                </button>
                <div
                    className={`detail-container ${orientationClass}`}
                    style={landscapeStyle}
                >
                    <button
                        className={`download-button ${orientationClass}`}
                        type="button"
                    >
                        저장
                    </button>

                    <div className="photo-wrapper" style={landscapeStyle}>
                        <img
                            src={photo.bucketFileUrl}
                            alt={photo.fileName}
                            onLoad={handleImageLoad}
                            className="photo"
                        />
                    </div>

                    <div className="photo-info" style={landscapeStyle}>
                        <button
                            type="button"
                            className="like-button"
                            onClick={toggleLike}
                            aria-pressed={liked}
                        >
                            <img
                                src={liked ? heartFull : heartEmpty}
                                alt={liked ? "좋아요 취소" : "좋아요"}
                                className="heart-icon"
                            />
                            <span>
                                {liked ? photo.likeCount + 1 : photo.likeCount}
                            </span>
                        </button>

                        <div className="photo-details">
                            <div className="detail-item">
                                <span className="detail-label">촬영일</span>
                                <span className="detail-value">
                                    {photo.shotDate || "-"}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">위치</span>
                                <span className="detail-value">
                                    {photo.location || "-"}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">조회수</span>
                                <span className="detail-value">
                                    {photo.views}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;
