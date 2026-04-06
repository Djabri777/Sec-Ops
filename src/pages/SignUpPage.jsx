// ============================================
// صفحة إنشاء حساب جديد (Sign Up Page)
// ============================================
// هذه الصفحة تسمح للمستخدم الجديد بإنشاء حساب
// الخطوات:
// 1. ملء النموذج (الاسم، البريد، الهاتف، كلمة المرور، نوع الخدمة)
// 2. إنشاء حساب في Firebase Authentication
// 3. حفظ بيانات المستخدم في Firestore
// 4. التوجيه للوحة تحكم العميل
// ملاحظة: جميع الحسابات الجديدة تحصل على دور "client" (عميل)

// ============ الاستيرادات ============
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Phone, ArrowRight, Shield, User, AlertCircle } from "lucide-react"; // أيقونات
import { motion } from "framer-motion";
import { createUserWithEmailAndPassword } from "firebase/auth"; // دالة إنشاء حساب Firebase
import { auth } from "../firebase";
import { createUserDocument } from "../services/firestoreService"; // حفظ بيانات المستخدم في قاعدة البيانات
import { useTheme } from "../contexts/ThemeContext";
import { useLang } from "../contexts/LanguageContext";

// ===== أنواع الخدمات المتاحة =====
// يختار المستخدم نوع الخدمة عند التسجيل
const SERVICE_TYPES = [
  { value: "starter",    labelKey: "auth.serviceTypes.starter"    },  // المبتدئ
  { value: "growth",     labelKey: "auth.serviceTypes.growth"     },  // النمو
  { value: "enterprise", labelKey: "auth.serviceTypes.enterprise" },  // المؤسسات
];

