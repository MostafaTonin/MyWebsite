import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin') {
            // Mock login
            navigate('/admin/dashboard');
        } else {
            alert(t('login.error'));
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-card p-8 rounded-2xl shadow-xl border border-border"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-primary/10 rounded-full text-primary mb-4">
                        <Lock size={24} />
                    </div>
                    <h1 className="text-2xl font-bold">{t('login.title')}</h1>
                    <p className="text-muted-foreground mt-2">{t('login.subtitle')}</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">{t('login.username')}</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">{t('login.password')}</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                    >
                        {t('login.submit')}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
