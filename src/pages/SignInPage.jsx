// ============================================
// صفحة تسجيل الدخول (Sign In Page)
// ============================================
// هذه الصفحة تسمح للمستخدم بتسجيل الدخول إلى حسابه
// تستخدم Firebase Authentication للتحقق من البريد وكلمة المرور
// بعد تسجيل الدخول الناجح، يُحوَّل المستخدم تلقائياً للوحة تحكمه حسب دوره

// ============ الاستيرادات ============
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // للتنقل بين الصفحات
import { Mail, Lock, ArrowRight, Shield, AlertCircle } from "lucide-react"; // أيقونات
import { motion } from "framer-motion";                // حركات انتقالية
import { signInWithEmailAndPassword } from "firebase/auth"; // دالة تسجيل الدخول من Firebase
import { auth } from "../firebase";                    // كائن المصادقة
import { useAuth } from "../contexts/AuthContext";     // سياق المصادقة
import { useTheme } from "../contexts/ThemeContext";   // سياق الثيم
import { useLang } from "../contexts/LanguageContext"; // سياق اللغة

// ===== خريطة المسارات حسب الدور =====
// بعد تسجيل الدخول، كل دور يذهب للوحة تحكمه
const ROLE_PATHS = { admin: "/admin-dashboard", pentester: "/pentester-dashboard", client: "/client-dashboard" };

