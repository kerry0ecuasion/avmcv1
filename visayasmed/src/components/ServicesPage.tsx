import React from "react";
import Footer from "./Footer";
import Services from "./Services";

const ServicesPage: React.FC = () => {
  return (
    <div className="relative scroll-smooth transition-colors duration-500 overflow-x-hidden bg-gray-50 dark:bg-gray-950">
      {/* Dark top background for navbar visibility */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-sky-950 overflow-hidden z-0">
        <div className="absolute inset-0 bg-[url('/w2.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950 via-sky-950/80 to-gray-50 dark:to-gray-950" />
      </div>

      <main className="max-w-full relative z-10 pt-28">
        <div className="px-6 max-w-7xl mx-auto animate-fadeUp">
          <Services />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;
