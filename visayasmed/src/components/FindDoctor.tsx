const FindDoctor = () => {
  const doctors = [
    {
      name: "Dr. Maria Santos",
      specialty: "Cardiology",
      qualification: "MD, Board Certified Cardiologist, Fellow of Philippine Heart Association",
      experience: "15+ years",
      languages: ["English", "Tagalog", "Cebuano"],
      availability: "Mon-Fri, 9 AM - 5 PM",
      icon: "❤️",
      achievements: "Published 12 research papers on tropical cardiology, Recipient of Visayas Medical Excellence Award 2024",
      patientsServed: "5000+",
      rating: 4.9,
      specialExpertise: "Tropical cardiovascular diseases, Preventive cardiology"
    },
    {
      name: "Dr. Juan Reyes",
      specialty: "Pediatrics",
      qualification: "MD, Pediatric Specialist, Member of Philippine Pediatric Society",
      experience: "12+ years",
      languages: ["English", "Tagalog", "Hiligaynon"],
      availability: "Tue-Sat, 10 AM - 6 PM",
      icon: "👶",
      achievements: "Led community vaccination programs across 15 Visayas municipalities",
      patientsServed: "8000+",
      rating: 4.8,
      specialExpertise: "Child nutrition, Infectious disease prevention"
    },
    {
      name: "Dr. Ana Cruz",
      specialty: "OB & GYNE",
      qualification: "MD, OB-GYN Specialist, Certified Maternal-Fetal Medicine",
      experience: "18+ years",
      languages: ["English", "Tagalog", "Cebuano", "Waray"],
      availability: "Mon-Fri, 8 AM - 4 PM",
      icon: "🤰",
      achievements: "Delivered over 3000 babies, Regional coordinator for maternal health initiatives",
      patientsServed: "6000+",
      rating: 5.0,
      specialExpertise: "High-risk pregnancies, Rural maternal care"
    },
    {
      name: "Dr. Roberto Lee",
      specialty: "General Surgery",
      qualification: "MD, Surgical Specialist, Fellow of Philippine College of Surgeons",
      experience: "14+ years",
      languages: ["English", "Tagalog", "Mandarin"],
      availability: "Mon-Thu, 9 AM - 5 PM",
      icon: "🔪",
      achievements: "Performed 2000+ successful surgeries, Expert in minimally invasive procedures",
      patientsServed: "4000+",
      rating: 4.9,
      specialExpertise: "Laparoscopic surgery, Emergency trauma care"
    },
    {
      name: "Dr. Patricia Lim",
      specialty: "Internal Medicine",
      qualification: "MD, Internal Medicine Specialist, Diplomate of Philippine College of Physicians",
      experience: "11+ years",
      languages: ["English", "Tagalog", "Mandarin", "Bicolano"],
      availability: "Wed-Sat, 10 AM - 6 PM",
      icon: "🩺",
      achievements: "Established diabetes management program serving 500+ patients annually",
      patientsServed: "7000+",
      rating: 4.7,
      specialExpertise: "Tropical infectious diseases, Geriatric care"
    },
    {
      name: "Dr. Miguel Santos",
      specialty: "Family Medicine",
      qualification: "MD, Family Medicine Specialist, Certified in Preventive Medicine",
      experience: "16+ years",
      languages: ["English", "Tagalog", "Cebuano", "Ilonggo"],
      availability: "Mon-Fri, 9 AM - 5 PM",
      icon: "👨‍⚕️",
      achievements: "Community health advocate, Runs annual health camps in remote Visayas islands",
      patientsServed: "10000+",
      rating: 4.8,
      specialExpertise: "Family wellness programs, Rural healthcare delivery"
    },
  ];

  return (
    <section 
      className="relative w-screen transition-colors duration-300"
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
      
      <div className="relative max-w-6xl mx-auto z-10 p-10">
        <div className="mb-12 text-center">
          <div className="inline-block p-1 bg-blue-500 rounded-2xl mb-4">
            <div className="bg-white dark:bg-gray-900 px-6 py-2 rounded-xl">
              <h2 className="text-4xl lg:text-5xl font-bold text-blue-600 dark:text-blue-500">
                Find a Physician
              </h2>
            </div>
          </div>
          <div className="w-24 h-1.5 bg-blue-500 rounded-full mx-auto mb-6"></div>
          <p className="text-slate-600 dark:text-slate-400 mt-4 font-normal max-w-3xl mx-auto text-lg leading-relaxed">
            Connect with our highly qualified and experienced medical professionals, recognized leaders in Visayas healthcare with regional expertise and community impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor, idx) => (
            <div
              key={doctor.name}
              className="group relative overflow-hidden bg-white dark:bg-gray-800 border-2 border-slate-200/50 dark:border-gray-700/50 p-8 hover:border-blue-300 dark:hover:border-blue-400 transition-all duration-500 hover:shadow-2xl dark:hover:shadow-2xl/10 hover:-translate-y-1 animate-slideInUp"
              style={{ animationDelay: `${idx * 200}ms` }}
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500"></div>

              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-6 right-6 w-16 h-16 border-2 border-emerald-300 dark:border-emerald-600 rounded-full"></div>
                <div className="absolute bottom-6 left-6 w-12 h-12 border-2 border-teal-300 dark:border-teal-600 rounded-full"></div>
              </div>

              {/* Avatar with enhanced styling */}
              <div className="relative mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{doctor.icon}</span>
                </div>
              </div>

              {/* Doctor Info with better typography */}
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">
                {doctor.name}
              </h3>
              <p className="text-base text-blue-600 dark:text-blue-400 font-semibold mb-3">{doctor.specialty}</p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(doctor.rating) ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400 ml-1">
                  {doctor.rating} ({doctor.patientsServed} patients)
                </span>
              </div>

              {/* Qualification */}
              <p className="text-sm text-slate-700 dark:text-slate-300 font-normal mb-3 line-clamp-2">
                {doctor.qualification}
              </p>

              {/* Special Expertise */}
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-3">
                🎯 {doctor.specialExpertise}
              </p>

              {/* Achievements */}
              <p className="text-xs text-slate-600 dark:text-slate-400 font-normal mb-4 line-clamp-2">
                🏆 {doctor.achievements}
              </p>

              {/* Stats */}
              <div className="flex gap-3 mb-4 text-sm">
                <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 text-blue-800 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-700">
                  {doctor.experience}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-800 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-700">
                  {doctor.languages.length} languages
                </span>
              </div>

              {/* Languages */}
              <p className="text-xs text-slate-600 dark:text-slate-400 font-normal mb-4">
                {doctor.languages.join(", ")}
              </p>

              {/* Availability */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-6">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-normal">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">Available:</span> {doctor.availability}
                </p>
              </div>

              {/* CTA Button */}
              <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold text-sm rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
                Schedule Appointment
              </button>
            </div>
          ))}
      </div>
      </div>
    </section>
  );
};

export default FindDoctor;
