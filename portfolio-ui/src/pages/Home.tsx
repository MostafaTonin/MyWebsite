import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
    ArrowRight, Terminal, ChevronRight, Target, Monitor, Smartphone, Zap,
    ExternalLink, Github, BookOpen, Clock, Trophy, GraduationCap,
    Sparkles, Bookmark, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../utils';
import { aboutApi } from '../api/about';
import { projectsApi } from '../api/projects';
import { servicesApi } from '../api/services';
import { blogApi } from '../api/blog';
import { certificationsApi } from '../api/certifications';
import ServiceCard from '../components/ServiceCard';
import HeroImageFallback from '../assets/images/myimage3.png';

// Animated Counter Component
const Counter = ({ value, label }: { value: string, label: string }) => {
    const num = parseInt(value) || 0;
    const suffix = value.replace(/[0-9]/g, '');
    const [count, setCount] = useState(0);
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView && num > 0) {
            let start = 0;
            const end = num;
            const duration = 2000;
            const incrementTime = (duration / end) * 0.8;

            const timer = setInterval(() => {
                start += 1;
                setCount(start);
                if (start >= end) clearInterval(timer);
            }, Math.max(incrementTime, 50));

            return () => clearInterval(timer);
        }
    }, [isInView, num]);

    return (
        <div ref={ref} className="space-y-2 text-center lg:text-start">
            <h3 className="text-3xl font-black text-foreground tabular-nums tracking-tighter flex items-center justify-center lg:justify-start">
                {num > 0 ? count : 0}{suffix}
            </h3>
            <p className="text-[13px] font-bold text-muted-foreground/80">{label}</p>
        </div>
    );
};

