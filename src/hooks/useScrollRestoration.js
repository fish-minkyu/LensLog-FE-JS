import { useEffect } from "react";

const useScrollRestoration = (storageKey = "scroll-position") => {
    useEffect(() => {
        const saved = sessionStorage.getItem(storageKey);
        if (saved === null) return;

        const y = Number(saved);
        if (Number.isNaN(y)) return;

        // Masonry 재정렬이 끝날 때까지 반복해서 scrollTo 실행
        let frame = 0;

        const restore = () => {
            frame++;
            window.scrollTo(0, y);

            // 10프레임 동안 scrollTo 반복 → Masonry layout shift도 전부 이김
            if (frame < 10) {
                requestAnimationFrame(restore);
            }
        };

        requestAnimationFrame(restore);
    }, [storageKey]);
};

export default useScrollRestoration;
