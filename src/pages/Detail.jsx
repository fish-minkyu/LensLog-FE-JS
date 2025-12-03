import "../css/Detail.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import leftArrow from "../assets/left-arrow.svg";
import heartEmpty from "../assets/heart-empty.svg";
import heartFull from "../assets/heart-full.svg";
import LoginRequiredModal from "../components/LoginRequiredModal";
import API_ENDPOINTS from "../constants/api";

const Detail = () => {
    const { photoId } = useParams();
    const nav = useNavigate();

    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPortrait, setIsPortrait] = useState(null); // true = 세로, false = 가로
    const [imageAspect, setImageAspect] = useState(null); // width / height
    const [liked, setLiked] = useState(false);

    // 모달 상태를 관리하기 위한 state
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                setLoading(true);
                setError(null); // 이전 에러 메시지 초기화

                const response = await axios.get(
                    API_ENDPOINTS.PHOTO.GET_PHOTO(photoId)
                );

                setPhoto(response.data);

                if (response.data && response.data.isLiked !== undefined) {
                    setLiked(response.data.isLiked);
                }
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
    const toggleLike = async () => {
        try {
            await axios.post(API_ENDPOINTS.GOOD.SAVE_LIKE(photoId));

            // 좋아요 상태 토글
            setLiked((prev) => !prev);

            // 사진 데이터의 좋아요 숫자 직접 업데이트
            setPhoto((prevPhoto) => ({
                ...prevPhoto,
                likeCount: liked
                    ? // 좋아요를 취소할 때
                      prevPhoto.likeCount - 1
                    : // 좋아요를 할 때
                      prevPhoto.likeCount + 1,
            }));
        } catch (error) {
            console.error("좋아요가 오류 났습니다.", error);
            if (error.response && error.response.status === 401) {
                setModalMessage(
                    error.response.data.message ||
                        "인증된 사용자 정보가 없습니다."
                );
                setIsLoginModalOpen(true); // 모달 열기
            }
        }
    };

    // 모달 닫기 핸들러
    // 진실의 근원(Source of Truth)
    // ; React의 컴포넌트 아키텍쳐와 상태 관리 원칙에 따르면, 모달이 닫히고 열리는 상태는
    // 이 모달을 띄울지 말지를 결정하는 부모 컴포넌트가 관리해야 한다.
    const handleCloseLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    // 다운로드
    const handleImageDownload = async () => {
        try {
            const response = await axios.get(
                API_ENDPOINTS.PHOTO.DOWNLOAD_PHOTO(photoId),
                { responseType: "blob" }
            );

            // 서버가 보내준 헤더에서 파일명 추출 (없으면 기본명 사용)
            const filename = response.headers["content-disposition"]
                ? decodeURIComponent(
                      response.headers["content-disposition"]
                          .split("filename=")[1]
                          .replace(/\"/g, "")
                  )
                : `${photoId}.jpg`;

            // Blob -> URL 생성
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // 임시 a 태그 생성하여 클릭
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();

            // 정리
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("이미지 다운로드 중 오류 발생:", error);
            if (error.response && error.response.status === 401) {
                setModalMessage(
                    error.response.data.message ||
                        "인증된 사용자 정보가 없습니다."
                );
                setIsLoginModalOpen(true); // 모달 열기
            }
        }
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
                        onClick={handleImageDownload}
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
                            <span className="like-count">
                                {photo.likeCount}
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

            {/* 로그인 필요 모달 컴포넌트 렌더링 */}
            <LoginRequiredModal
                isOpen={isLoginModalOpen}
                onClose={handleCloseLoginModal}
                message={modalMessage}
            />
        </div>
    );
};

export default Detail;
