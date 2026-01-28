import React from 'react';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">{t('admin.dashboard_title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-semibold mb-2">{t('admin.total_views')}</h3>
                    <p className="text-3xl font-bold text-primary">12,450</p>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-semibold mb-2">{t('admin.new_messages')}</h3>
                    <p className="text-3xl font-bold text-primary">5</p>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-semibold mb-2">{t('admin.blog_posts')}</h3>
                    <p className="text-3xl font-bold text-primary">3</p>
                </div>
            </div>

            <div className="mt-8 bg-card p-8 rounded-xl border border-border text-center text-muted-foreground">
                <p>{t('admin.placeholder_text')}</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
