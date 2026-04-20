import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getServiceBySlug } from "../data/serviceDetails";
import { doctorService } from "../utils/dataService";
import Footer from "./Footer";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: string;
  languages: string | string[];
  availability: string;
  icon: string;
  achievements: string;
  patientsServed: string;
  rating: number;
  specialExpertise: string;
  image?: string;
}

const defaultDoctorsByService: Record<string, Doctor[]> = {
  "family-medicine": [
    {
      id: "fm-1", name: "Dr. Miguel Santos", specialty: "Family Medicine",
      qualification: "MD, Family Medicine Specialist, Certified in Preventive Medicine",
      experience: "16+ years", languages: ["English", "Tagalog", "Cebuano", "Ilonggo"],
      availability: "Mon-Fri, 9 AM - 5 PM", icon: "",
      achievements: "Community health advocate, Runs annual health camps in remote Visayas islands",
      patientsServed: "10000+", rating: 4.8,
      specialExpertise: "Rural healthcare delivery, Preventive medicine", image: ""
    }
  ],
  "pediatrics": [
    {
      id: "ped-1", name: "Dr. Juan Reyes", specialty: "Pediatrics",
      qualification: "MD, Pediatric Specialist, Member of Philippine Pediatric Society",
      experience: "12+ years", languages: ["English", "Tagalog", "Hiligaynon"],
      availability: "Tue-Sat, 10 AM - 6 PM", icon: "",
      achievements: "Led community vaccination programs across 15 Visayas municipalities",
      patientsServed: "8000+", rating: 4.8,
      specialExpertise: "Child nutrition, Infectious disease prevention", image: ""
    }
  ],
  "internal-medicine": [
    {
      id: "im-1", name: "Dr. Patricia Lim", specialty: "Internal Medicine",
      qualification: "MD, Internal Medicine Specialist, Diplomate of Philippine College of Physicians",
      experience: "11+ years", languages: ["English", "Tagalog", "Mandarin", "Bicolano"],
      availability: "Wed-Sat, 10 AM - 6 PM", icon: "",
      achievements: "Established diabetes management program serving 500+ patients annually",
      patientsServed: "7000+", rating: 4.7,
      specialExpertise: "Tropical infectious diseases, Geriatric care", image: ""
    }
  ],
  "surgery": [
    {
      id: "surg-1", name: "Dr. Roberto Lee", specialty: "General Surgery",
      qualification: "MD, Surgical Specialist, Fellow of Philippine College of Surgeons",
      experience: "14+ years", languages: ["English", "Tagalog", "Mandarin"],
      availability: "Mon-Thu, 9 AM - 5 PM", icon: "",
      achievements: "Performed 2000+ successful surgeries, Expert in minimally invasive procedures",
      patientsServed: "4000+", rating: 4.9,
      specialExpertise: "Laparoscopic surgery, Emergency trauma care", image: ""
    }
  ],
  "ob-gyne": [
    {
      id: "ob-1", name: "Dr. Ana Cruz", specialty: "OB & GYNE",
      qualification: "MD, OB-GYN Specialist, Certified Maternal-Fetal Medicine",
      experience: "18+ years", languages: ["English", "Tagalog", "Cebuano", "Waray"],
      availability: "Mon-Fri, 8 AM - 4 PM", icon: "",
      achievements: "Delivered over 3000 babies, Regional coordinator for maternal health initiatives",
      patientsServed: "6000+", rating: 5.0,
      specialExpertise: "High-risk pregnancies, Rural maternal care", image: ""
    }
  ]
};

