// src/components/Scroll.jsx
import "../css/Scroll.css";
import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import API_ENDPOINTS from "../constants/api";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";
import usePhotoFeedStore from "../hooks/usePhotoFeedStore";

const Scroll = ({ categoryId }) => {
    const categoryKey = categoryId ?? "all";

    const {
        photos,
        currentLastPhotoId,
        hasNext,
        scrollTop,
        initialized,
        currentCategoryId,
        setFeed,
        resetForCategory,
    } = usePhotoFeedStore((state) => state);

    const containerRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const loadingRef = useRef(loading);
    const hasNextRef = useRef(hasNext);

    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    useEffect(() => {
        hasNextRef.current = hasNext;
    }, [hasNext]);

    const pageSize = 50;

    // 🔥 카테고리가 바뀌면 zustand 피드를 싹 리셋
    useEffect(() => {
        if (currentCategoryId !== categoryKey) {
            resetForCategory(categoryKey);
        }
    }, [categoryKey, currentCategoryId, resetForCategory]);

    // 사진 로딩 함수
    const loadPhotos = useCallback(
        async (isInitial) => {
            if (!isInitial && (loadingRef.current || !hasNextRef.current)) {
                return;
            }

            setLoading(true);

            try {
                const params = {
                    pageSize,
                };

                const cursorId = isInitial ? null : currentLastPhotoId;
                if (cursorId) {
                    params.lastPhotoId = cursorId;
                }

                if (categoryKey !== "all" && categoryKey !== null) {
                    params.categoryId = categoryKey;
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

                setFeed((prev) => ({
                    ...prev,
                    photos: isInitial
                        ? receivedPhotos
                        : [...prev.photos, ...receivedPhotos],
                    currentLastPhotoId: nextCursorId,
                    hasNext: newHasNext,
                    initialized: true,
                }));
            } catch (error) {
                console.error("사진 목록 조회 실패:", error);
                setFeed({ hasNext: false });
            } finally {
                setLoading(false);
            }
        },
        [categoryKey, currentLastPhotoId, pageSize, setFeed]
    );

    // 처음 마운트되었거나, 카테고리 리셋 후 아직 초기화 안 되었으면 첫 페이지 로딩
    useEffect(() => {
        if (!initialized) {
            loadPhotos(true);
        }
    }, [initialized, loadPhotos]);

    // 무한 스크롤 (여기서는 scrollTop 저장 안 함)
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (loadingRef.current || !hasNextRef.current) return;

            const { scrollTop, clientHeight, scrollHeight } = container;

            if (scrollHeight - scrollTop - clientHeight < 300) {
                loadPhotos(false);
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [loadPhotos]);

    // 🔥 사진 렌더된 후, zustand에 저장된 scrollTop으로 복원
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        if (initialized && photos.length > 0) {
            requestAnimationFrame(() => {
                container.scrollTop = scrollTop || 0;
            });
        }
    }, [initialized, photos, scrollTop]);

    // 🔥 사진 클릭 시, 현재 스크롤 위치를 전역 스토어에 저장
    const handlePhotoClick = () => {
        const container = containerRef.current;
        if (container) {
            setFeed({ scrollTop: container.scrollTop });
        }
    };

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
                    <Link
                        key={photo.photoId}
                        to={`/detail/${photo.photoId}`}
                        onClick={handlePhotoClick}
                    >
                        <img
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
