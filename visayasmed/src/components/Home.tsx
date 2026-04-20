import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";
import Footer from "./Footer";
import NewsCarousel from "./NewsCarousel";
import { newsService, pageService } from "../utils/dataService";

/* ─── Animated Heartbeat SVG ─── */
const HeartbeatLine: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg
        viewBox="0 0 600 60"
        className={`w-full h-12 ${className}`}
        preserveAspectRatio="none"
    >
        <path
            d="M0,30 L120,30 L140,30 L155,8 L170,52 L185,8 L200,52 L215,30 L235,30 L600,30"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="heartbeat-svg"
        />
    </svg>
);



/* ─── Service SVG Icons ─── */
const ServiceIcon: React.FC<{ type: string }> = ({ type }) => {
    const icons: Record<string, React.ReactElement> = {
        emergency: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M12 2v20M2 12h20" /><circle cx="12" cy="12" r="10" /><path d="M9 9l6 6M15 9l-6 6" /></svg>,
        lab: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M9 3h6v7l3.2 9.6A1 1 0 0117.3 21H6.7a1 1 0 01-.9-1.4L9 10V3z" /><path d="M6 9h12" /><path d="M9 15h6" /></svg>,
        medicine: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M9 22V12h6v10" /></svg>,
        pediatrics: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><circle cx="12" cy="7" r="4" /><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" /><path d="M12 16v4" /><path d="M8 18h8" /></svg>,
        cardiology: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /><polyline points="8 12 11 15 16 10" /></svg>,
        orthopedics: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M12 2a2 2 0 012 2c0 1.4-.8 2.6-2 3.2V10l3 2-3 2v3.8c1.2.6 2 1.8 2 3.2a2 2 0 01-4 0c0-1.4.8-2.6 2-3.2V14l-3-2 3-2V7.2C10.8 6.6 10 5.4 10 4a2 2 0 012-2z" /></svg>,
        ophthalmology: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
        neurology: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M9.5 2A2.5 2.5 0 017 4.5v0A2.5 2.5 0 014.5 7H4a2 2 0 00-2 2v0a2 2 0 002 2h.5A2.5 2.5 0 017 13.5v0A2.5 2.5 0 019.5 16H10v5" /><path d="M14.5 2A2.5 2.5 0 0117 4.5v0A2.5 2.5 0 0119.5 7H20a2 2 0 012 2v0a2 2 0 01-2 2h-.5A2.5 2.5 0 0117 13.5v0A2.5 2.5 0 0114.5 16H14v5" /><path d="M10 16h4" /></svg>,
    };
    return icons[type] || null;
};

/* ─── Services Data (5 items only) ─── */
const services = [
    { iconType: "medicine",    title: "Family Medicine",    description: "Primary care for all ages — preventive, chronic, and acute", gradient: "from-blue-500 to-blue-700",    link: "/services/family-medicine" },
    { iconType: "pediatrics",  title: "Pediatrics",         description: "Specialized care for infants, children, and adolescents",   gradient: "from-violet-500 to-purple-700", link: "/services/pediatrics" },
    { iconType: "emergency",   title: "Internal Medicine", description: "Diagnosis and treatment of adult diseases and conditions",    gradient: "from-emerald-500 to-teal-700",  link: "/services/internal-medicine" },
    { iconType: "orthopedics", title: "Surgery",            description: "Advanced surgical procedures with expert surgical teams",     gradient: "from-rose-500 to-red-700",      link: "/services/surgery" },
    { iconType: "pediatrics",  title: "OB & GYNE",          description: "Comprehensive obstetrics and gynecology services",           gradient: "from-pink-500 to-rose-700",     link: "/services/ob-gyne" },
];

