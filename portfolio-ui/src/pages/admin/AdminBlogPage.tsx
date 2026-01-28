import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Edit, Trash2, X, Loader,
    Calendar, Image as ImageIcon,
    Save, Eye, Globe, Layers, BookOpen, Clock, AlertCircle,
    MessageSquare, Video, Mic, FileText, Type
} from 'lucide-react';
import { blogApi } from '../../api/blog';
import { uploadApi } from '../../api/upload';
import toast from 'react-hot-toast';
import { cn } from '../../utils';
import Tooltip from '../../components/ui/Tooltip';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useLocation } from 'react-router-dom';

const AdminBlogPage = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');
    const [postType, setPostType] = useState<'text' | 'video' | 'audio' | 'short'>('text');

    // Markdown Editor State
    const [contentEn, setContentEn] = useState('');
    const [contentAr, setContentAr] = useState('');
    const [activePreview, setActivePreview] = useState<'none' | 'en' | 'ar'>('none');

    // Comments Management State
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    const isRtl = i18n.language.startsWith('ar');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5027/api';
    const BASE_URL = API_URL.replace('/api', '');

    const getFullImageUrl = (url: string | undefined) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const toEmbedYoutube = (url?: string | null) => {
        if (!url) return '';
        const u = url.trim();
        if (!u) return '';
        if (u.includes('youtube.com/embed/')) return u;
        const vMatch = u.match(/[?&]v=([^&]+)/);
        if (vMatch && vMatch[1]) return `https://www.youtube.com/embed/${vMatch[1]}`;
        const shortMatch = u.match(/youtu\.be\/([^?&/]+)/);
        if (shortMatch && shortMatch[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;
        const shortsMatch = u.match(/youtube\.com\/shorts\/([^?&/]+)/);
        if (shortsMatch && shortsMatch[1]) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
        return u;
    };

    const { data: adminPosts, isLoading } = useQuery({
        queryKey: ['admin-blog-all'],
        queryFn: () => blogApi.getAdminAll(),
    });

    const { data: categories = [] } = useQuery({
        queryKey: ['admin-blog-categories'],
        queryFn: () => blogApi.getAdminCategories(),
    });

    const { data: comments = [], isLoading: isCommentsLoading } = useQuery({
        queryKey: ['admin-comments', selectedPostId],
        queryFn: () => selectedPostId ? blogApi.getAdminComments(selectedPostId) : Promise.resolve([]),
        enabled: !!selectedPostId,
    });

    useEffect(() => {
        if (editingPost) {
            setContentEn(editingPost.contentEn || '');
            setContentAr(editingPost.contentAr || '');
            setPostType(editingPost.postType || 'text');
            setCurrentImageUrl(editingPost.imageUrl || '');
        } else {
            setContentEn('');
            setContentAr('');
            setPostType('text');
            setCurrentImageUrl('');
        }
    }, [editingPost, isModalOpen]);

    useEffect(() => {
        if (location.state?.openCreateModal) {
            setEditingPost(null);
            setIsModalOpen(true);
            // Clear state to prevent modal reopening on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleError = (err: any) => {
        console.error('API Error:', err.response?.data);
        const serverErrors = err.response?.data?.errors;
        if (serverErrors) {
            const messages = Object.values(serverErrors).flat().join(' | ');
            toast.error(messages);
        } else {
            toast.error(err.response?.data?.message || t('common.error_create'));
        }
    };

    const createMutation = useMutation({
        mutationFn: (data: any) => blogApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-blog-all'] });
            toast.success(isRtl ? 'تم إضافة المقال بنجاح' : 'Article created successfully');
            setIsModalOpen(false);
        },
        onError: handleError,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => blogApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-blog-all'] });
            toast.success(isRtl ? 'تم تحديث المقال بنجاح' : 'Article updated successfully');
            setIsModalOpen(false);
            setEditingPost(null);
        },
        onError: handleError,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => blogApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-blog-all'] });
            toast.success(isRtl ? 'تم حذف المقال' : 'Article deleted');
        },
        onError: handleError,
    });

    const approveCommentMutation = useMutation({
        mutationFn: ({ id, approve }: { id: number, approve: boolean }) => blogApi.approveComment(id, approve),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-comments', selectedPostId] });
            toast.success(isRtl ? 'تم تحديث حالة التعليق' : 'Comment status updated');
        }
    });

    const deleteCommentMutation = useMutation({
        mutationFn: (id: number) => blogApi.deleteComment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-comments', selectedPostId] });
            toast.success(isRtl ? 'تم حذف التعليق' : 'Comment deleted');
        }
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const imageUrl = await uploadApi.uploadImage(file);
            toast.success(isRtl ? 'تم رفع الصورة' : 'Image uploaded');
            setCurrentImageUrl(imageUrl);
        } catch (error) {
            toast.error(t('common.error_upload'));
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const catId = parseInt(formData.get('CategoryId') as string);
        if (!catId || catId <= 0) {
            toast.error(isRtl ? 'يرجى اختيار تصنيف صالح' : 'Please select a valid category');
            return;
        }

        const rawVideo = formData.get('VideoUrl') as string;
        const data = {
            TitleEn: formData.get('TitleEn') as string,
            TitleAr: formData.get('TitleAr') as string,
            SummaryEn: formData.get('SummaryEn') as string,
            SummaryAr: formData.get('SummaryAr') as string,
            ContentEn: contentEn,
            ContentAr: contentAr,
            Slug: formData.get('Slug') as string,
            ImageUrl: currentImageUrl,
            VideoUrl: toEmbedYoutube(rawVideo),
            AudioUrl: formData.get('AudioUrl') as string,
            PostType: postType,
            IsPublished: formData.get('IsPublished') === 'on',
            IsDraft: formData.get('IsDraft') === 'on',
            ReadingTimeInMinutes: parseInt(formData.get('ReadingTimeInMinutes') as string) || 5,
            SeoTitleEn: formData.get('SeoTitleEn') as string,
            SeoTitleAr: formData.get('SeoTitleAr') as string,
            SeoDescriptionEn: formData.get('SeoDescriptionEn') as string,
            SeoDescriptionAr: formData.get('SeoDescriptionAr') as string,
            CategoryId: catId,
        };

        if (editingPost) {
            updateMutation.mutate({ id: editingPost.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const insertToMarkdown = (lang: 'en' | 'ar', text: string) => {
        if (lang === 'en') setContentEn(prev => prev + '\n' + text);
        else setContentAr(prev => prev + '\n' + text);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-bold text-sm tracking-widest uppercase opacity-40">{t('common.loading')}</p>
            </div>
        );
    }

    return (
        <div className={`space-y-10 py-6 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">{t('admin.blog_page.title')}</h1>
                    <p className="text-muted-foreground mt-2 font-medium italic opacity-60 tracking-tight">{t('admin.blog_page.subtitle')}</p>
                </div>
                <button
                    onClick={() => {
                        setEditingPost(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-[1.5rem] font-black shadow-2xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all text-sm uppercase tracking-widest"
                >
                    <Plus size={20} />
                    {t('admin.blog_page.add_post')}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {adminPosts?.length === 0 ? (
                    <div className="py-40 border-2 border-dashed border-border rounded-[3rem] text-center space-y-6">
                        <BookOpen size={64} className="mx-auto text-muted-foreground opacity-10" />
                        <h3 className="text-xl font-bold text-muted-foreground tracking-tight">{t('common.no_data')}</h3>
                    </div>
                ) : (
                    adminPosts?.map((post: any) => (
                        <motion.div
                            key={post.id}
                            className="bg-card p-6 rounded-[2.5rem] border border-border/50 flex flex-col md:flex-row gap-8 group hover:border-primary/30 transition-all duration-500"
                        >
                            <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden border border-border flex-shrink-0 relative">
                                <img
                                    src={getFullImageUrl(post.imageUrl)}
                                    alt=""
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {!post.isPublished && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-white tracking-widest whitespace-nowrap">{t('admin.blog_page.draft')}</span>
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary/80 backdrop-blur-md rounded-md text-[8px] font-black text-white uppercase tracking-tighter">
                                    {post.postType || 'text'}
                                </div>
                            </div>
                            <div className="flex-grow flex flex-col justify-center">
                                <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-muted-foreground uppercase mb-3 opacity-60 tracking-widest">
                                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(post.publishedDate).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1.5"><Eye size={12} /> {post.viewCount} views</span>
                                    <span className="flex items-center gap-1.5"><MessageSquare size={12} /> {post.comments?.length || 0}</span>
                                    <span className="bg-primary/10 text-primary px-3 py-0.5 rounded-full text-[9px]">{isRtl ? post.categoryNameAr : post.categoryNameEn}</span>
                                </div>
                                <h3 className="text-2xl font-black mb-1 group-hover:text-primary transition-colors tracking-tight leading-tight">{isRtl ? post.titleAr : post.titleEn}</h3>
                                <p className="text-sm font-medium text-muted-foreground line-clamp-1 italic opacity-60">/{post.slug}</p>
                            </div>
                            <div className="flex items-center gap-3 md:pl-8 md:border-l border-border/50">
                                <button
                                    onClick={() => {
                                        setSelectedPostId(post.id);
                                        setIsCommentsModalOpen(true);
                                    }}
                                    className="p-4 bg-muted hover:bg-primary/10 hover:text-primary rounded-2xl transition-all shadow-sm group/btn"
                                >
                                    <MessageSquare size={20} />
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingPost(post);
                                        setActiveTab('content');
                                        setIsModalOpen(true);
                                    }}
                                    className="p-4 bg-muted hover:bg-primary hover:text-white rounded-2xl transition-all shadow-sm"
                                >
                                    <Edit size={20} />
                                </button>
                                <button
                                    onClick={() => { if (confirm(t('common.confirm_delete'))) deleteMutation.mutate(post.id); }}
                                    className="p-4 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-2xl transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Post Modal (Create/Edit) */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] flex items-center justify-center pt-10 px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            className="bg-card w-full max-w-[95vw] lg:max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden border border-border flex flex-col h-[90vh]"
                        >
                            <div className="p-10 border-b border-border flex items-center justify-between flex-shrink-0 bg-muted/20">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tighter">
                                        {editingPost ? t('admin.blog_page.modal_title_edit') : t('admin.blog_page.modal_title_add')}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1 font-bold uppercase tracking-widest opacity-40">{t('admin.blog_page.modal_subtitle')}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-4 bg-background hover:bg-muted border border-border rounded-2xl transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex border-b border-border/50 px-10 bg-muted/10">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('content')}
                                    className={cn(
                                        "px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] border-b-4 transition-all flex items-center gap-3",
                                        activeTab === 'content' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Layers size={18} /> {t('admin.blog_page.content_tab')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('seo')}
                                    className={cn(
                                        "px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] border-b-4 transition-all flex items-center gap-3",
                                        activeTab === 'seo' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Globe size={18} /> {t('admin.blog_page.seo_tab')}
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                                <div className={cn(activeTab === 'content' ? "space-y-12 block" : "hidden")}>
                                    {/* Type Selection */}
                                    <div className="flex gap-4 p-4 bg-muted/30 rounded-[2rem] border border-border/50">
                                        {[
                                            { id: 'text', icon: <FileText size={16} />, label: 'Article' },
                                            { id: 'video', icon: <Video size={16} />, label: 'Video' },
                                            { id: 'audio', icon: <Mic size={16} />, label: 'Audio' },
                                            { id: 'short', icon: <MessageSquare size={16} />, label: 'Short' }
                                        ].map(type => (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => setPostType(type.id as any)}
                                                className={cn(
                                                    "flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                                                    postType === type.id ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" : "hover:bg-muted"
                                                )}
                                            >
                                                {type.icon} {type.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('admin.blog_page.post_title_en')}</label>
                                            <input type="text" name="TitleEn" defaultValue={editingPost?.titleEn} required className="w-full px-6 py-4 rounded-2xl bg-background border-2 border-border focus:border-primary outline-none font-black text-lg transition-all" />
                                        </div>
                                        <div className="space-y-4 text-right">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mr-1">{t('admin.blog_page.post_title_ar')}</label>
                                            <input type="text" name="TitleAr" defaultValue={editingPost?.titleAr} required className="w-full px-6 py-4 rounded-2xl bg-background border-2 border-border focus:border-primary outline-none text-right font-black text-lg transition-all" dir="rtl" />
                                        </div>
                                    </div>

                                    {/* Summary Fields (Newly Added) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <Tooltip content={t('admin.blog_page.tooltip_summary') || "Short summary for card view"} side="top">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2 cursor-help">
                                                    {t('admin.blog_page.summary_en')} <AlertCircle size={10} />
                                                </label>
                                            </Tooltip>
                                            <textarea name="SummaryEn" defaultValue={editingPost?.summaryEn} required rows={3} className="w-full px-6 py-4 rounded-2xl bg-background border-2 border-border focus:border-primary outline-none font-medium text-sm transition-all resize-none" />
                                        </div>
                                        <div className="space-y-4 text-right">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mr-1">{t('admin.blog_page.summary_ar')}</label>
                                            <textarea name="SummaryAr" defaultValue={editingPost?.summaryAr} required rows={3} className="w-full px-6 py-4 rounded-2xl bg-background border-2 border-border focus:border-primary outline-none text-right font-medium text-sm transition-all resize-none" dir="rtl" />
                                        </div>
                                    </div>

                                    {/* Markdown Editor Sections */}
                                    <div className="space-y-10">
                                        {/* English Markdown */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t('admin.blog_page.content_markdown_en')}</label>
                                                <div className="flex items-center gap-2">
                                                    <button type="button" onClick={() => insertToMarkdown('en', '## Header')} className="p-2 bg-muted rounded-lg hover:bg-primary/10"><Type size={14} /></button>
                                                    <button type="button" onClick={() => insertToMarkdown('en', '![Alt Text](url)')} className="p-2 bg-muted rounded-lg hover:bg-primary/10"><ImageIcon size={14} /></button>
                                                    <button type="button" onClick={() => setActivePreview(activePreview === 'en' ? 'none' : 'en')} className={cn("px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest", activePreview === 'en' ? "bg-primary text-white" : "bg-muted")}>Preview</button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                                                <textarea
                                                    value={contentEn}
                                                    onChange={e => setContentEn(e.target.value)}
                                                    className="w-full h-full p-6 rounded-[2rem] bg-muted/30 border-2 border-border focus:border-primary outline-none font-mono text-sm resize-none"
                                                    placeholder="Write your markdown here..."
                                                />
                                                <div className={cn("h-full p-6 rounded-[2rem] border-2 border-dashed border-border overflow-y-auto bg-card prose prose-sm dark:prose-invert", activePreview !== 'en' && "opacity-20 pointer-events-none")}>
                                                    {activePreview === 'en' ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentEn}</ReactMarkdown> : <div className="flex items-center justify-center h-full text-xs font-bold uppercase opacity-30">EN Preview Off</div>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Arabic Markdown */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t('admin.blog_page.content_markdown_ar')}</label>
                                                <div className="flex items-center gap-2">
                                                    <button type="button" onClick={() => setActivePreview(activePreview === 'ar' ? 'none' : 'ar')} className={cn("px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest", activePreview === 'ar' ? "bg-primary text-white" : "bg-muted")}>معاينة</button>
                                                    <button type="button" onClick={() => insertToMarkdown('ar', '![Alt Text](url)')} className="p-2 bg-muted rounded-lg hover:bg-primary/10"><ImageIcon size={14} /></button>
                                                    <button type="button" onClick={() => insertToMarkdown('ar', '## عنوان')} className="p-2 bg-muted rounded-lg hover:bg-primary/10"><Type size={14} /></button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                                                <div className={cn("h-full p-6 rounded-[2rem] border-2 border-dashed border-border overflow-y-auto bg-card prose prose-sm dark:prose-invert text-right", activePreview !== 'ar' && "opacity-20 pointer-events-none")} dir="rtl">
                                                    {activePreview === 'ar' ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentAr}</ReactMarkdown> : <div className="flex items-center justify-center h-full text-xs font-bold uppercase opacity-30">AR Preview Off</div>}
                                                </div>
                                                <textarea
                                                    value={contentAr}
                                                    onChange={e => setContentAr(e.target.value)}
                                                    className="w-full h-full p-6 rounded-[2rem] bg-muted/30 border-2 border-border focus:border-primary outline-none font-black text-lg resize-none text-right"
                                                    placeholder="اكتب المحتوى هنا..."
                                                    dir="rtl"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-10 border-t border-border/50">
                                        <div className="space-y-4 md:col-span-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('admin.blog_page.featured_image')}</label>
                                            <div className="flex items-center gap-6">
                                                <div className="w-24 h-24 rounded-3xl bg-muted border border-border flex items-center justify-center overflow-hidden shadow-inner flex-shrink-0">
                                                    {currentImageUrl ? <img src={getFullImageUrl(currentImageUrl)} alt="" className="max-w-full max-h-full object-cover" /> : <ImageIcon className="text-muted-foreground/30" size={24} />}
                                                </div>
                                                <label className="flex-grow flex flex-col items-center justify-center py-6 border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-[1.5rem] cursor-pointer transition-all">
                                                    {uploading ? <Loader className="animate-spin text-primary" /> : <Plus size={20} />}
                                                    <span className="mt-2 text-[10px] font-black uppercase tracking-widest">{t('admin.blog_page.upload_thumbnail')}</span>
                                                    <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('admin.blog_page.category')}</label>
                                            <select name="CategoryId" defaultValue={editingPost?.categoryId} className="w-full px-6 py-4 rounded-xl bg-background border-2 border-border outline-none font-black text-sm transition-all cursor-pointer">
                                                <option value="0">{t('admin.blog_page.select_category')}</option>
                                                {categories?.map((c: any) => <option key={c.id} value={c.id}>{isRtl ? c.nameAr : c.nameEn}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('admin.blog_page.reading_time')}</label>
                                            <div className="relative">
                                                <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={16} />
                                                <input type="number" name="ReadingTimeInMinutes" defaultValue={editingPost?.readingTimeInMinutes || 5} className="w-full pl-12 pr-6 py-4 rounded-xl bg-background border-2 border-border outline-none font-black text-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Media URLs */}
                                    {(postType === 'video' || postType === 'audio') && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-border/50">
                                            {postType === 'video' && (
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('admin.blog_page.video_url')}</label>
                                                    <input type="text" name="VideoUrl" defaultValue={editingPost?.videoUrl} placeholder="https://youtube.com/embed/..." className="w-full px-6 py-4 rounded-xl bg-background border-border border-2 outline-none font-bold" />
                                                </div>
                                            )}
                                            {postType === 'audio' && (
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('admin.blog_page.audio_url')}</label>
                                                    <input type="text" name="AudioUrl" defaultValue={editingPost?.audioUrl} placeholder="https://example.com/audio.mp3" className="w-full px-6 py-4 rounded-xl bg-background border-border border-2 outline-none font-bold" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className={cn(activeTab === 'seo' ? "space-y-12 block" : "hidden")}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-4">
                                            <Tooltip content={t('admin.blog_page.tooltip_slug') || "URL friendly name"} side="top">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2 cursor-help">
                                                    {t('admin.blog_page.slug_label')} <AlertCircle size={10} />
                                                </label>
                                            </Tooltip>
                                            <input type="text" name="Slug" defaultValue={editingPost?.slug} placeholder="hyphenated-url-path" className="w-full px-6 py-4 rounded-xl bg-background border-2 border-border outline-none font-mono text-primary font-black text-sm tracking-tight" />
                                        </div>
                                        <label className="flex items-center gap-6 p-8 bg-muted/20 rounded-[2rem] border border-border cursor-pointer self-end group hover:bg-muted/40 transition-colors">
                                            <input type="checkbox" name="IsPublished" defaultChecked={editingPost?.isPublished ?? true} className="w-8 h-8 rounded-xl cursor-pointer accent-primary" />
                                            <div>
                                                <h5 className="text-lg font-black leading-none mb-1">{t('admin.blog_page.make_visible')}</h5>
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{t('admin.blog_page.make_visible_desc')}</p>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('admin.blog_page.seo_title_en')}</label>
                                            <input type="text" name="SeoTitleEn" defaultValue={editingPost?.seoTitleEn} className="w-full px-6 py-4 rounded-xl bg-background border-2 border-border outline-none font-bold" />
                                        </div>
                                        <div className="space-y-4 text-right">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mr-1">{t('admin.blog_page.seo_title_ar')}</label>
                                            <input type="text" name="SeoTitleAr" defaultValue={editingPost?.seoTitleAr} className="w-full px-6 py-4 rounded-xl bg-background border-2 border-border outline-none text-right font-bold" dir="rtl" />
                                        </div>

                                        <div className="space-y-4">
                                            <Tooltip content={t('admin.blog_page.tooltip_seo') || "Description for SEO"} side="top">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2 cursor-help">
                                                    {t('admin.blog_page.seo_desc_en')} <AlertCircle size={10} />
                                                </label>
                                            </Tooltip>
                                            <textarea name="SeoDescriptionEn" defaultValue={editingPost?.seoDescriptionEn} rows={2} className="w-full px-6 py-4 rounded-xl bg-background border-2 border-border outline-none font-medium text-sm transition-all resize-none" />
                                        </div>
                                        <div className="space-y-4 text-right">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mr-1">{t('admin.blog_page.seo_desc_ar')}</label>
                                            <textarea name="SeoDescriptionAr" defaultValue={editingPost?.seoDescriptionAr} rows={2} className="w-full px-6 py-4 rounded-xl bg-background border-2 border-border outline-none text-right font-medium text-sm transition-all resize-none" dir="rtl" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-6 pt-12 border-t border-border">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-10 py-6 border-2 border-border rounded-[2rem] font-black bg-background hover:bg-muted transition-all uppercase tracking-widest text-xs"
                                    >
                                        {t('admin.blog_page.discard_changes')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                        className="flex-[2] px-10 py-6 bg-primary text-primary-foreground rounded-[2rem] font-black transition-all text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-3"
                                    >
                                        {createMutation.isPending || updateMutation.isPending ? <Loader className="w-6 h-6 animate-spin" /> : <Save size={24} />}
                                        {t('admin.blog_page.launch_article')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Comments Modal (Keep previous implementation) */}
            <AnimatePresence>
                {isCommentsModalOpen && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] flex items-center justify-center pt-20 px-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-card w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden border border-border flex flex-col h-[80vh]"
                        >
                            <div className="p-10 border-b border-border flex items-center justify-between bg-muted/20">
                                <h2 className="text-3xl font-black tracking-tighter">Comment Moderation</h2>
                                <button onClick={() => setIsCommentsModalOpen(false)} className="p-4 bg-background hover:bg-muted border border-border rounded-2xl transition-all"><X size={24} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar">
                                {isCommentsLoading ? <div className="flex items-center justify-center h-full"><Loader className="animate-spin text-primary" size={48} /></div> : comments.map((comment: any) => (
                                    <div key={comment.id} className={cn("p-8 rounded-[2.5rem] border transition-all flex items-start gap-8", comment.isApproved ? "bg-card border-border" : "bg-primary/5 border-primary/20 ring-4 ring-primary/5")}>
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl">{comment.authorName[0]?.toUpperCase()}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h4 className="font-black text-lg">{comment.authorName}</h4>
                                                    <p className="text-[10px] font-black uppercase text-muted-foreground opacity-40">{new Date(comment.createdAt).toLocaleString()}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {!comment.isApproved ? <button onClick={() => approveCommentMutation.mutate({ id: comment.id, approve: true })} className="px-5 py-2.5 bg-primary text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg shadow-primary/20">Approve</button> : <button onClick={() => approveCommentMutation.mutate({ id: comment.id, approve: false })} className="px-5 py-2.5 bg-muted text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-destructive hover:text-white transition-all">Hide</button>}
                                                    <button onClick={() => { if (confirm('Delete permanently?')) deleteCommentMutation.mutate(comment.id) }} className="p-2.5 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive hover:text-white"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                            <p className="text-lg font-medium text-foreground/80 leading-relaxed bg-muted/20 p-6 rounded-[1.5rem]">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminBlogPage;
