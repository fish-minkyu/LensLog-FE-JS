import { useEffect } from "react";

const useScrollRestoration = (storageKey = "scroll-position") => {
    useEffect(() => {
        const saved = sessionStorage.getItem(storageKey);
        if (saved === null) return;

        const y = Number(saved);
        if (Number.isNaN(y)) return;

        // 홈 레이아웃이 모두 그려진 직후에 실행
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                window.scrollTo(0, y);
            });
        });
    }, [storageKey]);
};

export default useScrollRestoration;
