import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  setDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";

export type AppointmentStatus = "draft" | "pending" | "confirmed" | "cancelled" | "completed";

export interface AppointmentData {
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;         // "yyyy-MM-dd"
  timeSlot: string;     // e.g. "9:00 AM"
  patientName: string;
  patientAge: number;
  patientSex: string;
  contactNumber: string;
  email: string;
  reasonForVisit: string;
  isFirstVisit: boolean;
  status: AppointmentStatus;
  referenceNumber: string;
  createdAt: Date | Timestamp;
  updatedAt?: Date | Timestamp;
  confirmedBy?: string;
  confirmedAt?: Date | Timestamp;
  cancelledAt?: Date | Timestamp;
  cancelReason?: string;
  completedAt?: Date | Timestamp;
  adminNotes?: string;
  // legacy field alias (kept for backwards compat)
  notes?: string;
}

export interface DoctorData {
  id?: string;
  name: string;
  specialization: string;
  photo?: string;
  image?: string;
  availableDays?: string[];
  availableTimeSlots?: string[];
  isActive?: boolean;
  experience?: string;
  availability?: string;
  rating?: number;
  specialty?: string;
}

// ─── Reference Number Generator ─────────────────────────────────────────────
export const generateReferenceNumber = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, "0");
  return `VM-${year}-${random}`;
};

// ─── Helper: convert Firestore doc to typed object ───────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDoc = (d: any): AppointmentData & { id: string } => ({
  id: d.id,
  ...d.data(),
  createdAt:   d.data().createdAt?.toDate?.()   ?? new Date(),
  updatedAt:   d.data().updatedAt?.toDate?.()   ?? null,
  confirmedAt: d.data().confirmedAt?.toDate?.() ?? null,
  cancelledAt: d.data().cancelledAt?.toDate?.() ?? null,
  completedAt: d.data().completedAt?.toDate?.() ?? null,
});

// ─── Appointment Service ─────────────────────────────────────────────────────
export const appointmentService = {
  // ── Create ─────────────────────────────────────────────────────────────────
  async createAppointment(
    data: Omit<AppointmentData, "referenceNumber" | "createdAt" | "status">,
    preGeneratedRef?: string
  ): Promise<{ id: string; referenceNumber: string }> {
    const referenceNumber = preGeneratedRef || generateReferenceNumber();
    const now = Timestamp.now();
    const appointmentData = {
      ...data,
      referenceNumber,
      status: "pending" as AppointmentStatus,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await addDoc(collection(db, "appointments"), appointmentData);

    // Block the time slot immediately to prevent double booking
    await blockedSlotsService.blockSlot(data.doctorId, data.date, data.timeSlot);

    return { id: docRef.id, referenceNumber };
  },

  // ── Read (one-time) ────────────────────────────────────────────────────────
  async getAppointments(): Promise<(AppointmentData & { id: string })[]> {
    try {
      const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(mapDoc);
    } catch (error) {
      console.warn("Error getting appointments:", error);
      return [];
    }
  },

  // ── Read (real-time) ───────────────────────────────────────────────────────
  subscribeToAppointments(
    callback: (appointments: (AppointmentData & { id: string })[]) => void
  ): Unsubscribe {
    const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const appointments = snapshot.docs.map(mapDoc);
      callback(appointments);
    });
  },

  // ── Confirm ────────────────────────────────────────────────────────────────
  async confirmAppointment(
    id: string,
    confirmedBy: string,
    notes?: string
  ): Promise<void> {
    const now = Timestamp.now();
    const update: Record<string, unknown> = {
      status: "confirmed",
      confirmedBy,
      confirmedAt: now,
      updatedAt: now,
    };
    if (notes !== undefined) update.adminNotes = notes;
    await updateDoc(doc(db, "appointments", id), update);
  },

  // ── Cancel ─────────────────────────────────────────────────────────────────
  async cancelAppointment(
    id: string,
    cancelReason: string,
    doctorId?: string,
    date?: string,
    timeSlot?: string
  ): Promise<void> {
    const now = Timestamp.now();
    await updateDoc(doc(db, "appointments", id), {
      status: "cancelled",
      cancelReason,
      cancelledAt: now,
      updatedAt: now,
    });
    // Release the blocked slot
    if (doctorId && date && timeSlot) {
      await blockedSlotsService.unblockSlot(doctorId, date, timeSlot);
    }
  },

  // ── Complete ───────────────────────────────────────────────────────────────
  async completeAppointment(id: string): Promise<void> {
    const now = Timestamp.now();
    await updateDoc(doc(db, "appointments", id), {
      status: "completed",
      completedAt: now,
      updatedAt: now,
    });
  },

  // ── Update status (generic — kept for compatibility) ───────────────────────
  async updateAppointmentStatus(
    id: string,
    status: AppointmentStatus,
    extra?: {
      confirmedBy?: string;
      notes?: string;
      doctorId?: string;
      date?: string;
      timeSlot?: string;
      cancelReason?: string;
    }
  ): Promise<void> {
    const now = Timestamp.now();
    const update: Record<string, unknown> = { status, updatedAt: now };
    if (status === "confirmed" && extra?.confirmedBy) {
      update.confirmedBy = extra.confirmedBy;
      update.confirmedAt = now;
    }
    if (status === "cancelled") {
      update.cancelledAt = now;
      if (extra?.cancelReason) update.cancelReason = extra.cancelReason;
    }
    if (status === "completed") {
      update.completedAt = now;
    }
    if (extra?.notes !== undefined) update.adminNotes = extra.notes;
    await updateDoc(doc(db, "appointments", id), update);

    if (status === "cancelled" && extra?.doctorId && extra?.date && extra?.timeSlot) {
      await blockedSlotsService.unblockSlot(extra.doctorId, extra.date, extra.timeSlot);
    }
    if (status === "completed" && extra?.doctorId && extra?.date && extra?.timeSlot) {
      await blockedSlotsService.unblockSlot(extra.doctorId, extra.date, extra.timeSlot);
    }
  },

  // ── Save admin notes ───────────────────────────────────────────────────────
  async saveAdminNotes(id: string, notes: string): Promise<void> {
    await updateDoc(doc(db, "appointments", id), {
      adminNotes: notes,
      notes,        // legacy alias
      updatedAt: Timestamp.now(),
    });
  },

  // ── Delete ─────────────────────────────────────────────────────────────────
  async deleteAppointment(id: string): Promise<void> {
    await deleteDoc(doc(db, "appointments", id));
  },
};

