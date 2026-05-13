import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsService } from '../utils/dataService';
import Navbar from './Navbar';
import Footer from './Footer';

interface NewsItem {
    id: string;
    title: string;
    description: string;
    content?: string;
    image: string;
    date: string;
}

const NewsDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const items = await newsService.getNews();
                const found = items.find((item: any) => item.id === id);
                setArticle((found as any) || null);
            } catch (error) {
                console.error("Failed to load article", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center pt-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center pt-24 text-center px-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">Article Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">The news or event you are looking for does not exist.</p>
                    <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors">
                        Return Home
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col font-sans">
            <Navbar />
            
            <main className="flex-1 pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-8">
                        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            Back to Home
                        </Link>
                    </div>

                    {/* Article Header */}
                    <header className="mb-10">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-blue-900 dark:text-white leading-tight mb-4">
                            {article.title}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 font-medium">
                            {article.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {article.date}
                        </div>
                    </header>

                    {/* Hero Image */}
                    {article.image && (
                        <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-xl border border-gray-100 dark:border-gray-800">
                            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Article Content */}
                    <article className="prose prose-lg prose-blue dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                        {article.content ? (
                            <div className="whitespace-pre-wrap leading-relaxed">
                                {article.content}
                            </div>
                        ) : (
                            <p className="italic text-gray-500">No additional content available for this article.</p>
                        )}
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default NewsDetailPage;
