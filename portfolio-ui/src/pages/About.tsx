import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { aboutApi } from '../api/about';
import { Download, Mail, Award, Briefcase, Code, Users, Clock, Target, TrendingUp, CheckCircle, GraduationCap, Code2, Smartphone, FileSpreadsheet, UserCheck, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../utils';
import { useState, useEffect } from 'react';
import HeroImageFallback from '../assets/images/myimage3.png';

const About = () => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const { data: aboutData, isLoading } = useQuery({
        queryKey: ['about'],
        queryFn: aboutApi.get,
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5027/api';
    const BASE_URL = API_URL.replace('/api', '');

    const getImageUrl = (url: string | undefined) => {
        if (!url || url === '/images/about/profile.jpg') return HeroImageFallback;
        if (url.startsWith('http')) return url;
        return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const [counters, setCounters] = useState({
        years: 0,
        projects: 0,
        technologies: 0,
        certificates: 0,
        freelance: 0,
    });

    // Animated Counters
    useEffect(() => {
        if (!aboutData) return;

        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        const targets = {
            years: aboutData.yearsOfExperience || 0,
            projects: aboutData.projectsCompleted || 0,
            technologies: aboutData.technologiesCount || 0,
            certificates: aboutData.certificatesCount || 0,
            freelance: aboutData.freelanceProjectsCount || 0,
        };

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            setCounters({
                years: Math.floor(targets.years * progress),
                projects: Math.floor(targets.projects * progress),
                technologies: Math.floor(targets.technologies * progress),
                certificates: Math.floor(targets.certificates * progress),
                freelance: Math.floor(targets.freelance * progress),
            });

            if (step >= steps) {
                clearInterval(timer);
                setCounters(targets);
            }
        }, interval);

        return () => clearInterval(timer);
    }, [aboutData]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
            </div>
        );
    }

    if (!aboutData) return null;

    const softSkills = isAr
        ? aboutData.softSkillsAr?.split(',').map((s: string) => s.trim()).filter(Boolean) || []
        : aboutData.softSkillsEn?.split(',').map((s: string) => s.trim()).filter(Boolean) || [];

    return (
        <div className="min-h-screen bg-background" dir={isAr ? 'rtl' : 'ltr'}>
            {/* Hero About Section */}
            {(aboutData.showHeroAbout ?? true) && (
                <section className="relative py-20 lg:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
                    <div className="container-max px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Image */}
                            <motion.div
                                initial={{ opacity: 0, x: isAr ? 50 : -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="relative order-1 lg:order-2"
                            >
                                <div className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-square">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-3xl blur-2xl opacity-20"></div>
                                    <img
                                        src={getImageUrl(aboutData.imageUrl)}
                                        onError={(e) => { (e.target as HTMLImageElement).src = HeroImageFallback; }}
                                        alt={isAr ? aboutData.fullNameAr : aboutData.fullNameEn}
                                        className="relative rounded-3xl shadow-2xl w-full h-full object-cover border-4 border-card"
                                    />
                                </div>
                            </motion.div>

                            {/* Content */}
                            <motion.div
                                initial={{ opacity: 0, x: isAr ? -50 : 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="space-y-8 text-center lg:text-start order-2 lg:order-1"
                            >
                                <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold shadow-sm">
                                    {isAr ? aboutData.titleAr : aboutData.titleEn}
                                </div>

                                <div className="space-y-4">
                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                                        {isAr ? aboutData.fullNameAr : aboutData.fullNameEn}
                                    </h1>

                                    <p className="text-xl lg:text-2xl text-primary font-bold">
                                        {isAr ? aboutData.positionAr : aboutData.positionEn}
                                    </p>
                                </div>

                                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    {isAr ? aboutData.bioAr : aboutData.bioEn}
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                                    {aboutData.cvUrl && (
                                        <a
                                            href={aboutData.cvUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all"
                                        >
                                            <Download size={20} />
                                            {t('about.download_cv', { defaultValue: 'Download CV' })}
                                        </a>
                                    )}
                                    <Link
                                        to="/contact"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-card border-2 border-border rounded-xl font-bold hover:border-primary hover:text-primary transition-all"
                                    >
                                        <Mail size={20} />
                                        {t('about.contact_me', { defaultValue: 'Contact Me' })}
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            )}

            {/* Stats Section */}
            {(aboutData.showStats ?? true) && (
                <section className="py-16 bg-muted/30">
                    <div className="container-max px-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                            {[
                                { icon: Clock, value: counters.years, label: isAr ? 'سنوات الخبرة' : 'Years Experience', color: 'text-blue-500' },
                                { icon: Briefcase, value: counters.projects, label: isAr ? 'مشروع منجز' : 'Projects Completed', color: 'text-green-500' },
                                { icon: Code, value: counters.technologies, label: isAr ? 'تقنية' : 'Technologies', color: 'text-purple-500' },
                                { icon: Award, value: counters.certificates, label: isAr ? 'شهادة' : 'Certificates', color: 'text-orange-500' },
                                { icon: TrendingUp, value: counters.freelance, label: isAr ? 'مشروع فريلانس' : 'Freelance Projects', color: 'text-pink-500' },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center space-y-3"
                                >
                                    <div className={`inline-flex p-4 rounded-2xl bg-card shadow-sm ${stat.color}`}>
                                        <stat.icon size={32} />
                                    </div>
                                    <div className="text-4xl font-black">{stat.value}+</div>
                                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Extended Bio Section */}
            {(aboutData.showExtendedBio ?? true) && (
                <section className="py-20">
                    <div className="container-max px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-4xl mx-auto"
                        >
                            <h2 className="text-2xl lg:text-3xl font-black mb-8 text-center">
                                {isAr ? 'نبذة مفصلة' : 'Detailed Overview'}
                            </h2>
                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                                    {isAr ? aboutData.extendedBioAr : aboutData.extendedBioEn}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Soft Skills Section */}
            {(aboutData.showSoftSkills ?? true) && softSkills.length > 0 && (
                <section className="py-20 bg-muted/30">
                    <div className="container-max px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl lg:text-3xl font-black mb-12 text-center">
                                {isAr ? 'المهارات الشخصية' : 'Soft Skills'}
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                {softSkills.map((skill: string, index: number) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-4 p-6 bg-card rounded-2xl shadow-sm border border-border hover:border-primary transition-all"
                                    >
                                        <CheckCircle className="text-primary flex-shrink-0" size={24} />
                                        <span className="font-bold text-lg">{skill}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Experience Section */}
            {(aboutData.showExperience ?? true) && (
                <section className="py-20">
                    <div className="container-max px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="flex flex-col items-center gap-4 mb-16 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4"
                                >
                                    <Users size={32} />
                                </motion.div>
                                <h2 className="text-3xl lg:text-5xl font-black tracking-tight">
                                    {isAr ? 'الخبرات والمسار المهني' : 'Experience & Career Path'}
                                </h2>
                                <p className="text-muted-foreground text-lg max-w-2xl font-medium">
                                    {isAr
                                        ? "خلاصة سنوات من التعلم والممارسة في بناء الحلول التقنية المتكاملة."
                                        : "A summary of years of learning and practice in building integrated technical solutions."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                                {[
                                    {
                                        titleAr: "مشاريع جامعية متميزة",
                                        titleEn: "Advanced Academic Projects",
                                        descAr: "تطوير أنظمة إدارة متكاملة وحلول برمجية معقدة خلال الرحلة الأكاديمية.",
                                        descEn: "Developed integrated management systems and complex software solutions during the academic journey.",
                                        icon: <GraduationCap size={28} />,
                                        color: "text-blue-500"
                                    },
                                    {
                                        titleAr: "مشاريع Freelance وحلول تقنية",
                                        titleEn: "Freelance & Technical Solutions",
                                        descAr: "بناء مواقع ويب وتطبيقات عصرية تلبي تطلعات العملاء وتركز على تجربة المستخدم.",
                                        descEn: "Building modern websites and applications that meet client expectations and focus on UX.",
                                        icon: <Briefcase size={28} />,
                                        color: "text-emerald-500"
                                    },
                                    {
                                        titleAr: "تدريب احترافي (ProgrammingAdvices)",
                                        titleEn: "Professional Training (ProgrammingAdvices)",
                                        descAr: "رحلة مكثفة من التأسيس إلى الاحتراف في أساسيات البرمجة، إتقان C# و .NET، وفهم عميق لأساسيات الويب (HTML, CSS, JS). بناء أنظمة ومشاريع حقيقية من الصفر مع التركيز على المرونة، الأداء العالي، قابلية التوسع، الـ Best Practices والـ Reusability في .NET و React عبر منصة Programmingadvices.com العالمية.",
                                        descEn: "An intensive journey from programming fundamentals to mastery, mastering C# and .NET, with a deep understanding of web essentials (HTML, CSS, JS). Building real-world systems from scratch focusing on flexibility, performance, scalability, Best Practices, and Reusability in .NET and React via the world-class Programmingadvices.com platform.",
                                        icon: <Code2 size={28} />,
                                        color: "text-orange-500",
                                        featured: true
                                    },
                                    {
                                        titleAr: "تطوير تطبيقات الموبايل",
                                        titleEn: "Mobile App Development",
                                        descAr: "احتراف بناء تطبيقات الموبايل باستخدام Flutter و C#، مع إتقان بناء واستهلاك الـ Web APIs من التأسيس إلى الاحتراف عبر منصة Programmingadvices.com.",
                                        descEn: "Mastering mobile app development with Flutter and C#, including building and consuming Web APIs from scratch to mastery via Programmingadvices.com.",
                                        icon: <Smartphone size={28} />,
                                        color: "text-purple-500"
                                    },
                                    {
                                        titleAr: "احتراف حزمة Microsoft Office",
                                        titleEn: "Microsoft Office Excellence",
                                        descAr: "إتقان متقدم لبرامج (Word, Excel, PowerPoint) لتنظيم البيانات والعروض التقديمية الاحترافية.",
                                        descEn: "Advanced proficiency in Word, Excel, and PowerPoint for data organization and professional presentations.",
                                        icon: <FileSpreadsheet size={28} />,
                                        color: "text-blue-600"
                                    },
                                    {
                                        titleAr: "تصميم وتحليل قواعد البيانات",
                                        titleEn: "Database Design & Analysis",
                                        descAr: "رحلة متكاملة من التأسيس إلى الاحتراف في هندسة وتصميم قواعد البيانات، بناء هيكليات متينة، وتحسين استعلامات SQL عبر منصة Programmingadvices.com.",
                                        descEn: "A comprehensive journey from scratch to mastery in database engineering and design, building robust schemas and optimizing SQL queries via Programmingadvices.com.",
                                        icon: <Database size={28} />,
                                        color: "text-cyan-600"
                                    },
                                    {
                                        titleAr: "الدعم الفني والتعاون",
                                        titleEn: "Technical Support & Collaboration",
                                        descAr: "تقديم الدعم الفني للزملاء والطلاب وتبادل الخبرات البرمجية لتطوير المجتمعات التقنية.",
                                        descEn: "Providing technical support to peers and students, exchanging coding expertise to develop tech communities.",
                                        icon: <UserCheck size={28} />,
                                        color: "text-rose-500"
                                    }
                                ].map((exp, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={cn(
                                            "p-8 rounded-[2rem] bg-card border border-border hover:border-primary/30 transition-all group flex flex-col h-full",
                                            exp.featured && "border-primary/20 shadow-lg shadow-primary/5 bg-gradient-to-br from-card to-primary/5"
                                        )}
                                    >
                                        <div className={cn("mb-6 w-14 h-14 rounded-2xl bg-muted flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3", exp.color)}>
                                            {exp.icon}
                                        </div>
                                        <h3 className="text-xl font-black mb-3">
                                            {isAr ? exp.titleAr : exp.titleEn}
                                        </h3>
                                        <p className="text-muted-foreground font-medium leading-relaxed">
                                            {isAr ? exp.descAr : exp.descEn}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="container-max px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto space-y-6"
                    >
                        <h2 className="text-3xl lg:text-4xl font-black">
                            {isAr ? 'هل لديك مشروع؟' : 'Have a Project in Mind?'}
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            {isAr
                                ? 'دعنا نتعاون لتحويل أفكارك إلى واقع رقمي مبهر'
                                : "Let's collaborate to turn your ideas into stunning digital reality"}
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all"
                        >
                            <Target size={24} />
                            {isAr ? 'ابدأ مشروعك الآن' : 'Start Your Project'}
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
