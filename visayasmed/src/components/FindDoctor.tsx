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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filteredDoctors.map((doctor, idx) => {
            const badges = doctor.availability ? doctor.availability.split(',').map(s => s.trim()).filter(Boolean) : [];
            return (
              <div
                key={doctor.name}
                className="group flex flex-col animate-slide-up-fade"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Photo */}
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-gray-200 dark:bg-gray-800 shadow-md">
                  {doctor.image ? (
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                      {(doctor as any).icon || "👨‍⚕️"}
                    </div>
                  )}
                </div>

                {/* Details */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-sky-600 transition-colors">
                  {doctor.name}
                </h3>
                <p className="text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                  {doctor.specialty}
                </p>

                {/* Availability Badges */}
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto mb-4">
                    {badges.map((b, i) => (
                      <span
                        key={i}
                        className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-sky-600/80 text-[10px] font-bold text-sky-600 dark:border-sky-500/80 dark:text-sky-400"
                        title={b}
                      >
                        {b.substring(0, 2)}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <a href="/schedule-appointment" className="block w-full py-2.5 px-4 mt-auto bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-lg transition-colors text-center shadow-sm">
                  Schedule Appointment
                </a>
              </div>
            );
          })}
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
