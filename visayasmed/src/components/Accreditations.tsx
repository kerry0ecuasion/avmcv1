const Accreditations = () => {
  const accreditations = [
    { name: "Joint Commission International", icon: "🏆", type: "International Accreditation" },
    { name: "Philippine Health Insurance Corporation", icon: "🏥", type: "Insurance Partner" },
    { name: "Philippine Medical Association", icon: "⚕️", type: "Professional Body" },
    { name: "ISO 9001:2015 Certified", icon: "🎖️", type: "Quality Management" },
    { name: "Healthcare Commission", icon: "✓", type: "Regulatory Approval" },
    { name: "Department of Health Official", icon: "🛡️", type: "Government License" },
  ];

  return (
    <section className="relative w-screen py-14 lg:py-18 bg-black transition-colors duration-300" style={{
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
    }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-14">
          <h2 className="text-3xl lg:text-4xl font-light text-white dark:text-white mb-2">
            Certifications & Accreditations
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-red-500 dark:from-orange-400 dark:to-red-500 rounded-full mx-auto" />
          <p className="text-slate-300 dark:text-slate-300 mt-4 font-light max-w-2xl mx-auto">
            VisayasMed maintains highest standards through international and local certifications
          </p>
        </div>

        {/* Accreditations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {accreditations.map((acc, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800/50 border border-slate-200/70 dark:border-gray-700/50 p-6 text-center hover:border-orange-400 dark:hover:border-orange-400 transition-all duration-300 hover:shadow-lg dark:hover:shadow-lg/20 hover:scale-[1.02] animate-slideInUp"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

              {/* Icon */}
              <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">
                {acc.icon}
              </div>

              {/* Certification Name */}
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                {acc.name}
              </h3>

              {/* Type */}
              <p className="text-sm text-slate-600 dark:text-slate-300 font-light">
                {acc.type}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Statement */}
        <div className="mt-12 lg:mt-16 p-6 lg:p-8 rounded-xl bg-gray-900/50 dark:bg-gray-900/50 border border-orange-500/20 dark:border-orange-500/20 text-center">
          <p className="text-white dark:text-white font-light max-w-3xl mx-auto">
            Our commitment to excellence is demonstrated through rigorous compliance with international healthcare standards. VisayasMed is proud to maintain certifications that reflect our dedication to patient safety, quality care, and continuous improvement.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Accreditations;
