import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { heroCarouselService } from "../../utils/dataService";

interface CarouselImage {
    id: string;
    url: string;
    caption?: string;
    order: number;
}

const HeroCarouselManager: React.FC = () => {
    const [images, setImages] = useState<CarouselImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [preview, setPreview] = useState<string>("");
    const [caption, setCaption] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { load(); }, []);

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const load = async () => {
        setLoading(true);
        const data = await heroCarouselService.getImages() as CarouselImage[];
        setImages(data);
        setLoading(false);
    };

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith("image/")) { showToast("Please select an image file.", "error"); return; }
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    const resetModal = () => {
        setPreview("");
        setCaption("");
        setSelectedFile(null);
        setShowModal(false);
    };

    const handleUpload = async () => {
        if (!selectedFile) { showToast("Please select an image first.", "error"); return; }
        setSaving(true);
        try {
            await heroCarouselService.addImage({ caption, order: images.length + 1 }, selectedFile);
            showToast("Image added to hero carousel!");
            resetModal();
            await load();
        } catch {
            showToast("Failed to upload image. Please try again.", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, url: string) => {
        setSaving(true);
        try {
            await heroCarouselService.deleteImage(id, url);
            showToast("Image removed from carousel.");
            setDeleteConfirmId(null);
            await load();
        } catch {
            showToast("Failed to delete image.", "error");
        } finally {
            setSaving(false);
        }
    };

    const moveImage = async (index: number, dir: "up" | "down") => {
        const newImages = [...images];
        const swapIndex = dir === "up" ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= newImages.length) return;
        [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
        setImages(newImages);
        try {
            await heroCarouselService.reorder(
                newImages.map((img, i) => ({ id: img.id, order: i + 1 }))
            );
            showToast("Order updated.");
        } catch {
            showToast("Failed to save order.", "error");
            await load();
        }
    };

    return (
        <div className="relative">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[10000] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-white font-semibold text-sm transition-all duration-300 ${
                    toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
                }`}>
                    {toast.type === "success" ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Hero Carousel Photos</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage the background images that rotate on the home page hero section.
                    </p>
                </div>
                <button
                    onClick={() => { resetModal(); setShowModal(true); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-sky-500/30 hover:scale-[1.02]"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Add Photo
                </button>
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 rounded-xl px-4 py-3 mb-6">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    Images are displayed in the carousel order shown below. Use the arrows to reorder. If no images are added, default photos are used.
                </p>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : images.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl">
                    <svg className="w-14 h-14 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">No carousel photos yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Default images will show on the home page</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Upload First Photo
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {images.map((img, idx) => (
                        <div key={img.id} className="group relative rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={img.url}
                                    alt={img.caption || `Slide ${idx + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Order badge */}
                                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                                    #{idx + 1}
                                </div>
                                {/* Delete overlay */}
                                <button
                                    onClick={() => setDeleteConfirmId(img.id)}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 bg-red-600/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md"
                                    title="Remove photo"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            {/* Caption + reorder */}
                            <div className="flex items-center justify-between px-3 py-2.5">
                                <span className="text-sm text-gray-600 dark:text-gray-300 truncate flex-1 mr-2">
                                    {img.caption || <span className="italic text-gray-400">No caption</span>}
                                </span>
                                <div className="flex gap-1 flex-shrink-0">
                                    <button
                                        onClick={() => moveImage(idx, "up")}
                                        disabled={idx === 0 || saving}
                                        title="Move up"
                                        className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-sky-100 dark:hover:bg-sky-900 disabled:opacity-30 flex items-center justify-center transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
                                    </button>
                                    <button
                                        onClick={() => moveImage(idx, "down")}
                                        disabled={idx === images.length - 1 || saving}
                                        title="Move down"
                                        className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-sky-100 dark:hover:bg-sky-900 disabled:opacity-30 flex items-center justify-center transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete confirm modal */}
            {deleteConfirmId && ReactDOM.createPortal(
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white text-center mb-2">Remove Photo?</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">This will permanently remove the image from the hero carousel.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    const img = images.find(i => i.id === deleteConfirmId);
                                    if (img) handleDelete(img.id, img.url);
                                }}
                                disabled={saving}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                            >
                                {saving ? "Removing..." : "Yes, Remove"}
                            </button>
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Upload modal */}
            {showModal && ReactDOM.createPortal(
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-7 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Add Hero Photo</h3>
                            <button onClick={resetModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Drop zone */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            className={`cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center py-10 mb-4 ${
                                dragOver
                                    ? "border-sky-500 bg-sky-50 dark:bg-sky-950/30"
                                    : preview
                                    ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
                                    : "border-gray-300 dark:border-gray-600 hover:border-sky-400 hover:bg-gray-50 dark:hover:bg-gray-750"
                            }`}
                        >
                            {preview ? (
                                <>
                                    <img src={preview} alt="Preview" className="h-40 object-contain rounded-lg mb-3" />
                                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Click to change image</p>
                                </>
                            ) : (
                                <>
                                    <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Click or drag & drop to upload</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">JPG, PNG, WebP — recommended 1920×1080</p>
                                </>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                        />

                        {/* Caption */}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Caption <span className="font-normal text-gray-400">(optional)</span>
                            </label>
                            <input
                                type="text"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="e.g. Main reception area"
                                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-sky-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile || saving}
                                className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                        Upload Photo
                                    </>
                                )}
                            </button>
                            <button
                                onClick={resetModal}
                                className="px-5 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-colors"
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

export default HeroCarouselManager;
