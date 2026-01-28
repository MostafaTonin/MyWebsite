
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { SiteSection } from '../../types/api';
import { siteSectionsApi } from '../../api/siteSections';
import { Save, Loader, Eye, EyeOff, LayoutTemplate } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminNavigationPage = () => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const queryClient = useQueryClient();

    // Local state for dragging and editing
    const [sections, setSections] = useState<SiteSection[]>([]);
    const [activeTab, setActiveTab] = useState<'navbar' | 'home'>('navbar');

    const { data: serverSections, isLoading } = useQuery({
        queryKey: ['site-sections'],
        queryFn: siteSectionsApi.getAll,
    });

    // Sync local state when server data arrives
    useEffect(() => {
        if (serverSections) {
            setSections(serverSections);
        }
    }, [serverSections]);

    const updateMutation = useMutation({
        mutationFn: siteSectionsApi.updateAll,
        onSuccess: (newSections) => {
            setSections(newSections);
            queryClient.setQueryData(['site-sections'], newSections);
            toast.success(t('common.success_update'));
        },
        onError: () => toast.error(t('common.error_update'))
    });

    const handleSave = () => {
        // Re-calculate orders based on current array index before saving?
        // Actually framer-motion reorder changes the array order directly.
        // We just need to update the order property to match the index.

        const orderedSections = sections.map((s, index) => ({
            ...s,
            navbarOrder: activeTab === 'navbar' ? index + 1 : s.navbarOrder, // Update order only for active view logic if needed, but better to keep distinct
        }));
        // Note: For simplicity, we trust the user to order everything or we handle separate arrays.
        // Better approach: Just save the attributes as they are modified in the Inputs. 
        // For Reordering: We need strict lists.

        updateMutation.mutate(sections);
    };

    const handleToggle = (id: number, field: keyof SiteSection) => {
        setSections(prev => prev.map(s =>
            s.id === id ? { ...s, [field]: !s[field] } : s
        ));
    };

    const handleChange = (id: number, field: keyof SiteSection, value: string) => {
        setSections(prev => prev.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        ));
    };

    // Sort sections for display based on the active tab context
    // Ideally we want drag-and-drop. Framer Motion Reorder.Group requires a state array.
    // We will render the MAIN sections state, but we might filter it? 
    // No, for reordering to work properly on the global list, we should show all.
    // Or we provide two lists? 
    // Let's keep it simple: List all sections, allow editing properties. 
    // Reordering might be tricky if we want separate orders for Home and Navbar. 
    // Let's use simple number inputs for Order for now to ensure robustness, 
    // or just assume the list order is the Navbar order. 
    // Requirement says: "Independent ordering for Navbar and Home".

    // Let's rely on Input Fields for Order for maximum control first.

    if (isLoading) return <div className="flex justify-center p-10"><Loader className="animate-spin" /></div>;

    const sortedSections = [...sections].sort((a, b) =>
        activeTab === 'navbar' ? a.navbarOrder - b.navbarOrder : a.homeOrder - b.homeOrder
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto p-6 space-y-8"
            dir={isAr ? 'rtl' : 'ltr'}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold flex items-center gap-3">
                        <LayoutTemplate className="text-primary" />
                        {t('admin.navigation_page.title')}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {t('admin.navigation_page.subtitle')}
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                    {updateMutation.isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                    {t('common.save')}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-muted/50 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('navbar')}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'navbar' ? 'bg-card shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    {t('admin.navigation_page.navbar_control')}
                </button>
                <button
                    onClick={() => setActiveTab('home')}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'home' ? 'bg-card shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    {t('admin.navigation_page.home_control')}
                </button>
            </div>

            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/20 font-bold text-sm text-muted-foreground">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-3">{t('admin.navigation_page.title_en')} / {t('admin.navigation_page.title_ar')}</div>
                    <div className="col-span-2">{t('admin.navigation_page.icon')}</div>
                    <div className="col-span-2 text-center">{t('admin.navigation_page.appears_in')}</div>
                    <div className="col-span-2 text-center">{t('admin.navigation_page.order')}</div>
                    <div className="col-span-2 text-center">{t('admin.navigation_page.actions')}</div>
                </div>

                <div className="divide-y divide-border">
                    {sortedSections.map((section) => (
                        <div key={section.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/10 transition-colors">
                            <div className="col-span-1 text-center font-mono text-xs text-muted-foreground">
                                {section.sectionKey}
                            </div>

                            {/* Titles */}
                            <div className="col-span-3 space-y-2">
                                <input
                                    value={section.titleEn}
                                    onChange={(e) => handleChange(section.id, 'titleEn', e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
                                    placeholder="English Title"
                                />
                                <input
                                    value={section.titleAr}
                                    onChange={(e) => handleChange(section.id, 'titleAr', e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-right"
                                    placeholder="Arabic Title"
                                    dir="rtl"
                                />
                            </div>

                            {/* Icon */}
                            <div className="col-span-2">
                                <input
                                    value={section.iconName}
                                    onChange={(e) => handleChange(section.id, 'iconName', e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-sm font-mono"
                                    placeholder={t('admin.navigation_page.icon')}
                                />
                            </div>

                            {/* Visibility Toggle */}
                            <div className="col-span-2 flex justify-center">
                                <button
                                    onClick={() => handleToggle(section.id, activeTab === 'navbar' ? 'isVisibleInNavbar' : 'isVisibleInHome')}
                                    className={`p-2 rounded-lg transition-all ${(activeTab === 'navbar' ? section.isVisibleInNavbar : section.isVisibleInHome)
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-muted text-muted-foreground'
                                        }`}
                                >
                                    {(activeTab === 'navbar' ? section.isVisibleInNavbar : section.isVisibleInHome) ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>

                            {/* Order Input */}
                            <div className="col-span-2 flex justify-center">
                                <input
                                    type="number"
                                    value={activeTab === 'navbar' ? section.navbarOrder : section.homeOrder}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        setSections(prev => prev.map(s =>
                                            s.id === section.id
                                                ? { ...s, [activeTab === 'navbar' ? 'navbarOrder' : 'homeOrder']: val }
                                                : s
                                        ));
                                    }}
                                    className="w-16 text-center px-2 py-1.5 rounded-lg border border-border bg-background font-bold"
                                />
                            </div>

                            <div className="col-span-2 text-center text-xs text-muted-foreground">
                                {activeTab === 'navbar' ? t('admin.navigation_page.navbar_settings') : t('admin.navigation_page.home_section_settings')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default AdminNavigationPage;
