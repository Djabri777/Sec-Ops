// ============================================
// المكون الرئيسي للتطبيق - App.jsx
// ============================================
// هذا الملف هو قلب التطبيق. يقوم بـ:
// 1. تغليف التطبيق بالـ Providers (موفري السياق) - للثيم واللغة والمصادقة
// 2. تعريف جميع المسارات (Routes) - أي صفحة تظهر عند كل رابط
// 3. حماية بعض المسارات حسب دور المستخدم (admin, pentester, client)

// ============ استيراد مكتبات التوجيه ============
// BrowserRouter: يدير التنقل بين الصفحات باستخدام عناوين URL
// Routes: يحتوي على جميع المسارات
// Route: يعرّف مسار واحد (رابط + صفحة)
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ============ استيراد موفري السياق (Context Providers) ============
// هؤلاء يوفرون بيانات مشتركة لجميع المكونات في التطبيق
import { AuthProvider } from './contexts/AuthContext';       // موفر المصادقة (معلومات المستخدم)
import { ThemeProvider } from './contexts/ThemeContext';      // موفر الثيم (داكن/فاتح)
import { LanguageProvider } from './contexts/LanguageContext'; // موفر اللغة (عربي/إنجليزي)

// ============ استيراد المكونات المشتركة ============
import ProtectedRoute from './components/ProtectedRoute'; // مكون حماية المسارات
import Layout from './components/Layout';                   // مكون التخطيط (شريط التنقل + التذييل)

// ============ استيراد الصفحات العامة ============
import HomePage from './pages/HomePage';                     // الصفحة الرئيسية
import ServicesPage from './pages/ServicesPage';             // صفحة الخدمات
import AboutPage from './pages/AboutPage';                   // صفحة من نحن
import ContactPage from './pages/ContactPage';               // صفحة اتصل بنا
import SignInPage from './pages/SignInPage';                  // صفحة تسجيل الدخول
import SignUpPage from './pages/SignUpPage';                  // صفحة إنشاء حساب
import ForgotPasswordPage from './pages/ForgotPasswordPage'; // صفحة نسيت كلمة المرور
import ResetPasswordPage from './pages/ResetPasswordPage';   // صفحة إعادة تعيين كلمة المرور
import NotFoundPage from './pages/NotFoundPage';             // صفحة 404 - غير موجود
import ServerErrorPage from './pages/ServerErrorPage';       // صفحة 500 - خطأ في الخادم

// ============ استيراد لوحات التحكم ============
import AdminDashboard from './pages/AdminDashboard';         // لوحة تحكم المدير
import PentesterDashboard from './pages/PentesterDashboard'; // لوحة تحكم مختبر الاختراق
import ClientDashboard from './pages/ClientDashboard';       // لوحة تحكم العميل

// استيراد أنماط التطبيق
import './App.css';

// ============ المكون الرئيسي ============
function App() {
  return (
    // ThemeProvider: يغلف التطبيق لتوفير وظيفة التبديل بين الوضع الداكن والفاتح
    <ThemeProvider>
      {/* LanguageProvider: يوفر وظيفة تبديل اللغة (عربي/إنجليزي) */}
      <LanguageProvider>
        {/* Router: يدير التنقل - Vite's base في vite.config.js يتعامل مع المسار */}
        <Router>
          {/* AuthProvider: يوفر معلومات المستخدم الحالي لجميع المكونات */}
          <AuthProvider>
            {/* Routes: يحتوي على جميع تعريفات المسارات */}
            <Routes>
              {/* ====== المسارات العامة (داخل Layout = مع شريط التنقل والتذييل) ====== */}
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />                        {/* الرئيسية */}
                <Route path="/services" element={<ServicesPage />} />             {/* الخدمات */}
                <Route path="/about" element={<AboutPage />} />                  {/* من نحن */}
                <Route path="/contact" element={<ContactPage />} />              {/* اتصل بنا */}
                <Route path="/signin" element={<SignInPage />} />                {/* تسجيل الدخول */}
                <Route path="/signup" element={<SignUpPage />} />                {/* إنشاء حساب */}
                <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* نسيت كلمة المرور */}
                <Route path="/reset-password" element={<ResetPasswordPage />} /> {/* إعادة تعيين كلمة المرور */}
                <Route path="/500" element={<ServerErrorPage />} />              {/* صفحة خطأ الخادم */}
                <Route path="*" element={<NotFoundPage />} />                    {/* أي مسار غير معروف = 404 */}
              </Route>

              {/* ====== المسارات المحمية (تتطلب تسجيل دخول + دور محدد) ====== */}

              {/* لوحة تحكم المدير - فقط المستخدمون بدور "admin" يمكنهم الوصول */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              {/* لوحة تحكم مختبر الاختراق - فقط المستخدمون بدور "pentester" */}
              <Route
                path="/pentester-dashboard"
                element={
                  <ProtectedRoute allowedRole="pentester">
                    <PentesterDashboard />
                  </ProtectedRoute>
                }
              />
              {/* لوحة تحكم العميل - فقط المستخدمون بدور "client" */}
              <Route
                path="/client-dashboard"
                element={
                  <ProtectedRoute allowedRole="client">
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

// تصدير المكون لاستخدامه في main.jsx
export default App;
