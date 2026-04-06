// ============================================
// لوحة تحكم المدير (Admin Dashboard)
// ============================================
// هذه الصفحة هي لوحة التحكم الخاصة بالمدير (Admin)
// المدير يستطيع:
//   - عرض نظرة عامة على جميع عمليات الفحص (Audits) والمستخدمين
//   - تعيين فاحصي الاختراق (Pentesters) لعمليات الفحص المعلقة
//   - عرض وإدارة جميع عمليات الفحص وتصفيتها حسب الحالة
//   - عرض قائمة فاحصي الاختراق وإحصائياتهم
//   - عرض جميع المستخدمين المسجلين في النظام
//   - حذف عمليات الفحص
//   - التبديل بين الوضع الداكن والفاتح وبين اللغات
// ============================================

// ============================================
// قسم الاستيراد (Imports)
// ============================================
// useState: لإدارة الحالة المحلية (مثل التبويب النشط، بيانات الفحوصات، إلخ)
// useEffect: لتنفيذ كود عند تحميل الصفحة (جلب البيانات من قاعدة البيانات)
import { useState, useEffect } from "react";
// useNavigate: للتنقل بين الصفحات برمجياً (مثلاً بعد تسجيل الخروج)
import { useNavigate } from "react-router-dom";
// أيقونات من مكتبة lucide-react تُستخدم في الواجهة
// Shield: أيقونة الدرع (الشعار)
// Users: أيقونة المستخدمين
// ClipboardList: أيقونة قائمة الفحوصات
// LogOut: أيقونة تسجيل الخروج
// Clock: أيقونة الساعة (المعلق)
// UserCheck: أيقونة مستخدم تم التحقق منه
// BarChart2: أيقونة الرسم البياني
// RefreshCw: أيقونة التحديث
// AlertTriangle: أيقونة التنبيه (قيد التنفيذ)
// Moon/Sun: أيقونات الوضع الليلي/النهاري
// Languages: أيقونة تبديل اللغة
// Bug: أيقونة فاحصي الاختراق
// UserCog: أيقونة إدارة المستخدمين
// Trash2: أيقونة الحذف
import {
  Shield, Users, ClipboardList, LogOut, Clock,
  UserCheck, BarChart2, RefreshCw, AlertTriangle, Moon, Sun, Languages, Bug, UserCog, Trash2,
} from "lucide-react";
// مكونات الرسوم البيانية من مكتبة recharts
// BarChart, Bar: لعرض رسم بياني أعمدة (عدد الفحوصات لكل فاحص)
// XAxis, YAxis: المحاور الأفقية والرأسية
// Tooltip: التلميح عند تمرير الماوس على الرسم البياني
// ResponsiveContainer: حاوية تجعل الرسم يتجاوب مع حجم الشاشة
// PieChart, Pie, Cell: لعرض رسم بياني دائري (حالات الفحوصات)
// Legend: وسيلة الإيضاح (مفتاح الرسم البياني)
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
// useAuth: للوصول إلى بيانات المستخدم الحالي ودالة تسجيل الخروج
import { useAuth } from "../contexts/AuthContext";
// useTheme: للوصول إلى حالة الوضع الداكن/الفاتح والتبديل بينهما
import { useTheme } from "../contexts/ThemeContext";
// useLang: للوصول إلى دالة الترجمة (t) ودالة تبديل اللغة
import { useLang } from "../contexts/LanguageContext";
// دوال التعامل مع قاعدة البيانات (Firestore)
// getAllAudits: جلب جميع عمليات الفحص
// getAllPentesters: جلب جميع فاحصي الاختراق
// assignAudit: تعيين فاحص لعملية فحص معينة
// getAllUsers: جلب جميع المستخدمين
// deleteAudit: حذف عملية فحص
import { getAllAudits, getAllPentesters, assignAudit, getAllUsers, deleteAudit } from "../services/firestoreService";

// ============================================
// الثوابت (Constants)
// ============================================

// PIE_COLORS: ألوان الرسم البياني الدائري
// كل لون يمثل حالة مختلفة:
// أصفر = معلق (pending)، أزرق = معيّن (assigned)، بنفسجي = قيد التنفيذ (in_progress)، أخضر = مكتمل (completed)
const PIE_COLORS = ["#facc15", "#3b82f6", "#a855f7", "#22c55e"];

// STATUS_BADGE: أنماط CSS لشارات حالة الفحص
// كل حالة لها لون خلفية ولون نص ولون حدود مختلف
// pending (معلق): أصفر
// assigned (معيّن): أزرق
// in_progress (قيد التنفيذ): بنفسجي
// completed (مكتمل): أخضر
const STATUS_BADGE = {
  pending:     "bg-yellow-400/15 text-yellow-400 border-yellow-400/30",
  assigned:    "bg-blue-400/15 text-blue-400 border-blue-400/30",
  in_progress: "bg-purple-400/15 text-purple-400 border-purple-400/30",
  completed:   "bg-green-400/15 text-green-400 border-green-400/30",
};

// ROLE_BADGE: أنماط CSS لشارات أدوار المستخدمين
// admin (مدير): أحمر
// pentester (فاحص اختراق): أزرق
// client (عميل): أخضر
const ROLE_BADGE = {
  admin:     "bg-red-400/15 text-red-400 border-red-400/30",
  pentester: "bg-blue-400/15 text-blue-400 border-blue-400/30",
  client:    "bg-green-400/15 text-green-400 border-green-400/30",
};

