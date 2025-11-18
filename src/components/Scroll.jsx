import "../css/Scroll.css";
import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";

const Scroll = ({ categoryId }) => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentLastPhotoId, setCurrentLastPhotoId] = useState(null); // lastPhotoId 관리
    const [hasNext, setHasNext] = useState(true); // 더 로드할 데이터가 있는지 여부
    const containerRef = useRef(null); // 스크롤 컨테이너 ref

    // 한 번에 가져올 사진 개수 (7열 * 3줄 기준)
    const pageSize = 21;

    const fetchPhotos = useCallback(async () => {
        if (loading || !hasNext) return; // 로딩 중이거나 더 이상 데이터가 없으면 요청하지 않음
        setLoading(true);

        try {
            const params = {
                lastPhotoId: currentLastPhotoId,
                pageSize: pageSize,
            };

            // 백엔드의 요구사항에 맞게 categoryId 처리:
            // 프론트에서 "all"이라는 문자열 카테고리가 오면 백엔드에 categoryId를 보내지 않음 (null로 처리됨)
            // 그 외의 유효한 categoryId(숫자 Long)가 오면 해당 ID를 전송
            if (categoryId !== "all" && categoryId !== null) {
                // categoryId가 "all"이 아니면 파라미터 추가
                params.categoryId = categoryId;
            }
            // categoryId가 "all"이면 params.categoryId를 설정하지 않으므로,
            // Axios가 해당 파라미터를 요청에서 제외하고 백엔드는 이를 null로 받게 됩니다.

            const response = await axios.get(
                "http://localhost:8080/api/category/getList",
                { params }
            );

            const {
                photos: receivedPhotos,
                nextCursorId,
                hasNext: newHasNext,
            } = response.data;

            setPhotos((prev) => [...prev, ...receivedPhotos]);
            setCurrentLastPhotoId(nextCursorId);
            setHasNext(newHasNext);
        } catch (error) {
            console.error("사진 목록 조회 실패:", error);
            setHasNext(false);
        } finally {
            setLoading(false);
        }
    }, [loading, hasNext, currentLastPhotoId, pageSize, categoryId]); // 의존성 배열에 변수 추가

    // categoryId가 변경되면 상태를 초기화하고 처음부터 다시 불러옴
    useEffect(() => {
        setPhotos([]);
        setCurrentLastPhotoId(null);
        setHasNext(true);
        // categoryId 변경 시 초기 로드를 즉시 트리거
        fetchPhotos();
    }, [categoryId]); // categoryId가 변경될 때마다 이펙트 실행

    // 무한 스크롤 이벤트 처리
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (loading || !hasNext) return;

            const { scrollTop, clientHeight, scrollHeight } = container;

            if (scrollHeight - scrollTop - clientHeight < 300) {
                fetchPhotos();
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [loading, hasNext, fetchPhotos]);

    const breakpointColumnsObj = {
        default: 5,
    };

    return (
        <div className="Scroll" ref={containerRef}>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="masonry-grid"
                columnClassName="masonry-grid-column"
            >
                {photos.map((photo) => (
                    <Link key={photo.photoId} to={`/detail/${photo.photoId}`}>
                        <img
                            key={photo.photoId}
                            src={photo.thumbnailUrl}
                            alt={photo.fileName}
                            style={{
                                width: "100%",
                                display: "block",
                                marginBottom: "10px",
                                borderRadius: "5px",
                                objectFit: "cover",
                            }}
                        />
                    </Link>
                ))}
            </Masonry>
            {loading && <div className="loading">로딩 중...</div>}
            {!hasNext && (
                <div className="end-message">더 이상 사진이 없습니다.</div>
            )}
        </div>
    );
};

export default Scroll;
