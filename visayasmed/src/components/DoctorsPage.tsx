import React from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import Footer from "./Footer";
import DoctorProfileDisplay from "./DoctorProfileDisplay";
import FindDoctor from "./FindDoctor";

const DoctorsPage: React.FC = () => {
  useScrollReveal();

  return (
    <div className="relative scroll-smooth transition-colors duration-500 overflow-x-hidden bg-gray-50 dark:bg-gray-950">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="blob-decoration w-[600px] h-[600px] bg-blue-400 dark:bg-blue-600 top-[-10%] right-[-10%] animate-blob" />
        <div className="blob-decoration w-[500px] h-[500px] bg-blue-300 dark:bg-blue-600 bottom-[20%] left-[-15%] animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      <main className="max-w-full relative z-10 pt-28">
        <div className="reveal px-6 max-w-7xl mx-auto">
          <DoctorProfileDisplay />
          <FindDoctor />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DoctorsPage;
