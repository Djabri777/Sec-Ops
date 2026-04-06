// ============================================
// سياق الثيم (Theme Context) - الوضع الداكن/الفاتح
// ============================================
// هذا الملف يدير التبديل بين الوضع الداكن والوضع الفاتح
// يضيف أو يزيل صنف "dark" من عنصر HTML الرئيسي
// وهذا يجعل Tailwind CSS يطبق الأنماط المناسبة تلقائياً

// استيراد الأدوات اللازمة من React
import { createContext, useContext, useState, useEffect } from "react";

// إنشاء سياق الثيم
const ThemeContext = createContext(null);

// ============ مكون موفر الثيم (ThemeProvider) ============
export const ThemeProvider = ({ children }) => {
  // متغير حالة لتخزين ما إذا كان الوضع الداكن مفعلاً
  // القيمة الافتراضية: true (الوضع الداكن مفعل)
  const [isDark, setIsDark] = useState(true);

  // عند تغيير isDark، نحدث صنف CSS على عنصر HTML
  useEffect(() => {
    if (isDark) {
      // إضافة صنف "dark" ← Tailwind يطبق أنماط الوضع الداكن
      document.documentElement.classList.add("dark");
    } else {
      // إزالة صنف "dark" ← Tailwind يطبق أنماط الوضع الفاتح
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]); // يُنفذ كلما تغيرت قيمة isDark

  // دالة لتبديل الثيم (داكن ↔ فاتح)
  const toggleTheme = () => setIsDark((d) => !d);

  // توفير حالة الثيم ودالة التبديل لجميع المكونات الأبناء
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook مخصص للوصول إلى بيانات الثيم من أي مكون
// الاستخدام: const { isDark, toggleTheme } = useTheme();
export const useTheme = () => useContext(ThemeContext);
