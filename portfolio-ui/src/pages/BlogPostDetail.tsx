import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { blogApi } from '../api/blog';
import {
    Calendar, Clock, Facebook, Twitter, Linkedin,
    ArrowLeft, Eye, BookOpen, ThumbsUp, ThumbsDown, Send, MessageSquare, Trash2,
    Reply, Heart, Play, Music, Share2, List, X, Lock, LogIn, Plus
} from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../utils';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import type { BlogComment } from '../types/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const BlogPostDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuth();

    const [commentData, setCommentData] = useState<{ authorName?: string, content: string, parentCommentId: number | undefined }>({ authorName: '', content: '', parentCommentId: undefined });
    const [replyingTo, setReplyingTo] = useState<{ id: number; name: string } | null>(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isTocOpen, setIsTocOpen] = useState(false);
    const [showComments, setShowComments] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5027/api';
    const BASE_URL = API_URL.replace('/api', '');

    const { data: post, isLoading, isError } = useQuery({
        queryKey: ['blog-post', slug],
        queryFn: () => blogApi.getBySlug(slug!),
        enabled: !!slug,
    });

    const isLiked = post?.isLikedByCurrentUser || false;

    const likeMutation = useMutation({
        mutationFn: () => {
            if (!currentUser) {
                setIsLoginModalOpen(true);
                throw new Error('Unauthorized');
            }
            return blogApi.like(post!.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-post', slug] });
        }
    });

    const commentMutation = useMutation({
        mutationFn: (data: any) => blogApi.addComment(post!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-post', slug] });
            setCommentData({ authorName: currentUser ? undefined : '', content: '', parentCommentId: undefined });
            setReplyingTo(null);
            toast.success(t('blog.comment_success'));
        }
    });

    const likeCommentMutation = useMutation({
        mutationFn: (id: number) => {
            if (!currentUser) {
                setIsLoginModalOpen(true);
                throw new Error('Unauthorized');
            }
            return blogApi.likeComment(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-post', slug] });
        }
    });

    const deleteCommentMutation = useMutation({
        mutationFn: (id: number) => blogApi.deleteComment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-post', slug] });
            toast.success(t('common.success_delete'));
        }
    });

    const getFullImageUrl = (url: string | undefined) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const toEmbedYoutube = (url?: string | null) => {
        if (!url) return '';
        const u = url.trim();
        if (!u) return '';
        if (u.includes('youtube.com/embed/')) return u;
        const vMatch = u.match(/[?&]v=([^&]+)/);
        if (vMatch && vMatch[1]) return `https://www.youtube.com/embed/${vMatch[1]}`;
        const shortMatch = u.match(/youtu\.be\/([^?&/]+)/);
        if (shortMatch && shortMatch[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;
        const shortsMatch = u.match(/youtube\.com\/shorts\/([^?&/]+)/);
        if (shortsMatch && shortsMatch[1]) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
        return u;
    };

    const handleShare = (platform: string) => {
        const shareUrl = window.location.href;
        const shareTitle = post ? (isAr ? post.titleAr : post.titleEn) : '';
        let url = '';
        switch (platform) {
            case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`; break;
            case 'twitter': url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`; break;
            case 'linkedin': url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`; break;
        }
        if (url) window.open(url, '_blank', 'width=600,height=400');
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            setIsLoginModalOpen(true);
            return;
        }
        if (!commentData.content) {
            toast.error(isAr ? 'يرجى كتابة تعليق' : 'Please write a comment');
            return;
        }
        commentMutation.mutate(commentData);
    };

    const startReply = (comment: BlogComment) => {
        setReplyingTo({ id: comment.id, name: comment.authorName });
        setCommentData({ ...commentData, parentCommentId: comment.id });
        document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const toc = useMemo(() => {
        if (!post) return [];
        const content = isAr ? post.contentAr : post.contentEn;
        const headingRegex = /^#{2,3}\s+(.+)$/gm;
        const matches = [];
        let match;
        while ((match = headingRegex.exec(content)) !== null) {
            matches.push({
                level: match[0].startsWith('###') ? 3 : 2,
                text: match[1],
                id: match[1].toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0621-\u064A-]/g, '')
            });
        }
        return matches;
    }, [post, isAr]);

    const CommentItem = ({ comment, depth = 0 }: { comment: BlogComment; depth?: number }) => (
        <div className={cn(
            "space-y-4",
            depth > 0 && (isAr ? "mr-6 md:mr-12" : "ml-6 md:ml-12")
        )}>
            <div className="group flex gap-4 md:gap-6 p-6 bg-muted/20 border border-border/50 rounded-[2rem] hover:bg-card hover:border-border hover:shadow-xl transition-all">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-base flex-shrink-0">
                    {comment.authorName[0]?.toUpperCase()}
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="font-black text-base">{comment.authorName}</h4>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-muted-foreground/40">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                            {(currentUser?.roles?.includes('Admin') || (currentUser && comment.userId === (currentUser as any).id)) && (
                                <button
                                    onClick={() => { if (confirm(t('common.confirm_delete'))) deleteCommentMutation.mutate(comment.id) }}
                                    className="p-1.5 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 rounded-lg"
                                >
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed">{comment.content}</p>

                    <div className="flex items-center gap-6 pt-2">
                        <button
                            onClick={() => likeCommentMutation.mutate(comment.id)}
                            className={cn(
                                "flex items-center gap-1.5 text-[11px] font-bold transition-colors",
                                comment.isLikedByCurrentUser ? "text-primary" : "text-muted-foreground hover:text-primary"
                            )}
                        >
                            <Heart size={14} className={comment.isLikedByCurrentUser ? "fill-primary text-primary" : ""} />
                            {comment.likeCount > 0 && comment.likeCount} {t('blog.likes')}
                        </button>
                        <button
                            onClick={() => startReply(comment)}
                            className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Reply size={14} />
                            {isAr ? 'رد' : 'Reply'}
                        </button>
                    </div>
                </div>
            </div>

            {comment.replies && comment.replies.length > 0 && (
                <div className="space-y-4 pt-2 border-l-2 border-border/30 ml-4 md:ml-8 pl-4 md:pl-6 rtl:border-l-0 rtl:border-r-2 rtl:ml-0 rtl:mr-4 md:rtl:mr-8 rtl:pl-0 rtl:pr-4 md:rtl:pr-6">
                    {comment.replies.map(reply => (
                        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );

    if (isLoading) {
        return (
            <div className="pt-40 container-max px-6 space-y-12">
                <Skeleton className="h-12 w-3/4 rounded-2xl" />
                <Skeleton className="h-[600px] w-full rounded-[4rem]" />
            </div>
        );
    }

    if (isError || !post) {
        return (
            <div className="min-h-screen pt-40 flex flex-col items-center justify-center space-y-8">
                <BookOpen size={48} className="text-destructive" />
                <h1 className="text-4xl font-black">{isAr ? 'المقال غير موجود' : 'Post Not Found'}</h1>
                <button onClick={() => navigate('/blog')} className="px-8 py-4 bg-muted hover:bg-primary hover:text-white rounded-2xl font-black">Back to Blog</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-32 bg-background selection:bg-primary/20">
            <div className="container-max px-6">
                <Link to="/blog" className="inline-flex items-center gap-2 mb-12 text-muted-foreground hover:text-primary transition-colors font-black text-[10px] group font-outfit">
                    <ArrowLeft size={14} className={cn("transition-transform group-hover:-translate-x-2", isAr && "rotate-180 group-hover:translate-x-2")} />
                    {isAr ? "المدونة" : "Registry"}
                </Link>

                <article className="max-w-5xl mx-auto">
                    <header className="mb-20 space-y-12">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <span className="px-5 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black border border-primary/20 font-outfit">
                                {isAr ? post.categoryNameAr : (post.categoryNameEn ? (post.categoryNameEn.charAt(0).toUpperCase() + post.categoryNameEn.slice(1).toLowerCase()) : '')}
                            </span>
                            <div className="flex items-center gap-6 text-[10px] font-black text-muted-foreground/50 font-outfit">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="opacity-50" />
                                    {new Date(post.publishedDate).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="opacity-50" />
                                    {post.readingTimeInMinutes} {t('blog.reading_time')}
                                </div>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tighter text-foreground text-center md:text-start">
                            {isAr ? post.titleAr : post.titleEn}
                        </h1>

                        <p className="text-lg md:text-2xl text-muted-foreground font-medium leading-[1.4] opacity-60 text-center md:text-start">
                            {isAr ? post.summaryAr : post.summaryEn}
                        </p>

                        <div className="flex items-center gap-6 pt-8 border-t border-border/50">
                            <div className="w-14 h-14 rounded-full bg-muted border border-border flex items-center justify-center text-primary font-black">MT</div>
                            <div>
                                <h4 className="font-black text-sm">Mostafa Tonin</h4>
                                <p className="text-[10px] font-bold text-muted-foreground opacity-60">Software Engineer & Creator</p>
                            </div>
                            <div className="ml-auto flex items-center gap-4">
                                <button onClick={() => handleShare('facebook')} className="p-3 bg-muted/50 hover:bg-primary hover:text-white rounded-xl transition-all"><Facebook size={18} /></button>
                                <button onClick={() => handleShare('twitter')} className="p-3 bg-muted/50 hover:bg-primary hover:text-white rounded-xl transition-all"><Twitter size={18} /></button>
                                <button onClick={() => handleShare('linkedin')} className="p-3 bg-muted/50 hover:bg-primary hover:text-white rounded-xl transition-all"><Linkedin size={18} /></button>
                            </div>
                        </div>
                    </header>

                    <div className="mb-20 rounded-[3rem] overflow-hidden shadow-3xl shadow-primary/5 border border-border relative">
                        {post.postType === 'video' && post.videoUrl ? (
                            <div className="aspect-video bg-black">
                                <iframe
                                    src={toEmbedYoutube(post.videoUrl)}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <img
                                src={getFullImageUrl(post.imageUrl)}
                                alt=""
                                className="w-full h-auto object-cover max-h-[700px]"
                            />
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-20 relative">
                        <aside className="lg:w-20 hidden lg:flex flex-col items-center gap-8 sticky top-40 h-fit">
                            <div className="flex flex-col items-center gap-4 py-8 bg-muted/20 border border-border/50 rounded-full w-full">
                                <button
                                    onClick={() => likeMutation.mutate()}
                                    className={cn(
                                        "w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all",
                                        isLiked ? "bg-primary text-white" : "hover:text-primary"
                                    )}
                                >
                                    <ThumbsUp size={20} className={isLiked ? "fill-white" : ""} />
                                    <span className="text-[10px] font-black mt-1">{post.likeCount}</span>
                                </button>
                                <div className="w-6 h-[1px] bg-border" />
                                <button
                                    onClick={() => !currentUser ? setIsLoginModalOpen(true) : toast.error('Dislike logic not implemented')}
                                    className="w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all text-muted-foreground hover:text-rose-500"
                                >
                                    <ThumbsDown size={20} />
                                </button>
                            </div>
                            <button
                                onClick={() => setShowComments(!showComments)}
                                className={cn("p-4 rounded-full transition-all", showComments ? "bg-primary text-white" : "bg-muted/50 hover:bg-primary hover:text-white")}
                            >
                                <MessageSquare size={20} />
                            </button>
                            <button onClick={() => handleShare('facebook')} className="p-4 bg-muted/50 rounded-full hover:bg-primary hover:text-white transition-all">
                                <Share2 size={20} />
                            </button>
                            <button
                                onClick={() => setIsTocOpen(!isTocOpen)}
                                className={cn("p-4 rounded-full transition-all", isTocOpen ? "bg-primary text-white" : "bg-muted/50 hover:bg-primary hover:text-white")}
                            >
                                <List size={20} />
                            </button>
                        </aside>

                        {/* Mobile Action Bar */}
                        <div className="lg:hidden fixed bottom-8 left-6 right-6 z-[100] flex justify-center">
                            <motion.div
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                className="bg-card/80 backdrop-blur-xl border border-border shadow-2xl rounded-full px-8 py-4 flex items-center gap-8"
                            >
                                <button onClick={() => likeMutation.mutate()} className={cn("flex flex-col items-center", isLiked ? "text-primary" : "text-muted-foreground")}>
                                    <ThumbsUp size={20} className={isLiked ? "fill-primary" : ""} />
                                    <span className="text-[9px] font-black">{post.likeCount}</span>
                                </button>
                                <div className="w-[1px] h-6 bg-border" />
                                <button
                                    onClick={() => setShowComments(!showComments)}
                                    className={cn("flex flex-col items-center", showComments ? "text-primary" : "text-muted-foreground")}
                                >
                                    <MessageSquare size={20} />
                                    <span className="text-[9px] font-black">{post.comments?.length || 0}</span>
                                </button>
                                <div className="w-[1px] h-6 bg-border" />
                                <button onClick={() => handleShare('facebook')} className="text-muted-foreground">
                                    <Share2 size={20} />
                                </button>
                            </motion.div>
                        </div>

                        <div className="flex-1 max-w-4xl">
                            {post.postType === 'audio' && post.audioUrl && (
                                <div className="mb-12 p-8 bg-primary/5 border border-primary/20 rounded-[2.5rem] flex items-center gap-8">
                                    <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                        <Music size={32} />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-black text-sm mb-4">{isAr ? 'استمع للمقال' : 'Listen to Segment'}</h5>
                                        <audio controls className="w-full h-10 accent-primary">
                                            <source src={post.audioUrl} type="audio/mpeg" />
                                        </audio>
                                    </div>
                                </div>
                            )}

                            {toc.length > 0 && isTocOpen && (
                                <div className="mb-12 p-10 bg-card border-2 border-primary/10 rounded-[3rem] shadow-xl">
                                    <h5 className="text-xs font-black mb-8 text-primary font-outfit">{isAr ? 'فهرس المقال' : 'Table of Contents'}</h5>
                                    <ul className="space-y-4">
                                        {toc.map(item => (
                                            <li key={item.id} className={cn(item.level === 3 ? (isAr ? "pr-6" : "pl-6") : "")}>
                                                <a href={`#${item.id}`} className="text-muted-foreground hover:text-primary transition-colors font-bold text-sm block">
                                                    {item.text}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="prose prose-2xl dark:prose-invert max-w-none 
                                prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground
                                prose-p:text-muted-foreground/90 prose-p:leading-[1.7] prose-p:font-medium
                                prose-strong:text-foreground prose-strong:font-black
                                prose-img:rounded-[3rem] prose-img:border prose-img:border-border prose-img:shadow-2xl
                                prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-10 prose-blockquote:rounded-[3rem] prose-blockquote:font-black prose-blockquote:italic
                                prose-code:before:content-none prose-code:after:content-none
                                mb-32"
                            >
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                        code({ node, inline, className, children, ...props }: any) {
                                            const match = /language-(\w+)/.exec(className || '')
                                            return !inline && match ? (
                                                <div className="my-10 rounded-[2rem] overflow-hidden shadow-2xl">
                                                    <SyntaxHighlighter
                                                        style={atomDark}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, '')}
                                                    </SyntaxHighlighter>
                                                </div>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            )
                                        },
                                        h2: ({ node, children, ...props }: any) => {
                                            const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0621-\u064A-]/g, '');
                                            return <h2 id={id} {...props}>{children}</h2>;
                                        },
                                        h3: ({ node, children, ...props }: any) => {
                                            const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0621-\u064A-]/g, '');
                                            return <h3 id={id} {...props}>{children}</h3>;
                                        }
                                    }}
                                >
                                    {isAr ? post.contentAr : post.contentEn}
                                </ReactMarkdown>
                            </div>

                            <div className="space-y-12">
                                <button
                                    onClick={() => setShowComments(!showComments)}
                                    className="w-full flex items-center justify-between p-8 bg-muted/20 hover:bg-muted/30 border border-border/50 rounded-[2.5rem] transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform">
                                            <MessageSquare size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black">{t('blog.comments')} <span className="opacity-20 ml-2">({post.comments?.length || 0})</span></h2>
                                    </div>
                                    <div className={cn("transition-transform duration-500", showComments ? "rotate-180" : "")}>
                                        <ArrowLeft className="-rotate-90" size={24} />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {showComments && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden space-y-20"
                                        >
                                            <form id="comment-form" onSubmit={handleCommentSubmit} className="p-8 md:p-12 bg-card border-2 border-border/50 rounded-[3.5rem] shadow-2xl shadow-primary/5 space-y-8 mt-12">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-2xl font-black">
                                                        {replyingTo ? (isAr ? `الرد على ${replyingTo.name}` : `Replying to ${replyingTo.name}`) : t('blog.add_comment')}
                                                    </h3>
                                                    {replyingTo && (
                                                        <button
                                                            type="button"
                                                            onClick={() => { setReplyingTo(null); setCommentData({ ...commentData, parentCommentId: undefined }) }}
                                                            className="text-xs font-black text-destructive bg-destructive/10 px-4 py-2 rounded-lg font-outfit"
                                                        >
                                                            {isAr ? 'إلغاء' : 'Cancel'}
                                                        </button>
                                                    )}
                                                </div>
                                                {!currentUser && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <input
                                                            type="text"
                                                            placeholder={t('blog.name_placeholder')}
                                                            className="w-full px-8 py-5 rounded-[1.5rem] bg-muted/30 border-2 border-transparent focus:border-primary focus:bg-background outline-none font-bold transition-all text-lg"
                                                            value={commentData.authorName}
                                                            onChange={e => setCommentData({ ...commentData, authorName: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                )}
                                                <textarea
                                                    rows={5}
                                                    placeholder={t('blog.comment_placeholder')}
                                                    className="w-full px-8 py-8 rounded-[2rem] bg-muted/30 border-2 border-transparent focus:border-primary focus:bg-background outline-none font-medium resize-none shadow-inner transition-all text-lg"
                                                    value={commentData.content}
                                                    onChange={e => setCommentData({ ...commentData, content: e.target.value })}
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={commentMutation.isPending}
                                                    className="w-full md:w-auto inline-flex items-center justify-center gap-4 px-12 py-6 bg-primary text-white rounded-[2rem] font-black text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 active:scale-95"
                                                >
                                                    <Send size={20} />
                                                    {t('blog.post_comment')}
                                                </button>
                                            </form>

                                            <div className="space-y-12">
                                                {post.comments && post.comments.length > 0 ? (
                                                    post.comments.map(comment => (
                                                        <CommentItem key={comment.id} comment={comment} />
                                                    ))
                                                ) : (
                                                    <div className="py-24 text-center border-4 border-dashed border-border/30 rounded-[4rem] group">
                                                        <MessageSquare size={80} className="mx-auto text-muted-foreground/10 mb-8 group-hover:scale-110 transition-transform" />
                                                        <p className="font-black text-muted-foreground text-xl">{t('blog.be_the_first')}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </article>
            </div>

            <AnimatePresence>
                {isLoginModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsLoginModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-card w-full max-w-lg rounded-[3.5rem] p-12 border border-border shadow-2xl relative z-10 text-center"
                        >
                            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-10">
                                <Lock size={40} />
                            </div>
                            <h2 className="text-4xl font-black mb-6 tracking-tight">{isAr ? 'عذراً، يجب تسجيل الدخول' : 'Sign in Required'}</h2>
                            <p className="text-muted-foreground font-medium mb-12 leading-relaxed">
                                {isAr ? 'للقيام بالتفاعل مع المقال (إعجاب أو تعليق)، يرجى تسجيل الدخول أولاً أو إنشاء حساب زائر.' : 'To interact with this post (like or comment), please sign in or create a visitor account.'}
                            </p>
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => navigate('/auth', { state: { from: window.location.pathname, mode: 'login' } })}
                                    className="w-full py-6 bg-primary text-white rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                                >
                                    <LogIn size={20} />
                                    {isAr ? 'تسجيل الدخول' : 'Sign In Now'}
                                </button>
                                <button
                                    onClick={() => navigate('/auth', { state: { from: window.location.pathname, mode: 'register' } })}
                                    className="w-full py-6 bg-white border-2 border-primary/20 text-primary rounded-2xl font-black text-lg transition-all hover:bg-primary/5 active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <Plus size={20} />
                                    {isAr ? 'إنشاء حساب جديد' : 'Create New Account'}
                                </button>
                                <button onClick={() => setIsLoginModalOpen(false)} className="w-full py-4 text-muted-foreground font-black text-sm opacity-50 hover:opacity-100 transition-opacity font-outfit">
                                    {isAr ? 'إلغاء' : 'Continue Reading'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BlogPostDetail;
