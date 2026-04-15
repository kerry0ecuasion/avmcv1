import { useEffect, useState } from 'react';
import { testimonialsService } from '../utils/dataService';

interface Testimonial {
    id?: string;
    name: string;
    role: string;
    text: string;
    rating: number;
    icon: string;
}

const defaultTestimonials: Testimonial[] = [
    { name: "Sarah Johnson", role: "Patient", text: "I had a wonderful experience at VisayasMed. The staff was incredibly caring and professional. Dr. Santos took time to explain everything in detail.", rating: 5, icon: "👩" },
    { name: "Michael Reyes", role: "Patient", text: "The facilities are state-of-the-art and the wait times are minimal. I felt well cared for from check-in to discharge. Highly recommend!", rating: 5, icon: "👨" },
    { name: "Dr. Maria Cruz", role: "Referring Physician", text: "VisayasMed provides exceptional patient care and seamless coordination. My patients receive excellent outcomes and highly value the experience.", rating: 5, icon: "👨‍⚕️" },
    { name: "Jennifer Lee", role: "Patient", text: "Outstanding service! The emergency team was quick and efficient. I felt safe and well-informed throughout my care.", rating: 5, icon: "👩" },
    { name: "Robert Santos", role: "Patient", text: "Clean facilities, kind staff, and knowledgeable doctors. VisayasMed is my trusted healthcare provider. Ten out of ten!", rating: 5, icon: "👨" },
    { name: "Ana Gabriel", role: "Patient", text: "The maternity services were exceptional. The entire team made me feel comfortable and supported during my pregnancy journey.", rating: 5, icon: "👩" },
];

const Testimonials = ({ compact = false }: { compact?: boolean }) => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);

    useEffect(() => {
        testimonialsService.getTestimonials().then((data) => {
            if (data && data.length > 0) setTestimonials(data as Testimonial[]);
        }).catch(err => {
            console.warn("Testimonials load failed, using defaults:", err instanceof Error ? err.message : err);
        });
    }, []);

    return (
        <section
            className={`relative w-screen overflow-hidden transition-colors duration-300 ${compact ? 'py-12 sm:py-16' : 'py-20 lg:py-28'}`}
            style={{
                marginLeft: 'calc(-50vw + 50%)',
                marginRight: 'calc(-50vw + 50%)',
            }}
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
            <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto z-10 px-6 lg:px-8">
                {/* Header */}
                <div className={`text-center ${compact ? 'mb-8 sm:mb-12' : 'mb-16'}`}>
                    <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-blue-600 dark:text-blue-400 mb-3">Testimonials</span>
                    <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">What Our Patients Say</h2>
                    <div className="section-divider" />
                    <p className="text-gray-600 dark:text-gray-400 mt-6 font-light max-w-2xl mx-auto text-lg">
                        Real experiences from patients and healthcare professionals who trust VisayasMed for their care
                    </p>
                </div>

                {/* Testimonial Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, idx) => (
                        <div
                            key={testimonial.id || idx}
                            className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 p-8 hover:border-blue-300/50 dark:hover:border-blue-700/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-2 animate-slideInUp"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Quote mark */}
                            <div className="absolute top-4 right-6 text-6xl font-display text-blue-500/10 dark:text-blue-400/10 leading-none select-none">"</div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-5">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Testimonial text */}
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light mb-8 relative z-10 italic">"{testimonial.text}"</p>

                            {/* Author */}
                            <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-blue-500/20">
                                    {testimonial.icon}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{testimonial.name}</h4>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
