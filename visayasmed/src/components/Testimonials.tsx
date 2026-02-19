const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      text: "I had a wonderful experience at VisayasMed. The staff was incredibly caring and professional. Dr. Santos took time to explain everything in detail.",
      rating: 5,
      icon: "👩"
    },
    {
      name: "Michael Reyes",
      role: "Patient",
      text: "The facilities are state-of-the-art and the wait times are minimal. I felt well cared for from check-in to discharge. Highly recommend!",
      rating: 5,
      icon: "👨"
    },
    {
      name: "Dr. Maria Cruz",
      role: "Referring Physician",
      text: "VisayasMed provides exceptional patient care and seamless coordination. My patients receive excellent outcomes and highly value the experience.",
      rating: 5,
      icon: "👨‍⚕️"
    },
    {
      name: "Jennifer Lee",
      role: "Patient",
      text: "Outstanding service! The emergency team was quick and efficient. I felt safe and well-informed throughout my care.",
      rating: 5,
      icon: "👩"
    },
    {
      name: "Robert Santos",
      role: "Patient",
      text: "Clean facilities, kind staff, and knowledgeable doctors. VisayasMed is my trusted healthcare provider. Ten out of ten!",
      rating: 5,
      icon: "👨"
    },
    {
      name: "Ana Gabriel",
      role: "Patient",
      text: "The maternity services were exceptional. The entire team made me feel comfortable and supported during my pregnancy journey.",
      rating: 5,
      icon: "👩"
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
      
      <div className="relative max-w-6xl mx-auto z-10 px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center mb-14 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-medium text-slate-800 dark:text-slate-100 mb-2">
            What Our Patients Say
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500 rounded-full mx-auto" />
          <p className="text-slate-600 dark:text-slate-400 mt-4 font-normal max-w-2xl mx-auto">
            Real experiences from patients and healthcare professionals who trust VisayasMed for their care
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-xl bg-white/80 dark:bg-gray-800/50 border border-slate-200/70 dark:border-gray-700/50 p-6 lg:p-7 hover:border-sky-300 dark:hover:border-sky-600 transition-all duration-300 hover:shadow-lg dark:hover:shadow-lg/20 hover:scale-[1.02] animate-slideInUp"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent dark:from-sky-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal mb-5 italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 dark:from-sky-500 dark:to-blue-700 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                  {testimonial.icon}
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-50 text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
