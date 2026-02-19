import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Doctor {
    id: string;
    name: string;
    specialization: string;
    bio: string;
    education: string;
    experience: string;
    image: string;
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

const AdvancedContentEditor: React.FC<ContentEditorProps> = ({ page }) => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
    const [editingService, setEditingService] = useState<Service | null>(null);

    useEffect(() => {
        loadData();
    }, [page]);

    const loadData = async () => {
        try {
            setLoading(true);
            if (page === "doctors") {
                const q = query(collection(db, "doctors"), orderBy("order", "asc"));
                const snapshot = await getDocs(q);
                setDoctors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor)));
            } else if (page === "services") {
                const q = query(collection(db, "services"), orderBy("order", "asc"));
                const snapshot = await getDocs(q);
                setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    // DOCTOR OPERATIONS
    const saveDoctors = async (doctorData: Doctor, imageFile?: File) => {
        try {
            let imageUrl = doctorData.image;
            
            if (imageFile) {
                const storageRef = ref(storage, `doctors/${Date.now()}-${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }

            if (editingDoctor) {
                await updateDoc(doc(db, "doctors", editingDoctor.id), {
                    ...doctorData,
                    image: imageUrl,
                    updatedAt: new Date()
                });
            } else {
                await addDoc(collection(db, "doctors"), {
                    ...doctorData,
                    image: imageUrl,
                    order: doctors.length + 1,
                    createdAt: new Date()
                });
            }

            await loadData();
            setEditingDoctor(null);
            alert("Doctor saved successfully!");
        } catch (error) {
            console.error("Error saving doctor:", error);
            alert("Error saving doctor");
        }
    };

    const deleteDoctor = async (id: string) => {
        if (!confirm("Are you sure you want to delete this doctor?")) return;
        try {
            await deleteDoc(doc(db, "doctors", id));
            await loadData();
            alert("Doctor deleted successfully!");
        } catch (error) {
            console.error("Error deleting doctor:", error);
            alert("Error deleting doctor");
        }
    };

    // SERVICE OPERATIONS
    const saveService = async (serviceData: Service, iconFile?: File) => {
        try {
            let iconUrl = serviceData.icon;
            
            if (iconFile) {
                const storageRef = ref(storage, `services/${Date.now()}-${iconFile.name}`);
                await uploadBytes(storageRef, iconFile);
                iconUrl = await getDownloadURL(storageRef);
            }

            if (editingService) {
                await updateDoc(doc(db, "services", editingService.id), {
                    ...serviceData,
                    icon: iconUrl,
                    updatedAt: new Date()
                });
            } else {
                await addDoc(collection(db, "services"), {
                    ...serviceData,
                    icon: iconUrl,
                    order: services.length + 1,
                    createdAt: new Date()
                });
            }

            await loadData();
            setEditingService(null);
            alert("Service saved successfully!");
        } catch (error) {
            console.error("Error saving service:", error);
            alert("Error saving service");
        }
    };

    const deleteService = async (id: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        try {
            await deleteDoc(doc(db, "services", id));
            await loadData();
            alert("Service deleted successfully!");
        } catch (error) {
            console.error("Error deleting service:", error);
            alert("Error deleting service");
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (page === "doctors") {
        return <DoctorManager doctors={doctors} onSave={saveDoctors} onDelete={deleteDoctor} onEditingChange={setEditingDoctor} editingDoctor={editingDoctor} />;
    }

    if (page === "services") {
        return <ServiceManager services={services} onSave={saveService} onDelete={deleteService} onEditingChange={setEditingService} editingService={editingService} />;
    }

    return <div>Select a page to edit</div>;
};

interface DoctorManagerProps {
    doctors: Doctor[];
    onSave: (doctor: Doctor, imageFile?: File) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onEditingChange: (doctor: Doctor | null) => void;
    editingDoctor: Doctor | null;
}

const DoctorManager: React.FC<DoctorManagerProps> = ({ doctors, onSave, onDelete, onEditingChange }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<Doctor>({
        id: "",
        name: "",
        specialization: "",
        bio: "",
        education: "",
        experience: "",
        image: "",
        order: 0
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");

    const handleAddClick = () => {
        onEditingChange(null);
        setFormData({ id: "", name: "", specialization: "", bio: "", education: "", experience: "", image: "", order: 0 });
        setImageFile(null);
        setImagePreview("");
        setShowModal(true);
    };

    const handleEditClick = (doctor: Doctor) => {
        onEditingChange(doctor);
        setFormData(doctor);
        setImagePreview(doctor.image);
        setImageFile(null);
        setShowModal(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.specialization) {
            alert("Please fill in required fields");
            return;
        }
        await onSave(formData, imageFile || undefined);
        setShowModal(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Doctors</h2>
                <button
                    onClick={handleAddClick}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                    + Add Doctor
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                    <div key={doctor.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg">
                        <img src={doctor.image} alt={doctor.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{doctor.name}</h3>
                            <p className="text-sky-600 dark:text-sky-400 font-semibold">{doctor.specialization}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{doctor.education}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditClick(doctor)}
                                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(doctor.id)}
                                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <DoctorModal
                    doctor={formData}
                    imagePreview={imagePreview}
                    onImageChange={handleImageChange}
                    onFormChange={setFormData}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

interface ServiceManagerProps {
    services: Service[];
    onSave: (service: Service, iconFile?: File) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onEditingChange: (service: Service | null) => void;
    editingService: Service | null;
}

const ServiceManager: React.FC<ServiceManagerProps> = ({ services, onSave, onDelete, onEditingChange }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<Service>({
        id: "",
        name: "",
        description: "",
        icon: "",
        price: "",
        duration: "",
        order: 0
    });
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState("");

    const handleAddClick = () => {
        onEditingChange(null);
        setFormData({ id: "", name: "", description: "", icon: "", price: "", duration: "", order: 0 });
        setIconFile(null);
        setIconPreview("");
        setShowModal(true);
    };

    const handleEditClick = (service: Service) => {
        onEditingChange(service);
        setFormData(service);
        setIconPreview(service.icon);
        setIconFile(null);
        setShowModal(true);
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIconFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setIconPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.description) {
            alert("Please fill in required fields");
            return;
        }
        await onSave(formData, iconFile || undefined);
        setShowModal(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Services</h2>
                <button
                    onClick={handleAddClick}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                    + Add Service
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div key={service.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg p-6">
                        {service.icon && <img src={service.icon} alt={service.name} className="w-16 h-16 mb-4" />}
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{service.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{service.description}</p>
                        {service.price && <p className="text-sky-600 dark:text-sky-400 font-semibold mb-2">Price: {service.price}</p>}
                        {service.duration && <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Duration: {service.duration}</p>}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEditClick(service)}
                                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(service.id)}
                                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <ServiceModal
                    service={formData}
                    iconPreview={iconPreview}
                    onIconChange={handleIconChange}
                    onFormChange={setFormData}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

interface DoctorModalProps {
    doctor: Doctor;
    imagePreview: string;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFormChange: (doctor: Doctor) => void;
    onSave: () => Promise<void>;
    onClose: () => void;
}

const DoctorModal: React.FC<DoctorModalProps> = ({ doctor, imagePreview, onImageChange, onFormChange, onSave, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-8 max-h-96 overflow-y-auto">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    {doctor.id ? "Edit Doctor" : "Add Doctor"}
                </h3>

                <div className="space-y-4">
                    {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />}
                    
                    <input
                        type="file"
                        onChange={onImageChange}
                        accept="image/*"
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />

                    <input
                        type="text"
                        placeholder="Doctor Name"
                        value={doctor.name}
                        onChange={(e) => onFormChange({ ...doctor, name: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />

                    <input
                        type="text"
                        placeholder="Specialization"
                        value={doctor.specialization}
                        onChange={(e) => onFormChange({ ...doctor, specialization: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />

                    <textarea
                        placeholder="Bio"
                        value={doctor.bio}
                        onChange={(e) => onFormChange({ ...doctor, bio: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows={3}
                    />

                    <input
                        type="text"
                        placeholder="Education"
                        value={doctor.education}
                        onChange={(e) => onFormChange({ ...doctor, education: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />

                    <input
                        type="text"
                        placeholder="Experience (e.g., 10 years)"
                        value={doctor.experience}
                        onChange={(e) => onFormChange({ ...doctor, experience: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={onSave}
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            Save
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ServiceModalProps {
    service: Service;
    iconPreview: string;
    onIconChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFormChange: (service: Service) => void;
    onSave: () => Promise<void>;
    onClose: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, iconPreview, onIconChange, onFormChange, onSave, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-8 max-h-96 overflow-y-auto">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    {service.id ? "Edit Service" : "Add Service"}
                </h3>

                <div className="space-y-4">
                    {iconPreview && <img src={iconPreview} alt="Preview" className="w-20 h-20 rounded-lg" />}
                    
                    <input
                        type="file"
                        onChange={onIconChange}
                        accept="image/*"
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />

                    <input
                        type="text"
                        placeholder="Service Name"
                        value={service.name}
                        onChange={(e) => onFormChange({ ...service, name: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />

                    <textarea
                        placeholder="Description"
                        value={service.description}
                        onChange={(e) => onFormChange({ ...service, description: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows={3}
                    />

                    <input
                        type="text"
                        placeholder="Price (optional)"
                        value={service.price || ""}
                        onChange={(e) => onFormChange({ ...service, price: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />

                    <input
                        type="text"
                        placeholder="Duration (optional)"
                        value={service.duration || ""}
                        onChange={(e) => onFormChange({ ...service, duration: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={onSave}
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            Save
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedContentEditor;
