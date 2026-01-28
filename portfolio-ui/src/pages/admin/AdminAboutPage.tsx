import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Save, Loader, User, Briefcase, Image as ImageIcon, Github, Linkedin, Globe, Plus, Trash2, Home, Instagram } from 'lucide-react';
import { aboutApi } from '../../api/about';
import { socialLinksApi } from '../../api/socialLinks';
import { uploadApi } from '../../api/upload';
import toast from 'react-hot-toast';

const AdminAboutPage = () => {
    const { t, i18n } = useTranslation();
    const queryClient = useQueryClient();
    const isAr = i18n.language === 'ar';
    const isRtl = i18n.language === 'ar';
    const [uploading, setUploading] = useState(false);

    // Visibility States
    const [visibility, setVisibility] = useState({
        // About Page Visibility
        showHeroAbout: true,
        showExtendedBio: true,
        showSoftSkills: true,
        showExperience: true,
        showStats: true,
        // Home Page Visibility
        showServicesSection: true,
        showProjectsSection: true,
        showCertificationsSection: true,
        showBlogSection: true,
        showContactSection: true,
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5027/api';
    const BASE_URL = API_URL.replace('/api', '');

    const getFullImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const { data: aboutData, isLoading: loadingAbout } = useQuery({
        queryKey: ['about'],
        queryFn: aboutApi.get,
        retry: false,
    });

    React.useEffect(() => {
        if (aboutData) {
            setVisibility({
                // About Page Visibility
                showHeroAbout: aboutData.showHeroAbout ?? true,
                showExtendedBio: aboutData.showExtendedBio ?? true,
                showSoftSkills: aboutData.showSoftSkills ?? true,
                showExperience: aboutData.showExperience ?? true,
                showStats: aboutData.showStats ?? true,
                // Home Page Visibility
                showServicesSection: aboutData.showServicesSection ?? true,
                showProjectsSection: aboutData.showProjectsSection ?? true,
                showCertificationsSection: aboutData.showCertificationsSection ?? true,
                showBlogSection: aboutData.showBlogSection ?? true,
                showContactSection: aboutData.showContactSection ?? true,
            });
        }
    }, [aboutData]);

    const { data: socialLinks, isLoading: loadingSocials } = useQuery({
        queryKey: ['social-links'],
        queryFn: socialLinksApi.getAll,
    });

    const updateAboutMutation = useMutation({
        mutationFn: aboutApi.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['about'] });
            toast.success(t('common.success_update'));
        },
        onError: (error: any) => {
            console.error('Update Error:', error);
            toast.error(t('common.error_update'));
        }
    });

    const createSocialMutation = useMutation({
        mutationFn: socialLinksApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['social-links'] });
            toast.success(t('common.success_add'));
        }
    });

    const deleteSocialMutation = useMutation({
        mutationFn: socialLinksApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['social-links'] });
            toast.success(t('common.success_delete'));
        }
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // 1. Upload the file to storage
            const imageUrl = await uploadApi.uploadImage(file);

            // 2. Prepare the full payload for the database update
            // Using existing data but updating ONLY the image URL
            const updatePayload = {
                fullNameAr: aboutData?.fullNameAr || '',
                fullNameEn: aboutData?.fullNameEn || '',
                positionAr: aboutData?.positionAr || '',
                positionEn: aboutData?.positionEn || '',
                bioAr: aboutData?.bioAr || '',
                bioEn: aboutData?.bioEn || '',
                heroBioAr: aboutData?.heroBioAr || '',
                heroBioEn: aboutData?.heroBioEn || '',
                heroGreetingAr: aboutData?.heroGreetingAr || '',
                heroGreetingEn: aboutData?.heroGreetingEn || '',
                ctaPrimaryTextAr: aboutData?.ctaPrimaryTextAr || '',
                ctaPrimaryTextEn: aboutData?.ctaPrimaryTextEn || '',
                ctaSecondaryTextAr: aboutData?.ctaSecondaryTextAr || '',
                ctaSecondaryTextEn: aboutData?.ctaSecondaryTextEn || '',
                titleAr: aboutData?.titleAr || '',
                titleEn: aboutData?.titleEn || '',
                descriptionAr: aboutData?.descriptionAr || '',
                descriptionEn: aboutData?.descriptionEn || '',
                yearsOfExperience: aboutData?.yearsOfExperience || 0,
                projectsCompleted: aboutData?.projectsCompleted || 0,
                technologiesCount: aboutData?.technologiesCount || 0,
                certificatesCount: aboutData?.certificatesCount || 0,
                freelanceProjectsCount: aboutData?.freelanceProjectsCount || 0,
                cvUrl: aboutData?.cvUrl || '',
                imageUrl: imageUrl, // New Image URL from storage

                // Extended fields
                extendedBioAr: aboutData?.extendedBioAr || '',
                extendedBioEn: aboutData?.extendedBioEn || '',
                softSkillsAr: aboutData?.softSkillsAr || '',
                softSkillsEn: aboutData?.softSkillsEn || '',
                experienceDescriptionAr: aboutData?.experienceDescriptionAr || '',
                experienceDescriptionEn: aboutData?.experienceDescriptionEn || '',

                // Current visibility states from the UI
                ...visibility,

                displayOrder: aboutData?.displayOrder || 1,
                isActive: true,

                // Hero Badges
                badge1Ar: aboutData?.badge1Ar || '',
                badge1En: aboutData?.badge1En || '',
                badge2Ar: aboutData?.badge2Ar || '',
                badge2En: aboutData?.badge2En || '',
                badge3Ar: aboutData?.badge3Ar || '',
                badge3En: aboutData?.badge3En || '',
                badge4Ar: aboutData?.badge4Ar || '',
                badge4En: aboutData?.badge4En || '',
                badge5Ar: aboutData?.badge5Ar || '',
                badge5En: aboutData?.badge5En || '',
            };

            // 3. Update the database record
            await updateAboutMutation.mutateAsync(updatePayload);

            // Only show success toast if both operations succeeded
            toast.success(t('common.success_upload'));
        } catch (error) {
            console.error('Image Update Error:', error);
            // Error toast is already handled by updateAboutMutation.onError
        } finally {
            setUploading(false);
        }
    };

    const handleSubmitAbout = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            fullNameAr: formData.get('fullNameAr') as string,
            fullNameEn: formData.get('fullNameEn') as string,
            positionAr: formData.get('positionAr') as string,
            positionEn: formData.get('positionEn') as string,
            bioAr: formData.get('bioAr') as string,
            bioEn: formData.get('bioEn') as string,
            heroBioAr: formData.get('heroBioAr') as string,
            heroBioEn: formData.get('heroBioEn') as string,
            heroGreetingAr: formData.get('heroGreetingAr') as string,
            heroGreetingEn: formData.get('heroGreetingEn') as string,
            ctaPrimaryTextAr: formData.get('ctaPrimaryTextAr') as string,
            ctaPrimaryTextEn: formData.get('ctaPrimaryTextEn') as string,
            ctaSecondaryTextAr: formData.get('ctaSecondaryTextAr') as string,
            ctaSecondaryTextEn: formData.get('ctaSecondaryTextEn') as string,
            titleAr: formData.get('titleAr') as string,
            titleEn: formData.get('titleEn') as string,
            descriptionAr: formData.get('descriptionAr') as string,
            descriptionEn: formData.get('descriptionEn') as string,
            yearsOfExperience: parseInt(formData.get('yearsOfExperience') as string) || 0,
            projectsCompleted: parseInt(formData.get('projectsCompleted') as string) || 0,
            technologiesCount: parseInt(formData.get('technologiesCount') as string) || 0,
            certificatesCount: parseInt(formData.get('certificatesCount') as string) || 0,
            freelanceProjectsCount: parseInt(formData.get('freelanceProjectsCount') as string) || 0,
            cvUrl: formData.get('cvUrl') as string,

            // Extended About Page
            extendedBioAr: formData.get('extendedBioAr') as string,
            extendedBioEn: formData.get('extendedBioEn') as string,
            softSkillsAr: formData.get('softSkillsAr') as string,
            softSkillsEn: formData.get('softSkillsEn') as string,
            experienceDescriptionAr: formData.get('experienceDescriptionAr') as string,
            experienceDescriptionEn: formData.get('experienceDescriptionEn') as string,

            // About Page Visibility
            showHeroAbout: visibility.showHeroAbout,
            showExtendedBio: visibility.showExtendedBio,
            showSoftSkills: visibility.showSoftSkills,
            showExperience: visibility.showExperience,
            showStats: visibility.showStats,

            // Home Page Visibility
            showServicesSection: visibility.showServicesSection,
            showProjectsSection: visibility.showProjectsSection,
            showCertificationsSection: visibility.showCertificationsSection,
            showBlogSection: visibility.showBlogSection,
            showContactSection: visibility.showContactSection,
            displayOrder: 1,
            isActive: true,
            // Hero Badges
            badge1Ar: formData.get('badge1Ar') as string,
            badge1En: formData.get('badge1En') as string,
            badge2Ar: formData.get('badge2Ar') as string,
            badge2En: formData.get('badge2En') as string,
            badge3Ar: formData.get('badge3Ar') as string,
            badge3En: formData.get('badge3En') as string,
            badge4Ar: formData.get('badge4Ar') as string,
            badge4En: formData.get('badge4En') as string,
            badge5Ar: formData.get('badge5Ar') as string,
            badge5En: formData.get('badge5En') as string,
        };
        updateAboutMutation.mutate(data);
    };

    const handleAddSocial = () => {
        const platform = prompt('Enter Platform (GitHub, LinkedIn, Facebook, etc.):');
        if (!platform) return;
        const url = prompt('Enter URL:');
        if (!url) return;

        // Default icon based on platform
        let iconName = 'Globe';
        const p = platform.toLowerCase();
        if (p.includes('github')) iconName = 'Github';
        else if (p.includes('linkedin')) iconName = 'Linkedin';
        else if (p.includes('mail')) iconName = 'Mail';
        else if (p.includes('facebook')) iconName = 'Facebook';
        else if (p.includes('twitter')) iconName = 'Twitter';
        else if (p.includes('instagram')) iconName = 'Instagram';

        createSocialMutation.mutate({
            platform,
            url,
            iconName,
            displayOrder: (socialLinks?.length || 0) + 1,
            isActive: true
        });
    };

    if (loadingAbout || loadingSocials) {
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
            className={`space-y-6 max-w-6xl mx-auto p-4 md:p-6 ${isRtl ? 'rtl' : 'ltr'}`}
            dir={isRtl ? 'rtl' : 'ltr'}
        >
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">{t('admin.home_settings')}</h1>
                    <p className="text-muted-foreground mt-1">{t('admin.manage_home_and_about')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Image & Social Links */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Image Card */}
                    <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
                        <div className="aspect-square relative group">
                            <img
                                src={getFullImageUrl(aboutData?.imageUrl || '') || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800'}
                                alt="Profile"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                                {uploading || updateAboutMutation.isPending ? <Loader className="w-10 h-10 animate-spin" /> : <ImageIcon size={40} />}
                                <span className="mt-2 font-medium">{t('common.change_photo', { defaultValue: 'Change Photo' })}</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading || updateAboutMutation.isPending} />
                            </label>
                        </div>
                        <div className="p-6 text-center">
                            <h3 className="text-xl font-bold">{isRtl ? (aboutData?.fullNameAr || 'إسمك') : (aboutData?.fullNameEn || 'Your Name')}</h3>
                            <p className="text-muted-foreground text-sm">{isRtl ? (aboutData?.positionAr || 'وظيفتك') : (aboutData?.positionEn || 'Your Position')}</p>
                        </div>
                    </div>

                    {/* Social Links Card */}
                    <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-2 font-bold">
                                <Globe size={18} className="text-primary" />
                                <span>{t('admin.social_links')}</span>
                            </div>
                            <button
                                onClick={handleAddSocial}
                                className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                        <div className="divide-y divide-border">
                            {socialLinks?.map(link => (
                                <div key={link.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-muted rounded-lg">
                                            {link.platform.toLowerCase().includes('github') && <Github size={16} />}
                                            {link.platform.toLowerCase().includes('linkedin') && <Linkedin size={16} />}
                                            {link.platform.toLowerCase().includes('instagram') && <Instagram size={16} />}
                                            {link.platform.toLowerCase().includes('facebook') && <Globe size={16} />}
                                            {link.platform.toLowerCase().includes('twitter') && <Globe size={16} />}
                                            {(!['github', 'linkedin', 'instagram', 'facebook', 'twitter'].some(p => link.platform.toLowerCase().includes(p))) && <Globe size={16} />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{link.platform}</div>
                                            <div className="text-xs text-muted-foreground truncate max-w-[150px]">{link.url}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteSocialMutation.mutate(link.id)}
                                        className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {!socialLinks?.length && (
                                <div className="p-8 text-center text-sm text-muted-foreground italic">
                                    {t('admin.no_links')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Detailed Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmitAbout} className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                        <div className="p-8 space-y-8">

                            {/* Hero Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-primary font-bold border-b border-border pb-2">
                                    <Home size={18} />
                                    <span>{t('admin.hero_section')}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">{t('hero.greeting')} (AR)</label>
                                        <input
                                            type="text"
                                            name="heroGreetingAr"
                                            defaultValue={aboutData?.heroGreetingAr}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none text-right"
                                            dir="rtl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">{t('hero.greeting')} (EN)</label>
                                        <input
                                            type="text"
                                            name="heroGreetingEn"
                                            defaultValue={aboutData?.heroGreetingEn}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">{t('admin.full_name_ar')}</label>
                                        <input
                                            type="text"
                                            name="fullNameAr"
                                            defaultValue={aboutData?.fullNameAr}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none text-right"
                                            required
                                            dir="rtl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">{t('admin.full_name_en')}</label>
                                        <input
                                            type="text"
                                            name="fullNameEn"
                                            defaultValue={aboutData?.fullNameEn}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">{t('admin.professional_title_ar')}</label>
                                        <input
                                            type="text"
                                            name="positionAr"
                                            defaultValue={aboutData?.positionAr}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none text-right"
                                            required
                                            dir="rtl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">{t('admin.professional_title_en')}</label>
                                        <input
                                            type="text"
                                            name="positionEn"
                                            defaultValue={aboutData?.positionEn}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-bold ml-1">{t('admin.hero_bio_ar')}</label>
                                        <textarea
                                            name="heroBioAr"
                                            rows={6}
                                            defaultValue={aboutData?.heroBioAr}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none text-right resize-none"
                                            dir="rtl"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-bold ml-1">{t('admin.hero_bio_en')}</label>
                                        <textarea
                                            name="heroBioEn"
                                            rows={6}
                                            defaultValue={aboutData?.heroBioEn}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2 pt-4 border-t border-border mt-4">
                                        <label className="text-sm font-bold ml-1">{t('admin.about_bio_ar')}</label>
                                        <textarea
                                            name="bioAr"
                                            rows={3}
                                            defaultValue={aboutData?.bioAr}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none text-right resize-none"
                                            required
                                            dir="rtl"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-bold ml-1">{t('admin.about_bio_en')}</label>
                                        <textarea
                                            name="bioEn"
                                            rows={3}
                                            defaultValue={aboutData?.bioEn}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">{t('admin.cta_primary_ar')}</label>
                                        <input
                                            type="text"
                                            name="ctaPrimaryTextAr"
                                            defaultValue={aboutData?.ctaPrimaryTextAr}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none text-right"
                                            dir="rtl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">{t('admin.cta_primary_en')}</label>
                                        <input
                                            type="text"
                                            name="ctaPrimaryTextEn"
                                            defaultValue={aboutData?.ctaPrimaryTextEn}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">{t('admin.cta_secondary_ar')}</label>
                                        <input
                                            type="text"
                                            name="ctaSecondaryTextAr"
                                            defaultValue={aboutData?.ctaSecondaryTextAr}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none text-right"
                                            dir="rtl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">{t('admin.cta_secondary_en')}</label>
                                        <input
                                            type="text"
                                            name="ctaSecondaryTextEn"
                                            defaultValue={aboutData?.ctaSecondaryTextEn}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Hero Badges */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-primary font-bold border-b border-border pb-2">
                                    <ImageIcon size={18} />
                                    <span>{isAr ? 'شارات الواجهة (Badges)' : 'Hero Badges'}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <React.Fragment key={num}>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold ml-1">{isAr ? `شارة ${num} (عربي)` : `Badge ${num} (AR)`}</label>
                                                <input
                                                    type="text"
                                                    name={`badge${num}Ar`}
                                                    defaultValue={aboutData?.[`badge${num}Ar` as keyof typeof aboutData] as string}
                                                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none text-right"
                                                    dir="rtl"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold ml-1">{isAr ? `شارة ${num} (إنجليزي)` : `Badge ${num} (EN)`}</label>
                                                <input
                                                    type="text"
                                                    name={`badge${num}En`}
                                                    defaultValue={aboutData?.[`badge${num}En` as keyof typeof aboutData] as string}
                                                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                                />
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            {/* About Me Section (Detailed Page) */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-primary font-bold border-b border-border pb-2">
                                    <User size={18} />
                                    <span>{t('admin.about_section')}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">{t('about.titleAr', { defaultValue: 'Section Title (AR)' })}</label>
                                        <input
                                            type="text"
                                            name="titleAr"
                                            defaultValue={aboutData?.titleAr}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none text-right"
                                            required
                                            dir="rtl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">{t('about.titleEn', { defaultValue: 'Section Title (EN)' })}</label>
                                        <input
                                            type="text"
                                            name="titleEn"
                                            defaultValue={aboutData?.titleEn}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-bold ml-1">{t('about.descriptionAr', { defaultValue: 'Detailed Description (AR)' })}</label>
                                        <textarea
                                            name="descriptionAr"
                                            rows={4}
                                            defaultValue={aboutData?.descriptionAr}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none text-right resize-none"
                                            required
                                            dir="rtl"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-bold ml-1">{t('about.descriptionEn', { defaultValue: 'Detailed Description (EN)' })}</label>
                                        <textarea
                                            name="descriptionEn"
                                            rows={4}
                                            defaultValue={aboutData?.descriptionEn}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Stats & Assets */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-primary font-bold border-b border-border pb-2">
                                    <Briefcase size={18} />
                                    <span>{t('admin.statistics', { defaultValue: 'Experience & Assets' })}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">Years of Experience</label>
                                        <input
                                            type="number"
                                            name="yearsOfExperience"
                                            defaultValue={aboutData?.yearsOfExperience}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">Projects Completed</label>
                                        <input
                                            type="number"
                                            name="projectsCompleted"
                                            defaultValue={aboutData?.projectsCompleted}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">Technologies Count</label>
                                        <input
                                            type="number"
                                            name="technologiesCount"
                                            defaultValue={aboutData?.technologiesCount}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">Certificates Count</label>
                                        <input
                                            type="number"
                                            name="certificatesCount"
                                            defaultValue={aboutData?.certificatesCount}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">Freelance Projects Count</label>
                                        <input
                                            type="number"
                                            name="freelanceProjectsCount"
                                            defaultValue={aboutData?.freelanceProjectsCount}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-bold ml-1">{t('about.cvUrl', { defaultValue: 'CV URL / Portfolio Link' })}</label>
                                        <input
                                            type="url"
                                            name="cvUrl"
                                            defaultValue={aboutData?.cvUrl}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Extended About Page Content */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-primary font-bold border-b border-border pb-2">
                                    <Briefcase size={18} />
                                    <span>About Page Extended Content</span>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">Extended Bio (AR) - Detailed</label>
                                        <textarea
                                            name="extendedBioAr"
                                            rows={6}
                                            defaultValue={aboutData?.extendedBioAr}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none text-right resize-none"
                                            dir="rtl"
                                            placeholder="نبذة مفصلة عنك..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">Extended Bio (EN) - Detailed</label>
                                        <textarea
                                            name="extendedBioEn"
                                            rows={6}
                                            defaultValue={aboutData?.extendedBioEn}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                                            placeholder="Detailed bio about yourself..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">Soft Skills (AR) - Comma Separated</label>
                                        <input
                                            type="text"
                                            name="softSkillsAr"
                                            defaultValue={aboutData?.softSkillsAr}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none text-right"
                                            dir="rtl"
                                            placeholder="العمل الجماعي,التواصل,حل المشكلات"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">Soft Skills (EN) - Comma Separated</label>
                                        <input
                                            type="text"
                                            name="softSkillsEn"
                                            defaultValue={aboutData?.softSkillsEn}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            placeholder="Teamwork,Communication,Problem Solving"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">Experience Description (AR)</label>
                                        <textarea
                                            name="experienceDescriptionAr"
                                            rows={6}
                                            defaultValue={aboutData?.experienceDescriptionAr}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none text-right resize-none"
                                            dir="rtl"
                                            placeholder="وصف خبراتك العملية..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">Experience Description (EN)</label>
                                        <textarea
                                            name="experienceDescriptionEn"
                                            rows={6}
                                            defaultValue={aboutData?.experienceDescriptionEn}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                                            placeholder="Describe your work experience..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* About Page Sections Visibility */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-primary font-bold border-b border-border pb-2">
                                    <User size={18} />
                                    <span>About Page Sections Visibility</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="flex items-center gap-3 p-4 bg-muted/20 rounded-xl cursor-pointer hover:bg-muted/40 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={visibility.showHeroAbout}
                                            onChange={(e) => setVisibility(v => ({ ...v, showHeroAbout: e.target.checked }))}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="font-bold text-sm">Show Hero About</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 bg-muted/20 rounded-xl cursor-pointer hover:bg-muted/40 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={visibility.showExtendedBio}
                                            onChange={(e) => setVisibility(v => ({ ...v, showExtendedBio: e.target.checked }))}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="font-bold text-sm">Show Extended Bio</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 bg-muted/20 rounded-xl cursor-pointer hover:bg-muted/40 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={visibility.showSoftSkills}
                                            onChange={(e) => setVisibility(v => ({ ...v, showSoftSkills: e.target.checked }))}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="font-bold text-sm">Show Soft Skills</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 bg-muted/20 rounded-xl cursor-pointer hover:bg-muted/40 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={visibility.showExperience}
                                            onChange={(e) => setVisibility(v => ({ ...v, showExperience: e.target.checked }))}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="font-bold text-sm">Show Experience</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 bg-muted/20 rounded-xl cursor-pointer hover:bg-muted/40 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={visibility.showStats}
                                            onChange={(e) => setVisibility(v => ({ ...v, showStats: e.target.checked }))}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="font-bold text-sm">Show Stats</span>
                                    </label>
                                </div>
                            </div>

                            {/* Home Page Sections Visibility */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-primary font-bold border-b border-border pb-2">
                                    <Home size={18} />
                                    <span>Home Page Sections</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="flex items-center gap-3 p-4 bg-muted/20 rounded-xl cursor-pointer hover:bg-muted/40 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={visibility.showServicesSection}
                                            onChange={(e) => setVisibility(v => ({ ...v, showServicesSection: e.target.checked }))}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="font-bold text-sm">Show Services</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 bg-muted/20 rounded-xl cursor-pointer hover:bg-muted/40 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={visibility.showProjectsSection}
                                            onChange={(e) => setVisibility(v => ({ ...v, showProjectsSection: e.target.checked }))}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="font-bold text-sm">Show Projects</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 bg-muted/20 rounded-xl cursor-pointer hover:bg-muted/40 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={visibility.showCertificationsSection}
                                            onChange={(e) => setVisibility(v => ({ ...v, showCertificationsSection: e.target.checked }))}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="font-bold text-sm">Show Certifications</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 bg-muted/20 rounded-xl cursor-pointer hover:bg-muted/40 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={visibility.showBlogSection}
                                            onChange={(e) => setVisibility(v => ({ ...v, showBlogSection: e.target.checked }))}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="font-bold text-sm">Show Blog</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 bg-muted/20 rounded-xl cursor-pointer hover:bg-muted/40 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={visibility.showContactSection}
                                            onChange={(e) => setVisibility(v => ({ ...v, showContactSection: e.target.checked }))}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="font-bold text-sm">Show Contact</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-muted/30 border-t border-border flex justify-end">
                            <button
                                type="submit"
                                disabled={updateAboutMutation.isPending}
                                className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                            >
                                {updateAboutMutation.isPending ? <Loader className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                                {t('common.save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminAboutPage;
