import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { certificationsApi } from '../../api/certifications';
import type { Certification } from '../../types/api';
import toast from 'react-hot-toast';
import {
    Plus, Edit, Trash2, X, Loader,
    Save, Star,
    Award, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PLATFORM_TYPES = ['Cisco', 'Addison', 'ProgrammingAdvices', 'Other'];
const CATEGORIES = ['Course', 'Professional Certificate', 'Specialization', 'Bootcamp', 'Degree'];

const AdminCertificationsPage = () => {
    const { t, i18n } = useTranslation();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCert, setEditingCert] = useState<Certification | null>(null);
    const [logoUrl, setLogoUrl] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [showCustomPlatform, setShowCustomPlatform] = useState(false);
    const isRtl = i18n.language.startsWith('ar');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5027/api';
    const BASE_URL = API_URL.replace('/api', '');

    const getFullImageUrl = (url: string | undefined) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const handleError = (err: any) => {
        console.error('API Error Details:', err.response?.data);
        const serverErrors = err.response?.data?.errors;
        if (serverErrors) {
            const messages = Object.values(serverErrors).flat().join(' | ');
            toast.error(messages);
        } else {
            toast.error(err.response?.data?.message || t('common.error_create'));
        }
    };

    const { data: adminCerts, isLoading, isError } = useQuery({
        queryKey: ['admin-certifications'],
        queryFn: () => certificationsApi.getAdminAll(),
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => certificationsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-certifications'] });
            queryClient.invalidateQueries({ queryKey: ['certifications'] });
            toast.success(isRtl ? 'تم إضافة الشهادة بنجاح' : 'Certification added successfully');
            setIsModalOpen(false);
            setLogoUrl('');
        },
        onError: handleError,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            certificationsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-certifications'] });
            queryClient.invalidateQueries({ queryKey: ['certifications'] });
            toast.success(isRtl ? 'تم تحديث الشهادة بنجاح' : 'Certification updated successfully');
            setIsModalOpen(false);
            setEditingCert(null);
            setLogoUrl('');
        },
        onError: handleError,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => certificationsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-certifications'] });
            queryClient.invalidateQueries({ queryKey: ['certifications'] });
            toast.success(isRtl ? 'تم حذف الشهادة' : 'Certification deleted');
        },
        onError: handleError,
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const certData: any = {
            TitleAr: formData.get('TitleAr') as string,
            TitleEn: formData.get('TitleEn') as string,
            IssuerAr: formData.get('IssuerAr') as string,
            IssuerEn: formData.get('IssuerEn') as string,
            PlatformType: formData.get('PlatformType') as string,
            CustomPlatformName: formData.get('CustomPlatformName') as string,
            PlatformLogoUrl: logoUrl,
            CertificateUrl: formData.get('CertificateUrl') as string,
            IssueDate: formData.get('IssueDate') as string,
            Category: formData.get('Category') as string,
            DisplayOrder: parseInt(formData.get('DisplayOrder') as string) || 0,
            IsFeatured: formData.get('IsFeatured') === 'on',
            ShowOnHome: formData.get('ShowOnHome') === 'on',
            IsActive: formData.get('IsActive') === 'on',
        };

        if (editingCert) {
            updateMutation.mutate({ id: editingCert.id, data: certData });
        } else {
            createMutation.mutate(certData);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const path = await certificationsApi.uploadLogo(file);
            setLogoUrl(path);
            toast.success(isRtl ? 'تم رفع الشعار' : 'Logo uploaded');
        } catch (error) {
            toast.error(t('common.error_upload'));
        } finally {
            setUploading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-bold tracking-tight text-xs">{t('admin.common.secure_server')}</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-12 rounded-[3rem] bg-destructive/5 border border-destructive/20 text-center space-y-6">
                <AlertCircle className="mx-auto text-destructive" size={48} />
                <h3 className="text-2xl font-black text-destructive">{t('admin.certifications_page.error_sync')}</h3>
                <button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-certifications'] })}
                    className="px-8 py-3 bg-destructive text-white rounded-2xl font-bold uppercase tracking-tight text-xs"
                >
                    {t('admin.blog_page.retry')}
                </button>
            </div>
        );
    }

    const certificates = adminCerts || [];

    return (
        <div className={`space-y-10 py-6 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">{t('admin.certifications')}</h1>
                    <p className="text-muted-foreground mt-2 font-medium italic opacity-60">{t('admin.certifications_page.subtitle')}</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCert(null);
                        setLogoUrl('');
                        setShowCustomPlatform(false);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all text-sm"
                >
                    <Plus size={20} />
                    {t('admin.certifications_page.add_certificate')}
                </button>
            </div>

            {certificates.length === 0 ? (
                <div className="py-40 border-2 border-dashed border-border rounded-[4rem] text-center space-y-6">
                    <Award size={64} className="mx-auto text-muted-foreground opacity-20" />
                    <h3 className="text-2xl font-black text-muted-foreground">{t('admin.common.no_data')}</h3>
                    <button onClick={() => setIsModalOpen(true)} className="px-8 py-3 bg-muted hover:bg-primary hover:text-white rounded-xl font-bold text-xs uppercase tracking-tight transition-all">{t('admin.add_certificate')}</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((cert) => (
                        <motion.div
                            key={cert.id}
                            layout
                            className="bg-card rounded-[2.5rem] border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all group flex flex-col"
                        >
                            <div className="p-8 pb-4 flex items-start justify-between">
                                <div className="w-20 h-20 rounded-2xl bg-muted p-4 border border-border group-hover:border-primary/50 transition-colors flex items-center justify-center overflow-hidden">
                                    {cert.platformLogoUrl ? (
                                        <img src={getFullImageUrl(cert.platformLogoUrl)} alt="" className="max-w-full max-h-full object-contain" />
                                    ) : (
                                        <Award size={32} className="text-muted-foreground" />
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    {cert.isFeatured && (
                                        <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
                                            <Star size={16} fill="currentColor" />
                                        </div>
                                    )}
                                    {!cert.isActive && (
                                        <div className="p-2 bg-destructive/10 text-destructive rounded-lg">
                                            <AlertCircle size={16} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 pt-0 flex flex-col flex-grow">
                                <h3 className="text-xl font-black mb-2 line-clamp-1 group-hover:text-primary transition-all">{isRtl ? cert.titleAr : cert.titleEn}</h3>
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="px-2 py-0.5 bg-primary/5 text-primary rounded-md text-[10px] font-black uppercase tracking-widest">{cert.category}</span>
                                    <span className="text-muted-foreground text-xs font-bold">— {cert.platformType === 'Other' ? cert.customPlatformName : cert.platformType}</span>
                                </div>

                                <div className="mt-auto pt-6 border-t border-border flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            setEditingCert(cert);
                                            setLogoUrl(cert.platformLogoUrl || '');
                                            setShowCustomPlatform(cert.platformType === 'Other');
                                            setIsModalOpen(true);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 p-3 bg-muted hover:bg-primary hover:text-primary-foreground rounded-xl font-bold transition-all text-xs"
                                    >
                                        <Edit size={16} />
                                        {t('common.edit')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm(t('common.confirm_delete'))) deleteMutation.mutate(cert.id);
                                        }}
                                        className="p-3 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white rounded-xl transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

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
                                        {editingCert ? t('admin.certifications_page.modal_title_edit') : t('admin.certifications_page.modal_title_add')}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">{t('admin.certifications_page.modal_subtitle')}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-background hover:bg-muted rounded-xl transition-all shadow-sm">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-10 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-muted-foreground ml-1">{t('admin.certifications_page.cert_title_en')}</label>
                                        <input type="text" name="TitleEn" defaultValue={editingCert?.titleEn} required className="w-full px-5 py-3 rounded-xl border border-input bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold" />
                                    </div>
                                    <div className="space-y-3 text-right">
                                        <label className="text-xs font-bold text-muted-foreground mr-1">{t('admin.certifications_page.cert_title_ar')}</label>
                                        <input type="text" name="TitleAr" defaultValue={editingCert?.titleAr} required className="w-full px-5 py-3 rounded-xl border border-input bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none text-right font-bold" dir="rtl" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-muted-foreground ml-1">{t('admin.certifications_page.issuer_en')}</label>
                                        <input type="text" name="IssuerEn" defaultValue={editingCert?.issuerEn} required className="w-full px-5 py-3 rounded-xl border border-input bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold" />
                                    </div>
                                    <div className="space-y-3 text-right">
                                        <label className="text-xs font-bold text-muted-foreground mr-1">{t('admin.certifications_page.issuer_ar')}</label>
                                        <input type="text" name="IssuerAr" defaultValue={editingCert?.issuerAr} required className="w-full px-5 py-3 rounded-xl border border-input bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none text-right font-bold" dir="rtl" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-muted-foreground ml-1">{t('admin.certifications_page.cert_category')}</label>
                                        <select
                                            name="Category"
                                            defaultValue={editingCert?.category || 'Course'}
                                            className="w-full px-5 py-3 rounded-xl border border-input bg-background focus:ring-4 focus:ring-primary/10 outline-none font-bold appearance-none"
                                        >
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-muted-foreground ml-1">{t('admin.certifications_page.display_order')}</label>
                                        <input type="number" name="DisplayOrder" defaultValue={editingCert?.displayOrder || 0} className="w-full px-5 py-3 rounded-xl border border-input bg-background outline-none font-bold" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-muted-foreground ml-1">{t('admin.certifications_page.platform_type')}</label>
                                        <select
                                            name="PlatformType"
                                            defaultValue={editingCert?.platformType || 'Other'}
                                            onChange={(e) => setShowCustomPlatform(e.target.value === 'Other')}
                                            className="w-full px-5 py-3 rounded-xl border border-input bg-background outline-none font-bold appearance-none"
                                        >
                                            {PLATFORM_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    {showCustomPlatform && (
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-muted-foreground ml-1">{t('admin.certifications_page.custom_platform')}</label>
                                            <input type="text" name="CustomPlatformName" defaultValue={editingCert?.customPlatformName} className="w-full px-5 py-3 rounded-xl border border-input bg-background font-bold" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-muted-foreground ml-1">{t('admin.certifications_page.authority_logo')}</label>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-2xl bg-muted border border-border flex items-center justify-center overflow-hidden shadow-inner">
                                            {logoUrl ? <img src={getFullImageUrl(logoUrl)} alt="" className="max-w-full max-h-full object-contain" /> : <Award className="text-muted-foreground/30" size={32} />}
                                        </div>
                                        <label className="flex-grow flex flex-col items-center justify-center py-6 border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-2xl cursor-pointer transition-all">
                                            {uploading ? <Loader className="animate-spin text-primary" /> : <Plus size={24} />}
                                            <span className="mt-2 text-xs font-bold">{t('admin.certifications_page.upload_logo')}</span>
                                            <input type="file" onChange={handleLogoUpload} className="hidden" accept="image/*" />
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-muted-foreground ml-1">{t('admin.certifications_page.cert_url')}</label>
                                        <input type="url" name="CertificateUrl" defaultValue={editingCert?.certificateUrl} className="w-full px-5 py-3 rounded-xl border border-input bg-background outline-none font-medium" placeholder="https://..." />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-muted-foreground ml-1">{t('admin.certifications_page.cert_issue_date')}</label>
                                        <input type="date" name="IssueDate" defaultValue={editingCert?.issueDate ? new Date(editingCert.issueDate).toISOString().split('T')[0] : ''} required className="w-full px-5 py-3 rounded-xl border border-input bg-background outline-none font-bold" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                                    <label className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl cursor-pointer hover:bg-muted/50 transition-all border border-transparent hover:border-primary/20">
                                        <input type="checkbox" name="IsFeatured" defaultChecked={editingCert?.isFeatured} className="w-6 h-6 rounded-lg text-primary focus:ring-primary cursor-pointer" />
                                        <div>
                                            <span className="block font-bold text-sm">{t('admin.certifications_page.is_featured')}</span>
                                            <span className="text-[10px] text-muted-foreground">{t('admin.certifications_page.featured_desc')}</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl cursor-pointer hover:bg-muted/50 transition-all border border-transparent hover:border-accent/20">
                                        <input type="checkbox" name="ShowOnHome" defaultChecked={editingCert?.showOnHome ?? true} className="w-6 h-6 rounded-lg text-accent focus:ring-accent cursor-pointer" />
                                        <div>
                                            <span className="block font-bold text-sm">{t('admin.certifications_page.show_on_home')}</span>
                                            <span className="text-[10px] text-muted-foreground">{t('admin.certifications_page.active_desc')}</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl cursor-pointer hover:bg-muted/50 transition-all border border-transparent">
                                        <input type="checkbox" name="IsActive" defaultChecked={editingCert?.isActive ?? true} className="w-6 h-6 rounded-lg text-primary focus:ring-primary cursor-pointer" />
                                        <div>
                                            <span className="block font-bold text-sm">{t('admin.common.active')}</span>
                                            <span className="text-[10px] text-muted-foreground">{t('admin.certifications_page.active_desc')}</span>
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
        </div>
    );
};

export default AdminCertificationsPage;
