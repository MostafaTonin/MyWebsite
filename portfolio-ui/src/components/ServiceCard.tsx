
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ChevronRight, ArrowUpRight, Code2, Database,
    AppWindow, Smartphone, GraduationCap, Users, Layout, Sparkles
} from 'lucide-react';
import placeholderImg from '../assets/images/myimage1.png';

interface ServiceCardProps {
    service: any;
    isAr: boolean;
    variants?: any;
    showFooter?: boolean;
}

const resolveServiceIcon = (title: string) => {
    const t = (title || "").toLowerCase();
    if (t.includes('web') || t.includes('ويب')) return <Code2 size={28} />;
    if (t.includes('desktop') || t.includes('سطح المكتب')) return <AppWindow size={28} />;
    if (t.includes('mobile') || t.includes('موبايل') || t.includes('flutter')) return <Smartphone size={28} />;
    if (t.includes('database') || t.includes('قواعد')) return <Database size={28} />;
    if (t.includes('consult') || t.includes('استشارات')) return <Users size={28} />;
    if (t.includes('uni') || t.includes('جامعية') || t.includes('طلاب')) return <GraduationCap size={28} />;
    return <Layout size={28} />;
};

const isValidUrl = (u?: string) => {
    if (!u) return false;
    try { new URL(u); return true; } catch { return false; }
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isAr, variants, showFooter = true }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const description = isAr ? service.descriptionAr : service.descriptionEn;
    const title = isAr ? service.titleAr : service.titleEn;

    return (
        <motion.div
            variants={variants}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="group relative h-full flex flex-col items-center text-center justify-between p-10 md:p-12 rounded-[3.5rem] bg-card border border-border hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
        >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="text-primary/50" />
            </div>

            {service.showOnHome && (
                <div className="absolute top-8 left-8 p-3 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center gap-2 border border-amber-500/20 shadow-xl shadow-amber-500/5">
                    <Sparkles size={14} fill="currentColor" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest leading-none pt-0.5">{isAr ? "مميزة" : "Featured"}</span>
                </div>
            )}

            <div className="mb-10 p-6 bg-primary/5 rounded-[2.2rem] w-fit text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner overflow-hidden text-2xl h-14 w-14 flex items-center justify-center">
                {service.iconUrl && isValidUrl(service.iconUrl) ? (
                    <img
                        src={service.iconUrl.startsWith('http')
                            ? service.iconUrl
                            : `${import.meta.env.VITE_API_URL.replace('/api', '')}${service.iconUrl}`}
                        alt=""
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                ) : (
                    resolveServiceIcon(isAr ? service.titleAr : service.titleEn)
                )}
            </div>

            <h3 className="text-2xl font-black mb-6 tracking-tight text-foreground group-hover:text-primary transition-colors">
                {title}
            </h3>

            <div className="flex-1 w-full service-desc-center mb-8">
                <p className={"text-muted-foreground leading-relaxed text-sm w-full " + (isExpanded ? '' : 'line-clamp-2')}>
                    {description}
                </p>
            </div>

            {description?.length > 180 && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-primary text-sm font-bold mt-2 underline mb-4"
                >
                    {isExpanded ? (isAr ? 'قراءة أقل' : 'Read less') : (isAr ? 'اقرأ المزيد' : 'Read more')}
                </button>
            )}

            {showFooter && (
                <div className="pt-8 border-t border-border/50 w-full">
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 text-[13px] font-bold text-primary hover:gap-4 transition-all"
                    >
                        {isAr ? 'اطلب الخدمة الآن' : 'Request Service Now'}
                        <ChevronRight size={16} />
                    </Link>
                </div>
            )}
        </motion.div>
    );
};

export default ServiceCard;
