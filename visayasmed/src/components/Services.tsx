import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { serviceService } from '../utils/dataService';
import serviceDetailsList from '../data/serviceDetails';

interface Service {
    id?: string;
    icon: string;
    title: string;
    desc: string;
}

export const defaultServices: Service[] = [
    { icon: "family-medicine", title: "Family Medicine", desc: "Comprehensive primary care for patients of all ages, focusing on preventive medicine and health maintenance for the entire family." },
    { icon: "pediatrics", title: "Pediatrics", desc: "Specialized medical care for infants, children, and adolescents, including well-child check-ups, vaccinations, and treatment of childhood illnesses." },
    { icon: "internal-medicine", title: "Internal Medicine", desc: "Expert diagnosis and treatment of adult diseases, managing complex medical conditions including diabetes, hypertension, and heart disease." },
    { icon: "surgery", title: "Surgery", desc: "State-of-the-art surgical procedures performed by experienced surgeons, including general surgery, minimally invasive techniques, and emergency operations." },
    { icon: "ob-gyne", title: "OB & GYNE", desc: "Comprehensive women's health services including prenatal care, delivery services, gynecological examinations, and reproductive health management." }
];

// Medical SVG icons — clean, professional
const MedicalIcons: Record<string, React.JSX.Element> = {
    "family-medicine": (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
    ),
    "pediatrics": (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
        </svg>
    ),
    "internal-medicine": (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
    ),
    "surgery": (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.644-5.644a3.003 3.003 0 010-4.243l.814-.814a3.003 3.003 0 014.243 0l5.644 5.644M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
    ),
    "ob-gyne": (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
    ),
};

// Fallback cross icon
const DefaultIcon = (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const Services = () => {
    const [services, setServices] = useState<Service[]>(defaultServices);

    useEffect(() => {
        serviceService.getServices().then((data) => {
            if (data && data.length > 0) setServices(data as Service[]);
        }).catch(err => {
            console.warn("Services load failed, using defaults:", err instanceof Error ? err.message : err);
        });
    }, []);

    return (
        <section
            className="relative w-screen transition-colors duration-300 overflow-hidden"
            style={{
                marginLeft: 'calc(-50vw + 50%)',
                marginRight: 'calc(-50vw + 50%)',
            }}
        >
            {/* Background — light gradient with subtle patterns */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/40 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300" />

            {/* Decorative grid pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
                style={{
                    backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
                    backgroundSize: '32px 32px',
                }}
            />

            {/* Decorative shapes */}
            <div className="absolute top-20 -right-20 w-80 h-80 bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 -left-20 w-96 h-96 bg-indigo-200/15 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-100/20 dark:bg-sky-900/5 rounded-full blur-3xl pointer-events-none" />

            {/* Decorative cross pattern (medical) */}
            <svg className="absolute top-16 left-12 w-8 h-8 text-blue-200/40 dark:text-blue-800/20 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z" />
            </svg>
            <svg className="absolute bottom-24 right-16 w-6 h-6 text-blue-200/30 dark:text-blue-800/15 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z" />
            </svg>
            <svg className="absolute top-1/3 right-1/4 w-5 h-5 text-blue-200/25 dark:text-blue-800/10 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z" />
            </svg>

            <div className="relative max-w-7xl mx-auto z-10 px-6 lg:px-8 py-20 lg:py-28">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-md mb-5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Medical Services
                    </div>
                    <h2 className="font-display text-4xl lg:text-5xl font-bold text-black dark:text-white mb-4">Our Services</h2>
                    <div className="section-divider" />
                    <p className="text-black dark:text-gray-400 mt-6 font-semibold max-w-3xl mx-auto text-lg leading-relaxed">
                        Comprehensive healthcare services delivered by experienced medical professionals, with specialized expertise in regional health challenges
                    </p>
                </div>

                {/* Service Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                    {services.map((service, idx) => {
                        const detailMatch = serviceDetailsList.find(
                            (d) => d.title.toLowerCase() === service.title.toLowerCase()
                        );
                        const slug = detailMatch?.slug || service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        const iconKey = slug;
                        const icon = MedicalIcons[iconKey] || DefaultIcon;

                        return (
                            <div
                                key={service.id || service.title}
                                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200/70 dark:border-gray-800/70 hover:border-blue-300 dark:hover:border-blue-700/60 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-2 animate-scaleIn block"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Top accent line */}
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Hover background glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/60 group-hover:to-sky-50/40 dark:group-hover:from-blue-950/20 dark:group-hover:to-sky-950/10 transition-all duration-500 rounded-2xl" />

                                <div className="relative z-10 p-8 flex flex-col h-full">
                                    <div className="flex-1">
                                        {/* Icon */}
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-blue-500/20">
                                            {icon}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-black dark:text-white mb-3 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">
                                            {service.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-black dark:text-gray-400 leading-relaxed text-sm mb-6 font-semibold">{service.desc}</p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                        <Link to={`/services/${slug}`} className="flex-1 text-center py-2 px-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                                            Learn More
                                        </Link>
                                        <Link to="/schedule-appointment" className="flex-1 text-center py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-colors">
                                            Schedule Appointment
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom info strip */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-4 bg-white dark:bg-gray-900/80 rounded-2xl border border-gray-200/70 dark:border-gray-800/70 px-8 py-4 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-black dark:text-white">24/7 Emergency Services Available</p>
                            <p className="text-xs text-black dark:text-gray-400 font-bold">Call (+32) 253-1901 for immediate assistance</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
