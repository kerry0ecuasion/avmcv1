import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { newsService } from "../../utils/dataService";

interface NewsItem {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
    date: string;
    order: number;
}

type FormData = {
    title: string;
    description: string;
    link: string;
    date: string;
};

const emptyForm: FormData = { title: "", description: "", link: "", date: "" };

/* ── Live card preview ──────────────────────────────────────────── */
const CardPreview: React.FC<{ data: FormData }> = ({ data }) => (
    <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg overflow-hidden select-none">
        {data.date && (
            <div className="px-5 pt-5 pb-0">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 dark:text-blue-400">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="uppercase tracking-wide">{data.date || "Date"}</span>
                </span>
            </div>
        )}
        <div className="flex flex-col flex-1 p-5">
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm leading-snug mb-2 line-clamp-2">
                {data.title || <span className="text-gray-400 italic">News title…</span>}
            </h3>
            {data.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 mb-3">
                    {data.description}
                </p>
            )}
            <div className="mt-auto">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-700/30">
                    Read More
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </div>
        </div>
        <div className="h-[3px] bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600" />
    </div>
);

/* ── Drag handle icon ───────────────────────────────────────────── */
const DragHandle: React.FC = () => (
    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
    </svg>
);

/* ── Main component ─────────────────────────────────────────────── */
const NewsManager: React.FC = () => {
    const [items, setItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [dragOverId, setDragOverId] = useState<string | null>(null);
    const dragItem = useRef<string | null>(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const data = await Promise.race([
                newsService.getNews(),
                new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000))
            ]);
            setItems((data as NewsItem[]).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
        } catch {
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const openAdd = () => { setFormData(emptyForm); setEditingId(null); setShowModal(true); };
    const openEdit = (item: NewsItem) => {
        setFormData({ title: item.title, description: item.description ?? "", link: item.link ?? "", date: item.date ?? "" });
        setEditingId(item.id);
        setShowModal(true);
    };
    const closeModal = () => { setShowModal(false); setEditingId(null); setFormData(emptyForm); };

    const handleSave = async () => {
        if (!formData.title.trim()) { alert("Title is required."); return; }
        setSaving(true);
        try {
            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                link: formData.link.trim(),
                date: formData.date.trim(),
                image: "",
                order: editingId
                    ? (items.find(i => i.id === editingId)?.order ?? items.length + 1)
                    : items.length + 1,
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

    /* ── Drag-to-reorder ─────────────────────────────────────────── */
    const handleDragStart = (id: string) => { dragItem.current = id; };
    const handleDragOver = (e: React.DragEvent, id: string) => {
        e.preventDefault();
        setDragOverId(id);
    };
    const handleDrop = async (targetId: string) => {
        if (!dragItem.current || dragItem.current === targetId) { setDragOverId(null); return; }
        const fromIdx = items.findIndex(i => i.id === dragItem.current);
        const toIdx = items.findIndex(i => i.id === targetId);
        const reordered = [...items];
        const [moved] = reordered.splice(fromIdx, 1);
        reordered.splice(toIdx, 0, moved);
        const updated = reordered.map((item, idx) => ({ ...item, order: idx + 1 }));
        setItems(updated);
        setDragOverId(null);
        dragItem.current = null;
        // Persist new order
        await Promise.all(updated.map(item => newsService.updateNews(item.id, { order: item.order })));
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
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">News &amp; Events</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage carousel cards — drag rows to reorder
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
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-3h4l2 3h4a2 2 0 012 2v11a2 2 0 01-2 2z" />
                    </svg>
                    <p className="font-medium">No news items yet.</p>
                    <p className="text-sm mt-1">Click "Add News Item" to get started.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div
                            key={item.id}
                            draggable
                            onDragStart={() => handleDragStart(item.id)}
                            onDragOver={(e) => handleDragOver(e, item.id)}
                            onDrop={() => handleDrop(item.id)}
                            onDragEnd={() => setDragOverId(null)}
                            className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-grab active:cursor-grabbing ${
                                dragOverId === item.id
                                    ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-[1.01]"
                                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                            }`}
                        >
                            {/* Order + drag handle */}
                            <div className="flex items-center gap-2 pt-1 flex-shrink-0">
                                <DragHandle />
                                <span className="text-xs font-bold text-gray-400 w-5 text-center">{idx + 1}</span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    {item.date && (
                                        <span className="text-xs font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wide">
                                            {item.date}
                                        </span>
                                    )}
                                </div>
                                <p className="font-semibold text-gray-800 dark:text-white text-sm leading-snug line-clamp-1">{item.title}</p>
                                {item.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{item.description}</p>
                                )}
                                {item.link && (
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-sky-500 hover:text-sky-600 mt-1 transition-colors"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        {item.link.length > 50 ? item.link.slice(0, 50) + "…" : item.link}
                                    </a>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => openEdit(item)}
                                    className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 text-xs font-semibold rounded-lg transition-colors"
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
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                {editingId ? "Edit News Item" : "Add News Item"}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal body — two-column layout */}
                        <div className="overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                {/* Left: form */}
                                <div className="p-8 space-y-5 border-r border-gray-100 dark:border-gray-700">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Card Details</p>

                                    {field("Title", (
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                                            className={inputCls}
                                            placeholder="e.g. Health Awareness Month"
                                            autoFocus
                                        />
                                    ), true)}

                                    {field("Description", (
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                            className={inputCls + " resize-none h-24"}
                                            placeholder="Short summary shown on the card…"
                                        />
                                    ))}

                                    {field("Date", (
                                        <input
                                            type="text"
                                            value={formData.date}
                                            onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                                            className={inputCls}
                                            placeholder="e.g. Mar 17, 2026"
                                        />
                                    ))}

                                    {field("Link URL", (
                                        <input
                                            type="url"
                                            value={formData.link}
                                            onChange={e => setFormData(p => ({ ...p, link: e.target.value }))}
                                            className={inputCls}
                                            placeholder="https://example.com/article"
                                        />
                                    ))}
                                </div>

                                {/* Right: live preview */}
                                <div className="p-8 bg-gray-50 dark:bg-gray-900/40">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Live Preview</p>
                                    <CardPreview data={formData} />
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center italic">
                                        This is how the card will appear in the carousel.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="flex gap-3 px-8 py-5 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-800">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors"
                            >
                                {saving ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {editingId ? "Save Changes" : "Add to Carousel"}
                                    </>
                                )}
                            </button>
                            <button
                                onClick={closeModal}
                                className="px-6 py-2.5 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-600 transition-colors"
                            >
                                Cancel
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
