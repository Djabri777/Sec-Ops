

import { useState } from 'react';

import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import ChatBot from './ChatBot';

import { Shield, Lock, Menu, X, Moon, Sun, Languages, LogOut } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const ROLE_PATHS = { admin: '/admin-dashboard', pentester: '/pentester-dashboard', client: '/client-dashboard' };
const DEMO_EMAILS = ['client@gmail.com', 'client2@gmail.com', 'client3@gmail.com'];

const Layout = () => {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { t, toggleLang } = useLang();
  const { currentUser, userRole, userProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isDemo = DEMO_EMAILS.includes(currentUser?.email);
  const hasAccess = userRole !== 'client' || userProfile?.subscriptionActive || isDemo;

  const handleGoToDashboard = () => {
    const path = ROLE_PATHS[userRole];
    if (path) navigate(path);
  };

  const handleLogout = async () => {
    setMobileMenuOpen(false);  
    await logout();            
    navigate('/signin');       
  };

  const navLinks = [
    { name: t('nav.services'), path: '/services' },  
    { name: t('nav.about'),    path: '/about' },     
    { name: t('nav.contact'),  path: '/contact' },   
  ];

  const isActive = (path) => location.pathname === path;

  return (

    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#020617] text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>

      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Shield className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'} group-hover:text-blue-300 transition-colors`} strokeWidth={2} />
                <div className="absolute inset-0 blur-xl bg-blue-400/30 group-hover:bg-blue-400/50 transition-all" />
              </div>
              <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>SecOps</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors ${
                    isActive(link.path)
                      ? isDark ? 'text-blue-400' : 'text-blue-600'
                      : isDark ? 'text-zinc-300 hover:text-zinc-100' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={toggleLang}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}`}
              >
                <Languages className="w-4 h-4" />
                {t('nav.toggleLang')}
              </button>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg border transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-slate-100 hover:bg-slate-200 border-slate-200'}`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5 text-zinc-300" /> : <Moon className="w-5 h-5 text-slate-700" />}
              </button>

              {currentUser ? (
                <>
                  <Link to="/" className={`transition-colors ${isDark ? 'text-zinc-300 hover:text-zinc-100' : 'text-slate-600 hover:text-slate-900'}`}>
                    {t('nav.home')}
                  </Link>
                  {hasAccess ? (
                    <button onClick={handleGoToDashboard} className={`px-5 py-2 rounded-lg font-medium transition-all ${isDark ? 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                      {t('nav.dashboard')}
                    </button>
                  ) : (
                    <Link to="/pricing" className="px-5 py-2 rounded-lg font-medium transition-all bg-cyan-500 hover:bg-cyan-600 text-white">
                      Subscribe
                    </Link>
                  )}
                  <button onClick={handleLogout} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-red-400 hover:bg-red-400/10 border ${isDark ? 'border-red-400/20' : 'border-red-200'}`}>
                    <LogOut className="w-4 h-4" /> {t('common.signOut')}
                  </button>
                </>
              ) : (
                
                <>
                  <Link to="/signin" className={`transition-colors ${isDark ? 'text-zinc-300 hover:text-zinc-100' : 'text-slate-600 hover:text-slate-900'}`}>
                    {t('nav.signIn')}
                  </Link>
                  <Link to="/signup" className={`px-5 py-2 rounded-lg font-medium transition-all ${isDark ? 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                    {t('nav.getStarted')}
                  </Link>
                </>
              )}
            </div>

            <button className={`md:hidden ${isDark ? 'text-zinc-100' : 'text-slate-900'}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className={`md:hidden py-4 space-y-4 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  className={`block transition-colors ${isActive(link.path) ? (isDark ? 'text-blue-400' : 'text-blue-600') : (isDark ? 'text-zinc-300 hover:text-zinc-100' : 'text-slate-600 hover:text-slate-900')}`}
                  onClick={() => setMobileMenuOpen(false)} 
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-1">
                <button onClick={toggleLang} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border ${isDark ? 'bg-white/5 border-white/10 text-zinc-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                  <Languages className="w-4 h-4" />{t('nav.toggleLang')}
                </button>
                <button onClick={toggleTheme} className={isDark ? 'text-zinc-300' : 'text-slate-700'}>
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
              {currentUser ? (
                <>
                  <Link to="/" className={`block ${isDark ? 'text-zinc-300 hover:text-zinc-100' : 'text-slate-600 hover:text-slate-900'}`} onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.home')}
                  </Link>
                  {hasAccess ? (
                    <button onClick={handleGoToDashboard} className="block w-full px-6 py-2 rounded-lg font-medium text-center bg-blue-600 hover:bg-blue-700 text-white">
                      {t('nav.dashboard')}
                    </button>
                  ) : (
                    <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="block w-full px-6 py-2 rounded-lg font-medium text-center bg-cyan-500 hover:bg-cyan-600 text-white">
                      Subscribe
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors">
                    <LogOut className="w-4 h-4" /> {t('common.signOut')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signin" className={`block ${isDark ? 'text-zinc-300 hover:text-zinc-100' : 'text-slate-600 hover:text-slate-900'}`} onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.signIn')}
                  </Link>
                  <Link to="/signup" className="block w-full px-6 py-2 rounded-lg font-medium text-center bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.getStarted')}
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <motion.main key={location.pathname} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="pt-16">
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <ChatBot />

      <footer className={`py-12 px-4 sm:px-6 lg:px-8 border-t ${isDark ? 'border-white/10 bg-[#020617]' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center space-x-2">
              <Shield className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`font-bold ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>SecOps</span>
            </div>
            <div className={`flex flex-wrap justify-center gap-8 text-sm ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              {[{ label: 'Home', to: '/' }, { label: t('nav.services'), to: '/services' }, { label: t('nav.about'), to: '/about' }, { label: t('nav.contact'), to: '/contact' }].map((l) => (
                <Link key={l.to} to={l.to} className={`transition-colors ${isDark ? 'hover:text-zinc-100' : 'hover:text-slate-900'}`}>{l.label}</Link>
              ))}
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
              <Lock className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`text-sm font-medium ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>Secure by Design</span>
            </div>
          </div>
          <div className={`mt-8 text-center text-sm ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
            © 2026 SecOps. Empowering Algerian startups with enterprise security.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
