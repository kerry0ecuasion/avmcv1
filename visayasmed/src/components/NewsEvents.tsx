import React, { useEffect, useState, useRef, useCallback } from 'react';
import Footer from './Footer';
import { newsService } from '../utils/dataService';

interface NewsItem {
    id: string;
    category: string;
    title: string;
    description: string;
    date: string;
    sourceUrl: string;
    sourceName: string;
    imageUrl: string;
    isFeatured: boolean;
    isActive: boolean;
}

const CATEGORIES = [
    { id: "hospital-news", label: "Hospital Announcements", subtitle: "Latest updates from VisayasMed", badge: "Hospital News", color: "bg-blue-600", text: "text-blue-600 dark:text-blue-400" },
    { id: "health-tips", label: "Health Tips & Wellness", subtitle: "Expert advice for a healthier life", badge: "Health Tips", color: "bg-emerald-600", text: "text-emerald-600 dark:text-emerald-400" },
    { id: "community-events", label: "Community Outreach", subtitle: "Engaging with our community", badge: "Community Event", color: "bg-purple-600", text: "text-purple-600 dark:text-purple-400" },
    { id: "screenings", label: "Health Screening Schedule", subtitle: "Free and discounted screenings near you", badge: "Health Screening", color: "bg-red-600", text: "text-red-600 dark:text-red-400" },
    { id: "seminars", label: "Public Health Seminars", subtitle: "Learn from our medical experts", badge: "Seminar", color: "bg-orange-500", text: "text-orange-600 dark:text-orange-400" }
];

const INITIAL_DATA = [
  { category: "hospital-news", title: "VisayasMed Unveils New State-of-the-Art MRI Facility", description: "To enhance diagnostic capabilities, VisayasMed has acquired a new 3T MRI machine, offering faster and clearer imaging for patients.", date: "May 10, 2026", sourceUrl: "https://pna.gov.ph", sourceName: "Philippine News Agency", imageUrl: "/w1.jpg", isFeatured: true, isActive: true },
  { category: "hospital-news", title: "DOH Recognizes VisayasMed for Excellence in Patient Safety", description: "The Department of Health awarded VisayasMed a 5-star rating for its strict adherence to infection control and patient safety protocols.", date: "Apr 28, 2026", sourceUrl: "https://doh.gov.ph", sourceName: "DOH Philippines", imageUrl: "/jeswel2.jpg", isFeatured: false, isActive: true },
  { category: "hospital-news", title: "VisayasMed Partners with LGU for Free Medical Missions", description: "In an effort to bring healthcare closer to the marginalized, VisayasMed signs an agreement to conduct monthly medical missions across Cebu.", date: "Apr 15, 2026", sourceUrl: "https://mb.com.ph", sourceName: "Manila Bulletin Health", imageUrl: "/jeswel3.jpg", isFeatured: false, isActive: true },
  
  { category: "health-tips", title: "5 Simple Ways to Lower Your Blood Pressure Naturally", description: "Discover lifestyle changes that can help you maintain a healthy blood pressure, from reducing sodium to regular exercise.", date: "May 5, 2026", sourceUrl: "https://mayoclinic.org", sourceName: "Mayo Clinic", imageUrl: "/w2.jpg", isFeatured: false, isActive: true },
  { category: "health-tips", title: "Understanding the Warning Signs of Diabetes", description: "Early detection is key. Learn the most common early symptoms of Type 2 Diabetes and when you should consult a doctor.", date: "Apr 20, 2026", sourceUrl: "https://healthline.com", sourceName: "Healthline", imageUrl: "/jeswel5.jpg", isFeatured: false, isActive: true },
  { category: "health-tips", title: "Mental Health: Coping with Stress in the Modern Workplace", description: "World Health Organization experts share actionable advice on how to manage anxiety and prevent burnout.", date: "Apr 10, 2026", sourceUrl: "https://who.int", sourceName: "WHO Philippines", imageUrl: "/w3.jpg", isFeatured: false, isActive: true },
  
  { category: "community-events", title: "Cebu City Health Fair & Free Consultations", description: "Join us at the Cebu City Sports Complex for a weekend of free checkups, vital signs monitoring, and health education.", date: "Jun 15, 2026", sourceUrl: "https://cebucity.gov.ph", sourceName: "Cebu City Government", imageUrl: "/w1.jpg", isFeatured: false, isActive: true },
  { category: "community-events", title: "Blood Donation Drive: Be a Hero Today", description: "Donate blood and save lives. Partnering with the Red Cross, we are hosting a blood drive at the VisayasMed main lobby.", date: "Jun 22, 2026", sourceUrl: "https://ro7.doh.gov.ph", sourceName: "DOH Region 7", imageUrl: "/jeswel2.jpg", isFeatured: false, isActive: true },
  { category: "community-events", title: "PhilHealth Konsulta Registration Caravan", description: "Get help registering for the PhilHealth Konsulta package to avail of free consultations and discounted medicines.", date: "Jul 5, 2026", sourceUrl: "https://philhealth.gov.ph", sourceName: "PhilHealth", imageUrl: "/w2.jpg", isFeatured: false, isActive: true },
  
  { category: "screenings", title: "Discounted Breast Cancer Screening Month", description: "Avail of a 30% discount on mammograms throughout October. Early detection saves lives.", date: "Oct 1, 2026", sourceUrl: "https://philcancer.org.ph", sourceName: "Philippine Cancer Society", imageUrl: "/jeswel3.jpg", isFeatured: false, isActive: true },
  { category: "screenings", title: "Free Hypertension Check & Counseling", description: "Walk-in patients at the Outpatient Department can receive free blood pressure screening and basic counseling.", date: "May 20, 2026", sourceUrl: "https://doh.gov.ph", sourceName: "DOH Philippines", imageUrl: "/w3.jpg", isFeatured: false, isActive: true },
  { category: "screenings", title: "Prostate Screening Drive for Men over 50", description: "Partnering with PhilHealth, we offer subsidized PSA tests for men aged 50 and above.", date: "Jun 10, 2026", sourceUrl: "https://philhealth.gov.ph", sourceName: "PhilHealth", imageUrl: "/jeswel5.jpg", isFeatured: false, isActive: true },
  
  { category: "seminars", title: "Navigating Cardiovascular Health Post-Pandemic", description: "A public health seminar featuring top cardiologists discussing heart health maintenance.", date: "May 25, 2026", sourceUrl: "https://pma.com.ph", sourceName: "Philippine Medical Association", imageUrl: "/w1.jpg", isFeatured: false, isActive: true },
  { category: "seminars", title: "Nutrition Fundamentals: Eating Right for Your Age", description: "Learn the basics of balanced nutrition across different life stages from registered dietitians.", date: "Jun 5, 2026", sourceUrl: "https://upm.edu.ph", sourceName: "UP Manila", imageUrl: "/w2.jpg", isFeatured: false, isActive: true },
  { category: "seminars", title: "Advances in Internal Medicine 2026", description: "An open forum discussing recent breakthroughs in treatments for common internal ailments.", date: "Jul 12, 2026", sourceUrl: "https://pcp.org.ph", sourceName: "Philippine College of Physicians", imageUrl: "/jeswel2.jpg", isFeatured: false, isActive: true }
];

