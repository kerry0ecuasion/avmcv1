import React, { useEffect, useState } from 'react';
import { faqsService, inquiriesService } from '../utils/dataService';

export interface FAQItem {
    id?: string;
    question: string;
    answer: string;
    category: string;
    order: number;
    isActive: boolean;
}

export const defaultFaqs: FAQItem[] = [
    { category: "Appointments", question: "Do I need an appointment to visit VisayasMed Hospital?", answer: "Walk-ins are welcome for emergency cases and urgent care. However, we recommend scheduling an appointment in advance for non-emergency consultations to minimize waiting time and ensure dedicated care. You can call us at (+32) 253-1901 or use our online booking system.", order: 1, isActive: true },
    { category: "Appointments", question: "What should I bring for my first appointment?", answer: "Please bring valid government-issued ID, health insurance card (if applicable), any relevant medical records, prescription list, and a list of any allergies. Patient intake forms are available online and at our reception desk.", order: 2, isActive: true },
    { category: "General", question: "What are your hospital hours?", answer: "VisayasMed Hospital operates 24/7 for emergency services. General consultation hours are Monday-Friday 8 AM - 6 PM, Saturday 8 AM - 4 PM. Closed on Sundays and public holidays. Specific departments may have varying hours.", order: 3, isActive: true },
    { category: "Billing", question: "Do you accept insurance and what are your payment options?", answer: "Yes, we accept major health insurance plans. We also offer flexible payment options including cash, credit/debit cards, and installment plans. Our billing department can provide detailed information about coverage and payment arrangements.", order: 4, isActive: true },
    { category: "Appointments", question: "How can I schedule an appointment?", answer: "You can schedule an appointment by: 1) Calling our main line at (+32) 253-1901, 2) Using our online booking system on this website, 3) Visiting our reception desk in person, or 4) Emailing us at Info@visayasmed.com.ph with your preferred date and time.", order: 5, isActive: true },
    { category: "General", question: "What services does VisayasMed Hospital offer?", answer: "We provide comprehensive healthcare services including Family Medicine, Pediatrics, Internal Medicine, General Surgery, OB & GYNE, Cardiology, and many specialized departments. Each service is staffed with highly qualified and board-certified physicians.", order: 6, isActive: true },
    { category: "General", question: "Is emergency care available 24/7?", answer: "Yes, our Emergency Department operates 24/7, 365 days a year. Our fully equipped trauma center and experienced emergency team are ready to provide immediate care for any medical emergency. Call 911 or our emergency hotline for immediate assistance.", order: 7, isActive: true },
    { category: "Appointments", question: "How long does a typical consultation take?", answer: "Regular consultations typically take 20-30 minutes, depending on the nature of your condition and whether tests are required. Initial consultations or complex cases may take longer. Your doctor will provide an estimate based on your specific needs.", order: 8, isActive: true },
];

