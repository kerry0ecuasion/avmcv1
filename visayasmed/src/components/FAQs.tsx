import { useState } from 'react';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do I need an appointment to visit VisayasMed Hospital?",
      a: "Walk-ins are welcome for emergency cases and urgent care. However, we recommend scheduling an appointment in advance for non-emergency consultations to minimize waiting time and ensure dedicated care. You can call us at (+32) 253-1901 or use our online booking system."
    },
    {
      q: "What should I bring for my first appointment?",
      a: "Please bring valid government-issued ID, health insurance card (if applicable), any relevant medical records, prescription list, and a list of any allergies. Patient intake forms are available online and at our reception desk."
    },
    {
      q: "What are your hospital hours?",
      a: "VisayasMed Hospital operates 24/7 for emergency services. General consultation hours are Monday-Friday 8 AM - 6 PM, Saturday 8 AM - 4 PM. Closed on Sundays and public holidays. Specific departments may have varying hours."
    },
    {
      q: "Do you accept insurance and what are your payment options?",
      a: "Yes, we accept major health insurance plans. We also offer flexible payment options including cash, credit/debit cards, and installment plans. Our billing department can provide detailed information about coverage and payment arrangements."
    },
    {
      q: "How can I schedule an appointment?",
      a: "You can schedule an appointment by: 1) Calling our main line at (+32) 253-1901, 2) Using our online booking system on this website, 3) Visiting our reception desk in person, or 4) Emailing us at Info@visayasmed.com.ph with your preferred date and time."
    },
    {
      q: "What services does VisayasMed Hospital offer?",
      a: "We provide comprehensive healthcare services including Family Medicine, Pediatrics, Internal Medicine, General Surgery, OB & GYNE, Cardiology, and many specialized departments. Each service is staffed with highly qualified and board-certified physicians."
    },
    {
      q: "Is emergency care available 24/7?",
      a: "Yes, our Emergency Department operates 24/7, 365 days a year. Our fully equipped trauma center and experienced emergency team are ready to provide immediate care for any medical emergency. Call 911 or our emergency hotline for immediate assistance."
    },
    {
      q: "How long does a typical consultation take?",
      a: "Regular consultations typically take 20-30 minutes, depending on the nature of your condition and whether tests are required. Initial consultations or complex cases may take longer. Your doctor will provide an estimate based on your specific needs."
    },
  ];

  return (
    <section 
      className="relative w-screen py-16 lg:py-20 transition-colors duration-300"
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
      <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/90 transition-colors duration-300"></div>
      
      <div className="relative max-w-4xl mx-auto z-10 px-6 lg:px-10">
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-medium text-slate-800 dark:text-slate-100 mb-2">Find answers to common questions about our services, appointments, and hospital operations</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500 rounded-full" />
          {/* <p className="text-slate-600 dark:text-slate-400 mt-3 font-light">Find answers to common questions about our services, appointments, and hospital operations</p> */}
        </div>

        <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
              className="group border border-slate-200/70 dark:border-gray-700/50 rounded-xl overflow-hidden hover:border-sky-300 dark:hover:border-sky-600 transition-all duration-300 hover:shadow-md dark:hover:shadow-lg/20 animate-fadeUp"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Question Button */}
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-5 lg:px-8 lg:py-6 flex items-center justify-between bg-white dark:bg-gray-800/50 hover:bg-sky-50/50 dark:hover:bg-sky-900/10 transition-all duration-300 text-left"
              >
                <h3 className="text-base lg:text-lg font-medium text-slate-900 dark:text-slate-50 group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors duration-300 pr-4">
                  {faq.q}
                </h3>
                <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-sky-100/70 dark:bg-sky-900/30 flex items-center justify-center transition-all duration-300 ${openIndex === idx ? 'rotate-180 bg-sky-200 dark:bg-sky-800' : ''}`}>
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
              {openIndex === idx && (
                <div className="px-6 py-5 lg:px-8 lg:py-6 bg-gradient-to-b from-sky-50/30 to-transparent dark:from-sky-900/10 dark:to-transparent border-t border-slate-200/70 dark:border-gray-700/50 animate-fadeUp">
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 p-6 lg:p-8 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border border-sky-200/50 dark:border-sky-800/30">
          <p className="text-slate-800 dark:text-slate-200 font-normal mb-4">
            Can't find your answer? Our team is here to help!
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="tel:+63322531901" className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg">
              Call (+32) 253-1901
            </a>
            <a href="mailto:Info@visayasmed.com.ph" className="px-6 py-2 border border-sky-300 dark:border-sky-600 text-sky-700 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30 font-medium rounded-lg transition-all duration-300">
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
