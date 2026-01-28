import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Edit, Trash2, X, Loader, Image as ImageIcon,
    Save, Hash, Clock, CheckCircle, XCircle, Search,
    Database, Server, Layout, Smartphone, ShieldCheck,
    Cloud, GitBranch, Wrench, History as HistoryIcon, ArrowLeftRight,
    Terminal, Globe, Users, Settings, Activity, FileCode,
    Box, Layers, Code
} from 'lucide-react';
import { skillsApi } from '../../api/skills';
import { uploadApi } from '../../api/upload';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils';

const AdminSkillsPage = () => {
    const { t, i18n } = useTranslation();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<any>(null);
    const [currentIconUrl, setCurrentIconUrl] = useState<string>('');
    const [uploadingIcon, setUploadingIcon] = useState(false);
    const isRtl = i18n.language === 'ar';

    const { data: skills, isLoading } = useQuery({
        queryKey: ['admin-skills'],
        queryFn: skillsApi.getAllAdmin,
    });

    const { isAdmin } = useAuth();

    useEffect(() => {
        setCurrentIconUrl(editingSkill?.iconUrl || '');
    }, [editingSkill]);

    const createMutation = useMutation({
        mutationFn: skillsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
            queryClient.invalidateQueries({ queryKey: ['skills'] });
            toast.success(t('common.success_create'));
            setIsModalOpen(false);
        },
        onError: () => toast.error(t('common.error_create')),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => skillsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
            queryClient.invalidateQueries({ queryKey: ['skills'] });
            toast.success(t('common.success_update'));
            setIsModalOpen(false);
            setEditingSkill(null);
        },
        onError: () => toast.error(t('common.error_update')),
    });

    const deleteMutation = useMutation({
        mutationFn: skillsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
            queryClient.invalidateQueries({ queryKey: ['skills'] });
            toast.success(t('common.success_delete'));
        },
        onError: () => toast.error(t('common.error_delete')),
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isAdmin) {
            toast.error('يجب أن تكون مسؤولاً لتعديل المهارات. يرجى تسجيل الدخول كمسؤول.');
            return;
        }
        const formData = new FormData(e.currentTarget);
        const data = {
            nameEn: formData.get('nameEn') as string,
            nameAr: formData.get('nameAr') as string,
            proficiency: parseInt(formData.get('proficiency') as string),
            category: formData.get('category') as string,
            iconUrl: currentIconUrl || (formData.get('iconUrl') as string),
            yearsOfUse: parseInt(formData.get('yearsOfUse') as string) || 0,
            displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
            isActive: formData.get('isActive') === 'on',
        };

        if (editingSkill) {
            updateMutation.mutate({ id: editingSkill.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm(t('common.confirm_delete'))) {
            deleteMutation.mutate(id);
        }
    };



    const renderSkillIcon = (skill: any, size = 32) => {
        const name = (skill.nameEn || "").toLowerCase().trim();
        const category = (skill.category || "").toLowerCase();
        const iconUrl = skill.iconUrl;

        // 1. Priority: User Provided URL (External or Uploaded)
        if (iconUrl && iconUrl.trim() !== '') {
            const src = iconUrl.startsWith('http')
                ? iconUrl
                : `${(import.meta.env.VITE_API_URL || 'http://localhost:5027/api').replace('/api', '')}${iconUrl.startsWith('/') ? '' : '/'}${iconUrl}`;
            return <img src={src} className="w-full h-full object-contain" alt="" />;
        }

        // 2. Secondary: High-Quality DevIcons for Technical Skills (Explicit Mapping)
        const devIcons: Record<string, string> = {
            'c#': 'csharp/csharp-original.svg',
            'csharp': 'csharp/csharp-original.svg',
            'asp.net': 'dotnetcore/dotnetcore-plain.svg',
            '.net': 'dot-net/dot-net-original.svg',
            'ef core': 'entityframeworkcore/entityframeworkcore-original.svg',
            'entity framework': 'entityframeworkcore/entityframeworkcore-original.svg',
            'c++': 'cplusplus/cplusplus-original.svg',
            'sql server': 'microsoftsqlserver/microsoftsqlserver-plain.svg',
        };

        const foundDevKey = Object.keys(devIcons).find(k => name.includes(k));
        if (foundDevKey) {
            return <img
                src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${devIcons[foundDevKey]}`}
                className="w-full h-full object-contain"
                alt=""
            />;
        }

        // 3. Dynamic Auto-Mapping (For ANY new technical skill)
        // 3. Dynamic Auto-Mapping (Extremely Comprehensive Tech List)
        const techSlugs = [
            // Core Languages & Web Tech
            'javascript', 'typescript', 'python', 'php', 'java', 'ruby', 'go', 'rust', 'swift', 'kotlin',
            'dart', 'cplusplus', 'csharp', 'html5', 'css3', 'sass', 'less', 'stylus', 'markdown',
            // Frameworks & Libraries
            'react', 'angular', 'vuejs', 'nextjs', 'nuxtjs', 'svelte', 'remix', 'astro', 'solidjs',
            'flutter', 'reactnative', 'ionic', 'capacitor', 'electron', 'tauri', 'blazor',
            'laravel', 'symfony', 'codeigniter', 'cakephp', 'yii', 'zend', 'django', 'flask', 'fastapi',
            'spring', 'rails', 'express', 'nestjs', 'fastify', 'adonisjs', 'feathersjs',
            'jquery', 'bootstrap', 'tailwindcss', 'bulma', 'foundation', 'materialize', 'vuetify',
            'materialui', 'chakraui', 'antdesign', 'primereact', 'headlessui',
            // Databases & Cache
            'mongodb', 'mysql', 'postgresql', 'redis', 'sqlite', 'oracle', 'mariadb', 'cassandra',
            'couchbase', 'couchdb', 'neo4j', 'firebase', 'supabase', 'appwrite', 'pocketbase',
            'elasticsearch', 'meilisearch', 'algolia', 'influxdb', 'planetscale', 'cockroachdb',
            // DevOps, Cloud & Environments
            'docker', 'kubernetes', 'jenkins', 'circleci', 'travis', 'githubactions', 'gitlab',
            'aws', 'azure', 'googlecloud', 'digitalocean', 'heroku', 'netlify', 'vercel', 'flyio',
            'nginx', 'apache', 'linux', 'ubuntu', 'debian', 'fedora', 'centos', 'redhat', 'archlinux',
            'alpinejs', 'terraform', 'ansible', 'pulumi', 'vagrant', 'proxmox', 'vmware',
            // Tools, IDEs & Design
            'git', 'github', 'bitbucket', 'visualstudio', 'vscode', 'webstorm', 'intellij', 'pycharm',
            'phpstorm', 'androidstudio', 'xcode', 'postman', 'insomnia', 'figma', 'sketch', 'adobe',
            'photoshop', 'illustrator', 'premierepro', 'aftereffects', 'canva', 'framer',
            'slack', 'trello', 'jira', 'confluence', 'discord', 'notion', 'obsidian',
            // Build Tools & Package Managers
            'npm', 'yarn', 'pnpm', 'webpack', 'vite', 'rollup', 'esbuild', 'gulp', 'grunt', 'babel',
            'composer', 'nuget', 'pypi', 'maven', 'gradle', 'deno', 'bun',
            // Testing & Quality
            'jest', 'vitest', 'cypress', 'playwright', 'puppeteer', 'selenium', 'mocha', 'chai',
            'eslint', 'prettier', 'stylelint', 'sonarqube',
            // IoT, Science & Others
            'arduino', 'raspberrypi', 'tensorflow', 'pytorch', 'opencv', 'pandas', 'numpy', 'matlab',
            'unity', 'unrealengine', 'godot', 'blender', 'opengl', 'vulkan', 'solidity', 'ethereum',
            'wordpress', 'drupal', 'magento', 'shopify', 'strapi', 'ghost', 'webflow'
        ];

        const nameNorm = name.toLowerCase().replace(/[\s\-_]/g, '');
        const slugMatch = techSlugs.find(s => nameNorm.includes(s));

        if (slugMatch) {
            const originalStyleIcons = [
                'javascript', 'typescript', 'react', 'python', 'php', 'java', 'ruby', 'git', 'docker',
                'mysql', 'postgresql', 'redis', 'nodejs', 'laravel', 'html5', 'css3', 'github',
                'mongodb', 'googlecloud', 'firebase', 'digitalocean', 'flutter', 'dart', 'kotlin',
                'swift', 'go', 'rust', 'csharp', 'cplusplus'
            ];
            const style = originalStyleIcons.includes(slugMatch) ? 'original' : 'plain';

            return <img
                src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slugMatch}/${slugMatch}-${style}.svg`}
                className="w-full h-full object-contain"
                alt=""
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const currentStyle = target.src.includes('original') ? 'original' : 'plain';
                    const alternateStyle = currentStyle === 'original' ? 'plain' : 'original';

                    if (!target.dataset.triedAlternate) {
                        target.dataset.triedAlternate = 'true';
                        target.src = target.src.replace(`-${currentStyle}.svg`, `-${alternateStyle}.svg`);
                    } else {
                        target.style.display = 'none';
                    }
                }}
            />;
        }

        // 4. Fallback: Smart Keyword Mapping to Lucide Components
        if (name.includes('database') || name.includes('sql') || name.includes('data') || category.includes('database')) return <Database size={size} />;
        if (name.includes('server') || name.includes('backend') || name.includes('api')) return <Server size={size} />;
        if (name.includes('web') || name.includes('frontend') || name.includes('html') || name.includes('css')) return <Layout size={size} />;
        if (name.includes('mobile') || name.includes('app') || name.includes('flutter')) return <Smartphone size={size} />;
        if (name.includes('security') || name.includes('auth')) return <ShieldCheck size={size} />;
        if (name.includes('cloud') || name.includes('azure') || name.includes('aws')) return <Cloud size={size} />;
        if (name.includes('git') || name.includes('version') || name.includes('github')) return <GitBranch size={size} />;
        if (name.includes('tool') || name.includes('devops')) return <Wrench size={size} />;
        if (name.includes('backup') || name.includes('restore')) return <HistoryIcon size={size} />;
        if (name.includes('transaction') || name.includes('transfer')) return <ArrowLeftRight size={size} />;
        if (name.includes('terminal') || name.includes('command') || name.includes('linux')) return <Terminal size={size} />;
        if (name.includes('global') || name.includes('network')) return <Globe size={size} />;
        if (name.includes('user') || name.includes('social') || name.includes('team') || category.includes('soft')) return <Users size={size} />;
        if (name.includes('setting') || name.includes('config')) return <Settings size={size} />;
        if (name.includes('performance') || name.includes('monitor')) return <Activity size={size} />;
        if (name.includes('code') || name.includes('script') || name.includes('programming')) return <FileCode size={size} />;
        if (name.includes('docker') || name.includes('container') || name.includes('deployment')) return <Box size={size} />;
        if (name.includes('architecture') || name.includes('design') || name.includes('layer')) return <Layers size={size} />;

        return <Code size={size} />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-6 ${isRtl ? 'rtl' : 'ltr'}`}
            dir={isRtl ? 'rtl' : 'ltr'}
        >
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">{t('admin.skills')}</h1>
                    <p className="text-muted-foreground mt-1">{t('admin.skills_page.subtitle')}</p>
                </div>
                <button
                    onClick={() => {
                        setEditingSkill(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                    <Plus size={20} />
                    {t('admin.skills_page.add_skill')}
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-card border border-border h-48 animate-pulse">
                            <div className="h-8 w-3/4 bg-muted rounded mb-4" />
                            <div className="h-3 w-full bg-muted rounded mb-2" />
                            <div className="h-3 w-1/2 bg-muted rounded" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {skills?.map((skill, index) => (
                            <motion.div
                                key={skill.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                    "bg-card p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl transition-all group overflow-hidden relative",
                                    !skill.isActive && "opacity-60 grayscale"
                                )}
                            >
                                <div className="absolute top-0 right-0 p-4">
                                    {skill.isActive ? (
                                        <CheckCircle className="text-green-500" size={20} />
                                    ) : (
                                        <XCircle className="text-destructive" size={20} />
                                    )}
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-4 bg-background border border-border rounded-2xl shadow-inner group-hover:scale-110 transition-transform overflow-hidden w-16 h-16 flex items-center justify-center text-primary">
                                        {renderSkillIcon(skill)}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingSkill(skill);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-3 bg-accent/50 hover:bg-accent rounded-xl text-foreground transition-colors"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(skill.id)}
                                            className="p-3 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white rounded-xl transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <h3 className="text-2xl font-black text-foreground">{isRtl ? skill.nameAr : skill.nameEn}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">
                                            {skill.category}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                                            <Clock size={12} /> {skill.yearsOfUse}y
                                        </span>
                                        <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                                            <Hash size={12} /> {skill.displayOrder}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">{t('admin.proficiency')}</span>
                                        <span className="text-lg font-black text-primary">{skill.proficiency}%</span>
                                    </div>
                                    <div className="h-3 bg-muted rounded-full overflow-hidden p-0.5 border border-border shadow-inner">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${skill.proficiency}%` }}
                                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {skills?.length === 0 && !isLoading && (
                <div className="text-center py-20 bg-card rounded-[3rem] border border-dashed border-border">
                    <Search className="mx-auto text-muted-foreground mb-4 opacity-20" size={64} />
                    <h3 className="text-2xl font-black text-muted-foreground">
                        {isRtl ? "لم يتم العثور على مهارات" : "No skills found"}
                    </h3>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-card w-full max-w-2xl rounded-[2rem] shadow-xl overflow-hidden border border-border"
                    >
                        <div className="p-8 border-b border-border flex items-center justify-between bg-muted/20">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">
                                    {editingSkill ? t('admin.skills_page.modal_title_edit') : t('admin.skills_page.modal_title_add')}
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">{t('admin.skills_page.modal_subtitle')}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 bg-background hover:bg-muted rounded-xl transition-all shadow-sm">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground">{t('admin.skills_page.skill_name_en')}</label>
                                    <input
                                        type="text"
                                        name="nameEn"
                                        defaultValue={editingSkill?.nameEn}
                                        className="w-full px-5 py-4 rounded-2xl border border-input bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black ml-1 uppercase tracking-wider text-muted-foreground text-right block">Name (AR)</label>
                                    <input
                                        type="text"
                                        name="nameAr"
                                        defaultValue={editingSkill?.nameAr}
                                        className="w-full px-5 py-4 rounded-2xl border border-input bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none text-right font-bold"
                                        required
                                        dir="rtl"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground">{t('admin.skills_page.category')}</label>
                                    <select
                                        name="category"
                                        defaultValue={editingSkill?.category || "Backend Development"}
                                        className="w-full px-5 py-4 rounded-2xl border border-input bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold appearance-none cursor-pointer text-sm"
                                        required
                                    >
                                        <option value="Backend Development">{t('admin.skills_page.cat_backend')}</option>
                                        <option value="Frontend Development">{t('admin.skills_page.cat_frontend')}</option>
                                        <option value="Database">{t('admin.skills_page.cat_db')}</option>
                                        <option value="Mobile Development">{t('admin.skills_page.cat_mobile')}</option>
                                        <option value="DevOps & Tools">{t('admin.skills_page.cat_tools')}</option>
                                        <option value="Soft Skills">{t('admin.skills_page.cat_soft')}</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground">{t('admin.skills_page.icon_url_label')}</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                            <ImageIcon size={20} />
                                        </div>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                name="iconUrl"
                                                value={currentIconUrl}
                                                onChange={e => setCurrentIconUrl(e.target.value)}
                                                className="flex-1 pl-14 pr-6 py-4 rounded-2xl border border-input bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
                                                placeholder={t('admin.skills_page.icon_placeholder')}
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
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground">{t('admin.skills_page.years_label')}</label>
                                    <input
                                        type="number"
                                        name="yearsOfUse"
                                        defaultValue={editingSkill?.yearsOfUse || 0}
                                        className="w-full px-5 py-4 rounded-2xl border border-input bg-background focus:ring-4 focus:ring-primary/10 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground">{t('admin.skills_page.order_label')}</label>
                                    <input
                                        type="number"
                                        name="displayOrder"
                                        defaultValue={editingSkill?.displayOrder || 0}
                                        className="w-full px-5 py-4 rounded-2xl border border-input bg-background focus:ring-4 focus:ring-primary/10 font-bold"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground block mb-2">{t('admin.skills_page.status_label')}</label>
                                    <label className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl cursor-pointer hover:bg-muted/50 transition-colors">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            defaultChecked={editingSkill ? editingSkill.isActive : true}
                                            className="w-6 h-6 rounded-lg text-primary focus:ring-primary cursor-pointer"
                                        />
                                        <span className="font-bold text-sm">{t('admin.skills_page.is_active_label')}</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-border">
                                <div className="flex justify-between items-center bg-background p-6 rounded-3xl border border-border shadow-inner">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-muted-foreground">{t('admin.skills_page.proficiency')}</label>
                                        <p className="text-xs text-muted-foreground">{t('admin.skills_page.proficiency_desc')}</p>
                                    </div>
                                    <span className="text-4xl font-black text-primary tabular-nums">{editingSkill?.proficiency || 50}%</span>
                                </div>
                                <input
                                    type="range"
                                    name="proficiency"
                                    min="0"
                                    max="100"
                                    defaultValue={editingSkill?.proficiency || 50}
                                    className="w-full h-4 bg-muted rounded-full appearance-none cursor-pointer accent-primary border-4 border-background shadow-sm"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const display = e.target.parentElement?.querySelector('.tabular-nums');
                                        if (display) display.textContent = `${val}%`;
                                    }}
                                />
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
        </motion.div>
    );
};

export default AdminSkillsPage;
