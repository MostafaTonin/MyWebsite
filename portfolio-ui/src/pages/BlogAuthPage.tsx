import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User as UserIcon,
    Mail,
    Lock,
    ArrowRight,
    ArrowLeft,
    Plus,
    LogIn,
    Loader,
    CheckCircle2,
    ShieldCheck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { authApi } from '../api/auth';
import toast from 'react-hot-toast';
import { cn } from '../utils';

const BlogAuthPage = () => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [isLogin, setIsLogin] = useState(location.state?.mode !== 'register');
    const [loading, setLoading] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullName: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.username, formData.password);
                toast.success(isAr ? 'مرحباً بعودتك!' : 'Welcome back!');

                // Redirect back if coming from a post
                if (location.state?.from) {
                    navigate(location.state.from);
                } else {
                    navigate('/blog');
                }
            } else {
                await authApi.registerPublic({
                    username: formData.username,
                    email: formData.email,
                    fullName: formData.fullName,
                    password: formData.password
                });
                toast.success(isAr ? 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.' : 'Account created successfully! You can now login.');
                setIsLogin(true);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || (isAr ? 'حدث خطأ ما' : 'Something went wrong');
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6 selection:bg-primary/20">
            {/* Background Aesthetics */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-40 -mt-40" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -ml-40 -mb-40" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden relative z-10 border border-slate-200/50"
            >
                {/* Left Side: Visual/Branding */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-primary text-white relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-dark" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

                    <div className="relative z-10">
                        <button onClick={() => navigate('/blog')} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-black text-xs uppercase tracking-widest mb-20 group">
                            <ArrowLeft size={16} className={cn("transition-transform group-hover:-translate-x-1", isAr && "rotate-180 group-hover:translate-x-1")} />
                            {isAr ? 'العودة للمقالات' : 'Back to Blog'}
                        </button>

                        <h1 className="text-6xl font-black mb-6 leading-tight tracking-tighter">
                            {isAr ? 'انضم لمجتمعنا المعرفي.' : 'Join Our Creative Community.'}
                        </h1>
                        <p className="text-xl text-white/70 font-medium leading-relaxed max-w-sm">
                            {isAr ? 'سجل حسابك الآن للتفاعل مع مقالاتنا ومشاركة آرائك مع المئات.' : 'Register now to interact with our articles and share your thoughts with hundreds of readers.'}
                        </p>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><CheckCircle2 size={20} /></div>
                            <span className="font-bold text-sm">{isAr ? 'إعجاب وحفظ المقالات' : 'Like & Save Articles'}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><CheckCircle2 size={20} /></div>
                            <span className="font-bold text-sm">{isAr ? 'التعليق والرد الذكي' : 'Smart Comments & Replies'}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><CheckCircle2 size={20} /></div>
                            <span className="font-bold text-sm">{isAr ? 'صلاحيات النشر (قريباً)' : 'Author Privileges (Soon)'}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-10 lg:p-20 flex flex-col justify-center bg-white">
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className={cn(
                                        "px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                        isLogin ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {isAr ? 'دخول' : 'Login'}
                                </button>
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className={cn(
                                        "px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                        !isLogin ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {isAr ? 'حساب جديد' : 'Sign Up'}
                                </button>
                            </div>
                            <ShieldCheck className="text-primary/20" size={32} />
                        </div>

                        <h2 className="text-4xl font-black text-slate-900 mb-2">
                            {isLogin ? (isAr ? 'مرحباً بعودتك' : 'Welcome Back') : (isAr ? 'إنشاء حساب زائر' : 'Visitor Account')}
                        </h2>
                        <p className="text-slate-500 font-medium tracking-tight">
                            {isLogin ? (isAr ? 'أدخل بياناتك للمتابعة' : 'Enter your details to continue') : (isAr ? 'ابدأ رحلتك المعرفية معنا اليوم' : 'Start your knowledge journey with us today')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLogin ? 'login' : 'register'}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-5"
                            >
                                {!isLogin && (
                                    <>
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder={isAr ? 'الاسم الكامل' : 'Full Name'}
                                                    className="w-full pl-14 pr-8 py-5 rounded-[1.25rem] bg-slate-50 border border-slate-200 outline-none focus:border-primary/50 focus:bg-white transition-all font-bold"
                                                    value={formData.fullName}
                                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="email"
                                                    placeholder={isAr ? 'البريد الإلكتروني' : 'Email Address'}
                                                    className="w-full pl-14 pr-8 py-5 rounded-[1.25rem] bg-slate-50 border border-slate-200 outline-none focus:border-primary/50 focus:bg-white transition-all font-bold"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2">
                                    <div className="relative">
                                        <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder={isAr ? 'اسم المستخدم' : 'Username'}
                                            className="w-full pl-14 pr-8 py-5 rounded-[1.25rem] bg-slate-50 border border-slate-200 outline-none focus:border-primary/50 focus:bg-white transition-all font-bold"
                                            value={formData.username}
                                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="relative">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="password"
                                            placeholder={isAr ? 'كلمة المرور' : 'Password'}
                                            className="w-full pl-14 pr-8 py-5 rounded-[1.25rem] bg-slate-50 border border-slate-200 outline-none focus:border-primary/50 focus:bg-white transition-all font-bold"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 bg-primary text-white rounded-[1.25rem] font-black text-lg flex items-center justify-center gap-4 hover:shadow-2xl hover:shadow-primary/20 transition-all hover:translate-y-[-2px] disabled:opacity-50 active:scale-95"
                        >
                            {loading ? <Loader className="animate-spin" /> : (
                                <>
                                    {isLogin ? (isAr ? 'تسجيل الدخول' : 'Sign In') : (isAr ? 'إنشاء حساب ومتابعة' : 'Create Account')}
                                    <ArrowRight size={20} className={cn("transition-transform", isAr ? "rotate-180" : "")} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 flex flex-col items-center gap-4">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                        >
                            {isLogin ? (isAr ? 'لا تملك حساباً؟ سجل الآن' : 'No account? Join Us Now') : (isAr ? 'لديك حساب بالفعل؟ ادخل' : 'Already have an account? Login')}
                        </button>
                        <div className="w-10 h-1 bg-slate-100 rounded-full" />
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{isAr ? 'نظام مشفر بالكامل وآمن' : 'Fully encrypted & secure login'}</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default BlogAuthPage;
