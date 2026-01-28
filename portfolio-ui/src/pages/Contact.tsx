import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Phone,
    Linkedin, Github, Send as Telegram, Instagram,
    CheckCircle2, Loader2, ArrowRight,
    MapPin, Globe, Sparkles, Twitter
} from 'lucide-react';
import { contactApi } from '../api/contact';
import { useQuery } from '@tanstack/react-query';
import { socialLinksApi } from '../api/socialLinks';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils';

const Contact = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language.startsWith('ar');
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [contactMethod, setContactMethod] = useState('Email');

    // Fetch Social Links for the contact section
    const { data: socialLinks = [] } = useQuery({
        queryKey: ['social-links'],
        queryFn: socialLinksApi.getAll
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const contactMethodValue = formData.get('method') as string;
        const data = {
            Name: formData.get('name') as string,
            Email: formData.get('email') as string,
            PhoneNumber: formData.get('phone') as string,
            Subject: contactMethodValue === 'Phone' ? (isRtl ? 'طلب اتصال هاتفي' : 'Phone Call Request') : (formData.get('subject') as string),
            Message: contactMethodValue === 'Phone' ? (isRtl ? 'يرغب الزائر في التواصل عبر الهاتف مباشرة.' : 'Visitor wants to communicate via phone directly.') : (formData.get('message') as string),
            PreferredContactMethod: contactMethodValue,
        };

        try {
            await contactApi.send(data);

            // If Email is preferred, redirect to mail client
            if (data.PreferredContactMethod === 'Email') {
                const subject = encodeURIComponent(data.Subject);
                const body = encodeURIComponent(`${data.Message}\n\nFrom: ${data.Name}\nEmail: ${data.Email}`);
                window.location.href = `mailto:moustafa.tonin@gmail.com?subject=${subject}&body=${body}`;
            }

            // If WhatsApp is preferred, redirect to WhatsApp
            if (data.PreferredContactMethod === 'WhatsApp') {
                const whatsappNumber = '967783707104';
                const message = encodeURIComponent(`*${data.Subject}*\n\n${data.Message}\n\n_Sent by: ${data.Name}_`);
                window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
            }

            // If Phone is preferred, trigger call
            if (data.PreferredContactMethod === 'Phone') {
                window.location.href = 'tel:783707104';
            }

            setIsSuccess(true);
            toast.success(isRtl ? 'تم إرسال رسالتك بنجاح' : 'Message transmitted successfully');

            // Redirect after success
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            toast.error(isRtl ? 'عذراً، حدث خطأ أثناء الإرسال' : 'Transmission failure. Please retry.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full text-center space-y-8 p-12 bg-card rounded-[3rem] border border-border shadow-2xl"
                >
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-12 h-12 text-primary" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black">{t('contact.success.title')}</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            {t('contact.success.message')}
                        </p>
                    </div>
                    <div className="pt-6">
                        <div className="flex items-center justify-center gap-3 text-sm font-bold text-primary">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t('contact.success.redirecting')}
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Combine dynamic links with hardcoded ones if not present
    const allSocialLinks = [...socialLinks];

    // Add Instagram if not present
    if (!socialLinks.some(l => l.platform.toLowerCase().includes('instagram'))) {
        allSocialLinks.push({ id: 9991, platform: 'Instagram', url: 'https://www.instagram.com/mostafa_tonin/', iconName: 'instagram', displayOrder: 10, isActive: true });
    }

    // Add Twitter/X if not present
    if (!socialLinks.some(l => l.platform.toLowerCase().includes('twitter') || l.platform.toLowerCase().includes('x'))) {
        allSocialLinks.push({ id: 9992, platform: 'Twitter', url: 'https://x.com/mostafatonin', iconName: 'twitter', displayOrder: 11, isActive: true });
    }

    return (
        <div className={`py-20 space-y-24 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Hero Section */}
            <section className="relative overflow-hidden px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[12rem]" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-[12rem]" />
                </div>

                <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-muted rounded-full text-sm font-bold text-primary border border-border/50 mt-16"
                    >
                        <Sparkles size={14} />
                        {t('contact.info.available')}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1]"
                    >
                        {t('contact.title')}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed italic opacity-80"
                    >
                        {t('contact.subtitle')}
                    </motion.p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20">
                {/* Left Side: Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-7 space-y-12"
                >
                    <div className="bg-card rounded-[3.5rem] border border-border p-8 md:p-12 shadow-2xl shadow-primary/5">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground ml-4">{t('contact.form.name')}</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full px-8 py-5 rounded-3xl bg-muted/30 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold"
                                        placeholder="E.g. John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground ml-4">{t('contact.form.contact_method')}</label>
                                    <select
                                        name="method"
                                        value={contactMethod}
                                        onChange={(e) => setContactMethod(e.target.value)}
                                        className="w-full px-8 py-5 rounded-3xl bg-muted/30 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="Email">{t('contact.form.method_email')}</option>
                                        <option value="WhatsApp">{t('contact.form.method_whatsapp')}</option>
                                        <option value="Phone">{t('contact.form.method_phone')}</option>
                                    </select>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {contactMethod === 'Email' && (
                                    <motion.div
                                        key="email-field"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-[11px] font-bold text-muted-foreground ml-4">{t('contact.form.email')}</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            className="w-full px-8 py-5 rounded-3xl bg-muted/30 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold"
                                            placeholder="name@example.com"
                                        />
                                    </motion.div>
                                )}

                                {(contactMethod === 'Phone' || contactMethod === 'WhatsApp') && (
                                    <motion.div
                                        key="phone-field"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-[11px] font-bold text-muted-foreground ml-4">{t('contact.form.phone')}</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            className="w-full px-8 py-5 rounded-3xl bg-muted/30 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold"
                                            placeholder="+967 ..."
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {contactMethod !== 'Phone' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-muted-foreground ml-4">{t('contact.form.subject')}</label>
                                            <input
                                                type="text"
                                                name="subject"
                                                required={contactMethod !== 'Phone'}
                                                className="w-full px-8 py-5 rounded-3xl bg-muted/30 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold"
                                                placeholder={isRtl ? "حول ماذا تريد التحدث؟" : "What's on your mind?"}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-muted-foreground ml-4">{t('contact.form.message')}</label>
                                            <textarea
                                                name="message"
                                                required={contactMethod !== 'Phone'}
                                                rows={5}
                                                className="w-full px-8 py-6 rounded-[2.5rem] bg-muted/30 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium resize-none"
                                                placeholder={isRtl ? "اكتب تفاصيل مشروعك أو سؤالك هنا..." : "Describe your project goal or technical inquiry..."}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={cn(
                                    "group w-full py-6 rounded-3xl font-bold text-lg shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50",
                                    contactMethod === 'Phone' ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-primary text-primary-foreground shadow-primary/20"
                                )}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>
                                        {contactMethod === 'Phone' ? (isRtl ? 'اتصال الآن' : 'Call Now') : t('contact.form.submit')}
                                        <motion.span
                                            animate={{ x: isRtl ? -5 : 5 }}
                                            transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                                        >
                                            <Phone size={20} className={isRtl && contactMethod !== 'Phone' ? "rotate-180" : ""} />
                                        </motion.span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* Right Side: Contact Info & Socials */}
                <div className="lg:col-span-5 space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="space-y-4 text-center lg:text-start">
                            <h2 className="text-3xl font-black">{t('contact.info.get_in_touch')}</h2>
                            <p className="text-muted-foreground font-medium leading-relaxed italic opacity-70">
                                {t('contact.description')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { icon: Mail, label: t('contact.form.email'), value: 'moustafa.tonin@gmail.com', color: 'bg-blue-500/10 text-blue-500' },
                                { icon: MapPin, label: t('contact.info.location'), value: t('contact.info.address'), color: 'bg-red-500/10 text-red-500' },
                                { icon: Globe, label: t('contact.info.region'), value: t('contact.info.country'), color: 'bg-emerald-500/10 text-emerald-500' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-6 p-6 bg-muted/20 border border-border/50 rounded-[2rem] hover:bg-muted/40 transition-all">
                                    <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center`}>
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold opacity-40 mb-1">{item.label}</p>
                                        <p className="font-bold text-lg">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        <h2 className="text-2xl font-black text-center lg:text-start">{t('contact.info.social')}</h2>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            {allSocialLinks.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-5 bg-card border border-border rounded-2xl hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:-translate-y-2 transition-all group"
                                    title={link.platform}
                                >
                                    <div className="group-hover:rotate-[360deg] transition-transform duration-700">
                                        {link.platform.toLowerCase().includes('github') && <Github size={24} />}
                                        {link.platform.toLowerCase().includes('linkedin') && <Linkedin size={24} />}
                                        {link.platform.toLowerCase().includes('telegram') && <Telegram size={24} />}
                                        {link.platform.toLowerCase().includes('instagram') && <Instagram size={24} />}
                                        {(link.platform.toLowerCase().includes('twitter') || link.platform.toLowerCase().includes(' x')) && <Twitter size={24} />}
                                        {(!['github', 'linkedin', 'telegram', 'instagram', 'twitter', ' x'].some(p => link.platform.toLowerCase().includes(p))) && <ArrowRight size={24} />}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