const defaultNewsItems = [
    { id: "1", title: "Latest Medical Breakthroughs", image: "/jeswel3.jpg", link: "https://example.com/news1", date: "Feb 14, 2026" },
    { id: "2", title: "Health Awareness Campaign", image: "/jeswel2.jpg", link: "https://example.com/news2", date: "Feb 10, 2026" },
    { id: "3", title: "New Specialists Join Team", image: "/jeswel5.jpg", link: "https://example.com/news3", date: "Feb 5, 2026" },
    { id: "4", title: "Hospital Expansion Updates", image: "/w1.jpg", link: "https://example.com/news4", date: "Jan 28, 2026" },
    { id: "5", title: "Free Medical Mission in Cebu", image: "/w2.jpg", link: "https://example.com/news5", date: "Jan 20, 2026" },
    { id: "6", title: "VisayasMed Recognized for Excellence in Patient Care", image: "/w3.jpg", link: "https://example.com/news6", date: "Jan 15, 2026" },
    { id: "7", title: "New Advanced Diagnostic Equipment Installed", image: "/jeswel3.jpg", link: "https://example.com/news7", date: "Jan 10, 2026" },
    { id: "8", title: "Community Health & Wellness Fair 2026", image: "/jeswel2.jpg", link: "https://example.com/news8", date: "Jan 5, 2026" },
];

const heroImages = [
    "/w1.jpg",
    "/w2.jpg",
    "/w3.jpg"
];