const FAQs = () => {
    const [openId, setOpenId] = useState<string | null>(null);
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [formState, setFormState] = useState({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                let data = await faqsService.getFaqs();
                if (!data || data.length === 0 || data.some((d: any) => d.question === "What are your clinic hours?")) {
                    console.log("Seeding real FAQs...");
                    for (const d of data) {
                        if (d.id) await faqsService.deleteFaq(d.id);
                    }
                    for (const faq of defaultFaqs) {
                        await faqsService.addFaq(faq);
                    }
                    data = await faqsService.getFaqs();
                }
                const activeFaqs = data.filter((d: any) => d.isActive !== false) as FAQItem[];
                activeFaqs.sort((a, b) => a.order - b.order);
                setFaqs(activeFaqs);
            } catch (err) {
                console.warn("FAQs load failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setToast(null);

        try {
            await inquiriesService.addInquiry({
                name: formState.name,
                email: formState.email,
                subject: formState.subject,
                message: formState.message,
            });
            
            // Simulating EmailJS Auto-reply
            console.log(`Sending EmailJS auto-reply to ${formState.email}`);

            setToast({ message: "Your message has been sent! We'll get back to you soon.", type: "success" });
            setFormState({ name: "", email: "", subject: "General Inquiry", message: "" });
            
            setTimeout(() => setToast(null), 5000);
        } catch (error) {
            console.error("Failed to submit inquiry:", error);
            setToast({ message: "Failed to send message. Please try again later.", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section
            className="relative w-screen py-16 lg:py-20 overflow-hidden transition-colors duration-300"
            style={{
                backgroundImage: "url('/mback.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat',
                marginLeft: 'calc(-50vw + 50%)',
                marginRight: 'calc(-50vw + 50%)',
            }}
        >
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/90 transition-colors duration-300" />

            <div className="relative max-w-4xl mx-auto z-10 px-6 lg:px-10">
                {/* Header */}
                <div className="mb-12">
                    <h2 className="text-3xl lg:text-4xl font-medium text-slate-800 dark:text-slate-100 mb-2">Find answers to common questions about our services, appointments, and hospital operations</h2>
                    <div className="w-12 h-1 bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500 rounded-full" />
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full" /></div>
                ) : (
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div
                                key={faq.id || idx}
                                className="group border border-slate-200/70 dark:border-gray-700/50 rounded-xl overflow-hidden hover:border-sky-300 dark:hover:border-sky-600 transition-all duration-300 hover:shadow-md dark:hover:shadow-lg/20 animate-fadeUp"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                {/* Question Button */}
                                <button
                                    onClick={() => setOpenId(openId === faq.id ? null : faq.id!)}
                                    className="w-full px-6 py-5 lg:px-8 lg:py-6 flex items-center justify-between bg-white dark:bg-gray-800/50 hover:bg-sky-50/50 dark:hover:bg-sky-900/10 transition-all duration-300 text-left"
                                >
                                    <h3 className="text-base lg:text-lg font-medium text-slate-900 dark:text-slate-50 group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors duration-300 pr-4">
                                        {faq.question}
                                    </h3>
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-sky-100/70 dark:bg-sky-900/30 flex items-center justify-center transition-all duration-300 ${openId === faq.id ? 'rotate-180 bg-sky-200 dark:bg-sky-800' : ''}`}>
                                        <svg
                                            className="w-4 h-4 text-sky-600 dark:text-sky-400 transition-transform duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                    </div>
                                </button>

                                {/* Answer */}
                                {openId === faq.id && (
                                    <div className="px-6 py-5 lg:px-8 lg:py-6 bg-gradient-to-b from-sky-50/30 to-transparent dark:from-sky-900/10 dark:to-transparent border-t border-slate-200/70 dark:border-gray-700/50 animate-fadeUp">
                                        <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Inquiry Form CTA */}
                <div className="mt-20 p-8 md:p-12 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl">
                    <div className="text-center mb-10">
                        <h3 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">Still have questions?</h3>
                        <p className="text-gray-600 dark:text-gray-400">Our team is here to help. Send us a message and we'll reply shortly.</p>
                    </div>

                    <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                <input required type="text" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" placeholder="Juan Dela Cruz" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                <input required type="email" value={formState.email} onChange={e => setFormState({...formState, email: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" placeholder="juan@example.com" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                            <select value={formState.subject} onChange={e => setFormState({...formState, subject: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow cursor-pointer appearance-none">
                                <option>General Inquiry</option>
                                <option>Appointment</option>
                                <option>Services</option>
                                <option>Complaint</option>
                                <option>Suggestion</option>
                            </select>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Message</label>
                                <span className={`text-xs ${formState.message.length > 500 ? 'text-red-500' : 'text-gray-500'}`}>{formState.message.length} / 500</span>
                            </div>
                            <textarea required maxLength={500} value={formState.message} onChange={e => setFormState({...formState, message: e.target.value})} rows={5} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow resize-none" placeholder="How can we assist you today?" />
                        </div>

                        <button disabled={isSubmitting || formState.message.length > 500} type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? "Sending..." : "Send Message"}
                        </button>

                        {toast && (
                            <div className={`p-4 rounded-lg text-center font-medium ${toast.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                {toast.message}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default FAQs;