const Home: React.FC = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
    const isAr = i18n.language === 'ar';

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5027/api';
    const BASE_URL = API_URL.replace('/api', '');

    const { data: aboutData } = useQuery({ queryKey: ['about'], queryFn: aboutApi.get });
    const { data: projects } = useQuery({ queryKey: ['projects-home'], queryFn: projectsApi.getFeatured });
    const { data: services } = useQuery({ queryKey: ['services-home'], queryFn: servicesApi.getHome });
    const { data: blogData } = useQuery({
        queryKey: ['blog-home'],
        queryFn: () => blogApi.getPosts(1, 3),
        enabled: aboutData?.showBlogSection
    });
    const { data: certifications } = useQuery({
        queryKey: ['certs-home'],
        queryFn: certificationsApi.getFeatured,
        enabled: aboutData?.showCertificationsSection
    });

    const getFullImageUrl = (url: string | undefined) => {
        if (!url) return HeroImageFallback;
        if (url.startsWith('http')) return url;
        return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.3 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-premium font-sans">
            <div className="grid-pattern" />

            {/* Premium Animated Background Orbs */}
            <div className="absolute top-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.08, 0.15, 0.08],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="orb -top-[10%] -right-[5%] w-[1000px] h-[1000px] bg-primary"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.05, 0.1, 0.05],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="orb -bottom-[10%] -left-[10%] w-[900px] h-[900px] bg-accent"
                />
            </div>

            {/* HERO SECTION */}
            <div className="container-max pt-32 lg:pt-48 pb-20 px-6 lg:px-12">
                <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-16 lg:gap-24">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex-1 text-center lg:text-start perspective-1000"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full glass border border-primary/10 mb-10 mx-auto lg:mx-0 shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-primary font-bold text-sm">
                                {isAr ? aboutData?.heroGreetingAr : aboutData?.heroGreetingEn}
                            </span>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-8 text-foreground">
                            <span className="block drop-shadow-sm opacity-90">
                                {isAr ? aboutData?.fullNameAr : aboutData?.fullNameEn}
                            </span>
                            <span className="text-gradient block mt-3">
                                {isAr ? aboutData?.positionAr : aboutData?.positionEn}
                            </span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-12 font-bold tracking-tight whitespace-pre-line">
                            {isAr
                                ? (aboutData?.heroBioAr || aboutData?.bioAr)
                                : (aboutData?.heroBioEn || aboutData?.bioEn)}
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
                            <Link to="/projects" className="btn-premium w-full sm:w-auto overflow-hidden group">
                                <span className="relative z-10">
                                    {isAr ? aboutData?.ctaPrimaryTextAr : aboutData?.ctaPrimaryTextEn}
                                </span>
                                <ArrowRight className={cn("w-5 h-5 transition-transform group-hover:translate-x-2 relative z-10", isRTL && "rotate-180 group-hover:-translate-x-2")} />
                            </Link>
                            <Link to="/contact" className="w-full sm:w-auto px-14 py-7 glass-card rounded-[2.5rem] font-black text-xl tracking-tight hover:bg-muted/30 flex items-center justify-center gap-4 group text-foreground border-border/50 transition-all hover:border-primary/20">
                                {isAr ? aboutData?.ctaSecondaryTextAr : aboutData?.ctaSecondaryTextEn}
                                <ChevronRight size={16} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </Link>
                        </motion.div>

                        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-24 pt-16 border-t border-border/10 max-w-3xl mx-auto lg:mx-0">
                            {[
                                { label: t('hero.stats.experience'), value: `${aboutData?.yearsOfExperience || 1}+` },
                                { label: t('hero.stats.projects'), value: `${aboutData?.projectsCompleted || 5}+` },
                                { label: t('hero.stats.technologies'), value: `${aboutData?.technologiesCount || 10}+` },
                                { label: t('hero.stats.certificates'), value: `${aboutData?.certificatesCount || 0}+` },
                            ].map((stat, i) => (
                                <Counter key={`hero-stat-${i}`} value={stat.value} label={stat.label} />
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-1 relative w-full flex justify-center lg:justify-end py-10"
                    >
                        <div className="relative w-80 h-80 sm:w-[550px] sm:h-[550px] perspective-1000 group">
                            <svg className="absolute inset-0 w-full h-full -z-10 animate-pulse text-primary/10" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.1" />
                                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.1" />
                                <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="0.1" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    whileHover={{ rotateY: -5, rotateX: 2, scale: 1.01 }}
                                    transition={{ duration: 0.8 }}
                                    className="relative w-[85%] h-[85%] rounded-[4rem] lg:rounded-[5rem] overflow-hidden border-[1px] border-white/20 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] transition-all duration-700 bg-card"
                                >
                                    <img src={getFullImageUrl(aboutData?.imageUrl)} alt={t('hero.name')} className="w-full h-full object-cover transition-all duration-1000 hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-40" />
                                </motion.div>
                            </div>
                            {/* Technical Badges */}
                            <FloatingBadge icon={<Terminal size={16} className="text-primary" />} label={(isAr ? aboutData?.badge1Ar : aboutData?.badge1En) || t('hero.badges.web')} className="top-0 -left-10" delay={0.2} />
                            <FloatingBadge icon={<Monitor size={16} className="text-blue-500" />} label={(isAr ? aboutData?.badge2Ar : aboutData?.badge2En) || t('hero.badges.desktop')} className="top-1/4 -left-16" delay={0.4} />
                            <FloatingBadge icon={<Smartphone size={16} className="text-purple-500" />} label={(isAr ? aboutData?.badge3Ar : aboutData?.badge3En) || t('hero.badges.mobile')} className="bottom-1/4 -left-12" delay={0.6} />
                            <FloatingBadge icon={<Target size={16} className="text-emerald-500" />} label={(isAr ? aboutData?.badge4Ar : aboutData?.badge4En) || t('hero.badges.mentorship')} className="top-1/3 -right-10" delay={0.8} />
                            <FloatingBadge icon={<Zap size={16} className="text-amber-500" />} label={(isAr ? aboutData?.badge5Ar : aboutData?.badge5En) || t('hero.badges.learning')} className="bottom-5 right-10" delay={1} />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* SERVICES PREVIEW */}
            {(aboutData?.showServicesSection ?? true) && (
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-secondary/10 skew-y-2 transform origin-bottom-right" />
                    <div className="container-max px-6 relative z-10">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20 px-6">
                            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">{t('services.title')}</h2>
                            <p className="max-w-3xl mx-auto text-lg text-muted-foreground font-medium leading-relaxed">
                                {isAr
                                    ? "حلول برمجية مبتكرة مصممة خصيصاً لنمو عملك، نجمع فيها بين الكفاءة التقنية والرؤية الاستراتيجية لتحويل رؤيتك إلى واقع رقمي ملموس."
                                    : "Innovative software solutions tailored for your business growth, combining technical excellence with strategic vision to transform your vision into tangible digital reality."}
                            </p>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services?.map((service, idx) => (
                                <ServiceCard
                                    key={`service-home-${service.id}-${idx}`}
                                    service={service}
                                    isAr={isAr}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: { delay: idx * 0.1 }
                                        }
                                    }}
                                />
                            ))}
                        </div>
                        <div className="mt-16 text-center">
                            <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 bg-muted hover:bg-muted/80 rounded-2xl font-black text-sm transition-all">
                                {isAr ? "استعرض جميع الخدمات" : "Explore All Services"}
                                <ArrowRight size={18} className={isRTL ? "rotate-180" : ""} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* FEATURED PROJECTS */}
            {(aboutData?.showProjectsSection ?? true) && (
                <section className="py-24 bg-gradient-to-b from-background to-background/50">
                    <div className="container-max px-6">
                        <div className="flex flex-col items-center mb-16 gap-6 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="max-w-3xl"
                            >
                                <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">{t('projects.title')}</h2>
                                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                                    {isAr
                                        ? "شاهد كيف أحول الأفكار المعقدة إلى واجهات رقمية مبسطة وحلول برمجية قوية، مصممة خصيصاً لتحقيق أهدافك التقنية والتجارية."
                                        : "See how I transform complex ideas into intuitive digital interfaces and robust software solutions, engineered specifically to drive your technical and business success."}
                                </p>
                            </motion.div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects?.slice(0, 3).map((project, idx) => (
                                <motion.div
                                    key={`project-home-${project.id || idx}`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.2 }}
                                    viewport={{ once: true }}
                                    className="group relative rounded-[2.5rem] overflow-hidden border border-border/50 bg-card aspect-video lg:aspect-[16/10]"
                                >
                                    <img src={getFullImageUrl(project.imageUrls?.[0])} alt="Project" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                                    {project.isFeatured && (
                                        <div className="absolute top-6 left-6 z-10 text-yellow-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                                            <Sparkles size={24} fill="currentColor" />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-end items-start text-white">
                                        <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 w-full">
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {project.technologyStack.split(',').slice(0, 3).map((t, tIdx) => (
                                                    <span key={`home-tech-${project.id}-${tIdx}`} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-xs font-bold border border-white/10">{t.trim()}</span>
                                                ))}
                                            </div>
                                            <h3 className="text-2xl font-black mb-2">{isAr ? project.titleAr : project.titleEn}</h3>
                                            <p className="text-white/70 text-sm line-clamp-2 mb-6">{isAr ? project.descriptionAr : project.descriptionEn}</p>
                                            <div className="flex gap-4">
                                                {project.projectUrl && <a href={project.projectUrl} target="_blank" rel="noreferrer" className="p-3 bg-primary rounded-xl hover:bg-primary/90 transition-colors"><ExternalLink size={20} /></a>}
                                                {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="p-3 glass rounded-xl hover:bg-white/20 transition-colors"><Github size={20} /></a>}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-16 text-center">
                            <Link to="/projects" className="inline-flex items-center gap-3 px-8 py-4 bg-muted hover:bg-muted/80 rounded-2xl font-black text-sm transition-all group">
                                {isAr ? "استعرض جميع المشاريع" : "Explore All Projects"}
                                <ArrowRight size={18} className={cn("transition-transform group-hover:translate-x-1", isRTL && "rotate-180 group-hover:-translate-x-1")} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* CERTIFICATIONS SECTION */}
            {(aboutData?.showCertificationsSection && certifications && certifications.length > 0) && (
                <section className="py-24 relative">
                    <div className="container-max px-6">
                        <div className="text-center mb-16">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 mx-auto"
                            >
                                <Trophy size={18} className="text-primary" />
                                <span className="text-primary font-bold text-sm">
                                    {t('certificates.title')}
                                </span>
                            </motion.div>
                            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">{isAr ? "التميز في كل خطوة" : "Excellence in Every Step"}</h2>
                            <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
                                {isAr
                                    ? "سجل حافل بالشهائد المعتمدة من أكبر الهيئات التقنية العالمية، مما يعزز ثقتك في جودة وحداثة الحلول التي أقدمها لك."
                                    : "A proven track record of certified expertise from top global tech authorities, reinforcing your confidence in the quality and modernity of the solutions I provide."}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {certifications.slice(0, 3).map((cert, idx) => (
                                <motion.div
                                    key={`cert-home-${cert.id}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group relative flex flex-col h-full bg-card rounded-[3rem] border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                                >
                                    <div className="absolute top-0 inset-x-0 h-2 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

                                    <div className="p-10 flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="w-16 h-16 rounded-2xl bg-muted p-3 flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors overflow-hidden">
                                                {cert.platformLogoUrl ? (
                                                    <img
                                                        src={cert.platformLogoUrl.startsWith('http')
                                                            ? cert.platformLogoUrl
                                                            : `${BASE_URL}${cert.platformLogoUrl.startsWith('/') ? '' : '/'}${cert.platformLogoUrl}`}
                                                        alt=""
                                                        className="max-w-full max-h-full object-contain"
                                                    />
                                                ) : (
                                                    <GraduationCap size={32} className="text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="px-3 py-1 bg-primary/5 text-primary rounded-lg text-[11px] font-bold">
                                                    {cert.category.charAt(0).toUpperCase() + cert.category.slice(1).toLowerCase()}
                                                </span>
                                                {cert.isFeatured && (
                                                    <span className="text-yellow-500 mt-1" title="Featured">
                                                        <Sparkles size={16} fill="currentColor" />
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black mb-4 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                            {isAr ? cert.titleAr : cert.titleEn}
                                        </h3>

                                        <div className="flex items-center gap-3 text-sm text-muted-foreground font-bold mb-8">
                                            <Bookmark size={16} className="text-primary/40" />
                                            {isAr ? cert.issuerAr : cert.issuerEn}
                                        </div>

                                        <div className="mt-auto pt-8 border-t border-border flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/60">
                                                <Calendar size={14} />
                                                {new Date(cert.issueDate).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', year: 'numeric' })}
                                            </div>

                                            {cert.certificateUrl && (
                                                <a
                                                    href={cert.certificateUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-[12px] font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
                                                >
                                                    {t('certificates.view')}
                                                    <ExternalLink size={14} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-16 text-center">
                            <Link to="/certifications" className="inline-flex items-center gap-3 px-8 py-4 bg-muted hover:bg-muted/80 rounded-2xl font-black text-sm transition-all group">
                                {isAr ? "عرض جميع الشهادات" : "View All Certifications"}
                                <ArrowRight size={18} className={cn("transition-transform group-hover:translate-x-1", isRTL && "rotate-180 group-hover:-translate-x-1")} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* BLOG SECTION */}
            {(aboutData?.showBlogSection && blogData && blogData.posts.length > 0) && (
                <section className="py-24 bg-muted/30 relative">
                    <div className="container-max px-6">
                        <div className="flex flex-col items-center mb-16 gap-6 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="max-w-3xl"
                            >
                                <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">{isAr ? "المدونة التقنية" : "Knowledge Hub"}</h2>
                                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                                    {isAr
                                        ? "اكتشف منصتي المعرفية حيث أشاركك شغفي في هندسة البرمجيات، أسرار الكود النظيف، وآخر اتجاهات التكنولوجيا لتلهم رحلتك البرمجية."
                                        : "Explore my Knowledge Hub where I share my passion for software engineering, clean code secrets, and the latest tech trends to inspire your development journey."}
                                </p>
                            </motion.div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {blogData.posts.map((post, idx) => (
                                <motion.div
                                    key={`blog-home-${post.id}`}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group bg-card rounded-[2rem] overflow-hidden border border-border/50 hover:shadow-2xl hover:shadow-primary/5 transition-all"
                                >
                                    <div className="aspect-[16/9] overflow-hidden relative">
                                        <img src={getFullImageUrl(post.imageUrl)} alt={post.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-4 py-1.5 bg-background/80 backdrop-blur-md rounded-full text-[10px] font-black text-primary border border-primary/20">
                                                {isAr ? post.categoryNameAr : (post.categoryNameEn ? (post.categoryNameEn.charAt(0).toUpperCase() + post.categoryNameEn.slice(1).toLowerCase()) : '')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-4 text-[11px] text-muted-foreground mb-4 font-bold tracking-tight">
                                            <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readingTimeInMinutes} {t('blog.reading_time')}</span>
                                            <span className="flex items-center gap-1.5"><BookOpen size={12} /> {new Date(post.publishedDate).toLocaleDateString(i18n.language)}</span>
                                        </div>
                                        <h3 className="text-xl font-black mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                                            <Link to={`/blog/${post.slug}`}>{isAr ? post.titleAr : post.titleEn}</Link>
                                        </h3>
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 font-medium leading-relaxed">
                                            {isAr ? post.summaryAr : post.summaryEn}
                                        </p>
                                        <Link to={`/blog/${post.slug}`} className="text-primary font-black text-sm flex items-center gap-2 group/link">
                                            {isAr ? "اقرأ المزيد" : "Read More"}
                                            <ArrowRight size={16} className={cn("transition-transform group-hover:translate-x-1", isRTL && "rotate-180")} />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-16 text-center">
                            <Link to="/blog" className="inline-flex items-center gap-3 px-8 py-4 bg-muted hover:bg-muted/80 rounded-2xl font-black text-sm transition-all group">
                                {isAr ? "استعرض جميع القالات" : "View All Posts"}
                                <ArrowRight size={18} className={cn("transition-transform group-hover:translate-x-1", isRTL && "rotate-180 group-hover:-translate-x-1")} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA SECTION */}
            {(aboutData?.showContactSection ?? true) && (
                <section className="py-24 relative overflow-hidden">
                    <div className="container-max px-6">
                        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-[3rem] bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 border border-primary/20 p-12 lg:p-24 text-center overflow-hidden">
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h2 className="text-3xl md:text-4xl font-black mb-8 tracking-tight">{t('contact.title')}</h2>
                                <p className="text-lg text-muted-foreground mb-12 font-medium">{isAr ? "مستعد لتحويل فكرتك إلى واقع؟ دعنا نبني شيئاً مذهلاً معاً." : "Ready to turn your idea into reality? Let's build something amazing together."}</p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <Link to="/contact" className="px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1">{t('contact.subtitle')}</Link>
                                    <Link to="/services" className="px-10 py-5 glass border border-border rounded-2xl font-black text-lg hover:bg-muted/50 transition-all">{t('hero.cta_support')}</Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}
        </div>
    );
};

const FloatingBadge = ({ icon, label, className, delay }: { icon: React.ReactNode; label: string; className: string; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
        transition={{ delay: delay, y: { duration: 4, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 1 }, scale: { duration: 1 } }}
        className={cn("absolute z-20 flex items-center gap-3 px-4 py-2.5 glass-card rounded-2xl shadow-xl border-white/10 hidden md:flex min-w-max backdrop-blur-3xl group/badge hover:border-primary/40 transition-colors", className)}
    >
        <div className="p-2 bg-background rounded-lg shadow-inner border border-border/50 group-hover/badge:scale-110 transition-transform duration-500">
            {icon}
        </div>
        <span className="font-bold text-xs tracking-tight text-foreground/90">{label}</span>
    </motion.div>
);

export default Home;
