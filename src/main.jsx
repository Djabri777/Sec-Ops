// ============================================
// الملف الرئيسي - نقطة بداية التطبيق
// ============================================
// هذا هو أول ملف يتم تنفيذه عند تشغيل التطبيق
// وظيفته: ربط تطبيق React بصفحة HTML

// استيراد مكتبة React الأساسية
import React from 'react'
// استيراد ReactDOM المسؤول عن عرض التطبيق في المتصفح
import ReactDOM from 'react-dom/client'
// استيراد المكون الرئيسي للتطبيق
import App from './App.jsx'
// استيراد ملفات التنسيق (CSS)
import './index.css'  // أنماط Tailwind الأساسية
import './App.css'    // أنماط التطبيق المخصصة

// إنشاء جذر التطبيق وربطه بعنصر HTML الذي يحمل المعرف 'root'
// ثم عرض (render) تطبيقنا بداخله
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode = وضع صارم للتطوير فقط
  // يساعد في اكتشاف الأخطاء والمشاكل المحتملة أثناء التطوير
  // لا يؤثر على الأداء في الإنتاج (production)
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
