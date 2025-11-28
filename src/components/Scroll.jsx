import "../css/Scroll.css";
import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import API_ENDPOINTS from "../constants/api";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";

const Scroll = ({ categoryId }) => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentLastPhotoId, setCurrentLastPhotoId] = useState(null);
    const [hasNext, setHasNext] = useState(true);
    const containerRef = useRef(null);

    // ✨ 무한 요청 방지를 위해 loading과 hasNext를 Ref로 관리
    const loadingRef = useRef(loading);
    const hasNextRef = useRef(hasNext);

    // loading/hasNext 상태가 변경될 때마다 Ref 값 업데이트
    useEffect(() => {
        loadingRef.current = loading;
        hasNextRef.current = hasNext;
    }, [loading, hasNext]);

    const pageSize = 30;

    /**
     * @param {boolean} isInitialLoad - true면 photos 배열을 새로 덮어쓰고, false면 기존 배열에 추가(append)한다.
     * @param {number|null} cursorId - 다음 페이지를 가져올 커서 ID (lastPhotoId). isInitialLoad가 true면 null로 무시한다.
     */
    const loadPhotos = useCallback(
        async (isInitialLoad, cursorId) => {
            // isInitialLoad가 false(스크롤 로드)일 때만 Ref의 최신 상태를 검사한다.
            if (!isInitialLoad && (loadingRef.current || !hasNextRef.current))
                return;

            setLoading(true);

            try {
                // 초기 로드 시에는 cursorId를 null로 설정하여 첫 페이지를 요청합니다.
                const lastPhotoIdToSend = isInitialLoad ? null : cursorId;

                const params = {
                    pageSize: pageSize,
                };

                // 1. lastPhotoId 설정 (초기 로드 시에는 null)
                if (lastPhotoIdToSend) {
                    params.lastPhotoId = lastPhotoIdToSend;
                }

                // 2. categoryId 설정
                if (categoryId !== "all" && categoryId !== null) {
                    params.categoryId = categoryId;
                }

                const response = await axios.get(
                    API_ENDPOINTS.CATEGORY.GET_PHOTO_LIST_GROUP_BY_CATEGORY,
                    { params }
                );

                const {
                    photos: receivedPhotos,
                    nextCursorId,
                    hasNext: newHasNext,
                } = response.data;

                // 데이터 설정: 초기 로드(덮어쓰기) 또는 추가 로드(append)
                if (isInitialLoad) {
                    setPhotos(receivedPhotos);
                } else {
                    setPhotos((prev) => [...prev, ...receivedPhotos]);
                }

                setCurrentLastPhotoId(nextCursorId);
                setHasNext(newHasNext);
            } catch (error) {
                console.error("사진 목록 조회 실패:", error);
                setHasNext(false);
            } finally {
                setLoading(false);
            }
        },
        // loadPhotos는 이제 categoryId와 pageSize에만 의존한다.
        // 상태 값(loading, hasNext)은 Ref를 통해 접근하여 함수 인스턴스 변경을 최소화한다.
        [pageSize, categoryId]
    );

    // 1. 카테고리 변경 감지 (초기 로드)
    useEffect(() => {
        // 무한 루프가 발생하지 않도록 초기 로드 시에도 loading 상태 확인을 추가한다.
        // 하지만 Ref를 사용했으므로, 이미 로딩 중인 상태가 아니라면 무조건 실행된다.

        setPhotos([]); // 이전 사진 목록 즉시 비우기
        setCurrentLastPhotoId(null);
        setHasNext(true);

        // isInitialLoad: true, cursorId: null (무시됨)
        loadPhotos(true, null);
    }, [categoryId, loadPhotos]);

    // 2. 무한 스크롤 이벤트 처리 (추가 로드)
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            // 스크롤 이벤트에서는 로컬 상태(loading, hasNext)를 참조
            if (loading || !hasNext) return;

            const { scrollTop, clientHeight, scrollHeight } = container;

            if (scrollHeight - scrollTop - clientHeight < 300) {
                // isInitialLoad: false, cursorId: currentLastPhotoId (상태 관리된 커서)
                loadPhotos(false, currentLastPhotoId);
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [loading, hasNext, loadPhotos, currentLastPhotoId]);

    const breakpointColumnsObj = {
        default: 5,
        1500: 4,
        1200: 3,
        800: 2,
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
                            src={photo.bucketFileUrl}
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
