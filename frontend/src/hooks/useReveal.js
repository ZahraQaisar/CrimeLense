import { useEffect, useRef } from 'react';

/**
 * Adds 'visible' class to ref element once it enters the viewport.
 * Uses IntersectionObserver — fires ONCE, never resets.
 */
const useReveal = (threshold = 0.08) => {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('visible');
                    observer.disconnect(); // never reset
                }
            },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);
    return ref;
};

export default useReveal;