// ============ المكون الرئيسي ============
const SignInPage = () => {
  const navigate = useNavigate();                       // دالة التنقل البرمجي
  const { currentUser, userRole } = useAuth();          // بيانات المستخدم الحالي
  const { isDark } = useTheme();                        // الثيم الحالي
  const { t } = useLang();                              // دالة الترجمة

  // ===== متغيرات الحالة (State) =====
  const [formData, setFormData] = useState({ email: "", password: "" }); // بيانات النموذج
  const [error, setError] = useState("");                // رسالة الخطأ
  const [loading, setLoading] = useState(false);         // حالة التحميل (هل يتم إرسال الطلب؟)
  const [pendingRedirect, setPendingRedirect] = useState(false); // هل ننتظر التوجيه؟

  // ===== التوجيه التلقائي بعد تسجيل الدخول =====
  // عندما يحلّ AuthContext الدور بعد تسجيل الدخول، ينتقل المستخدم للوحة تحكمه
  useEffect(() => {
    if (pendingRedirect && currentUser && userRole) {
      navigate(ROLE_PATHS[userRole] || "/", { replace: true });
    }
  }, [pendingRedirect, currentUser, userRole]);

  // ===== أصناف CSS حسب الثيم =====
  const text    = isDark ? "text-zinc-100" : "text-slate-900";   // لون النص
  const muted   = isDark ? "text-zinc-400" : "text-slate-500";   // لون النص الباهت
  const label   = isDark ? "text-zinc-300" : "text-slate-700";   // لون تسميات الحقول
  const cardBg  = isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-xl"; // خلفية البطاقة
  const inputBg = isDark
    ? "bg-white/5 border-white/10 text-zinc-100 placeholder-zinc-500 focus:border-blue-400"
    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"; // أنماط حقول الإدخال

  // ===== معالج تغيير الحقول =====
  // يحدث قيمة الحقل المتغير في formData
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ===== معالج إرسال النموذج =====
  const handleSubmit = async (e) => {
    e.preventDefault();       // منع السلوك الافتراضي (إعادة تحميل الصفحة)
    setError("");              // مسح أي خطأ سابق
    setLoading(true);          // تفعيل حالة التحميل
    try {
      // محاولة تسجيل الدخول باستخدام Firebase
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      // نجاح ← ننتظر AuthContext ليحل الدور ثم useEffect سيتولى التوجيه
      setPendingRedirect(true);
      // مهلة للتوجيه - إذا لم يحدث خلال 5 ثوانٍ، إعادة المحاولة
      setTimeout(() => {
        if (!userRole && currentUser) {
          // إذا كان المستخدم مسجل دخول لكن بدون دور، أعد المحاولة أو وجه للصفحة الرئيسية
          navigate("/", { replace: true });
        }
      }, 5000);
    } catch (err) {
      // فشل ← عرض رسالة الخطأ المناسبة
      setError(getErrorMsg(err.code, t));
      setLoading(false);
    }
  };

  return (
    // ===== الحاوية الرئيسية - وسط الشاشة =====
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      {/* دائرة ضبابية زرقاء للتزيين */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* بطاقة تسجيل الدخول مع حركة ظهور */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-md w-full relative z-10">

        {/* ── الشعار ── */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Shield className="w-10 h-10 text-blue-400" strokeWidth={2} />
            <span className={`text-2xl font-bold ${text}`}>SecOps</span>
          </Link>
        </div>

        {/* ── بطاقة النموذج ── */}
        <div className={`p-8 rounded-2xl backdrop-blur-sm border ${cardBg}`}>
          {/* عنوان وترحيب */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold ${text} mb-2`}>{t("auth.welcomeBack")}</h1>
            <p className={muted}>{t("auth.signInSubtitle")}</p>
          </div>

          {/* ── رسالة الخطأ (تظهر فقط عند وجود خطأ) ── */}
          {error && (
            <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* ── نموذج تسجيل الدخول ── */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* حقل البريد الإلكتروني */}
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${label} mb-2`}>{t("auth.email")}</label>
              <div className="relative">
                {/* أيقونة البريد داخل الحقل */}
                <Mail className={`absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-zinc-500" : "text-slate-400"}`} />
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                  className={`w-full ps-11 pe-4 py-3 rounded-xl border ${inputBg} focus:outline-none transition-colors`}
                  placeholder={t("auth.emailPlaceholder")} />
              </div>
            </div>

            {/* حقل كلمة المرور */}
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${label} mb-2`}>{t("auth.password")}</label>
              <div className="relative">
                {/* أيقونة القفل داخل الحقل */}
                <Lock className={`absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-zinc-500" : "text-slate-400"}`} />
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required
                  className={`w-full ps-11 pe-4 py-3 rounded-xl border ${inputBg} focus:outline-none transition-colors`}
                  placeholder={t("auth.passwordPlaceholder")} />
              </div>
            </div>

            {/* صف "تذكرني" و "نسيت كلمة المرور" */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-blue-500" />
                <label htmlFor="remember" className={`ms-2 text-sm ${muted}`}>{t("auth.rememberMe")}</label>
              </div>
              <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">{t("auth.forgotPassword")}</Link>
            </div>

            {/* زر تسجيل الدخول */}
            <button type="submit" disabled={loading}
              className="w-full px-8 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 text-white">
              {/* يعرض "جاري التسجيل..." أثناء التحميل */}
              <span>{loading ? t("auth.signingIn") : t("auth.signIn")}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* رابط إنشاء حساب جديد */}
          <div className="mt-6 text-center">
            <p className={muted}>
              {t("auth.noAccount")}{" "}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">{t("auth.signUp")}</Link>
            </p>
          </div>
        </div>

        {/* ملاحظة التشفير في الأسفل */}
        <div className={`mt-6 text-center text-sm ${muted}`}>
          <Lock className="w-4 h-4 inline-block me-1" /> {t("auth.encrypted")}
        </div>
      </motion.div>
    </div>
  );
};

// ===== دالة تحويل رموز أخطاء Firebase إلى رسائل مفهومة =====
// Firebase يرسل رموز خطأ مثل "auth/user-not-found"
// نحولها لرسائل مترجمة يفهمها المستخدم
const getErrorMsg = (code, t) => {
  switch (code) {
    case "auth/user-not-found":      // المستخدم غير موجود
    case "auth/wrong-password":      // كلمة مرور خاطئة
    case "auth/invalid-credential":  // بيانات اعتماد غير صالحة
      return t("auth.errors.invalidCredentials");
    case "auth/too-many-requests":   // محاولات كثيرة جداً
      return t("auth.errors.tooManyRequests");
    case "auth/user-disabled":       // الحساب معطل
      return t("auth.errors.userDisabled");
    default:                         // خطأ غير معروف
      return t("auth.errors.signInFailed");
  }
};

// تصدير المكون
export default SignInPage;
