import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit2, Save, X, ExternalLink } from 'lucide-react';
import { socialLinksApi } from '../../api/socialLinks';
import type { SocialLink } from '../../types/api';
import toast from 'react-hot-toast';

const AdminSocialLinksPage = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<Partial<SocialLink>>({
        platform: '',
        url: '',
        iconName: '',
        displayOrder: 0,
        isActive: true
    });

    const { data: links = [], isLoading } = useQuery({
        queryKey: ['admin-social-links'],
        queryFn: socialLinksApi.getAll
    });

    const createMutation = useMutation({
        mutationFn: socialLinksApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-social-links'] });
            toast.success(t('common.success_create'));
            setIsAdding(false);
            resetForm();
        },
        onError: () => toast.error(t('common.error_create'))
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<SocialLink> }) =>
            socialLinksApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-social-links'] });
            toast.success(t('common.success_update'));
            setEditingId(null);
            resetForm();
        },
        onError: () => toast.error(t('common.error_update'))
    });

    const deleteMutation = useMutation({
        mutationFn: socialLinksApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-social-links'] });
            toast.success(t('common.success_delete'));
        },
        onError: () => toast.error(t('common.error_delete'))
    });

    const resetForm = () => {
        setFormData({
            platform: '',
            url: '',
            iconName: '',
            displayOrder: 0,
            isActive: true
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateMutation.mutate({ id: editingId, data: formData });
        } else {
            createMutation.mutate(formData as any);
        }
    };

    const handleEdit = (link: SocialLink) => {
        setEditingId(link.id);
        setFormData(link);
        setIsAdding(false);
    };

    const handleCancel = () => {
        setEditingId(null);
        setIsAdding(false);
        resetForm();
    };

    const handleDelete = (id: number) => {
        if (window.confirm(t('common.confirm_delete'))) {
            deleteMutation.mutate(id);
        }
    };

    const commonPlatforms = [
        { name: 'GitHub', icon: 'github', url: 'https://github.com/' },
        { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/in/' },
        { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com/' },
        { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com/' },
        { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/' },
        { name: 'YouTube', icon: 'youtube', url: 'https://youtube.com/' },
        { name: 'WhatsApp', icon: 'whatsapp', url: 'https://wa.me/' },
        { name: 'Email', icon: 'mail', url: 'mailto:' },
    ];

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-muted rounded w-1/4" />
                    <div className="h-64 bg-muted rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Social Links</h1>
                    <p className="text-muted-foreground mt-2">Manage your social media profiles</p>
                </div>
                <button
                    onClick={() => {
                        setIsAdding(true);
                        setEditingId(null);
                        resetForm();
                    }}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                    <Plus size={20} />
                    Add Link
                </button>
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
                <div className="p-6 bg-card border border-border rounded-2xl">
                    <h3 className="text-xl font-bold tracking-tight mb-6">
                        {editingId ? t('admin.social_links_page.edit_link') : t('admin.social_links_page.add_link')}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-2">Platform</label>
                                <input
                                    type="text"
                                    value={formData.platform}
                                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                                    placeholder={t('admin.social_links_page.placeholder_platform')}
                                    required
                                />
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {commonPlatforms.map(p => (
                                        <button
                                            key={p.name}
                                            type="button"
                                            onClick={() => setFormData({
                                                ...formData,
                                                platform: p.name,
                                                iconName: p.icon,
                                                url: formData.url || p.url
                                            })}
                                            className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                                        >
                                            {p.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">{t('admin.social_links_page.icon_name')}</label>
                                <input
                                    type="text"
                                    value={formData.iconName}
                                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                                    placeholder={t('admin.social_links_page.placeholder_icon')}
                                    required
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {t('admin.social_links_page.icon_hint')}
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2">{t('admin.social_links_page.url')}</label>
                                <input
                                    type="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                                    placeholder="https://..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">{t('admin.social_links_page.display_order')}</label>
                                <input
                                    type="number"
                                    value={formData.displayOrder}
                                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                                    min="0"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5 rounded border-border"
                                />
                                <label htmlFor="isActive" className="text-sm font-bold">
                                    {t('admin.social_links_page.is_active')}
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={createMutation.isPending || updateMutation.isPending}
                                className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                <Save size={20} />
                                {editingId ? t('admin.common.update') : t('admin.common.create')}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 bg-muted text-foreground rounded-xl font-bold flex items-center gap-2 hover:bg-muted/80 transition-colors"
                            >
                                <X size={20} />
                                {t('admin.common.cancel')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Links List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {links.map((link: SocialLink) => (
                    <div
                        key={link.id}
                        className="p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <span className="text-2xl">{link.iconName === 'github' ? '🐙' : link.iconName === 'linkedin' ? '💼' : link.iconName === 'twitter' ? '🐦' : '🔗'}</span>
                                </div>
                                <div>
                                    <h3 className="font-black text-lg">{link.platform}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full ${link.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                                        {link.isActive ? t('admin.common.active') : t('admin.common.inactive')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-2 mb-4 break-all"
                        >
                            <ExternalLink size={14} />
                            {link.url.substring(0, 40)}...
                        </a>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(link)}
                                className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                            >
                                <Edit2 size={16} />
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(link.id)}
                                disabled={deleteMutation.isPending}
                                className="px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {links.length === 0 && !isAdding && (
                <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">No social links yet. Add your first one!</p>
                </div>
            )}
        </div>
    );
};

export default AdminSocialLinksPage;