// STATUS_FILTER: خيارات تصفية الفحوصات حسب الحالة
// "all" = عرض الكل، ثم الحالات الأربع
const STATUS_FILTER = ["all", "pending", "assigned", "in_progress", "completed"];

// ============================================
// بداية المكوّن الرئيسي (AdminDashboard Component)
// ============================================
const AdminDashboard = () => {
  // ============================================
  // استخراج البيانات من السياقات (Contexts)
  // ============================================
  // userProfile: بيانات المستخدم الحالي (الاسم، الدور، إلخ)
  // logout: دالة تسجيل الخروج
  const { userProfile, logout } = useAuth();
  // isDark: هل الوضع الداكن مفعّل؟
  // toggleTheme: دالة التبديل بين الوضع الداكن والفاتح
  const { isDark, toggleTheme } = useTheme();
  // t: دالة الترجمة (تأخذ مفتاح وترجع النص بالعربية أو الإنجليزية)
  // toggleLang: دالة تبديل اللغة
  const { t, toggleLang } = useLang();
  // navigate: للتنقل بين صفحات التطبيق
  const navigate = useNavigate();

  // ============================================
  // متغيرات الحالة (State Variables)
  // ============================================
  // activeTab: التبويب النشط حالياً ("overview" نظرة عامة، "all-audits" كل الفحوصات، "pentesters" الفاحصون، "users" المستخدمون)
  const [activeTab, setActiveTab] = useState("overview");
  // audits: مصفوفة تحتوي جميع عمليات الفحص المجلوبة من قاعدة البيانات
  const [audits, setAudits] = useState([]);
  // pentesters: مصفوفة تحتوي جميع فاحصي الاختراق
  const [pentesters, setPentesters] = useState([]);
  // users: مصفوفة تحتوي جميع المستخدمين المسجلين
  const [users, setUsers] = useState([]);
  // loading: هل البيانات لا تزال تُحمَّل؟ (true = جاري التحميل)
  const [loading, setLoading] = useState(true);
  // assigning: معرّف الفحص الذي يتم تعيين فاحص له حالياً (null = لا يوجد تعيين جارٍ)
  const [assigning, setAssigning] = useState(null);
  // selectedPentester: كائن يربط كل فحص بالفاحص المختار له من القائمة المنسدلة
  // مثال: { "audit123": "pentester456" }
  const [selectedPentester, setSelectedPentester] = useState({});
  // statusFilter: فلتر الحالة المختار حالياً لتصفية الفحوصات ("all" = الكل)
  const [statusFilter, setStatusFilter] = useState("all");
  // confirmDelete: معرّف الفحص الذي ينتظر تأكيد الحذف (null = لا يوجد)
  const [confirmDelete, setConfirmDelete] = useState(null);
  // deleting: معرّف الفحص الذي يتم حذفه حالياً (null = لا يوجد حذف جارٍ)
  const [deleting, setDeleting] = useState(null);

  // ============================================
  // رموز التصميم (CSS Design Tokens)
  // ============================================
  // هذه المتغيرات تحتوي أسماء CSS classes مختلفة حسب الوضع (داكن/فاتح)
  // لتطبيق التصميم المناسب تلقائياً
  // bg: لون خلفية الصفحة الرئيسية
  const bg        = isDark ? "bg-[#060b17]"   : "bg-slate-100";
  // sidebarBg: لون خلفية الشريط الجانبي
  const sidebarBg = isDark ? "bg-[#080f23]"   : "bg-white";
  // cardBg: لون خلفية البطاقات (الكروت)
  const cardBg    = isDark ? "bg-white/[0.04] backdrop-blur-xl border-white/[0.08]" : "bg-white border-slate-200 shadow-sm";
  // headerBg: لون خلفية الشريط العلوي (Header)
  const headerBg  = isDark ? "bg-[#060b17]/80 backdrop-blur-xl border-white/[0.06]" : "bg-white/90 border-slate-200";
  // text: لون النص الرئيسي
  const text      = isDark ? "text-white"      : "text-slate-900";
  // muted: لون النص الثانوي (الباهت)
  const muted     = isDark ? "text-white/50"   : "text-slate-500";
  // inputBg: أنماط حقول الإدخال (القوائم المنسدلة وغيرها)
  const inputBg   = isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-100 border-slate-300 text-slate-800";
  // rowHover: تأثير التمرير فوق صفوف الجدول
  const rowHover  = isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50";
  // divider: لون الفواصل بين صفوف الجدول
  const divider   = isDark ? "divide-white/[0.06]" : "divide-slate-100";
  // sideBorder: لون حدود الشريط الجانبي والفواصل الداخلية
  const sideBorder = isDark ? "border-white/[0.06]" : "border-slate-100";
  // tooltipStyle: أنماط التلميحات (Tooltips) في الرسوم البيانية
  const tooltipStyle = {
    backgroundColor: isDark ? "#080f23" : "#fff",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
    borderRadius: "8px",
    color: isDark ? "#fff" : "#0f172a",
  };

  // ============================================
  // دالة جلب البيانات (fetchData)
  // ============================================
  // هذه الدالة تجلب جميع البيانات من قاعدة البيانات:
  // عمليات الفحص (audits)، فاحصي الاختراق (pentesters)، والمستخدمين (users)
  // تعمل بشكل غير متزامن (async) لأن جلب البيانات يستغرق وقتاً
  // Promise.all تجلب الثلاثة بالتوازي (في نفس الوقت) لتسريع التحميل
  const fetchData = async () => {
    setLoading(true);
    const [a, p, u] = await Promise.all([getAllAudits(), getAllPentesters(), getAllUsers()]);
    setAudits(a);
    setPentesters(p);
    setUsers(u);
    setLoading(false);
  };

  // ============================================
  // تحميل البيانات عند فتح الصفحة (useEffect)
  // ============================================
  // useEffect مع مصفوفة فارغة [] يعني: نفّذ هذا الكود مرة واحدة فقط عند تحميل المكوّن
  useEffect(() => { fetchData(); }, []);

  // ============================================
  // دالة تسجيل الخروج (handleLogout)
  // ============================================
  // تسجل خروج المستخدم ثم تنقله لصفحة تسجيل الدخول
  const handleLogout = async () => { await logout(); navigate("/signin"); };

  // ============================================
  // دالة حذف فحص (handleDelete)
  // ============================================
  // تحذف عملية فحص من قاعدة البيانات ومن الحالة المحلية
  // 1. تضبط حالة الحذف الجاري (لعرض مؤشر التحميل)
  // 2. تحذف من قاعدة البيانات
  // 3. تزيل الفحص من مصفوفة الفحوصات المحلية باستخدام filter
  // 4. تعيد ضبط حالة التأكيد والحذف
  const handleDelete = async (auditId) => {
    setDeleting(auditId);
    await deleteAudit(auditId);
    setAudits((prev) => prev.filter((a) => a.id !== auditId));
    setConfirmDelete(null);
    setDeleting(null);
  };

  // ============================================
  // دالة تعيين فاحص لعملية فحص (handleAssign)
  // ============================================
  // 1. تأخذ معرّف الفاحص المختار من القائمة المنسدلة
  // 2. إذا لم يتم اختيار فاحص، لا تفعل شيئاً
  // 3. تجد بيانات الفاحص من مصفوفة الفاحصين
  // 4. تعيّن الفاحص في قاعدة البيانات
  // 5. تعيد جلب البيانات لتحديث الواجهة
  // 6. تزيل الاختيار من القائمة المنسدلة
  const handleAssign = async (auditId) => {
    const pid = selectedPentester[auditId];
    if (!pid) return;
    const pentester = pentesters.find((p) => p.uid === pid);
    setAssigning(auditId);
    await assignAudit(auditId, pid, pentester?.name || "");
    await fetchData();
    setAssigning(null);
    setSelectedPentester((prev) => { const n = { ...prev }; delete n[auditId]; return n; });
  };

  // ============================================
  // حسابات البيانات (Data Calculations)
  // ============================================

  // statusCounts: عدد الفحوصات لكل حالة (للرسم البياني الدائري)
  // ينتج مصفوفة مثل: [{ name: "معلق", value: 3 }, { name: "معيّن", value: 5 }, ...]
  const statusCounts = ["pending", "assigned", "in_progress", "completed"].map((s) => ({
    name: t(`status.${s}`),
    value: audits.filter((a) => a.status === s).length,
  }));

  // barData: عدد الفحوصات لكل فاحص (للرسم البياني الأعمدة)
  // يأخذ الاسم الأول فقط ويعد الفحوصات المسندة لكل فاحص
  // ينتج مصفوفة مثل: [{ name: "أحمد", audits: 4 }, { name: "سارة", audits: 2 }, ...]
  const barData = pentesters.map((p) => ({
    name: p.name.split(" ")[0],
    audits: audits.filter((a) => a.pentesterId === p.uid).length,
  }));

  // stats: مصفوفة بطاقات الإحصائيات الأربعة في النظرة العامة
  // كل بطاقة تحتوي: عنوان (label)، قيمة (value)، أيقونة (icon)، لون الأيقونة (iconBg)، ظل متوهج (glow)
  // 1. إجمالي الفحوصات - عدد جميع الفحوصات
  // 2. المعلقة - عدد الفحوصات بحالة "pending"
  // 3. قيد التنفيذ - عدد الفحوصات بحالة "assigned" أو "in_progress"
  // 4. إجمالي المستخدمين - عدد جميع المستخدمين المسجلين
  const stats = [
    { label: t("dash.totalAudits"), value: audits.length,
      icon: ClipboardList, iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",   glow: "shadow-blue-500/30" },
    { label: t("dash.pending"),     value: audits.filter((a) => a.status === "pending").length,
      icon: Clock,         iconBg: "bg-gradient-to-br from-yellow-400 to-orange-500", glow: "shadow-yellow-500/30" },
    { label: t("dash.inProgress"),  value: audits.filter((a) => a.status === "assigned" || a.status === "in_progress").length,
      icon: AlertTriangle, iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",   glow: "shadow-purple-500/30" },
    { label: t("dash.totalUsers"),  value: users.length,
      icon: Users,         iconBg: "bg-gradient-to-br from-green-400 to-teal-500",    glow: "shadow-green-500/30" },
  ];

  // filteredAudits: الفحوصات بعد تطبيق الفلتر
  // إذا كان الفلتر "all" يعرض الكل، وإلا يصفّي حسب الحالة المختارة
  const filteredAudits = statusFilter === "all" ? audits : audits.filter((a) => a.status === statusFilter);

  // sidebarItems: عناصر قائمة الشريط الجانبي
  // كل عنصر يحتوي: مفتاح (key)، عنوان مترجم (label)، أيقونة (icon)، شارة (badge)
  // الشارة تظهر فقط على تبويب "كل الفحوصات" وتعرض عدد الفحوصات المعلقة
  const sidebarItems = [
    { key: "overview",   label: t("dash.overview"),   icon: BarChart2,     badge: null },
    { key: "all-audits", label: t("dash.allAudits"),  icon: ClipboardList, badge: audits.filter((a) => a.status === "pending").length || null },
    { key: "pentesters", label: t("dash.pentesters"), icon: Bug,           badge: null },
    { key: "users",      label: t("dash.users"),      icon: UserCog,       badge: null },
  ];

  // ============================================
  // بداية واجهة المستخدم (JSX Return)
  // ============================================
  return (
    // الحاوية الرئيسية: تأخذ كامل ارتفاع الشاشة مع تخطيط flex أفقي
    <div className={`min-h-screen flex ${bg} transition-colors duration-300`}>

      {/* ============================================ */}
      {/* كرات التوهج في الخلفية (تظهر فقط في الوضع الداكن) */}
      {/* تعطي تأثير بصري جميل عبارة عن دوائر ضبابية ملونة */}
      {/* ============================================ */}
      {isDark && (
        <>
          <div className="fixed top-0 left-64 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
          <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* ============================================ */}
      {/* الشريط الجانبي (Sidebar) */}
      {/* ثابت على يسار الشاشة بعرض 64 (16rem) */}
      {/* يحتوي: الشعار، قائمة التنقل، ملف المستخدم، أزرار الإعدادات */}
      {/* ============================================ */}
      <aside className={`fixed inset-y-0 start-0 w-64 ${sidebarBg} ${isDark ? "border-e border-white/[0.06]" : "border-e border-slate-200"} flex flex-col z-20`}>

        {/* ─── شعار التطبيق (Logo) ─── */}
        {/* يعرض أيقونة الدرع مع اسم التطبيق "SecOps" ونص "لوحة المدير" */}
        <div className={`px-5 py-5 border-b ${sideBorder}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`font-bold text-sm ${text}`}>SecOps</p>
              <p className={`text-xs ${muted}`}>{t("dash.adminPanel")}</p>
            </div>
          </div>
        </div>

        {/* ─── عناصر التنقل (Navigation Items) ─── */}
        {/* قائمة الأزرار للتنقل بين التبويبات */}
        {/* عند النقر على أي زر يتم تغيير التبويب النشط */}
        {/* الزر النشط يظهر بتصميم مميز (تدرج لوني وحدود) */}
        {/* إذا كان هناك شارة (badge) تظهر بجانب اسم التبويب */}
        <nav className="flex-1 p-3 space-y-1">
          <p className={`px-3 py-2 text-xs font-semibold uppercase tracking-widest ${muted}`}>{t("dash.navigation")}</p>
          {sidebarItems.map(({ key, label, icon: Icon, badge }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === key
                  ? isDark
                    ? "bg-gradient-to-r from-blue-600/25 to-purple-600/15 text-white border border-white/10 shadow-lg"
                    : "bg-blue-50 text-blue-600 border border-blue-100"
                  : `${muted} ${isDark ? "hover:bg-white/5 hover:text-white/80" : "hover:bg-slate-100"}`
              }`}>
              <div className={`p-1.5 rounded-lg transition-all ${
                activeTab === key
                  ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-md shadow-blue-500/30"
                  : isDark ? "bg-white/5" : "bg-slate-100"
              }`}>
                <Icon className={`w-3.5 h-3.5 ${activeTab === key ? "text-white" : ""}`} />
              </div>
              {label}
              {/* شارة عدد الفحوصات المعلقة (تظهر فقط إذا كان العدد أكبر من صفر) */}
              {badge > 0 && (
                <span className="ms-auto bg-yellow-400/20 text-yellow-400 text-xs px-1.5 py-0.5 rounded-full border border-yellow-400/30">{badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* ─── الجزء السفلي من الشريط الجانبي ─── */}
        {/* يحتوي: ملف المستخدم، أزرار الإعدادات، زر تسجيل الخروج */}
        <div className={`p-3 border-t ${sideBorder} space-y-2`}>

          {/* ─── ملف المستخدم (User Profile) ─── */}
          {/* يعرض الحرف الأول من اسم المدير داخل دائرة ملونة */}
          {/* مع اسم المدير ودوره (Admin) */}
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${isDark ? "bg-white/[0.03] border border-white/[0.06]" : "bg-slate-50 border border-slate-100"}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 text-white text-sm font-bold shadow-md shadow-blue-500/30">
              {userProfile?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-medium truncate ${text}`}>{userProfile?.name}</p>
              <p className={`text-xs capitalize ${muted}`}>{t("auth.roles.admin")}</p>
            </div>
          </div>

          {/* ─── أزرار تبديل الوضع واللغة (Theme & Language Buttons) ─── */}
          {/* زر التبديل بين الوضع الداكن والفاتح */}
          {/* زر التبديل بين العربية والإنجليزية */}
          <div className="flex items-center gap-2 px-1">
            <button onClick={toggleTheme} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs border transition-all ${isDark ? "border-white/10 text-white/50 hover:text-white hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-100"}`}>
              {isDark ? <><Sun className="w-3.5 h-3.5" /> Light</> : <><Moon className="w-3.5 h-3.5" /> Dark</>}
            </button>
            <button onClick={toggleLang} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs border transition-all ${isDark ? "border-white/10 text-white/50 hover:text-white hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-100"}`}>
              <Languages className="w-3.5 h-3.5" /> {t("nav.toggleLang")}
            </button>
          </div>

          {/* ─── زر تسجيل الخروج (Logout Button) ─── */}
          {/* عند النقر يسجل خروج المستخدم وينقله لصفحة تسجيل الدخول */}
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors text-red-400 hover:bg-red-400/10">
            <LogOut className="w-4 h-4" /> {t("common.signOut")}
          </button>
        </div>
      </aside>

      {/* ============================================ */}
      {/* المحتوى الرئيسي (Main Content) */}
      {/* يبدأ بعد الشريط الجانبي (ms-64) ويأخذ المساحة المتبقية */}
      {/* ============================================ */}
      <div className="flex-1 ms-64 flex flex-col min-h-screen">

        {/* ─── الشريط العلوي (Header) ─── */}
        {/* ثابت في أعلى الصفحة أثناء التمرير */}
        {/* يعرض عنوان "لوحة تحكم المدير" ورسالة ترحيب */}
        {/* يحتوي زر "تحديث" لإعادة جلب البيانات من قاعدة البيانات */}
        <header className={`sticky top-0 z-10 ${headerBg} border-b px-8 py-4 flex items-center justify-between`}>
          <div>
            <h1 className={`text-lg font-bold ${text}`}>{t("dash.adminDashboard")}</h1>
            <p className={`text-xs ${muted}`}>{t("dash.welcomeAdmin")} {userProfile?.name}</p>
          </div>
          <button onClick={fetchData} className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-all ${isDark ? "border-white/10 text-white/50 hover:text-white hover:border-blue-500/40 hover:bg-blue-500/5" : "border-slate-200 text-slate-500 hover:text-blue-600"}`}>
            <RefreshCw className="w-4 h-4" /> {t("dash.refresh")}
          </button>
        </header>

        {/* ─── منطقة المحتوى الرئيسية ─── */}
        {/* تعرض محتوى التبويب النشط فقط */}
        <main className="flex-1 p-8 space-y-8">

          {/* ============================================ */}
          {/* تبويب النظرة العامة (Overview Tab) */}
          {/* يظهر فقط عندما يكون التبويب النشط هو "overview" */}
          {/* يحتوي: بطاقات الإحصائيات، الرسوم البيانية، آخر الفحوصات المعلقة */}
          {/* ============================================ */}
          {activeTab === "overview" && (
            <>
              {/* ─── بطاقات الإحصائيات (Stat Cards) ─── */}
              {/* شبكة من 4 بطاقات تعرض: إجمالي الفحوصات، المعلقة، قيد التنفيذ، إجمالي المستخدمين */}
              {/* كل بطاقة تحتوي رقم كبير وأيقونة ملونة وعنوان */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className={`p-5 rounded-2xl border ${cardBg} relative overflow-hidden hover:border-white/15 transition-all`}>
                    {/* تأثير تدرج شفاف في الوضع الداكن */}
                    {isDark && <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />}
                    <div className="relative flex items-start justify-between mb-4">
                      <div>
                        {/* عنوان البطاقة (مثل "إجمالي الفحوصات") */}
                        <p className={`text-xs font-medium uppercase tracking-wider ${muted} mb-1`}>{s.label}</p>
                        {/* القيمة العددية (مثل "15") */}
                        <p className={`text-3xl font-bold ${text}`}>{s.value}</p>
                      </div>
                      {/* أيقونة البطاقة مع تدرج لوني وظل */}
                      <div className={`p-3 rounded-xl ${s.iconBg} shadow-lg ${s.glow}`}>
                        <s.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ─── الرسوم البيانية (Charts) ─── */}
              {/* شبكة من رسمين بيانيين جنباً إلى جنب */}
              <div className="grid lg:grid-cols-2 gap-6">

                {/* ─── الرسم البياني الدائري (Pie Chart) ─── */}
                {/* يعرض توزيع حالات الفحوصات (معلق، معيّن، قيد التنفيذ، مكتمل) */}
                {/* كل قطاع بلون مختلف مع وسيلة إيضاح (Legend) */}
                <div className={`p-6 rounded-2xl border ${cardBg}`}>
                  <h2 className={`text-sm font-semibold ${text} mb-5`}>{t("dash.auditStatusChart")}</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={statusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {statusCounts.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Legend />
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* ─── الرسم البياني الأعمدة (Bar Chart) ─── */}
                {/* يعرض عدد الفحوصات المسندة لكل فاحص اختراق */}
                {/* يستخدم تدرج لوني (أزرق إلى بنفسجي) في الوضع الداكن */}
                <div className={`p-6 rounded-2xl border ${cardBg}`}>
                  <h2 className={`text-sm font-semibold ${text} mb-5`}>{t("dash.auditsPerPentester")}</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={barData}>
                      {/* تعريف التدرج اللوني للأعمدة */}
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                      </defs>
                      {/* المحور الأفقي: أسماء الفاحصين */}
                      <XAxis dataKey="name" stroke={isDark ? "#ffffff20" : "#94a3b8"} tick={{ fill: isDark ? "#ffffff50" : "#64748b" }} />
                      {/* المحور الرأسي: عدد الفحوصات (أرقام صحيحة فقط) */}
                      <YAxis stroke={isDark ? "#ffffff20" : "#94a3b8"} tick={{ fill: isDark ? "#ffffff50" : "#64748b" }} allowDecimals={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      {/* الأعمدة: بزوايا مستديرة في الأعلى */}
                      <Bar dataKey="audits" fill={isDark ? "url(#barGrad)" : "#3b82f6"} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ─── آخر الفحوصات المعلقة (Recent Pending Audits) ─── */}
              {/* جدول يعرض أول 5 فحوصات بحالة "pending" */}
              {/* يحتوي زر "كل الفحوصات" للانتقال إلى تبويب جميع الفحوصات */}
              {/* يستخدم مكوّن AuditTableRows المُعاد استخدامه (انظر أسفل الملف) */}
              <div className={`rounded-2xl border ${cardBg} overflow-hidden`}>
                <div className={`px-6 py-4 border-b ${sideBorder} flex items-center justify-between`}>
                  <h2 className={`font-semibold ${text}`}>{t("dash.recentAudits")}</h2>
                  <button onClick={() => setActiveTab("all-audits")} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    {t("dash.allAudits")} →
                  </button>
                </div>
                <AuditTableRows audits={audits.filter((a) => a.status === "pending").slice(0, 5)} pentesters={pentesters} selectedPentester={selectedPentester} setSelectedPentester={setSelectedPentester} handleAssign={handleAssign} assigning={assigning} loading={loading} t={t} isDark={isDark} muted={muted} text={text} rowHover={rowHover} divider={divider} inputBg={inputBg} sideBorder={sideBorder} noMsg={t("dash.noAudits")} confirmDelete={confirmDelete} setConfirmDelete={setConfirmDelete} handleDelete={handleDelete} deleting={deleting} />
              </div>
            </>
          )}

          {/* ============================================ */}
          {/* تبويب جميع الفحوصات (All Audits Tab) */}
          {/* يظهر فقط عندما يكون التبويب النشط هو "all-audits" */}
          {/* يعرض جميع الفحوصات مع إمكانية التصفية حسب الحالة */}
          {/* أزرار الفلتر: الكل، معلق، معيّن، قيد التنفيذ، مكتمل */}
          {/* الزر النشط يظهر بتدرج لوني مميز */}
          {/* ============================================ */}
          {activeTab === "all-audits" && (
            <div className={`rounded-2xl border ${cardBg} overflow-hidden`}>
              {/* ─── شريط الفلاتر (Filter Bar) ─── */}
              <div className={`px-6 py-4 border-b ${sideBorder}`}>
                <h2 className={`font-semibold ${text} mb-4`}>{t("dash.auditAssignment")}</h2>
                {/* أزرار تصفية الحالة */}
                <div className="flex flex-wrap gap-2">
                  {STATUS_FILTER.map((f) => (
                    <button key={f} onClick={() => setStatusFilter(f)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all capitalize ${
                        statusFilter === f
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/20"
                          : isDark ? "bg-white/5 text-white/50 hover:text-white border border-white/10" : "bg-slate-100 text-slate-500 hover:text-slate-900"
                      }`}>
                      {f === "all" ? t("common.all") : t(`status.${f}`)}
                    </button>
                  ))}
                </div>
              </div>
              {/* ─── جدول الفحوصات المصفاة ─── */}
              {/* يستخدم مكوّن AuditTableRows مع الفحوصات بعد تطبيق الفلتر */}
              <AuditTableRows audits={filteredAudits} pentesters={pentesters} selectedPentester={selectedPentester} setSelectedPentester={setSelectedPentester} handleAssign={handleAssign} assigning={assigning} loading={loading} t={t} isDark={isDark} muted={muted} text={text} rowHover={rowHover} divider={divider} inputBg={inputBg} sideBorder={sideBorder} noMsg={t("dash.noAudits")} confirmDelete={confirmDelete} setConfirmDelete={setConfirmDelete} handleDelete={handleDelete} deleting={deleting} />
            </div>
          )}

          {/* ============================================ */}
          {/* تبويب فاحصي الاختراق (Pentesters Tab) */}
          {/* يظهر فقط عندما يكون التبويب النشط هو "pentesters" */}
          {/* يعرض بطاقة لكل فاحص تحتوي: اسمه، بريده، عدد الفحوصات النشطة والمكتملة */}
          {/* ============================================ */}
          {activeTab === "pentesters" && (
            <div className="space-y-6">
              <h2 className={`text-lg font-bold ${text}`}>{t("dash.pentesterList")}</h2>
              {/* إذا كانت البيانات تُحمَّل، نعرض نص "جاري التحميل" */}
              {loading ? (
                <p className={muted}>{t("common.loading")}</p>
              ) : pentesters.length === 0 ? (
                /* إذا لا يوجد فاحصون، نعرض رسالة "لا يوجد فاحصون" */
                <div className={`p-12 rounded-2xl border ${cardBg} text-center ${muted}`}>{t("dash.noPentesters")}</div>
              ) : (
                /* شبكة بطاقات الفاحصين: 1-3 أعمدة حسب حجم الشاشة */
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pentesters.map((p) => {
                    // active: عدد الفحوصات غير المكتملة المسندة لهذا الفاحص
                    const active = audits.filter((a) => a.pentesterId === p.uid && a.status !== "completed").length;
                    // done: عدد الفحوصات المكتملة لهذا الفاحص
                    const done   = audits.filter((a) => a.pentesterId === p.uid && a.status === "completed").length;
                    return (
                      <div key={p.uid} className={`p-5 rounded-2xl border ${cardBg} flex flex-col gap-3 hover:border-blue-500/30 transition-all`}>
                        {/* الجزء العلوي: أيقونة الحرف الأول + الاسم والبريد */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/30">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className={`font-semibold truncate ${text}`}>{p.name}</p>
                            <p className={`text-xs truncate ${muted}`}>{p.email}</p>
                          </div>
                        </div>
                        {/* الجزء السفلي: إحصائيات الفاحص (نشط / مكتمل) */}
                        <div className={`pt-3 border-t ${sideBorder} flex items-center justify-around`}>
                          <div className="text-center">
                            <p className={`text-xl font-bold ${text}`}>{active}</p>
                            <p className={`text-xs ${muted}`}>{t("dash.inProgress")}</p>
                          </div>
                          {/* خط فاصل رأسي بين الإحصائيتين */}
                          <div className={`w-px h-8 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                          <div className="text-center">
                            <p className="text-xl font-bold text-green-400">{done}</p>
                            <p className={`text-xs ${muted}`}>{t("dash.completed")}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================ */}
          {/* تبويب إدارة المستخدمين (Users Tab / Manage Users) */}
          {/* يظهر فقط عندما يكون التبويب النشط هو "users" */}
          {/* يعرض جدول بجميع المستخدمين المسجلين في النظام */}
          {/* كل صف يحتوي: الاسم، البريد الإلكتروني، الدور (مدير/فاحص/عميل)، تاريخ التسجيل */}
          {/* ============================================ */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* العنوان مع عدد المستخدمين الإجمالي */}
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-bold ${text}`}>{t("dash.allUsers")}</h2>
                <span className={`text-sm ${muted}`}>{users.length} {t("dash.total")}</span>
              </div>
              {/* إذا كانت البيانات تُحمَّل */}
              {loading ? (
                <p className={muted}>{t("common.loading")}</p>
              ) : users.length === 0 ? (
                /* إذا لا يوجد مستخدمون */
                <div className={`p-12 rounded-2xl border ${cardBg} text-center ${muted}`}>
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  {t("dash.noUsers")}
                </div>
              ) : (
                /* جدول المستخدمين */
                <div className={`rounded-2xl border ${cardBg} overflow-hidden`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      {/* ─── رأس الجدول (Table Header) ─── */}
                      {/* أعمدة: الاسم، البريد الإلكتروني، الدور، عضو منذ */}
                      <thead>
                        <tr className={`border-b ${sideBorder} ${muted} text-xs uppercase tracking-wider`}>
                          {[t("dash.userName"), t("dash.userEmail"), t("dash.userRole"), t("dash.userSince")].map((h, i) => (
                            <th key={i} className="px-6 py-3 font-semibold text-start">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      {/* ─── صفوف الجدول (Table Body) ─── */}
                      <tbody className={`divide-y ${divider}`}>
                        {users.map((u) => (
                          <tr key={u.uid} className={`${rowHover} transition-colors`}>
                            {/* عمود الاسم: أيقونة الحرف الأول + الاسم */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-md shadow-blue-500/20">
                                  {u.name?.charAt(0).toUpperCase()}
                                </div>
                                <p className={`font-medium ${text}`}>{u.name}</p>
                              </div>
                            </td>
                            {/* عمود البريد الإلكتروني */}
                            <td className={`px-6 py-4 ${muted}`}>{u.email}</td>
                            {/* عمود الدور: شارة ملونة (أحمر للمدير، أزرق للفاحص، أخضر للعميل) */}
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${ROLE_BADGE[u.role] || ""}`}>
                                {t(`auth.roles.${u.role}`) || u.role}
                              </span>
                            </td>
                            {/* عمود تاريخ التسجيل */}
                            <td className={`px-6 py-4 ${muted} text-xs`}>
                              {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// ============================================
// مكوّن جدول الفحوصات المُعاد استخدامه (AuditTableRows Component)
// ============================================
// هذا مكوّن منفصل يُستخدم في أكثر من مكان:
// 1. في تبويب النظرة العامة (آخر الفحوصات المعلقة)
// 2. في تبويب جميع الفحوصات (الفحوصات المصفاة)
//
// يستقبل العديد من الخصائص (Props):
// - audits: مصفوفة الفحوصات المراد عرضها
// - pentesters: مصفوفة الفاحصين (للقائمة المنسدلة)
// - selectedPentester: الفاحص المختار لكل فحص
// - setSelectedPentester: دالة لتحديث الفاحص المختار
// - handleAssign: دالة لتعيين فاحص
// - assigning: معرّف الفحص الجاري تعيينه
// - loading: هل البيانات تُحمَّل؟
// - t: دالة الترجمة
// - isDark: الوضع الداكن/الفاتح
// - muted, text, rowHover, divider, inputBg, sideBorder: أنماط CSS
// - noMsg: رسالة تظهر عند عدم وجود فحوصات
// - confirmDelete, setConfirmDelete: لإدارة تأكيد الحذف
// - handleDelete: دالة الحذف
// - deleting: معرّف الفحص الجاري حذفه
const AuditTableRows = ({ audits, pentesters, selectedPentester, setSelectedPentester, handleAssign, assigning, loading, t, isDark, muted, text, rowHover, divider, inputBg, sideBorder, noMsg, confirmDelete, setConfirmDelete, handleDelete, deleting }) => {
  // إذا كانت البيانات تُحمَّل، نعرض نص "جاري التحميل"
  if (loading) return <div className={`p-12 text-center ${muted}`}>{t("common.loading")}</div>;
  // إذا لا توجد فحوصات، نعرض رسالة مع أيقونة
  if (audits.length === 0) return (
    <div className={`p-12 text-center ${muted}`}>
      <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
      {noMsg}
    </div>
  );
  // ─── عرض جدول الفحوصات ─── //
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        {/* ─── رأس الجدول ─── */}
        {/* أعمدة: عنوان الفحص، العميل، الحالة، تعيين إلى، زر التعيين، زر الحذف */}
        <thead>
          <tr className={`border-b ${sideBorder} ${muted} text-left text-xs uppercase tracking-wider`}>
            {[t("dash.auditTitle"), t("dash.client"), t("dash.status"), t("dash.assignTo"), "", ""].map((h, i) => (
              <th key={i} className="px-6 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        {/* ─── صفوف الجدول (كل صف = فحص واحد) ─── */}
        <tbody className={`divide-y ${divider}`}>
          {audits.map((audit) => (
            <tr key={audit.id} className={`${rowHover} transition-colors`}>
              {/* ─── عمود عنوان الفحص ─── */}
              {/* يعرض عنوان الفحص ونطاقه (scope) */}
              <td className="px-6 py-4">
                <p className={`font-medium ${text}`}>{audit.title}</p>
                <p className={`text-xs ${muted} truncate max-w-[180px]`}>{audit.scope}</p>
              </td>
              {/* ─── عمود اسم العميل ─── */}
              <td className={`px-6 py-4 ${muted}`}>{audit.clientName}</td>
              {/* ─── عمود الحالة ─── */}
              {/* شارة ملونة تعرض حالة الفحص (معلق، معيّن، قيد التنفيذ، مكتمل) */}
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${STATUS_BADGE[audit.status] || ""}`}>
                  {t(`status.${audit.status}`) || audit.status}
                </span>
              </td>
              {/* ─── عمود التعيين ─── */}
              {/* إذا كانت الحالة "pending" (معلق): يظهر قائمة منسدلة لاختيار فاحص */}
              {/* إذا كانت الحالة غير ذلك: يعرض اسم الفاحص المعيّن */}
              <td className="px-6 py-4">
                {audit.status === "pending" ? (
                  <select value={selectedPentester[audit.id] || ""}
                    onChange={(e) => setSelectedPentester((p) => ({ ...p, [audit.id]: e.target.value }))}
                    style={{ colorScheme: "light" }}
                    className={`rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 border ${isDark ? "bg-[#1e2a50] border-white/10 text-white" : "bg-slate-100 border-slate-300 text-slate-800"}`}>
                    <option value="">{t("dash.selectPentester")}</option>
                    {pentesters.map((p) => <option key={p.uid} value={p.uid}>{p.name}</option>)}
                  </select>
                ) : (
                  <span className={`text-xs ${muted}`}>{audit.pentesterName || "—"}</span>
                )}
              </td>
              {/* ─── عمود زر التعيين ─── */}
              {/* يظهر فقط للفحوصات المعلقة */}
              {/* يكون معطلاً إذا لم يتم اختيار فاحص أو إذا كان التعيين جارياً */}
              <td className="px-6 py-4">
                {audit.status === "pending" && (
                  <button onClick={() => handleAssign(audit.id)} disabled={!selectedPentester[audit.id] || assigning === audit.id}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-semibold text-white transition-all shadow-sm shadow-blue-500/20">
                    {assigning === audit.id ? t("dash.assigning") : t("dash.assign")}
                  </button>
                )}
              </td>
              {/* ─── عمود زر الحذف ─── */}
              {/* عند النقر أول مرة: يظهر أزرار تأكيد الحذف والإلغاء */}
              {/* عند تأكيد الحذف: يتم حذف الفحص من قاعدة البيانات */}
              {/* عند الإلغاء: يختفي مربع التأكيد */}
              <td className="px-6 py-4">
                {confirmDelete === audit.id ? (
                  /* ─── أزرار تأكيد الحذف ─── */
                  <div className="flex items-center gap-1.5">
                    {/* زر تأكيد الحذف (أحمر) */}
                    <button onClick={() => handleDelete(audit.id)} disabled={deleting === audit.id}
                      className="px-2.5 py-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-lg text-xs font-semibold text-white transition-colors">
                      {deleting === audit.id ? "…" : t("common.confirmDelete")}
                    </button>
                    {/* زر إلغاء الحذف */}
                    <button onClick={() => setConfirmDelete(null)}
                      className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${isDark ? "border-white/10 text-white/50 hover:text-white" : "border-slate-200 text-slate-500 hover:text-slate-800"}`}>
                      {t("common.cancel")}
                    </button>
                  </div>
                ) : (
                  /* ─── أيقونة الحذف (تظهر بشكل افتراضي) ─── */
                  <button onClick={() => setConfirmDelete(audit.id)}
                    className="p-1.5 rounded-lg transition-colors text-red-400/60 hover:text-red-400 hover:bg-red-400/10"
                    title={t("common.delete")}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================
// تصدير المكوّن (Export)
// ============================================
// نصدّر المكوّن كتصدير افتراضي حتى نستطيع استيراده في ملفات أخرى
// مثال: import AdminDashboard from "./pages/AdminDashboard";
export default AdminDashboard;