// ============ المكون الرئيسي ============
const SignUpPage = () => {
  const navigate = useNavigate();    // للتنقل البرمجي
  const { isDark } = useTheme();     // الثيم
  const { t } = useLang();          // الترجمة

  // ===== متغيرات الحالة =====
  const [formData, setFormData] = useState({
    name: "",             // اسم المستخدم
    email: "",            // البريد الإلكتروني
    phone: "",            // رقم الهاتف
    password: "",         // كلمة المرور
    confirmPassword: "",  // تأكيد كلمة المرور
    serviceType: "starter", // نوع الخدمة المختار (الافتراضي: starter)
  });
  const [error, setError] = useState("");      // رسالة الخطأ
  const [loading, setLoading] = useState(false); // حالة التحميل

  // ===== أصناف CSS حسب الثيم =====
  const text    = isDark ? "text-zinc-100" : "text-slate-900";
  const muted   = isDark ? "text-zinc-400" : "text-slate-500";
  const label   = isDark ? "text-zinc-300" : "text-slate-700";
  const cardBg  = isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-xl";
  const inputBg = isDark
    ? "bg-white/5 border-white/10 text-zinc-100 placeholder-zinc-500 focus:border-blue-400"
    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500";
  const iconColor = isDark ? "text-zinc-500" : "text-slate-400"; // لون الأيقونات في الحقول

  // ===== معالج تغيير الحقول =====
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ===== معالج إرسال النموذج =====
  const handleSubmit = async (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة

    // التحقق 1: هل كلمتا المرور متطابقتان؟
    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.errors.passwordMismatch"));
      return;
    }
    // التحقق 2: هل كلمة المرور طويلة بما فيه الكفاية؟ (6 أحرف على الأقل)
    if (formData.password.length < 6) {
      setError(t("auth.errors.passwordShort"));
      return;
    }

    setError("");       // مسح الأخطاء السابقة
    setLoading(true);   // تفعيل التحميل
    try {
      // الخطوة 1: إنشاء حساب في Firebase Authentication
      const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      // الخطوة 2: حفظ بيانات المستخدم في Firestore (قاعدة البيانات)
      await createUserDocument(user.uid, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: "client",                  // الدور الافتراضي: عميل
        serviceType: formData.serviceType,
      });

      // الخطوة 3: التوجيه للوحة تحكم العميل
      navigate("/client-dashboard", { replace: true });
    } catch (err) {
      // عرض رسالة الخطأ المناسبة
      setError(getErrorMsg(err.code, t));
    } finally {
      setLoading(false); // إيقاف التحميل في جميع الحالات
    }
  };

  return (
    // ===== الحاوية الرئيسية =====
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* خلفية ضبابية زرقاء */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* بطاقة التسجيل مع حركة ظهور */}
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
          {/* عنوان الصفحة */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold ${text} mb-2`}>{t("auth.createAccount")}</h1>
            <p className={muted}>{t("auth.createSubtitle")}</p>
          </div>

          {/* رسالة الخطأ */}
          {error && (
            <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* ── نموذج التسجيل ── */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* حقل الاسم الكامل */}
            <div>
              <label htmlFor="name" className={`block text-sm font-medium ${label} mb-2`}>{t("auth.fullName")}</label>
              <div className="relative">
                <User className={`absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconColor}`} />
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                  className={`w-full ps-11 pe-4 py-3 rounded-xl border ${inputBg} focus:outline-none transition-colors`}
                  placeholder={t("auth.fullNamePlaceholder")} />
              </div>
            </div>

            {/* حقل البريد الإلكتروني */}
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${label} mb-2`}>{t("auth.email")}</label>
              <div className="relative">
                <Mail className={`absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconColor}`} />
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                  className={`w-full ps-11 pe-4 py-3 rounded-xl border ${inputBg} focus:outline-none transition-colors`}
                  placeholder={t("auth.emailPlaceholder")} />
              </div>
            </div>

            {/* حقل رقم الهاتف */}
            <div>
              <label htmlFor="phone" className={`block text-sm font-medium ${label} mb-2`}>{t("auth.phone")}</label>
              <div className="relative">
                <Phone className={`absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconColor}`} />
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required
                  className={`w-full ps-11 pe-4 py-3 rounded-xl border ${inputBg} focus:outline-none transition-colors`}
                  placeholder={t("auth.phonePlaceholder")} />
              </div>
            </div>

            {/* ── اختيار نوع الخدمة ── */}
            {/* 3 أزرار يختار المستخدم منها نوع الخدمة */}
            <div>
              <label className={`block text-sm font-medium ${label} mb-2`}>{t("auth.serviceType")}</label>
              <div className="grid grid-cols-3 gap-2">
                {SERVICE_TYPES.map(({ value, labelKey }) => (
                  <button
                    key={value}
                    type="button" // type="button" لمنع إرسال النموذج عند الضغط
                    onClick={() => setFormData({ ...formData, serviceType: value })}
                    className={`relative px-3 py-3 rounded-xl border text-sm font-medium transition-all ${
                      formData.serviceType === value
                        ? "bg-blue-500/20 border-blue-400/60 text-blue-400 shadow-sm shadow-blue-500/20" // الزر المختار
                        : isDark
                          ? "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:border-white/20"
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    {/* نقطة زرقاء صغيرة تظهر على الزر المختار */}
                    {formData.serviceType === value && (
                      <span className="absolute top-1.5 end-1.5 w-1.5 h-1.5 rounded-full bg-blue-400" />
                    )}
                    {t(labelKey)}
                  </button>
                ))}
              </div>
              {/* وصف نوع الخدمة المختار */}
              <p className={`mt-1.5 text-xs ${muted}`}>{t(`auth.serviceDescriptions.${formData.serviceType}`)}</p>
            </div>

            {/* حقل كلمة المرور */}
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${label} mb-2`}>{t("auth.password")}</label>
              <div className="relative">
                <Lock className={`absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconColor}`} />
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required
                  className={`w-full ps-11 pe-4 py-3 rounded-xl border ${inputBg} focus:outline-none transition-colors`}
                  placeholder={t("auth.passwordPlaceholder2")} />
              </div>
            </div>

            {/* حقل تأكيد كلمة المرور */}
            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium ${label} mb-2`}>{t("auth.confirmPassword")}</label>
              <div className="relative">
                <Lock className={`absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconColor}`} />
                <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                  className={`w-full ps-11 pe-4 py-3 rounded-xl border ${inputBg} focus:outline-none transition-colors`}
                  placeholder={t("auth.confirmPlaceholder")} />
              </div>
            </div>

            {/* ── الموافقة على الشروط ── */}
            <div className="flex items-start">
              <input type="checkbox" id="terms" required
                className="w-4 h-4 mt-1 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-blue-500" />
              <label htmlFor="terms" className={`ms-2 text-sm ${muted}`}>
                {t("auth.termsAgree")}{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">{t("auth.termsService")}</a>
                {" "}{t("auth.and")}{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">{t("auth.privacy")}</a>
              </label>
            </div>

            {/* زر إنشاء الحساب */}
            <button type="submit" disabled={loading}
              className="w-full px-8 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 text-white">
              <span>{loading ? t("auth.creating") : t("auth.createAccount")}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* رابط تسجيل الدخول لمن لديه حساب */}
          <div className="mt-6 text-center">
            <p className={muted}>
              {t("auth.haveAccount")}{" "}
              <Link to="/signin" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">{t("auth.signIn")}</Link>
            </p>
          </div>
        </div>

        {/* ملاحظة أمان البيانات */}
        <div className={`mt-6 text-center text-sm ${muted}`}>
          <Lock className="w-4 h-4 inline-block me-1" /> {t("auth.dataSecure")}
        </div>
      </motion.div>
    </div>
  );
};

// ===== دالة تحويل رموز أخطاء Firebase لرسائل مفهومة =====
const getErrorMsg = (code, t) => {
  switch (code) {
    case "auth/email-already-in-use": return t("auth.errors.emailInUse");        // البريد مستخدم مسبقاً
    case "auth/invalid-email":        return t("auth.errors.invalidEmail");       // بريد غير صالح
    case "auth/weak-password":        return t("auth.errors.weakPassword");       // كلمة مرور ضعيفة
    default:                          return t("auth.errors.registrationFailed"); // خطأ عام
  }
};

// تصدير المكون
export default SignUpPage;
