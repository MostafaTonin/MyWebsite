import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit2, Save, X, ShieldAlert, UserCheck, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { cn } from '../../utils';

const AdminUsersPage = () => {
    const { t } = useTranslation();
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        role: 'Admin'
    });

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: authApi.getUsers
    });

    const handleError = (err: any, fallbackKey: string) => {
        let message = t(fallbackKey);
        if (err.response?.data) {
            if (err.response.data.message) {
                message = err.response.data.message;
            } else if (err.response.data.errors) {
                // ASP.NET Core validation errors
                const validationErrors = err.response.data.errors;
                message = Object.values(validationErrors).flat().join(' | ');
            }
        }
        toast.error(message);
    };

    const createMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast.success(t('common.success_create'));
            handleCancel();
        },
        onError: (err: any) => handleError(err, 'common.error_create')
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => authApi.updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast.success(t('common.success_update'));
            handleCancel();
        },
        onError: (err: any) => handleError(err, 'common.error_update')
    });

    const deleteMutation = useMutation({
        mutationFn: authApi.deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast.success(t('common.success_delete'));
        },
        onError: (err: any) => handleError(err, 'common.error_delete')
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error(t('admin.users_page.confirm_password_error', { defaultValue: 'Passwords do not match' }));
            return;
        }

        if (editingId) {
            updateMutation.mutate({
                id: editingId,
                data: {
                    username: formData.username,
                    newPassword: formData.password
                }
            });
        } else {
            createMutation.mutate({
                username: formData.username,
                password: formData.password,
                role: formData.role
            });
        }
    };

    const handleEdit = (user: any) => {
        setEditingId(user.id);
        setFormData({
            username: user.username,
            password: '',
            confirmPassword: '',
            role: user.role
        });
        setIsAdding(false);
    };

    const handleCancel = () => {
        setEditingId(null);
        setIsAdding(false);
        setFormData({ username: '', password: '', confirmPassword: '', role: 'Admin' });
    };

    const handleDelete = (id: number, username: string) => {
        if (username === currentUser?.username) {
            toast.error(t('admin.users_page.delete_self_error', { defaultValue: 'Cannot delete your own account' }));
            return;
        }
        if (window.confirm(t('common.confirm_delete'))) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 space-y-4">
                <div className="h-8 bg-muted animate-pulse rounded w-1/4" />
                <div className="h-64 bg-muted animate-pulse rounded" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">{t('admin.users_page.title')}</h1>
                    <p className="text-muted-foreground mt-2">{t('admin.users_page.subtitle')}</p>
                </div>
                {!isAdding && !editingId && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="px-6 py-3 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                        <Plus size={20} />
                        {t('admin.users_page.add_user')}
                    </button>
                )}
            </div>

            {/* Form (Add/Edit) */}
            <AnimatePresence>
                {(isAdding || editingId) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        className="p-8 bg-card border border-border rounded-[2.5rem] shadow-xl overflow-hidden"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
                            </div>
                            <h3 className="text-xl font-black tracking-tight">
                                {editingId ? t('admin.users_page.edit_user') : t('admin.users_page.add_user')}
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{t('admin.users_page.username')}</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:outline-none font-bold"
                                        placeholder="e.g. m_tonin"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{t('admin.users_page.role')}</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:outline-none font-bold appearance-none cursor-pointer"
                                        disabled={editingId ? true : false}
                                    >
                                        <option value="Admin">Administrator</option>
                                        <option value="Viewer">Viewer (Read Only)</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                                        {editingId ? t('admin.users_page.password') : t('admin.users_page.password')}
                                    </label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:outline-none font-bold"
                                            placeholder="••••••••"
                                            required={!editingId}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{t('admin.users_page.confirm_password')}</label>
                                    <div className="relative">
                                        <UserCheck size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:outline-none font-bold"
                                            placeholder="••••••••"
                                            required={!editingId}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                    className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    <Save size={20} />
                                    {editingId ? t('common.save') : t('common.add')}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-8 py-4 bg-muted text-foreground rounded-2xl font-bold flex items-center gap-2 hover:bg-muted/80 transition-all"
                                >
                                    <X size={20} />
                                    {t('common.cancel')}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Users List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((u: any) => (
                    <motion.div
                        key={u.id}
                        layout
                        className={cn(
                            "relative overflow-hidden group p-8 bg-card border border-border rounded-[2.5rem] transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5",
                            u.username === currentUser?.username && "border-primary/30 bg-primary/[0.02]"
                        )}
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                                    u.username === currentUser?.username ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                )}>
                                    <UserCheck size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-black text-lg">{u.username}</h3>
                                        {u.username === currentUser?.username && (
                                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-tighter rounded-full">
                                                {t('admin.users_page.current_user_tag')}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">{u.role}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleEdit(u)}
                                className="flex-1 px-4 py-3 bg-muted hover:bg-primary hover:text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
                            >
                                <Edit2 size={14} />
                                {t('common.edit')}
                            </button>
                            {u.username !== currentUser?.username && (
                                <button
                                    onClick={() => handleDelete(u.id, u.username)}
                                    disabled={deleteMutation.isPending}
                                    className="px-4 py-3 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-xl font-bold text-xs flex items-center justify-center transition-all disabled:opacity-50"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>

                        {/* Decorative background icon */}
                        <ShieldAlert className="absolute -bottom-4 -right-4 w-24 h-24 text-primary/5 group-hover:text-primary/10 transition-colors -rotate-12" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AdminUsersPage;
