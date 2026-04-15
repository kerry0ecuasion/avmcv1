import { useEffect, useState } from 'react';
import { pageService } from '../utils/dataService';

interface EmergencyContent {
    headline?: string;
    description?: string;
    hotline?: string;
    whyChooseItems?: string[];
    services?: { icon: string; title: string; desc: string }[];
}

const defaultContent: EmergencyContent = {
    headline: "Always Ready to Save Lives",
    description: "VisayasMed's Emergency Department operates 24/7, providing rapid response and expert care for all types of medical emergencies.",
    hotline: "911",
    whyChooseItems: [
        "Average door-to-doctor time: 3 minutes",
        "Advanced diagnostic imaging on-site",
        "Dedicated trauma operating rooms",
        "ICU beds with intensive monitoring",
        "Specialist consultation available 24/7",
        "Coordination with advanced hospitals if needed"
    ],
    services: [
        { icon: "🚑", title: "24/7 Emergency Response", desc: "Available round-the-clock with fully equipped ambulances and trained paramedics" },
        { icon: "🏥", title: "Trauma Center", desc: "Level I trauma center with advanced life support and surgical capabilities" },
        { icon: "⚡", title: "Rapid Assessment", desc: "Triage system with average response time under 5 minutes" },
        { icon: "👨‍⚕️", title: "Expert Team", desc: "Board-certified emergency physicians and specialized trauma surgeons" },
    ]
};

const EmergencyServices = () => {
    const [content, setContent] = useState<EmergencyContent>(defaultContent);

    useEffect(() => {
        pageService.getPageContent("emergency").then((data) => {
            if (data) setContent({ ...defaultContent, ...data });
        }).catch(err => {
            console.warn("Emergency content load failed, using defaults:", err instanceof Error ? err.message : err);
        });
    }, []);

    const services = content.services || defaultContent.services!;
    const whyChooseItems = content.whyChooseItems || defaultContent.whyChooseItems!;

    return (
        <section id="emergency" className="relative w-screen py-20 lg:py-28 overflow-hidden transition-colors duration-300" style={{
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)',
        }}>
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            <div className="absolute top-20 right-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none animate-blob" />
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none animate-blob" style={{ animationDelay: '4s' }} />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-red-500/20">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            Emergency Services
                        </div>

                        <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">{content.headline}</h2>
                        <p className="text-lg text-gray-300 leading-relaxed font-light mb-10">{content.description}</p>

                        <div className="space-y-5 mb-10">
                            {services.map((service, idx) => (
                                <div key={idx} className="group flex gap-4 items-start p-4 rounded-xl hover:bg-white/[0.03] transition-all duration-300">
                                    <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">{service.icon}</span>
                                    <div>
                                        <h4 className="font-semibold text-white mb-1">{service.title}</h4>
                                        <p className="text-sm text-gray-400 font-light leading-relaxed">{service.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Emergency hotline card */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-red-500/10 to-orange-500/10 p-6 rounded-2xl border border-red-500/20 backdrop-blur-sm">
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl" />
                            <p className="relative z-10 font-semibold text-red-400 mb-2 text-sm uppercase tracking-wider">Emergency Hotline</p>
                            <a href={`tel:${content.hotline}`} className="relative z-10 text-4xl font-bold text-white hover:text-red-400 transition-colors duration-300 font-display">{content.hotline}</a>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative bg-white/[0.03] rounded-3xl border border-white/[0.06] p-8 lg:p-10 overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl" />

                            <h3 className="font-display text-2xl font-bold text-white mb-8 relative z-10">Why Choose Our Emergency Department?</h3>
                            <ul className="space-y-4 relative z-10">
                                {whyChooseItems.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-4 group">
                                        <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-gray-300 font-light leading-relaxed group-hover:text-white transition-colors duration-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EmergencyServices;
