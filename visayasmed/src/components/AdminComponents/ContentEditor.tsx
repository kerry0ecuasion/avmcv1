import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface ContentEditorProps {
    page: string;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ page }) => {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);

    useEffect(() => {
        loadContent();
    }, [page]);

    const loadContent = async () => {
        try {
            setLoading(true);
            
            // Load page content
            const docRef = doc(db, "pages", page);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                setContent(docSnap.data());
            } else {
                setContent(getDefaultContent(page));
            }

            // Note: doctors and services are managed in AdvancedContentEditor
        } catch (error) {
            console.error("Error loading content:", error);
        } finally {
            setLoading(false);
        }
    };

    const getDefaultContent = (pageType: string) => {
        const defaults: Record<string, any> = {
            home: {
                title: "Home Page",
                subtitle: "Edit home page content",
                sections: []
            },
            about: {
                title: "About Us",
                description: "Edit about page content",
                mission: "Our mission statement",
                vision: "Our vision statement"
            },
            services: {
                title: "Our Services",
                description: "Edit services page content"
            },
            doctors: {
                title: "Our Doctors",
                description: "Edit doctors page content"
            }
        };
        return defaults[pageType] || {};
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const docRef = doc(db, "pages", page);
            await setDoc(docRef, {
                ...content,
                updatedAt: new Date()
            });
            alert("Content saved successfully!");
        } catch (error) {
            console.error("Error saving content:", error);
            alert("Error saving content");
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        try {
            setPublishing(true);
            const response = await fetch(`/api/publish/${page}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
                }
            });

            if (response.ok) {
                alert("Changes published to live site successfully!");
            } else {
                alert("Error publishing changes");
            }
        } catch (error) {
            console.error("Error publishing:", error);
            alert("Error publishing changes");
        } finally {
            setPublishing(false);
        }
    };

    const handleFieldChange = (fieldName: string, value: any) => {
        setContent((prev: any) => ({
            ...prev,
            [fieldName]: value
        }));
    };

    if (loading) {
        return <div className="text-center py-8">Loading content...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white capitalize">
                    Edit {page} Page
                </h2>
                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Draft"}
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={publishing}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                        {publishing ? "Publishing..." : "Publish"}
                    </button>
                </div>
            </div>

            {/* Page-specific editors */}
            {page === "home" && (
                <div className="space-y-6">
                    <section className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Hero Section</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Main Heading
                                </label>
                                <input
                                    type="text"
                                    value={content?.hero?.heading || ""}
                                    onChange={(e) => handleFieldChange("hero", { ...content?.hero, heading: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-sky-600"
                                    placeholder="Enter main heading"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Subheading
                                </label>
                                <input
                                    type="text"
                                    value={content?.hero?.subheading || ""}
                                    onChange={(e) => handleFieldChange("hero", { ...content?.hero, subheading: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-sky-600"
                                    placeholder="Enter subheading"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Features</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Configure features displayed on the home page</p>
                    </section>
                </div>
            )}

            {page === "about" && (
                <div className="space-y-6">
                    <section className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">About Section</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={content?.title || ""}
                                    onChange={(e) => handleFieldChange("title", e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-sky-600"
                                    placeholder="About section title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={content?.description || ""}
                                    onChange={(e) => handleFieldChange("description", e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-sky-600"
                                    placeholder="About section description"
                                    rows={6}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Mission & Vision</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Mission
                                </label>
                                <textarea
                                    value={content?.mission || ""}
                                    onChange={(e) => handleFieldChange("mission", e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-sky-600"
                                    placeholder="Mission statement"
                                    rows={5}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Vision
                                </label>
                                <textarea
                                    value={content?.vision || ""}
                                    onChange={(e) => handleFieldChange("vision", e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-sky-600"
                                    placeholder="Vision statement"
                                    rows={5}
                                />
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {page === "services" && (
                <div className="space-y-6">
                    <section className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Services Overview</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Section Title
                                </label>
                                <input
                                    type="text"
                                    value={content?.title || ""}
                                    onChange={(e) => handleFieldChange("title", e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-sky-600"
                                    placeholder="Services title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={content?.description || ""}
                                    onChange={(e) => handleFieldChange("description", e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-sky-600"
                                    placeholder="Services description"
                                    rows={4}
                                />
                            </div>
                        </div>
                    </section>
                    <p className="text-gray-600 dark:text-gray-400">Services are managed in the database. Use Firestore to add/edit individual services.</p>
                </div>
            )}

            {page === "doctors" && (
                <div className="space-y-6">
                    <section className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Doctors Overview</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Section Title
                                </label>
                                <input
                                    type="text"
                                    value={content?.title || ""}
                                    onChange={(e) => handleFieldChange("title", e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-sky-600"
                                    placeholder="Doctors title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={content?.description || ""}
                                    onChange={(e) => handleFieldChange("description", e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-sky-600"
                                    placeholder="Doctors description"
                                    rows={4}
                                />
                            </div>
                        </div>
                    </section>
                    <p className="text-gray-600 dark:text-gray-400">Individual doctors are managed in Firestore. Add/edit doctor profiles directly in the database.</p>
                </div>
            )}
        </div>
    );
};

export default ContentEditor;
