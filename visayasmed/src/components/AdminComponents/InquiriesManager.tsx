import React, { useState, useEffect } from 'react';
import { inquiriesService } from '../../utils/dataService';

interface Inquiry {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'unread' | 'replied' | 'archived';
    createdAt: any;
}

const InquiriesManager: React.FC = () => {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread' | 'replied' | 'archived'>('all');

    useEffect(() => {
        loadInquiries();
    }, []);

    const loadInquiries = async () => {
        setLoading(true);
        try {
            const data = await inquiriesService.getInquiries();
            setInquiries(data as Inquiry[]);
        } catch (error) {
            console.error("Failed to load inquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: 'unread' | 'replied' | 'archived') => {
        try {
            await inquiriesService.updateInquiryStatus(id, status);
            setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const filteredInquiries = inquiries.filter(i => filter === 'all' || i.status === filter);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'unread': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">🔵 Unread</span>;
            case 'replied': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">🟢 Replied</span>;
            case 'archived': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">⚫ Archived</span>;
            default: return null;
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Inquiries Management</h2>
                <div className="flex gap-2">
                    {['all', 'unread', 'replied', 'archived'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                    <button onClick={loadInquiries} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="Refresh">
                        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
            ) : filteredInquiries.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                    <p className="text-gray-500 dark:text-gray-400">No {filter !== 'all' ? filter : ''} inquiries found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredInquiries.map(inquiry => (
                        <div key={inquiry.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{inquiry.subject}</h3>
                                        {getStatusBadge(inquiry.status)}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        From: <span className="font-semibold text-gray-700 dark:text-gray-300">{inquiry.name}</span> ({inquiry.email})
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{formatDate(inquiry.createdAt)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select 
                                        value={inquiry.status}
                                        onChange={(e) => handleUpdateStatus(inquiry.id, e.target.value as any)}
                                        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="unread">Mark Unread</option>
                                        <option value="replied">Mark Replied</option>
                                        <option value="archived">Archive</option>
                                    </select>
                                    <a 
                                        href={`mailto:${inquiry.email}?subject=Re: ${inquiry.subject}`}
                                        className="px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Reply via Email
                                    </a>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{inquiry.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InquiriesManager;
