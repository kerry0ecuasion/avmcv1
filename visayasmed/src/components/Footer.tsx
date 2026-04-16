import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { pageService } from '../utils/dataService';

interface ContactContent {
    copyright?: string;
    phone?: string;
    operator?: string;
    email?: string;
    address?: string;
    mapEmbedUrl?: string;
}

const defaultContent: ContactContent = {
    copyright: "© 2026 VisayasMed Hospital. All rights reserved. | Trusted care across generations.",
    phone: "(+32) 253-1901",
    operator: "0977-321-2615 | 0970-369-5188",
    email: "Info@visayasmed.com.ph",
    address: "VisayasMed Hospital, Cebu, Philippines",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m0!3m2!1sen!2sph!4v1234!5m2!1sen!2sph!6m8!1m7!1sqX9m3vqoPlKajP0hvNgC5w!2m2!1d10.3059147!2d123.8945713!3f37.02!4f4.43!5f0.9",
};

const Footer = () => {
    const [contact, setContact] = useState<ContactContent>(defaultContent);
    const [formSent, setFormSent] = useState(false);
    const location = useLocation();

    useEffect(() => {
        pageService.getPageContent("contact").then((data) => {
            if (data) setContact({ ...defaultContent, ...data });
        }).catch(err => {
            console.warn("Contact content load failed, using defaults:", err instanceof Error ? err.message : err);
        });
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setFormSent(true);
        setTimeout(() => setFormSent(false), 3000);
    };

    return (
        <footer className="relative z-10 transition-colors duration-300 overflow-hidden">
            {/* Main footer */}
            <div className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
                {/* Top gradient divider */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

                {/* Decorative elements */}
                <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-20 left-0 w-72 h-72 bg-blue-500/3 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-4">

                    {/* ═══════════════ CONTACT US SECTION ═══════════════ */}
                    {/* Hide Contact Us section when on Contact page or Home page */}
                    {location.pathname !== '/contact' && location.pathname !== '/' && (
                        <div className="mb-6">
                            {/* Section heading */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <h3 className="font-display text-lg font-bold text-white">Contact Us</h3>
                                    <p className="text-gray-500 text-xs font-light">Get in touch — we're here for you 24/7</p>
                                </div>
                            </div>

                            {/* Contact Info Chips */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                                {/* Phone */}
                                <a href={`tel:${contact.phone?.replace(/[^0-9+]/g, '')}`} className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-blue-500/30 hover:bg-white/[0.06] transition-all duration-300">
                                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                                        <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white text-xs font-semibold">Phone</p>
                                        <p className="text-gray-400 text-[10px] font-light truncate">{contact.phone}</p>
                                    </div>
                                </a>

                                {/* Email */}
                                <a href={`mailto:${contact.email}`} className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-blue-500/30 hover:bg-white/[0.06] transition-all duration-300">
                                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                                        <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white text-xs font-semibold">Email</p>
                                        <p className="text-gray-400 text-[10px] font-light truncate">{contact.email}</p>
                                    </div>
                                </a>

                                {/* Address */}
                                <div className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white text-xs font-semibold">Address</p>
                                        <p className="text-gray-400 text-[10px] font-light truncate">{contact.address}</p>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white text-xs font-semibold">24/7 Open</p>
                                        <p className="text-emerald-400 text-[10px] font-medium">Emergency Available</p>
                                    </div>
                                </div>
                            </div>

                            {/* Map + Quick Form */}
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                                {/* Map — takes 2 cols */}
                                <div className="lg:col-span-2 relative overflow-hidden rounded-lg border border-white/[0.06]">
                                    <iframe
                                        src={contact.mapEmbedUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, minHeight: '200px' }}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="VisayasMed Hospital - Street View"
                                        allowFullScreen
                                    />
                                    {/* Map overlay label */}
                                    <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-gray-950/90 to-transparent">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-2 h-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            <span className="text-[9px] text-gray-400 font-light">VisayasMed Hospital Entrance</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Contact Form — takes 3 cols */}
                                <div className="lg:col-span-3 rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-white text-sm font-semibold">Send a Quick Message</h4>
                                        {formSent && (
                                            <span className="text-emerald-400 text-xs font-medium flex items-center gap-1 animate-pulse">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                Sent!
                                            </span>
                                        )}
                                    </div>
                                    <form onSubmit={handleSubmit} className="space-y-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                placeholder="Your Name"
                                                required
                                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-2 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300"
                                            />
                                            <input
                                                type="email"
                                                placeholder="Email Address"
                                                required
                                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-2 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <input
                                                type="tel"
                                                placeholder="Phone (Optional)"
                                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-2 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Subject"
                                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-2 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300"
                                            />
                                        </div>
                                        <textarea
                                            placeholder="Your message..."
                                            rows={2}
                                            required
                                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-2 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                                        />
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5"
                                        >
                                            Send Message
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─── Divider ─── */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-6" />

                    {/* ─── Quick Links Section ─── */}
                    <div className="pb-4 mb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Hospital Info */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <img src="/VMlogo.png" alt="VisayasMed Logo" className="w-8 h-8" />
                                    <div>
                                        <h3 className="font-display text-base font-bold text-white">VisayasMed</h3>
                                        <span className="text-xs text-gray-500 uppercase tracking-wider">Hospital</span>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-xs font-light leading-relaxed mb-3">
                                    Delivering compassionate, world-class healthcare to the Visayas region since 1955.
                                </p>
                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                    <svg className="w-3 h-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span className="font-light">Open 24/7 — Emergency Services</span>
                                </div>
                            </div>

                            {/* Services */}
                            <div>
                                <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <div className="w-1 h-3 bg-blue-500 rounded-full" />
                                    Services
                                </h4>
                                <ul className="space-y-2">
                                    {[
                                        { label: "Find a Doctor", href: "/doctors" },
                                        { label: "Family Medicine", href: "/services/family-medicine" },
                                        { label: "Pediatrics", href: "/services/pediatrics" },
                                        { label: "Internal Medicine", href: "/services/internal-medicine" },
                                        { label: "Surgery", href: "/services/surgery" },
                                        { label: "OB & GYNE", href: "/services/ob-gyne" },
                                        { label: "All Services", href: "/services" },
                                    ].map((link, i) => (
                                        <li key={i}>
                                            <a
                                                href={link.href}
                                                className="group flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm font-light"
                                            >
                                                <svg className="w-3 h-3 text-gray-600 group-hover:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Quick Navigation */}
                            <div>
                                <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <div className="w-1 h-3 bg-blue-500 rounded-full" />
                                    Quick Navigation
                                </h4>
                                <ul className="space-y-2">
                                    {[
                                        { label: "Home", href: "/" },
                                        { label: "News & Events", href: "/#news" },
                                        { label: "Emergency Services", href: "/#emergency" },
                                        { label: "FAQs", href: "/faqs" },
                                        ...(location.pathname !== '/contact' ? [{ label: "Contact Us", href: "/contact" }] : []),
                                    ].map((link, i) => (
                                        <li key={i}>
                                            <a
                                                href={link.href}
                                                className="group flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm font-light"
                                            >
                                                <svg className="w-3 h-3 text-gray-600 group-hover:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* About */}
                            <div>
                                <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <div className="w-1 h-3 bg-blue-500 rounded-full" />
                                    About
                                </h4>
                                <ul className="space-y-2">
                                    {[
                                        { label: "About VisayasMed", href: "/about" },
                                        { label: "Our Mission & Vision", href: "/about" },
                                        { label: "Core Values", href: "/about" },
                                        { label: "Accredited HMOs", href: "/about" },
                                        { label: "Accredited Partners", href: "/about" },
                                        { label: "Our Doctors", href: "/doctors" },
                                    ].map((link, i) => (
                                        <li key={i}>
                                            <a
                                                href={link.href}
                                                className="group flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm font-light"
                                            >
                                                <svg className="w-3 h-3 text-gray-600 group-hover:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="pt-4 border-t border-white/[0.05]">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                            {/* Copyright */}
                            <p className="text-gray-500 text-xs text-center">{contact.copyright}</p>

                            {/* Policy Links */}
                            <div className="flex items-center gap-4">
                                <a
                                    href="/privacy-policy"
                                    className="text-gray-500 hover:text-blue-400 text-xs font-medium transition-colors duration-300"
                                >
                                    Privacy Policy
                                </a>
                                <span className="text-gray-700 text-xs">|</span>
                                <a
                                    href="/cookie-policy"
                                    className="text-gray-500 hover:text-blue-400 text-xs font-medium transition-colors duration-300"
                                >
                                    Cookie Policy
                                </a>
                            </div>

                            {/* Social placeholder */}
                            <div className="flex items-center gap-2">
                                <a href="#" className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all duration-300 hover:scale-110">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                </a>
                                <a href="#" className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all duration-300 hover:scale-110">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" /></svg>
                                </a>
                                <a href="#" className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all duration-300 hover:scale-110">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
