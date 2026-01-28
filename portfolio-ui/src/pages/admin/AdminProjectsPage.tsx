import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { projectsApi } from '../../api/projects';
import { uploadApi } from '../../api/upload';
import type { Project } from '../../types/api';
import toast from 'react-hot-toast';
import {
    Plus, Edit, Trash2, X, Loader,
    Save, Star, Home,
    Globe, Github, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const AdminProjectsPage = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [projectImages, setProjectImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const isRtl = i18n.language === 'ar';

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5027/api';
    const BASE_URL = API_URL.replace('/api', '');

    const getFullImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const { data: projects, isLoading } = useQuery({
        queryKey: ['admin-projects'],
        queryFn: projectsApi.getAll,
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => projectsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success(t('common.success_create'));
            setIsModalOpen(false);
            setProjectImages([]);
        },
        onError: () => toast.error(t('common.error_create')),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            projectsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success(t('common.success_update'));
            setIsModalOpen(false);
            setEditingProject(null);
            setProjectImages([]);
        },
        onError: () => toast.error(t('common.error_update')),
    });

    const deleteMutation = useMutation({
        mutationFn: projectsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success(t('common.success_delete'));
        },
        onError: () => toast.error(t('common.error_delete')),
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const projectData: any = {
            titleEn: formData.get('titleEn') as string,
            titleAr: formData.get('titleAr') as string,
            descriptionEn: formData.get('descriptionEn') as string,
            descriptionAr: formData.get('descriptionAr') as string,
            clientName: (formData.get('clientName') as string) || 'Client',
            technologyStack: formData.get('technologyStack') as string,
            category: formData.get('category') as string,
            projectUrl: formData.get('projectUrl') as string,
            githubUrl: formData.get('githubUrl') as string,
            displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
            isFeatured: formData.get('isFeatured') === 'on',
            showOnHome: formData.get('showOnHome') === 'on',
            imageUrls: projectImages
        };

        if (editingProject) {
            updateMutation.mutate({ id: editingProject.id, data: projectData });
        } else {
            createMutation.mutate(projectData);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm(t('common.confirm_delete'))) {
            deleteMutation.mutate(id);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const imageUrl = await uploadApi.uploadImage(file);
            toast.success(t('common.success_upload'));
            setProjectImages(prev => [...prev, imageUrl]);
        } catch (error) {
            toast.error(t('common.error_upload'));
        } finally {
            setUploading(false);
        }
    };

    React.useEffect(() => {
        if (location.state?.openCreateModal) {
            setEditingProject(null);
            setProjectImages([]);
            setIsModalOpen(true);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-8 ${isRtl ? 'rtl' : 'ltr'}`}
            dir={isRtl ? 'rtl' : 'ltr'}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">{t('admin.projects_page.title')}</h1>
                    <p className="text-muted-foreground mt-2 font-medium">{t('admin.projects_page.subtitle')}</p>
                </div>
                <button
                    onClick={() => {
                        setEditingProject(null);
                        setProjectImages([]);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                    <Plus size={20} />
                    {t('admin.projects_page.add_project')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {projects?.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-card rounded-[3rem] border border-border shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col h-full"
                        >
                            <div className="h-56 overflow-hidden relative">
                                <img
                                    src={project.images?.[0] ? getFullImageUrl(project.images[0].imageUrl) : ''}
                                    alt=""
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    {project.isFeatured && (
                                        <div className="p-2 bg-yellow-500/10 text-yellow-500 backdrop-blur-md rounded-lg" title="Featured Project">
                                            <Star size={16} fill="currentColor" />
                                        </div>
                                    )}
                                    {project.showOnHome && (
                                        <div className="p-2 bg-primary/10 text-primary backdrop-blur-md rounded-lg" title="Shown on Home">
                                            <Home size={16} />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-lg tracking-tight border border-white/10">
                                        {project.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <h3 className="text-xl font-black mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                                    {isRtl ? project.titleAr : project.titleEn}
                                </h3>
                                <p className="text-muted-foreground text-sm font-medium mb-6 line-clamp-2 leading-relaxed">
                                    {isRtl ? project.descriptionAr : project.descriptionEn}
                                </p>

                                <div className="mt-auto space-y-6">
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologyStack.split(',').slice(0, 3).map((tech, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-muted rounded text-xs font-medium text-muted-foreground">
                                                {tech.trim()}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-3 pt-6 border-t border-border">
                                        <button
                                            onClick={() => {
                                                setEditingProject(project);
                                                setProjectImages(project.images.map(i => i.imageUrl));
                                                setIsModalOpen(true);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 p-3 bg-muted hover:bg-primary hover:text-primary-foreground rounded-xl font-bold transition-all transition-colors text-xs tracking-tight"
                                        >
                                            <Edit size={16} />
                                            {t('common.edit')}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="p-3 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {projects?.length === 0 && (
                <div className="text-center py-20 bg-card rounded-[4rem] border border-dashed border-border px-6">
                    <Search className="mx-auto text-muted-foreground mb-6 opacity-20" size={80} />
                    <h3 className="text-2xl font-black text-muted-foreground tracking-tight">{t('admin.projects_page.no_projects_found', { defaultValue: 'No Projects Found' })}</h3>
                    <p className="text-muted-foreground mt-4 font-medium">{t('admin.projects_page.no_projects_desc', { defaultValue: 'Start building your legacy by adding your first project.' })}</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="bg-card w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-xl overflow-hidden border border-border flex flex-col"
                        >
                            <div className="p-8 border-b border-border flex items-center justify-between bg-muted/20">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        {editingProject ? t('admin.projects_page.modal_title_edit') : t('admin.projects_page.modal_title_add')}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">{t('admin.projects_page.modal_subtitle')}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-background hover:bg-muted rounded-xl transition-all shadow-sm">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                                {/* Title and Category */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold tracking-tight text-muted-foreground ml-1">{t('admin.projects_page.project_title_en')}</label>
                                        <input
                                            type="text"
                                            name="titleEn"
                                            defaultValue={editingProject?.titleEn}
                                            className="w-full px-6 py-4 rounded-2xl border border-input bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3 text-right">
                                        <label className="text-xs font-bold tracking-tight text-muted-foreground mr-1">{t('admin.projects_page.project_title_ar')}</label>
                                        <input
                                            type="text"
                                            name="titleAr"
                                            defaultValue={editingProject?.titleAr}
                                            className="w-full px-6 py-4 rounded-2xl border border-input bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none text-right font-bold"
                                            required
                                            dir="rtl"
                                        />
                                    </div>
                                </div>

                                {/* Category and Stack */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold tracking-tight text-muted-foreground ml-1">{t('admin.projects_page.category')}</label>
                                        <select
                                            name="category"
                                            defaultValue={editingProject?.category || "Web App"}
                                            className="w-full px-6 py-4 rounded-2xl border border-input bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold appearance-none"
                                        >
                                            <option value="Web App">{t('admin.projects_page.cat_web')}</option>
                                            <option value="Mobile App">{t('admin.projects_page.cat_mobile')}</option>
                                            <option value="Desktop App">{t('admin.projects_page.cat_desktop')}</option>
                                            <option value="Backend System">{t('admin.projects_page.cat_backend')}</option>
                                            <option value="Game Dev">{t('admin.projects_page.cat_game')}</option>
                                            <option value="Other">{t('admin.projects_page.cat_other')}</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold tracking-tight text-muted-foreground ml-1">{t('admin.projects_page.technologies')}</label>
                                        <input
                                            type="text"
                                            name="technologyStack"
                                            defaultValue={editingProject?.technologyStack}
                                            className="w-full px-6 py-4 rounded-2xl border border-input bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold"
                                            placeholder={t('admin.projects_page.tech_stack_ph')}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold tracking-tight text-muted-foreground ml-1">{t('admin.projects_page.description_en')}</label>
                                        <textarea
                                            name="descriptionEn"
                                            rows={3}
                                            defaultValue={editingProject?.descriptionEn}
                                            className="w-full px-6 py-4 rounded-2xl border border-input bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none font-medium leading-relaxed"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3 text-right">
                                        <label className="text-xs font-bold tracking-tight text-muted-foreground mr-1">{t('admin.projects_page.description_ar')}</label>
                                        <textarea
                                            name="descriptionAr"
                                            rows={3}
                                            defaultValue={editingProject?.descriptionAr}
                                            className="w-full px-6 py-4 rounded-2xl border border-input bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none text-right resize-none font-medium leading-relaxed"
                                            required
                                            dir="rtl"
                                        />
                                    </div>
                                </div>

                                {/* Links */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold tracking-tight text-muted-foreground ml-1">{t('admin.projects_page.project_url')}</label>
                                        <div className="relative">
                                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                            <input
                                                type="url"
                                                name="projectUrl"
                                                defaultValue={editingProject?.projectUrl}
                                                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-input bg-background focus:ring-4 focus:ring-primary/10"
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold tracking-tight text-muted-foreground ml-1">{t('admin.projects_page.github_repo')}</label>
                                        <div className="relative">
                                            <Github className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                            <input
                                                type="url"
                                                name="githubUrl"
                                                defaultValue={editingProject?.githubUrl}
                                                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-input bg-background focus:ring-4 focus:ring-primary/10"
                                                placeholder="https://github.com/..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Images */}
                                <div className="space-y-4">
                                    <label className="text-xs font-bold tracking-tight text-muted-foreground ml-1">{t('admin.projects_page.project_visuals')}</label>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                        {projectImages.map((imgUrl, i) => (
                                            <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-border relative group">
                                                <img src={getFullImageUrl(imgUrl)} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setProjectImages(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="absolute inset-0 bg-destructive/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        ))}
                                        <label className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:text-primary">
                                            {uploading ? <Loader className="w-8 h-8 animate-spin" /> : <Plus size={32} />}
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                                        </label>
                                    </div>
                                </div>

                                {/* Toggles and Order */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                                    <label className="flex items-center gap-6 p-6 bg-muted/40 rounded-[2rem] cursor-pointer hover:bg-muted/60 transition-all">
                                        <input type="checkbox" name="isFeatured" defaultChecked={editingProject?.isFeatured} className="w-8 h-8 rounded-xl text-yellow-500 focus:ring-yellow-500 cursor-pointer" />
                                        <div>
                                            <span className="block font-bold text-sm tracking-tight">{t('admin.projects_page.is_featured')}</span>
                                            <span className="text-xs text-muted-foreground">{t('admin.projects_page.is_featured_desc')}</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-6 p-6 bg-muted/40 rounded-[2rem] cursor-pointer hover:bg-muted/60 transition-all">
                                        <input type="checkbox" name="showOnHome" defaultChecked={editingProject?.showOnHome ?? true} className="w-8 h-8 rounded-xl text-primary focus:ring-primary cursor-pointer" />
                                        <div>
                                            <span className="block font-bold text-sm tracking-tight">{t('admin.projects_page.show_on_home')}</span>
                                            <span className="text-xs text-muted-foreground">{t('admin.projects_page.show_on_home_desc')}</span>
                                        </div>
                                    </label>
                                    <div className="p-6 bg-muted/40 rounded-[2rem] flex flex-col justify-center">
                                        <span className="block font-bold text-xs tracking-tight mb-2 opacity-60">{t('admin.projects_page.display_order')}</span>
                                        <input type="number" name="displayOrder" defaultValue={editingProject?.displayOrder || 0} className="bg-transparent border-none p-0 font-black text-2xl focus:ring-0 w-full" />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-8 border-t border-border mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-8 py-4 border border-border rounded-xl font-bold hover:bg-muted transition-all text-sm"
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                        className="flex-1 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-primary/20"
                                    >
                                        {createMutation.isPending || updateMutation.isPending ? <Loader className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                                        {t('common.save')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AdminProjectsPage;
