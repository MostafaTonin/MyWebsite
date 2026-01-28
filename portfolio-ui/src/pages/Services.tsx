import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '../api/services';
import { useAuth } from '../contexts/AuthContext';
import ServiceCard from '../components/ServiceCard';
import {
    Target, ShieldCheck,
    Rocket, RefreshCcw
} from 'lucide-react';
import { Sparkles, Plus } from 'lucide-react';

const Services = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAr = i18n.language === 'ar';
    const isAdmin = user?.roles?.includes('Admin');

    const { data: services, isLoading } = useQuery({
        queryKey: ['services'],
        queryFn: servicesApi.getAll,
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0
        }
    };


    return (
        <div className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-background">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
                <div className="grid-pattern opacity-[0.03] absolute inset-0" />
            </div>

            <div className="container-max px-6">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <div className="flex flex-col items-center gap-6 mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mx-auto shadow-sm">
                            <Sparkles size={16} className="text-primary" />
                            <span className="text-primary font-bold text-sm">
                                {isAr ? "خدماتي المهنية" : "Professional Services"}
                            </span>
                        </div>

                        {isAdmin && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/admin/services', { state: { openCreateModal: true } })}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-black text-xs shadow-xl shadow-primary/20 border border-primary/30 hover:brightness-110 transition-all font-outfit"
                            >
                                <Plus size={16} />
                                {isAr ? 'خدمة جديدة' : 'New Service'}
                            </motion.button>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tight text-foreground">
                        {isAr ? "الخدمات التي أقدمها" : "Services I Provide"}
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
                        {isAr
                            ? "أقدم حلولاً برمجية متكاملة مصممة بدقة لتلبية احتياجاتك، من بناء التطبيقات المعقدة إلى الدعم التعليمي المخصص."
                            : "Delivering integrated software solutions precisely engineered to meet your needs, from building complex apps to personalized educational support."}
                    </p>
                </motion.div>

                {/* Services Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="p-12 rounded-[3.5rem] bg-card border border-border h-96 animate-pulse">
                                <div className="p-6 bg-muted rounded-[2rem] w-fit mb-8 h-20 w-20" />
                                <div className="h-8 bg-muted rounded w-3/4 mb-4" />
                                <div className="h-4 bg-muted rounded w-full mb-2" />
                                <div className="h-4 bg-muted rounded w-5/6" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <AnimatePresence>
                        {services?.length === 2 ? (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex justify-center gap-8 mb-32 px-6"
                            >
                                {services.map((service) => (
                                    <ServiceCard
                                        key={service.id}
                                        service={service}
                                        isAr={isAr}
                                        variants={itemVariants}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32"
                            >
                                {services?.map((service) => (
                                    <ServiceCard
                                        key={service.id}
                                        service={service}
                                        isAr={isAr}
                                        variants={itemVariants}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {/* Why Choose Me Section */}
                <section className="mt-32 px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                            {isAr ? "لماذا تختارني؟" : "Why Choose Me?"}
                        </h2>
                        <p className="text-muted-foreground font-medium">
                            {isAr ? "أركز على الجودة، الالتزام، والتميز في كل سطر برمجيات" : "Focusing on quality, commitment, and excellence in every line of code"}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Rocket,
                                title: isAr ? 'الالتزام التام' : 'Full Commitment',
                                desc: isAr ? 'تسليم المشاريع في المواعيد المحددة وبأعلى معايير الجودة' : 'Delivering projects on time with the highest quality standards'
                            },
                            {
                                icon: ShieldCheck,
                                title: isAr ? 'كود نظيف' : 'Clean Code',
                                desc: isAr ? 'كتابة كود برمجى منظم وقابل للتطوير وفق أفضل الممارسات' : 'Writing organized, scalable code according to best practices'
                            },
                            {
                                icon: RefreshCcw,
                                title: isAr ? 'دعم مستمر' : 'Continuous Support',
                                desc: isAr ? 'تقديم الدعم التقني والتحديثات المطلوبة حتى بعد تسليم المشروع' : 'Providing technical support and updates even after project delivery'
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-[2.5rem] bg-card/50 border border-border text-center hover:border-primary/20 transition-all"
                            >
                                <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                    <item.icon size={30} />
                                </div>
                                <h4 className="text-xl font-black mb-4">{item.title}</h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Strategic CTA Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-40 p-16 md:p-24 rounded-[4rem] bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 text-center relative overflow-hidden group shadow-2xl"
                >
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
                    <h2 className="text-3xl md:text-5xl font-black mb-10 tracking-tight text-foreground px-4">
                        {isAr ? "هل لديك فكرة مشروع؟" : "Have a Project Idea?"}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium">
                        {isAr
                            ? "دعنا نتحدث عن رؤيتك ونبني معاً شيئاً مذهلاً."
                            : "Let's discuss your vision and build something amazing together."}
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-3 px-12 py-6 bg-primary text-primary-foreground rounded-2xl font-black text-xl shadow-xl shadow-primary/30 hover:scale-[1.05] active:scale-95 transition-all"
                    >
                        {isAr ? "تواصل معي الآن" : "Connect With Me Now"}
                        <Target size={24} />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Services;
