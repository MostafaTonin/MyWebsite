import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Trash2, Search,
    Calendar, User, Phone,
    MessageSquare, AtSign, ArrowRight,
    Loader2, Download, Inbox,
    X, MessageCircle, Send, Copy, ExternalLink
} from 'lucide-react';
import { contactApi } from '../../api/contact';
import toast from 'react-hot-toast';
import { cn } from '../../utils';

const AdminMessagesPage = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language.startsWith('ar');
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [selectedMsg, setSelectedMsg] = useState<any>(null);
    const [replyText, setReplyText] = useState('');
    const [showReplyForm, setShowReplyForm] = useState(false);

    const { data: messages = [], isLoading } = useQuery({
        queryKey: ['admin-messages'],
        queryFn: contactApi.getAllAdmin
    });

    const toggleReadMutation = useMutation({
        mutationFn: (id: number) => contactApi.toggleReadAdmin(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => contactApi.deleteAdmin(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
            toast.success(t('common.success_delete'));
            setSelectedMsg(null);
            setShowReplyForm(false);
        }
    });

    const filteredMessages = messages.filter((m: any) => {
        const name = m.name || '';
        const subject = m.subject || '';
        const message = m.message || '';

        const matchesSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'unread') return matchesSearch && !m.isRead;
        if (filter === 'read') return matchesSearch && m.isRead;
        return matchesSearch;
    });

    const handleSelectMessage = (msg: any) => {
        setSelectedMsg(msg);
        setReplyText('');
        setShowReplyForm(false);
        if (!msg.isRead) {
            toggleReadMutation.mutate(msg.id);
        }
    };

    const handleExternalReply = (type: 'email' | 'whatsapp') => {
        if (!selectedMsg) return;

        if (type === 'email') {
            if (!selectedMsg.email) {
                toast.error(isRtl ? 'البريد الإلكتروني غير متوفر' : 'Email address not available');
                return;
            }

            const subject = encodeURIComponent(`Re: ${selectedMsg.subject || 'Portfolio Inquiry'}`);
            const body = encodeURIComponent(replyText || '');
            const mailtoUrl = `mailto:${selectedMsg.email}?subject=${subject}&body=${body}`;

            // Create a temporary link and click it - more robust than window.location.href
            const link = document.createElement('a');
            link.href = mailtoUrl;
            link.click();

            toast.success(isRtl ? 'جاري فتح تطبيق البريد...' : 'Opening email client...');
        } else if (type === 'whatsapp') {
            const phone = selectedMsg.phoneNumber || selectedMsg.PhoneNumber;
            if (!phone) {
                toast.error(isRtl ? 'رقم الهاتف غير متوفر' : 'Phone number not available');
                return;
            }
            const cleanPhone = phone.replace(/\D/g, '');
            const text = encodeURIComponent(replyText || '');
            window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
            toast.success(isRtl ? 'جاري فتح واتساب...' : 'Opening WhatsApp...');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(isRtl ? 'تم النسخ!' : 'Copied!');
    };

    const exportToCSV = () => {
        const headers = ["Name,Email,Phone,Subject,Message,Date,Status"];
        const rows = filteredMessages.map((m: any) =>
            `"${m.name}","${m.email}","${m.phoneNumber || ''}","${m.subject}","${m.message.replace(/"/g, '""')}","${m.sentDate}","${m.isRead ? 'Read' : 'Unread'}"`
        );
        const csvContent = headers.concat(rows).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Inbox_Export_${new Date().toLocaleDateString()}.csv`);
        link.click();
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-xs font-bold tracking-tight text-muted-foreground">{t('admin.common.secure_server')}</p>
            </div>
        );
    }

    return (
        <div className={`space-y-10 py-6 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">{t('admin.messages_page.title')}</h1>
                    <p className="text-muted-foreground mt-2 font-medium italic opacity-60">{t('admin.messages_page.subtitle')}</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-3 px-6 py-4 bg-muted hover:bg-accent rounded-2xl font-bold text-xs tracking-tight transition-all"
                    >
                        <Download size={18} />
                        {t('admin.messages_page.export_csv')}
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={20} />
                    <input
                        type="text"
                        placeholder={t('admin.messages_page.search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-card border border-border outline-none font-bold focus:ring-4 focus:ring-primary/5 transition-all"
                    />
                </div>
                <div className="flex bg-card border border-border rounded-[2rem] p-1.5">
                    {[
                        { id: 'all', label: t('admin.common.all') },
                        { id: 'unread', label: t('admin.messages_page.unread') },
                        { id: 'read', label: t('admin.messages_page.read') }
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => setFilter(btn.id as any)}
                            className={cn(
                                "px-8 py-3.5 rounded-2xl text-xs font-bold tracking-tight transition-all",
                                filter === btn.id ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-muted text-muted-foreground"
                            )}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Message List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredMessages.length === 0 ? (
                    <div className="py-40 text-center space-y-6 bg-card rounded-[4rem] border border-border border-dashed">
                        <Inbox size={64} className="mx-auto text-muted-foreground opacity-10" />
                        <h3 className="text-xl font-black text-muted-foreground tracking-tight">
                            {t('admin.messages_page.empty_inbox')}
                        </h3>
                    </div>
                ) : (
                    filteredMessages.map((msg: any) => (
                        <motion.button
                            layoutId={msg.id.toString()}
                            key={msg.id}
                            onClick={() => handleSelectMessage(msg)}
                            className={cn(
                                "group flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-[2.5rem] border transition-all text-right md:text-left",
                                msg.isRead
                                    ? "bg-muted/10 border-border/50 opacity-60"
                                    : "bg-card border-primary/20 shadow-xl shadow-primary/5 ring-1 ring-primary/5 hover:border-primary/40"
                            )}
                        >
                            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-muted flex items-center justify-center relative">
                                <User className="text-muted-foreground" />
                                {!msg.isRead && <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-4 border-background" />}
                            </div>

                            <div className="flex-grow space-y-1 overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
                                <div className="flex items-center gap-3">
                                    <h4 className="font-bold text-base truncate">{msg.name}</h4>
                                    {!msg.isRead && (
                                        <span className="px-2.5 py-0.5 bg-primary/20 text-primary text-[10px] font-bold rounded-full">
                                            {t('admin.messages_page.unread')}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-primary/70 truncate">
                                    {msg.subject || (isRtl ? 'بدون موضوع' : 'No Subject')}
                                </p>
                            </div>

                            <div className="flex-shrink-0 flex items-center gap-8">
                                <div className="hidden md:flex flex-col items-end gap-1">
                                    <p className="text-xs font-bold text-muted-foreground">
                                        {new Date(msg.sentDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs font-medium text-muted-foreground/60 truncate max-w-[200px]">
                                        {msg.email}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm(t('admin.messages_page.delete_confirm'))) deleteMutation.mutate(msg.id);
                                    }}
                                    className="p-4 rounded-2xl bg-destructive/5 text-destructive hover:bg-destructive hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.button>
                    ))
                )}
            </div>

            {/* Message Details Modal */}
            <AnimatePresence>
                {selectedMsg && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
                        <motion.div
                            layoutId={selectedMsg.id.toString()}
                            className="bg-card w-full max-w-3xl rounded-[2rem] border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 border-b border-border bg-muted/20 flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight">{t('admin.messages_page.modal_title')}</h2>
                                        <p className="text-[11px] font-medium text-muted-foreground/60">
                                            {t('admin.messages_page.status_label')}: {selectedMsg.isRead ? t('admin.messages_page.status_processed') : t('admin.messages_page.status_new')}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedMsg(null)} className="p-3 bg-background hover:bg-muted border border-border rounded-xl transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar flex-grow">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right md:text-left" dir={isRtl ? 'rtl' : 'ltr'}>
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-muted-foreground/40">{t('admin.messages_page.from_label')}</label>
                                            <div className="flex items-center gap-2 font-bold text-lg">
                                                {selectedMsg.name}
                                                <button onClick={() => copyToClipboard(selectedMsg.name)} className="p-1 hover:text-primary transition-colors"><Copy size={14} /></button>
                                            </div>
                                            <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                                <AtSign size={14} /> {selectedMsg.email}
                                                <button onClick={() => copyToClipboard(selectedMsg.email)} className="p-1 hover:text-primary transition-colors"><Copy size={14} /></button>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-muted-foreground/40">{t('admin.messages_page.phone_label')}</label>
                                            <div className="flex items-center gap-2 font-bold">
                                                <Phone size={14} className="opacity-40" /> {selectedMsg.phoneNumber || 'N/A'}
                                                {selectedMsg.phoneNumber && <button onClick={() => copyToClipboard(selectedMsg.phoneNumber)} className="p-1 hover:text-primary transition-colors"><Copy size={14} /></button>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-muted-foreground/40">{t('admin.messages_page.date_label')}</label>
                                            <div className="flex items-center gap-2 font-bold">
                                                <Calendar size={14} className="opacity-40" /> {new Date(selectedMsg.sentDate).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-muted-foreground/40">{t('admin.messages_page.preferred_contact')}</label>
                                            <div className="flex items-center gap-2 font-bold text-accent">
                                                <MessageSquare size={14} className="opacity-40" /> {selectedMsg.preferredContactMethod || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 text-right md:text-left" dir={isRtl ? 'rtl' : 'ltr'}>
                                    <div className="p-8 bg-muted/30 rounded-3xl border border-border/50 relative">
                                        <div className="absolute top-6 right-8 text-xs font-bold text-muted-foreground/20">{t('admin.messages_page.subject')}</div>
                                        <h3 className="text-xl font-bold mb-4 pr-12">{selectedMsg.subject || 'No Subject'}</h3>
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium">
                                            {selectedMsg.message}
                                        </p>
                                    </div>
                                </div>

                                {showReplyForm ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-4 pt-6 border-t border-border"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-xs font-bold uppercase tracking-widest">{t('admin.messages_page.reply_title')}</h4>
                                            <button onClick={() => setShowReplyForm(false)} className="text-xs font-bold text-destructive">{t('admin.messages_page.cancel')}</button>
                                        </div>
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            rows={4}
                                            className="w-full p-6 rounded-3xl bg-muted/50 border border-border outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                            placeholder={t('admin.messages_page.reply_placeholder')}
                                        />
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => handleExternalReply('email')}
                                                className="flex-1 flex items-center justify-center gap-3 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-xs hover:opacity-90 active:scale-[0.98] transition-all"
                                            >
                                                <Mail size={18} />
                                                {t('admin.messages_page.send_email')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleExternalReply('whatsapp')}
                                                className="flex-1 flex items-center justify-center gap-3 py-4 bg-emerald-500 text-white rounded-xl font-bold text-xs hover:opacity-90 active:scale-[0.98] transition-all"
                                            >
                                                <MessageCircle size={18} />
                                                {t('admin.messages_page.send_whatsapp')}
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="flex gap-4 pt-6 mt-4 border-t border-border">
                                        <button
                                            type="button"
                                            onClick={() => setShowReplyForm(true)}
                                            className="flex-1 flex items-center justify-center gap-3 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                                        >
                                            <Send size={18} />
                                            {t('admin.messages_page.reply_title')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (confirm(t('admin.messages_page.delete_confirm'))) deleteMutation.mutate(selectedMsg.id);
                                            }}
                                            className="px-8 py-4 flex items-center justify-center bg-destructive/10 text-destructive rounded-xl hover:bg-destructive hover:text-white transition-all font-bold text-xs"
                                        >
                                            {t('common.delete')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminMessagesPage;
