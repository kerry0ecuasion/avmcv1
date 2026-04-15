import { useEffect, useState, useRef, useCallback } from 'react';
import { pageService } from '../utils/dataService';

interface AboutContent {
    heritageTitle?: string;
    heritageDesc?: string;
    patientCenteredTitle?: string;
    patientCenteredText?: string;
    commitmentItems?: string[];
    tagline?: string;
    missionText?: string;
    visionText?: string;
    coreValues?: { name: string; desc: string }[];
    accreditedPartners?: string[];
    hmos?: { name: string; initials: string; color: string; logo: string | null; }[];
}

const defaultContent: AboutContent = {
    heritageTitle: "Seven Decades of Trusted Care",
    heritageDesc: "Since 1955, VisayasMed Hospital has served the community with unwavering commitment to excellence in healthcare.",
    patientCenteredTitle: "Patient-Centered Excellence",
    patientCenteredText: "We provide a convenient and personalized approach to healthcare, supported by well-equipped facilities and competent medical professionals dedicated to your wellness.",
    commitmentItems: [
        "Delivering compassionate, personalized healthcare to every patient",
        "Maintaining medical excellence through continuous professional development",
        "Creating a healing environment that promotes wellness and recovery"
    ],
    tagline: "\"Trusted care across generations — personalized, modern, and compassionate.\"",
    missionText: "To provide a patient-centered healing experience through quality medical care, by competent professionals and modern facilities in a conducive healing environment so patients may live a healthier, fuller and more productive lives.",
    visionText: "VisayasMed Hospital will be the hospital of choice for convenient, conducive, and patient-centered healing experience by 2025.",
    coreValues: [
        { name: "Sense of Urgency", desc: "Getting things done promptly and efficiently." },
        { name: "Integrity", desc: "Upholding honesty and ethical standards in all we do." },
        { name: "Compassion", desc: "Caring for patients with empathy and understanding." },
        { name: "Excellence", desc: "Striving for the highest quality in patient care and service." },
        { name: "Innovation", desc: "Embracing new ideas and continuous improvement." },
        { name: "Respect", desc: "Honoring the dignity and rights of every individual." },
    ],
    accreditedPartners: [
        "APPLE ONE", "APPLE ONE MACTAN", "BRILLIANT METAL CRAFT", "BUILD IT", "CEBU BIONIC",
        "CEBU PEOPLE'S COOP", "FOUNT OF LIFE (SUPPLIER)", "INTRANET TRADE", "LACSON & LACSON",
        "MCWD - METROPOLITAN CEBU WATER DISTRICT", "SUPREA", "TIMEX", "USDI",
        "VENRAY CONSTRUCTION", "PCSO"
    ]
};



