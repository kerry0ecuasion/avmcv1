import React, { useState } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { appointmentService, emailService, type AppointmentData, type AppointmentStatus } from "../../utils/appointmentService";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

interface Props {
  appointment: AppointmentData & { id: string };
  onClose: () => void;
  onUpdated: (id: string, updates: Partial<AppointmentData>) => void;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

const fmt = (d: Date | undefined | null) =>
  d ? format(new Date(d), "MMMM d, yyyy h:mm a") : "—";

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending:   "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  completed: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  draft:     "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
};

const AppointmentModal: React.FC<Props> = ({ appointment: apt, onClose, onUpdated, onToast }) => {
  const { adminEmail } = useAdminAuth();
  const [notes, setNotes] = useState(apt.adminNotes || apt.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [acting, setActing] = useState<string | null>(null);
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await appointmentService.saveAdminNotes(apt.id, notes);
      onUpdated(apt.id, { adminNotes: notes });
      onToast("Notes saved successfully", "success");
    } catch { onToast("Failed to save notes", "error"); }
    finally { setSavingNotes(false); }
  };

  const handleConfirm = async () => {
    if (acting) return;
    setActing("confirm");
    try {
      await appointmentService.confirmAppointment(apt.id, adminEmail || "admin", notes);
      const updated = { ...apt, status: "confirmed" as AppointmentStatus, confirmedBy: adminEmail || "admin", confirmedAt: new Date() };
      await emailService.sendConfirmationEmail(updated);
      onUpdated(apt.id, { status: "confirmed", confirmedBy: adminEmail || "admin", confirmedAt: new Date() });
      onToast("✅ Appointment confirmed and email sent", "success");
    } catch { onToast("Failed to confirm appointment", "error"); }
    finally { setActing(null); }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) { onToast("Please enter a cancellation reason", "error"); return; }
    if (acting) return;
    setActing("cancel");
    try {
      await appointmentService.cancelAppointment(apt.id, cancelReason.trim(), apt.doctorId, apt.date, apt.timeSlot);
      const updated = { ...apt, status: "cancelled" as AppointmentStatus };
      await emailService.sendCancellationEmail(updated, cancelReason.trim());
      onUpdated(apt.id, { status: "cancelled", cancelReason: cancelReason.trim(), cancelledAt: new Date() });
      onToast("❌ Appointment cancelled and time slot released", "info");
      setShowCancelInput(false);
    } catch { onToast("Failed to cancel appointment", "error"); }
    finally { setActing(null); }
  };

  const handleComplete = async () => {
    if (acting) return;
    setActing("complete");
    try {
      await appointmentService.completeAppointment(apt.id);
      onUpdated(apt.id, { status: "completed", completedAt: new Date() });
      onToast("✔ Appointment marked as completed", "success");
    } catch { onToast("Failed to mark as completed", "error"); }
    finally { setActing(null); }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Appointment Details</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Ref + Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Reference No.</p>
              <p className="font-mono font-bold text-sky-600 dark:text-sky-400 text-sm tracking-widest">{apt.referenceNumber}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[apt.status]}`}>{apt.status}</span>
          </div>

          {/* Doctor Info */}
          <Section title="Doctor Info">
            <Row label="Name" value={apt.doctorName} />
            <Row label="Specialization" value={apt.specialization} />
          </Section>

          {/* Schedule */}
          <Section title="Schedule">
            <Row label="Date" value={apt.date ? format(new Date(apt.date + "T00:00:00"), "MMMM d, yyyy") : "—"} />
            <Row label="Time" value={apt.timeSlot} />
          </Section>

          {/* Patient Info */}
          <Section title="Patient Info">
            <Row label="Name" value={apt.patientName} />
            <Row label="Contact" value={apt.contactNumber} />
            <Row label="Email" value={apt.email} />
            <Row label="Age" value={`${apt.patientAge} yrs`} />
            <Row label="Sex" value={apt.patientSex} />
            <Row label="First Visit" value={apt.isFirstVisit ? "Yes" : "No"} />
            <div className="col-span-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Reason for Visit</p>
              <p className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">{apt.reasonForVisit}</p>
            </div>
          </Section>

          {/* Timestamps */}
          <Section title="Timestamps">
            <Row label="Booked At" value={fmt(apt.createdAt instanceof Date ? apt.createdAt : (apt.createdAt as any)?.toDate?.())} />
            <Row label="Confirmed At" value={fmt(apt.confirmedAt instanceof Date ? apt.confirmedAt : (apt.confirmedAt as any)?.toDate?.())} />
            <Row label="Confirmed By" value={apt.confirmedBy || "—"} />
            {apt.cancelledAt && <Row label="Cancelled At" value={fmt(apt.cancelledAt instanceof Date ? apt.cancelledAt : (apt.cancelledAt as any)?.toDate?.())} />}
            {apt.cancelReason && <Row label="Cancel Reason" value={apt.cancelReason} />}
            {apt.completedAt && <Row label="Completed At" value={fmt(apt.completedAt instanceof Date ? apt.completedAt : (apt.completedAt as any)?.toDate?.())} />}
          </Section>

          {/* Admin Notes */}
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Admin Notes</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Add internal notes..."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <button
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="mt-2 px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {savingNotes ? "Saving…" : "Save Notes"}
            </button>
          </div>

          {/* Cancel Reason Input */}
          {showCancelInput && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">Reason for Cancellation *</p>
              <textarea
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                rows={2}
                placeholder="Enter reason..."
                className="w-full px-3 py-2 rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleCancel} disabled={acting === "cancel"} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors">
                  {acting === "cancel" ? "Cancelling…" : "Confirm Cancel"}
                </button>
                <button onClick={() => setShowCancelInput(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-lg transition-colors">
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          {!showCancelInput && (
            <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              {apt.status !== "confirmed" && apt.status !== "cancelled" && apt.status !== "completed" && (
                <button
                  onClick={handleConfirm}
                  disabled={!!acting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl disabled:opacity-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  {acting === "confirm" ? "Confirming…" : "Confirm"}
                </button>
              )}
              {apt.status !== "cancelled" && apt.status !== "completed" && (
                <button
                  onClick={() => setShowCancelInput(true)}
                  disabled={!!acting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl disabled:opacity-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  Cancel
                </button>
              )}
              {apt.status === "confirmed" && (
                <button
                  onClick={handleComplete}
                  disabled={!!acting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-800 text-white text-sm font-bold rounded-xl disabled:opacity-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {acting === "complete" ? "Completing…" : "Mark Completed"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">{title}</p>
    <div className="grid grid-cols-2 gap-x-6 gap-y-3">{children}</div>
  </div>
);

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</p>
    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{value || "—"}</p>
  </div>
);

export default AppointmentModal;
