// ============================================
// صفحة نسيت كلمة المرور (Forgot Password Page)
// ============================================
// هذه الصفحة تسمح للمستخدم بطلب رابط إعادة تعيين كلمة المرور
// الخطوات:
// 1. المستخدم يدخل بريده الإلكتروني
// 2. يتم إرسال رابط إعادة التعيين للبريد
// 3. تظهر رسالة تأكيد
// ملاحظة: حالياً النموذج يطبع في Console فقط (بحاجة لربطه بـ Firebase)

// ============ الاستيرادات ============
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Shield, ArrowLeft } from 'lucide-react'; // أيقونات
import { motion } from 'framer-motion'; // حركات

// ============ المكون الرئيسي ============
const ForgotPasswordPage = () => {
  // ===== متغيرات الحالة =====
  const [email, setEmail] = useState('');        // البريد الإلكتروني المدخل
  const [submitted, setSubmitted] = useState(false); // هل تم الإرسال؟ (لإظهار رسالة التأكيد)

  // ===== معالج إرسال النموذج =====
  const handleSubmit = (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    console.log('Password reset requested for:', email); // طباعة في Console (مؤقت)
    setSubmitted(true); // إظهار رسالة التأكيد
  };

  return (
    // ===== الحاوية الرئيسية - وسط الشاشة =====
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      {/* خلفية ضبابية زرقاء للتزيين */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* البطاقة مع حركة ظهور */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full relative z-10"
      >
        {/* ── الشعار ── */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <Shield className="w-10 h-10 text-blue-400" strokeWidth={2} />
            <span className="text-2xl font-bold text-zinc-100">SecOps</span>
          </Link>
        </div>

        {/* ── بطاقة النموذج ── */}
        <div className="p-8 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10">

          {/* ===== عرض مختلف حسب حالة الإرسال ===== */}
          {!submitted ? (
            // ── الحالة 1: لم يتم الإرسال بعد ← عرض النموذج ──
            <>
              {/* عنوان ووصف */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-100 mb-2">Forgot Password?</h1>
                <p className="text-zinc-400">
                  No worries! Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {/* نموذج إدخال البريد */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* حقل البريد الإلكتروني */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    {/* أيقونة البريد */}
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* زر الإرسال */}
                <button
                  type="submit"
                  className="w-full px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all hover:shadow-2xl hover:shadow-blue-500/30 flex items-center justify-center space-x-2 text-zinc-100"
                >
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            // ── الحالة 2: تم الإرسال ← عرض رسالة التأكيد ──
            <div className="text-center py-8">
              {/* أيقونة نجاح */}
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30">
                <Mail className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100 mb-3">Check Your Email</h2>
              <p className="text-zinc-400 mb-6">
                We've sent a password reset link to <strong className="text-zinc-100">{email}</strong>
              </p>
              {/* رابط إعادة المحاولة */}
              <p className="text-sm text-zinc-500 mb-8">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setSubmitted(false)} // العودة للنموذج
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  try again
                </button>
              </p>
            </div>
          )}

          {/* رابط العودة لتسجيل الدخول */}
          <div className="mt-6 text-center">
            <Link
              to="/signin"
              className="inline-flex items-center space-x-2 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// تصدير المكون
export default ForgotPasswordPage;
