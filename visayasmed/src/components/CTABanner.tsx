import { useEffect, useState } from 'react';
import { pageService } from '../utils/dataService';

interface CTAContent {
    heading?: string;
    description?: string;
    features?: string[];
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    emergencyNote?: string;
}

const defaultContent: CTAContent = {
    heading: "Ready to Take Control of Your Health?",
    description: "Join thousands of patients who trust VisayasMed for their healthcare needs. Our experienced team is ready to provide you with compassionate, world-class medical care.",
    features: [
        "Experienced specialists available 24/7",
        "State-of-the-art facilities and technology",
        "Personalized treatment plans for your needs",
    ],
    primaryButtonText: "Schedule Appointment",
    primaryButtonHref: "/schedule-appointment",
    secondaryButtonText: "Call Us Now",
    secondaryButtonHref: "tel:+63322531901",
    emergencyNote: "Emergency? Call 911 for immediate assistance"
};

const CTABanner = () => {
    const [content, setContent] = useState<CTAContent>(defaultContent);

    useEffect(() => {
        pageService.getPageContent("cta").then((data) => {
            if (data) setContent({ ...defaultContent, ...data });
        }).catch(err => {
            console.warn("CTA content load failed, using defaults:", err instanceof Error ? err.message : err);
        });
    }, []);

    const features = content.features || defaultContent.features!;

    return (
        <section className="relative overflow-hidden py-20 lg:py-28 transition-colors duration-300">
            {/* Premium gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-700 to-blue-800 dark:from-blue-900 dark:via-blue-900 dark:to-blue-950" />

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-blob" />
                <div className="absolute bottom-0 -left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full" />
            </div>

            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px',
            }} />

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="text-white">
                        <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-blue-200 mb-4">Take the Next Step</span>
                        <h2 className="font-display text-4xl lg:text-5xl font-bold mb-6 leading-tight">{content.heading}</h2>
                        <p className="text-lg font-light text-white/80 mb-8 leading-relaxed">{content.description}</p>
                        <ul className="space-y-4 mb-10">
                            {features.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-white/90 font-light">
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-4 flex flex-col items-center md:items-end">
                        <a
                            href={content.primaryButtonHref || defaultContent.primaryButtonHref}
                            className="btn-premium w-full md:w-auto inline-flex items-center justify-center px-10 py-5 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:scale-105 text-base tracking-wide"
                        >
                            {content.primaryButtonText}
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                        <a
                            href={content.secondaryButtonHref || defaultContent.secondaryButtonHref}
                            className="w-full md:w-auto inline-flex items-center justify-center px-10 py-5 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:shadow-2xl hover:scale-105 text-base tracking-wide"
                        >
                            {content.secondaryButtonText}
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </a>
                        <p className="text-center text-white/50 font-light text-sm pt-3">{content.emergencyNote}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTABanner;
