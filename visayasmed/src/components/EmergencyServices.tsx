const EmergencyServices = () => {
  const services = [
    {
      icon: "🚑",
      title: "24/7 Emergency Response",
      desc: "Available round-the-clock with fully equipped ambulances and trained paramedics"
    },
    {
      icon: "🏥",
      title: "Trauma Center",
      desc: "Level I trauma center with advanced life support and surgical capabilities"
    },
    {
      icon: "⚡",
      title: "Rapid Assessment",
      desc: "Triage system with average response time under 5 minutes"
    },
    {
      icon: "👨‍⚕️",
      title: "Expert Team",
      desc: "Board-certified emergency physicians and specialized trauma surgeons"
    },
  ];

  return (
    <section className="relative w-screen py-16 lg:py-20 bg-black transition-colors duration-300" style={{
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
    }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-sm font-medium">
              🚨 Emergency Services
            </div>

            <h2 className="text-3xl lg:text-4xl font-light text-white dark:text-white mb-4">
              Always Ready to Save Lives
            </h2>

            <p className="text-lg text-slate-300 dark:text-slate-300 leading-relaxed font-light mb-6">
              VisayasMed's Emergency Department operates 24/7, providing rapid response and expert care for all types of medical emergencies.
            </p>

            <div className="space-y-4 mb-8">
              {services.map((service, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <span className="text-3xl flex-shrink-0">{service.icon}</span>
                  <div>
                    <h4 className="font-medium text-white dark:text-white mb-1">{service.title}</h4>
                    <p className="text-sm text-slate-300 dark:text-slate-300 font-light">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-red-200/50 dark:border-red-900/30">
                <p className="font-medium text-red-700 dark:text-red-400 mb-1">Emergency Hotline</p>
                <a href="tel:911" className="text-2xl font-bold text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400">
                  911
                </a>
              </div>
            </div>
          </div>

          {/* Right: Feature Box */}
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-orange-500/30 dark:border-orange-500/30 p-8 lg:p-10 shadow-lg">
              {/* Accent */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-orange-500/10 dark:bg-orange-500/10 rounded-full blur-2xl" />

              <h3 className="text-2xl font-medium text-white dark:text-white mb-6 relative z-10">
                Why Choose Our Emergency Department?
              </h3>

              <ul className="space-y-4 relative z-10">
                {[
                  "Average door-to-doctor time: 3 minutes",
                  "Advanced diagnostic imaging on-site",
                  "Dedicated trauma operating rooms",
                  "ICU beds with intensive monitoring",
                  "Specialist consultation available 24/7",
                  "Coordination with advanced hospitals if needed"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-orange-500 dark:text-orange-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-100 dark:text-slate-100 font-light">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencyServices;
