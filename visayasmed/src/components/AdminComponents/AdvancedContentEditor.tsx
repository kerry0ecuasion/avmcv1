import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { db, storage } from "../../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Doctor {
    id: string;
    name: string;
    specialty: string;
    qualification: string;
    experience: string;
    languages: string;
    availability: string;
    icon: string;
    achievements: string;
    patientsServed: string;
    rating: number;
    specialExpertise: string;
    image?: string;
    order: number;
}

interface Service {
    id: string;
    name: string;
    description: string;
    icon: string;
    price?: string;
    duration?: string;
    order: number;
}

interface ContentEditorProps {
    page: string;
}

const emptyDoctor: Doctor = {
    id: "",
    name: "",
    specialty: "",
    qualification: "",
    experience: "",
    languages: "",
    availability: "",
    icon: "👨‍⚕️",
    achievements: "",
    patientsServed: "",
    rating: 5,
    specialExpertise: "",
    image: "",
    order: 0,
};

const inputClass = "w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-sky-500";
const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";

const AdvancedContentEditor: React.FC<ContentEditorProps> = ({ page }) => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
    const [editingService, setEditingService] = useState<Service | null>(null);

    useEffect(() => { loadData(); }, [page]);

    const loadData = async () => {
        try {
            setLoading(true);
            if (page === "doctors") {
                const q = query(collection(db, "doctors"), orderBy("order", "asc"));
                const snapshot = await getDocs(q);
                setDoctors(snapshot.docs.map(d => ({ ...emptyDoctor, id: d.id, ...d.data() } as Doctor)));
            } else if (page === "services") {
                const q = query(collection(db, "services"), orderBy("order", "asc"));
                const snapshot = await getDocs(q);
                setServices(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Service)));
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveDoctors = async (doctorData: Doctor, imageFile?: File) => {
        const maxRetries = 2;
        let attempt = 0;
        while (attempt <= maxRetries) {
            try {
                let imageUrl = doctorData.image || "";
                if (imageFile) {
                    const storageRef = ref(storage, `doctors/${Date.now()}-${imageFile.name}`);
                    await uploadBytes(storageRef, imageFile);
                    imageUrl = await getDownloadURL(storageRef);
                }

                const langArray = doctorData.languages
                    .split(",").map(s => s.trim()).filter(Boolean);
                const payload = {
                    name: doctorData.name,
                    specialty: doctorData.specialty,
                    qualification: doctorData.qualification,
                    experience: doctorData.experience,
                    languages: langArray,
                    availability: doctorData.availability,
                    icon: doctorData.icon,
                    achievements: doctorData.achievements,
                    patientsServed: doctorData.patientsServed,
                    rating: Number(doctorData.rating) || 5,
                    specialExpertise: doctorData.specialExpertise,
                    image: imageUrl,
                };
                if (editingDoctor) {
                    await updateDoc(doc(db, "doctors", editingDoctor.id), { ...payload, updatedAt: new Date() });
                } else {
                    await addDoc(collection(db, "doctors"), { ...payload, order: doctors.length + 1, createdAt: new Date() });
                }
                await loadData();
                setEditingDoctor(null);
                alert("Doctor saved successfully!");
                return;
            } catch (error) {
                console.error(`Error saving doctor (attempt ${attempt + 1}):`, error);
                if (attempt === maxRetries) { alert("Error saving doctor. Please try again later."); return; }
                await new Promise(res => setTimeout(res, 500 * (attempt + 1)));
                attempt++;
            }
        }
    };

    const deleteDoctor = async (id: string) => {
        if (!confirm("Are you sure you want to delete this doctor?")) return;
        try {
            await deleteDoc(doc(db, "doctors", id));
            await loadData();
            alert("Doctor deleted!");
        } catch (error) {
            console.error("Error deleting doctor:", error);
            alert("Error deleting doctor");
        }
    };

    const saveService = async (serviceData: Service, iconFile?: File) => {
        const maxRetries = 2;
        let attempt = 0;
        while (attempt <= maxRetries) {
            try {
                let iconUrl = serviceData.icon;
                if (iconFile) {
                    const storageRef = ref(storage, `services/${Date.now()}-${iconFile.name}`);
                    await uploadBytes(storageRef, iconFile);
                    iconUrl = await getDownloadURL(storageRef);
                }
                if (editingService) {
                    await updateDoc(doc(db, "services", editingService.id), { ...serviceData, icon: iconUrl, updatedAt: new Date() });
                } else {
                    await addDoc(collection(db, "services"), { ...serviceData, icon: iconUrl, order: services.length + 1, createdAt: new Date() });
                }
                await loadData();
                setEditingService(null);
                alert("Service saved successfully!");
                return;
            } catch (error) {
                console.error(`Error saving service (attempt ${attempt + 1}):`, error);
                if (attempt === maxRetries) { alert("Error saving service. Please try again later."); return; }
                await new Promise(res => setTimeout(res, 500 * (attempt + 1)));
                attempt++;
            }
        }
    };

    const deleteService = async (id: string) => {
        if (!confirm("Delete this service?")) return;
        try {
            await deleteDoc(doc(db, "services", id));
            await loadData();
            alert("Service deleted!");
        } catch (error) { console.error("Error:", error); alert("Error deleting service"); }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (page === "doctors") return <DoctorManager doctors={doctors} onSave={saveDoctors} onDelete={deleteDoctor} onEditingChange={setEditingDoctor} editingDoctor={editingDoctor} />;
    if (page === "services") return <ServiceManager services={services} onSave={saveService} onDelete={deleteService} onEditingChange={setEditingService} editingService={editingService} />;
    return <div>Select a page to edit</div>;
};

// ─── DOCTOR MANAGER ──────────────────────────────────────────
interface DoctorManagerProps {
    doctors: Doctor[];
    onSave: (doctor: Doctor, imageFile?: File) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onEditingChange: (doctor: Doctor | null) => void;
    editingDoctor: Doctor | null;
}

const DoctorManager: React.FC<DoctorManagerProps> = ({ doctors, onSave, onDelete, onEditingChange }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<Doctor>({ ...emptyDoctor });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");

    const handleAdd = () => {
        onEditingChange(null);
        setFormData({ ...emptyDoctor });
        setImageFile(null);
        setImagePreview("");
        setShowModal(true);
    };

    const handleEdit = (doctor: Doctor) => {
        onEditingChange(doctor);
        const langs = Array.isArray(doctor.languages) ? (doctor.languages as unknown as string[]).join(", ") : doctor.languages;
        setFormData({ ...doctor, languages: langs, image: doctor.image || "" });
        setImagePreview(doctor.image || "");
        setImageFile(null);
        setShowModal(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const r = new FileReader();
            r.onloadend = () => setImagePreview(r.result as string);
            r.readAsDataURL(file);
        }
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!formData.name || !formData.specialty) {
            alert("Name and Specialty are required");
            return;
        }
        await onSave(formData, imageFile || undefined);
        setShowModal(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Doctors</h2>
                <button onClick={handleAdd} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">+ Add Doctor</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((d) => (
                    <div key={d.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg">
                        {d.image && <img src={d.image} alt={d.name} className="w-full h-40 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl">{d.icon}</span>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{d.name}</h3>
                            </div>
                            <p className="text-sky-600 dark:text-sky-400 font-semibold text-sm">{d.specialty}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{d.qualification}</p>
                            <div className="flex gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                <span>{d.experience}</span>
                                <span>Rating: {d.rating}</span>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button onClick={() => handleEdit(d)} className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded">Edit</button>
                                <button onClick={() => onDelete(d.id)} className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && ReactDOM.createPortal(
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{formData.id ? "Edit Doctor" : "Add Doctor"}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-40 object-cover rounded-lg"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            )}
                            <div>
                                <label className={labelClass}>Photo (file upload)</label>
                                <input type="file" onChange={handleImageChange} accept="image/*" className={inputClass} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Name *</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="Dr. Maria Santos" />
                                </div>
                                <div>
                                    <label className={labelClass}>Specialty *</label>
                                    <input type="text" value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} className={inputClass} placeholder="Cardiology" />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Qualification</label>
                                <input type="text" value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} className={inputClass} placeholder="MD, Board Certified Cardiologist" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Experience</label>
                                    <input type="text" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className={inputClass} placeholder="15+ years" />
                                </div>
                                <div>
                                    <label className={labelClass}>Icon (emoji)</label>
                                    <input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className={inputClass} placeholder="👨‍⚕️" />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Languages (comma-separated)</label>
                                <input type="text" value={formData.languages} onChange={(e) => setFormData({ ...formData, languages: e.target.value })} className={inputClass} placeholder="English, Tagalog, Cebuano" />
                            </div>
                            <div>
                                <label className={labelClass}>Availability</label>
                                <input type="text" value={formData.availability} onChange={(e) => setFormData({ ...formData, availability: e.target.value })} className={inputClass} placeholder="Mon-Fri, 9 AM - 5 PM" />
                            </div>
                            <div>
                                <label className={labelClass}>Special Expertise</label>
                                <input type="text" value={formData.specialExpertise} onChange={(e) => setFormData({ ...formData, specialExpertise: e.target.value })} className={inputClass} placeholder="Tropical cardiovascular diseases" />
                            </div>
                            <div>
                                <label className={labelClass}>Achievements</label>
                                <textarea value={formData.achievements} onChange={(e) => setFormData({ ...formData, achievements: e.target.value })} className={inputClass} rows={2} placeholder="Published 12 research papers..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Patients Served</label>
                                    <input type="text" value={formData.patientsServed} onChange={(e) => setFormData({ ...formData, patientsServed: e.target.value })} className={inputClass} placeholder="5000+" />
                                </div>
                                <div>
                                    <label className={labelClass}>Rating (1-5)</label>
                                    <input type="number" min={1} max={5} step={0.1} value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 5 })} className={inputClass} />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">Save</button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

// ─── SERVICE MANAGER ─────────────────────────────────────────
interface ServiceManagerProps {
    services: Service[];
    onSave: (service: Service, iconFile?: File) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onEditingChange: (service: Service | null) => void;
    editingService: Service | null;
}

const ServiceManager: React.FC<ServiceManagerProps> = ({ services, onSave, onDelete, onEditingChange }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<Service>({ id: "", name: "", description: "", icon: "", price: "", duration: "", order: 0 });
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState("");

    const handleAdd = () => { onEditingChange(null); setFormData({ id: "", name: "", description: "", icon: "", price: "", duration: "", order: 0 }); setIconFile(null); setIconPreview(""); setShowModal(true); };
    const handleEdit = (s: Service) => { onEditingChange(s); setFormData(s); setIconPreview(s.icon); setIconFile(null); setShowModal(true); };
    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) { setIconFile(f); const r = new FileReader(); r.onloadend = () => setIconPreview(r.result as string); r.readAsDataURL(f); } };
    const handleSave = async (e?: React.FormEvent) => { if (e) e.preventDefault(); if (!formData.name || !formData.description) { alert("Name and description required"); return; } await onSave(formData, iconFile || undefined); setShowModal(false); };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Services</h2>
                <button onClick={handleAdd} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">+ Add Service</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((s) => (
                    <div key={s.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg p-6">
                        {s.icon && <img src={s.icon} alt={s.name} className="w-16 h-16 mb-4" />}
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{s.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{s.description}</p>
                        {s.price && <p className="text-sky-600 dark:text-sky-400 font-semibold mb-2">Price: {s.price}</p>}
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(s)} className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded">Edit</button>
                            <button onClick={() => onDelete(s.id)} className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            {showModal && ReactDOM.createPortal(
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{formData.id ? "Edit Service" : "Add Service"}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            {iconPreview && <img src={iconPreview} alt="Preview" className="w-20 h-20 rounded-lg" />}
                            <div><label className={labelClass}>Icon (file)</label><input type="file" onChange={handleIconChange} accept="image/*" className={inputClass} /></div>
                            <div><label className={labelClass}>Or Icon URL</label><input type="url" value={formData.icon} onChange={(e) => { setFormData({ ...formData, icon: e.target.value }); setIconFile(null); setIconPreview(e.target.value); }} className={inputClass} placeholder="https://..." /></div>
                            <div><label className={labelClass}>Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="Service Name" /></div>
                            <div><label className={labelClass}>Description *</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputClass} rows={3} /></div>
                            <div><label className={labelClass}>Price (optional)</label><input type="text" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className={inputClass} /></div>
                            <div><label className={labelClass}>Duration (optional)</label><input type="text" value={formData.duration || ""} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className={inputClass} /></div>
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">Save</button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AdvancedContentEditor;