/* ── CAROUSEL COMPONENT ─────────────────────────────────────────── */
const CategoryCarousel: React.FC<{ categoryId: string; items: NewsItem[] }> = ({ categoryId, items }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const catInfo = CATEGORIES.find(c => c.id === categoryId)!;
    
    // Auto-play logic
    useEffect(() => {
        if (items.length <= 1 || isHovered) return;
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [items.length, isHovered, currentIndex]);

    const handleNext = useCallback(() => {
        if (!trackRef.current) return;
        const nextIndex = (currentIndex + 1) % items.length;
        setCurrentIndex(nextIndex);
        scrollToIndex(nextIndex);
    }, [currentIndex, items.length]);

    const handlePrev = () => {
        if (!trackRef.current) return;
        const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        setCurrentIndex(prevIndex);
        scrollToIndex(prevIndex);
    };

    const scrollToIndex = (index: number) => {
        if (!trackRef.current) return;
        const cardWidth = trackRef.current.children[0]?.clientWidth || 0;
        trackRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    };

    if (items.length === 0) return null;

    return (
        <section id={`section-${categoryId}`} className="py-12 border-t border-gray-200 dark:border-white/10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">{catInfo.label}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{catInfo.subtitle}</p>
                </div>
                
                {items.length > 1 && (
                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                        <button onClick={handlePrev} className="p-3 rounded-full bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/15 text-gray-800 dark:text-white transition-colors border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={handleNext} className="p-3 rounded-full bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/15 text-gray-800 dark:text-white transition-colors border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                )}
            </div>

            <div 
                className="relative overflow-hidden rounded-2xl p-1"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div 
                    ref={trackRef}
                    className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {items.map((item, idx) => (
                        <div key={item.id || idx} className="min-w-[100%] md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] snap-start shrink-0 flex flex-col bg-white dark:bg-[#0f172a] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 group transition-all duration-300 hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-blue-500/10 hover:border-gray-300 dark:hover:border-white/20">
                            {/* Image */}
                            <div className="w-full aspect-[16/10] bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-700">No Image</div>
                                )}
                                <div className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full text-white shadow-lg ${catInfo.color}`}>
                                    {catInfo.badge}
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 line-clamp-2 leading-relaxed flex-1">
                                    {item.description}
                                </p>
                                
                                <div className="text-xs text-gray-500 dark:text-gray-500 mb-4 flex flex-col gap-1.5 font-medium">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {item.date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                        {item.sourceName}
                                    </div>
                                </div>
                                
                                <a 
                                    href={item.sourceUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className={`inline-flex items-center gap-2 font-bold text-sm uppercase tracking-wider transition-colors mt-auto w-fit group/link ${catInfo.text} hover:text-gray-900 dark:hover:text-white`}
                                >
                                    {categoryId === "screenings" || categoryId === "seminars" ? "Register / Learn More" : "Read More"}
                                    <svg className="w-4 h-4 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots */}
            {items.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {items.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => { setCurrentIndex(idx); scrollToIndex(idx); }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-blue-600 dark:bg-blue-500 w-6' : 'bg-gray-300 dark:bg-white/20 hover:bg-gray-400 dark:hover:bg-white/40'}`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

/* ── MAIN PAGE COMPONENT ────────────────────────────────────────── */
const NewsEvents: React.FC = () => {
    const [items, setItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [featuredIndex, setFeaturedIndex] = useState(0);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const fetched = await newsService.getNews();
                if (fetched.length === 0) {
                    // Seed database
                    console.log("Seeding initial news data...");
                    for (const item of INITIAL_DATA) {
                        await newsService.addNews(item);
                    }
                    const newFetched = await newsService.getNews();
                    setItems(newFetched as NewsItem[]);
                } else {
                    setItems(fetched as NewsItem[]);
                }
            } catch (error) {
                console.error("Failed to fetch news", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
        window.scrollTo(0, 0);
    }, []);

    // Featured articles rotation
    const featuredItems = items.filter(i => i.isFeatured && i.isActive);
    useEffect(() => {
        if (featuredItems.length <= 1) return;
        const timer = setInterval(() => {
            setFeaturedIndex(prev => (prev + 1) % featuredItems.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [featuredItems.length]);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(`section-${id}`);
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const activeItems = items.filter(i => i.isActive);
    const filteredItems = activeItems.filter(i => 
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        i.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const featured = featuredItems[featuredIndex] || activeItems[0];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] font-sans flex flex-col">
            
            <main className="flex-1 pt-24 pb-20">
                {/* Hero Banner */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6">
                            News & Events
                        </h1>
                        <p className="text-lg md:text-xl text-blue-800 dark:text-blue-200 max-w-2xl mx-auto font-light">
                            Stay informed with the latest updates, expert health tips, and community events from VisayasMed.
                        </p>
                    </div>

                    {/* Filter Tabs & Search */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 border-b border-gray-200 dark:border-white/10 pb-6">
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                            {CATEGORIES.map(cat => (
                                <button 
                                    key={cat.id} 
                                    onClick={() => scrollToSection(cat.id)}
                                    className="px-4 py-2 rounded-full bg-white dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-white text-sm font-semibold transition-colors border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none"
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full lg:w-72">
                            <input 
                                type="text" 
                                placeholder="Search articles..." 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white rounded-full pl-10 pr-4 py-2.5 shadow-sm dark:shadow-none focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                            />
                            <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-32">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            {/* Featured Article - Remains Dark Overlay to keep text readable on top of image */}
                            {featured && !searchQuery && (
                                <div className="relative w-full rounded-3xl overflow-hidden mb-20 group">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/80 to-transparent z-10" />
                                    <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply z-10" />
                                    
                                    <img 
                                        src={featured.imageUrl || "/w1.jpg"} 
                                        alt={featured.title} 
                                        className="w-full h-[500px] md:h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105" 
                                    />
                                    
                                    <div className="absolute bottom-0 left-0 right-0 z-20 p-8 md:p-12 lg:p-16 flex flex-col items-start max-w-4xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-600 text-white">
                                                Featured Story
                                            </span>
                                            <span className="text-blue-200 text-sm font-semibold">{featured.date}</span>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                                            {featured.title}
                                        </h2>
                                        <p className="text-lg text-gray-300 mb-8 line-clamp-2 max-w-3xl">
                                            {featured.description}
                                        </p>
                                        <a 
                                            href={featured.sourceUrl}
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-8 py-3.5 bg-white text-blue-900 font-bold rounded-full hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-xl shadow-white/10"
                                        >
                                            Read Full Story
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                        </a>
                                    </div>
                                    
                                    {/* Featured Indicators */}
                                    {featuredItems.length > 1 && (
                                        <div className="absolute bottom-8 right-8 md:right-12 z-20 flex gap-2">
                                            {featuredItems.map((_, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => setFeaturedIndex(idx)}
                                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === featuredIndex ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/60'}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Category Carousels */}
                            <div className="space-y-12">
                                {CATEGORIES.map(cat => {
                                    const catItems = filteredItems.filter(i => i.category === cat.id);
                                    return <CategoryCarousel key={cat.id} categoryId={cat.id} items={catItems} />;
                                })}
                                
                                {filteredItems.length === 0 && (
                                    <div className="text-center py-20 text-gray-500">
                                        <p className="text-xl">No articles found matching "{searchQuery}".</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default NewsEvents;
