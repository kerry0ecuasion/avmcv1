import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Easing } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" as Easing }
  }
};

const QuickLinks: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="py-16 bg-slate-50 dark:bg-[#050B14] border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-10">
                    How Can We Help You?
                </h2>
                
                <motion.div 
                    className="flex flex-col md:flex-row items-stretch justify-center gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {/* Button 1: Find a Doctor */}
                    <motion.button 
                        variants={itemVariants}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/doctors')}
                        className="flex-1 p-8 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-shadow duration-200 flex flex-col items-center justify-center text-center h-full"
                    >
                        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <h3 className="text-xl font-bold tracking-wide mb-2">Find a Doctor</h3>
                        <p className="text-blue-100 text-sm font-medium">Browse our team of specialists</p>
                    </motion.button>

                    {/* Button 2: Our Services */}
                    <motion.button 
                        variants={itemVariants}
                        whileHover={{ y: -6, backgroundColor: "rgb(37 99 235)", color: "#ffffff", transition: { duration: 0.2 } }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/services')}
                        className="flex-1 p-8 rounded-xl bg-transparent border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:border-transparent shadow-sm hover:shadow-blue-600/30 transition-all duration-200 flex flex-col items-center justify-center text-center h-full group"
                    >
                        <svg className="w-12 h-12 mb-4 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z" /></svg>
                        <h3 className="text-xl font-bold tracking-wide mb-2 group-hover:text-white">Our Services</h3>
                        <p className="text-gray-600 dark:text-gray-400 group-hover:text-blue-100 text-sm font-medium transition-colors">Explore what we offer</p>
                    </motion.button>

                    {/* Button 3: Questions / Comments */}
                    <motion.button 
                        variants={itemVariants}
                        whileHover={{ y: -6, borderColor: "rgb(59 130 246)", transition: { duration: 0.2 } }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/faqs')}
                        className="flex-1 p-8 rounded-xl bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white border-2 border-transparent shadow-lg shadow-gray-200/50 dark:shadow-none hover:bg-gray-50 dark:hover:bg-gray-900 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-200 flex flex-col items-center justify-center text-center h-full group"
                    >
                        <svg className="w-12 h-12 mb-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <h3 className="text-xl font-bold tracking-wide mb-2">Questions / Comments</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">We're here to help</p>
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default QuickLinks;
