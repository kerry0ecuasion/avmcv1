import { db, storage } from "../firebase";
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, orderBy, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// SLIDESHOWS
export const slideshowService = {
    async getSlideshows() {
        try {
            const q = query(collection(db, "slideshows"), orderBy("order", "asc"));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error getting slideshows:", error);
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

            const docRef = await addDoc(collection(db, "slideshows"), {
                ...data,
                image: imageUrl,
                createdAt: new Date()
            });

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

            await updateDoc(doc(db, "slideshows", id), {
                ...data,
                ...(file && { image: imageUrl }),
                updatedAt: new Date()
            });
        } catch (error) {
            console.error("Error updating slideshow:", error);
            throw error;
        }
    },

    async deleteSlideshow(id: string, imageUrl?: string) {
        try {
            if (imageUrl) {
                try {
                    const storageRef = ref(storage, imageUrl);
                    await deleteObject(storageRef);
                } catch (e) {
                    console.warn("Could not delete image from storage");
                }
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
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
        } catch (error) {
            console.error("Error getting page content:", error);
            return null;
        }
    },

    async updatePageContent(page: string, content: any) {
        try {
            const docRef = doc(db, "pages", page);
            await setDoc(docRef, {
                ...content,
                updatedAt: new Date()
            }, { merge: true });
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
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error getting doctors:", error);
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

            const docRef = await addDoc(collection(db, "doctors"), {
                ...data,
                image: imageUrl,
                createdAt: new Date()
            });

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

            await updateDoc(doc(db, "doctors", id), {
                ...data,
                ...(imageFile && { image: imageUrl }),
                updatedAt: new Date()
            });
        } catch (error) {
            console.error("Error updating doctor:", error);
            throw error;
        }
    },

    async deleteDoctor(id: string, imageUrl?: string) {
        try {
            if (imageUrl) {
                try {
                    const storageRef = ref(storage, imageUrl);
                    await deleteObject(storageRef);
                } catch (e) {
                    console.warn("Could not delete image from storage");
                }
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
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error getting services:", error);
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

            const docRef = await addDoc(collection(db, "services"), {
                ...data,
                icon: iconUrl,
                createdAt: new Date()
            });

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

            await updateDoc(doc(db, "services", id), {
                ...data,
                ...(iconFile && { icon: iconUrl }),
                updatedAt: new Date()
            });
        } catch (error) {
            console.error("Error updating service:", error);
            throw error;
        }
    },

    async deleteService(id: string, iconUrl?: string) {
        try {
            if (iconUrl) {
                try {
                    const storageRef = ref(storage, iconUrl);
                    await deleteObject(storageRef);
                } catch (e) {
                    console.warn("Could not delete icon from storage");
                }
            }

            await deleteDoc(doc(db, "services", id));
        } catch (error) {
            console.error("Error deleting service:", error);
            throw error;
        }
    }
};
