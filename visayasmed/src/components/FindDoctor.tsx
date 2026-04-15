import { useEffect, useState } from 'react';
import { doctorService } from '../utils/dataService';

const FindDoctor = () => {
  const defaultDoctors = [
    {
      name: "Dr. Maria Santos",
      specialty: "Cardiology",
      qualification: "MD, Board Certified Cardiologist, Fellow of Philippine Heart Association",
      experience: "15+ years",
      languages: ["English", "Tagalog", "Cebuano"],
      availability: "Mon-Fri, 9 AM - 5 PM",
      achievements: "Published 12 research papers on tropical cardiology, Recipient of Visayas Medical Excellence Award 2024",
      patientsServed: "5000+",
      rating: 4.9,
      specialExpertise: "Tropical cardiovascular diseases, Preventive cardiology",
      image: ""
    },
    {
      name: "Dr. Juan Reyes",
      specialty: "Pediatrics",
      qualification: "MD, Pediatric Specialist, Member of Philippine Pediatric Society",
      experience: "12+ years",
      languages: ["English", "Tagalog", "Hiligaynon"],
      availability: "Tue-Sat, 10 AM - 6 PM",
      achievements: "Led community vaccination programs across 15 Visayas municipalities",
      patientsServed: "8000+",
      rating: 4.8,
      specialExpertise: "Child nutrition, Infectious disease prevention",
      image: ""
    },
    {
      name: "Dr. Ana Cruz",
      specialty: "OB & GYNE",
      qualification: "MD, OB-GYN Specialist, Certified Maternal-Fetal Medicine",
      experience: "18+ years",
      languages: ["English", "Tagalog", "Cebuano", "Waray"],
      availability: "Mon-Fri, 8 AM - 4 PM",
      achievements: "Delivered over 3000 babies, Regional coordinator for maternal health initiatives",
      patientsServed: "6000+",
      rating: 5.0,
      specialExpertise: "High-risk pregnancies, Rural maternal care",
      image: ""
    },
    {
      name: "Dr. Roberto Lee",
      specialty: "General Surgery",
      qualification: "MD, Surgical Specialist, Fellow of Philippine College of Surgeons",
      experience: "14+ years",
      languages: ["English", "Tagalog", "Mandarin"],
      availability: "Mon-Thu, 9 AM - 5 PM",
      achievements: "Performed 2000+ successful surgeries, Expert in minimally invasive procedures",
      patientsServed: "4000+",
      rating: 4.9,
      specialExpertise: "Laparoscopic surgery, Emergency trauma care",
      image: ""
    },
    {
      name: "Dr. Patricia Lim",
      specialty: "Internal Medicine",
      qualification: "MD, Internal Medicine Specialist, Diplomate of Philippine College of Physicians",
      experience: "11+ years",
      languages: ["English", "Tagalog", "Mandarin", "Bicolano"],
      availability: "Wed-Sat, 10 AM - 6 PM",
      achievements: "Established diabetes management program serving 500+ patients annually",
      patientsServed: "7000+",
      rating: 4.7,
      specialExpertise: "Tropical infectious diseases, Geriatric care",
      image: ""
    },
    {
      name: "Dr. Miguel Santos",
      specialty: "Family Medicine",
      qualification: "MD, Family Medicine Specialist, Certified in Preventive Medicine",
      experience: "16+ years",
      languages: ["English", "Tagalog", "Cebuano", "Ilonggo"],
      availability: "Mon-Fri, 9 AM - 5 PM",
      achievements: "Community health advocate, Runs annual health camps in remote Visayas islands",
      patientsServed: "10000+",
      rating: 4.8,
      specialExpertise: "Rural healthcare delivery",
      image: ""
    },
  ];

  const [doctors, setDoctors] = useState(defaultDoctors);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  useEffect(() => {
    doctorService.getDoctors().then((data) => {
      if (data && data.length > 0) setDoctors(data as any);
    }).catch(err => {
      console.warn("Doctors load failed, using defaults:", err instanceof Error ? err.message : err);
    });
  }, []);

  const specialties = ["all", ...new Set(doctors.map(d => d.specialty))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const getInitials = (name: string) => {
    return name.replace("Dr. ", "").split(" ").map(n => n[0]).join("").slice(0, 2);
  };

  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-violet-500 to-purple-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
  ];

  return (
    <section
      className="relative w-screen transition-colors duration-300"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      {/* Background with gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-gray-950" />
      <div className="absolute inset-0 gradient-mesh-bg opacity-50" />

      <div className="relative max-w-7xl mx-auto z-10 px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-blue-600 dark:text-blue-400 mb-3">Our Medical Team</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-4">
            Find a{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Physician
            </span>
          </h2>
          <div className="section-divider" />
          <p className="text-black dark:text-gray-400 mt-4 font-normal max-w-2xl mx-auto text-lg leading-relaxed">
            Connect with our highly qualified and experienced medical professionals, recognized leaders in Visayas healthcare
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mb-10">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-black dark:text-white placeholder-gray-800 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm shadow-sm"
            />
          </div>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-4 py-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-black dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-sm min-w-[160px]"
          >
            {specialties.map(s => (
              <option key={s} value={s}>{s === "all" ? "All Specialties" : s}</option>
            ))}
          </select>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor, idx) => (
            <div
              key={doctor.name}
              className="group relative bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-500 hover:-translate-y-2 animate-slide-up-fade"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Top gradient accent */}
              <div className={`h-1.5 bg-gradient-to-r ${gradients[idx % gradients.length]}`} />

              <div className="p-6 sm:p-7">
                {/* Header: Avatar + Name */}
                <div className="flex items-start gap-4 mb-5">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {doctor.image ? (
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-2xl object-cover shadow-lg group-hover:scale-110 group-hover:rotate-2 transition-all duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[idx % gradients.length]} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-2 transition-all duration-500`}>
                        <span className="text-white font-bold text-lg tracking-tight">{getInitials(doctor.name)}</span>
                      </div>
                    )}
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" />
                  </div>

                  {/* Name + Specialty */}
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mt-0.5">{doctor.specialty}</p>
                    {/* Rating inline */}
                    <div className="flex items-center gap-1 mt-1.5">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(doctor.rating) ? "text-amber-400" : "text-gray-200 dark:text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-black dark:text-gray-400 ml-0.5 font-medium">{doctor.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Qualification */}
                <p className="text-sm text-black dark:text-gray-300 font-normal mb-4 line-clamp-2 leading-relaxed">
                  {doctor.qualification}
                </p>

                {/* Expertise & Achievements */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                        <line x1="22" y1="12" x2="19" y2="12"/><line x1="5" y1="12" x2="2" y2="12"/>
                        <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
                      </svg>
                    </span>
                    <p className="text-xs text-black dark:text-gray-400 leading-relaxed">{doctor.specialExpertise}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-md bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="6"/>
                        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                      </svg>
                    </span>
                    <p className="text-xs text-black dark:text-gray-400 leading-relaxed line-clamp-2">{doctor.achievements}</p>
                  </div>
                </div>

                {/* Stats badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30 text-xs font-semibold">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {doctor.experience}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800/30 text-xs font-semibold">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                    {doctor.languages.length} languages
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/30 text-xs font-semibold">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {doctor.patientsServed}
                  </span>
                </div>

                {/* Availability */}
                <div className="border-t border-gray-100 dark:border-gray-700/50 pt-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-sm text-black dark:text-gray-300">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">Available:</span>{" "}
                      {doctor.availability}
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 group-hover:scale-[1.02]">
                  Schedule Appointment
                  <svg className="inline-block w-4 h-4 ml-1.5 -mt-0.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>

              {/* Bottom gradient accent on hover */}
              <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradients[idx % gradients.length]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">No doctors found</h3>
            <p className="text-black dark:text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FindDoctor;
