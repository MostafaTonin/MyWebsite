import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Project } from '../types/api';

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
    const { t, i18n } = useTranslation();

    if (!project) return null;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5027/api';
    const BASE_URL = API_URL.replace('/api', '');

    const getFullImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const isArabic = i18n.language === 'ar';
    const title = isArabic ? project.titleAr : project.titleEn;
    const description = isArabic ? project.descriptionAr : project.descriptionEn;
    const techStack = project.technologyStack?.split(',').map(t => t.trim()) || [];
    const mainImage = project.imageUrls?.[0];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-background w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden pointer-events-auto border border-border flex flex-col max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="relative h-48 sm:h-64 bg-muted">
                                {/* Image Placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-primary/5">
                                    {mainImage ? (
                                        <img src={getFullImageUrl(mainImage)} alt={title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-bold opacity-10">{title}</span>
                                    )}
                                </div>

                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 bg-background/50 backdrop-blur-md rounded-full hover:bg-background transition-colors text-foreground"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto">
                                <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {techStack.map((tech) => (
                                        <span key={tech} className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    {description}
                                </p>

                                <div className="flex gap-4 pt-4 border-t border-border">
                                    {project.projectUrl && (
                                        <a
                                            href={project.projectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                                        >
                                            <ExternalLink size={18} />
                                            {t('projects.view_more')}
                                        </a>
                                    )}
                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
                                        >
                                            <Github size={18} />
                                            Source Code
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProjectModal;
