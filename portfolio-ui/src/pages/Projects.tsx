import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsApi } from '../api/projects';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Plus,
    Github, ArrowUpRight, Globe,
    X, ChevronRight,
    Target, ShieldCheck, Sparkles
} from 'lucide-react';
import { cn } from '../utils';

const Projects = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useAuth();

    const isAr = i18n.language === 'ar';
    const isAdmin = user?.roles?.includes('Admin');

    // Core state for responsiveness
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [selectedProject, setSelectedProject] = useState<any>(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5027/api';
    const BASE_URL = API_URL.replace('/api', '');

    const { data: projects, isLoading, refetch } = useQuery({
        queryKey: ['projects'],
        queryFn: projectsApi.getAll,
    });

    // Sync state with URL params
    useEffect(() => {
        const cat = searchParams.get('category') || 'All';
        if (cat !== selectedCategory) {
            setSelectedCategory(cat);
        }
    }, [searchParams]);

    // Handle background refresh
    useEffect(() => {
        refetch();
    }, [selectedCategory, refetch]);

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        setSearchParams({ category: cat }, { replace: true });
    };

    const categories = useMemo(() => {
        if (!projects) return ['All'];
        const uniqueCategories = Array.from(new Set(projects.map(p => p.category)));
        return ['All', ...uniqueCategories];
    }, [projects]);

    const filteredProjects = useMemo(() => {
        if (!projects) return [];
        if (selectedCategory === 'All') return projects;
        return projects.filter(p => p.category === selectedCategory);
    }, [projects, selectedCategory]);

    const getFullImageUrl = (url?: string) => {
        if (!url) return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200';
        if (url.startsWith('http')) return url;
        return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    if (isLoading) {
        return (
            <div className="relative min-h-screen pt-40 pb-32 bg-background">
                <div className="container-max px-6">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 w-48 bg-muted rounded-full mx-auto" />
                        <div className="h-16 w-3/4 bg-muted rounded-2xl mx-auto" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-[400px] bg-muted rounded-[3rem]" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-background">
            {/* Design Elements */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10" />

            <div className="container-max px-6">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="flex flex-col items-center gap-6 mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mx-auto shadow-sm">
                            <Sparkles size={16} className="text-primary" />
                            <span className="text-primary font-bold text-sm">
                                {isAr ? "معرض أعمالي" : "My Portfolio"}
                            </span>
                        </div>

                        {isAdmin && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/admin/projects', { state: { openCreateModal: true } })}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-black text-xs shadow-xl shadow-primary/20 border border-primary/30 hover:brightness-110 transition-all font-outfit"
                            >
                                <Plus size={16} />
                                {isAr ? 'مشروع جديد' : 'New Project'}
                            </motion.button>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tight text-foreground">
                        {isAr ? "مشاريعي المتميزة" : "Featured Projects"}
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
                        {isAr
                            ? "مجموعة من التطبيقات والأنظمة التي قمت بتطويرها خلال رحلتي الأكاديمية والمهنية."
                            : "A collection of applications and systems developed throughout my academic and professional journey."}
                    </p>
                </motion.div>

                <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category || 'All')}
                            className={cn(
                                "px-8 py-3 rounded-2xl text-sm font-bold transition-all border",
                                selectedCategory === (category || 'All')
                                    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                        >
                            {category === 'All' ? (isAr ? "الكل" : "All") : (category ? (category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()) : '')}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <motion.div
                    key={selectedCategory} // Force re-render for smooth section switch
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                className="group relative rounded-[3rem] bg-card border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <img
                                        src={getFullImageUrl(project.images?.[0]?.imageUrl)}
                                        alt={isAr ? project.titleAr : project.titleEn}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                                        <div className="flex gap-4">
                                            {project.githubUrl && (
                                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-primary transition-colors">
                                                    <Github size={20} />
                                                </a>
                                            )}
                                            {project.projectUrl && (
                                                <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-primary transition-colors">
                                                    <Globe size={20} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute top-6 right-6">
                                        <div className="px-4 py-1.5 bg-black/50 backdrop-blur-md border border-white/20 rounded-full text-white text-[11px] font-bold font-outfit">
                                            {project.category.charAt(0).toUpperCase() + project.category.slice(1).toLowerCase()}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-10 flex flex-col flex-grow">
                                    <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">
                                        {isAr ? project.titleAr : project.titleEn}
                                    </h3>
                                    <p className="text-muted-foreground text-sm font-medium line-clamp-2 mb-8 flex-grow">
                                        {isAr ? project.descriptionAr : project.descriptionEn}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {project.technologyStack.split(',').slice(0, 3).map((tech: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-primary/5 text-primary rounded-lg text-[11px] font-bold tracking-tight">
                                                {tech.trim()}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setSelectedProject(project)}
                                        className="inline-flex items-center gap-2 text-[13px] font-bold text-primary hover:gap-4 transition-all"
                                    >
                                        {isAr ? "تفاصيل المشروع" : "Project Details"}
                                        <ChevronRight size={16} className={isAr ? "rotate-180" : ""} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Project Details Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-5xl max-h-[90vh] bg-card rounded-[3.5rem] shadow-2xl overflow-hidden border border-border flex flex-col"
                        >
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-8 right-8 z-[110] p-4 bg-background/50 backdrop-blur-md hover:bg-background rounded-2xl transition-all border border-white/10"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex-grow overflow-y-auto custom-scrollbar">
                                <div className="relative aspect-[16/9] md:aspect-[21/9] w-full">
                                    <img
                                        src={getFullImageUrl(selectedProject.images?.[0]?.imageUrl)}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                    <div className="absolute bottom-12 left-12 right-12">
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            {selectedProject.technologyStack.split(',').map((tech: string, i: number) => (
                                                <span key={i} className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-white text-xs font-bold border border-white/10 font-outfit">
                                                    {tech.trim()}
                                                </span>
                                            ))}
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                            {isAr ? selectedProject.titleAr : selectedProject.titleEn}
                                        </h2>
                                    </div>
                                </div>

                                <div className="p-10 md:p-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
                                    <div className="lg:col-span-2 space-y-12">
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-black tracking-tight">{isAr ? "نظرة عامة على المشروع" : "Project Overview"}</h3>
                                            <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                                                {isAr ? selectedProject.descriptionAr : selectedProject.descriptionEn}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="p-8 rounded-[2rem] bg-muted/30 border border-border">
                                                <Target className="text-primary mb-4" size={32} />
                                                <h4 className="font-black mb-2">{isAr ? "التحدي" : "The Challenge"}</h4>
                                                <p className="text-sm text-muted-foreground font-medium">
                                                    {isAr ? "بناء نظام يوفر سرعة عالية في معالجة البيانات مع واجهة مستخدم بديهية." : "Building a system that provides high data processing speed with an intuitive user interface."}
                                                </p>
                                            </div>
                                            <div className="p-8 rounded-[2rem] bg-muted/30 border border-border">
                                                <ShieldCheck className="text-accent mb-4" size={32} />
                                                <h4 className="font-black mb-2">{isAr ? "النتيجة" : "The Result"}</h4>
                                                <p className="text-sm text-muted-foreground font-medium">
                                                    {isAr ? "تم إكمال المشروع بنجاح مع تحقيق كافة الأهداف التقنية المطلوبة." : "The project was successfully completed achieving all required technical objectives."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="space-y-6 p-10 bg-muted/30 rounded-[2.5rem] border border-border">
                                            <h4 className="text-[12px] font-bold text-primary font-outfit">{isAr ? "معلومات المشروع" : "Project Info"}</h4>
                                            <div className="space-y-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[11px] font-bold text-muted-foreground/60">{isAr ? "العميل" : "Client"}</span>
                                                    <span className="font-bold">{selectedProject.clientName}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[11px] font-bold text-muted-foreground/60">{isAr ? "التصنيف" : "Category"}</span>
                                                    <span className="font-bold">{selectedProject.category.charAt(0).toUpperCase() + selectedProject.category.slice(1).toLowerCase()}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[11px] font-bold text-muted-foreground/60">{isAr ? "التاريخ" : "Date"}</span>
                                                    <span className="font-bold">{new Date(selectedProject.createdDate).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' })}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            {selectedProject.projectUrl && (
                                                <a href={selectedProject.projectUrl} target="_blank" rel="noopener noreferrer"
                                                    className="w-full flex items-center justify-center gap-3 py-6 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                                    {isAr ? "عرض المشروع لايف" : "Launch Live Demo"}
                                                    <ArrowUpRight size={20} />
                                                </a>
                                            )}
                                            {selectedProject.githubUrl && (
                                                <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer"
                                                    className="w-full flex items-center justify-center gap-3 py-6 bg-card border border-border rounded-2xl font-bold text-lg hover:bg-muted transition-all">
                                                    {isAr ? "مشاهدة الكود" : "View Source Code"}
                                                    <Github size={20} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Projects;
