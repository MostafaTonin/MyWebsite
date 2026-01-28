import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { skillsApi } from '../api/skills';
import {
    Code, Cpu, Sparkles, Briefcase, Mail, Zap, Search,
    Trophy, Target, Clock, X,
    Database, Server, Layout, Smartphone, ShieldCheck,
    Cloud, GitBranch, Wrench, History as HistoryIcon, ArrowLeftRight,
    Terminal, Globe, Users, Settings, Activity, FileCode,
    Box, Layers
} from 'lucide-react';
import { cn } from '../utils';

const Skills = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { t } = useTranslation();

    // Core state for responsiveness
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
    const [searchQuery, setSearchQuery] = useState('');
    const isAr = i18n.language === 'ar';

    const { data: skills, isLoading, refetch } = useQuery({
        queryKey: ['skills'],
        queryFn: skillsApi.getAll,
    });

    // Sync state with URL if it changes externally (e.g. back button)
    useEffect(() => {
        const cat = searchParams.get('category') || 'All';
        if (cat !== activeCategory) {
            setActiveCategory(cat);
        }
    }, [searchParams]);

    // Background Refresh Logic: Triggered whenever category changes
    useEffect(() => {
        refetch();
    }, [activeCategory, refetch]);

    const handleCategoryChange = (cat: string) => {
        setActiveCategory(cat);
        setSearchParams({ category: cat }, { replace: true });
        // Clear search when category changes for cleaner UX
        setSearchQuery('');
    };

    // Normalize text by removing ALL whitespace and converting to lowercase
    const normalizeText = (text: any) => {
        if (!text) return '';
        return String(text)
            .replace(/[\u200B-\u200D\uFEFF\s]/g, '') // Remove ALL whitespace
            .toLowerCase(); // Convert to lowercase for comparison
    };

    const categories = useMemo(() => {
        if (!skills) return ['All'];

        const uniqueMap = new Map();

        skills.forEach(skill => {
            const raw = skill.category || '';
            const normalized = normalizeText(raw);

            if (normalized && !uniqueMap.has(normalized)) {
                // Store the original trimmed version for display
                uniqueMap.set(normalized, String(raw).trim());
            }
        });

        return ['All', ...Array.from(uniqueMap.values())];
    }, [skills]);

    const filteredSkills = useMemo(() => {
        if (!skills) return [];

        const result = skills.filter(skill => {
            // Category filter
            const isAll = activeCategory === 'All';
            const normalizedActive = normalizeText(activeCategory);
            const normalizedSkill = normalizeText(skill.category);
            const matchesCategory = isAll || normalizedActive === normalizedSkill;

            // Search filter
            let matchesSearch = true;
            if (searchQuery.trim()) {
                const skillName = isAr ? skill.nameAr : skill.nameEn;
                const normalizedSearch = searchQuery.toLowerCase().trim();
                const normalizedSkillName = skillName.toLowerCase().trim();
                matchesSearch = normalizedSkillName.includes(normalizedSearch);
            }

            return matchesCategory && matchesSearch;
        });

        return result;
    }, [skills, activeCategory, searchQuery, isAr]);

    const stats = useMemo(() => {
        if (!skills) return { technologies: 0, fields: 0, experts: 0 };
        return {
            technologies: skills.length,
            fields: new Set(skills.map(s => s.category)).size,
            experts: skills.filter(s => s.proficiency >= 90).length
        };
    }, [skills]);

    const getCategoryTranslation = (cat: string) => {
        if (!cat) return '';
        if (cat === 'All') return t('skills.categories.all');

        const normalized = normalizeText(cat);
        const mapping: Record<string, string> = {
            'softskills': 'soft_skills',
            'frontenddevelopment': 'frontend_development',
            'backenddevelopment': 'backend_development',
            'databases': 'databases',
            'database': 'databases',
            'mobiledevelopment': 'mobile_development',
            'mobileapps': 'mobile_development',
            'devtools': 'dev_tools',
            'devopsandtools': 'dev_tools',
            'desktopapplications': 'desktop_applications',
        };

        const key = mapping[normalized];
        if (key) {
            return t(`skills.categories.${key}`);
        }

        return cat; // Fallback to raw string if no translation found
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const renderSkillIcon = (skill: any, size = 28) => {
        const name = (skill.nameEn || "").toLowerCase().trim();
        const category = (skill.category || "").toLowerCase();
        const iconUrl = skill.iconUrl;

        // 1. Priority: User Provided URL (External or Uploaded)
        if (iconUrl && iconUrl.trim() !== '') {
            const src = iconUrl.startsWith('http')
                ? iconUrl
                : `${import.meta.env.VITE_API_URL.replace('/api', '')}${iconUrl.startsWith('/') ? '' : '/'}${iconUrl}`;
            return <img src={src} className="w-full h-full object-contain" alt="" />;
        }

        // 2. Secondary: High-Quality DevIcons for Technical Skills
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
        const nameLower = name.toLowerCase();
        if (nameLower.includes('database') || nameLower.includes('sql') || nameLower.includes('data') || category.includes('database')) return <Database size={size} />;
        if (nameLower.includes('server') || nameLower.includes('backend') || nameLower.includes('api')) return <Server size={size} />;
        if (nameLower.includes('web') || nameLower.includes('frontend') || nameLower.includes('html') || nameLower.includes('css')) return <Layout size={size} />;
        if (nameLower.includes('mobile') || nameLower.includes('app') || nameLower.includes('flutter')) return <Smartphone size={size} />;
        if (nameLower.includes('security') || nameLower.includes('auth')) return <ShieldCheck size={size} />;
        if (nameLower.includes('cloud') || nameLower.includes('azure') || nameLower.includes('aws')) return <Cloud size={size} />;
        if (nameLower.includes('git') || nameLower.includes('version') || nameLower.includes('github')) return <GitBranch size={size} />;
        if (nameLower.includes('tool') || nameLower.includes('devops')) return <Wrench size={size} />;
        if (nameLower.includes('backup') || nameLower.includes('restore')) return <HistoryIcon size={size} />;
        if (nameLower.includes('transaction') || nameLower.includes('transfer')) return <ArrowLeftRight size={size} />;
        if (nameLower.includes('terminal') || nameLower.includes('command') || nameLower.includes('linux')) return <Terminal size={size} />;
        if (nameLower.includes('global') || nameLower.includes('network')) return <Globe size={size} />;
        if (nameLower.includes('user') || nameLower.includes('social') || nameLower.includes('team') || category.includes('soft')) return <Users size={size} />;
        if (nameLower.includes('setting') || nameLower.includes('config')) return <Settings size={size} />;
        if (nameLower.includes('performance') || nameLower.includes('monitor')) return <Activity size={size} />;
        if (nameLower.includes('code') || nameLower.includes('script') || nameLower.includes('programming')) return <FileCode size={size} />;
        if (nameLower.includes('docker') || nameLower.includes('container') || nameLower.includes('deployment')) return <Box size={size} />;
        if (nameLower.includes('architecture') || nameLower.includes('design') || nameLower.includes('system')) return <Layers size={size} />;

        return <Code size={size} />;
    };

    return (
        <div className="min-h-screen pt-32 pb-20 overflow-hidden bg-background">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
                <div className="grid-pattern opacity-[0.03] absolute inset-0" />
            </div>

            <div className="container-max px-6">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 mx-auto shadow-sm">
                        <Sparkles size={16} className="text-primary" />
                        <span className="text-primary font-bold text-sm">
                            {isAr ? "مهاراتي التقنية" : "My Technical Skills"}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                        {isAr ? "القدرات الإبداعية والتقنية" : "Creative & Technical Capabilities"}
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        {isAr
                            ? "مجموعة شاملة من الأدوات والتقنيات التي أتقنها لبناء تطبيقات قوية، قابلة للتطوير وعالية الأداء."
                            : "A comprehensive stack of tools and technologies I've mastered to build robust, scalable, and high-performance applications."}
                    </p>
                </motion.div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col items-stretch gap-6 mb-12 p-4 bg-card/50 backdrop-blur-xl border border-border rounded-3xl shadow-xl">
                    <div className="relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder={isAr ? "ابحث عن تقنية..." : "Search technology..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-12 py-3 bg-background/50 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Category Filters - Scrollable on mobile, wrapped on desktop */}
                    <div className="overflow-x-auto -mx-4 px-4 md:overflow-visible">
                        <div className="flex md:flex-wrap justify-start md:justify-center gap-2 min-w-max md:min-w-0">
                            {categories.map((cat, idx) => (
                                <button
                                    key={`cat-filter-${idx}-${cat}`}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-2xl text-sm font-bold transition-all border whitespace-nowrap flex-shrink-0",
                                        normalizeText(activeCategory) === normalizeText(cat)
                                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                                            : "bg-background/50 border-border hover:border-primary/50 text-muted-foreground"
                                    )}
                                >
                                    {getCategoryTranslation(cat)}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Stats Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {[
                        { icon: Cpu, value: stats.technologies, label: isAr ? 'تقنية متمكنة' : 'Technologies', color: 'text-blue-500' },
                        { icon: Target, value: stats.fields, label: isAr ? 'مجالات مختلفة' : 'Key Domains', color: 'text-emerald-500' },
                        { icon: Trophy, value: stats.experts, label: isAr ? 'إتقان عالي' : 'Expert Levels', color: 'text-amber-500' },
                    ].map((stat, i) => (
                        <motion.div
                            key={`skill-stat-${i}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-[2rem] bg-card border border-border shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 group hover:border-primary/30 transition-all text-center md:text-start"
                        >
                            <div className={cn("p-4 rounded-2xl bg-background border border-border group-hover:scale-110 transition-transform", stat.color)}>
                                <stat.icon size={32} />
                            </div>
                            <div>
                                <div className="text-3xl font-black">{stat.value}+</div>
                                <div className="text-sm font-bold text-muted-foreground">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Skills Grid */}
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
                    <motion.div
                        key={activeCategory} // Force re-render of the grid for smooth response
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode="sync">
                            {filteredSkills.map((skill) => (
                                <motion.div
                                    key={skill.id}
                                    layout
                                    variants={itemVariants}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group relative p-8 rounded-[2.5rem] bg-card border border-border hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5 perspective-1000"
                                >
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center p-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 overflow-hidden text-primary">
                                                {renderSkillIcon(skill)}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black tracking-tight">{isAr ? skill.nameAr : skill.nameEn}</h3>
                                                <p className="text-xs font-bold text-primary/70">{getCategoryTranslation(skill.category)}</p>
                                            </div>
                                        </div>
                                        {skill.yearsOfUse > 0 && (
                                            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black">
                                                {skill.yearsOfUse}+ {isAr ? 'سنوات' : 'Years'}
                                            </div>
                                        )}
                                    </div>


                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[11px] font-bold text-muted-foreground font-outfit">
                                                {isAr ? 'مستوى الإتقان' : 'Proficiency Level'}
                                            </span>
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-black",
                                                skill.proficiency >= 80 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                                                    skill.proficiency >= 50 ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                                                        "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                            )}>
                                                {skill.proficiency >= 80 ? (isAr ? '🟩 خبرة عملية' : '🟩 Practical Experience') :
                                                    skill.proficiency >= 50 ? (isAr ? '🟦 أساس قوي' : '🟦 Strong Foundation') :
                                                        (isAr ? '🟨 تحت التطوير' : '🟨 Under Development')}
                                            </span>
                                        </div>

                                        <div className="h-2.5 w-full bg-secondary/50 rounded-full overflow-hidden p-0.5 border border-border shadow-inner">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.proficiency}%` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className={cn(
                                                    "h-full rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]",
                                                    skill.proficiency >= 80 ? "bg-gradient-to-r from-emerald-500 to-emerald-600" :
                                                        skill.proficiency >= 50 ? "bg-gradient-to-r from-blue-500 to-blue-600" :
                                                            "bg-gradient-to-r from-amber-500 to-amber-600"
                                                )}
                                            />
                                        </div>

                                        <div className="flex items-center gap-2 pt-2">
                                            <Clock size={14} className="text-muted-foreground" />
                                            <span className="text-xs font-bold text-muted-foreground">
                                                {skill.yearsOfUse > 0
                                                    ? (isAr ? `نتاج ${skill.yearsOfUse} سنوات من العمل` : `Result of ${skill.yearsOfUse} years of work`)
                                                    : (isAr ? 'تحت التطوير المستمر' : 'Under continuous development')
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Hover Decorative Element */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Zap className="text-primary animate-pulse" size={20} />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {filteredSkills.length === 0 && !isLoading && (
                    <div className="text-center py-20 bg-card rounded-[3rem] border border-dashed border-border">
                        <Search className="mx-auto text-muted-foreground mb-4 opacity-20" size={64} />
                        <h3 className="text-2xl font-black text-muted-foreground">
                            {isAr ? "لم يتم العثور على مهارات تطابق بحثك" : "No skills found matching your search"}
                        </h3>
                    </div>
                )}

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-24 p-12 rounded-[3.5rem] bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-black mb-8 px-6">
                        {isAr ? "هل تريد رؤية هذه المهارات في العمل؟" : "Want to see these skills in action?"}
                    </h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        <button
                            onClick={() => navigate('/projects')}
                            className="px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1 flex items-center gap-3"
                        >
                            <Briefcase size={24} />
                            {isAr ? "عرض مشاريعي" : "View My Projects"}
                        </button>
                        <button
                            onClick={() => navigate('/contact')}
                            className="px-10 py-5 bg-background border border-border rounded-2xl font-black text-lg hover:bg-muted transition-all flex items-center gap-3"
                        >
                            <Mail size={24} />
                            {isAr ? "تواصل معي" : "Contact Me"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Skills;
