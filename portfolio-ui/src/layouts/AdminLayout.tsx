import { useState, useLayoutEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    Briefcase,
    Code,
    Wrench,
    BookOpen,
    User,
    MessageSquare,
    LogOut,
    Menu,
    X,
    Globe,
    ShieldCheck,
    ChevronRight,
    Search,
    Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const contentRef = useRef<HTMLDivElement>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isRtl = i18n.language === 'ar';

    // Reset scroll when location changes
    useLayoutEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTo(0, 0);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(newLang);
    };

    const menuItems = [
        { path: '/admin/dashboard', label: t('admin.dashboard'), icon: LayoutDashboard },
        { path: '/admin/about', label: t('admin.about'), icon: User },
        { path: '/admin/projects', label: t('admin.projects'), icon: Briefcase },
        { path: '/admin/skills', label: t('admin.skills'), icon: Code },
        { path: '/admin/services', label: t('admin.services'), icon: Wrench },
        { path: '/admin/certifications', label: t('admin.certifications'), icon: Award },
        { path: '/admin/blog', label: t('admin.blog'), icon: BookOpen },
        { path: '/admin/messages', label: t('admin.messages'), icon: MessageSquare },
        { path: '/admin/navigation', label: t('admin.navigation', { defaultValue: 'Navigation' }), icon: Globe },
        { path: '/admin/users', label: t('admin.users'), icon: ShieldCheck },
    ];

    const activePage = menuItems.find(item => location.pathname === item.path);

    return (
        <div className={cn("flex h-screen bg-background overflow-hidden", isRtl ? "font-arabic rtl" : "font-sans ltr")} dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static inset-y-0 z-50 w-72 bg-card border-x border-border transform transition-all duration-500 ease-in-out",
                isRtl ? "right-0" : "left-0",
                sidebarOpen ? "translate-x-0" : (isRtl ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0")
            )}>
                <div className="flex flex-col h-full glass border-none">
                    {/* Brand Header */}
                    <div className="p-8 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <ShieldCheck size={22} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black uppercase tracking-widest text-foreground">{t('admin.panel_title')}</h2>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50 tracking-tighter">{t('admin.welcome')}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden p-2 rounded-lg hover:bg-muted"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => cn(
                                    "group relative flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon size={20} className={cn("transition-transform group-hover:scale-110")} />
                                <span className="flex-1">{item.label}</span>
                                <ChevronRight size={14} className={cn(
                                    "opacity-0 group-hover:opacity-40 transition-all",
                                    isRtl ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"
                                )} />
                            </NavLink>
                        ))}
                    </nav>

                    {/* Footer Actions */}
                    <div className="p-6 mt-auto border-t border-border/50 bg-muted/20 space-y-3">
                        <div className="flex items-center gap-4 px-4 py-3 bg-background rounded-2xl border border-border/50 mb-6 group cursor-pointer hover:border-primary/30 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-0.5">
                                <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-primary font-bold text-xs">
                                    {user?.username?.substring(0, 2).toUpperCase()}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-black truncate">{user?.username}</p>
                                <p className="text-[10px] text-muted-foreground truncate">Senior Administrator</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center justify-center gap-2 p-3 rounded-xl glass hover:bg-primary hover:text-white transition-all text-xs font-black uppercase tracking-widest"
                            >
                                <Globe size={14} />
                                {i18n.language === 'ar' ? 'English' : 'AR'}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all text-xs font-black uppercase tracking-widest"
                            >
                                <LogOut size={14} />
                                {t('admin.logout')}
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header Nav */}
                <header className="h-20 bg-card/50 backdrop-blur-xl border-b border-border/50 px-8 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-3 rounded-xl bg-muted text-foreground"
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-black tracking-tight flex items-center gap-3">
                                {activePage?.label}
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-xl border border-border/50">
                            <Search size={16} className="text-muted-foreground" />
                            <input
                                type="text"
                                placeholder={t('admin.common.command_center_search')}
                                className="bg-transparent border-none outline-none text-xs font-medium w-48"
                            />
                        </div>
                        <div className="w-[1px] h-6 bg-border mx-2 hidden sm:block" />
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                            {t('admin.common.live_system')}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main
                    ref={contentRef}
                    className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar scroll-smooth"
                >
                    <div className="max-w-6xl mx-auto">
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminLayout;
