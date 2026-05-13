import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { faqsService } from "../../utils/dataService";

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    order: number;
    isActive: boolean;
}

const FAQsManager: React.FC = () => {
    const [items, setItems] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ question: "", answer: "", category: "General", isActive: true });
    const [saving, setSaving] = useState(false);
    const [draggedId, setDraggedId] = useState<string | null>(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const data = await faqsService.getFaqs();
            // ensure sorted by order
            const sorted = (data as FAQ[]).sort((a, b) => (a.order || 0) - (b.order || 0));
            setItems(sorted);
        } catch (e) {
            console.warn("Failed to load faqs");
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ question: "", answer: "", category: "General", isActive: true });
        setEditingId(null);
    };

    const handleEdit = (item: FAQ) => {
        setFormData({ 
            question: item.question || (item as any).q || "", 
            answer: item.answer || (item as any).a || "", 
            category: item.category || "General", 
            isActive: item.isActive !== false 
        });
        setEditingId(item.id);
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.question || !formData.answer) { alert("Question and answer are required"); return; }
        setSaving(true);
        try {
            const data = { ...formData, order: editingId ? items.find(i => i.id === editingId)?.order ?? items.length + 1 : items.length + 1 };
            if (editingId) {
                await faqsService.updateFaq(editingId, data);
            } else {
                await faqsService.addFaq(data);
            }
            await load();
            setShowModal(false);
            resetForm();
        } catch (e) {
            alert("Error saving FAQ");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this FAQ?")) return;
        await faqsService.deleteFaq(id);
        await load();
    };

    // Drag and Drop reordering
    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedId || draggedId === targetId) return;

        const draggedIndex = items.findIndex(i => i.id === draggedId);
        const targetIndex = items.findIndex(i => i.id === targetId);

        if (draggedIndex < 0 || targetIndex < 0) return;

        const newItems = [...items];
        const [draggedItem] = newItems.splice(draggedIndex, 1);
        newItems.splice(targetIndex, 0, draggedItem);
        setItems(newItems); // Optimistic UI update
    };

    const handleDrop = async () => {
        setDraggedId(null);
        // Save new order to Firebase
        try {
            const updates = items.map((item, index) => 
                faqsService.updateFaq(item.id, { ...item, order: index + 1 })
            );
            await Promise.all(updates);
        } catch (e) {
            console.error("Failed to save new order", e);
            await load(); // revert on failure
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage FAQs</h2>
                    <p className="text-sm text-gray-500 mt-1">Drag and drop items to reorder them on the website.</p>
                </div>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">+ Add FAQ</button>
            </div>

            {loading ? <div className="text-center py-8">Loading...</div> : (
                <div className="space-y-3">
                    {items.map((item) => (
                        <div 
                            key={item.id} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, item.id)}
                            onDragOver={(e) => handleDragOver(e, item.id)}
                            onDrop={handleDrop}
                            onDragEnd={() => setDraggedId(null)}
                            className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm cursor-move flex items-start gap-4 transition-transform ${draggedId === item.id ? 'opacity-50 scale-95' : ''}`}
                        >
                            <div className="mt-1 flex-shrink-0 text-gray-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                        {item.category || "General"}
                                    </span>
                                    {item.isActive === false && (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Hidden</span>
                                    )}
                                </div>
                                <p className="font-bold text-gray-900 dark:text-white text-base mb-1">{item.question || (item as any).q}</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{item.answer || (item as any).a}</p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <button onClick={() => handleEdit(item)} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">Edit</button>
                                <button onClick={() => handleDelete(item.id)} className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && ReactDOM.createPortal(
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{editingId ? "Edit FAQ" : "Add FAQ"}</h3>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category *</label>
                                <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                                    <option>General</option>
                                    <option>Appointments</option>
                                    <option>Services</option>
                                    <option>Insurance</option>
                                    <option>Emergency</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Question *</label>
                                <input type="text" value={formData.question} onChange={(e) => setFormData(p => ({ ...p, question: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter the question..." />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Answer *</label>
                                <textarea value={formData.answer} onChange={(e) => setFormData(p => ({ ...p, answer: e.target.value }))} rows={5} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Provide the answer..." />
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData(p => ({ ...p, isActive: e.target.checked }))} className="w-5 h-5 text-blue-600 rounded cursor-pointer" />
                                <label htmlFor="isActive" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">Active (Show on website)</label>
                            </div>
                            
                            <div className="flex gap-4 pt-4 mt-6 border-t border-gray-100 dark:border-gray-700">
                                <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors">{saving ? "Saving..." : "Save FAQ"}</button>
                                <button onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default FAQsManager;
