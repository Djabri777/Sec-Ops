// ============================================
// صفحة من نحن (About Page)
// ============================================
// هذه الصفحة تعرض معلومات عن الشركة وقيمها
// وفريقها والشهادات المهنية وأسباب التركيز
// على الشركات الصغيرة والمتوسطة، بالإضافة
// إلى قسم دعوة لاتخاذ إجراء (CTA) في النهاية.
// ============================================

// ============================================
// استيراد المكتبات والأدوات (Imports)
// ============================================
// Link: مكون من مكتبة react-router-dom يُستخدم لإنشاء روابط تنقل بين الصفحات بدون إعادة تحميل الصفحة
import { Link } from 'react-router-dom';

// هذه أيقونات من مكتبة lucide-react، كل أيقونة تُستخدم في مكان معين في الصفحة:
// Shield: أيقونة الدرع - تُستخدم للأمان والحماية
// Target: أيقونة الهدف - تُستخدم في شارة قسم البطل (Hero)
// Users: أيقونة المستخدمين - تُستخدم في قسم الفريق
// Award: أيقونة الجائزة - تُستخدم بجانب الشهادات المهنية
// TrendingUp: أيقونة الاتجاه الصاعد - تُستخدم في قسم "لماذا الشركات الصغيرة"
// Heart: أيقونة القلب - تُستخدم في القيم
// Zap: أيقونة البرق - تُستخدم في القيم
// CheckCircle: أيقونة علامة الصح - تُستخدم في قسم الأسباب
// ArrowRight: أيقونة السهم لليمين - تُستخدم في زر الدعوة لاتخاذ إجراء
import {
  Shield,
  Target,
  Users,
  Award,
  TrendingUp,
  Heart,
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

// motion: مكون من مكتبة framer-motion يُستخدم لإضافة حركات وتأثيرات انتقالية (animations) على العناصر
import { motion } from 'framer-motion';

// useLang: هوك (Hook) مخصص من سياق اللغة (LanguageContext) يُستخدم لجلب دالة الترجمة t
// التي تُرجع النصوص بناءً على اللغة المختارة (عربي / إنجليزي)
import { useLang } from '../contexts/LanguageContext';

// ============================================
// المكون الرئيسي لصفحة "من نحن"
// ============================================
// هذا مكون وظيفي (Functional Component) يمثل صفحة "من نحن" بالكامل
const AboutPage = () => {
  // استخراج دالة الترجمة t من هوك اللغة
  // t("مفتاح") تُرجع النص المقابل حسب اللغة الحالية
  const { t } = useLang();

  // ============================================
  // مصفوفة القيم (Values Array)
  // ============================================
  // هذه المصفوفة تحتوي على قيم الشركة الثلاث الأساسية
  // كل عنصر يحتوي على: أيقونة (icon)، عنوان (title)، ووصف (description)
  // النصوص تأتي من ملف الترجمة عبر الدالة t
  const values = [
    {
      icon: <Heart className="w-8 h-8 text-blue-400" />,
      title: t("about.val1Title"),
      description: t("about.val1Desc"),
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-400" />,
      title: t("about.val2Title"),
      description: t("about.val2Desc"),
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      title: t("about.val3Title"),
      description: t("about.val3Desc"),
    }
  ];

  // ============================================
  // مصفوفة الشهادات المهنية (Certifications Array)
  // ============================================
  // هذه المصفوفة تحتوي على الشهادات المهنية في مجال الأمن السيبراني
  // كل عنصر يحتوي على: اسم الشهادة (name) ووصفها (description)
  // CPTS: شهادة متخصص اختبار الاختراق
  // OSCP: شهادة محترف الأمن الهجومي
  // eWPTX: شهادة اختبار اختراق تطبيقات الويب المتقدمة
  // eJPTv2: شهادة مختبر اختراق مبتدئ
  const certifications = [
    { name: "CPTS", description: "Certified Penetration Testing Specialist (In Training)" },
    { name: "OSCP", description: "Offensive Security Certified Professional (In Training)" },
    { name: "eWPTX", description: "Web Application Penetration Tester eXtreme (In Training)" },
    { name: "eJPTv2", description: "Junior Penetration Tester v2 (In Training)" }
  ];

  // ============================================
  // مصفوفة الإحصائيات (Stats Array)
  // ============================================
  // هذه المصفوفة تحتوي على إحصائيات الشركة التي تُعرض في قسم الأرقام
  // كل عنصر يحتوي على: الرقم (number) والتسمية (label)
  // مثال: عدد المشاريع المنجزة، عدد العملاء، إلخ
  const stats = [
    { number: t("about.stat1Value"), label: t("about.stat1Label") },
    { number: t("about.stat2Value"), label: t("about.stat2Label") },
    { number: t("about.stat3Value"), label: t("about.stat3Label") },
    { number: t("about.stat4Value"), label: t("about.stat4Label") },
  ];

  // ============================================
  // مصفوفة أسباب التركيز على الشركات الصغيرة والمتوسطة (Why SMEs Array)
  // ============================================
  // هذه المصفوفة تشرح لماذا تركز الشركة على خدمة الشركات الصغيرة والمتوسطة
  // كل عنصر يحتوي على: عنوان (title) ووصف (description)
  const whySMEs = [
    {
      title: t("about.why1Title"),
      description: t("about.why1Desc"),
    },
    {
      title: t("about.why2Title"),
      description: t("about.why2Desc"),
    },
    {
      title: t("about.why3Title"),
      description: t("about.why3Desc"),
    }
  ];

  // ============================================
  // بداية واجهة المستخدم (JSX) - ما يظهر على الشاشة
  // ============================================
  return (
    // الحاوية الرئيسية للصفحة بأكملها - min-h-screen تجعل الصفحة بارتفاع الشاشة على الأقل
    <div className="min-h-screen">

      {/* ============================================ */}
      {/* قسم البطل (Hero Section) */}
      {/* ============================================ */}
      {/* هذا هو القسم الأول الذي يراه الزائر في أعلى الصفحة */}
      {/* يحتوي على شارة صغيرة، عنوان رئيسي كبير، ونص فرعي توضيحي */}
      {/* pt-32: مسافة علوية كبيرة لإبعاد المحتوى عن شريط التنقل */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        {/* هذا العنصر يُنشئ تأثير توهج أزرق خلف المحتوى (تأثير بصري تزييني) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* الشارة العلوية - تظهر كنص صغير داخل إطار مستدير */}
            {/* motion.div يضيف تأثير حركي: يبدأ شفافاً ومنزاحاً للأسفل ثم يظهر في مكانه */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
            >
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">{t("about.badge")}</span>
            </motion.div>

            {/* العنوان الرئيسي للصفحة - نص كبير وعريض */}
            {/* delay: 0.1 يجعل الحركة تبدأ بعد 0.1 ثانية من ظهور الشارة */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl font-bold mb-6 leading-tight text-zinc-100"
            >
              {t("about.heroTitle")}
            </motion.h1>

            {/* النص الفرعي التوضيحي أسفل العنوان */}
            {/* delay: 0.2 يجعل هذا العنصر يظهر بعد العنوان */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-zinc-300 mb-10 leading-relaxed max-w-3xl mx-auto"
            >
              {t("about.heroSubtitle")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* قسم الإحصائيات (Stats Section) */}
      {/* ============================================ */}
      {/* هذا القسم يعرض أرقام وإحصائيات الشركة في شبكة من 4 أعمدة */}
      {/* border-y: يضيف حدود علوية وسفلية لفصل القسم بصرياً */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* شبكة الإحصائيات: عمودين على الشاشات الصغيرة، 4 أعمدة على الشاشات المتوسطة والكبيرة */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* نمر على كل إحصائية في المصفوفة ونعرضها */}
            {/* delay: 0.1 * index يجعل كل عنصر يظهر بعد الذي قبله بتأخير بسيط */}
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="text-center"
              >
                {/* الرقم الكبير باللون الأزرق */}
                <div className="text-4xl sm:text-5xl font-bold text-blue-400 mb-2">
                  {stat.number}
                </div>
                {/* تسمية/وصف الرقم */}
                <div className="text-zinc-400 text-sm sm:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* قسم القيم (Values Section) */}
      {/* ============================================ */}
      {/* هذا القسم يعرض القيم الأساسية للشركة في بطاقات */}
      {/* كل بطاقة تحتوي على أيقونة وعنوان ووصف */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* عنوان القسم في المنتصف */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-zinc-100">
              {t("about.valuesTitle")}
            </h2>
          </div>

          {/* شبكة البطاقات: 3 أعمدة على الشاشات المتوسطة والكبيرة */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* نمر على كل قيمة في المصفوفة ونعرضها كبطاقة */}
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                // البطاقة: خلفية شبه شفافة مع حدود، وتأثير تمرير (hover) يُغير لون الحد للأزرق
                className="p-8 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 hover:border-blue-400/50 transition-all"
              >
                {/* الأيقونة داخل مربع مستدير بخلفية زرقاء خفيفة */}
                <div className="mb-4 inline-block p-3 rounded-xl bg-blue-500/10">
                  {value.icon}
                </div>
                {/* عنوان القيمة */}
                <h3 className="text-2xl font-bold mb-3 text-zinc-100">{value.title}</h3>
                {/* وصف القيمة */}
                <p className="text-zinc-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* قسم الفريق/المؤسس (Team/Founder Section) */}
      {/* ============================================ */}
      {/* هذا القسم مقسم إلى نصفين: */}
      {/* النصف الأيسر: معلومات عن المؤسس والشهادات المهنية */}
      {/* النصف الأيمن: مربع بصري يعرض أيقونة الدرع ونص عن التميز التقني */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-blue-950/10">
        <div className="max-w-7xl mx-auto">
          {/* شبكة من عمودين مع محاذاة رأسية في المنتصف */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* النصف الأيسر: معلومات المؤسس */}
            {/* تأثير حركي: يبدأ شفافاً ومنزاحاً لليسار ثم ينزلق لمكانه */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* شارة "فريقنا" */}
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400">{t("about.teamTitle")}</span>
              </div>

              {/* عنوان قسم المؤسس */}
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-zinc-100">
                {t("about.founderTitle")}
              </h2>
              {/* وصف المؤسس وخبرته */}
              <p className="text-xl text-zinc-300 mb-6 leading-relaxed">
                {t("about.founderDesc")}
              </p>

              {/* ============================================ */}
              {/* قسم الشهادات المهنية (Certifications) */}
              {/* ============================================ */}
              {/* شبكة من عمودين تعرض الشهادات المهنية */}
              {/* كل شهادة تظهر في بطاقة صغيرة مع أيقونة الجائزة */}
              <div className="grid grid-cols-2 gap-4">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    {/* أيقونة الجائزة بجانب اسم الشهادة */}
                    <Award className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <div>
                      {/* اسم الشهادة بخط عريض */}
                      <div className="font-semibold text-zinc-100">{cert.name}</div>
                      {/* وصف الشهادة بخط صغير */}
                      <div className="text-xs text-zinc-400">{cert.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* النصف الأيمن: مربع بصري يعرض التميز التقني */}
            {/* تأثير حركي: يبدأ شفافاً ومنزاحاً لليمين ثم ينزلق لمكانه */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              {/* مربع مع تدرج لوني من الأزرق إلى البنفسجي */}
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 p-8 flex items-center justify-center">
                <div className="text-center">
                  {/* أيقونة درع كبيرة في المنتصف */}
                  <Shield className="w-32 h-32 text-blue-400 mx-auto mb-6" />
                  {/* عنوان "التميز التقني" */}
                  <h3 className="text-2xl font-bold text-zinc-100 mb-2">
                    Technical Excellence
                  </h3>
                  {/* نص توضيحي */}
                  <p className="text-zinc-300">
                    Every team member brings 2+ years of hands-on pentesting experience
                  </p>
                </div>
              </div>
              {/* تأثير توهج خلف المربع (طبقة ضبابية) */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* قسم لماذا الشركات الصغيرة والمتوسطة (Why SMEs Section) */}
      {/* ============================================ */}
      {/* هذا القسم يشرح لماذا تركز الشركة على خدمة الشركات الصغيرة والمتوسطة */}
      {/* يعرض الأسباب في بطاقات مرتبة عمودياً مع أيقونة علامة صح */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* عنوان القسم ونص فرعي في المنتصف */}
          <div className="text-center mb-16">
            {/* شارة مع أيقونة الاتجاه الصاعد */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            {/* عنوان القسم */}
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-zinc-100">
              {t("about.whyTitle")}
            </h2>
            {/* نص فرعي يشرح الهدف */}
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
              {t("about.whySubtitle")}
            </p>
          </div>

          {/* قائمة الأسباب - مرتبة عمودياً مع مسافات بين كل بطاقة */}
          <div className="space-y-8">
            {/* نمر على كل سبب في المصفوفة ونعرضه كبطاقة */}
            {whySMEs.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-8 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 hover:border-blue-400/50 transition-all"
              >
                {/* تخطيط أفقي: أيقونة علامة الصح على اليسار، والنص على اليمين */}
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    {/* عنوان السبب */}
                    <h3 className="text-2xl font-bold mb-3 text-zinc-100">{reason.title}</h3>
                    {/* شرح السبب بالتفصيل */}
                    <p className="text-zinc-300 leading-relaxed">{reason.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* قسم الدعوة لاتخاذ إجراء (CTA Section) */}
      {/* ============================================ */}
      {/* هذا هو القسم الأخير في الصفحة - يدعو الزائر للتواصل مع الشركة */}
      {/* يحتوي على عنوان ونص تحفيزي وزر يأخذ المستخدم لصفحة التواصل */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* بطاقة كبيرة مع تدرج لوني وحدود ونمط شبكي في الخلفية */}
          <div className="relative p-12 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 overflow-hidden">
            {/* نمط شبكي خلفي (SVG مشفر بـ base64) يُضفي لمسة بصرية مميزة */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

            {/* محتوى الدعوة لاتخاذ إجراء */}
            <div className="relative text-center">
              {/* عنوان الدعوة */}
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-zinc-100">
                {t("about.ctaTitle")}
              </h2>
              {/* نص فرعي تحفيزي */}
              <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
                {t("about.ctaSubtitle")}
              </p>
              {/* زر التواصل - رابط يأخذ المستخدم لصفحة /contact */}
              {/* يحتوي على نص وسهم، مع تأثيرات تمرير (hover) للون والظل */}
              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all hover:shadow-2xl hover:shadow-blue-500/30 text-zinc-100"
              >
                <span>{t("about.ctaBtn")}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ============================================
// تصدير المكون (Export)
// ============================================
// نُصدّر المكون كتصدير افتراضي حتى نتمكن من استيراده في ملفات أخرى
// مثال الاستيراد: import AboutPage from './pages/AboutPage'
export default AboutPage;
