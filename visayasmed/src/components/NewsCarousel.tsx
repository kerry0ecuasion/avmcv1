import React, { useState, useEffect, useRef, useCallback } from "react";

interface NewsItem {
    id: string;
    title: string;
    description?: string;
    image: string;
    link: string;
    date: string;
}

interface NewsCarouselProps {
    items: NewsItem[];
}

const CARD_GAP = 24;
const SCROLL_SPEED = 0.5;

const NewsCarousel: React.FC<NewsCarouselProps> = ({ items }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>(0);
    const scrollPos = useRef(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, scroll: 0 });
    const [cardWidth, setCardWidth] = useState(380);

    useEffect(() => {
        const updateCardWidth = () => {
            setCardWidth(window.innerWidth < 640 ? 260 : 380);
        };
        updateCardWidth();
        window.addEventListener('resize', updateCardWidth);
        return () => window.removeEventListener('resize', updateCardWidth);
    }, []);

    const extendedItems = [...items, ...items, ...items];
    const singleSetWidth = items.length * (cardWidth + CARD_GAP);

    const animate = useCallback(() => {
        if (!trackRef.current || isPaused || isDragging) {
            animationRef.current = requestAnimationFrame(animate);
            return;
        }

        scrollPos.current += SCROLL_SPEED;

        if (scrollPos.current >= singleSetWidth) {
            scrollPos.current -= singleSetWidth;
        }

        trackRef.current.style.transform = `translateX(-${scrollPos.current}px)`;
        animationRef.current = requestAnimationFrame(animate);
    }, [isPaused, isDragging, singleSetWidth]);

    useEffect(() => {
        animationRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationRef.current);
    }, [animate]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragStart.current = { x: e.clientX, scroll: scrollPos.current };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const delta = dragStart.current.x - e.clientX;
        scrollPos.current = dragStart.current.scroll + delta;
        if (scrollPos.current < 0) scrollPos.current += singleSetWidth;
        if (scrollPos.current >= singleSetWidth) scrollPos.current -= singleSetWidth;
        if (trackRef.current) {
            trackRef.current.style.transform = `translateX(-${scrollPos.current}px)`;
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsPaused(true);
        dragStart.current = { x: e.touches[0].clientX, scroll: scrollPos.current };
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const delta = dragStart.current.x - e.touches[0].clientX;
        scrollPos.current = dragStart.current.scroll + delta;
        if (scrollPos.current < 0) scrollPos.current += singleSetWidth;
        if (scrollPos.current >= singleSetWidth) scrollPos.current -= singleSetWidth;
        if (trackRef.current) {
            trackRef.current.style.transform = `translateX(-${scrollPos.current}px)`;
        }
    };

    const handleTouchEnd = () => setIsPaused(false);

    const scrollByCards = (direction: number) => {
        const target = scrollPos.current + direction * (cardWidth + CARD_GAP);
        const startPos = scrollPos.current;
        const distance = target - startPos;
        const duration = 500;
        let startTime: number | null = null;

        const easeInOutCubic = (t: number) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeInOutCubic(progress);

            scrollPos.current = startPos + distance * eased;
            if (scrollPos.current < 0) scrollPos.current += singleSetWidth;
            if (scrollPos.current >= singleSetWidth) scrollPos.current -= singleSetWidth;

            if (trackRef.current) {
                trackRef.current.style.transform = `translateX(-${scrollPos.current}px)`;
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    };

    if (items.length === 0) return null;

    return (
        <div className="relative">
            {/* Navigation Arrows */}
            <button
                onClick={() => scrollByCards(-1)}
                className="absolute -left-1 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-3 lg:-translate-x-5 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-gray-800 shadow-xl border border-gray-200/50 dark:border-gray-600/50 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:scale-110 z-20 backdrop-blur-sm"
                aria-label="Previous news"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={() => scrollByCards(1)}
                className="absolute -right-1 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-3 lg:translate-x-5 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-gray-800 shadow-xl border border-gray-200/50 dark:border-gray-600/50 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:scale-110 z-20 backdrop-blur-sm"
                aria-label="Next news"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Carousel Track */}
            <div
                className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => { setIsPaused(false); setIsDragging(false); }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    ref={trackRef}
                    className="flex will-change-transform"
                    style={{ gap: `${CARD_GAP}px` }}
                >
                    {extendedItems.map((item, idx) => (
                        <a
                            key={`${item.id}-${idx}`}
                            href={item.link || "#"}
                            target={item.link ? "_blank" : undefined}
                            rel={item.link ? "noopener noreferrer" : undefined}
                            className="group relative flex-shrink-0 flex flex-col bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100/80 dark:border-gray-700/50 transition-all duration-500 hover:-translate-y-2"
                            style={{ width: `${cardWidth}px` }}
                            onClick={(e) => {
                                if (isDragging) e.preventDefault();
                            }}
                            draggable={false}
                        >
                            {/* Date badge */}
                            {item.date && (
                                <div className="px-5 sm:px-6 pt-5 pb-0">
                                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 dark:text-blue-400">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="uppercase tracking-wide">{item.date}</span>
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex flex-col flex-1 p-5 sm:p-6">
                                <h3 className="font-display font-semibold text-gray-800 dark:text-white text-base sm:text-[15px] leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                    {item.title}
                                </h3>
                                {item.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 mb-3">
                                        {item.description}
                                    </p>
                                )}

                                <div className="mt-auto">
                                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-blue-50 to-blue-100/80 dark:from-blue-900/30 dark:to-blue-800/20 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-700/30 group-hover:from-blue-600 group-hover:to-blue-500 group-hover:text-white dark:group-hover:from-blue-500 dark:group-hover:to-blue-400 transition-all duration-300 shadow-sm group-hover:shadow-blue-500/20">
                                        Read More
                                        <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            {/* Bottom accent line */}
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsCarousel;
