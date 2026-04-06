// ============================================
// صفحة 500 - خطأ في الخادم (Server Error Page)
// ============================================
// تظهر هذه الصفحة عندما يحدث خطأ داخلي في الخادم
// تحتوي على:
// 1. رقم 500 كبير بتدرج أحمر-برتقالي
// 2. رسالة توضيحية
// 3. نصائح لحل المشكلة
// 4. أزرار لتحديث الصفحة أو العودة للرئيسية
// 5. رابط للتواصل مع فريق الدعم

// ============ الاستيرادات ============
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, RefreshCw, Shield, AlertTriangle } from 'lucide-react'; // أيقونات
import { motion } from 'framer-motion'; // حركات

// ============ المكون الرئيسي ============
const ServerErrorPage = () => {
  // دالة تحديث الصفحة - تعيد تحميل الصفحة بالكامل
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    // ===== الحاوية الرئيسية - وسط الشاشة =====
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      {/* خلفية ضبابية حمراء للتزيين (لون أحمر لأنه خطأ) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        {/* ── رقم 500 المتحرك ── */}
        {/* بتدرج أحمر-برتقالي */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <h1 className="text-[150px] sm:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 leading-none">
              500
            </h1>
            {/* توهج ضبابي أحمر */}
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-red-400/30 to-orange-500/30"></div>
          </div>
        </motion.div>

        {/* ── رسالة الخطأ ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
            Server Error
          </h2>
          <p className="text-xl text-zinc-400 mb-2">
            Oops! Something went wrong on our end.
          </p>
          <p className="text-zinc-500">
            Our team has been notified and we're working on fixing this issue. Please try again later.
          </p>
        </motion.div>

        {/* ── أيقونة التحذير ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-red-500/10 border border-red-500/30">
            <AlertTriangle className="w-16 h-16 text-red-400" />
          </div>
        </motion.div>

        {/* ── نصائح لحل المشكلة ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">What you can try:</h3>
          <div className="space-y-3 text-left text-zinc-400">
            {/* النصيحة 1: تحديث الصفحة */}
            <div className="flex items-start space-x-3">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Refresh the page or wait a few minutes and try again</span>
            </div>
            {/* النصيحة 2: التحقق من الاتصال */}
            <div className="flex items-start space-x-3">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Check your internet connection</span>
            </div>
            {/* النصيحة 3: التواصل مع الدعم */}
            <div className="flex items-start space-x-3">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Contact our support team if the problem persists</span>
            </div>
          </div>
        </motion.div>

        {/* ── أزرار الإجراءات ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* زر تحديث الصفحة */}
          <button
            onClick={handleRefresh}
            className="group px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all hover:shadow-2xl hover:shadow-blue-500/30 flex items-center space-x-2 text-zinc-100"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Refresh Page</span>
          </button>
          {/* زر العودة للرئيسية */}
          <Link
            to="/"
            className="px-8 py-4 border-2 border-zinc-700 hover:border-blue-400 rounded-lg font-semibold transition-all hover:bg-blue-500/5 flex items-center space-x-2 text-zinc-100"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
        </motion.div>

        {/* ── رابط الدعم ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <p className="text-zinc-500 mb-2">Need immediate assistance?</p>
          <Link
            to="/contact"
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Contact our support team →
          </Link>
        </motion.div>

        {/* ── رمز الخطأ (لأغراض التتبع) ── */}
        {/* يولد رمز فريد باستخدام الوقت الحالي */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-xs text-zinc-600"
        >
          Error Code: SEC-500-{Date.now().toString().slice(-6)}
        </motion.div>
      </motion.div>
    </div>
  );
};

// تصدير المكون
export default ServerErrorPage;
