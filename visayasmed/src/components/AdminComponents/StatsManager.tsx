import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { statsService } from "../../utils/dataService";

interface Stat {
    id: string;
    icon: string;
    number: string;
    label: string;
    desc: string;
    order: number;
}

const StatsManager: React.FC = () => {
    const [items, setItems] = useState<Stat[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ icon: "📅", number: "", label: "", desc: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const data = await Promise.race([
                statsService.getStats(),
                new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000))
            ]);
            setItems(data as Stat[]);
        } catch (e) {
            console.warn("Failed to load stats (showing empty)");
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ icon: "📅", number: "", label: "", desc: "" });
        setEditingId(null);
    };

    const handleEdit = (item: Stat) => {
        setFormData({ icon: item.icon, number: item.number, label: item.label, desc: item.desc });
        setEditingId(item.id);
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.number || !formData.label) { alert("Number and label are required"); return; }
        setSaving(true);
        try {
            const data = { ...formData, order: editingId ? items.find(i => i.id === editingId)?.order ?? items.length + 1 : items.length + 1 };
            if (editingId) {
                await statsService.updateStat(editingId, data);
            } else {
                await statsService.addStat(data);
            }
            await load();
            setShowModal(false);
            resetForm();
        } catch (e) {
            alert("Error saving stat");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this stat?")) return;
        await statsService.deleteStat(id);
        await load();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Stats</h2>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">+ Add Stat</button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">These stats appear in the "By the Numbers" section on the home page.</p>

            {loading ? <div className="text-center py-8">Loading...</div> : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow text-center">
                            <div className="text-3xl mb-2">{item.icon}</div>
                            <div className="text-2xl font-bold text-orange-500 mb-1">{item.number}</div>
                            <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1">{item.label}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">{item.desc}</p>
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
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-8">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{editingId ? "Edit Stat" : "Add Stat"}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Icon (emoji)</label>
                                <input type="text" value={formData.icon} onChange={(e) => setFormData(p => ({ ...p, icon: e.target.value }))} className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="📅" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Number / Value *</label>
                                <input type="text" value={formData.number} onChange={(e) => setFormData(p => ({ ...p, number: e.target.value }))} className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="70+" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Label *</label>
                                <input type="text" value={formData.label} onChange={(e) => setFormData(p => ({ ...p, label: e.target.value }))} className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Years of Excellence" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <input type="text" value={formData.desc} onChange={(e) => setFormData(p => ({ ...p, desc: e.target.value }))} className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Serving the community since 1955" />
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

export default StatsManager;
