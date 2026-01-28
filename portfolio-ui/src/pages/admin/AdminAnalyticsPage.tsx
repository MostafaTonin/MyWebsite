import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { analyticsApi } from '../../api/analytics';
import {
    TrendingUp, Users, Eye, Heart, MessageSquare,
    Download, Activity, BarChart3,
    ArrowUpRight, ArrowDownRight, RefreshCcw
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import { cn } from '../../utils';

const AdminAnalyticsPage = () => {
    const { i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    const { data: stats, isLoading, refetch, isFetching } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: analyticsApi.getDashboardStats
    });

    const kpis = [
        { label: isRtl ? 'إجمالي المشاهدات' : 'Total Views', value: stats?.totalViews || 0, icon: <Eye size={24} />, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: 12 },
        { label: isRtl ? 'إجمالي الإعجابات' : 'Total Likes', value: stats?.totalLikes || 0, icon: <Heart size={24} />, color: 'text-rose-500', bg: 'bg-rose-500/10', trend: 8 },
        { label: isRtl ? 'التعليقات' : 'Comments', value: stats?.totalComments || 0, icon: <MessageSquare size={24} />, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: -3 },
        { label: isRtl ? 'المستخدمين' : 'Users', value: stats?.totalUsers || 0, icon: <Users size={24} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: 24 },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[600px]">
                <RefreshCcw className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">
                        {isRtl ? 'مركز الإحصائيات المتقدمة' : 'Advanced Analytics Hub'}
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        {isRtl ? 'راقب أداء محتواك وتفاعل الجمهور لحظة بلحظة.' : 'Monitor your content performance and audience engagement in real-time.'}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => refetch()}
                        className={cn("p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-all", isFetching && "animate-spin")}
                    >
                        <RefreshCcw size={20} />
                    </button>
                    <button
                        onClick={() => analyticsApi.exportPostsCsv()}
                        className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:translate-y-[-2px] transition-all shadow-xl shadow-primary/20"
                    >
                        <Download size={18} />
                        {isRtl ? 'تصدير التقرير (CSV)' : 'Export CSV Report'}
                    </button>
                </div>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {kpis.map((kpi, idx) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-8 bg-card rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={cn("p-4 rounded-2xl", kpi.bg, kpi.color)}>
                                {kpi.icon}
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-[11px] font-black uppercase tracking-widest",
                                kpi.trend > 0 ? "text-emerald-500" : "text-rose-500"
                            )}>
                                {kpi.trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {Math.abs(kpi.trend)}%
                            </div>
                        </div>
                        <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-1">{kpi.label}</h3>
                        <div className="text-4xl font-black tracking-tighter">{kpi.value.toLocaleString()}</div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Chart */}
                <div className="lg:col-span-2 p-10 bg-card rounded-[3.5rem] border border-border/50 shadow-sm space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Activity className="text-primary" size={24} />
                            <h3 className="text-xl font-black uppercase tracking-tight">{isRtl ? 'نشاط المدونة (6 أشهر)' : 'Blog Activity (Last 6 Months)'}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                {isRtl ? 'المشاهدات' : 'Views'}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                {isRtl ? 'المنشورات' : 'Posts'}
                            </div>
                        </div>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.monthlyActivity}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: 'currentColor', opacity: 0.3 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: 'currentColor', opacity: 0.3 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '24px',
                                        border: 'none',
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                                        background: 'var(--color-card)',
                                        padding: '20px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="viewsCount"
                                    stroke="var(--color-primary)"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="postCount"
                                    stroke="#10b981"
                                    strokeWidth={4}
                                    fill="transparent"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Trending Posts Right Column */}
                <div className="p-10 bg-card rounded-[3.5rem] border border-border/50 shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-10">
                        <TrendingUp className="text-primary" size={24} />
                        <h3 className="text-xl font-black uppercase tracking-tight">{isRtl ? 'الأكثر رواجاً' : 'Trending Now'}</h3>
                    </div>
                    <div className="flex-1 space-y-6">
                        {stats?.trendingPosts.map((post, i) => (
                            <div key={post.id} className="group cursor-default">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black uppercase opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all">0{i + 1}</span>
                                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
                                        {post.engagementRate.toFixed(1)}% ER
                                    </span>
                                </div>
                                <h4 className="font-black text-sm mb-3 line-clamp-1 group-hover:text-primary transition-colors">{post.title}</h4>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                                        <Eye size={12} /> {post.views}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                                        <Heart size={12} /> {post.likes}
                                    </div>
                                </div>
                                {i < (stats?.trendingPosts.length - 1) && <div className="mt-6 border-b border-border/50" />}
                            </div>
                        ))}
                    </div>
                    <button className="mt-10 w-full py-5 bg-muted/50 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-muted transition-all">
                        {isRtl ? 'مشاهدة كافة التقارير' : 'View Full Report'}
                    </button>
                </div>
            </div>

            {/* Secondary Row: Conversion & KPIs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-10 bg-primary/5 border border-primary/20 rounded-[3.5rem] relative overflow-hidden group">
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="w-40 h-40 rounded-full border-8 border-primary/20 border-t-primary flex items-center justify-center">
                            <div className="text-center">
                                <span className="block text-4xl font-black">84%</span>
                                <span className="text-[10px] font-bold uppercase opacity-60">Retention</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <h3 className="text-2xl font-black tracking-tight">{isRtl ? 'تحليل تفاعل الجمهور' : 'Engagement Analysis'}</h3>
                            <p className="text-sm font-medium opacity-70 leading-relaxed">
                                {isRtl
                                    ? 'يُظهر جمهورك تفاعلاً عالياً مع منشورات الفيديو بنسبة 40% أكثر من المقالات النصية.'
                                    : 'Your audience shows high engagement with video posts, averaging 40% more interaction than text articles.'}
                            </p>
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-background/50 rounded-2xl border border-border/50">
                                    <span className="block text-lg font-black">+1.2k</span>
                                    <span className="text-[9px] font-black uppercase opacity-40">Monthly New</span>
                                </div>
                                <div className="p-4 bg-background/50 rounded-2xl border border-border/50">
                                    <span className="block text-lg font-black">-0.4%</span>
                                    <span className="text-[9px] font-black uppercase opacity-40">Churn Rate</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-10 bg-card border border-border/50 rounded-[3.5rem] flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black uppercase tracking-tight">{isRtl ? 'تنبيهات الأداء' : 'Performance Alerts'}</h3>
                        <BarChart3 className="text-primary/40" />
                    </div>
                    <div className="space-y-4">
                        <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-sm font-black tracking-tight">{isRtl ? 'مقال "React 19" يحقق أرقاماً قياسية' : '"React 19" post breaking records'}</span>
                            </div>
                            <span className="text-[10px] font-black opacity-30">JUST NOW</span>
                        </div>
                        <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-sm font-black tracking-tight">{isRtl ? 'زيادة 15% في عدد المستخدمين الجدد' : '15% increase in weekly signups'}</span>
                            </div>
                            <span className="text-[10px] font-black opacity-30">2H AGO</span>
                        </div>
                    </div>
                    <button className="mt-10 py-5 text-sm font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
                        {isRtl ? 'عرض كافة التنبيهات' : 'View All Notifications'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalyticsPage;
