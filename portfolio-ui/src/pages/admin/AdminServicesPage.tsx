import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
    Plus, Edit, Trash2, X, Loader,
    Save, Hash, CheckCircle, XCircle, Home,
    Layers, Search, Image as ImageIcon, Sparkles
} from 'lucide-react';
import { uploadApi } from '../../api/upload';
import { useEffect } from 'react';
import { servicesApi } from '../../api/services';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils';

const AdminServicesPage = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);
    const [currentIconUrl, setCurrentIconUrl] = useState<string>('');
    const [uploadingIcon, setUploadingIcon] = useState(false);
    const isRtl = i18n.language === 'ar';

    useEffect(() => {
        setCurrentIconUrl(editingService?.iconUrl || '');
    }, [editingService]);

    const { data: services, isLoading } = useQuery({
        queryKey: ['admin-services'],
        queryFn: servicesApi.getAllAdmin,
    });

    const { user, isAdmin } = useAuth();

    const handleError = (err: any) => {
        console.error('API Error:', err?.response?.data ?? err);
        const serverErrors = err?.response?.data?.errors;
        if (serverErrors) {
            const messages = Object.values(serverErrors).flat().join(' | ');
            toast.error(messages);
            return;
        }
        const message = err?.response?.data?.message || err?.message || t('common.error_create');
        toast.error(message);
    };

    const createMutation = useMutation({
        mutationFn: servicesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-services'] });
            queryClient.invalidateQueries({ queryKey: ['services'] });
            toast.success(t('common.success_create'));
            setIsModalOpen(false);
        },
        onError: handleError,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => servicesApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-services'] });
            queryClient.invalidateQueries({ queryKey: ['services'] });
            toast.success(t('common.success_update'));
            setIsModalOpen(false);
            setEditingService(null);
        },
        onError: handleError,
    });

    const deleteMutation = useMutation({
        mutationFn: servicesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-services'] });
            queryClient.invalidateQueries({ queryKey: ['services'] });
            toast.success(t('common.success_delete'));
        },
        onError: handleError,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isAdmin) {
            toast.error('يجب أن تكون مسؤولاً لتعديل الخدمات. يرجى تسجيل الدخول كمسؤول.');
            return;
        }
        const formData = new FormData(e.currentTarget);
        const data = {
            titleEn: formData.get('titleEn') as string,
            titleAr: formData.get('titleAr') as string,
            descriptionEn: formData.get('descriptionEn') as string,
            descriptionAr: formData.get('descriptionAr') as string,
            iconUrl: formData.get('iconUrl') as string,
            displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
            isActive: formData.get('isActive') === 'on',
            showOnHome: formData.get('showOnHome') === 'on',
        };

        if (editingService) {
            updateMutation.mutate({ id: editingService.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm(t('common.confirm_delete'))) {
            deleteMutation.mutate(id);
        }
    };

    React.useEffect(() => {
        if (location.state?.openCreateModal) {
            setEditingService(null);
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">{t('admin.services')}</h1>
                    <p className="text-muted-foreground mt-2 font-medium">{t('admin.services_page.subtitle')}</p>
                </div>
                <button
                    onClick={() => {
                        setEditingService(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                    <Plus size={20} />
                    {t('admin.services_page.add_service')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {services?.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                "bg-card p-8 rounded-[3rem] border border-border shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col",
                                !service.isActive && "opacity-60 grayscale"
                            )}
                        >
                            <div className="absolute top-6 right-6 flex gap-2">
                                {service.showOnHome && (
                                    <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg" title="Featured Service">
                                        <Sparkles size={16} fill="currentColor" />
                                    </div>
                                )}
                                {service.isActive ? (
                                    <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                                        <CheckCircle size={16} />
                                    </div>
                                ) : (
                                    <div className="p-2 bg-destructive/10 text-destructive rounded-lg">
                                        <XCircle size={16} />
                                    </div>
                                )}
                            </div>

                            <div className="mb-8 p-5 bg-background border border-border rounded-[2rem] w-fit shadow-inner group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                {service.iconUrl && (function () {
                                    try {
                                        new URL(service.iconUrl);
                                        return <img src={service.iconUrl} alt="" className="w-10 h-10 object-contain" />
                                    } catch { return <Layers size={40} /> }
                                })()}
                                {!service.iconUrl && <Layers size={40} />}
                            </div>

                            <div className="flex-grow space-y-4">
                                <h3 className="text-2xl font-black text-foreground">{isRtl ? service.titleAr : service.titleEn}</h3>
                                <p className="text-muted-foreground text-sm font-medium line-clamp-3 leading-relaxed">
                                    {isRtl ? service.descriptionAr : service.descriptionEn}
                                </p>
                                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground tracking-tight pt-2">
                                    <span className="flex items-center gap-1"><Hash size={14} /> {t('admin.display_order')}: {service.displayOrder}</span>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8 pt-8 border-t border-border/50">
                                <button
                                    onClick={() => {
                                        setEditingService(service);
                                        setIsModalOpen(true);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 p-4 bg-accent/10 hover:bg-accent text-accent hover:text-accent-foreground rounded-2xl font-black transition-all"
                                >
                                    <Edit size={18} />
                                    {t('common.edit')}
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="p-4 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white rounded-2xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {services?.length === 0 && !isLoading && (
                <div className="text-center py-20 bg-card rounded-[4rem] border border-dashed border-border">
                    <Search className="mx-auto text-muted-foreground mb-6 opacity-20" size={80} />
                    <h3 className="text-2xl font-black text-muted-foreground tracking-tight">
                        {t('admin.common.no_data')}
                    </h3>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-card w-full max-w-3xl rounded-[2rem] shadow-xl overflow-hidden border border-border"
                    >
                        <div className="p-8 border-b border-border flex items-center justify-between bg-muted/20">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">
                                    {editingService ? t('admin.services_page.modal_title_edit') : t('admin.services_page.modal_title_add')}
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">{t('admin.services_page.modal_subtitle')}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 bg-background hover:bg-muted rounded-xl transition-all shadow-sm">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-muted-foreground/80 ml-1">{t('admin.services_page.service_title_en')}</label>
                                    <input
                                        type="text"
                                        name="titleEn"
                                        defaultValue={editingService?.titleEn}
                                        className="w-full px-6 py-4 rounded-xl border border-border bg-background focus:ring-4 focus:ring-primary/10 hover:border-primary/30 transition-all outline-none font-semibold text-foreground placeholder:text-muted-foreground/40"
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-muted-foreground/80 text-right block mr-1">{t('admin.services_page.service_title_ar')}</label>
                                    <input
                                        type="text"
                                        name="titleAr"
                                        defaultValue={editingService?.titleAr}
                                        className="w-full px-6 py-4 rounded-xl border border-border bg-background focus:ring-4 focus:ring-primary/10 hover:border-primary/30 transition-all outline-none text-right font-bold text-foreground"
                                        required
                                        dir="rtl"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-muted-foreground/80 ml-1">{t('admin.services_page.description_en')}</label>
                                    <textarea
                                        name="descriptionEn"
                                        rows={4}
                                        defaultValue={editingService?.descriptionEn}
                                        className="w-full px-6 py-4 rounded-xl border border-border bg-background focus:ring-4 focus:ring-primary/10 hover:border-primary/30 transition-all outline-none resize-none font-medium leading-relaxed"
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-muted-foreground/80 text-right block mr-1">{t('admin.services_page.description_ar')}</label>
                                    <textarea
                                        name="descriptionAr"
                                        rows={4}
                                        defaultValue={editingService?.descriptionAr}
                                        className="w-full px-6 py-4 rounded-xl border border-border bg-background focus:ring-4 focus:ring-primary/10 hover:border-primary/30 transition-all outline-none text-right resize-none font-medium leading-relaxed"
                                        required
                                        dir="rtl"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-muted-foreground/80 ml-1">{t('admin.services_page.icon_label')}</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                            <ImageIcon size={20} />
                                        </div>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                name="iconUrl"
                                                defaultValue={editingService?.iconUrl}
                                                value={currentIconUrl}
                                                onChange={e => setCurrentIconUrl(e.target.value)}
                                                className="flex-1 pl-14 pr-6 py-4 rounded-xl border border-border bg-background focus:ring-4 focus:ring-primary/10 hover:border-primary/30 font-medium transition-all"
                                                placeholder={t('admin.services_page.icon_placeholder')}
                                            />
                                            <label className="flex items-center gap-2 px-4 py-2 bg-muted/10 rounded-lg border border-border cursor-pointer hover:bg-muted transition-all text-sm">
                                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    setUploadingIcon(true);
                                                    try {
                                                        const url = await uploadApi.uploadImage(file);
                                                        setCurrentIconUrl(url);
                                                    } catch (err) {
                                                        toast.error(t('common.error_upload'));
                                                    } finally {
                                                        setUploadingIcon(false);
                                                    }
                                                }} />
                                                {uploadingIcon ? <Loader className="w-4 h-4 animate-spin" /> : 'Upload'}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-muted-foreground/80 ml-1">{t('admin.services_page.display_order')}</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                            <Hash size={20} />
                                        </div>
                                        <input
                                            type="number"
                                            name="displayOrder"
                                            defaultValue={editingService?.displayOrder || 0}
                                            className="w-full pl-14 pr-6 py-4 rounded-xl border border-border bg-background focus:ring-4 focus:ring-primary/10 hover:border-primary/30 font-bold transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <label className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl cursor-pointer hover:bg-muted/50 transition-all border border-border shadow-sm group">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        defaultChecked={editingService ? editingService.isActive : true}
                                        className="w-5 h-5 rounded-md text-primary focus:ring-primary transition-all cursor-pointer"
                                    />
                                    <div>
                                        <span className="block font-bold text-sm text-foreground">{t('admin.services_page.status_label')}</span>
                                        <span className="text-xs text-muted-foreground font-medium">{t('admin.services_page.is_active_desc')}</span>
                                    </div>
                                </label>
                                <label className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl cursor-pointer hover:bg-muted/50 transition-all border border-border shadow-sm group">
                                    <input
                                        type="checkbox"
                                        name="showOnHome"
                                        defaultChecked={editingService ? editingService.showOnHome : true}
                                        className="w-5 h-5 rounded-md text-amber-500 focus:ring-amber-500 transition-all cursor-pointer"
                                    />
                                    <div>
                                        <span className="block font-bold text-sm text-foreground">{isRtl ? "خدمة مميزة" : "Featured Service"}</span>
                                        <span className="text-xs text-muted-foreground font-medium">{isRtl ? "ستظهر هذه الخدمة في واجهة الصفحة الرئيسية" : "Highlight this service on the main home page"}</span>
                                    </div>
                                </label>
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
                                    className="flex-1 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-lg shadow-primary/20"
                                >
                                    {createMutation.isPending || updateMutation.isPending ? <Loader className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                                    {t('common.save')}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default AdminServicesPage;
