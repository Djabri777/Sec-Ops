// ============================================
// مكون التخطيط الرئيسي (Layout)
// ============================================
// هذا المكون يحدد الهيكل العام لصفحات التطبيق:
// 1. شريط التنقل (Navbar) في الأعلى - مع شعار، روابط، وأزرار
// 2. المحتوى الرئيسي (Main Content) في الوسط - يتغير حسب الصفحة
// 3. التذييل (Footer) في الأسفل
//
// يستخدم <Outlet /> من React Router لعرض محتوى الصفحة الحالية
// ويضيف حركات انتقالية (animations) عند التنقل بين الصفحات

// استيراد الأدوات اللازمة
import { useState } from 'react';
// Link: رابط للتنقل بين الصفحات
// useLocation: لمعرفة الصفحة الحالية
// Outlet: لعرض محتوى المسار الفرعي
// useNavigate: للتنقل البرمجي
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
// أيقونات من مكتبة Lucide
import { Shield, Lock, Menu, X, Moon, Sun, Languages, LogOut } from 'lucide-react';
// مكونات الحركة من Framer Motion
import { motion, AnimatePresence } from 'framer-motion';
// استيراد السياقات (الثيم، اللغة، المصادقة)
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

// ===== خريطة مسارات لوحات التحكم حسب الدور =====
const ROLE_PATHS = { admin: '/admin-dashboard', pentester: '/pentester-dashboard', client: '/client-dashboard' };

