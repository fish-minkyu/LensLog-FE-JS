// src/hooks/usePhotoFeedStore.js
import { create } from "zustand";

const initialState = {
    photos: [],
    currentLastPhotoId: null,
    hasNext: true,
    scrollTop: 0,
    initialized: false,
    currentCategoryId: "all",
};

const usePhotoFeedStore = create((set) => ({
    ...initialState,

    // 피드 상태 부분 업데이트
    setFeed: (partialOrFn) =>
        set((state) =>
            typeof partialOrFn === "function"
                ? partialOrFn(state)
                : { ...state, ...partialOrFn }
        ),

    // 카테고리가 바뀔 때 전체 리셋 + 카테고리 변경
    resetForCategory: (categoryId) =>
        set({
            ...initialState,
            currentCategoryId: categoryId ?? "all",
        }),
}));

export default usePhotoFeedStore;