// ─── Blocked Slots Service ────────────────────────────────────────────────────
export const blockedSlotsService = {
  async blockSlot(doctorId: string, date: string, timeSlot: string): Promise<void> {
    try {
      const docRef = doc(db, "blockedSlots", doctorId, "dates", date);
      await setDoc(docRef, { blockedTimes: arrayUnion(timeSlot) }, { merge: true });
    } catch (error) {
      console.warn("Could not block slot:", error);
    }
  },

  async unblockSlot(doctorId: string, date: string, timeSlot: string): Promise<void> {
    try {
      const docRef = doc(db, "blockedSlots", doctorId, "dates", date);
      await updateDoc(docRef, { blockedTimes: arrayRemove(timeSlot) });
    } catch (error) {
      console.warn("Could not unblock slot:", error);
    }
  },

  async getBlockedSlots(doctorId: string, date: string): Promise<string[]> {
    try {
      const docRef = doc(db, "blockedSlots", doctorId, "dates", date);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return (snap.data().blockedTimes as string[]) || [];
      }
      return [];
    } catch (error) {
      console.warn("Could not get blocked slots:", error);
      return [];
    }
  },

  subscribeToBlockedSlots(
    doctorId: string,
    date: string,
    callback: (blockedTimes: string[]) => void
  ): Unsubscribe {
    const docRef = doc(db, "blockedSlots", doctorId, "dates", date);
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        callback((snap.data().blockedTimes as string[]) || []);
      } else {
        callback([]);
      }
    });
  },

  async adminBlockSlot(doctorId: string, date: string, timeSlot: string): Promise<void> {
    await blockedSlotsService.blockSlot(doctorId, date, timeSlot);
  },

  async adminUnblockSlot(doctorId: string, date: string, timeSlot: string): Promise<void> {
    await blockedSlotsService.unblockSlot(doctorId, date, timeSlot);
  },
};

// ─── Email Service (EmailJS) ──────────────────────────────────────────────────
export const emailService = {
  async sendConfirmationEmail(appointment: AppointmentData & { id: string }): Promise<void> {
    try {
      const emailjs = await import("@emailjs/browser");
      const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || "";
      const templateId = import.meta.env.VITE_EMAILJS_CONFIRMED_TEMPLATE_ID || "";
      const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || "";
      if (!serviceId || !templateId || !publicKey) return;
      await emailjs.send(serviceId, templateId, {
        to_email:         appointment.email,
        to_name:          appointment.patientName,
        reference_number: appointment.referenceNumber,
        doctor_name:      appointment.doctorName,
        specialization:   appointment.specialization,
        date:             appointment.date,
        time:             appointment.timeSlot,
        reason:           appointment.reasonForVisit,
      }, publicKey);
    } catch (err) {
      console.warn("EmailJS confirmation email failed:", err);
    }
  },

  async sendCancellationEmail(
    appointment: AppointmentData & { id: string },
    cancelReason: string
  ): Promise<void> {
    try {
      const emailjs = await import("@emailjs/browser");
      const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || "";
      const templateId = import.meta.env.VITE_EMAILJS_CANCELLED_TEMPLATE_ID || "";
      const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || "";
      if (!serviceId || !templateId || !publicKey) return;
      await emailjs.send(serviceId, templateId, {
        to_email:         appointment.email,
        to_name:          appointment.patientName,
        reference_number: appointment.referenceNumber,
        doctor_name:      appointment.doctorName,
        date:             appointment.date,
        time:             appointment.timeSlot,
        cancel_reason:    cancelReason,
      }, publicKey);
    } catch (err) {
      console.warn("EmailJS cancellation email failed:", err);
    }
  },

  async sendDraftConfirmation(appointment: AppointmentData & { id: string }): Promise<void> {
    try {
      const emailjs = await import("@emailjs/browser");
      const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || "";
      const templateId = import.meta.env.VITE_EMAILJS_DRAFT_TEMPLATE_ID || "";
      const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || "";
      if (!serviceId || !templateId || !publicKey) return;
      await emailjs.send(serviceId, templateId, {
        to_email:         appointment.email,
        to_name:          appointment.patientName,
        reference_number: appointment.referenceNumber,
        doctor_name:      appointment.doctorName,
        specialization:   appointment.specialization,
        date:             appointment.date,
        time:             appointment.timeSlot,
        reason:           appointment.reasonForVisit,
      }, publicKey);
    } catch (err) {
      console.warn("EmailJS draft notification failed:", err);
    }
  },

  async sendStatusUpdate(
    appointment: AppointmentData & { id: string },
    status: "confirmed" | "cancelled",
    adminNotes?: string
  ): Promise<void> {
    if (status === "confirmed") {
      await emailService.sendConfirmationEmail(appointment);
    } else {
      await emailService.sendCancellationEmail(appointment, adminNotes || "");
    }
  },
};