const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!service || !slug) return;
    const defaults = defaultDoctorsByService[slug] || [];
    setDoctors(defaults);
    setLoadingDoctors(false);

    doctorService.getDoctors()
      .then((allDoctors) => {
        const data = allDoctors as Doctor[];
        if (data && data.length > 0) {
          const matching = data.filter((doc) =>
            service.doctorSpecialtyMatch.some(
              (keyword) =>
                doc.specialty?.toLowerCase().includes(keyword.toLowerCase()) ||
                doc.specialExpertise?.toLowerCase().includes(keyword.toLowerCase())
            )
          );
          if (matching.length > 0) {
            setDoctors(matching);
          }
        }
      })
      .catch((err) => {
        console.warn("Firebase doctors load failed, using defaults:", err);
      });
  }, [service, slug]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 pt-28">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Service Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The service you're looking for doesn't exist.</p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            ← Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative scroll-smooth transition-colors duration-500 overflow-x-hidden bg-gray-50 dark:bg-gray-950">
      {/* Page-level background elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300" />

        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Soft orbs */}
        <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-blue-200/15 dark:bg-blue-800/5 rounded-full blur-3xl" />
        <div className="absolute top-[40%] left-[-5%] w-[400px] h-[400px] bg-indigo-200/10 dark:bg-indigo-800/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-sky-200/10 dark:bg-sky-800/5 rounded-full blur-3xl" />
      </div>

      <main className="max-w-full relative z-10 pt-28 pb-12">
        {/* Breadcrumb */}
        <div className="px-6 lg:px-8 max-w-7xl mx-auto mb-8 animate-fadeUp">
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Services</Link>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">{service.title}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-16 animate-fadeUp" style={{ animationDelay: "100ms" }}>
          <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200/70 dark:border-gray-800/70 shadow-xl">
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.colorAccent}`} />

            {/* Subtle decorative orb in corner */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

            <div className="p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-start gap-8">
                <div className={`w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br ${service.colorAccent} rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <svg className="w-10 h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className={`inline-block text-xs font-bold tracking-[0.25em] uppercase ${service.colorText} mb-3`}>
                    {service.tagline}
                  </span>
                  <h1 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    {service.title}
                  </h1>
                  <div className={`w-16 h-1 bg-gradient-to-r ${service.colorAccent} rounded-full mb-6`} />
                  <p className="text-black dark:text-gray-400 text-lg leading-relaxed max-w-3xl">
                    {service.heroDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-16 animate-fadeUp" style={{ animationDelay: "200ms" }}>
          <div className="bg-white dark:bg-gray-900/80 rounded-2xl border border-gray-200/70 dark:border-gray-800/70 p-8 lg:p-10 shadow-lg">
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              About This Department
            </h2>
            <p className="text-black dark:text-gray-400 leading-relaxed text-base lg:text-lg">
              {service.overview}
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-16 animate-fadeUp" style={{ animationDelay: "300ms" }}>
          <div className="text-center mb-10">
            <span className={`inline-block text-xs font-bold tracking-[0.25em] uppercase ${service.colorText} mb-3`}>
              What We Offer
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Our Services & Procedures
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200/70 dark:border-gray-800/70 p-6 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-500 animate-scaleIn"
                style={{ animationDelay: `${400 + idx * 80}ms` }}
              >
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${service.colorAccent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className={`w-12 h-12 bg-gradient-to-br ${service.colorAccent} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-md`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-black dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Specialties & Why Choose Us */}
        <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-16 animate-fadeUp" style={{ animationDelay: "400ms" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-900/80 rounded-2xl border border-gray-200/70 dark:border-gray-800/70 p-8 shadow-lg">
              <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Areas of Expertise
              </h3>
              <ul className="space-y-3">
                {service.specialties.map((spec, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.colorAccent}`} />
                    <span className="text-black dark:text-gray-300 font-medium">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-gray-900/80 dark:to-gray-900/60 rounded-2xl border border-blue-200/40 dark:border-gray-800/70 p-8 shadow-lg">
              <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose VisayasMed?
              </h3>
              <ul className="space-y-4">
                {service.whyChooseUs.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${service.colorText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-black dark:text-gray-300">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Doctors Section */}
        <section
          className="relative w-screen transition-colors duration-300 animate-fadeUp"
          style={{
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)",
            animationDelay: "500ms",
          }}
        >
          {/* Section background */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-blue-50/30 to-slate-100 dark:from-gray-900 dark:via-gray-900/80 dark:to-gray-900 transition-colors duration-300" />
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative max-w-6xl mx-auto z-10 px-6 lg:px-8 py-16 lg:py-20">
            <div className="mb-12 text-center">
              <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-blue-600 dark:text-blue-400 mb-3">
                Our Team
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {service.title} Physicians
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-6" />
              <p className="text-black dark:text-gray-400 mt-2 max-w-3xl mx-auto text-lg leading-relaxed">
                Meet our dedicated {service.title.toLowerCase()} specialists — experienced healthcare professionals committed to providing expert care
              </p>
            </div>

            {loadingDoctors ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 text-gray-500 dark:text-gray-400">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading doctors...
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {doctors.map((doctor, idx) => {
                  const langs = Array.isArray(doctor.languages) ? doctor.languages : (doctor.languages || "").split(",").map(s => s.trim()).filter(Boolean);
                  return (
                    <div
                      key={doctor.id || doctor.name}
                      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/70 dark:border-gray-700/70 p-8 hover:border-blue-300 dark:hover:border-blue-600/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 animate-scaleIn"
                      style={{ animationDelay: `${600 + idx * 150}ms` }}
                    >
                      {/* Top accent bar */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.colorAccent}`} />

                      {/* Profile icon */}
                      <div className="relative mb-6">
                        {doctor.image ? (
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-20 h-20 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-all duration-500"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        ) : (
                          <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${service.colorAccent} rounded-2xl shadow-lg`}>
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Doctor Name & Specialty */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {doctor.name}
                      </h3>
                      <p className={`text-sm ${service.colorText} font-semibold mb-3`}>{doctor.specialty}</p>

                      {/* Rating */}
                      {doctor.rating > 0 && (
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < Math.floor(doctor.rating) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-black dark:text-gray-400 ml-1">
                            {doctor.rating} ({doctor.patientsServed} patients)
                          </span>
                        </div>
                      )}

                      {/* Qualification */}
                      {doctor.qualification && (
                        <p className="text-sm text-black dark:text-gray-300 mb-3 line-clamp-2">
                          {doctor.qualification}
                        </p>
                      )}

                      {/* Special Expertise */}
                      {doctor.specialExpertise && (
                        <div className="flex items-start gap-2 text-sm mb-3">
                          <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${service.colorText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className={`${service.colorText} font-medium`}>{doctor.specialExpertise}</span>
                        </div>
                      )}

                      {/* Achievements */}
                      {doctor.achievements && (
                        <div className="flex items-start gap-2 text-xs text-black dark:text-gray-400 mb-4">
                          <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="line-clamp-2">{doctor.achievements}</span>
                        </div>
                      )}

                      {/* Stats badges */}
                      <div className="flex gap-2 mb-4 text-xs flex-wrap">
                        {doctor.experience && (
                          <span className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200/60 dark:border-blue-700/40">
                            {doctor.experience}
                          </span>
                        )}
                        {langs.length > 0 && (
                          <span className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200/60 dark:border-purple-700/40">
                            {langs.length} languages
                          </span>
                        )}
                      </div>

                      {/* Languages */}
                      {langs.length > 0 && (
                        <p className="text-xs text-black dark:text-gray-400 mb-4">
                          {langs.join(", ")}
                        </p>
                      )}

                      {/* Availability */}
                      {doctor.availability && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-5">
                          <p className="text-sm text-black dark:text-gray-300">
                            <span className={`font-semibold ${service.colorText}`}>Available:</span> {doctor.availability}
                          </p>
                        </div>
                      )}

                      {/* CTA Button */}
                      <a href="/schedule-appointment" className={`block w-full py-3 px-4 bg-gradient-to-r ${service.colorAccent} hover:opacity-90 text-white font-semibold text-sm rounded-xl transition-all duration-300 hover:shadow-lg text-center`}>
                        Schedule Appointment
                      </a>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Link to all doctors */}
            <div className="text-center mt-10">
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
              >
                View All Doctors
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-12 mt-16 animate-fadeUp" style={{ animationDelay: "600ms" }}>
          <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${service.colorAccent} p-8 lg:p-12 text-center shadow-2xl`}>
            {/* Abstract pattern instead of mback.png */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/15 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />
              <div className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }}
              />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Need Expert {service.title} Care?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Our {service.title} team is ready to provide you with compassionate, world-class medical care. Schedule your appointment today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="tel:+63322531901"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  Call Us Now
                </a>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
                >
                  ← View All Services
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
