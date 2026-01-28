import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertCircle, Loader, KeyRound, User as UserIcon, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const AdminLoginPage = () => {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            toast.success(t('admin.login_success', { defaultValue: 'Secure connection established.' }));
            navigate('/admin/dashboard');
        } catch (err: any) {
            console.error("Login Error:", err);
            const errorMsg = err.response?.data?.message || err.message || 'Access Denied: Invalid Credentials.';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#F1F5F9] overflow-hidden selection:bg-primary/20">
            {/* Soft Premium Background Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')] opacity-[0.4]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[500px] px-6 relative z-10"
            >
                <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-200/60 p-10 md:p-12 relative overflow-hidden">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6"
                        >
                            <ShieldCheck size={32} />
                        </motion.div>

                        <h1 className="text-3xl font-black tracking-tight mb-2 text-slate-900">
                            {t('admin.login_title')}
                        </h1>
                        <p className="text-sm font-medium text-slate-500">
                            Authentication gateway
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-sm font-bold text-red-600">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 ml-1">Identity hub</label>
                            <div className="relative">
                                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full pl-12 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-slate-700 placeholder:font-medium"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 ml-1">Secure key</label>
                            <div className="relative">
                                <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full pl-12 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-slate-700 placeholder:font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                            {loading ? <Loader className="animate-spin" size={20} /> : (
                                <>
                                    <span>{t('admin.login_button')}</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center border-t border-slate-100 pt-6">
                        <p className="text-xs font-medium text-slate-400">
                            Authorized personnel only
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;
