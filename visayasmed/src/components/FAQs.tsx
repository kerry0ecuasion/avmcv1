import { useEffect, useState } from 'react';
import { faqsService } from '../utils/dataService';

interface FAQ {
    id?: string;
    q: string;
    a: string;
}

export const defaultFaqs: FAQ[] = [
    { q: "Do I need an appointment to visit VisayasMed Hospital?", a: "Walk-ins are welcome for emergency cases and urgent care. However, we recommend scheduling an appointment in advance for non-emergency consultations to minimize waiting time and ensure dedicated care. You can call us at (+32) 253-1901 or use our online booking system." },
    { q: "What should I bring for my first appointment?", a: "Please bring valid government-issued ID, health insurance card (if applicable), any relevant medical records, prescription list, and a list of any allergies. Patient intake forms are available online and at our reception desk." },
    { q: "What are your hospital hours?", a: "VisayasMed Hospital operates 24/7 for emergency services. General consultation hours are Monday-Friday 8 AM - 6 PM, Saturday 8 AM - 4 PM. Closed on Sundays and public holidays. Specific departments may have varying hours." },
    { q: "Do you accept insurance and what are your payment options?", a: "Yes, we accept major health insurance plans. We also offer flexible payment options including cash, credit/debit cards, and installment plans. Our billing department can provide detailed information about coverage and payment arrangements." },
    { q: "How can I schedule an appointment?", a: "You can schedule an appointment by: 1) Calling our main line at (+32) 253-1901, 2) Using our online booking system on this website, 3) Visiting our reception desk in person, or 4) Emailing us at Info@visayasmed.com.ph with your preferred date and time." },
    { q: "What services does VisayasMed Hospital offer?", a: "We provide comprehensive healthcare services including Family Medicine, Pediatrics, Internal Medicine, General Surgery, OB & GYNE, Cardiology, and many specialized departments. Each service is staffed with highly qualified and board-certified physicians." },
    { q: "Is emergency care available 24/7?", a: "Yes, our Emergency Department operates 24/7, 365 days a year. Our fully equipped trauma center and experienced emergency team are ready to provide immediate care for any medical emergency. Call 911 or our emergency hotline for immediate assistance." },
    { q: "How long does a typical consultation take?", a: "Regular consultations typically take 20-30 minutes, depending on the nature of your condition and whether tests are required. Initial consultations or complex cases may take longer. Your doctor will provide an estimate based on your specific needs." },
];

const FAQs = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [faqs, setFaqs] = useState<FAQ[]>(defaultFaqs);

    useEffect(() => {
        faqsService.getFaqs().then((data) => {
            if (data && data.length > 0) setFaqs(data as FAQ[]);
        }).catch(err => {
            console.warn("FAQs load failed, using defaults:", err instanceof Error ? err.message : err);
        });
    }, []);

    return (
        <section
            className="relative w-screen py-20 lg:py-28 overflow-hidden transition-colors duration-300"
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
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/85 transition-colors duration-300" />

            <div className="relative max-w-4xl mx-auto z-10 px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-14">
                    <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-blue-600 dark:text-blue-400 mb-3">Got Questions?</span>
                    <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
                    <div className="section-divider" />
                    <p className="text-gray-600 dark:text-gray-400 mt-6 font-light max-w-2xl mx-auto">
                        Find answers to common questions about our services, appointments, and hospital operations
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={faq.id || idx}
                            className={`group overflow-hidden rounded-2xl border transition-all duration-500 animate-fadeUp ${openIndex === idx
                                ? 'border-blue-200 dark:border-blue-800/50 shadow-lg shadow-blue-500/5 bg-white dark:bg-gray-900/80'
                                : 'border-gray-200/70 dark:border-gray-800/50 bg-white/60 dark:bg-gray-900/30 hover:border-gray-300 dark:hover:border-gray-700'
                                }`}
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full px-6 py-5 lg:px-8 lg:py-6 flex items-center justify-between hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all duration-300 text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${openIndex === idx
                                        ? 'bg-gradient-to-br from-blue-500 to-blue-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                        }`}>
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <h3 className={`text-base lg:text-lg font-semibold transition-colors duration-300 pr-4 ${openIndex === idx
                                        ? 'text-blue-700 dark:text-blue-400'
                                        : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400'
                                        }`}>{faq.q}</h3>
                                </div>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${openIndex === idx
                                    ? 'bg-blue-100 dark:bg-blue-900/30 rotate-180'
                                    : 'bg-gray-100 dark:bg-gray-800'
                                    }`}>
                                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            {/* Animated answer panel */}
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <div className="px-6 py-5 lg:px-8 lg:py-6 ml-12 border-t border-gray-100 dark:border-gray-800/50">
                                    <p className="text-gray-900 dark:text-gray-300 leading-relaxed font-normal">{faq.a}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Help CTA */}
                <div className="mt-14 p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-900/10 dark:to-blue-900/10 border border-blue-200/50 dark:border-blue-800/30 text-center">
                    <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">Still have questions?</h3>
                    <p className="text-gray-600 dark:text-gray-400 font-light mb-6 max-w-md mx-auto">Our team is here to help. Reach out to us anytime and we'll get back to you promptly.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="tel:+63322531901" className="btn-premium inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            Call (+32) 253-1901
                        </a>
                        <a href="mailto:Info@visayasmed.com.ph" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-full transition-all duration-300 text-sm hover:scale-105">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            Email Us
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQs;