const valueColors = [
    { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-rose-600 dark:text-amber-400', border: 'border-amber-200/50 dark:border-amber-700/30' },
    { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200/50 dark:border-blue-700/30' },
    { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200/50 dark:border-rose-700/30' },
    { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200/50 dark:border-violet-700/30' },
    { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-green-400', border: 'border-emerald-200/50 dark:border-emerald-700/30' },
    { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200/50 dark:border-blue-700/30' },
];

/* ─── HMO Ticker Carousel ─── */
interface HmoItem { name: string; initials: string; color: string; logo: string | null; }

const HmoTicker: React.FC<{ hmoList: HmoItem[] }> = ({ hmoList }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<number>(0);
    const scrollPos = useRef(0);
    const [paused, setPaused] = useState(false);
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, scroll: 0 });
    const ITEM_W = 160; // px per item slot
    const GAP = 32;
    const singleW = hmoList.length * (ITEM_W + GAP);
    const extended = [...hmoList, ...hmoList, ...hmoList];
    const SPEED = 0.6;

    const animate = useCallback(() => {
        if (!trackRef.current || paused || isDragging.current) {
            animRef.current = requestAnimationFrame(animate);
            return;
        }
        scrollPos.current += SPEED;
        if (scrollPos.current >= singleW) scrollPos.current -= singleW;
        trackRef.current.style.transform = `translateX(-${scrollPos.current}px)`;
        animRef.current = requestAnimationFrame(animate);
    }, [paused, singleW]);

    useEffect(() => {
        animRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animRef.current);
    }, [animate]);

    const shift = (dir: number) => {
        const target = scrollPos.current + dir * (ITEM_W + GAP) * 3;
        const start = scrollPos.current;
        const dist = target - start;
        const dur = 400;
        let t0: number | null = null;
        const step = (ts: number) => {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / dur, 1);
            const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
            scrollPos.current = start + dist * e;
            if (scrollPos.current < 0) scrollPos.current += singleW;
            if (scrollPos.current >= singleW) scrollPos.current -= singleW;
            if (trackRef.current) trackRef.current.style.transform = `translateX(-${scrollPos.current}px)`;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const onMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        dragStart.current = { x: e.clientX, scroll: scrollPos.current };
    };
    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        const d = dragStart.current.x - e.clientX;
        scrollPos.current = dragStart.current.scroll + d;
        if (scrollPos.current < 0) scrollPos.current += singleW;
        if (scrollPos.current >= singleW) scrollPos.current -= singleW;
        if (trackRef.current) trackRef.current.style.transform = `translateX(-${scrollPos.current}px)`;
    };
    const onMouseUp = () => { isDragging.current = false; };

    return (
        <div className="mb-12 sm:mb-24">
            {/* Heading */}
            <div className="text-center mb-8">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-2">Accredited HMOs</h2>
                <div className="section-divider" />
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
                    Don't see your HMO? Contact our Billing Department for assistance.
                </p>
            </div>

            {/* Ticker banner */}
            <div className="relative flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md overflow-hidden">
                {/* Left label */}
                <div className="flex-shrink-0 flex items-center justify-center px-5 sm:px-7 py-5 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 self-stretch">
                    <span className="text-xs sm:text-sm font-black uppercase tracking-[0.18em] text-gray-800 dark:text-gray-100 whitespace-nowrap">
                        Accepted<br />Here
                    </span>
                </div>

                {/* Prev arrow */}
                <button
                    onClick={() => shift(-1)}
                    className="flex-shrink-0 w-8 h-full flex items-center justify-center text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 z-10 px-1"
                    aria-label="Previous"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Scrolling track */}
                <div
                    className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing select-none py-4"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => { setPaused(false); isDragging.current = false; }}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                >
                    <div
                        ref={trackRef}
                        className="flex will-change-transform items-center"
                        style={{ gap: `${GAP}px` }}
                    >
                        {extended.map((hmo, idx) => (
                            <div
                                key={`${hmo.name}-${idx}`}
                                className="flex-shrink-0 flex flex-col items-center gap-1.5 group"
                                style={{ width: `${ITEM_W}px` }}
                                title={hmo.name}
                            >
                                {/* Logo / initials */}
                                <div className="h-12 flex items-center justify-center w-full">
                                    {hmo.logo ? (
                                        <>
                                            <img
                                                src={hmo.logo}
                                                alt={hmo.name}
                                                className="max-h-12 max-w-[120px] object-contain group-hover:scale-110 transition-transform duration-300"
                                                draggable={false}
                                                onError={(e) => {
                                                    const img = e.currentTarget as HTMLImageElement;
                                                    img.style.display = 'none';
                                                    const fb = img.nextElementSibling as HTMLElement;
                                                    if (fb) fb.style.display = 'flex';
                                                }}
                                            />
                                            <div className={`hidden w-11 h-11 rounded-full bg-gradient-to-br ${hmo.color} items-center justify-center shadow`}>
                                                <span className="text-white font-bold text-xs">{hmo.initials}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${hmo.color} flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300`}>
                                            <span className="text-white font-bold text-xs">{hmo.initials}</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 text-center leading-tight line-clamp-2 px-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {hmo.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next arrow */}
                <button
                    onClick={() => shift(1)}
                    className="flex-shrink-0 w-8 h-full flex items-center justify-center text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 z-10 px-1"
                    aria-label="Next"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

const About = ({ compact = false }: { compact?: boolean }) => {
    const [content, setContent] = useState<AboutContent>(defaultContent);

    useEffect(() => {
        pageService.getPageContent("about").then((data) => {
            if (data) setContent({ ...defaultContent, ...data });
        }).catch(err => {
            console.warn("About content load failed, using defaults:", err instanceof Error ? err.message : err);
        });
    }, []);

    const coreValues = content.coreValues || defaultContent.coreValues!;
    const accreditedPartners = content.accreditedPartners || defaultContent.accreditedPartners!;
    const commitmentItems = content.commitmentItems || defaultContent.commitmentItems!;

    const HMO_LIST = content.hmos && content.hmos.length > 0 ? content.hmos : [
        { name: 'Carewellness Plus', initials: 'CW', color: 'from-blue-500 to-blue-700', logo: null },
        { name: 'Etiga', initials: 'ET', color: 'from-blue-500 to-blue-700', logo: '/hmo/etiqa.png' },
        { name: 'Cocolife', initials: 'CC', color: 'from-rose-500 to-rose-700', logo: '/hmo/cocolife.png' },
        { name: 'Global Doctors', initials: 'GD', color: 'from-amber-500 to-amber-700', logo: null },
        { name: "Cebu People's Cooperative", initials: 'CP', color: 'from-indigo-500 to-indigo-700', logo: '/hmo/cebu-coop.png' },
        { name: 'PhilAm Health', initials: 'PA', color: 'from-green-500 to-emerald-700', logo: null },
        { name: 'EastWest Healthcare', initials: 'EW', color: 'from-blue-500 to-blue-700', logo: '/hmo/eastwest.png' },
        { name: 'Fortune Care', initials: 'FC', color: 'from-orange-500 to-orange-700', logo: '/hmo/fortune-care.png' },
        { name: 'Health Maintenance, Inc.', initials: 'HM', color: 'from-sky-500 to-sky-700', logo: '/hmo/hmi.png' },
        { name: 'InLife Wellcare Health Care', initials: 'IW', color: 'from-violet-500 to-violet-700', logo: '/hmo/inlife.webp' },
        { name: 'InLife Datacare', initials: 'ID', color: 'from-purple-500 to-purple-700', logo: '/hmo/inlife.webp' },
        { name: 'AVEGA', initials: 'AV', color: 'from-green-500 to-green-700', logo: '/hmo/avega.png' },
        { name: 'MEDOCare Health System, Inc.', initials: 'MC', color: 'from-red-500 to-red-700', logo: '/hmo/medocare.png' },
        { name: 'Life & Health Insurance', initials: 'LH', color: 'from-lime-500 to-lime-700', logo: '/hmo/life-health.webp' },
        { name: 'Maxicare', initials: 'MX', color: 'from-blue-600 to-blue-800', logo: '/hmo/maxicare.png' },
        { name: 'MediCard', initials: 'MD', color: 'from-blue-600 to-blue-800', logo: '/hmo/medicard.png' },
        { name: 'Medilink Network, Inc.', initials: 'ML', color: 'from-fuchsia-500 to-fuchsia-700', logo: '/hmo/medilink.png' },
        { name: 'PhilCare', initials: 'PC', color: 'from-blue-600 to-blue-800', logo: '/hmo/philcare.png' },
        { name: 'USDI', initials: 'US', color: 'from-yellow-500 to-yellow-700', logo: null },
        { name: 'Kaiser International', initials: 'KI', color: 'from-pink-500 to-pink-700', logo: '/hmo/kaiser.png' },
        { name: 'MultiCare Healthcare', initials: 'MT', color: 'from-emerald-600 to-emerald-800', logo: null },
        { name: 'Amaril', initials: 'AM', color: 'from-orange-600 to-orange-800', logo: null },
        { name: 'WellCare Health Maintenance', initials: 'WC', color: 'from-sky-600 to-sky-800', logo: '/hmo/wellcare.png' },
        { name: 'Intellicare', initials: 'IC', color: 'from-indigo-600 to-indigo-800', logo: '/hmo/intellicare.png' },
    ];

    return (
        <section
            id="about"
            className="relative w-full min-h-screen transition-colors duration-300 overflow-hidden"
        >
            {/* Static Background */}
            <div className="absolute inset-0">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: "url('/mback.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'scroll',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
            </div>

            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/85 transition-colors duration-300" />

            {/* Decorative blobs */}
            <div className="absolute top-40 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-40 left-0 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-28">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-blue-600 dark:text-blue-400 mb-3">Who We Are</span>
                    <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-4">About VisayasMed Hospital</h2>
                    <div className="section-divider" />
                </div>

                {/* Heritage + Patient-Centered Section */}
                <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-16 items-start mb-12 sm:mb-20">
                    {/* Images */}
                    <div className="w-full lg:w-1/2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="img-reveal col-span-2">
                                <img src="/w1.jpg" alt="VisayasMed Hospital facility" className="rounded-2xl shadow-xl object-cover h-40 sm:h-64 w-full" />
                            </div>
                            <div className="img-reveal">
                                <img src="/w2.jpg" alt="Medical team providing care" className="rounded-2xl shadow-lg object-cover h-32 sm:h-48 w-full" />
                            </div>
                            <div className="img-reveal">
                                <img src="/w3.jpg" alt="Patient-centered care" className="rounded-2xl shadow-lg object-cover h-32 sm:h-48 w-full" />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div className="border-l-4 border-gradient-to-b from-blue-500 to-blue-500 pl-6 py-2" style={{ borderImage: 'linear-gradient(to bottom, #06b6d4, #14b8a6) 1' }}>
                            <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-black dark:text-white mb-2">{content.heritageTitle}</h3>
                            <p className="text-base sm:text-lg text-gray-900 dark:text-gray-300 font-light leading-relaxed">{content.heritageDesc}</p>
                        </div>

                        {/* Patient-Centered card */}
                        <div className="relative overflow-hidden p-6 rounded-2xl bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/20 shadow-sm">
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-400/10 rounded-full blur-xl" />
                            <div className="flex gap-4 items-start relative z-10">
                                <div className="flex-shrink-0 mt-1 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-500 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-black dark:text-white mb-2">{content.patientCenteredTitle}</h4>
                                    <p className="text-gray-800 dark:text-gray-300 leading-relaxed font-light">{content.patientCenteredText}</p>
                                </div>
                            </div>
                        </div>

                        {/* Commitment items */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-black dark:text-white">Our Commitment</h4>
                            <ul className="space-y-3">
                                {commitmentItems.map((item, idx) => (
                                    <li key={idx} className="flex gap-3 items-start group">
                                        <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-gray-800 dark:text-gray-300 leading-relaxed font-light">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <p className="text-lg text-gray-500 dark:text-gray-400 italic font-display border-t border-gray-200 dark:border-gray-700/50 pt-6">{content.tagline}</p>
                    </div>
                </div>

                {!compact && <>
                    {/* Mission & Vision */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 mb-16 sm:mb-24 mt-8">
                        <div className="group relative">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v20M2 12h20" /><circle cx="12" cy="12" r="10" /></svg>
                            </div>
                            <h3 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h3>
                            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-light">{content.missionText}</p>
                        </div>

                        <div className="group relative">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                            </div>
                            <h3 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Vision</h3>
                            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-light">{content.visionText}</p>
                        </div>
                    </div>

                    {/* Core Values */}
                    <div className="mb-12 sm:mb-24">
                        <div className="text-center mb-14">
                            <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-blue-600 dark:text-blue-400 mb-3">Our Foundation</span>
                            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Core Values</h2>
                            <div className="section-divider" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {coreValues.map((v, i) => {
                                const color = valueColors[i % valueColors.length];
                                return (
                                    <div
                                        key={v.name}
                                        className="group relative flex flex-col items-center text-center transition-all duration-500"
                                    >
                                        <div className="p-4 sm:p-6 w-full">
                                            {/* Icon container removed as requested */}

                                            {/* Value name with color */}
                                            <h3 className={`text-xl sm:text-2xl font-bold mb-4 ${color.text}`}>{v.name}</h3>

                                            {/* Description */}
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light max-w-sm mx-auto">{v.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Accredited HMOs — Ticker Carousel */}
                    <HmoTicker hmoList={HMO_LIST} />

                    {/* Accredited Partners */}
                    <div>
                        <div className="text-center mb-14">
                            <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-blue-600 dark:text-blue-400 mb-3">Our Partners</span>
                            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-4">Accredited Partners</h2>
                            <div className="section-divider" />
                            <p className="text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto mt-4">Trusted collaborations with leading organizations committed to excellence in healthcare</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                            {accreditedPartners.map((company) => (
                                <div key={company} className="group relative overflow-hidden">
                                    <div className="relative h-full px-6 py-5 lg:px-8 lg:py-6 rounded-2xl bg-white/70 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 hover:border-blue-300/50 dark:hover:border-blue-700/50 transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-blue-50/50 dark:group-hover:from-blue-900/10 dark:group-hover:to-blue-900/10 transition-all duration-500 rounded-2xl" />
                                        <p className="relative text-sm lg:text-base text-gray-700 dark:text-gray-300 font-medium text-center leading-relaxed tracking-wide group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">{company}</p>
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-blue-500 rounded-full group-hover:w-10 transition-all duration-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>}
            </div>
        </section>
    );
};

export default About;
