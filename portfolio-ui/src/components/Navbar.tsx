import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const { language, changeLanguage } = useLanguage();
    const isAr = language === 'ar';
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

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

    return (
        <nav
            className={cn(
                "fixed w-full z-50 transition-all duration-500",
                scrolled
                    ? "py-4 glass border-b shadow-2xl shadow-black/5"
                    : "py-8 bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <NavLink to="/" className="group flex items-center gap-3">
                            <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-xl shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
                                MT
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-[18px] font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight font-outfit">
                                    {isAr ? "مصطفى طنين" : "Mostafa Tonin"}
                                </span>
                                <span className="text-[11px] font-semibold text-primary/80 font-outfit mt-0.5">
                                    {isAr ? "مهندس برمجيات" : "Software Engineer"}
                                </span>
                            </div>
                        </NavLink>
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-2">
                        {navLinks.map((link, index) => (
                            <motion.div
                                key={link.path}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <NavLink
                                    to={link.path}
                                    className={({ isActive }) =>
                                        cn(
                                            "relative px-5 py-2.5 rounded-xl text-[15px] font-bold tracking-tight transition-all duration-300",
                                            isActive
                                                ? "text-primary bg-primary/5"
                                                : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                                        )
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {link.name}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="nav-active"
                                                    className="absolute inset-0 bg-primary/10 rounded-xl -z-10"
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            </motion.div>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-2xl hover:bg-muted text-foreground transition-all active:scale-90 border border-border/50 hover:border-primary/20"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-primary" />}
                        </button>

                        <button
                            onClick={() => changeLanguage(language === 'en' ? 'ar' : 'en')}
                            className="flex items-center gap-3 px-5 py-3 rounded-2xl hover:bg-muted border border-border/50 hover:border-primary/20 transition-all active:scale-95 group"
                        >
                            <Globe size={18} className="text-primary group-hover:rotate-180 transition-transform duration-700" />
                            <span className="text-sm font-black tracking-tight">{language === 'en' ? 'العربية' : 'English'}</span>
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden flex items-center gap-2">
                        <button
                            onClick={() => changeLanguage(language === 'en' ? 'ar' : 'en')}
                            className="flex items-center gap-2 px-3 py-3 rounded-2xl bg-muted/50 text-foreground border border-border/50 font-black text-xs"
                            title={language === 'en' ? 'Arabic' : 'English'}
                        >
                            <Globe size={18} className="text-primary" />
                            <span>{language === 'en' ? 'AR' : 'EN'}</span>
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-2xl bg-muted/50 text-foreground border border-border/50"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={toggleMenu}
                            className="p-3 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 border border-primary/20"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="lg:hidden glass border-b overflow-hidden shadow-2xl"
                    >
                        <div className="px-6 pt-4 pb-10 space-y-3">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        cn(
                                            "flex items-center px-6 py-4 rounded-2xl text-[17px] font-bold tracking-tight transition-all",
                                            isActive
                                                ? "bg-primary text-white shadow-xl shadow-primary/20"
                                                : "text-foreground hover:bg-muted/50 border border-transparent hover:border-border"
                                        )
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
