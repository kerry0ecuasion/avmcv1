import { useEffect, useState } from 'react';
import { statsService } from '../utils/dataService';

interface Stat {
    id?: string;
    icon: string;
    number: string;
    label: string;
    desc: string;
}

const defaultStats: Stat[] = [
    { icon: "📅", number: "70+", label: "Years of Excellence", desc: "Serving the community since 1955" },
    { icon: "👨‍⚕️", number: "150+", label: "Medical Professionals", desc: "Board-certified specialists" },
    { icon: "🏥", number: "500+", label: "Beds", desc: "Modern patient facilities" },
    { icon: "💊", number: "50K+", label: "Patients Served", desc: "Monthly patient care" },
    { icon: "🎓", number: "95%", label: "Patient Satisfaction", desc: "Consistently high ratings" },
    { icon: "🌟", number: "10+", label: "Departments", desc: "Comprehensive specialties" },
];

const StatsSection = () => {
    const [stats, setStats] = useState<Stat[]>(defaultStats);

    useEffect(() => {
        statsService.getStats().then((data) => {
            if (data && data.length > 0) setStats(data as Stat[]);
        }).catch(err => {
            console.warn("Stats load failed, using defaults:", err instanceof Error ? err.message : err);
        });
    }, []);

    return (
        <section className="relative w-screen py-20 lg:py-28 overflow-hidden transition-colors duration-300" style={{
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)',
        }}>
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16 lg:mb-20">
                    <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-blue-400 mb-3">Our Impact</span>
                    <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">By the Numbers</h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-blue-500 to-green-500 rounded-full mx-auto" />
                    <p className="text-gray-400 mt-6 font-light max-w-2xl mx-auto text-lg">
                        A trusted healthcare institution committed to delivering excellence in patient care and service
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                    {stats.map((stat, idx) => (
                        <div
                            key={stat.id || idx}
                            className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] p-8 lg:p-10 text-center hover:bg-white/[0.06] hover:border-blue-500/20 transition-all duration-500 hover:scale-[1.03] animate-slideInUp"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Hover glow backdrop */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/5 transition-all duration-500 -z-10" />
                            <div className="absolute -top-8 -right-8 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all duration-500" />

                            <div className="text-4xl lg:text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">{stat.icon}</div>
                            <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent mb-2 group-hover:from-blue-300 group-hover:to-blue-300 transition-all duration-300 counter-animation">{stat.number}</div>
                            <h3 className="text-lg font-semibold text-white mb-2">{stat.label}</h3>
                            <p className="text-sm text-gray-400 font-light">{stat.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
