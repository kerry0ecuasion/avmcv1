import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { testimonialsService } from "../../utils/dataService";

interface Testimonial {
    id: string;
    name: string;
    role: string;
    text: string;
    rating: number;
    icon: string;
    order: number;
}

const ICONS = ["👩", "👨", "👨‍⚕️", "👩‍⚕️", "🧑"];

const TestimonialsManager: React.FC = () => {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", role: "", text: "", rating: 5, icon: "👩" });
    const [saving, setSaving] = useState(false);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const data = await Promise.race([
                testimonialsService.getTestimonials(),
                new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000))
            ]);
            setItems(data as Testimonial[]);
        } catch (e) {
            console.warn("Failed to load testimonials (showing empty)");
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: "", role: "", text: "", rating: 5, icon: "👩" });
        setEditingId(null);
    };

    const handleEdit = (item: Testimonial) => {
        setFormData({ name: item.name, role: item.role, text: item.text, rating: item.rating, icon: item.icon });
        setEditingId(item.id);
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.text) { alert("Name and text are required"); return; }
        setSaving(true);
        try {
            const data = { ...formData, order: editingId ? items.find(i => i.id === editingId)?.order ?? items.length + 1 : items.length + 1 };
            if (editingId) {
                await testimonialsService.updateTestimonial(editingId, data);
            } else {
                await testimonialsService.addTestimonial(data);
            }
            await load();
            setShowModal(false);
            resetForm();
        } catch (e) {
            alert("Error saving testimonial");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this testimonial?")) return;
        await testimonialsService.deleteTestimonial(id);
        await load();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Testimonials</h2>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">+ Add Testimonial</button>
            </div>

            {loading ? <div className="text-center py-8">Loading...</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl">{item.icon}</span>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white text-sm">{item.name}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs">{item.role}</p>
                                </div>
                                <div className="ml-auto flex">
                                    {[...Array(item.rating)].map((_, i) => <span key={i} className="text-yellow-400 text-xs">★</span>)}
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm italic mb-3 line-clamp-3">"{item.text}"</p>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(item)} className="flex-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded">Edit</button>
                                <button onClick={() => handleDelete(item.id)} className="flex-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && ReactDOM.createPortal(
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-8 overflow-y-auto max-h-screen">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{editingId ? "Edit Testimonial" : "Add Testimonial"}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Icon</label>
                                <div className="flex gap-3">
                                    {ICONS.map(icon => (
                                        <button key={icon} onClick={() => setFormData(p => ({ ...p, icon }))} className={`text-2xl p-2 rounded-lg border-2 ${formData.icon === icon ? 'border-sky-500' : 'border-gray-300 dark:border-gray-600'}`}>{icon}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Patient name" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Role</label>
                                <input type="text" value={formData.role} onChange={(e) => setFormData(p => ({ ...p, role: e.target.value }))} className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Patient / Referring Physician" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Testimonial *</label>
                                <textarea value={formData.text} onChange={(e) => setFormData(p => ({ ...p, text: e.target.value }))} rows={4} className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Their experience..." />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Rating: {formData.rating} stars</label>
                                <input type="range" min={1} max={5} value={formData.rating} onChange={(e) => setFormData(p => ({ ...p, rating: Number(e.target.value) }))} className="w-full" />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-lg">{saving ? "Saving..." : "Save"}</button>
                                <button onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default TestimonialsManager;
