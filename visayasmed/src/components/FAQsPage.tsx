import React from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import Footer from "./Footer";
import FAQs from "./FAQs";

const FAQsPage: React.FC = () => {
  useScrollReveal();

  return (
    <div className="relative scroll-smooth transition-colors duration-500 overflow-x-hidden bg-gray-50 dark:bg-gray-950">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="blob-decoration w-[500px] h-[500px] bg-blue-300 dark:bg-blue-600 bottom-[20%] left-[-15%] animate-blob" style={{ animationDelay: '4s' }} />
        <div className="blob-decoration w-[400px] h-[400px] bg-rose-300 dark:bg-rose-600 top-[30%] right-[5%] animate-blob" style={{ animationDelay: '8s' }} />
      </div>

      {/* Dark top background for navbar visibility */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-sky-950 overflow-hidden z-0">
        <div className="absolute inset-0 bg-[url('/w2.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950 via-sky-950/80 to-gray-50 dark:to-gray-950" />
      </div>

      <main className="max-w-full relative z-10 pt-28">
        <div className="reveal max-w-4xl mx-auto px-6 py-10">
          <FAQs />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQsPage;
