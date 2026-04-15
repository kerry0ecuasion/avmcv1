    import { useEffect, useState } from 'react';
import { pageService } from '../utils/dataService';
import Footer from './Footer';

interface ContactContent {
    phone?: string;
    operator?: string;
    email?: string;
    address?: string;
    mapEmbedUrl?: string;
}

const defaultContent: ContactContent = {
    phone: "(+32) 253-1901",
    operator: "0977-321-2615 | 0970-369-5188",
    email: "Info@visayasmed.com.ph",
    address: "VisayasMed Hospital, Cebu, Philippines",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m0!3m2!1sen!2sph!4v1234!5m2!1sen!2sph!6m8!1m7!1sqX9m3vqoPlKajP0hvNgC5w!2m2!1d10.3059147!2d123.8945713!3f37.02!4f4.43!5f0.9",
};

const ContactPage = () => {
    const [contact, setContact] = useState<ContactContent>(defaultContent);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        pageService.getPageContent("contact").then((data) => {
            if (data) setContact({ ...defaultContent, ...data });
        }).catch(err => {
            console.warn("Contact content load failed, using defaults:", err instanceof Error ? err.message : err);
        });
    }, []);

    return (
        <div className="relative scroll-smooth transition-colors duration-500 overflow-x-hidden bg-gray-50 dark:bg-gray-950">
            {/* Animated background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="blob-decoration w-[600px] h-[600px] bg-blue-400 dark:bg-blue-600 top-[-10%] right-[-10%] animate-blob" />
                <div className="blob-decoration w-[500px] h-[500px] bg-blue-300 dark:bg-blue-600 bottom-[20%] left-[-15%] animate-blob" style={{ animationDelay: '4s' }} />
            </div>

            <main className="max-w-full relative z-10">
                {/* ─── Hero Banner ─── */}
                <section className="relative py-28 lg:py-36 overflow-hidden">
                    <div className="absolute inset-0">
                        <img src="/w2.jpg" alt="Contact VisayasMed" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/75 to-gray-900/50" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent" />
                    </div>
                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            Get in Touch
                        </div>
                        <h1 className="font-display text-5xl lg:text-6xl font-bold text-white mb-4">
                            Contact <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Us</span>
                        </h1>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light">
                            We're here for you. Reach out to us for appointments, inquiries, or any healthcare needs.
                        </p>
                    </div>
                </section>

                {/* ─── Contact Content ─── */}
                <section className="relative py-20 lg:py-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Contact Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                            {/* Phone */}
                            <div className="group p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </div>
                                <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2">Phone</h3>
                                <a href={`tel:${contact.phone?.replace(/[^0-9+]/g, '')}`} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm block">{contact.phone}</a>
                                <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">{contact.operator}</p>
                            </div>

                            {/* Email */}
                            <div className="group p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2">Email</h3>
                                <a href={`mailto:${contact.email}`} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">{contact.email}</a>
                            </div>

                            {/* Address */}
                            <div className="group p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2">Address</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{contact.address}</p>
                            </div>

                            {/* Hours */}
                            <div className="group p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2">Hours</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">24/7 — Always Open</p>
                                <p className="text-green-500 dark:text-green-400 text-xs mt-1 font-semibold">Emergency Services Available</p>
                            </div>
                        </div>

                        {/* Map + Form Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Map */}
                            <div className="flex flex-col">
                                <h2 className="font-display text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                    Visit Us
                                </h2>
                                <div className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex-1">
                                    <iframe
                                        src={contact.mapEmbedUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, minHeight: '400px' }}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="VisayasMed Hospital - Street View"
                                        allowFullScreen
                                    />
                                </div>
                                <div className="flex items-center gap-2 mt-4 text-gray-500 dark:text-gray-400 text-xs font-medium">
                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    Studio view of VisayasMed Hospital entrance — Explore the building and surroundings
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="flex flex-col">
                                <h2 className="font-display text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                    Send us a Message
                                </h2>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 flex-1">
                                    <form className="space-y-5 h-full flex flex-col">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Full Name"
                                                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    placeholder="your.email@example.com"
                                                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number (Optional)</label>
                                            <input
                                                type="tel"
                                                placeholder="+63 (XXX) XXX-XXXX"
                                                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                                            <input
                                                type="text"
                                                placeholder="How can we help?"
                                                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                            <textarea
                                                placeholder="Please share your message with us..."
                                                rows={5}
                                                className="w-full h-full min-h-[120px] bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none text-sm"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 text-sm uppercase tracking-wider"
                                        >
                                            Send Message
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ContactPage;
