import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { projectsApi } from '../../api/projects';
import { skillsApi } from '../../api/skills';
import { blogApi } from '../../api/blog';
import { contactApi } from '../../api/contact';
import { certificationsApi } from '../../api/certifications';
import { Briefcase, Code, Mail, BookOpen, ArrowUpRight, Clock, Activity, Terminal, ExternalLink, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { cn } from '../../utils';

const AdminDashboardPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: projectsApi.getAll });
    const { data: skills } = useQuery({ queryKey: ['skills'], queryFn: skillsApi.getAll });
    const { data: blog } = useQuery({ queryKey: ['admin-blog'], queryFn: () => blogApi.getAdminAll() });
    const { data: messages = [] as any[] } = useQuery({ queryKey: ['messages'], queryFn: contactApi.getAllAdmin });
    const { data: certs } = useQuery({ queryKey: ['admin-certifications'], queryFn: certificationsApi.getAdminAll });

    const stats = [
        {
            label: t('admin.total_projects'),
            value: projects?.length || 0,
            icon: Briefcase,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            trend: isRtl ? '+12.5%' : '+12.5%'
        },
        {
            label: t('admin.skills'),
            value: skills?.length || 0,
            icon: Code,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            trend: t('admin.optimized')
        },
        {
            label: t('admin.blog_posts'),
            value: blog?.length || 0,
            icon: BookOpen,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            trend: t('admin.high_engagement')
        },
        {
            label: t('admin.messages'),
            value: messages?.filter(m => !m.isRead).length || 0,
            icon: Mail,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            trend: t('admin.action_priority')
        },
        {
            label: t('admin.manage_certificates'),
            value: certs?.length || 0,
            icon: Award,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            trend: t('admin.verified')
        },
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12 pb-20 font-sans"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-primary font-black tracking-tight text-sm px-1 flex items-center gap-2">
                        <Activity size={12} />
                        {isRtl ? 'نظرة عامة على البنية التحتية' : 'Global infrastructure overview'}
                    </h2>
                    <h1 className="text-4xl font-black tracking-tighter text-foreground">{t('admin.dashboard_title')}</h1>
                    <p className="text-muted-foreground font-medium opacity-60 text-sm max-w-lg">{t('admin.placeholder_text')}</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 glass-card rounded-2xl flex items-center gap-3">
                        <Clock size={16} className="text-primary" />
                        <span className="text-xs font-bold tracking-tight opacity-60 text-foreground">
                            {new Date().toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className="w-[1px] h-4 bg-border" />
                        <span className="text-xs font-bold tracking-tight opacity-60 text-foreground">
                            {new Date().toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        className="group relative bg-card p-10 rounded-[3.5rem] border border-border/50 hover:border-primary/30 transition-all duration-700 shadow-2xl shadow-black/5"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        <div className="flex items-center justify-between mb-10">
                            <div className={cn("p-5 rounded-3xl shadow-inner", stat.bg)}>
                                <stat.icon className={cn("w-8 h-8", stat.color)} />
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="text-xs font-bold tracking-tight text-muted-foreground/50 mb-1">{isRtl ? 'الحالة' : 'Status'}</div>
                                <div className="text-xs font-bold tracking-tight text-primary/60">{stat.trend}</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-5xl font-black tracking-tighter text-foreground">{stat.value}</div>
                            <div className="text-xs font-bold text-muted-foreground/50 tracking-tight">{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Strategic Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-2 lg:px-0">
                {/* Recent Inquiries */}
                <motion.div variants={itemVariants} className="lg:col-span-8 bg-card rounded-[3.5rem] border border-border/50 p-12 space-y-10 shadow-2xl shadow-black/5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-4 text-foreground">
                            {isRtl ? 'الرسائل الأخيرة' : 'Recent messages inbound'}
                            <span className="flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                        </h2>
                        <Link to="/admin/messages" className="text-xs font-bold tracking-tight text-primary hover:opacity-70 transition-opacity flex items-center gap-2">
                            {isRtl ? 'عرض الرسائل' : 'View messages'}
                            <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {Array.isArray(messages) && messages.slice(0, 4).map((msg: any) => (
                            <div key={msg.id} className="flex items-center gap-8 p-6 rounded-3xl bg-muted/20 border border-border/30 hover:border-primary/20 transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center text-primary font-black shadow-inner border border-border/50 group-hover:bg-primary group-hover:text-white transition-colors">
                                    {msg.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-black text-sm truncate text-foreground">{msg.name}</h4>
                                        <span className="text-[10px] font-bold text-muted-foreground/30">
                                            {new Date(msg.sentDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground/60 truncate italic">{msg.message}</p>
                                </div>
                                <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    msg.isRead ? "bg-muted-foreground/20" : "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                )} />
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Tactical Ops */}
                <motion.div variants={itemVariants} className="lg:col-span-4 space-y-10">
                    <div className="bg-primary p-12 rounded-[3.5rem] text-primary-foreground space-y-8 shadow-2xl shadow-primary/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -z-1 group-hover:scale-150 transition-transform duration-1000" />
                        <Terminal size={40} className="opacity-40" />
                        <h3 className="text-3xl font-black leading-tight tracking-tighter">{isRtl ? 'حالة النظام الحرجة' : 'Mission critical status'}</h3>
                        <p className="text-sm font-medium opacity-80 leading-relaxed">{isRtl ? 'بنية النظام تعمل بكفاءة 100٪. جميع طبقات الأمان مفعّلة. العقد متزامنة عالمياً.' : 'System architecture is operating at 100% efficiency. All security layers are verified. Live nodes are synchronized globally.'}</p>
                        <div className="pt-6">
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                    className="h-full bg-white/40"
                                />
                            </div>
                            <div className="flex justify-between mt-4 text-xs font-bold tracking-tight opacity-60">
                                <span>{isRtl ? 'التحسين' : 'Optimization'}</span>
                                <span>{isRtl ? 'حمل النظام: 12٪' : 'Core load: 12%'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-12 rounded-[3.5rem] border border-border/50 space-y-8">
                        <h3 className="text-sm font-bold tracking-tight text-muted-foreground/60">{isRtl ? 'أوامر سريعة' : 'Quick commands'}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/admin/projects" className="p-5 rounded-2xl bg-muted/40 border border-border hover:border-primary/40 transition-all text-center group">
                                <Briefcase size={20} className="mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold tracking-tight text-foreground">{isRtl ? 'إضافة مشروع' : 'Add work'}</span>
                            </Link>
                            <Link to="/admin/blog" className="p-5 rounded-2xl bg-muted/40 border border-border hover:border-primary/40 transition-all text-center group">
                                <BookOpen size={20} className="mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold tracking-tight text-foreground">{isRtl ? 'مقال جديد' : 'New research'}</span>
                            </Link>
                        </div>
                        <Link to="/" target="_blank" className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-background border border-border font-bold text-sm tracking-tight hover:border-primary transition-all group text-foreground">
                            {isRtl ? 'عرض الموقع' : 'Live frontend'}
                            <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminDashboardPage;
