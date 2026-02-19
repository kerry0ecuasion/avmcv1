const StatsSection = () => {
  const stats = [
    { icon: "📅", number: "70+", label: "Years of Excellence", desc: "Serving the community since 1955" },
    { icon: "👨‍⚕️", number: "150+", label: "Medical Professionals", desc: "Board-certified specialists" },
    { icon: "🏥", number: "500+", label: "Beds", desc: "Modern patient facilities" },
    { icon: "💊", number: "50K+", label: "Patients Served", desc: "Monthly patient care" },
    { icon: "🎓", number: "95%", label: "Patient Satisfaction", desc: "Consistently high ratings" },
    { icon: "🌟", number: "10+", label: "Departments", desc: "Comprehensive specialties" },
  ];

  return (
    <section className="relative w-screen py-16 lg:py-20 bg-black transition-colors duration-300" style={{
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
    }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center mb-14 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-light text-white dark:text-white mb-2">
            By the Numbers
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-red-500 dark:from-orange-400 dark:to-red-500 rounded-full mx-auto" />
          <p className="text-slate-300 dark:text-slate-300 mt-4 font-light max-w-2xl mx-auto">
            A trusted healthcare institution committed to delivering excellence in patient care and service
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800/50 border border-slate-200/70 dark:border-gray-700/50 p-6 lg:p-8 text-center hover:border-orange-400 dark:hover:border-orange-400 transition-all duration-300 hover:shadow-lg dark:hover:shadow-lg/20 hover:scale-105 animate-slideInUp"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

              {/* Icon */}
              <div className="text-4xl lg:text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">
                {stat.icon}
              </div>

              {/* Number */}
              <div className="text-3xl lg:text-4xl font-light text-orange-400 dark:text-orange-400 mb-1 group-hover:text-orange-300 dark:group-hover:text-orange-300 transition-colors duration-300">
                {stat.number}
              </div>

              {/* Label */}
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                {stat.label}
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-300 font-light">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
