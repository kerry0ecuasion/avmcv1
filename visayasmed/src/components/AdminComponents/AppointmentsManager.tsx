import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { appointmentService, type AppointmentData, type AppointmentStatus } from "../../utils/appointmentService";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import AppointmentModal from "./AppointmentModal";

/* ─── Types ─── */
type ToastType = "success" | "error" | "info";
interface Toast { id: number; msg: string; type: ToastType; }

/* ─── Constants ─── */
const STATUS_BADGE: Record<AppointmentStatus, string> = {
  pending:   "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  completed: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  draft:     "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
};

const STATUS_EMOJI: Record<AppointmentStatus, string> = {
  pending: "🟡", confirmed: "🟢", cancelled: "🔴", completed: "⚫", draft: "🔵",
};

/* ─── Main Component ─── */
const AppointmentsManager: React.FC = () => {
  const { adminEmail } = useAdminAuth();

  /* state */
  const [appointments, setAppointments] = useState<(AppointmentData & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  /* filters */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  /* modal */
  const [selected, setSelected] = useState<(AppointmentData & { id: string }) | null>(null);

  /* quick actions */
  const [acting, setActing] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  /* track "seen" appointments for new-arrival notifications */
  const seenIds = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef(true);

  /* ── Toast helper ── */
  const addToast = useCallback((msg: string, type: ToastType = "success") => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  }, []);

  /* ── Real-time listener ── */
  useEffect(() => {
    const unsub = appointmentService.subscribeToAppointments((data) => {
      console.log("Admin received appointments sync:", data.length);
      if (isFirstLoad.current) {
        // Seed seen IDs silently on first load
        data.forEach(a => seenIds.current.add(a.id));
        isFirstLoad.current = false;
      } else {
        // Detect new arrivals
        data.forEach(a => {
          if (!seenIds.current.has(a.id)) {
            seenIds.current.add(a.id);
            addToast(`🔔 New appointment from ${a.patientName || "Unknown"} — ${a.referenceNumber || "N/A"}`, "info");
          }
        });
      }
      setAppointments(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore subscription error in Admin:", error);
      addToast(`Failed to sync appointments: ${error instanceof Error ? error.message : "Unknown error"}`, "error");
      setLoading(false);
    });
    return () => unsub();
  }, [addToast]);

  /* ── Derived data ── */
  const doctors = Array.from(new Set(appointments.map(a => a.doctorName))).sort();

  const filtered = appointments.filter(a => {
    const q = search.toLowerCase().trim();
    const pName = (a.patientName || "").toLowerCase();
    const rNum = (a.referenceNumber || "").toLowerCase();
    
    const matchSearch = !q || pName.includes(q) || rNum.includes(q);
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchDoctor = doctorFilter === "all" || (a.doctorName || "Unknown") === doctorFilter;
    
    let matchDate = true;
    if (dateFrom || dateTo) {
      if (!a.date) {
        matchDate = false;
      } else {
        try {
          const aDate = parseISO(a.date);
          if (dateFrom && dateTo) matchDate = isWithinInterval(aDate, { start: startOfDay(parseISO(dateFrom)), end: endOfDay(parseISO(dateTo)) });
          else if (dateFrom) matchDate = aDate >= startOfDay(parseISO(dateFrom));
          else if (dateTo)   matchDate = aDate <= endOfDay(parseISO(dateTo));
        } catch (e) {
          console.warn("Date parsing error for appointment:", a.id, e);
          matchDate = false;
        }
      }
    }
    return matchSearch && matchStatus && matchDoctor && matchDate;
  });

  const counts = {
    all:       appointments.length,
    pending:   appointments.filter(a => a.status === "pending").length,
    confirmed: appointments.filter(a => a.status === "confirmed").length,
    cancelled: appointments.filter(a => a.status === "cancelled").length,
    completed: appointments.filter(a => a.status === "completed").length,
  };

  const today = format(new Date(), "yyyy-MM-dd");
  const todayCounts = {
    pending:   appointments.filter(a => a.status === "pending"   && a.date === today).length,
    confirmed: appointments.filter(a => a.status === "confirmed" && a.date === today).length,
    cancelled: appointments.filter(a => a.status === "cancelled" && a.date === today).length,
    total:     appointments.filter(a => a.date?.startsWith(format(new Date(), "yyyy-MM"))).length,
    completed: appointments.filter(a => a.status === "completed").length,
  };

  /* ── Update local state after action ── */
  const handleUpdated = (id: string, updates: Partial<AppointmentData>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, ...updates } as any : null);
  };

  /* ── Inline quick actions ── */
  const quickConfirm = async (apt: AppointmentData & { id: string }) => {
    if (acting) return;
    setActing(apt.id + "-confirm");
    try {
      await appointmentService.confirmAppointment(apt.id, adminEmail || "admin");
      handleUpdated(apt.id, { status: "confirmed", confirmedBy: adminEmail || "admin", confirmedAt: new Date() });
      addToast("✅ Appointment confirmed", "success");
    } catch { addToast("Failed to confirm", "error"); }
    finally { setActing(null); }
  };

  const quickCancel = async (aptId: string) => {
    if (!cancelReason.trim()) { addToast("Enter a cancellation reason", "error"); return; }
    const apt = appointments.find(a => a.id === aptId);
    if (!apt || acting) return;
    setActing(aptId + "-cancel");
    try {
      await appointmentService.cancelAppointment(aptId, cancelReason.trim(), apt.doctorId, apt.date, apt.timeSlot);
      handleUpdated(aptId, { status: "cancelled", cancelReason: cancelReason.trim(), cancelledAt: new Date() });
      addToast("❌ Appointment cancelled", "info");
      setCancelTarget(null);
      setCancelReason("");
    } catch { addToast("Failed to cancel", "error"); }
    finally { setActing(null); }
  };

  const clearFilters = () => { setSearch(""); setStatusFilter("all"); setDoctorFilter("all"); setDateFrom(""); setDateTo(""); };

  /* ── Render ── */
  return (
    <div className="relative">
      {/* Toast Stack */}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium max-w-sm animate-slide-in-right
            ${t.type === "success" ? "bg-green-600 text-white" : t.type === "error" ? "bg-red-600 text-white" : "bg-sky-600 text-white"}`}>
            {t.msg}
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <AppointmentModal
          appointment={selected}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
          onToast={addToast}
        />
      )}

      {/* Cancel inline modal */}
      {cancelTarget && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => { setCancelTarget(null); setCancelReason(""); }}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Cancel Appointment</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Please provide a reason for cancellation. This will be sent to the patient.</p>
            <textarea
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              rows={3}
              placeholder="Reason for cancellation..."
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => quickCancel(cancelTarget)} disabled={acting === cancelTarget + "-cancel"}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm disabled:opacity-50 transition-colors">
                {acting === cancelTarget + "-cancel" ? "Cancelling…" : "Confirm Cancellation"}
              </button>
              <button onClick={() => { setCancelTarget(null); setCancelReason(""); }}
                className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-sm transition-colors">
                Back
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {([
          { label: "Pending", key: "pending", emoji: "🟡", count: counts.pending, sub: `${todayCounts.pending} today`, color: "border-yellow-400" },
          { label: "Confirmed", key: "confirmed", emoji: "🟢", count: counts.confirmed, sub: `${todayCounts.confirmed} today`, color: "border-green-500" },
          { label: "Completed", key: "completed", emoji: "⚫", count: counts.completed, sub: "Historical", color: "border-gray-500" },
          { label: "Cancelled", key: "cancelled", emoji: "🔴", count: counts.cancelled, sub: `${todayCounts.cancelled} today`, color: "border-red-500" },
          { label: "Total", key: "all", emoji: "📋", count: counts.all, sub: `${todayCounts.total} this month`, color: "border-sky-500" },
        ] as const).map(card => (
          <button
            key={card.key}
            onClick={() => setStatusFilter(card.key)}
            className={`text-left p-4 rounded-2xl bg-white dark:bg-gray-800 border-l-4 ${card.color} shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${statusFilter === card.key ? "ring-2 ring-sky-500" : ""}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{card.emoji}</span>
              <span className="text-3xl font-black text-gray-900 dark:text-white">{card.count}</span>
            </div>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{card.label}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{card.sub}</p>
          </button>
        ))}
      </div>

      {/* Header + Filters */}
      <div className="flex flex-col gap-4 mb-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">📋 Appointments</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Showing {filtered.length} of {appointments.length} appointments</p>
          </div>
          <div className="bg-sky-50 dark:bg-sky-900/30 px-4 py-2 rounded-xl border border-sky-100 dark:border-sky-800">
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest block mb-0.5">Today's Date</span>
            <span className="text-sm font-black text-sky-900 dark:text-sky-100">{format(new Date(), "EEEE, MMMM do, yyyy")}</span>
          </div>
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search name or reference…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {["all","pending","confirmed","cancelled","completed"].map(s => (
              <option key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          {/* Doctor filter */}
          <select
            value={doctorFilter}
            onChange={e => setDoctorFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Doctors</option>
            {doctors.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          {/* Date from */}
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          {/* Clear */}
          {(search || statusFilter !== "all" || doctorFilter !== "all" || dateFrom || dateTo) && (
            <button onClick={clearFilters}
              className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading appointments…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-400 text-lg font-semibold">No appointments found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {["#","Ref No.","Patient","Doctor","Appt. Date","Time","Status","Done At","Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((apt, idx) => (
                <tr key={apt.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sky-600 dark:text-sky-400 text-xs font-bold tracking-wide">{apt.referenceNumber}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{apt.patientName}</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200 whitespace-nowrap">{apt.doctorName}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {apt.date ? format(parseISO(apt.date), "MMM d, yyyy") : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">{apt.timeSlot || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_BADGE[apt.status]}`}>
                      {STATUS_EMOJI[apt.status]} {apt.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                    {apt.status === "completed" && apt.completedAt ? format(apt.completedAt as Date, "MMM d, h:mm a") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {/* View */}
                      <button
                        onClick={() => setSelected(apt)}
                        title="View Details"
                        className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      {/* Confirm */}
                      {apt.status !== "confirmed" && apt.status !== "cancelled" && apt.status !== "completed" && (
                        <button
                          onClick={() => quickConfirm(apt)}
                          disabled={acting === apt.id + "-confirm"}
                          title="Confirm"
                          className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        </button>
                      )}
                      {/* Cancel */}
                      {apt.status !== "cancelled" && apt.status !== "completed" && (
                        <button
                          onClick={() => { setCancelTarget(apt.id); setCancelReason(""); }}
                          title="Cancel"
                          className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default AppointmentsManager;
