import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { blogApi } from '../api/blog';
import { useAuth } from '../contexts/AuthContext';
import {
    ArrowRight, Bookmark,
    Search, Clock,
    ChevronLeft, ChevronRight,
    Activity, Video, Mic, FileText, MessageSquare, Heart, Eye, Filter,
    Plus
} from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../utils';

const Blog = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAr = i18n.language === 'ar';
    const isAdmin = user?.roles?.includes('Admin');
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [selectedType, setSelectedType] = useState<string>('all');
    const pageSize = 9;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5027/api';
    const BASE_URL = API_URL.replace('/api', '');

    const { data: categories } = useQuery({
        queryKey: ['blog-categories'],
        queryFn: blogApi.getCategories,
    });

    const { data: blogData, isLoading } = useQuery({
        queryKey: ['blog-posts', page, selectedCategory, search],
        queryFn: () => blogApi.getPosts(page, pageSize, selectedCategory, search),
    });

    const getFullImageUrl = (url: string) => {
        if (!url) return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200';
        if (url.startsWith('http')) return url;
        return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const postTypes = [
        { id: 'all', label: isAr ? 'الكل' : 'All', icon: <Filter size={14} /> },
        { id: 'text', label: isAr ? 'مقالات' : 'Articles', icon: <FileText size={14} /> },
        { id: 'video', label: isAr ? 'فيديو' : 'Videos', icon: <Video size={14} /> },
        { id: 'audio', label: isAr ? 'صوت' : 'Audio', icon: <Mic size={14} /> },
        { id: 'short', label: isAr ? 'منشورات' : 'Shorts', icon: <MessageSquare size={14} /> },
    ];

    // Frontend filtering by type for now
    const filteredPosts = useMemo(() => {
        let items = blogData?.posts || [];
        if (selectedType !== 'all') {
            items = items.filter(p => (p as any).postType === selectedType);
        }
        return items;
    }, [blogData, selectedType]);

    if (isLoading) {
        return (
            <div className="relative min-h-screen pt-40 pb-32 overflow-hidden bg-background">
                <div className="container-max">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Skeleton key={i} className="h-[450px] rounded-[2rem]" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const totalCount = blogData?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="relative min-h-screen pt-40 pb-32 overflow-hidden bg-background">
            <div className="absolute top-0 inset-x-0 h-[800px] bg-gradient-to-b from-primary/5 via-background to-transparent -z-10" />

            <div className="container-max px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <div className="flex flex-col items-center gap-6 mb-8">
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 mx-auto">
                            <Activity size={14} className="text-primary" />
                            <span className="text-primary font-bold text-sm tracking-tight capitalize">
                                {isAr ? 'منصة المعرفة' : 'Knowledge Platform'}
                            </span>
                        </div>

                        {isAdmin && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/admin/blog', { state: { openCreateModal: true } })}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-black text-xs shadow-xl shadow-primary/20 border border-primary/30 hover:brightness-110 transition-all font-outfit"
                            >
                                <Plus size={16} />
                                {isAr ? 'منشور جديد' : 'New Post'}
                            </motion.button>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-12 tracking-tighter text-foreground leading-[1.1]">
                        {t('blog.title')}
                    </h1>

                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* Search & Main Filter */}
                        <div className="flex flex-col lg:flex-row items-center gap-6">
                            <div className="relative flex-1 group w-full">
                                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder={isAr ? "ابحث عن المعرفة..." : "Search for knowledge..."}
                                    className="w-full pl-20 pr-10 py-6 rounded-3xl bg-muted/40 border border-border focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all font-bold outline-none"
                                    value={search}
                                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                                />
                            </div>
                        </div>

                        {/* Social-style Type Filters */}
                        <div className="flex flex-wrap justify-center items-center gap-3">
                            {postTypes.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={cn(
                                        "px-6 py-3 rounded-2xl text-[12px] font-black transition-all flex items-center gap-2 border font-outfit",
                                        selectedType === type.id
                                            ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105"
                                            : "bg-muted/50 text-muted-foreground border-transparent hover:border-primary/30"
                                    )}
                                >
                                    {type.icon}
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        {/* Category Tags */}
                        <div className="flex flex-wrap justify-center items-center gap-4 pb-12">
                            <div className="flex items-center gap-2 text-muted-foreground mr-2 border-r border-border/50 pr-4">
                                <Filter size={14} />
                                <span className="text-[10px] font-black">{isAr ? "تصنيف حسب:" : "Filter by:"}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => { setSelectedCategory(undefined); setPage(1); }}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-[10px] font-bold transition-all border",
                                        !selectedCategory ? "bg-foreground text-background border-foreground" : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted"
                                    )}
                                >
                                    # {t('common.all')}
                                </button>
                                {categories?.map((cat: any) => (
                                    <button
                                        key={cat.slug}
                                        onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-[10px] font-bold transition-all border",
                                            selectedCategory === cat.slug ? "bg-foreground text-background border-foreground" : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted"
                                        )}
                                    >
                                        # {isAr ? cat.nameAr : cat.nameEn}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Social Grid */}
                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredPosts.map((post, idx) => (
                                <motion.article
                                    key={post.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group relative flex flex-col h-full bg-card rounded-[2.5rem] border border-border/50 overflow-hidden hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/5"
                                >
                                    {/* Post Media Area */}
                                    <Link to={`/blog/${post.slug}`} className="block relative aspect-[14/10] overflow-hidden">
                                        <img
                                            src={getFullImageUrl(post.imageUrl)}
                                            alt=""
                                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                        {/* Type Badge */}
                                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                                            <div className="px-4 py-1.5 bg-primary rounded-lg text-[9px] font-black text-white flex items-center gap-1.5 font-outfit">
                                                {post.postType === 'video' ? <Video size={10} /> : post.postType === 'audio' ? <Mic size={10} /> : <FileText size={10} />}
                                                {isAr ? (post.postType === 'video' ? 'فيديو' : post.postType === 'audio' ? 'صوت' : 'مقال') : (post.postType.charAt(0).toUpperCase() + post.postType.slice(1).toLowerCase())}
                                            </div>
                                            <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-lg text-[9px] font-black text-white border border-white/10 font-outfit">
                                                {isAr ? post.categoryNameAr : (post.categoryNameEn ? (post.categoryNameEn.charAt(0).toUpperCase() + post.categoryNameEn.slice(1).toLowerCase()) : '')}
                                            </div>
                                        </div>

                                        {/* Quick Stats Overlay */}
                                        <div className="absolute bottom-6 right-6 flex items-center gap-4 text-white">
                                            <div className="flex items-center gap-1.5 text-[10px] font-black">
                                                <Eye size={14} className="opacity-60" /> {post.viewCount}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black">
                                                <Heart size={14} className="opacity-60" /> {post.likeCount}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black">
                                                <MessageSquare size={14} className="opacity-60" /> {post.comments?.length || 0}
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Post Content */}
                                    <div className="p-8 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-black text-primary">MT</div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-foreground">Mostafa Tonin</span>
                                                <span className="text-[9px] font-bold text-muted-foreground opacity-60">
                                                    {new Date(post.publishedDate).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>

                                        <Link to={`/blog/${post.slug}`} className="flex-1 group/title">
                                            <h3 className="text-xl md:text-2xl font-black mb-4 leading-[1.2] tracking-tight group-hover/title:text-primary transition-colors line-clamp-2">
                                                {isAr ? post.titleAr : post.titleEn}
                                            </h3>
                                            <p className="text-muted-foreground font-medium text-[13px] leading-relaxed mb-8 line-clamp-3 opacity-80">
                                                {isAr ? post.summaryAr : post.summaryEn}
                                            </p>
                                        </Link>

                                        <div className="pt-6 border-t border-border/50 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Clock size={12} className="text-primary/40" />
                                                <span className="text-[10px] font-black text-muted-foreground">{post.readingTimeInMinutes} {t('blog.reading_time')}</span>
                                            </div>
                                            <Link
                                                to={`/blog/${post.slug}`}
                                                className="flex items-center gap-1 text-[11px] font-black tracking-tight text-primary group/more"
                                            >
                                                {isAr ? 'اقرأ المزيد' : 'Read Full Post'}
                                                <ArrowRight size={14} className={cn("transition-transform group-hover/more:translate-x-1", isAr && "rotate-180 group-hover/more:-translate-x-1")} />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="py-40 text-center bg-muted/20 rounded-[4rem] border border-dashed border-border group">
                        <Bookmark size={80} className="mx-auto text-muted-foreground/20 mb-8 group-hover:scale-110 transition-transform duration-500" />
                        <h3 className="text-2xl font-bold text-muted-foreground">
                            {isAr ? "لم يتم العثور على محتوى" : "No content found"}
                        </h3>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-32 flex items-center justify-center gap-4">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
                        >
                            <ChevronLeft size={24} className={isAr ? "rotate-180" : ""} />
                        </button>
                        <div className="px-8 h-14 flex items-center bg-card border border-border rounded-2xl font-bold text-sm shadow-sm">
                            {page} <span className="mx-2 opacity-30">/</span> {totalPages}
                        </div>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
                        >
                            <ChevronRight size={24} className={isAr ? "rotate-180" : ""} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
