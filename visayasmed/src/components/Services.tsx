const Services = () => {
  const services = [
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Family Medicine",
      desc: "Comprehensive primary care for patients of all ages, focusing on preventive medicine and health maintenance for the entire family.",
      specialties: ["Preventive Care", "Chronic Disease Management", "Wellness Programs", "Tropical Health"],
      successRate: "98%",
      patientsServed: "15000+",
      uniqueFeature: "Island-hopping health camps"
    },
    {
      icon: "👶",
      title: "Pediatrics",
      desc: "Specialized medical care for infants, children, and adolescents, including well-child check-ups, vaccinations, and treatment of childhood illnesses.",
      specialties: ["Child Development", "Immunizations", "Pediatric Surgery", "Nutrition Counseling"],
      successRate: "97%",
      patientsServed: "12000+",
      uniqueFeature: "Mobile vaccination units"
    },
    {
      icon: "🩺",
      title: "Internal Medicine",
      desc: "Expert diagnosis and treatment of adult diseases, managing complex medical conditions including diabetes, hypertension, and heart disease.",
      specialties: ["Diagnostic Services", "Disease Management", "Preventive Medicine", "Infectious Diseases"],
      successRate: "96%",
      patientsServed: "10000+",
      uniqueFeature: "Dengue & leptospirosis specialists"
    },
    {
      icon: "🔪",
      title: "Surgery",
      desc: "State-of-the-art surgical procedures performed by experienced surgeons, including general surgery, minimally invasive techniques, and emergency operations.",
      specialties: ["General Surgery", "Minimally Invasive Procedures", "Emergency Surgery", "Trauma Care"],
      successRate: "99%",
      patientsServed: "8000+",
      uniqueFeature: "24/7 maritime emergency response"
    },
    {
      icon: "🤰",
      title: "OB & GYNE",
      desc: "Comprehensive women's health services including prenatal care, delivery services, gynecological examinations, and reproductive health management.",
      specialties: ["Maternity Services", "Reproductive Health", "Gynecological Procedures", "Rural Outreach"],
      successRate: "98%",
      patientsServed: "9000+",
      uniqueFeature: "Island maternity transport service"
    }
  ];

  return (
    <section 
      className="relative w-screen py-20 lg:py-24 transition-colors duration-300"
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
      {/* Enhanced overlay with solid color */}
      <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/85 transition-colors duration-300"></div>
      
      <div className="relative max-w-6xl mx-auto z-10 px-6 lg:px-10">
        <div className="mb-16 text-center">
          <div className="inline-block p-1 bg-purple-500 rounded-2xl mb-4">
            <div className="bg-white dark:bg-gray-900 px-6 py-2 rounded-xl">
              <h2 className="text-4xl lg:text-5xl font-bold text-purple-600 dark:text-purple-500">
                Our Services
              </h2>
            </div>
          </div>
          <div className="w-24 h-1.5 bg-purple-500 rounded-full mx-auto mb-6"></div>
          <p className="text-slate-600 dark:text-slate-400 mt-4 font-normal max-w-3xl mx-auto text-lg leading-relaxed">
            Comprehensive healthcare services delivered by world-class medical professionals, with specialized expertise in regional health challenges and island community care
          </p>
        </div>

        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {services.map((service, idx) => (
            <div
              key={service.title}
              className="group flex flex-col items-center gap-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-scaleIn md:flex-row md:text-left md:gap-8 md:p-8"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              {/* Icon with enhanced styling */}
              <div className="flex-shrink-0 w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{service.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal text-base">
                  {service.desc}
                </p>
              </div>

              {/* Arrow indicator */}
              <span className="hidden md:block ml-auto text-2xl text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
