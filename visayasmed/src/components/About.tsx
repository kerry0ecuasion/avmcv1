const About = () => (
  <section 
    id="about" 
    className="relative w-screen min-h-screen transition-colors duration-300"
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
    {/* <h2 className="text-3xl font-bold text-sky-600 dark:text-sky-400 mb-8 text-center animate-fadeUp">About Us</h2> */}

    <div className="mb-16">
      
        <h2 className="text-4xl lg:text-5xl font-medium text-slate-900 dark:text-slate-100 mb-2 text-center tracking-wide animate-fadeUp">About VisayasMed Hospital</h2>
      <div className="w-16 h-1 bg-linear-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500 mx-auto rounded-full mb-12" />
      
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Left: Professional Images */}
        <div className="w-full lg:w-1/2">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            <img src="https://via.placeholder.com/600x400?text=VisayasMed+Facility" alt="VisayasMed Hospital facility" className="rounded-xl shadow-lg object-cover h-48 w-full" />
            <img src="https://via.placeholder.com/600x400?text=Medical+Team" alt="Medical team providing care" className="rounded-xl shadow-lg object-cover h-48 w-full" />
            <img src="https://via.placeholder.com/1200x600?text=Patient+Care" alt="Patient-centered care" className="rounded-xl shadow-lg object-cover h-48 w-full lg:col-span-2" />
          </div>
          <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-400 mt-4 font-normal">Replace placeholder images in <span className="font-medium">src/assets</span> or <span className="font-medium">public</span> folder</p>
        </div>

        {/* Right: Content */}
        <div className="w-full lg:w-1/2 space-y-8">
          {/* Heritage Statement */}
          <div className="border-l-4 border-sky-500 dark:border-sky-400 pl-6 py-2">
            <h3 className="text-2xl lg:text-3xl font-medium text-slate-900 dark:text-slate-50 mb-1 tracking-wide">
              Seven Decades of Trusted Care
            </h3>
              <p className="text-lg text-slate-800 dark:text-slate-300 font-normal leading-relaxed">
              Since 1955, VisayasMed Hospital has served the community with unwavering commitment to excellence in healthcare.
            </p>
          </div>

          {/* Our Promise */}
          <div className="bg-gradient-to-br from-sky-50/40 to-blue-50/40 dark:from-sky-900/20 dark:to-blue-900/20 backdrop-blur-sm p-6 rounded-xl border border-sky-100/50 dark:border-sky-800/30">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-6 h-6 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-2">Patient-Centered Excellence</h4>
                <p className="text-base text-slate-800 dark:text-slate-300 leading-relaxed font-normal">We provide a convenient and personalized approach to healthcare, supported by well-equipped facilities and competent medical professionals dedicated to your wellness.</p>
              </div>
            </div>
          </div>

          {/* Our Commitment */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-slate-900 dark:text-slate-50 tracking-wide">Our Commitment</h4>
            <ul className="space-y-3">
              {[
                "Delivering compassionate, personalized healthcare to every patient",
                "Maintaining medical excellence through continuous professional development",
                "Creating a healing environment that promotes wellness and recovery"
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="w-2 h-2 bg-sky-500 dark:bg-sky-400 rounded-full mt-2 shrink-0" />
                  <span className="text-base text-slate-800 dark:text-slate-300 leading-relaxed font-normal">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tagline */}
          <p className="text-lg text-slate-700 dark:text-slate-400 italic font-medium border-t border-slate-200 dark:border-slate-700 pt-6">"Trusted care across generations — personalized, modern, and compassionate."</p>
        </div>
      </div>
    </div>

    <div className="mt-12 mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Mission Card */}
        <div className="group relative animate-slideInLeft transition-all duration-700">
          <div className="relative bg-gradient-to-br from-white to-sky-50/60 dark:from-gray-800 dark:to-gray-800/40 backdrop-blur-sm p-8 lg:p-10 rounded-2xl border border-sky-100/50 dark:border-sky-800/30 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
            {/* Decorative Background Shape */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-300/10 dark:bg-sky-500/10 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-300" />
            
            {/* Icon */}
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-sky-100/70 dark:bg-sky-900/40 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-sky-600 dark:text-sky-400">
                <path d="M12 2v20M2 12h20" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>

            {/* Heading */}
            <h3 className="text-3xl font-medium lg:font-normal text-sky-800 dark:text-sky-300 mb-1 tracking-wide">Our Mission</h3>
            <div className="w-12 h-1 bg-gradient-to-r from-sky-500 to-sky-300 dark:from-sky-400 dark:to-sky-300 rounded-full mb-6" />

            {/* Content */}
            <p className="text-base lg:text-lg text-gray-800 dark:text-gray-300 leading-relaxed lg:leading-loose letter-spacing-wide font-normal">To provide a patient-centered healing experience through quality medical care, by competent professionals and modern facilities in a conducive healing environment so patients may live a healthier, fuller and more productive lives.</p>
          </div>
        </div>

        {/* Vision Card */}
        <div className="group relative animate-slideInRight transition-all duration-700">
          <div className="relative bg-gradient-to-br from-white to-emerald-50/60 dark:from-gray-800 dark:to-gray-800/40 backdrop-blur-sm p-8 lg:p-10 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/30 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
            {/* Decorative Background Shape */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-300/10 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-300" />
            
            {/* Icon */}
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100/70 dark:bg-emerald-900/40 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-emerald-600 dark:text-emerald-400">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>

            {/* Heading */}
            <h3 className="text-3xl font-medium lg:font-normal text-emerald-800 dark:text-emerald-300 mb-1 tracking-wide">Our Vision</h3>
            <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-emerald-300 dark:from-emerald-400 dark:to-emerald-300 rounded-full mb-6" />

            {/* Content */}
            <p className="text-base lg:text-lg text-gray-800 dark:text-gray-300 leading-relaxed lg:leading-loose letter-spacing-wide font-normal">VisayasMed Hospital will be the hospital of choice for convenient, conducive, and patient-centered healing experience by 2025.</p>
          </div>
        </div>
      </div>
    </div>

    {/* Core Values Section */}
    <div className="mt-16 pt-12">
      <h2 className="text-3xl font-bold text-sky-600 dark:text-sky-400 mb-12 text-center">Our Core Values</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: "Sense of Urgency", desc: "Getting things done promptly and efficiently." },
          { name: "Integrity", desc: "Upholding honesty and ethical standards in all we do." },
          { name: "Compassion", desc: "Caring for patients with empathy and understanding." },
          { name: "Excellence", desc: "Striving for the highest quality in patient care and service." },
          { name: "Innovation", desc: "Embracing new ideas and continuous improvement." },
          { name: "Respect", desc: "Honoring the dignity and rights of every individual." },
        ].map((v, i) => (
          <div
            key={v.name}
            className={`group relative p-6 rounded-xl bg-gradient-to-br from-white to-sky-50/80 dark:from-gray-800 dark:to-gray-800/80 shadow-md hover:shadow-xl hover:scale-[1.02] hover:-rotate-1 transition-all duration-300 ease-out border border-sky-100/60 dark:border-sky-800/60 float-${i + 1}`}
          >
            <h4 className="text-xl font-semibold text-sky-800 dark:text-sky-400 mb-3">{v.name}</h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-normal">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Accredited Companies Section */}
    <div className="mt-20 pt-16">
      <div className="text-center mb-14">
        <h2 className="text-3xl lg:text-4xl font-medium lg:font-normal text-slate-900 dark:text-slate-100 mb-3 tracking-wide">Our Accredited Partners</h2>
        <p className="text-sm lg:text-base text-slate-700 dark:text-slate-400 font-normal max-w-2xl mx-auto">Trusted collaborations with leading organizations committed to excellence in healthcare</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {[
          "APPLE ONE",
          "APPLE ONE MACTAN",
          "BRILLIANT METAL CRAFT",
          "BUILD IT",
          "CEBU BIONIC",
          "CEBU PEOPLE'S COOP",
          "FOUNT OF LIFE (SUPPLIER)",
          "INTRANET TRADE",
          "LACSON & LACSON",
          "MCWD - METROPOLITAN CEBU WATER DISTRICT",
          "SUPREA",
          "TIMEX",
          "USDI",
          "VENRAY CONSTRUCTION",
          "PCSO",
        ].map((company) => (
          <div
            key={company}
            className="group relative overflow-hidden"
          >
            {/* Card Container */}
            <div className="relative h-full px-6 py-6 lg:px-8 lg:py-7 rounded-xl bg-white dark:bg-gray-800/50 border border-slate-200/70 dark:border-gray-700/50 hover:border-slate-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-md dark:hover:shadow-lg/20 hover:scale-[1.02]">
              {/* Subtle background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent dark:from-sky-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10" />

              {/* Content */}
              <p className="relative text-sm lg:text-base text-slate-800 dark:text-slate-200 font-normal text-center leading-relaxed tracking-wide group-hover:text-slate-900 dark:group-hover:text-slate-50 transition-colors duration-300">{company}</p>

              {/* Bottom accent line - appears on hover */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-sky-600 dark:from-sky-500 dark:to-sky-400 rounded-full group-hover:w-8 transition-all duration-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  </section>
)

export default About
