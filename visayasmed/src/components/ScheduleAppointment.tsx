import React, { useState, useEffect, useCallback } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
} from "date-fns";
import { doctorService } from "../utils/dataService";
import { appointmentService } from "../utils/appointmentService";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
interface Doctor {
  id?: string;
  name: string;
  specialty: string;
  experience: string;
  availability: string;
  rating: number;
  image?: string;
  patientsServed?: string;
}

interface FormErrors {
  patientName?: string;
  patientAge?: string;
  patientSex?: string;
  contactNumber?: string;
  email?: string;
  reasonForVisit?: string;
}

/* ─────────────────────────────────────────────
   Default Doctors
   ───────────────────────────────────────────── */
const defaultDoctors: Doctor[] = [
  { name: "Dr. Maria Santos", specialty: "Cardiology", experience: "15+ years", availability: "Mon–Fri", rating: 4.9, image: "" },
  { name: "Dr. Juan Reyes", specialty: "Pediatrics", experience: "12+ years", availability: "Tue–Sat", rating: 4.8, image: "" },
  { name: "Dr. Ana Cruz", specialty: "OB & GYNE", experience: "18+ years", availability: "Mon–Fri", rating: 5.0, image: "" },
  { name: "Dr. Roberto Lee", specialty: "General Surgery", experience: "14+ years", availability: "Mon–Thu", rating: 4.9, image: "" },
  { name: "Dr. Patricia Lim", specialty: "Internal Medicine", experience: "11+ years", availability: "Wed–Sat", rating: 4.7, image: "" },
  { name: "Dr. Miguel Santos", specialty: "Family Medicine", experience: "16+ years", availability: "Mon–Fri", rating: 4.8, image: "" },
];

const TIME_SLOTS = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
];

const GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600",
];

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */
const getInitials = (name: string) =>
  name.replace("Dr. ", "").split(" ").map(n => n[0]).join("").slice(0, 2);

