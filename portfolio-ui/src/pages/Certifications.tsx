import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { certificationsApi } from '../api/certifications';
import {
    ExternalLink, Calendar,
    Search,
    Sparkles, GraduationCap, Trophy,
    Bookmark
} from 'lucide-react';
import placeholderImg from '../assets/images/myimage1.png';
import { cn } from '../utils';

const Certifications = () => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const [activeFilter, setActiveFilter] = useState('All');

    const { data: certifications, isLoading } = useQuery({
        queryKey: ['certifications'],
        queryFn: certificationsApi.getAll,
    });

    const categories = useMemo(() => {
        if (!certifications) return ['All'];
        const unique = Array.from(new Set(certifications.map(c => c.platformType)));
        return ['All', ...unique];
    }, [certifications]);

    const filteredCerts = useMemo(() => {
        if (!certifications) return [];
        if (activeFilter === 'All') return certifications;
        return certifications.filter(c => c.platformType === activeFilter);
    }, [certifications, activeFilter]);

    if (isLoading) {
        return (
            <div className="min-h-screen pt-40 pb-20 bg-background">
                <div className="container-max px-6">
                    <div className="animate-pulse space-y-12">
                        <div className="h-10 w-64 bg-muted rounded-full mx-auto" />
                        <div className="h-20 w-3/4 bg-muted rounded-3xl mx-auto" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-80 bg-muted rounded-[2.5rem]" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-background">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] -z-10" />

            <div className="container-max px-6">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 mx-auto">
                        <Trophy size={18} className="text-primary" />
                        <span className="text-primary font-bold text-sm">
                            {t('certificates.title')}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter text-foreground leading-[1.1]">
                        {isAr ? "التميز في كل خطوة" : "Excellence in Every Step"}
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
                        {t('certificates.subtitle')}
                    </p>
                </motion.div>

                {/* Platform Filters */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={cn(
                                "px-8 py-3 rounded-2xl text-sm font-bold transition-all border",
                                activeFilter === cat
                                    ? "bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/20 scale-105"
                                    : "bg-muted text-muted-foreground border-transparent hover:border-primary/50"
                            )}
                        >
                            {cat === 'All' ? t('certificates.all') : (cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase())}
                        </button>
                    ))}
                </div>

                {/* Certificates Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredCerts.map((cert) => (
                            <motion.div
                                key={cert.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
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
                                                        : `${import.meta.env.VITE_API_URL.replace('/api', '')}${cert.platformLogoUrl}`}
                                                    alt=""
                                                    className="max-w-full max-h-full object-contain"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg ...></svg>'; // Fallback to icon
                                                    }}
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
                                                <span className="text-yellow-500" title="Featured">
                                                    <Sparkles size={16} fill="currentColor" />
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black mb-4 leading-tight group-hover:text-primary transition-colors">
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
                    </AnimatePresence>
                </motion.div>

                {filteredCerts.length === 0 && (
                    <div className="text-center py-40 bg-card rounded-[4rem] border border-dashed border-border">
                        <Search className="mx-auto text-muted-foreground mb-6 opacity-20" size={80} />
                        <h3 className="text-2xl font-bold text-muted-foreground">
                            {isAr ? "لم يتم العثور على شهادات" : "No certificates found"}
                        </h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Certifications;
