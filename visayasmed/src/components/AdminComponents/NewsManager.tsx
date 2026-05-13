import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { newsService } from "../../utils/dataService";

interface NewsItem {
    id: string;
    category: string;
    title: string;
    description: string;
    date: string;
    sourceUrl: string;
    sourceName: string;
    imageUrl: string;
    isFeatured: boolean;
    isActive: boolean;
    createdAt?: any;
}

type FormData = {
    category: string;
    title: string;
    description: string;
    date: string;
    sourceUrl: string;
    sourceName: string;
    imageUrl: string;
    isFeatured: boolean;
    isActive: boolean;
};

const emptyForm: FormData = { 
    category: "hospital-news", 
    title: "", 
    description: "", 
    date: "", 
    sourceUrl: "", 
    sourceName: "", 
    imageUrl: "", 
    isFeatured: false, 
    isActive: true 
};

const categories = [
    { id: "hospital-news", label: "Hospital Announcements" },
    { id: "health-tips", label: "Health Tips & Wellness" },
    { id: "community-events", label: "Community Outreach" },
    { id: "screenings", label: "Health Screening Schedule" },
    { id: "seminars", label: "Public Health Seminars" }
];

/* ── Live card preview ──────────────────────────────────────────── */
const CardPreview: React.FC<{ data: FormData }> = ({ data }) => {
    let badgeColor = "bg-blue-500";
    let badgeLabel = "Hospital News";
    if (data.category === "health-tips") { badgeColor = "bg-green-500"; badgeLabel = "Health Tips"; }
    if (data.category === "community-events") { badgeColor = "bg-purple-500"; badgeLabel = "Community Event"; }
    if (data.category === "screenings") { badgeColor = "bg-red-500"; badgeLabel = "Health Screening"; }
    if (data.category === "seminars") { badgeColor = "bg-orange-500"; badgeLabel = "Seminar"; }

    return (
        <div className="rounded-2xl bg-[#0f172a] text-white border border-gray-700 shadow-lg overflow-hidden select-none flex flex-col h-full">
            <div className="w-full aspect-[16/10] bg-gray-800 relative">
                {data.imageUrl ? (
                    <img src={data.imageUrl} className="w-full h-full object-cover" alt="" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                )}
                <div className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase rounded-full text-white ${badgeColor}`}>
                    {badgeLabel}
                </div>
            </div>
            
            <div className="flex flex-col flex-1 p-5">
                <h3 className="font-bold text-white text-lg leading-snug mb-2 line-clamp-2">
                    {data.title || <span className="text-gray-500 italic">News title…</span>}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-2 mb-3">
                    {data.description || <span className="text-gray-500 italic">Description…</span>}
                </p>
                
                <div className="text-xs text-gray-400 mb-4 space-y-1">
                    {data.date && <p>Date: {data.date}</p>}
                    {data.sourceName && <p>Source: {data.sourceName}</p>}
                </div>
                
                <div className="mt-auto">
                    <span className="inline-flex items-center gap-1.5 font-bold text-blue-400">
                        Read More <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </span>
                </div>
            </div>
        </div>
    );
};

/* ── Main component ─────────────────────────────────────────────── */
const NewsManager: React.FC = () => {
    const [items, setItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>(emptyForm);
    const [saving, setSaving] = useState(false);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const data = await newsService.getNews();
            setItems(data as NewsItem[]);
        } catch {
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const openAdd = () => { setFormData(emptyForm); setEditingId(null); setShowModal(true); };
    const openEdit = (item: NewsItem) => {
        setFormData({ 
            category: item.category || "hospital-news",
            title: item.title || "", 
            description: item.description || "", 
            date: item.date || "",
            sourceUrl: item.sourceUrl || "",
            sourceName: item.sourceName || "",
            imageUrl: item.imageUrl || "",
            isFeatured: item.isFeatured || false,
            isActive: item.isActive ?? true,
        });
        setEditingId(item.id);
        setShowModal(true);
    };
    const closeModal = () => { setShowModal(false); setEditingId(null); setFormData(emptyForm); };

    const handleSave = async () => {
        if (!formData.title.trim()) { alert("Title is required."); return; }
        setSaving(true);
        try {
            const payload = {
                category: formData.category,
                title: formData.title.trim(),
                description: formData.description.trim(),
                date: formData.date.trim(),
                sourceUrl: formData.sourceUrl.trim(),
                sourceName: formData.sourceName.trim(),
                imageUrl: formData.imageUrl.trim(),
                isFeatured: formData.isFeatured,
                isActive: formData.isActive
            };
            if (editingId) {
                await newsService.updateNews(editingId, payload);
            } else {
                await newsService.addNews(payload);
            }
            await load();
            closeModal();
        } catch (e) {
            console.error("Save failed:", e);
            alert("Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this news item?")) return;
        await newsService.deleteNews(id);
        await load();
    };

    const field = (label: string, node: React.ReactNode, required = false) => (
        <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {node}
        </div>
    );

    const inputCls = "w-full px-3 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors";

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">News &amp; Events Manager</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage articles across all categories
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Add News Item
                </button>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Loading news items…
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 text-gray-400 dark:text-gray-500">
                    <p className="font-medium">No news items found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                        >
                            {item.imageUrl && (
                                <img src={item.imageUrl} alt="" className="w-full h-32 object-cover rounded-lg mb-3" />
                            )}
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">{item.category}</span>
                                {item.isFeatured && <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">Featured</span>}
                            </div>
                            <p className="font-semibold text-gray-800 dark:text-white text-sm leading-snug line-clamp-2 mb-1">{item.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{item.date} • {item.sourceName}</p>
                            
                            <div className="mt-auto flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    onClick={() => openEdit(item)}
                                    className="flex-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="flex-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && ReactDOM.createPortal(
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                {editingId ? "Edit News Item" : "Add News Item"}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal body */}
                        <div className="overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
                                {/* Left: form */}
                                <div className="p-8 space-y-5 border-r border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData(p => ({...p, isActive: e.target.checked}))} className="w-4 h-4 text-blue-600 rounded" />
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Active (Visible)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData(p => ({...p, isFeatured: e.target.checked}))} className="w-4 h-4 text-amber-500 rounded" />
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Featured Article</span>
                                        </label>
                                    </div>

                                    {field("Category", (
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                                            className={inputCls}
                                        >
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                        </select>
                                    ))}

                                    {field("Title", (
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                                            className={inputCls}
                                            placeholder="Article headline..."
                                        />
                                    ), true)}

                                    {field("Description", (
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                            className={inputCls + " resize-none h-24"}
                                            placeholder="Short 2-3 sentence description..."
                                        />
                                    ))}

                                    <div className="grid grid-cols-2 gap-4">
                                        {field("Date / Location", (
                                            <input
                                                type="text"
                                                value={formData.date}
                                                onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                                                className={inputCls}
                                                placeholder="e.g. Oct 10, 2026"
                                            />
                                        ))}
                                        {field("Source Name", (
                                            <input
                                                type="text"
                                                value={formData.sourceName}
                                                onChange={e => setFormData(p => ({ ...p, sourceName: e.target.value }))}
                                                className={inputCls}
                                                placeholder="e.g. DOH Philippines"
                                            />
                                        ))}
                                    </div>

                                    {field("Source URL", (
                                        <input
                                            type="url"
                                            value={formData.sourceUrl}
                                            onChange={e => setFormData(p => ({ ...p, sourceUrl: e.target.value }))}
                                            className={inputCls}
                                            placeholder="https://..."
                                        />
                                    ))}

                                    {field("Image URL", (
                                        <input
                                            type="text"
                                            value={formData.imageUrl}
                                            onChange={e => setFormData(p => ({ ...p, imageUrl: e.target.value }))}
                                            className={inputCls}
                                            placeholder="/images/news1.jpg"
                                        />
                                    ))}
                                </div>

                                {/* Right: preview */}
                                <div className="p-8 bg-gray-900 hidden md:block">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Website Preview</p>
                                    <div className="w-full max-w-sm mx-auto h-[450px]">
                                        <CardPreview data={formData} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="flex gap-3 px-8 py-5 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-800 justify-end">
                            <button
                                onClick={closeModal}
                                className="px-6 py-2.5 bg-white dark:bg-gray-700 hover:bg-gray-100 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center justify-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors"
                            >
                                {saving ? "Saving..." : "Save Article"}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default NewsManager;
