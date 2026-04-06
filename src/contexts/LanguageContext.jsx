// ============================================
// سياق اللغة (Language Context) - التدويل (i18n)
// ============================================
// هذا الملف يدير تبديل اللغة بين العربية والإنجليزية
// يوفر:
// 1. دالة الترجمة t() لترجمة النصوص
// 2. تبديل اتجاه الصفحة (RTL للعربية، LTR للإنجليزية)
// 3. معرفة اللغة الحالية

// استيراد الأدوات اللازمة من React
import { createContext, useContext, useState, useEffect } from "react";
// استيراد ملفات الترجمة
import en from "../translations/en"; // الترجمة الإنجليزية
import ar from "../translations/ar"; // الترجمة العربية

// إنشاء سياق اللغة
const LanguageContext = createContext(null);

// كائن يحتوي على جميع الترجمات مفهرسة حسب رمز اللغة
const translations = { en, ar };

// ============ مكون موفر اللغة (LanguageProvider) ============
export const LanguageProvider = ({ children }) => {
  // اللغة الحالية - الافتراضية: الإنجليزية "en"
  const [lang, setLang] = useState("en");

  // عند تغيير اللغة، نحدث اتجاه الصفحة ولغتها
  useEffect(() => {
    // تغيير اتجاه الصفحة: rtl (يمين لليسار) للعربية، ltr (يسار لليمين) للإنجليزية
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    // تحديث خاصية lang في HTML (مهم لإمكانية الوصول ومحركات البحث)
    document.documentElement.lang = lang;
  }, [lang]); // يُنفذ كلما تغيرت اللغة

  // دالة لتبديل اللغة (إنجليزي ↔ عربي)
  const toggleLang = () => setLang((l) => (l === "en" ? "ar" : "en"));

  // متغير يدل إذا كانت اللغة الحالية عربية (من اليمين لليسار)
  const isRTL = lang === "ar";

  // ===== دالة الترجمة t() =====
  // تأخذ مفتاح مثل "nav.home" وترجع النص المترجم
  // مثال: t("nav.home") ← "Home" بالإنجليزية أو "الرئيسية" بالعربية
  const t = (key) => {
    // تقسيم المفتاح على النقاط: "nav.home" → ["nav", "home"]
    const keys = key.split(".");
    // البدء من كائن الترجمة للغة الحالية
    let val = translations[lang];
    // التنقل عبر المفاتيح للوصول للقيمة المطلوبة
    for (const k of keys) val = val?.[k];
    // إرجاع القيمة المترجمة، أو المفتاح نفسه إذا لم توجد ترجمة
    return val || key;
  };

  // توفير اللغة والدوال لجميع المكونات الأبناء
  return (
    <LanguageContext.Provider value={{ lang, toggleLang, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook مخصص للوصول إلى بيانات اللغة من أي مكون
// الاستخدام: const { t, lang, isRTL, toggleLang } = useLang();
export const useLang = () => useContext(LanguageContext);
