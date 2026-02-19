// ...existing code...
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Services from "./Services";
import FindDoctor from "./FindDoctor";
import About from "./About";
import Footer from "./Footer";
import StatsSection from "./StatsSection";
import Testimonials from "./Testimonials";
import Accreditations from "./Accreditations";
import EmergencyServices from "./EmergencyServices";
import FAQs from "./FAQs";
import CTABanner from "./CTABanner";

const Slideshow: React.FC<{ images?: string[]; intervalMs?: number }> = ({
    images = [
        "/w1.jpg",
        "/w2.jpg",
        "/w3.jpg",
    ],
    intervalMs = 5000,
}) => {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs);
        return () => clearInterval(id);
    }, [images.length, intervalMs]);

    return (
        <div className="w-full max-w-6xl mx-auto relative rounded-lg overflow-hidden shadow-lg">
            <img
                key={index}
                src={images[index]}
                alt={`Event ${index + 1}`}
                className="w-full h-80 sm:h-96 lg:h-120 object-cover animate-fadeZoom"
            />
            <button
                aria-label="Previous"
                onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-3 rounded-full shadow transition-colors duration-300"
            >
                ‹
            </button>
            <button 
                aria-label="Next"
                onClick={() => setIndex((i) => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-3 rounded-full shadow transition-colors duration-300"
            >
                ›
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                    <button
                        key={i}
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={() => setIndex(i)}
                        className={`w-4 h-4 rounded-full ${i === index ? "bg-sky-600 dark:bg-sky-400" : "bg-white/70 dark:bg-gray-600/70"} shadow transition-colors duration-300`}
                    />
                ))}
            </div>
        </div>
    );
};

const Home: React.FC = () => {
    const eventImages = [
        "/w1.jpg",
        "/w2.jpg",
        "/w3.jpg",
    ];

    // News and tabloid items with image and link
    const newsItems = [
        {
            id: 1,
            title: "Latest Medical Breakthroughs",
            image: "/news1.jpg",
            link: "https://example.com/news1",
            date: "Feb 14, 2026"
        },
        {
            id: 2,
            title: "Health Awareness Campaign",
            image: "/news2.jpg",
            link: "https://example.com/news2",
            date: "Feb 10, 2026"
        },
        {
            id: 3,
            title: "New Specialists Join Team",
            image: "/news3.jpg",
            link: "https://example.com/news3",
            date: "Feb 5, 2026"
        },
        {
            id: 4,
            title: "Hospital Expansion Updates",
            image: "/news4.jpg",
            link: "https://example.com/news4",
            date: "Jan 28, 2026"
        },
    ];

    const sections = ["home", "about", "find-doctor", "services", "news", "faqs", "contact"];
    const [active, setActive] = useState<string>("home");
    const [visible, setVisible] = useState<Record<string, boolean>>({
        home: true,
        about: true,
        'find-doctor': true,
        services: true
    });

    const scrollToId = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const nav = document.querySelector('nav');
            const navH = nav ? (nav as HTMLElement).offsetHeight : 0;
            const top = el.getBoundingClientRect().top + window.scrollY - navH - 12; // small padding
            window.scrollTo({ top, behavior: 'smooth' });
            setActive(id);
        }
    };

    const animClassFor = (id: string) => {
        if (id === 'home') return 'opacity-100 translate-x-0';
        const idx = sections.indexOf(id);
        const fromLeft = idx % 2 === 0; // even -> slide from left
        const hidden = fromLeft ? '-translate-x-8 opacity-0' : 'translate-x-8 opacity-0';
        return visible[id] ? 'opacity-100 translate-x-0' : hidden;
    };

    useEffect(() => {
        const obsOptions = { root: null, rootMargin: "0px", threshold: 0.3 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const id = entry.target.id;
                if (!id) return;
                if (entry.isIntersecting) {
                    setActive(id);
                    setVisible((v) => ({ ...v, [id]: true }));
                }
            });
        }, obsOptions);

        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="scroll-smooth transition-colors duration-300" style={{
            backgroundImage: "url('/mback.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
        }}>
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/90 transition-colors duration-300 pointer-events-none"></div>
            
            {/* Top Header with Contact Info */}
            <header className="relative z-10 bg-sky-600 dark:bg-sky-800 text-white py-3 shadow-md transition-colors duration-300">
                <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-col sm:flex-row gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Phone:</span>
                            <span>(+32) 253-1901</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Operator:</span>
                            <span>0977-321-2615 | 0970-369-5188</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Email:</span>
                            <a href="mailto:Info@visayasmed.com.ph" className="hover:underline">
                                Info@visayasmed.com.ph
                            </a>
                        </div>
                    </div>
                    <Link
                        to="/admin/login"
                        className="bg-white dark:bg-gray-800 text-sky-600 dark:text-sky-300 px-4 py-1 rounded font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 text-sm inline-block transition-colors duration-300"
                    >
                        Admin
                    </Link>
                </div>
            </header>

            <Navbar active={active} onNavigate={scrollToId} />

            <main className="max-w-full relative z-10">
                <section id="home"></section>

                <section id="news" aria-label="Events and News" className={`px-6 py-6 transform transition-all duration-700 ${animClassFor('news')}`}>
                    <div className="max-w-6xl mx-auto">
                        {/* Grid Layout: Slideshow Left, News Boxes Right */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Slideshow - Takes up 2 columns on large screens */}
                            <div className="lg:col-span-2">
                                <Slideshow images={eventImages} intervalMs={6000} />
                            </div>

                            {/* News Boxes - Takes up 1 column on large screens, displayed as 2x2 grid */}
                            <div className="lg:col-span-1">
                                <div className="grid grid-cols-2 gap-4">
                                    {newsItems.map((item) => (
                                        <a
                                            key={item.id}
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                        >
                                            {/* Image Container */}
                                            <div className="relative w-full h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect fill="%23e5e7eb" width="300" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="14" fill="%236b7280" font-family="sans-serif"%3ENews Image%3C/text%3E%3C/svg%3E';
                                                    }}
                                                />
                                                {/* Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>

                                            {/* Content Overlay */}
                                            <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <h3 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-300 text-xs">{item.date}</p>
                                            </div>

                                            {/* Bottom Bar */}
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-sky-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="px-6 max-w-6xl mx-auto">



                <About />

                <EmergencyServices />

                <StatsSection />

                <section id="find-doctor" className={`py-10 transform transition-all duration-700 ${animClassFor('find-doctor')}`}>
                    <FindDoctor />
                </section>

                <section id="services" className="py-10">
                    <Services />
                </section>

                <Testimonials />

                <Accreditations />

                <section id="faqs" className={`py-10 transform transition-all duration-700 ${animClassFor('faqs')}`}>
                    <div className="max-w-4xl mx-auto">
                        <FAQs />
                    </div>
                </section>

                {/* duplicate about removed */}

                <div id="manage-photos" style={{ height: 1 }} />
                </div>

                <CTABanner />
            </main>

            <Footer />
        </div>
    );
};

export default Home;
// ...existing code...