import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";
import Footer from "./Footer";
import NewsCarousel from "./NewsCarousel";
import QuickLinks from "./QuickLinks";
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
                <section id="home" className="relative w-full h-[50vh] sm:h-[60vh] md:h-screen flex items-center overflow-hidden">
                    {/* Background with parallax-like zoom */}
                    <div className="absolute inset-0 bg-gray-900 pointer-events-none">
                        {heroImages.map((img, idx) => (
                            <img
                                key={img}
                                src={img}
                                alt="VisayasMed Hospital"
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                                    idx === currentHeroSlide ? "opacity-100" : "opacity-0"
                                }`}
                            />
                        ))}
                    </div>

                    {/* Bottom Hero Content */}
                    <div className="absolute bottom-8 sm:bottom-16 md:bottom-24 w-full px-6 sm:px-12 lg:px-20 z-10 pointer-events-none flex flex-col items-center text-center">
                        <div className="max-w-5xl w-full pointer-events-auto" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.9)) drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.8))' }}>
                            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight tracking-tight">
                                <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">VisayasMed Hospital</span>
                                <br className="hidden md:block" /> offers comprehensive, patient-centered medical care in Cebu City.
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 font-medium leading-relaxed max-w-3xl mx-auto tracking-wide">
                                With nearly 70 years of experience, we provide advanced facilities and expert doctors for your health and well-being.
                            </p>
                        </div>
                    </div>

                    {/* Carousel Controls */}
                    {/* Prev arrow */}
                    <button
                        onClick={() => setCurrentHeroSlide(prev => (prev - 1 + heroImages.length) % heroImages.length)}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center text-white/50 hover:text-white hover:-translate-x-1 transition-all duration-300 p-2"
                        aria-label="Previous slide"
                    >
                        <svg className="w-8 h-8 sm:w-12 sm:h-12"    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Next arrow */}
                    <button
                        onClick={() => setCurrentHeroSlide(prev => (prev + 1) % heroImages.length)}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center text-white/50 hover:text-white hover:translate-x-1 transition-all duration-300 p-2"
                        aria-label="Next slide"
                    >
                        <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
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

                    </div>
                </section>

                <QuickLinks />

                {/* ═══════════════════════════════════════════════════
                    ─── NEWS & EVENTS SECTION ───
                   ═══════════════════════════════════════════════════ */}
                <section id="news" aria-label="Events and News" className="reveal px-4 sm:px-6 py-10 sm:py-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-6">
                            <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-blue-600 dark:text-blue-400 mb-2">Quick Access</span>
                            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-3">Promotions &amp; Quick Links</h2>
                            <div className="section-divider" />
                        </div>
                        <NewsCarousel items={newsItems} />
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
                    ─── NEWS & UPDATES SECTION ───
                   ═══════════════════════════════════════════════════ */}
                <section className="py-16 sm:py-24 bg-slate-50 dark:bg-gray-950">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 sm:mb-12 gap-4">
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-blue-700 dark:text-blue-400">
                                News & Updates
                            </h2>
                            <Link to="/news" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-md">
                                See all updates
                            </Link>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {newsItems.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="flex flex-col group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
                                    <div className="w-full aspect-[16/10] overflow-hidden">
                                        <img src={item.image || "/w1.jpg"} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-[17px] font-bold text-blue-800 dark:text-blue-300 mb-1.5 leading-snug group-hover:text-blue-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-[11px] text-blue-500 dark:text-blue-400 mb-3 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            {item.date}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 line-clamp-3 leading-relaxed flex-1">
                                            {(item as any).description || (item.title.length > 30 ? `VisayasMed continues to advance its medical capabilities with ${item.title.toLowerCase()}...` : "Pioneering medical innovation with purpose. VisayasMed makes its mark in the healthcare landscape.")}
                                        </p>
                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider hover:text-blue-800 dark:hover:text-blue-300 transition-colors mt-auto group/link">
                                            Read article
                                            <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </a>
                                    </div>
                                </div>
                            ))}
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