const Home: React.FC = () => {
    const [homeContent, setHomeContent] = useState<any>(null);
    const [newsItems, setNewsItems] = useState(defaultNewsItems);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentHeroSlide(prev => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    const scrollTrackRef = useRef<HTMLDivElement>(null);
    const indicatorTrackRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const isDraggingIndicator = useRef(false);
    const dragStartX = useRef(0);
    const scrollStartLeft = useRef(0);

    const onDragStart = (e: React.MouseEvent) => {
        isDragging.current = true;
        dragStartX.current = e.clientX;
        scrollStartLeft.current = scrollTrackRef.current?.scrollLeft ?? 0;
        if (scrollTrackRef.current) scrollTrackRef.current.style.cursor = 'grabbing';
    };
    const onDragMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !scrollTrackRef.current) return;
        e.preventDefault();
        scrollTrackRef.current.scrollLeft = scrollStartLeft.current - (e.clientX - dragStartX.current);
    };
    const onDragEnd = () => {
        isDragging.current = false;
        isDraggingIndicator.current = false;
        if (scrollTrackRef.current) scrollTrackRef.current.style.cursor = 'grab';
    };

    const handleIndicatorDrag = (clientX: number) => {
        if (!indicatorTrackRef.current || !scrollTrackRef.current) return;
        const rect = indicatorTrackRef.current.getBoundingClientRect();
        const width = rect.width;
        const x = Math.max(0, Math.min(clientX - rect.left, width));
        const percentage = x / width;
        
        const maxScroll = scrollTrackRef.current.scrollWidth - scrollTrackRef.current.clientWidth;
        scrollTrackRef.current.scrollLeft = percentage * maxScroll;
    };

    const onIndicatorMouseDown = (e: React.MouseEvent) => {
        isDraggingIndicator.current = true;
        handleIndicatorDrag(e.clientX);
    };

    const onGlobalMouseMove = (e: MouseEvent) => {
        if (isDraggingIndicator.current) {
            handleIndicatorDrag(e.clientX);
        }
    };

    const onGlobalMouseUp = () => {
        isDraggingIndicator.current = false;
    };

    useEffect(() => {
        window.addEventListener('mousemove', onGlobalMouseMove);
        window.addEventListener('mouseup', onGlobalMouseUp);
        return () => {
            window.removeEventListener('mousemove', onGlobalMouseMove);
            window.removeEventListener('mouseup', onGlobalMouseUp);
        };
    }, []);

    const location = useLocation();
    useScrollReveal();

    useEffect(() => {
        const track = scrollTrackRef.current;
        if (!track) return;

        const handleScroll = () => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (maxScroll <= 0) return;
            setScrollProgress((track.scrollLeft / maxScroll) * 100);
        };

        track.addEventListener('scroll', handleScroll);
        // Initial call
        handleScroll();
        
        return () => track.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        pageService.getPageContent('home').then((data) => {
            if (data) setHomeContent(data);
        }).catch(err => console.warn("Home content load failed:", err));

        newsService.getNews().then((data) => {
            if (data && data.length > 0) setNewsItems(data as typeof defaultNewsItems);
        }).catch(err => {
            console.warn("News load failed, using defaults:", err instanceof Error ? err.message : err);
        });
    }, []);

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) {
                    const nav = document.querySelector('nav');
                    const navH = nav ? (nav as HTMLElement).offsetHeight : 0;
                    const top = el.getBoundingClientRect().top + window.scrollY - navH - 12;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }, 300);
        }
    }, [location.hash]);

    return (
        <div className="relative scroll-smooth transition-colors duration-500 overflow-x-hidden bg-gray-50 dark:bg-gray-950">
            {/* Animated background mesh */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 gradient-mesh-bg" />

            {/* Subtle blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="blob-decoration w-[600px] h-[600px] bg-blue-400 dark:bg-blue-600 top-[-10%] right-[-10%]" />
                <div className="blob-decoration w-[500px] h-[500px] bg-blue-300 dark:bg-blue-600 bottom-[20%] left-[-15%]" style={{ animationDelay: '4s' }} />
                <div className="blob-decoration w-[400px] h-[400px] bg-rose-300 dark:bg-rose-600 top-[50%] right-[5%]" style={{ animationDelay: '8s' }} />
            </div>

            <main className="max-w-full relative z-10">
                {/* ═══════════════════════════════════════════════════
                    ─── HERO SECTION ───
                   ═══════════════════════════════════════════════════ */}
                <section id="home" className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center overflow-hidden">
                    {/* Background with parallax-like zoom */}
                    <div className="absolute inset-0 bg-gray-900 pointer-events-none">
                        {heroImages.map((img, idx) => (
                            <img
                                key={img}
                                src={img}
                                alt="VisayasMed Hospital"
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                                    idx === currentHeroSlide ? "opacity-100 animate-slow-zoom" : "opacity-0"
                                }`}
                            />
                        ))}
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/40 z-10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-gray-900/20 z-10" />
                        {/* Animated color wash */}
                        <div className="absolute inset-0 z-10">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/15 via-transparent to-cyan-600/10 animate-morph-gradient" />
                        </div>
                    </div>

                    {/* Floating luminous orbs */}
                    <div className="absolute top-20 right-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float-slow pointer-events-none" />
                    <div className="absolute bottom-20 left-10 w-64 h-64 bg-purple-500/15 rounded-full blur-2xl animate-float-slow pointer-events-none" style={{ animationDelay: '3s' }} />
                    <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-cyan-500/10 rounded-full blur-xl animate-float-slow pointer-events-none" style={{ animationDelay: '6s' }} />

                    {/* Animated particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(15)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full animate-float"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    animationDuration: `${4 + Math.random() * 4}s`,
                                    opacity: 0.2 + Math.random() * 0.3,
                                }}
                            />
                        ))}
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                        <div className="max-w-2xl">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-xl text-white px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase mb-5 border border-white/20 shadow-xl animate-fadeDown hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400 shadow-lg shadow-green-400/50" />
                                </span>
                                {homeContent?.heroBadge || "Trusted Since 1955"}
                            </div>

                            {/* Main heading */}
                            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-5 leading-[1.1] animate-fadeUp whitespace-pre-line">
                                {homeContent?.heroHeading1 || "Your Health,"}{" "}
                                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto] block sm:inline">
                                    {homeContent?.heroHeading2 || "Our Priority"}
                                </span>
                            </h1>

                            <p className="text-sm sm:text-base text-gray-200/90 mb-6 sm:mb-7 leading-relaxed max-w-xl animate-fadeUp font-light whitespace-pre-line" style={{ animationDelay: '0.2s' }}>
                                {homeContent?.heroSubheading || "Delivering compassionate, world-class healthcare to the Visayas region with modern facilities and expert medical professionals."}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4 sm:gap-6 animate-fadeUp" style={{ animationDelay: '0.4s' }}>
                                <a
                                    href="/doctors"
                                    className="group btn-premium px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 hover:from-blue-500 hover:via-cyan-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-500"
                                >
                                    Find a Doctor
                                    <svg className="inline-block w-5 h-5 ml-2 -mt-0.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                                <a
                                    href="/services"
                                    className="group px-8 sm:px-10 py-4 sm:py-5 bg-white/10 backdrop-blur-lg border-2 border-white/20 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase rounded-full hover:bg-white/20 hover:scale-105 hover:border-white/40 transition-all duration-500"
                                >
                                    Our Services
                                    <svg className="inline-block w-5 h-5 ml-2 -mt-0.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>

                            {/* Heartbeat line divider */}
                            <div className="mt-6 text-blue-400/40 max-w-xs animate-fadeUp" style={{ animationDelay: '0.5s' }}>
                                <HeartbeatLine />
                            </div>

                            {/* Trust indicators */}
                            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-2 animate-fadeUp" style={{ animationDelay: '0.6s' }}>
                                {[
                                    { svg: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, text: "Always Open" },
                                    { svg: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M16 3.13a4 4 0 010 7.75"/><path d="M21 21v-2a4 4 0 00-3-3.87"/></svg>, text: "150+ Specialists" },
                                    { svg: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>, text: "70+ Years" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-300 group">
                                        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">{item.svg}</div>
                                        <span className="text-sm sm:text-base font-medium">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Carousel Controls */}
                    {/* Prev arrow */}
                    <button
                        onClick={() => setCurrentHeroSlide(prev => (prev - 1 + heroImages.length) % heroImages.length)}
                        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 hover:scale-110 transition-all duration-300 shadow-lg"
                        aria-label="Previous slide"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Next arrow */}
                    <button
                        onClick={() => setCurrentHeroSlide(prev => (prev + 1) % heroImages.length)}
                        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 hover:scale-110 transition-all duration-300 shadow-lg"
                        aria-label="Next slide"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Dot indicators + scroll pill */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4">
                        {/* Dots */}
                        <div className="flex items-center gap-2.5">
                            {heroImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentHeroSlide(idx)}
                                    aria-label={`Go to slide ${idx + 1}`}
                                    className={`rounded-full transition-all duration-400 ${
                                        idx === currentHeroSlide
                                            ? "bg-white w-6 h-2"
                                            : "bg-white/40 hover:bg-white/70 w-2 h-2"
                                    }`}
                                />
                            ))}
                        </div>
                        {/* Scroll pill */}
                        <div className="hidden sm:flex flex-col items-center gap-1 animate-bounce-slow">
                            <span className="text-white/40 text-[10px] uppercase tracking-widest font-medium">Scroll</span>
                            <div className="w-6 h-10 border-2 border-white/25 rounded-full flex items-start justify-center p-1.5 hover:border-white/40 transition-colors duration-300">
                                <div className="w-1.5 h-3 bg-white/50 rounded-full animate-[float_2s_ease-in-out_infinite]" />
                            </div>
                        </div>
                    </div>
                </section>



                {/* ═══════════════════════════════════════════════════
                    ─── NEWS & EVENTS SECTION ───
                   ═══════════════════════════════════════════════════ */}
                <section id="news" aria-label="Events and News" className="reveal px-4 sm:px-6 py-10 sm:py-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-6">
                            <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-blue-600 dark:text-blue-400 mb-2">Latest Updates</span>
                            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-3">News &amp; Events</h2>
                            <div className="section-divider" />
                        </div>
                        <NewsCarousel items={newsItems} />
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════
                    ─── WHY CHOOSE VISAYASMED ───
                   ═══════════════════════════════════════════════════ */}
                <section className="reveal px-4 sm:px-6 py-10 sm:py-12 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-950/10 pointer-events-none" />
                    <div className="max-w-7xl mx-auto relative">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                            {/* Left: Image with decorative frame */}
                            <div className="order-2 lg:order-1">
                                <div className="relative">
                                    {/* Decorative accent */}
                                    <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-blue-500/30 rounded-tl-3xl pointer-events-none" />
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-blue-500/30 rounded-br-3xl pointer-events-none" />
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                                        <img
                                            src="/w2.jpg"
                                            alt="VisayasMed Hospital - Modern Healthcare Facility"
                                            className="w-full h-52 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent" />
                                        {/* Floating badge on image */}
                                        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-black dark:text-white">ISO Certified</p>
                                                    <p className="text-[10px] text-gray-500">Quality Healthcare</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Content */}
                            <div className="order-1 lg:order-2">
                                <div className="mb-4">
                                    <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-blue-600 dark:text-blue-400 mb-2">Why Choose Us</span>
                                    <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-3 whitespace-pre-line">
                                        {homeContent?.whyChooseHeading1 || "Why Choose"}{" "}
                                        <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent block sm:inline">
                                            {homeContent?.whyChooseHeading2 || "VisayasMed?"}
                                        </span>
                                    </h2>
                                    <div className="section-divider !mx-0 !ml-0" />
                                </div>

                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-5 whitespace-pre-line">
                                    {homeContent?.whyChooseDescription || "At VisayasMed, we combine decades of medical expertise with cutting-edge technology to deliver exceptional healthcare. Our commitment to patient-centered care ensures you receive the highest quality medical attention."}
                                </p>

                                <div className="space-y-1">
                                    {(homeContent?.whyChooseItems || [
                                        { title: "70+ Years of Excellence", description: "Trusted healthcare provider serving the Visayas region since 1955" },
                                        { title: "150+ Expert Specialists", description: "Highly qualified doctors across all major medical disciplines" },
                                        { title: "Advanced Technology", description: "State-of-the-art medical equipment and modern facilities" },
                                        { title: "Patient-First Approach", description: "Compassionate care tailored to your individual needs" }
                                    ]).map((item: any, idx: number) => {
                                        const defaultAccents = ["from-blue-500 to-blue-600", "from-emerald-500 to-teal-600", "from-violet-500 to-purple-600", "from-rose-500 to-pink-600"];
                                        const defaultSvgs = [
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M16 3.13a4 4 0 010 7.75"/><path d="M21 21v-2a4 4 0 00-3-3.87"/></svg>,
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6v7l3.2 9.6A1 1 0 0117.3 21H6.7a1 1 0 01-.9-1.4L9 10V3z"/><path d="M6 9h12"/></svg>,
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/><polyline points="8 12 11 15 16 10"/></svg>
                                        ];
                                        const accent = defaultAccents[idx % defaultAccents.length];
                                        const svg = defaultSvgs[idx % defaultSvgs.length];
                                        const num = (idx + 1).toString().padStart(2, '0');
                                        return (
                                        <div key={idx} className="flex items-start gap-3 group p-3 rounded-xl hover:bg-white/60 dark:hover:bg-gray-800/40 transition-all duration-300">
                                            <div className="flex-shrink-0 relative">
                                                <span className="absolute -top-1 -left-1 text-[10px] font-bold text-blue-500/40 dark:text-blue-400/40 font-display">{num}</span>
                                                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${accent} flex items-center justify-center text-white group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                                                    {svg}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-black dark:text-white text-base mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{item.title}</h3>
                                                <p className="text-gray-800 dark:text-gray-400 text-sm leading-relaxed">{item.description}</p>
                                            </div>
                                        </div>
                                    )})}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════
                    ─── SERVICES BANNER ───
                   ═══════════════════════════════════════════════════ */}
                <section className="reveal relative w-screen py-16 sm:py-20 lg:py-24 overflow-hidden" 
                    style={{ 
                        marginLeft: 'calc(-50vw + 50%)', 
                        marginRight: 'calc(-50vw + 50%)' 
                    }}
                >
                    {/* Banner Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/40 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300" />
                    
                    {/* Dot Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                        style={{
                            backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
                            backgroundSize: '32px 32px',
                        }}
                    />

                    {/* Decorative medical crosses */}
                    <svg className="absolute top-12 left-10 w-8 h-8 text-blue-200/40 dark:text-blue-800/20 pointer-events-none animate-pulse-slow" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z" />
                    </svg>
                    <svg className="absolute bottom-12 right-12 w-6 h-6 text-blue-200/30 dark:text-blue-800/15 pointer-events-none animate-pulse-slow" fill="currentColor" viewBox="0 0 24 24" style={{ animationDelay: '2s' }}>
                        <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z" />
                    </svg>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg mb-5 animate-fadeDown">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                {homeContent?.servicesBadge || "Specialized Care"}
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-4 whitespace-pre-line">{homeContent?.servicesHeading || "Our Services"}</h2>
                            <div className="section-divider" />
                            <p className="text-gray-900 dark:text-gray-400 font-light mt-6 max-w-2xl mx-auto text-lg leading-relaxed whitespace-pre-line">
                                {homeContent?.servicesDesc || "Comprehensive medical solutions delivered by experts at the heart of Cebu."}
                            </p>
                        </div>

                        {/* Carousel Track */}
                        <div className="relative">
                            {/* Fade edges */}
                            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50/50 dark:from-gray-950/50 to-transparent z-10 pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white/50 dark:from-gray-950/50 to-transparent z-10 pointer-events-none" />

                            <div
                                ref={scrollTrackRef}
                                className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 px-4 select-none scroll-smooth hide-scrollbar transition-all duration-300"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                onMouseDown={onDragStart}
                                onMouseMove={onDragMove}
                                onMouseUp={onDragEnd}
                                onMouseLeave={onDragEnd}
                            >
                                {(homeContent?.servicesHighlight || services).map((service: any, idx: number) => {
                                    const gradient = service.gradient || ["from-blue-500 to-blue-700", "from-violet-500 to-purple-700", "from-emerald-500 to-teal-700", "from-rose-500 to-red-700", "from-pink-500 to-rose-700"][idx % 5];
                                    return (
                                    <Link
                                        key={idx}
                                        to={service.link || `/services`}
                                        draggable={false}
                                        className="group flex-shrink-0 flex flex-col p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-gray-900/60 backdrop-blur-md border border-white/50 dark:border-gray-800/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 w-[240px] sm:w-[280px]"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-blue-500/20`}>
                                            <ServiceIcon type={service.iconType} />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-sm text-gray-800 dark:text-gray-400 leading-relaxed font-light mb-6 flex-1">
                                            {service.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                                            Learn More
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                    </Link>
                                )})}
                            </div>
                        </div>

                        {/* Custom Scroll Indicator */}
                        <div className="mt-10 max-w-md mx-auto px-10">
                            <div 
                                ref={indicatorTrackRef}
                                className="relative h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden cursor-pointer"
                                onMouseDown={onIndicatorMouseDown}
                            >
                                <div 
                                    className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-150 ease-out pointer-events-none"
                                    style={{ 
                                        width: '30%',
                                        left: `${(scrollProgress / 100) * 70}%`
                                    }}
                                />
                            </div>
                            <div className="mt-3 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 select-none">
                                <span>Drag scroll to explore</span>
                                <Link to="/services" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">View All</Link>
                            </div>
                        </div>
                    </div>
                </section>




                {/* ═══════════════════════════════════════════════════
                    ─── CTA Section ───
                   ═══════════════════════════════════════════════════ */}
                <section className="reveal relative w-full overflow-hidden transition-colors duration-300" style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #1e3a5f 70%, #1d4ed8 100%)',
                }}>
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

                    {/* Animated dot grid */}
                    <div className="absolute inset-0 dot-grid-pattern" />

                    {/* Decorative blobs */}
                    <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl pointer-events-none animate-float-slow" />
                    <div className="absolute bottom-20 left-10 w-48 h-48 bg-cyan-400/8 rounded-full blur-3xl pointer-events-none animate-float-slow" style={{ animationDelay: '4s' }} />

                    {/* Heartbeat line accent */}
                    <div className="absolute top-1/4 left-0 right-0 text-blue-400/10 pointer-events-none">
                        <HeartbeatLine />
                    </div>

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center relative z-10">
                        <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-blue-300 mb-3">Take the Next Step</span>
                        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                            Ready to Take Control{" "}
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">of Your Health?</span>
                        </h2>
                        <p className="text-sm sm:text-base font-light text-white mb-5 sm:mb-7 leading-relaxed max-w-2xl mx-auto">
                            Join thousands of patients who trust VisayasMed for their healthcare needs. Our experienced team is here for you.
                        </p>

                        <ul className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-5 sm:mb-7">
                            {[
                                "Experienced specialists",
                                "State-of-the-art facilities",
                                "Personalized treatment plans",
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-white/80 font-light text-sm">
                                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-400/20">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="/schedule-appointment"
                                className="btn-premium inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-all duration-300 hover:shadow-2xl hover:shadow-white/10 hover:scale-105 text-xs sm:text-sm tracking-wide"
                            >
                                Schedule Appointment
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </a>
                            <a
                                href="tel:+63322531901"
                                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 border-2 border-white/20 text-white font-bold rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105 text-xs sm:text-sm tracking-wide"
                            >
                                Call Us Now
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Home;
