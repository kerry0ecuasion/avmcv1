import React from "react";
import Footer from "./Footer";
import Services from "./Services";

const ServicesPage: React.FC = () => {
  return (
    <div className="relative scroll-smooth transition-colors duration-500 overflow-x-hidden bg-gray-50 dark:bg-gray-950">
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
