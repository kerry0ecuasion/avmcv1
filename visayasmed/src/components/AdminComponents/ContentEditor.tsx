import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface ContentEditorProps {
    page: string;
}

const inputClass = "w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-sky-600";
const textareaClass = `${inputClass} resize-none`;
const sectionClass = "bg-gray-100 dark:bg-gray-700 p-6 rounded-lg";
const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2";

const ContentEditor: React.FC<ContentEditorProps> = ({ page }) => {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadContent(); }, [page]);

    const loadContent = async () => {
        try {
            setLoading(true);
            const docRef = doc(db, "pages", page);
            
            const fetchPromise = getDoc(docRef);
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error("Firestore timeout")), 5000)
            );
            
            try {
              const docSnap = await Promise.race([fetchPromise, timeoutPromise]) as any;
              if (docSnap.exists()) {
                setContent(docSnap.data());
              } else {
                setContent(getDefaultContent(page));
              }
            } catch (timeoutErr) {
              console.warn("Firestore load timed out, using defaults");
              setContent(getDefaultContent(page));
            }
        } catch (error) {
            console.error("Error loading content:", error);
            setContent(getDefaultContent(page));
        } finally {
            setLoading(false);
        }
    };

    const getDefaultContent = (pageType: string) => {
        const defaults: Record<string, any> = {
            home: {
                heroBadge: "Trusted Since 1955",
                heroHeading1: "Your Health,",
                heroHeading2: "Our Priority",
                heroSubheading: "Delivering compassionate, world-class healthcare to the Visayas region with modern facilities and expert medical professionals.",
                stats: [
                    { value: "70", suffix: "+", label: "Years of Excellence" },
                    { value: "150", suffix: "+", label: "Expert Specialists" },
                    { value: "50000", suffix: "+", label: "Patients Served" },
                    { value: "24", suffix: "/7", label: "Emergency Care" }
                ],
                whyChooseHeading1: "Why Choose",
                whyChooseHeading2: "VisayasMed?",
                whyChooseDescription: "At VisayasMed, we combine decades of medical expertise with cutting-edge technology to deliver exceptional healthcare. Our commitment to patient-centered care ensures you receive the highest quality medical attention.",
                whyChooseItems: [
                    { title: "70+ Years of Excellence", description: "Trusted healthcare provider serving the Visayas region since 1955" },
                    { title: "150+ Expert Specialists", description: "Highly qualified doctors across all major medical disciplines" },
                    { title: "Advanced Technology", description: "State-of-the-art medical equipment and modern facilities" },
                    { title: "Patient-First Approach", description: "Compassionate care tailored to your individual needs" }
                ],
                servicesBadge: "Specialized Care",
                servicesHeading: "Our Services",
                servicesDesc: "Comprehensive medical solutions delivered by experts at the heart of Cebu.",
                servicesHighlight: [
                    { iconType: "medicine", title: "Family Medicine", description: "Primary care for all ages — preventive, chronic, and acute", gradient: "from-blue-500 to-blue-700", link: "/services/family-medicine" },
                    { iconType: "pediatrics", title: "Pediatrics", description: "Specialized care for infants, children, and adolescents", gradient: "from-violet-500 to-purple-700", link: "/services/pediatrics" },
                    { iconType: "emergency", title: "Internal Medicine", description: "Diagnosis and treatment of adult diseases and conditions", gradient: "from-emerald-500 to-teal-700", link: "/services/internal-medicine" },
                    { iconType: "orthopedics", title: "Surgery", description: "Advanced surgical procedures with expert surgical teams", gradient: "from-rose-500 to-red-700", link: "/services/surgery" },
                    { iconType: "pediatrics", title: "OB & GYNE", description: "Comprehensive obstetrics and gynecology services", gradient: "from-pink-500 to-rose-700", link: "/services/ob-gyne" }
                ]
            },
            about: {
                heritageTitle: "Seven Decades of Trusted Care",
                heritageDesc: "Since 1955, VisayasMed Hospital has served the community with unwavering commitment to excellence in healthcare.",
                patientCenteredTitle: "Patient-Centered Excellence",
                patientCenteredText: "We provide a convenient and personalized approach to healthcare, supported by well-equipped facilities and competent medical professionals dedicated to your wellness.",
                commitmentItems: ["Delivering compassionate, personalized healthcare to every patient", "Maintaining medical excellence through continuous professional development", "Creating a healing environment that promotes wellness and recovery"],
                tagline: '"Trusted care across generations — personalized, modern, and compassionate."',
                missionText: "To provide a patient-centered healing experience through quality medical care, by competent professionals and modern facilities in a conducive healing environment so patients may live a healthier, fuller and more productive lives.",
                visionText: "VisayasMed Hospital will be the hospital of choice for convenient, conducive, and patient-centered healing experience by 2025.",
                coreValues: [{ name: "Sense of Urgency", desc: "Getting things done promptly and efficiently." }, { name: "Integrity", desc: "Upholding honesty and ethical standards in all we do." }, { name: "Compassion", desc: "Caring for patients with empathy and understanding." }, { name: "Excellence", desc: "Striving for the highest quality in patient care and service." }, { name: "Innovation", desc: "Embracing new ideas and continuous improvement." }, { name: "Respect", desc: "Honoring the dignity and rights of every individual." }],
                accreditedPartners: ["APPLE ONE", "APPLE ONE MACTAN", "BRILLIANT METAL CRAFT", "BUILD IT", "CEBU BIONIC", "CEBU PEOPLE'S COOP", "FOUNT OF LIFE (SUPPLIER)", "INTRANET TRADE", "LACSON & LACSON", "MCWD - METROPOLITAN CEBU WATER DISTRICT", "SUPREA", "TIMEX", "USDI", "VENRAY CONSTRUCTION", "PCSO"],
                hmos: [
                    { name: 'Carewellness Plus', initials: 'CW', color: 'from-blue-500 to-blue-700', logo: "" },
                    { name: 'Etiga', initials: 'ET', color: 'from-blue-500 to-blue-700', logo: '/hmo/etiqa.png' },
                    { name: 'Cocolife', initials: 'CC', color: 'from-rose-500 to-rose-700', logo: '/hmo/cocolife.png' },
                    { name: 'Global Doctors', initials: 'GD', color: 'from-amber-500 to-amber-700', logo: "" },
                    { name: "Cebu People's Cooperative", initials: 'CP', color: 'from-indigo-500 to-indigo-700', logo: '/hmo/cebu-coop.png' },
                    { name: 'PhilAm Health', initials: 'PA', color: 'from-green-500 to-emerald-700', logo: "" },
                    { name: 'EastWest Healthcare', initials: 'EW', color: 'from-blue-500 to-blue-700', logo: '/hmo/eastwest.png' },
                    { name: 'Fortune Care', initials: 'FC', color: 'from-orange-500 to-orange-700', logo: '/hmo/fortune-care.png' },
                    { name: 'Health Maintenance, Inc.', initials: 'HM', color: 'from-sky-500 to-sky-700', logo: '/hmo/hmi.png' },
                    { name: 'InLife Wellcare Health Care', initials: 'IW', color: 'from-violet-500 to-violet-700', logo: '/hmo/inlife.webp' }
                ]
            },
            emergency: {
                headline: "Always Ready to Save Lives",
                description: "VisayasMed's Emergency Department operates 24/7, providing rapid response and expert care for all types of medical emergencies.",
                hotline: "911",
                whyChooseItems: ["Average door-to-doctor time: 3 minutes", "Advanced diagnostic imaging on-site", "Dedicated trauma operating rooms", "ICU beds with intensive monitoring", "Specialist consultation available 24/7", "Coordination with advanced hospitals if needed"]
            },
            cta: {
                heading: "Ready to Take Control of Your Health?",
                description: "Join thousands of patients who trust VisayasMed for their healthcare needs. Our experienced team is ready to provide you with compassionate, world-class medical care.",
                features: ["✓ Experienced specialists available 24/7", "✓ State-of-the-art facilities and technology", "✓ Personalized treatment plans for your needs"],
                primaryButtonText: "Schedule Appointment",
                primaryButtonHref: "#find-doctor",
                secondaryButtonText: "Call Us Now",
                secondaryButtonHref: "tel:+63322531901",
                emergencyNote: "Emergency? Call 911 for immediate assistance"
            },
            contact: {
                phone: "(+32) 253-1901",
                operator: "0977-321-2615 | 0970-369-5188",
                email: "Info@visayasmed.com.ph",
                address: "VisayasMed Hospital, Cebu, Philippines",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m0!3m2!1sen!2sph!4v1234!5m2!1sen!2sph!6m8!1m7!1sqX9m3vqoPlKajP0hvNgC5w!2m2!1d10.3059147!2d123.8945713!3f37.02!4f4.43!5f0.9",
                copyright: "© 2026 VisayasMed Hospital. All rights reserved. | Trusted care across generations."
            }
        };  
        return defaults[pageType] || {};
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const docRef = doc(db, "pages", page);
            await setDoc(docRef, { ...content, updatedAt: new Date() });
            alert("Content saved successfully!");
        } catch (error) {
            console.error("Error saving content:", error);
            alert("Error saving content");
        } finally {
            setSaving(false);
        }
    };

    const handleFieldChange = (fieldName: string, value: any) => {
        setContent((prev: any) => ({ ...prev, [fieldName]: value }));
    };

    const handleArrayItemChange = (fieldName: string, index: number, value: string) => {
        setContent((prev: any) => {
            const arr = [...(prev[fieldName] || [])];
            arr[index] = value;
            return { ...prev, [fieldName]: arr };
        });
    };

    const handleArrayItemAdd = (fieldName: string, defaultItem: any = "") => {
        setContent((prev: any) => ({ ...prev, [fieldName]: [...(prev[fieldName] || []), defaultItem] }));
    };

    const handleArrayItemRemove = (fieldName: string, index: number) => {
        setContent((prev: any) => {
            const arr = [...(prev[fieldName] || [])];
            arr.splice(index, 1);
            return { ...prev, [fieldName]: arr };
        });
    };

    if (loading) return <div className="text-center py-8">Loading content...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white capitalize">Edit {page} Page</h2>
                <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50">
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* HOME PAGE */}
            {page === "home" && (
                <div className="space-y-6">
                    <div className={sectionClass}>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Hero Section</h3>
                        <div className="space-y-4">
                            <div><label className={labelClass}>Badge Text</label><input type="text" value={content?.heroBadge || ""} onChange={(e) => handleFieldChange("heroBadge", e.target.value)} className={inputClass} /></div>
                            <div><label className={labelClass}>Heading Line 1</label><input type="text" value={content?.heroHeading1 || ""} onChange={(e) => handleFieldChange("heroHeading1", e.target.value)} className={inputClass} /></div>
                            <div><label className={labelClass}>Heading Line 2 (Gradient)</label><input type="text" value={content?.heroHeading2 || ""} onChange={(e) => handleFieldChange("heroHeading2", e.target.value)} className={inputClass} /></div>
                            <div><label className={labelClass}>Subheading</label><textarea value={content?.heroSubheading || ""} onChange={(e) => handleFieldChange("heroSubheading", e.target.value)} className={textareaClass} rows={3} /></div>
                        </div>
                    </div>
                
                    <div className={sectionClass}>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Highlight Stats</h3>
                        {(content?.stats || []).map((s: any, idx: number) => (
                            <div key={idx} className="flex gap-2 mb-3 items-start">
                                <div className="flex-1 grid grid-cols-3 gap-2">
                                    <input type="text" value={s.value} onChange={(e) => { const arr = [...(content.stats || [])]; arr[idx] = { ...arr[idx], value: e.target.value }; handleFieldChange("stats", arr); }} className={inputClass} placeholder="Number (e.g. 70)" />
                                    <input type="text" value={s.suffix} onChange={(e) => { const arr = [...(content.stats || [])]; arr[idx] = { ...arr[idx], suffix: e.target.value }; handleFieldChange("stats", arr); }} className={inputClass} placeholder="Suffix (e.g. +)" />
                                    <input type="text" value={s.label} onChange={(e) => { const arr = [...(content.stats || [])]; arr[idx] = { ...arr[idx], label: e.target.value }; handleFieldChange("stats", arr); }} className={inputClass} placeholder="Label" />
                                </div>
                                <button onClick={() => handleArrayItemRemove("stats", idx)} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">✕</button>
                            </div>
                        ))}
                    </div>

                    <div className={sectionClass}>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Why Choose Us</h3>
                        <div className="space-y-4 mb-6">
                            <div><label className={labelClass}>Heading 1</label><input type="text" value={content?.whyChooseHeading1 || ""} onChange={(e) => handleFieldChange("whyChooseHeading1", e.target.value)} className={inputClass} /></div>
                            <div><label className={labelClass}>Heading 2 (Gradient)</label><input type="text" value={content?.whyChooseHeading2 || ""} onChange={(e) => handleFieldChange("whyChooseHeading2", e.target.value)} className={inputClass} /></div>
                            <div><label className={labelClass}>Description</label><textarea value={content?.whyChooseDescription || ""} onChange={(e) => handleFieldChange("whyChooseDescription", e.target.value)} className={textareaClass} rows={3} /></div>
                        </div>
                        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Benefit Items</h4>
                        {(content?.whyChooseItems || []).map((v: any, idx: number) => (
                            <div key={idx} className="flex gap-2 mb-3 items-start">
                                <div className="flex-1 space-y-2">
                                    <input type="text" value={v.title} onChange={(e) => { const arr = [...(content.whyChooseItems || [])]; arr[idx] = { ...arr[idx], title: e.target.value }; handleFieldChange("whyChooseItems", arr); }} className={inputClass} placeholder="Title" />
                                    <input type="text" value={v.description} onChange={(e) => { const arr = [...(content.whyChooseItems || [])]; arr[idx] = { ...arr[idx], description: e.target.value }; handleFieldChange("whyChooseItems", arr); }} className={inputClass} placeholder="Description" />
                                </div>
                                <button onClick={() => handleArrayItemRemove("whyChooseItems", idx)} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm mt-0">✕</button>
                            </div>
                        ))}
                    </div>

                    <div className={sectionClass}>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Services Banner</h3>
                        <div className="space-y-4 mb-6">
                            <div><label className={labelClass}>Badge</label><input type="text" value={content?.servicesBadge || ""} onChange={(e) => handleFieldChange("servicesBadge", e.target.value)} className={inputClass} /></div>
                            <div><label className={labelClass}>Heading</label><input type="text" value={content?.servicesHeading || ""} onChange={(e) => handleFieldChange("servicesHeading", e.target.value)} className={inputClass} /></div>
                            <div><label className={labelClass}>Description</label><textarea value={content?.servicesDesc || ""} onChange={(e) => handleFieldChange("servicesDesc", e.target.value)} className={textareaClass} rows={2} /></div>
                        </div>
                        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Featured Services</h4>
                        {(content?.servicesHighlight || []).map((v: any, idx: number) => (
                            <div key={idx} className="flex gap-2 mb-3 items-start border-l-4 border-sky-500 pl-4 py-2">
                                <div className="flex-1 space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <input type="text" value={v.title} onChange={(e) => { const arr = [...(content.servicesHighlight || [])]; arr[idx] = { ...arr[idx], title: e.target.value }; handleFieldChange("servicesHighlight", arr); }} className={inputClass} placeholder="Title" />
                                        <input type="text" value={v.iconType} onChange={(e) => { const arr = [...(content.servicesHighlight || [])]; arr[idx] = { ...arr[idx], iconType: e.target.value }; handleFieldChange("servicesHighlight", arr); }} className={inputClass} placeholder="Icon Name (medicine, pediatrics...)" />
                                    </div>
                                    <input type="text" value={v.description} onChange={(e) => { const arr = [...(content.servicesHighlight || [])]; arr[idx] = { ...arr[idx], description: e.target.value }; handleFieldChange("servicesHighlight", arr); }} className={inputClass} placeholder="Description" />
                                </div>
                                <button onClick={() => handleArrayItemRemove("servicesHighlight", idx)} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm mt-0">✕</button>
                            </div>
                        ))}
                        <button onClick={() => handleArrayItemAdd("servicesHighlight", { title: "New Service", description: "Desc", iconType: "medicine", gradient: "from-blue-500 to-blue-700", link: "/services" })} className="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm rounded-lg">+ Add Featured Service</button>
                    </div>
                </div>
            )}

            {/* ABOUT PAGE */}
            {page === "about" && (
                <div className="space-y-6">
                    <div className={sectionClass}>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Heritage Statement</h3>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Title</label>
                                <input type="text" value={content?.heritageTitle || ""} onChange={(e) => handleFieldChange("heritageTitle", e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Description</label>
                                <textarea value={content?.heritageDesc || ""} onChange={(e) => handleFieldChange("heritageDesc", e.target.value)} className={textareaClass} rows={3} />
                            </div>
                        </div>
                    </div>
                    <div className={sectionClass}>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Patient-Centered Box</h3>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Title</label>
                                <input type="text" value={content?.patientCenteredTitle || ""} onChange={(e) => handleFieldChange("patientCenteredTitle", e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Text</label>
                                <textarea value={content?.patientCenteredText || ""} onChange={(e) => handleFieldChange("patientCenteredText", e.target.value)} className={textareaClass} rows={3} />
                            </div>
                        </div>
                    </div>
                    <div className={sectionClass}>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Our Commitment Items</h3>
                        {(content?.commitmentItems || []).map((item: string, idx: number) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <input type="text" value={item} onChange={(e) => handleArrayItemChange("commitmentItems", idx, e.target.value)} className={inputClass} />
                                <button onClick={() => handleArrayItemRemove("commitmentItems", idx)} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">✕</button>
                            </div>
                        ))}
                        <button onClick={() => handleArrayItemAdd("commitmentItems", "New commitment item")} className="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm rounded-lg">+ Add Item</button>
                    </div>
                    <div className={sectionClass}>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Tagline</h3>
                        <input type="text" value={content?.tagline || ""} onChange={(e) => handleFieldChange("tagline", e.target.value)} className={inputClass} />
                    </div>
                    <div className={sectionClass}>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Mission & Vision</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Mission</label>
                                <textarea value={content?.missionText || ""} onChange={(e) => handleFieldChange("missionText", e.target.value)} className={textareaClass} rows={5} />
                            </div>
                            <div>
                                <label className={labelClass}>Vision</label>
                                <textarea value={content?.visionText || ""} onChange={(e) => handleFieldChange("visionText", e.target.value)} className={textareaClass} rows={5} />
                            </div>
                        </div>
                    </div>
                    <div className={sectionClass}>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Core Values</h3>
                        {(content?.coreValues || []).map((v: { name: string; desc: string }, idx: number) => (
                            <div key={idx} className="flex gap-2 mb-3 items-start">
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                    <input type="text" value={v.name} onChange={(e) => { const arr = [...(content.coreValues || [])]; arr[idx] = { ...arr[idx], name: e.target.value }; handleFieldChange("coreValues", arr); }} className={inputClass} placeholder="Value name" />
                                    <input type="text" value={v.desc} onChange={(e) => { const arr = [...(content.coreValues || [])]; arr[idx] = { ...arr[idx], desc: e.target.value }; handleFieldChange("coreValues", arr); }} className={inputClass} placeholder="Description" />
                                </div>
                                <button onClick={() => handleArrayItemRemove("coreValues", idx)} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm mt-0">✕</button>
                            </div>
                        ))}
                        <button onClick={() => handleArrayItemAdd("coreValues", { name: "New Value", desc: "Description" })} className="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm rounded-lg">+ Add Core Value</button>
                    </div>
                    <div className={sectionClass}>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Accredited Partners</h3>
                        {(content?.accreditedPartners || []).map((p: string, idx: number) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <input type="text" value={p} onChange={(e) => handleArrayItemChange("accreditedPartners", idx, e.target.value)} className={inputClass} />
                                <button onClick={() => handleArrayItemRemove("accreditedPartners", idx)} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">✕</button>
                            </div>
                        ))}
                        <button onClick={() => handleArrayItemAdd("accreditedPartners", "New Partner")} className="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm rounded-lg">+ Add Partner</button>
                    </div>
                    <div className={sectionClass}>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Accredited HMOs</h3>
                        {(content?.hmos || []).map((hmo: { name: string; initials: string; color: string; logo: string }, idx: number) => (
                            <div key={idx} className="flex gap-2 mb-3 items-start border-l-4 border-blue-500 pl-4 py-2 bg-white dark:bg-gray-800 rounded-lg">
                                <div className="flex-1 space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div><label className="text-xs text-gray-500 block mb-1">Company Name</label><input type="text" value={hmo.name} onChange={(e) => { const arr = [...(content.hmos || [])]; arr[idx] = { ...arr[idx], name: e.target.value }; handleFieldChange("hmos", arr); }} className={inputClass} /></div>
                                        <div><label className="text-xs text-gray-500 block mb-1">Initials</label><input type="text" value={hmo.initials} onChange={(e) => { const arr = [...(content.hmos || [])]; arr[idx] = { ...arr[idx], initials: e.target.value }; handleFieldChange("hmos", arr); }} className={inputClass} /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div><label className="text-xs text-gray-500 block mb-1">Logo URL (optional)</label><input type="text" value={hmo.logo || ""} onChange={(e) => { const arr = [...(content.hmos || [])]; arr[idx] = { ...arr[idx], logo: e.target.value }; handleFieldChange("hmos", arr); }} className={inputClass} placeholder="/hmo/logo.png" /></div>
                                        <div><label className="text-xs text-gray-500 block mb-1">Fallback Gradient</label><input type="text" value={hmo.color} onChange={(e) => { const arr = [...(content.hmos || [])]; arr[idx] = { ...arr[idx], color: e.target.value }; handleFieldChange("hmos", arr); }} className={inputClass} /></div>
                                    </div>
                                </div>
                                <button onClick={() => handleArrayItemRemove("hmos", idx)} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm mt-5">✕</button>
                            </div>
                        ))}
                        <button onClick={() => handleArrayItemAdd("hmos", { name: "New HMO", initials: "NH", color: "from-blue-500 to-blue-700", logo: "" })} className="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm rounded-lg">+ Add HMO</button>
                    </div>
                </div>
            )}

            {/* EMERGENCY PAGE */}
            {page === "emergency" && (
                <div className="space-y-6">
                    <div className={sectionClass}>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Emergency Section Content</h3>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Headline</label>
                                <input type="text" value={content?.headline || ""} onChange={(e) => handleFieldChange("headline", e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Description</label>
                                <textarea value={content?.description || ""} onChange={(e) => handleFieldChange("description", e.target.value)} className={textareaClass} rows={3} />
                            </div>
                            <div>
                                <label className={labelClass}>Emergency Hotline Number</label>
                                <input type="text" value={content?.hotline || ""} onChange={(e) => handleFieldChange("hotline", e.target.value)} className={inputClass} placeholder="911" />
                            </div>
                        </div>
                    </div>
                    <div className={sectionClass}>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">"Why Choose Us" Items</h3>
                        {(content?.whyChooseItems || []).map((item: string, idx: number) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <input type="text" value={item} onChange={(e) => handleArrayItemChange("whyChooseItems", idx, e.target.value)} className={inputClass} />
                                <button onClick={() => handleArrayItemRemove("whyChooseItems", idx)} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">✕</button>
                            </div>
                        ))}
                        <button onClick={() => handleArrayItemAdd("whyChooseItems", "New benefit item")} className="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm rounded-lg">+ Add Item</button>
                    </div>
                </div>
            )}

            {/* CTA BANNER PAGE */}
            {page === "cta" && (
                <div className="space-y-6">
                    <div className={sectionClass}>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">CTA Banner Content</h3>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Heading</label>
                                <input type="text" value={content?.heading || ""} onChange={(e) => handleFieldChange("heading", e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Description</label>
                                <textarea value={content?.description || ""} onChange={(e) => handleFieldChange("description", e.target.value)} className={textareaClass} rows={3} />
                            </div>
                            <div>
                                <label className={labelClass}>Emergency Note (bottom text)</label>
                                <input type="text" value={content?.emergencyNote || ""} onChange={(e) => handleFieldChange("emergencyNote", e.target.value)} className={inputClass} />
                            </div>
                        </div>
                    </div>
                    <div className={sectionClass}>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Feature Bullet Points</h3>
                        {(content?.features || []).map((item: string, idx: number) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <input type="text" value={item} onChange={(e) => handleArrayItemChange("features", idx, e.target.value)} className={inputClass} />
                                <button onClick={() => handleArrayItemRemove("features", idx)} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">✕</button>
                            </div>
                        ))}
                        <button onClick={() => handleArrayItemAdd("features", "✓ New feature")} className="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm rounded-lg">+ Add Feature</button>
                    </div>
                    <div className={sectionClass}>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Buttons</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className={labelClass}>Primary Button Text</label>
                                <input type="text" value={content?.primaryButtonText || ""} onChange={(e) => handleFieldChange("primaryButtonText", e.target.value)} className={inputClass} />
                                <label className={labelClass}>Primary Button Link</label>
                                <input type="text" value={content?.primaryButtonHref || ""} onChange={(e) => handleFieldChange("primaryButtonHref", e.target.value)} className={inputClass} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelClass}>Secondary Button Text</label>
                                <input type="text" value={content?.secondaryButtonText || ""} onChange={(e) => handleFieldChange("secondaryButtonText", e.target.value)} className={inputClass} />
                                <label className={labelClass}>Secondary Button Link</label>
                                <input type="text" value={content?.secondaryButtonHref || ""} onChange={(e) => handleFieldChange("secondaryButtonHref", e.target.value)} className={inputClass} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CONTACT / FOOTER PAGE */}
            {page === "contact" && (
                <div className="space-y-6">
                    <div className={sectionClass}>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Contact Information</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This updates both the top header bar and the footer contact section.</p>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Phone Number</label>
                                <input type="text" value={content?.phone || ""} onChange={(e) => handleFieldChange("phone", e.target.value)} className={inputClass} placeholder="(+32) 253-1901" />
                            </div>
                            <div>
                                <label className={labelClass}>Operator / Mobile Numbers</label>
                                <input type="text" value={content?.operator || ""} onChange={(e) => handleFieldChange("operator", e.target.value)} className={inputClass} placeholder="0977-321-2615 | 0970-369-5188" />
                            </div>
                            <div>
                                <label className={labelClass}>Email Address</label>
                                <input type="email" value={content?.email || ""} onChange={(e) => handleFieldChange("email", e.target.value)} className={inputClass} placeholder="Info@visayasmed.com.ph" />
                            </div>
                            <div>
                                <label className={labelClass}>Physical Address</label>
                                <input type="text" value={content?.address || ""} onChange={(e) => handleFieldChange("address", e.target.value)} className={inputClass} placeholder="VisayasMed Hospital, Cebu, Philippines" />
                            </div>
                            <div>
                                <label className={labelClass}>Google Maps Embed URL</label>
                                <textarea value={content?.mapEmbedUrl || ""} onChange={(e) => handleFieldChange("mapEmbedUrl", e.target.value)} className={textareaClass} rows={3} placeholder="https://www.google.com/maps/embed?pb=..." />
                            </div>
                            <div>
                                <label className={labelClass}>Copyright Text (footer bottom)</label>
                                <input type="text" value={content?.copyright || ""} onChange={(e) => handleFieldChange("copyright", e.target.value)} className={inputClass} placeholder="© 2026 VisayasMed Hospital. All rights reserved." />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentEditor;
