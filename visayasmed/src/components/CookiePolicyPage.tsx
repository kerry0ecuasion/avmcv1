import React, { useEffect } from 'react';
import Footer from './Footer';

const CookiePolicyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60" />

        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 pt-32 pb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-blue-300 text-xs font-semibold uppercase tracking-widest">Legal Document</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Cookie Policy
          </h1>
          <p className="text-blue-200/80 text-lg font-light max-w-2xl leading-relaxed">
            This Cookie Policy explains how VisayasMed Hospital uses cookies and similar technologies when you visit our website.
          </p>
          <div className="mt-6 flex items-center gap-3 text-blue-300/70 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Last Updated: April 16, 2026</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
        <div className="space-y-10">
          {/* Section 1 */}
          <CookieSection number={1} title="What Are Cookies?">
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site. Cookies help us understand how you use our website, remember your preferences, and improve your overall experience.
            </p>
          </CookieSection>

          {/* Section 2 */}
          <CookieSection number={2} title="How We Use Cookies">
            <p>
              VisayasMed Hospital uses cookies for a variety of purposes, including:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-black dark:text-gray-400 font-medium">
              <li>Ensuring the efficient and secure operation of our website</li>
              <li>Remembering your preferences and settings</li>
              <li>Analyzing site usage and traffic patterns to improve our services</li>
              <li>Providing personalized content and features</li>
              <li>Understanding how our website is performing</li>
            </ul>
          </CookieSection>

          {/* Section 3 */}
          <CookieSection number={3} title="Types of Cookies We Use">
            <div className="mt-4 space-y-4">
              <CookieTypeCard
                name="Essential Cookies"
                description="These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions you take, such as setting your privacy preferences, logging in, or filling in forms."
                required
              />
              <CookieTypeCard
                name="Analytics Cookies"
                description="These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site."
              />
              <CookieTypeCard
                name="Functional Cookies"
                description="These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages."
              />
              <CookieTypeCard
                name="Performance Cookies"
                description="These cookies collect information about how visitors use a website, for instance which pages visitors go to most often. These cookies don't collect information that identifies a visitor. All information is aggregated and therefore anonymous."
              />
            </div>
          </CookieSection>

          {/* Section 4 */}
          <CookieSection number={4} title="Managing Cookies">
            <p>
              Most web browsers allow you to control cookies through their settings. You can set your browser to block or alert you about cookies, or to delete cookies that have already been set. Please note that if you disable or refuse cookies, some parts of our website may become inaccessible or not function properly.
            </p>
            <h4 className="text-base font-bold text-gray-900 dark:text-white mt-6 mb-2">How to manage cookies in your browser:</h4>
            <ul className="list-disc list-inside mt-3 space-y-2 text-black dark:text-gray-400 font-medium">
              <li><strong className="text-black dark:text-gray-200">Google Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
              <li><strong className="text-black dark:text-gray-200">Mozilla Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
              <li><strong className="text-black dark:text-gray-200">Safari:</strong> Preferences → Privacy → Cookies and website data</li>
              <li><strong className="text-black dark:text-gray-200">Microsoft Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies</li>
            </ul>
          </CookieSection>

          {/* Section 5 */}
          <CookieSection number={5} title="Third-Party Cookies">
            <p>
              In some special cases, we also use cookies provided by trusted third parties. The following section details which third-party cookies you might encounter through this site.
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-black dark:text-gray-400 font-medium">
              <li>This site uses Google Analytics, one of the most widespread and trusted analytics solutions on the web, to help us understand how you use the site and ways that we can improve your experience.</li>
              <li>From time to time, we test new features and make subtle changes to the way the site is delivered. When we are still testing new features, these cookies may be used to ensure that you receive a consistent experience.</li>
            </ul>
          </CookieSection>

          {/* Section 6 */}
          <CookieSection number={6} title="Updates to This Policy">
            <p>
              We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
            </p>
            <p className="mt-3">
              The date at the top of this Cookie Policy indicates when it was last updated.
            </p>
          </CookieSection>

          {/* Section 7 */}
          <CookieSection number={7} title="Contact Us">
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
            </p>
            <div className="mt-4 p-5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black dark:text-gray-400 uppercase tracking-wider">Email</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Info@visayasmed.com.ph</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black dark:text-gray-400 uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">(+32) 253-1901</p>
                  </div>
                </div>
              </div>
            </div>
          </CookieSection>
        </div>
      </div>

      <Footer />
    </div>
  );
};

/* Reusable section component */
const CookieSection: React.FC<{
  number: number;
  title: string;
  children: React.ReactNode;
}> = ({ number, title, children }) => (
  <section className="scroll-mt-24">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 mt-0.5">
        <span className="text-white font-bold text-sm">{number}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
        <div className="text-black dark:text-gray-400 text-[15px] leading-relaxed font-semibold">
          {children}
        </div>
      </div>
    </div>
  </section>
);

/* Cookie type card */
const CookieTypeCard: React.FC<{
  name: string;
  description: string;
  required?: boolean;
}> = ({ name, description, required }) => (
  <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <h5 className="font-bold text-gray-900 dark:text-white text-sm">{name}</h5>
      {required && (
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
          Required
        </span>
      )}
    </div>
    <p className="text-black dark:text-gray-400 text-sm leading-relaxed font-medium">{description}</p>
  </div>
);

export default CookiePolicyPage;
