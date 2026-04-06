// ============================================
// صفحة إعادة تعيين كلمة المرور (Reset Password Page)
// ============================================
// هذه الصفحة تسمح للمستخدم بإدخال كلمة مرور جديدة
// بعد النقر على رابط إعادة التعيين المرسل لبريده
// الخطوات:
// 1. إدخال كلمة المرور الجديدة وتأكيدها
// 2. التحقق من تطابقهما
// 3. عرض رسالة نجاح ثم التوجيه لتسجيل الدخول
// ملاحظة: حالياً النموذج يطبع في Console فقط (بحاجة لربطه بـ Firebase)

// ============ الاستيرادات ============
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Shield, Check } from 'lucide-react'; // أيقونات
import { motion } from 'framer-motion'; // حركات

// ============ المكون الرئيسي ============
const ResetPasswordPage = () => {
  const navigate = useNavigate(); // للتنقل البرمجي

  // ===== متغيرات الحالة =====
  const [formData, setFormData] = useState({
    password: '',         // كلمة المرور الجديدة
    confirmPassword: ''   // تأكيد كلمة المرور
  });
  const [success, setSuccess] = useState(false); // هل تمت إعادة التعيين بنجاح؟

  // ===== معالج تغيير الحقول =====
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value // تحديث الحقل المتغير فقط
    });
  };

  // ===== معالج إرسال النموذج =====
  const handleSubmit = (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة

    // التحقق: هل كلمتا المرور متطابقتان؟
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    console.log('Password reset:', formData); // طباعة في Console (مؤقت)
    setSuccess(true); // إظهار رسالة النجاح

    // بعد ثانيتين، التوجيه تلقائياً لصفحة تسجيل الدخول
    setTimeout(() => {
      navigate('/signin');
    }, 2000);
  };

  return (
    // ===== الحاوية الرئيسية - وسط الشاشة =====
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      {/* خلفية ضبابية زرقاء */}
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

          {/* ===== عرض مختلف حسب حالة النجاح ===== */}
          {!success ? (
            // ── الحالة 1: لم يتم بعد ← عرض نموذج كلمة المرور الجديدة ──
            <>
              {/* عنوان ووصف */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-100 mb-2">Reset Password</h1>
                <p className="text-zinc-400">
                  Enter your new password below. Make sure it's strong and secure.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* حقل كلمة المرور الجديدة */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8} // الحد الأدنى: 8 أحرف
                      className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="Enter new password"
                    />
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">Must be at least 8 characters long</p>
                </div>

                {/* حقل تأكيد كلمة المرور الجديدة */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                {/* زر إعادة تعيين كلمة المرور */}
                <button
                  type="submit"
                  className="w-full px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all hover:shadow-2xl hover:shadow-blue-500/30 flex items-center justify-center space-x-2 text-zinc-100"
                >
                  <span>Reset Password</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            // ── الحالة 2: تم بنجاح ← عرض رسالة النجاح ──
            <div className="text-center py-8">
              {/* أيقونة نجاح (علامة صح) */}
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100 mb-3">Password Reset Successful!</h2>
              <p className="text-zinc-400 mb-6">
                Your password has been updated. Redirecting you to sign in...
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// تصدير المكون
export default ResetPasswordPage;
