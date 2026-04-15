import React from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import About from "./About";
import Testimonials from "./Testimonials";
import Footer from "./Footer";

const AboutPage: React.FC = () => {
    useScrollReveal();

    return (
        <div className="relative scroll-smooth transition-colors duration-500 overflow-hidden bg-gray-50 dark:bg-gray-950">
            {/* Animated background blobs - full screen coverage */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="blob-decoration w-screen h-screen bg-blue-400/15 dark:bg-blue-600/15 top-[-30%] right-[-30%] animate-blob" />
                <div className="blob-decoration w-screen h-screen bg-blue-300/15 dark:bg-blue-600/15 bottom-[10%] left-[-35%] animate-blob" style={{ animationDelay: '4s' }} />
                <div className="blob-decoration w-screen h-screen bg-rose-300/15 dark:bg-rose-600/15 top-[30%] right-[-25%] animate-blob" style={{ animationDelay: '8s' }} />
                <div className="blob-decoration w-screen h-screen bg-emerald-300/15 dark:bg-emerald-600/15 bottom-[20%] right-[-40%] animate-blob" style={{ animationDelay: '12s' }} />
                <div className="blob-decoration w-screen h-screen bg-violet-300/15 dark:bg-violet-600/15 top-[50%] left-[-30%] animate-blob" style={{ animationDelay: '16s' }} />
                <div className="blob-decoration w-screen h-screen bg-amber-300/15 dark:bg-amber-600/15 bottom-[40%] left-[-20%] animate-blob" style={{ animationDelay: '20s' }} />
            </div>

            <main className="relative z-10 w-screen">
                {/* Hero Banner for About Page - full screen width */}
                <section className="relative w-screen py-20 sm:py-32 lg:py-40 overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="/w2.jpg"
                            alt="About VisayasMed Hospital"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/98 via-gray-900/85 to-gray-900/60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                    </div>

                    {/* Floating decorative elements - expanded coverage */}
                    <div className="absolute top-20 right-10 w-screen h-96 bg-blue-500/8 rounded-full blur-3xl animate-blob pointer-events-none" />
                    <div className="absolute bottom-10 left-10 w-screen h-64 bg-blue-500/8 rounded-full blur-2xl animate-blob pointer-events-none" style={{ animationDelay: '3s' }} />
                    <div className="absolute top-40 left-20 w-screen h-48 bg-rose-500/8 rounded-full blur-2xl animate-blob pointer-events-none" style={{ animationDelay: '5s' }} />
                    <div className="absolute bottom-20 right-20 w-screen h-56 bg-emerald-500/8 rounded-full blur-2xl animate-blob pointer-events-none" style={{ animationDelay: '7s' }} />
                    <div className="absolute top-60 right-40 w-screen h-40 bg-violet-500/8 rounded-full blur-2xl animate-blob pointer-events-none" style={{ animationDelay: '9s' }} />

                    <div className="relative z-10 w-screen px-4 sm:px-6 lg:px-8 xl:px-12 text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase mb-8 border border-white/10 animate-fadeDown">
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                            Who We Are
                        </div>

                        <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-[1.1] animate-fadeUp">
                            About{" "}
                            <span className="bg-gradient-to-r from-blue-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
                                VisayasMed
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-6 leading-relaxed max-w-none mx-auto animate-fadeUp font-light" style={{ animationDelay: '0.2s' }}>
                            Delivering compassionate, world-class healthcare to Visayas region since 1955 with modern facilities and expert medical professionals.
                        </p>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 animate-fadeUp" style={{ animationDelay: '1s' }}>
                        <span className="text-white/40 text-xs uppercase tracking-widest font-medium">Scroll</span>
                        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1.5">
                            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-[float_2s_ease-in-out_infinite]" />
                        </div>
                    </div>
                </section>

                {/* Content sections - full screen width */}
                <div className="w-screen">
                    <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
                        <div className="reveal max-w-none">
                            <About />
                        </div>

                        <div className="reveal max-w-none">
                            <Testimonials compact={true} />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
