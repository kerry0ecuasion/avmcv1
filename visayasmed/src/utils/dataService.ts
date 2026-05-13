import { db, storage } from "../firebase";
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, orderBy, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const FIRESTORE_TIMEOUT = 4000;

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number = FIRESTORE_TIMEOUT): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Firestore timeout")), timeoutMs))
  ]);
};

// HERO CAROUSEL
export const heroCarouselService = {
    async getImages() {
        try {
            const q = query(collection(db, "heroCarousel"), orderBy("order", "asc"));
            const snapshot = await withTimeout(getDocs(q));
            return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (error) {
            console.warn("Error getting hero carousel images:", error instanceof Error ? error.message : error);
            return [];
        }
    },
    async addImage(data: { caption?: string; order: number }, file: File) {
        try {
            const storageRef = ref(storage, `heroCarousel/${Date.now()}-${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            const docRef = await addDoc(collection(db, "heroCarousel"), {
                ...data,
                url,
                storagePath: `heroCarousel/${Date.now()}-${file.name}`,
                createdAt: new Date()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding hero carousel image:", error);
            throw error;
        }
    },
    async deleteImage(id: string, url?: string) {
        try {
            if (url) {
                try { await deleteObject(ref(storage, url)); } catch { /* ignore if already gone */ }
            }
            await deleteDoc(doc(db, "heroCarousel", id));
        } catch (error) {
            console.error("Error deleting hero carousel image:", error);
            throw error;
        }
    },
    async reorder(items: { id: string; order: number }[]) {
        try {
            await Promise.all(items.map(item =>
                updateDoc(doc(db, "heroCarousel", item.id), { order: item.order })
            ));
        } catch (error) {
            console.error("Error reordering hero carousel:", error);
            throw error;
        }
    }
};

// SLIDESHOWS
export const slideshowService = {
    async getSlideshows() {
        try {
            const q = query(collection(db, "slideshows"), orderBy("order", "asc"));
            const snapshot = await withTimeout(getDocs(q));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.warn("Error getting slideshows (using empty):", error instanceof Error ? error.message : error);
            return [];
        }
    },
    async addSlideshow(data: any, file?: File) {
        try {
            let imageUrl = data.image;
            if (file) {
                const storageRef = ref(storage, `slideshows/${Date.now()}-${file.name}`);
                await uploadBytes(storageRef, file);
                imageUrl = await getDownloadURL(storageRef);
            }
            const docRef = await addDoc(collection(db, "slideshows"), { ...data, image: imageUrl, createdAt: new Date() });
            return docRef.id;
        } catch (error) {
            console.error("Error adding slideshow:", error);
            throw error;
        }
    },
    async updateSlideshow(id: string, data: any, file?: File) {
        try {
            let imageUrl = data.image;
            if (file) {
                const storageRef = ref(storage, `slideshows/${Date.now()}-${file.name}`);
                await uploadBytes(storageRef, file);
                imageUrl = await getDownloadURL(storageRef);
            }
            await updateDoc(doc(db, "slideshows", id), { ...data, ...(file && { image: imageUrl }), updatedAt: new Date() });
        } catch (error) {
            console.error("Error updating slideshow:", error);
            throw error;
        }
    },
    async deleteSlideshow(id: string, imageUrl?: string) {
        try {
            if (imageUrl) {
                try { const storageRef = ref(storage, imageUrl); await deleteObject(storageRef); } catch (e) { console.warn("Could not delete image from storage"); }
            }
            await deleteDoc(doc(db, "slideshows", id));
        } catch (error) {
            console.error("Error deleting slideshow:", error);
            throw error;
        }
    }
};

// PAGE CONTENT
export const pageService = {
    async getPageContent(page: string) {
        try {
            const docRef = doc(db, "pages", page);
            const docSnap = await withTimeout(getDoc(docRef));
            return docSnap.exists() ? docSnap.data() : null;
        } catch (error) {
            console.warn("Error getting page content (using null):", error instanceof Error ? error.message : error);
            return null;
        }
    },
    async updatePageContent(page: string, content: any) {
        try {
            const docRef = doc(db, "pages", page);
            await setDoc(docRef, { ...content, updatedAt: new Date() }, { merge: true });
        } catch (error) {
            console.error("Error updating page content:", error);
            throw error;
        }
    }
};

// DOCTORS
export const doctorService = {
    async getDoctors() {
        try {
            const q = query(collection(db, "doctors"), orderBy("order", "asc"));
            const snapshot = await withTimeout(getDocs(q));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.warn("Error getting doctors (using empty):", error instanceof Error ? error.message : error);
            return [];
        }
    },
    async addDoctor(data: any, imageFile?: File) {
        try {
            let imageUrl = data.image;
            if (imageFile) {
                const storageRef = ref(storage, `doctors/${Date.now()}-${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }
            const docRef = await addDoc(collection(db, "doctors"), { ...data, image: imageUrl, createdAt: new Date() });
            return docRef.id;
        } catch (error) {
            console.error("Error adding doctor:", error);
            throw error;
        }
    },
    async updateDoctor(id: string, data: any, imageFile?: File) {
        try {
            let imageUrl = data.image;
            if (imageFile) {
                const storageRef = ref(storage, `doctors/${Date.now()}-${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }
            await updateDoc(doc(db, "doctors", id), { ...data, ...(imageFile && { image: imageUrl }), updatedAt: new Date() });
        } catch (error) {
            console.error("Error updating doctor:", error);
            throw error;
        }
    },
    async deleteDoctor(id: string, imageUrl?: string) {
        try {
            if (imageUrl) {
                try { const storageRef = ref(storage, imageUrl); await deleteObject(storageRef); } catch (e) { console.warn("Could not delete image from storage"); }
            }
            await deleteDoc(doc(db, "doctors", id));
        } catch (error) {
            console.error("Error deleting doctor:", error);
            throw error;
        }
    }
};

// SERVICES
export const serviceService = {
    async getServices() {
        try {
            const q = query(collection(db, "services"), orderBy("order", "asc"));
            const snapshot = await withTimeout(getDocs(q));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.warn("Error getting services (using empty):", error instanceof Error ? error.message : error);
            return [];
        }
    },
    async addService(data: any, iconFile?: File) {
        try {
            let iconUrl = data.icon;
            if (iconFile) {
                const storageRef = ref(storage, `services/${Date.now()}-${iconFile.name}`);
                await uploadBytes(storageRef, iconFile);
                iconUrl = await getDownloadURL(storageRef);
            }
            const docRef = await addDoc(collection(db, "services"), { ...data, icon: iconUrl, createdAt: new Date() });
            return docRef.id;
        } catch (error) {
            console.error("Error adding service:", error);
            throw error;
        }
    },
    async updateService(id: string, data: any, iconFile?: File) {
        try {
            let iconUrl = data.icon;
            if (iconFile) {
                const storageRef = ref(storage, `services/${Date.now()}-${iconFile.name}`);
                await uploadBytes(storageRef, iconFile);
                iconUrl = await getDownloadURL(storageRef);
            }
            await updateDoc(doc(db, "services", id), { ...data, ...(iconFile && { icon: iconUrl }), updatedAt: new Date() });
        } catch (error) {
            console.error("Error updating service:", error);
            throw error;
        }
    },
    async deleteService(id: string, iconUrl?: string) {
        try {
            if (iconUrl) {
                try { const storageRef = ref(storage, iconUrl); await deleteObject(storageRef); } catch (e) { console.warn("Could not delete icon from storage"); }
            }
            await deleteDoc(doc(db, "services", id));
        } catch (error) {
            console.error("Error deleting service:", error);
            throw error;
        }
    }
};

// NEWS AND EVENTS
export const newsService = {
    async getNews() {
        try {
            const q = query(collection(db, "newsAndEvents"), orderBy("createdAt", "desc"));
            const snapshot = await withTimeout(getDocs(q));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.warn("Error getting newsAndEvents:", error instanceof Error ? error.message : error);
            return [];
        }
    },
    async addNews(data: any, imageFile?: File) {
        try {
            let imageUrl = data.imageUrl || "";
            if (imageFile) {
                const storageRef = ref(storage, `newsAndEvents/${Date.now()}-${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }
            const docRef = await addDoc(collection(db, "newsAndEvents"), { 
                ...data, 
                imageUrl, 
                createdAt: new Date() 
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding newsAndEvents:", error);
            throw error;
        }
    },
    async updateNews(id: string, data: any, imageFile?: File) {
        try {
            let imageUrl = data.imageUrl;
            if (imageFile) {
                const storageRef = ref(storage, `newsAndEvents/${Date.now()}-${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }
            await updateDoc(doc(db, "newsAndEvents", id), { 
                ...data, 
                ...(imageFile && { imageUrl }), 
                updatedAt: new Date() 
            });
        } catch (error) {
            console.error("Error updating newsAndEvents:", error);
            throw error;
        }
    },
    async deleteNews(id: string) {
        try {
            await deleteDoc(doc(db, "newsAndEvents", id));
        } catch (error) {
            console.error("Error deleting newsAndEvents:", error);
            throw error;
        }
    }
};

// TESTIMONIALS
export const testimonialsService = {
    async getTestimonials() {
        try {
            const q = query(collection(db, "testimonials"), orderBy("order", "asc"));
            const snapshot = await withTimeout(getDocs(q));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.warn("Error getting testimonials (using empty):", error instanceof Error ? error.message : error);
            return [];
        }
    },
    async addTestimonial(data: any) {
        try {
            const docRef = await addDoc(collection(db, "testimonials"), { ...data, createdAt: new Date() });
            return docRef.id;
        } catch (error) {
            console.error("Error adding testimonial:", error);
            throw error;
        }
    },
    async updateTestimonial(id: string, data: any) {
        try {
            await updateDoc(doc(db, "testimonials", id), { ...data, updatedAt: new Date() });
        } catch (error) {
            console.error("Error updating testimonial:", error);
            throw error;
        }
    },
    async deleteTestimonial(id: string) {
        try {
            await deleteDoc(doc(db, "testimonials", id));
        } catch (error) {
            console.error("Error deleting testimonial:", error);
            throw error;
        }
    }
};

// STATS
export const statsService = {
    async getStats() {
        try {
            const q = query(collection(db, "stats"), orderBy("order", "asc"));
            const snapshot = await withTimeout(getDocs(q));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.warn("Error getting stats (using empty):", error instanceof Error ? error.message : error);
            return [];
        }
    },
    async addStat(data: any) {
        try {
            const docRef = await addDoc(collection(db, "stats"), { ...data, createdAt: new Date() });
            return docRef.id;
        } catch (error) {
            console.error("Error adding stat:", error);
            throw error;
        }
    },
    async updateStat(id: string, data: any) {
        try {
            await updateDoc(doc(db, "stats", id), { ...data, updatedAt: new Date() });
        } catch (error) {
            console.error("Error updating stat:", error);
            throw error;
        }
    },
    async deleteStat(id: string) {
        try {
            await deleteDoc(doc(db, "stats", id));
        } catch (error) {
            console.error("Error deleting stat:", error);
            throw error;
        }
    }
};

// FAQS
export const faqsService = {
    async getFaqs() {
        try {
            const q = query(collection(db, "faqs"), orderBy("order", "asc"));
            const snapshot = await withTimeout(getDocs(q));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.warn("Error getting faqs (using empty):", error instanceof Error ? error.message : error);
            return [];
        }
    },
    async addFaq(data: any) {
        try {
            const docRef = await addDoc(collection(db, "faqs"), { ...data, createdAt: new Date() });
            return docRef.id;
        } catch (error) {
            console.error("Error adding faq:", error);
            throw error;
        }
    },
    async updateFaq(id: string, data: any) {
        try {
            await updateDoc(doc(db, "faqs", id), { ...data, updatedAt: new Date() });
        } catch (error) {
            console.error("Error updating faq:", error);
            throw error;
        }
    },
    async deleteFaq(id: string) {
        try {
            await deleteDoc(doc(db, "faqs", id));
        } catch (error) {
            console.error("Error deleting faq:", error);
            throw error;
        }
    }
};

// INQUIRIES
export const inquiriesService = {
    async getInquiries() {
        try {
            const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
            const snapshot = await withTimeout(getDocs(q));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.warn("Error getting inquiries (using empty):", error instanceof Error ? error.message : error);
            return [];
        }
    },
    async addInquiry(data: any) {
        try {
            const docRef = await addDoc(collection(db, "inquiries"), { ...data, status: "unread", createdAt: new Date() });
            return docRef.id;
        } catch (error) {
            console.error("Error adding inquiry:", error);
            throw error;
        }
    },
    async updateInquiryStatus(id: string, status: string) {
        try {
            await updateDoc(doc(db, "inquiries", id), { status, updatedAt: new Date() });
        } catch (error) {
            console.error("Error updating inquiry status:", error);
            throw error;
        }
    },
    async deleteInquiry(id: string) {
        try {
            await deleteDoc(doc(db, "inquiries", id));
        } catch (error) {
            console.error("Error deleting inquiry:", error);
            throw error;
        }
    }
};
