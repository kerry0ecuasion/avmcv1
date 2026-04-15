import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { faqsService } from "../../utils/dataService";

interface FAQ {
    id: string;
    q: string;
    a: string;
    order: number;
}

const FAQsManager: React.FC = () => {
    const [items, setItems] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ q: "", a: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const data = await Promise.race([
                faqsService.getFaqs(),
                new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000))
            ]);
            setItems(data as FAQ[]);
        } catch (e) {
            console.warn("Failed to load faqs (showing empty)");
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ q: "", a: "" });
        setEditingId(null);
    };

    const handleEdit = (item: FAQ) => {
        setFormData({ q: item.q, a: item.a });
        setEditingId(item.id);
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.q || !formData.a) { alert("Question and answer are required"); return; }
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

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage FAQs</h2>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">+ Add FAQ</button>
            </div>

            {loading ? <div className="text-center py-8">Loading...</div> : (
                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div key={item.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 dark:text-white text-sm mb-1">Q{idx + 1}: {item.q}</p>
                                    <p className="text-gray-600 dark:text-gray-300 text-xs line-clamp-2">{item.a}</p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && ReactDOM.createPortal(
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-8 overflow-y-auto max-h-screen">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{editingId ? "Edit FAQ" : "Add FAQ"}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Question *</label>
                                <input type="text" value={formData.q} onChange={(e) => setFormData(p => ({ ...p, q: e.target.value }))} className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Do I need an appointment?" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Answer *</label>
                                <textarea value={formData.a} onChange={(e) => setFormData(p => ({ ...p, a: e.target.value }))} rows={5} className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Walk-ins are welcome..." />
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

export default FAQsManager;
