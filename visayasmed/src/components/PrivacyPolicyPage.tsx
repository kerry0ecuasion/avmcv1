import React, { useEffect } from 'react';
import Footer from './Footer';

const PrivacyPolicyPage: React.FC = () => {
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-blue-300 text-xs font-semibold uppercase tracking-widest">Legal Document</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-blue-200/80 text-lg font-light max-w-2xl leading-relaxed">
            Your privacy matters to us. This policy outlines how VisayasMed Hospital collects, uses, protects, and shares your personal information.
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
        {/* Table of Contents */}
        <div className="mb-12 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Table of Contents
          </h2>
          <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'information', label: 'Information We Collect' },
              { id: 'log-data', label: 'Log Data' },
              { id: 'cookies', label: 'Cookies' },
              { id: 'security', label: 'Security' },
              { id: 'external-links', label: 'External Links' },
              { id: 'changes', label: 'Changes to This Policy' },
              { id: 'children', label: "Children's Privacy" },
              { id: 'contact-us', label: 'Contact Us' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-black dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 font-medium"
              >
                <svg className="w-3 h-3 text-gray-400 dark:text-gray-600 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Policy Sections */}
        <div className="space-y-10">
          {/* Section 1 */}
          <PolicySection id="information" number={1} title="Information We Collect">
            <p>
              While using our Site, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to your name ("Personal Information").
            </p>
            <h4 className="text-base font-bold text-gray-900 dark:text-white mt-6 mb-2">Information we collect:</h4>
            <p>We may collect various types of information from and about users of our Services, including:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-black dark:text-gray-400 font-medium">
              <li><strong className="text-black dark:text-gray-200">Personal Information:</strong> We may collect personally identifiable information, such as your name, email address, postal address, phone number, and other similar contact data when you voluntarily provide it to us.</li>
              <li><strong className="text-black dark:text-gray-200">Health Information:</strong> As a healthcare provider, we may collect health-related information necessary to provide you with medical services, including medical history, diagnosis, treatment information, and insurance details.</li>
              <li><strong className="text-black dark:text-gray-200">Usage Data:</strong> We automatically collect information about how you access and use our website, including your IP address, browser type, operating system, referring URLs, pages viewed, and dates/times of visits.</li>
              <li><strong className="text-black dark:text-gray-200">Device Information:</strong> Information about the device you use to access our website, including hardware model, operating system version, unique device identifiers, and mobile network information.</li>
            </ul>
          </PolicySection>

          {/* Section 2 */}
          <PolicySection id="log-data" number={2} title="Log Data">
            <p>
              We collect information that your browser sends whenever you visit our Site ("Log Data"). This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Site that you visit, the time and date of your visit, the time spent on those pages, and other statistics.
            </p>
            <p className="mt-3">
              In addition, we may use third-party services such as Google Analytics that collect, monitor, and analyze this type of information in order to increase our Site's functionality. These third-party service providers have their own privacy policies addressing how they use such information.
            </p>
          </PolicySection>

          {/* Section 3 */}
          <PolicySection id="cookies" number={3} title="Cookies">
            <p>
              Cookies are files with a small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer's hard drive.
            </p>
            <p className="mt-3">
              Like many sites, we use "cookies" to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.
            </p>
            <h4 className="text-base font-bold text-gray-900 dark:text-white mt-6 mb-2">Types of cookies we use:</h4>
            <ul className="list-disc list-inside mt-3 space-y-2 text-black dark:text-gray-400 font-medium">
              <li><strong className="text-black dark:text-gray-200">Essential Cookies:</strong> Required for the website to function properly. These cannot be disabled.</li>
              <li><strong className="text-black dark:text-gray-200">Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
              <li><strong className="text-black dark:text-gray-200">Functional Cookies:</strong> Enable the website to provide enhanced functionality and personalization, such as remembering your preferences.</li>
              <li><strong className="text-black dark:text-gray-200">Performance Cookies:</strong> Collect information about how you use our website to help us improve its performance.</li>
            </ul>
          </PolicySection>

          {/* Section 4 */}
          <PolicySection id="security" number={4} title="Security">
            <p>
              The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
            </p>
            <p className="mt-3">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing and against accidental loss, destruction, or damage. These measures include:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-black dark:text-gray-400 font-medium">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and audits</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Staff training on data protection and privacy</li>
              <li>Incident response procedures</li>
            </ul>
          </PolicySection>

          {/* Section 5 */}
          <PolicySection id="external-links" number={5} title="External Links">
            <p>
              Our Site may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
            </p>
            <p className="mt-3">
              We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites or services.
            </p>
          </PolicySection>

          {/* Section 6 */}
          <PolicySection id="changes" number={6} title="Changes to This Privacy Policy">
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this policy.
            </p>
            <p className="mt-3">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page. Your continued use of the Site after we post any modifications to the Privacy Policy will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy.
            </p>
          </PolicySection>

          {/* Section 7 */}
          <PolicySection id="children" number={7} title="Children's Privacy">
            <p>
              Our Site does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Information, please contact us.
            </p>
            <p className="mt-3">
              If we discover that a child under 13 has provided us with Personal Information, we will delete such information from our servers immediately.
            </p>
          </PolicySection>

          {/* Section 8 */}
          <PolicySection id="contact-us" number={8} title="Contact Us">
            <p>
              If you have any questions about this Privacy Policy, please contact us:
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
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black dark:text-gray-400 uppercase tracking-wider">Address</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">VisayasMed Hospital, Cebu, Philippines</p>
                  </div>
                </div>
              </div>
            </div>
          </PolicySection>
        </div>

        {/* Data Protection Officer Notice */}
        <div className="mt-16 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/10 border border-blue-200/60 dark:border-blue-800/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-800/40 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Data Protection Officer</h3>
              <p className="text-sm text-black dark:text-gray-400 leading-relaxed font-medium">
                VisayasMed Hospital is committed to complying with data privacy regulations including the Data Privacy Act of 2012 (Republic Act No. 10173). Our Data Protection Officer (DPO) oversees all data protection activities and ensures that your personal information is handled in accordance with applicable laws.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

/* Reusable section component */
const PolicySection: React.FC<{
  id: string;
  number: number;
  title: string;
  children: React.ReactNode;
}> = ({ id, number, title, children }) => (
  <section id={id} className="scroll-mt-24">
    <div className="flex items-start gap-4">
      {/* Number badge */}
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

export default PrivacyPolicyPage;
