import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Github, Linkedin, Mail, Twitter, Globe, MapPin,
    Instagram, Send, ChevronDown,
    Briefcase, Sparkles, MessageSquare, ArrowUpRight
} from 'lucide-react';
import { socialLinksApi } from '../api/socialLinks';
import { siteSectionsApi } from '../api/siteSections';
import { cn } from '../utils';

const Footer = () => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const year = new Date().getFullYear();
    const [openSection, setOpenSection] = useState<string | null>(null);

    const navLinks = [
        { name: t('navbar.home'), path: '/' },
        { name: t('navbar.about'), path: '/about' },
        { name: t('navbar.skills'), path: '/skills' },
        { name: t('navbar.certifications'), path: '/certifications' },
        { name: t('navbar.projects'), path: '/projects' },
        { name: t('navbar.services'), path: '/services' },
        { name: t('navbar.blog'), path: '/blog' },
        { name: t('navbar.contact'), path: '/contact' },
    ];

    const { data: socialLinks } = useQuery({
        queryKey: ['social-links'],
        queryFn: socialLinksApi.getAll
    });

    const getSocialIcon = (name: string) => {
        const n = (name || '').toLowerCase();
        if (n.includes('github')) return <Github size={20} />;
        if (n.includes('linkedin')) return <Linkedin size={20} />;
        if (n.includes('twitter') || n.includes('x')) return <Twitter size={20} />;
        if (n.includes('instagram')) return <Instagram size={20} />;
        if (n.includes('telegram')) return <Send size={20} />;
        return <Globe size={20} />;
    };

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const FooterSection = ({ title, id, children }: { title: string, id: string, children: ReactNode }) => (
        <div className="border-b border-white/5 md:border-none last:border-none">
            <button
                onClick={() => toggleSection(id)}
                className="w-full md:cursor-default flex items-center justify-between py-6 md:py-0 md:mb-8 text-center md:text-start group"
            >
                <h4 className="flex-1 md:flex-none text-[12px] font-black text-zinc-400 transition-colors group-hover:text-primary">
                    {title}
                </h4>
                <ChevronDown
                    size={16}
                    className={cn(
                        "text-zinc-500 transition-transform duration-500 md:hidden",
                        openSection === id ? "rotate-180" : ""
                    )}
                />
            </button>
            <AnimatePresence>
                {(openSection === id || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden md:!h-auto md:!opacity-100"
                    >
                        <div className="pb-8 md:pb-0">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <footer className="relative bg-[#080808] text-white pt-24 pb-12 overflow-hidden border-t border-white/10">
            {/* Background Decorations */}
            <div className="absolute top-0 inset-0 pointer-events-none -z-10">
                <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] opacity-50" />
                <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] opacity-30" />
                <div className="grid-pattern opacity-[0.03]" />
            </div>

            <div className="container-max px-8">
                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-16 gap-y-16 lg:gap-y-0 mb-24">

                    {/* Brand & Bio */}
                    <div className="lg:col-span-4 space-y-8 flex flex-col items-center lg:items-start text-center lg:text-start">
                        <Link to="/" className="inline-flex items-center gap-4 group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-primary/40 group-hover:scale-105 transition-all duration-500">
                                MT
                            </div>
                            <div className="flex flex-col text-start">
                                <span className="text-2xl font-black tracking-tighter leading-none mb-1 text-white">
                                    {isAr ? "مصطفى طنين" : "Mostafa Tonin"}
                                </span>
                                <span className="text-[11px] font-bold text-primary">
                                    {isAr ? "دقة، إبداع، احترافية" : "Precision & Innovation"}
                                </span>
                            </div>
                        </Link>

                        <p className="text-zinc-300 font-medium leading-relaxed max-w-sm text-base">
                            {t('footer.bio')}
                        </p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl group cursor-pointer hover:border-primary/40 transition-all"
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            <span className="text-zinc-100 font-bold text-sm group-hover:text-primary transition-colors">
                                {t('footer.status')}
                            </span>
                        </motion.div>
                    </div>

                    {/* Navigation Section */}
                    <div className="lg:col-span-3 text-center md:text-start">
                        <FooterSection title={t('footer.navigation')} id="sitemap">
                            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className="inline-flex items-center justify-center md:justify-start gap-3 text-[14px] font-bold text-zinc-300 hover:text-primary transition-all duration-300 group"
                                    >
                                        <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </FooterSection>
                    </div>

                    {/* Contact Section */}
                    <div className="lg:col-span-3 text-center md:text-start">
                        <FooterSection title={t('footer.contact_info')} id="contact">
                            <div className="space-y-6 flex flex-col items-center md:items-start">
                                <a href="mailto:moustafa.tonin@gmail.com" className="flex items-center gap-4 group">
                                    <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all text-zinc-400 group-hover:text-white shadow-lg">
                                        <Mail size={20} />
                                    </div>
                                    <div className="flex flex-col text-start">
                                        <span className="text-[11px] font-bold text-zinc-500 mb-0.5">Write to me</span>
                                        <span className="text-sm font-bold text-zinc-100 truncate max-w-[180px]">moustafa.tonin@gmail.com</span>
                                    </div>
                                </a>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-zinc-400 shadow-lg">
                                        <MapPin size={20} />
                                    </div>
                                    <div className="flex flex-col text-start">
                                        <span className="text-[11px] font-bold text-zinc-500 mb-0.5">Office Base</span>
                                        <span className="text-sm font-bold text-zinc-100">{t('contact.info.address')}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 shadow-lg shadow-green-500/5">
                                        <Briefcase size={20} />
                                    </div>
                                    <div className="flex flex-col text-start">
                                        <span className="text-[11px] font-bold text-zinc-500 mb-0.5">Work Protocol</span>
                                        <span className="text-sm font-bold text-green-400">{t('footer.freelance')}</span>
                                    </div>
                                </div>
                            </div>
                        </FooterSection>
                    </div>

                    {/* CTA Column */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/10 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <Sparkles className="absolute -top-2 -right-2 text-primary opacity-20 group-hover:scale-150 transition-transform duration-1000" size={64} />
                            <h5 className="text-[13px] font-black text-zinc-100 mb-5 relative z-10 tracking-tight">{isAr ? "لديك فكرة؟" : "Got an Idea?"}</h5>
                            <Link
                                to="/contact"
                                className="flex flex-col items-center justify-center text-center gap-3 w-full min-h-[110px] p-4 bg-primary text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-[1.05] active:scale-95 group/btn relative z-[30] cursor-pointer pointer-events-auto"
                            >
                                <span className="text-[14px] leading-snug">
                                    {t('footer.hire_me')}
                                </span>
                                <ArrowUpRight size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="space-y-5">
                            <p className="text-[11px] font-bold text-zinc-500 text-center lg:text-start leading-none">{t('footer.follow_me')}</p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                                {(socialLinks || []).map((link) => (
                                    <motion.a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, y: -4 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all group shadow-lg"
                                        title={link.platform}
                                    >
                                        <div className="group-hover:text-primary transition-colors text-zinc-400">
                                            {getSocialIcon(link.platform || link.iconName)}
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-start">
                    <p className="text-[12px] font-medium text-zinc-500">
                        {t('footer.rights').replace('2026', year.toString())}
                    </p>

                    <div className="flex flex-wrap justify-center items-center gap-6 text-[11px] font-bold text-zinc-400">
                        <div className="flex items-center gap-2.5 hover:text-primary transition-colors cursor-pointer group">
                            <Globe size={14} className="text-primary/60 group-hover:rotate-12 transition-transform" />
                            {isAr ? "صنعاء، اليمن" : "Sanaa, Yemen"}
                        </div>
                        <div className="hidden md:block w-[1px] h-4 bg-white/10" />
                        <div className="flex items-center gap-2.5 hover:text-accent transition-colors cursor-pointer group">
                            <Sparkles size={14} className="text-accent/60 group-hover:scale-110 transition-transform" />
                            {isAr ? "مهندس تقنية معلومات" : "IT Engineer"}
                        </div>
                        <div className="hidden md:block w-[1px] h-4 bg-white/10" />
                        <div className="flex items-center gap-2.5 hover:text-emerald-500 transition-colors cursor-pointer group">
                            <MessageSquare size={14} className="text-emerald-500/60 group-hover:-translate-y-0.5 transition-transform" />
                            {isAr ? "متاح للعمل" : "Available for Work"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Bottom Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent blur-sm" />
        </footer>
    );
};

export default Footer;
