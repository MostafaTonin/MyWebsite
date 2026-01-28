import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { useLanguage } from './hooks/useLanguage';

// Public Layout & Pages
import Layout from './layouts/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Certifications from './pages/Certifications';
import Projects from './pages/Projects';
import Services from './pages/Services';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import Contact from './pages/Contact';
import BlogAuth from './pages/BlogAuthPage';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './layouts/AdminLayout';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminAboutPage from './pages/admin/AdminAboutPage';
import AdminSkillsPage from './pages/admin/AdminSkillsPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminCertificationsPage from './pages/admin/AdminCertificationsPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';
import AdminNavigationPage from './pages/admin/AdminNavigationPage';
import AdminSocialLinksPage from './pages/admin/AdminSocialLinksPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

const queryClient = new QueryClient();

function AppRoutes() {
  useLanguage(); // Handles RTL/LTR and Font switching

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="skills" element={<Skills />} />
        <Route path="certifications" element={<Certifications />} />
        <Route path="projects" element={<Projects />} />
        <Route path="services" element={<Services />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPostDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="auth" element={<BlogAuth />} />
      </Route>

      {/* Admin Login (Public) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminAnalyticsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="about" element={<AdminAboutPage />} />
        <Route path="skills" element={<AdminSkillsPage />} />
        <Route path="certifications" element={<AdminCertificationsPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="blog" element={<AdminBlogPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="navigation" element={<AdminNavigationPage />} />
        <Route path="social-links" element={<AdminSocialLinksPage />} />
        <Route path="users" element={<AdminUsersPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};


export default App;