// ============ المكون الرئيسي ============
const Layout = () => {
  // ===== متغيرات الحالة والسياق =====
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // حالة القائمة في الجوال (مفتوحة/مغلقة)
  const { isDark, toggleTheme } = useTheme();    // الثيم الحالي ودالة التبديل
  const { t, toggleLang } = useLang();           // دالة الترجمة ودالة تبديل اللغة
  const { currentUser, userRole, logout } = useAuth(); // بيانات المستخدم ودالة تسجيل الخروج
  const location = useLocation();                 // الموقع الحالي (المسار)
  const navigate = useNavigate();                  // دالة التنقل البرمجي

  // ===== الذهاب للوحة التحكم حسب دور المستخدم =====
  const handleGoToDashboard = () => {
    const path = ROLE_PATHS[userRole]; // جلب مسار لوحة التحكم المناسبة
    if (path) navigate(path);          // التنقل إليها
  };

  // ===== تسجيل الخروج =====
  const handleLogout = async () => {
    setMobileMenuOpen(false);  // إغلاق قائمة الجوال
    await logout();            // تسجيل الخروج من Firebase
    navigate('/signin');       // التوجيه لصفحة تسجيل الدخول
  };

  // ===== تعريف روابط التنقل =====
  const navLinks = [
    { name: t('nav.services'), path: '/services' },  // صفحة الخدمات
    { name: t('nav.about'),    path: '/about' },     // صفحة من نحن
    { name: t('nav.contact'),  path: '/contact' },   // صفحة اتصل بنا
  ];

  // دالة للتحقق هل الرابط هو الصفحة الحالية (لتلوينه بشكل مختلف)
  const isActive = (path) => location.pathname === path;

  return (
    // ===== الحاوية الرئيسية =====
    // تأخذ كامل ارتفاع الشاشة وتتغير ألوانها حسب الثيم
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#020617] text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>

      {/* ====== شريط التنقل (Navbar) ====== */}
      {/* ثابت في أعلى الشاشة مع تأثير زجاجي (glassmorphism) */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* ── الشعار (Logo) ── */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                {/* أيقونة الدرع */}
                <Shield className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'} group-hover:text-blue-300 transition-colors`} strokeWidth={2} />
                {/* تأثير التوهج خلف الأيقونة */}
                <div className="absolute inset-0 blur-xl bg-blue-400/30 group-hover:bg-blue-400/50 transition-all" />
              </div>
              {/* اسم التطبيق */}
              <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>SecOps</span>
            </Link>

            {/* ── روابط التنقل (للشاشات الكبيرة) ── */}
            {/* hidden md:flex = مخفي على الجوال، مرئي على الشاشات المتوسطة وأكبر */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors ${
                    isActive(link.path)
                      ? isDark ? 'text-blue-400' : 'text-blue-600'           // الرابط النشط: أزرق
                      : isDark ? 'text-zinc-300 hover:text-zinc-100' : 'text-slate-600 hover:text-slate-900' // غير نشط
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* ── أزرار الجانب الأيمن (للشاشات الكبيرة) ── */}
            <div className="hidden md:flex items-center space-x-3">
              {/* زر تبديل اللغة */}
              <button
                onClick={toggleLang}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}`}
              >
                <Languages className="w-4 h-4" />
                {t('nav.toggleLang')} {/* النص: "العربية" أو "English" */}
              </button>

              {/* زر تبديل الثيم (داكن/فاتح) */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg border transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-slate-100 hover:bg-slate-200 border-slate-200'}`}
                aria-label="Toggle theme"
              >
                {/* أيقونة الشمس في الوضع الداكن، أيقونة القمر في الوضع الفاتح */}
                {isDark ? <Sun className="w-5 h-5 text-zinc-300" /> : <Moon className="w-5 h-5 text-slate-700" />}
              </button>

              {/* ── عرض مختلف حسب حالة تسجيل الدخول ── */}
              {currentUser ? (
                // المستخدم مسجل دخوله ← عرض: الرئيسية، لوحة التحكم، تسجيل الخروج
                <>
                  <Link to="/" className={`transition-colors ${isDark ? 'text-zinc-300 hover:text-zinc-100' : 'text-slate-600 hover:text-slate-900'}`}>
                    {t('nav.home')}
                  </Link>
                  {/* زر الذهاب للوحة التحكم */}
                  <button onClick={handleGoToDashboard} className={`px-5 py-2 rounded-lg font-medium transition-all ${isDark ? 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                    {t('nav.dashboard')}
                  </button>
                  {/* زر تسجيل الخروج */}
                  <button onClick={handleLogout} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-red-400 hover:bg-red-400/10 border ${isDark ? 'border-red-400/20' : 'border-red-200'}`}>
                    <LogOut className="w-4 h-4" /> {t('common.signOut')}
                  </button>
                </>
              ) : (
                // المستخدم غير مسجل ← عرض: تسجيل الدخول، ابدأ الآن
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

            {/* ── زر القائمة للجوال ── */}
            {/* يظهر فقط على الشاشات الصغيرة (md:hidden) */}
            <button className={`md:hidden ${isDark ? 'text-zinc-100' : 'text-slate-900'}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {/* X عندما تكون القائمة مفتوحة، ☰ عندما تكون مغلقة */}
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* ====== قائمة الجوال (Mobile Menu) ====== */}
          {/* تظهر فقط عند الضغط على زر القائمة في الجوال */}
          {mobileMenuOpen && (
            <div className={`md:hidden py-4 space-y-4 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              {/* روابط التنقل */}
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  className={`block transition-colors ${isActive(link.path) ? (isDark ? 'text-blue-400' : 'text-blue-600') : (isDark ? 'text-zinc-300 hover:text-zinc-100' : 'text-slate-600 hover:text-slate-900')}`}
                  onClick={() => setMobileMenuOpen(false)} // إغلاق القائمة بعد الضغط
                >
                  {link.name}
                </Link>
              ))}
              {/* أزرار اللغة والثيم */}
              <div className="flex items-center gap-3 pt-1">
                <button onClick={toggleLang} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border ${isDark ? 'bg-white/5 border-white/10 text-zinc-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                  <Languages className="w-4 h-4" />{t('nav.toggleLang')}
                </button>
                <button onClick={toggleTheme} className={isDark ? 'text-zinc-300' : 'text-slate-700'}>
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
              {/* أزرار المصادقة في الجوال */}
              {currentUser ? (
                <>
                  <Link to="/" className={`block ${isDark ? 'text-zinc-300 hover:text-zinc-100' : 'text-slate-600 hover:text-slate-900'}`} onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.home')}
                  </Link>
                  <button onClick={handleGoToDashboard} className="block w-full px-6 py-2 rounded-lg font-medium text-center bg-blue-600 hover:bg-blue-700 text-white">
                    {t('nav.dashboard')}
                  </button>
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

      {/* ====== المحتوى الرئيسي ====== */}
      {/* AnimatePresence: يسمح بحركات انتقالية عند تغيير الصفحة */}
      <AnimatePresence mode="wait">
        {/* motion.main: يضيف حركة ظهور وخروج للمحتوى */}
        {/* initial: الحالة الابتدائية (شفاف ومنزلق للأسفل) */}
        {/* animate: الحالة النهائية (مرئي وفي مكانه) */}
        {/* exit: حالة الخروج (شفاف ومنزلق للأعلى) */}
        <motion.main key={location.pathname} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="pt-16">
          {/* Outlet: هنا يظهر محتوى الصفحة الحالية */}
          {/* pt-16: حشو علوي لتجنب التداخل مع شريط التنقل الثابت */}
          <Outlet />
        </motion.main>
      </AnimatePresence>

      {/* ====== التذييل (Footer) ====== */}
      <footer className={`py-12 px-4 sm:px-6 lg:px-8 border-t ${isDark ? 'border-white/10 bg-[#020617]' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* شعار التذييل */}
            <div className="flex items-center space-x-2">
              <Shield className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`font-bold ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>SecOps</span>
            </div>
            {/* روابط التذييل */}
            <div className={`flex flex-wrap justify-center gap-8 text-sm ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              {[{ label: 'Home', to: '/' }, { label: t('nav.services'), to: '/services' }, { label: t('nav.about'), to: '/about' }, { label: t('nav.contact'), to: '/contact' }].map((l) => (
                <Link key={l.to} to={l.to} className={`transition-colors ${isDark ? 'hover:text-zinc-100' : 'hover:text-slate-900'}`}>{l.label}</Link>
              ))}
            </div>
            {/* شارة "Secure by Design" */}
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
              <Lock className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`text-sm font-medium ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>Secure by Design</span>
            </div>
          </div>
          {/* حقوق النشر */}
          <div className={`mt-8 text-center text-sm ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
            © 2026 SecOps. Empowering Algerian startups with enterprise security.
          </div>
        </div>
      </footer>
    </div>
  );
};

// تصدير المكون
export default Layout;