const generateICS = (doctor: string, specialty: string, date: string, time: string, patientName: string): string => {
  const dateObj = new Date(`${date} ${time}`);
  const endDate = new Date(dateObj.getTime() + 30 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//VisayasMed//Appointment//EN",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(dateObj)}`,
    `DTEND:${fmt(endDate)}`,
    `SUMMARY:Appointment with ${doctor}`,
    `DESCRIPTION:${specialty} appointment for ${patientName} at VisayasMed Hospital`,
    "LOCATION:VisayasMed Hospital, Cebu, Philippines",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */
const ScheduleAppointment: React.FC = () => {
  const [step, setStep] = useState(1);
  const [animDirection, setAnimDirection] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);

  // Step 1 state
  const [doctors, setDoctors] = useState<Doctor[]>(defaultDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Step 2 state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [unavailableSlots] = useState<string[]>(["11:30 AM", "2:30 PM"]);

  // Step 3 state
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientSex, setPatientSex] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Step 4 state
  const [referenceNumber, setReferenceNumber] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load doctors from Firebase
  useEffect(() => {
    doctorService.getDoctors().then((data) => {
      if (data && data.length > 0) setDoctors(data as Doctor[]);
    }).catch(err => {
      console.warn("Doctors load failed, using defaults:", err instanceof Error ? err.message : err);
    });
  }, []);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const goToStep = useCallback((nextStep: number) => {
    setAnimDirection(nextStep > step ? "next" : "prev");
    setIsAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  }, [step]);

  /* ───── Calendar helpers ───── */
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    const today = startOfDay(new Date());
    const rows: React.ReactElement[] = [];
    let days: React.ReactElement[] = [];
    let day = calStart;

    while (day <= calEnd) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const inMonth = isSameMonth(day, monthStart);
        const isPast = isBefore(day, today);
        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
        const isToday = isSameDay(day, today);
        const isSunday = day.getDay() === 0;
        const isDisabled = isPast || !inMonth || isSunday;

        days.push(
          <button
            key={day.toString()}
            disabled={isDisabled}
            onClick={() => { setSelectedDate(currentDay); setSelectedTime(null); }}
            className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-sm font-semibold transition-all duration-200 
              ${isDisabled ? "text-gray-600 cursor-not-allowed opacity-40" : "hover:bg-blue-500/20 cursor-pointer"}
              ${isSelected ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105" : ""}
              ${isToday && !isSelected ? "ring-2 ring-blue-500/50 text-blue-400" : ""}
              ${!isDisabled && !isSelected ? "text-gray-200" : ""}
            `}
          >
            {format(day, "d")}
            {isToday && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full" />}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day.toString()} className="grid grid-cols-7 gap-1 justify-items-center">{days}</div>);
      days = [];
    }
    return rows;
  };

  /* ───── Validation ───── */
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!patientName.trim()) errors.patientName = "Name is required";
    if (!patientAge || parseInt(patientAge) < 1 || parseInt(patientAge) > 150) errors.patientAge = "Valid age is required";
    if (!patientSex) errors.patientSex = "Please select sex";
    if (!contactNumber.trim() || contactNumber.length < 7) errors.contactNumber = "Valid contact number is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Valid email is required";
    if (!reasonForVisit.trim()) errors.reasonForVisit = "Please describe your reason for visit";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ───── Submit (optimistic — instant navigation) ───── */
  const handleSubmit = () => {
    if (!validateForm() || !selectedDoctor || !selectedDate || !selectedTime) return;

    // Generate ref number locally — navigate instantly, no await
    const prefix = "VM";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const refNum = `${prefix}-${timestamp}-${random}`;

    setReferenceNumber(refNum);
    goToStep(4);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setTimeout(() => { setShowToast(true); setTimeout(() => setShowToast(false), 4000); }, 500);

    // Save to Firebase in the background — pass the same ref number so admin sees matching data
    const appointmentPayload = {
      doctorId: selectedDoctor.id || selectedDoctor.name.toLowerCase().replace(/\s+/g, "-"),
      doctorName: selectedDoctor.name,
      specialization: selectedDoctor.specialty,
      date: format(selectedDate, "yyyy-MM-dd"),
      timeSlot: selectedTime,
      patientName,
      patientAge: parseInt(patientAge),
      patientSex,
      contactNumber,
      email,
      reasonForVisit,
      isFirstVisit: isFirstVisit ?? false,
    };
    
    console.log("Submitting appointment to Firebase:", appointmentPayload);
    
    appointmentService.createAppointment(appointmentPayload, refNum)
      .then(res => console.log("Appointment saved successfully:", res.referenceNumber))
      .catch(err => {
        console.error("Appointment save to Firestore failed:", err);
      });
  };

  /* ───── Reset ───── */
  const resetFlow = () => {
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setPatientName(""); setPatientAge(""); setPatientSex("");
    setContactNumber(""); setEmail(""); setReasonForVisit("");
    setIsFirstVisit(null); setFormErrors({});
    setReferenceNumber("");
    goToStep(1);
  };

  /* ───── Download ICS ───── */
  const downloadICS = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;
    const ics = generateICS(selectedDoctor.name, selectedDoctor.specialty, format(selectedDate, "yyyy-MM-dd"), selectedTime, patientName);
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visayasmed-appointment-${referenceNumber}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#0a0f1e] relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #4f46e5 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 backdrop-blur-sm text-blue-400 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Book Appointment
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Schedule Your <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Visit</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Book an appointment with our expert physicians in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        {step < 4 && (
          <div className="mb-10">
            <div className="flex items-center justify-between max-w-lg mx-auto mb-3">
              {["Choose Doctor", "Date & Time", "Your Details"].map((label, idx) => {
                const stepNum = idx + 1;
                const isActive = step === stepNum;
                const isComplete = step > stepNum;
                return (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                      isComplete ? "bg-green-500 text-white shadow-lg shadow-green-500/30" :
                      isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110" :
                      "bg-gray-800 text-gray-500 border border-gray-700"
                    }`}>
                      {isComplete ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      ) : stepNum}
                    </div>
                    <span className={`hidden sm:block text-xs font-semibold uppercase tracking-wider ${isActive ? "text-blue-400" : isComplete ? "text-green-400" : "text-gray-600"}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="max-w-lg mx-auto h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
            <p className="text-center text-gray-500 text-xs mt-2 font-medium">Step {step} of 3</p>
          </div>
        )}

        {/* Step Content */}
        <div className={`transition-all duration-300 ${isAnimating ? (animDirection === "next" ? "opacity-0 translate-x-8" : "opacity-0 -translate-x-8") : "opacity-100 translate-x-0"}`}>

          {/* ═══════ STEP 1: Choose Doctor ═══════ */}
          {step === 1 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Select a Doctor</h2>
              <p className="text-gray-400 text-sm mb-8">Choose a physician for your appointment</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {doctors.map((doctor, idx) => {
                  const isSelected = selectedDoctor?.name === doctor.name;
                  const grad = GRADIENTS[idx % GRADIENTS.length];
                  return (
                    <button
                      key={doctor.name}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`group relative text-left p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                        isSelected
                          ? "bg-blue-600/10 border-blue-500/60 shadow-xl shadow-blue-600/10 ring-1 ring-blue-500/40"
                          : "bg-gray-900/60 backdrop-blur-sm border-gray-800/60 hover:border-gray-700 hover:bg-gray-900/80"
                      }`}
                      style={{ animationDelay: `${idx * 80}ms` }}
                    >
                      {/* Selection check */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}

                      {/* Avatar */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative flex-shrink-0">
                          {doctor.image ? (
                            <img src={doctor.image} alt={doctor.name} className="w-14 h-14 rounded-2xl object-cover shadow-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          ) : (
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-lg`}>
                              <span className="text-white font-bold text-base">{getInitials(doctor.name)}</span>
                            </div>
                          )}
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-gray-900" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">{doctor.name}</h3>
                          <p className="text-blue-400 text-sm font-semibold mt-0.5">{doctor.specialty}</p>
                        </div>
                      </div>



                      {/* Info badges */}
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-800/80 text-gray-300 text-xs font-medium border border-gray-700/50">
                          <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {doctor.experience}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-800/80 text-gray-300 text-xs font-medium border border-gray-700/50">
                          <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {doctor.availability}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <div className="mt-10 flex justify-end">
                <button
                  onClick={() => goToStep(2)}
                  disabled={!selectedDoctor}
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${
                    selectedDoctor
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-xl hover:shadow-blue-600/20 hover:scale-105"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Next Step
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
            </div>
          )}

          {/* ═══════ STEP 2: Date & Time ═══════ */}
          {step === 2 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Pick a Date & Time</h2>
              <p className="text-gray-400 text-sm mb-8">
                Booking with <span className="text-blue-400 font-semibold">{selectedDoctor?.name}</span> — {selectedDoctor?.specialty}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar */}
                <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-700 hover:text-white transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h3 className="text-white font-bold text-lg">{format(currentMonth, "MMMM yyyy")}</h3>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-700 hover:text-white transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 justify-items-center mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                      <span key={d} className="text-gray-500 text-xs font-semibold uppercase w-10 sm:w-12 text-center">{d}</span>
                    ))}
                  </div>
                  {/* Calendar grid */}
                  <div className="space-y-1">{renderCalendar()}</div>
                </div>

                {/* Time Slots */}
                <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
                  <h3 className="text-white font-bold text-lg mb-2">Available Time Slots</h3>
                  {selectedDate ? (
                    <>
                      <p className="text-gray-400 text-sm mb-5">
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {TIME_SLOTS.map(slot => {
                          const isUnavailable = unavailableSlots.includes(slot);
                          const isSelected = selectedTime === slot;
                          return (
                            <button
                              key={slot}
                              disabled={isUnavailable}
                              onClick={() => setSelectedTime(slot)}
                              className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                isUnavailable
                                  ? "bg-gray-800/40 text-gray-600 cursor-not-allowed line-through border border-gray-800/30"
                                  : isSelected
                                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105 border border-blue-500"
                                  : "bg-gray-800/60 text-gray-300 border border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800 hover:text-white"
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <svg className="w-12 h-12 mb-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="font-medium">Select a date first</p>
                      <p className="text-xs mt-1">Time slots will appear here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-10 flex justify-between">
                <button onClick={() => goToStep(1)} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 font-semibold text-sm hover:bg-gray-700 hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
                  Back
                </button>
                <button
                  onClick={() => goToStep(3)}
                  disabled={!selectedDate || !selectedTime}
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${
                    selectedDate && selectedTime
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-xl hover:shadow-blue-600/20 hover:scale-105"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Next Step
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
            </div>
          )}

          {/* ═══════ STEP 3: Patient Details ═══════ */}
          {step === 3 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Patient Information</h2>
              <p className="text-gray-400 text-sm mb-8">Please fill in your details to confirm the appointment</p>

              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="relative">
                    <input
                      type="text"
                      id="patientName"
                      value={patientName}
                      onChange={e => { setPatientName(e.target.value); setFormErrors(p => ({ ...p, patientName: undefined })); }}
                      placeholder=" "
                      className={`peer w-full px-4 pt-6 pb-2 rounded-xl bg-gray-800/60 border ${formErrors.patientName ? "border-red-500/60" : "border-gray-700/50"} text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder-transparent`}
                    />
                    <label htmlFor="patientName" className="absolute left-4 top-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-blue-400">
                      Full Name
                    </label>
                    {formErrors.patientName && <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.patientName}</p>}
                  </div>

                  {/* Age */}
                  <div className="relative">
                    <input
                      type="number"
                      id="patientAge"
                      value={patientAge}
                      onChange={e => { setPatientAge(e.target.value); setFormErrors(p => ({ ...p, patientAge: undefined })); }}
                      placeholder=" "
                      min={1}
                      max={150}
                      className={`peer w-full px-4 pt-6 pb-2 rounded-xl bg-gray-800/60 border ${formErrors.patientAge ? "border-red-500/60" : "border-gray-700/50"} text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder-transparent`}
                    />
                    <label htmlFor="patientAge" className="absolute left-4 top-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-blue-400">
                      Age
                    </label>
                    {formErrors.patientAge && <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.patientAge}</p>}
                  </div>

                  {/* Sex */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Sex</label>
                    <div className="flex gap-2">
                      {["Male", "Female", "Other"].map(sex => (
                        <button
                          key={sex}
                          onClick={() => { setPatientSex(sex); setFormErrors(p => ({ ...p, patientSex: undefined })); }}
                          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            patientSex === sex
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 border border-blue-500"
                              : "bg-gray-800/60 text-gray-400 border border-gray-700/50 hover:border-gray-600 hover:text-gray-200"
                          }`}
                        >
                          {sex}
                        </button>
                      ))}
                    </div>
                    {formErrors.patientSex && <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.patientSex}</p>}
                  </div>

                  {/* Contact Number */}
                  <div className="relative">
                    <input
                      type="tel"
                      id="contactNumber"
                      value={contactNumber}
                      onChange={e => { setContactNumber(e.target.value); setFormErrors(p => ({ ...p, contactNumber: undefined })); }}
                      placeholder=" "
                      className={`peer w-full px-4 pt-6 pb-2 rounded-xl bg-gray-800/60 border ${formErrors.contactNumber ? "border-red-500/60" : "border-gray-700/50"} text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder-transparent`}
                    />
                    <label htmlFor="contactNumber" className="absolute left-4 top-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-blue-400">
                      Contact Number
                    </label>
                    {formErrors.contactNumber && <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.contactNumber}</p>}
                  </div>

                  {/* Email */}
                  <div className="relative md:col-span-2">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setFormErrors(p => ({ ...p, email: undefined })); }}
                      placeholder=" "
                      className={`peer w-full px-4 pt-6 pb-2 rounded-xl bg-gray-800/60 border ${formErrors.email ? "border-red-500/60" : "border-gray-700/50"} text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder-transparent`}
                    />
                    <label htmlFor="email" className="absolute left-4 top-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-blue-400">
                      Email Address
                    </label>
                    {formErrors.email && <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.email}</p>}
                  </div>

                  {/* Reason for Visit */}
                  <div className="relative md:col-span-2">
                    <textarea
                      id="reasonForVisit"
                      value={reasonForVisit}
                      onChange={e => { if (e.target.value.length <= 200) { setReasonForVisit(e.target.value); setFormErrors(p => ({ ...p, reasonForVisit: undefined })); } }}
                      placeholder=" "
                      rows={3}
                      className={`peer w-full px-4 pt-6 pb-2 rounded-xl bg-gray-800/60 border ${formErrors.reasonForVisit ? "border-red-500/60" : "border-gray-700/50"} text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder-transparent resize-none`}
                    />
                    <label htmlFor="reasonForVisit" className="absolute left-4 top-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-blue-400">
                      Reason for Visit / Symptoms
                    </label>
                    <span className="absolute bottom-3 right-3 text-gray-600 text-xs">{reasonForVisit.length}/200</span>
                    {formErrors.reasonForVisit && <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.reasonForVisit}</p>}
                  </div>

                  {/* First Visit */}
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Is this your first visit?</label>
                    <div className="flex gap-3">
                      {[{ label: "Yes", val: true }, { label: "No", val: false }].map(opt => (
                        <button
                          key={opt.label}
                          onClick={() => setIsFirstVisit(opt.val)}
                          className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            isFirstVisit === opt.val
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 border border-blue-500"
                              : "bg-gray-800/60 text-gray-400 border border-gray-700/50 hover:border-gray-600 hover:text-gray-200"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Summary Mini-Card */}
              <div className="mt-6 bg-gray-900/40 border border-gray-800/40 rounded-xl p-4 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span className="text-white font-medium">{selectedDoctor?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-white font-medium">{selectedDate ? format(selectedDate, "MMM d, yyyy") : ""}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-white font-medium">{selectedTime}</span>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex justify-between">
                <button onClick={() => goToStep(2)} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 font-semibold text-sm hover:bg-gray-700 hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-sm tracking-wide hover:shadow-xl hover:shadow-blue-600/20 hover:scale-105 transition-all duration-300"
                >
                  Confirm Appointment
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </button>
              </div>
            </div>
          )}

          {/* ═══════ STEP 4: Confirmation ═══════ */}
          {step === 4 && (
            <div className="max-w-2xl mx-auto text-center">
              {/* Confetti effect */}
              {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                  {[...Array(40)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full animate-confetti"
                      style={{
                        left: `${Math.random() * 100}%`,
                        backgroundColor: ["#3b82f6", "#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#ec4899"][i % 6],
                        animationDelay: `${Math.random() * 1}s`,
                        animationDuration: `${2 + Math.random() * 2}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Success Icon */}
              <div className="mb-8 inline-flex items-center justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center animate-scale-in">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg className="w-10 h-10 text-green-400 animate-check-draw" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  {/* Pulse rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-green-500/30 animate-ping-slow" />
                  <div className="absolute -inset-3 rounded-full border border-green-500/10 animate-ping-slow" style={{ animationDelay: "0.5s" }} />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Appointment Booked!</h2>
              <p className="text-gray-400 mb-8">Your appointment has been successfully scheduled</p>

              {/* Summary Card */}
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6 sm:p-8 text-left mb-8">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  </div>
                  <h3 className="text-white font-bold">Appointment Summary</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Doctor</p>
                      <p className="text-white font-semibold">{selectedDoctor?.name}</p>
                      <p className="text-blue-400 text-sm">{selectedDoctor?.specialty}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Date & Time</p>
                      <p className="text-white font-semibold">{selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}</p>
                      <p className="text-gray-300 text-sm">{selectedTime}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Patient</p>
                      <p className="text-white font-semibold">{patientName}</p>
                      <p className="text-gray-300 text-sm">{contactNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Reference Number</p>
                      <p className="text-blue-400 font-bold text-lg tracking-wider">{referenceNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-800/60">
                  <div className="flex items-center gap-2 text-amber-400 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-xs">Status: <span className="font-bold text-amber-300">Pending Confirmation</span> — you'll be notified once confirmed</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={downloadICS}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gray-800 border border-gray-700 text-white font-bold text-sm hover:bg-gray-700 hover:border-gray-600 transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Add to Calendar
                </button>
                <button
                  onClick={resetFlow}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-sm hover:shadow-xl hover:shadow-blue-600/20 transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Book Another Appointment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${showToast ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"}`}>
        <div className="flex items-center gap-3 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl shadow-green-600/30">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div>
            <p className="font-bold text-sm">Success!</p>
            <p className="text-green-100 text-xs">Your appointment has been successfully booked!</p>
          </div>
          <button onClick={() => setShowToast(false)} className="ml-2 hover:bg-white/20 rounded-lg p-1 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti { animation: confetti 3s ease-out forwards; }
        @keyframes scale-in { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scale-in 0.5s ease-out forwards; }
        @keyframes check-draw { 0% { stroke-dasharray: 30; stroke-dashoffset: 30; } 100% { stroke-dashoffset: 0; } }
        .animate-check-draw { animation: check-draw 0.8s ease-out 0.3s forwards; stroke-dasharray: 30; stroke-dashoffset: 30; }
        @keyframes ping-slow { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.5); opacity: 0; } }
        .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
      `}</style>
    </div>
  );
};

export default ScheduleAppointment;
