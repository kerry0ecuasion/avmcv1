import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { db, storage } from "../../firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Slide {
    id: string;
    title: string;
    description: string;
    image: string;
    order: number;
}

const SlideshowManager: React.FC = () => {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: "", description: "", image: "", file: null as File | null });
    const [preview, setPreview] = useState("");
    const [publishing, setPublishing] = useState(false);

    useEffect(() => {
        loadSlideshows();
    }, []);

    const loadSlideshows = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, "slideshows"), orderBy("order", "asc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Slide[];
            setSlides(data);
        } catch (error) {
            console.error("Error loading slideshows:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUrlChange = (value: string) => {
        setFormData(prev => ({ ...prev, image: value, file: null }));
        setPreview(value);
    };

    const handleSave = async () => {
        if (!formData.title) {
            alert("Please enter a title");
            return;
        }

        const maxRetries = 2;
        let attempt = 0;

        while (attempt <= maxRetries) {
            try {
                setLoading(true);
                let imageUrl = formData.image;

                // Upload new image if provided
                if (formData.file) {
                    const storageRef = ref(storage, `slideshows/${Date.now()}-${formData.file.name}`);
                    await uploadBytes(storageRef, formData.file);
                    imageUrl = await getDownloadURL(storageRef);
                }

                if (editingId) {
                    // Update existing
                    const docRef = doc(db, "slideshows", editingId);
                    await updateDoc(docRef, {
                        title: formData.title,
                        description: formData.description,
                        image: imageUrl,
                        updatedAt: new Date()
                    });
                } else {
                    // Create new
                    await addDoc(collection(db, "slideshows"), {
                        title: formData.title,
                        description: formData.description,
                        image: imageUrl,
                        order: slides.length + 1,
                        createdAt: new Date()
                    });
                }

                await loadSlideshows();
                resetForm();
                setShowModal(false);
                alert("Slideshow saved successfully!");
                return;
            } catch (error) {
                console.error(`Error saving slideshow (attempt ${attempt + 1}):`, error);
                if (attempt === maxRetries) {
                    alert("Error saving slideshow. Please try again later.");
                    break;
                }
                // small backoff
                await new Promise(res => setTimeout(res, 500 * (attempt + 1)));
                attempt++;
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this slide?")) return;

        try {
            setLoading(true);
            await deleteDoc(doc(db, "slideshows", id));
            await loadSlideshows();
            alert("Slide deleted successfully!");
        } catch (error) {
            console.error("Error deleting slide:", error);
            alert("Error deleting slide");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (slide: Slide) => {
        setFormData({
            title: slide.title,
            description: slide.description,
            image: slide.image,
            file: null
        });
        setPreview(slide.image);
        setEditingId(slide.id);
        setShowModal(true);
    };

    const handlePublish = async () => {
        try {
            setPublishing(true);
            // Trigger Cloud Function to publish slideshows
            const response = await fetch("/api/publish/slideshows", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
                }
            });

            if (response.ok) {
                alert("Slideshows published to live site successfully!");
            } else {
                alert("Error publishing slideshows");
            }
        } catch (error) {
            console.error("Error publishing:", error);
            alert("Error publishing slideshows");
        } finally {
            setPublishing(false);
        }
    };

    const resetForm = () => {
        setFormData({ title: "", description: "", image: "", file: null });
        setPreview("");
        setEditingId(null);
    };

    const moveSlide = async (index: number, direction: "up" | "down") => {
        if ((direction === "up" && index === 0) || (direction === "down" && index === slides.length - 1)) {
            return;
        }

        const newSlides = [...slides];
        const newIndex = direction === "up" ? index - 1 : index + 1;
        [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];

        try {
            setLoading(true);
            for (let i = 0; i < newSlides.length; i++) {
                await updateDoc(doc(db, "slideshows", newSlides[i].id), { order: i + 1 });
            }
            setSlides(newSlides);
        } catch (error) {
            console.error("Error reordering slides:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Slideshows</h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        + Add New Slide
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={publishing}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                        {publishing ? "Publishing..." : "Publish Changes"}
                    </button>
                </div>
            </div>

            {loading && <div className="text-center py-8">Loading...</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slides.map((slide, index) => (
                    <div key={slide.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg">
                        <img src={slide.image} alt={slide.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{slide.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{slide.description}</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleEdit(slide)}
                                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(slide.id)}
                                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition-colors"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => moveSlide(index, "up")}
                                    disabled={index === 0}
                                    className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded disabled:opacity-50"
                                >
                                    ↑
                                </button>
                                <button
                                    onClick={() => moveSlide(index, "down")}
                                    disabled={index === slides.length - 1}
                                    className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded disabled:opacity-50"
                                >
                                    ↓
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && ReactDOM.createPortal(
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                            {editingId ? "Edit Slide" : "Add New Slide"}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-sky-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Slide title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-sky-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Slide description"
                                    rows={3}
                                />
                            </div>

                            {preview && (
                                <div>
                                    <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Image
                                </label>
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Or Image URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => handleImageUrlChange(e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="https://example.com/slide.jpg"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default SlideshowManager;
