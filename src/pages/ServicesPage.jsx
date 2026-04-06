/**
 * ==========================================================================
 *  ملف: ServicesPage.jsx
 *  الوصف: صفحة عرض خدمات الأمن السيبراني
 * --------------------------------------------------------------------------
 *  هذا الملف يحتوي على مكوّن React مسؤول عن عرض صفحة "الخدمات" في الموقع.
 *  الصفحة تتكون من أربعة أقسام رئيسية:
 *    1. قسم البطل (Hero) - العنوان الرئيسي والوصف التعريفي للصفحة
 *    2. شبكة الخدمات (Services Grid) - عرض الخدمات الثلاث في بطاقات
 *    3. خط زمني للعملية (Process Timeline) - خطوات العمل الأربع
 *    4. قسم الدعوة للعمل (CTA) - زر يدعو المستخدم للتواصل
 *
 *  التقنيات المستخدمة:
 *    - React مع JSX لبناء واجهة المستخدم
 *    - Tailwind CSS لتنسيق العناصر
 *    - Framer Motion لإضافة حركات انتقالية (animations)
 *    - React Router للتنقل بين الصفحات
 *    - Lucide React لعرض الأيقونات
 *    - سياق اللغة (LanguageContext) لدعم تعدد اللغات
 * ==========================================================================
 */

// ============================================================
// قسم الاستيرادات (Imports)
// ============================================================

// استيراد مكوّن Link من مكتبة react-router-dom
// يُستخدم Link لإنشاء روابط تنقّل بين صفحات الموقع بدون إعادة تحميل الصفحة بالكامل
// وهو بديل أفضل من وسم <a> العادي في تطبيقات React
import { Link } from 'react-router-dom';

// استيراد الأيقونات من مكتبة lucide-react
// كل أيقونة هي مكوّن React مستقل يمكن تخصيص حجمه ولونه
// Globe = أيقونة الكرة الأرضية (لخدمة اختبار تطبيقات الويب)
// Network = أيقونة الشبكة (لخدمة اختبار الشبكات)
// Server = أيقونة الخادم (لخدمة الفريق الأحمر)
// Shield = أيقونة الدرع (للأمان والحماية)
// Search = أيقونة البحث (لمرحلة الاستطلاع)
// Bug = أيقونة الحشرة (لمرحلة اكتشاف الثغرات)
// FileText = أيقونة الملف (لمرحلة التقرير)
// CheckCircle = أيقونة علامة الصح (لقائمة المميزات)
// ArrowRight = أيقونة السهم لليمين (لأزرار الانتقال)
import {
  Globe,
  Network,
  Server,
  Shield,
  Search,
  Bug,
  FileText,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

// استيراد مكوّن motion من مكتبة framer-motion
// يُستخدم لإضافة حركات انتقالية (animations) على العناصر
// مثل: الظهور التدريجي، الانزلاق من أسفل لأعلى، وغيرها
// يمكنك لف أي عنصر HTML بـ motion (مثل motion.div أو motion.h1) لإضافة حركة عليه
import { motion } from 'framer-motion';

// استيراد الخطاف المخصص useLang من سياق اللغة
// يوفر الدالة t() التي تُرجع النص المترجم حسب اللغة الحالية للموقع
// مثال: t("services.heroTitle") تُرجع العنوان بالعربية إذا كانت اللغة عربية، أو بالإنجليزية إذا كانت إنجليزية
import { useLang } from '../contexts/LanguageContext';

// ============================================================
// المكوّن الرئيسي: ServicesPage
// ============================================================
// هذا هو المكوّن الرئيسي للصفحة، مكتوب كدالة سهمية (Arrow Function)
// في React، كل صفحة أو جزء من واجهة المستخدم يُكتب كمكوّن (Component)
// المكوّن هو ببساطة دالة تُرجع عناصر JSX (شبيهة بـ HTML)
const ServicesPage = () => {

  // استخراج دالة الترجمة t من سياق اللغة
  // t هي اختصار لـ "translate" (ترجمة)
  // نستخدمها في كل مكان نريد فيه عرض نص قابل للترجمة
  const { t } = useLang();

  // ============================================================
  // مصفوفة بيانات الخدمات (Services Data Array)
  // ============================================================
  // هذه مصفوفة تحتوي على كائنات (Objects)، كل كائن يمثل خدمة واحدة
  // كل خدمة تحتوي على:
  //   - icon: الأيقونة المعروضة (مكوّن React)
  //   - title: عنوان الخدمة (مترجم)
  //   - description: وصف الخدمة (مترجم)
  //   - features: قائمة بالمميزات/القدرات (مصفوفة نصوص)
  //   - gradient: تدرج لوني يظهر عند تمرير الماوس فوق البطاقة
  //   - techStack: الأدوات والتقنيات المستخدمة في هذه الخدمة
  const services = [
    // ---------- الخدمة الأولى: اختبار اختراق تطبيقات الويب ----------
    // تركز على فحص مواقع وتطبيقات الويب واكتشاف الثغرات الأمنية فيها
    {
      icon: <Globe className="w-12 h-12 text-blue-400" />,
      title: t("services.webTitle"),
      description: t("services.webDesc"),
      features: [
        "OWASP Top 10 vulnerability assessment",       // تقييم أهم 10 ثغرات حسب معيار OWASP
        "Authentication and authorization testing",     // اختبار المصادقة والصلاحيات
        "SQL injection and XSS detection",              // كشف ثغرات حقن SQL وهجمات XSS
        "Business logic flaw identification",           // تحديد عيوب المنطق البرمجي للتطبيق
        "API security analysis",                        // تحليل أمان واجهات البرمجة (API)
        "Session management review"                     // مراجعة إدارة الجلسات
      ],
      gradient: "from-blue-500/10 to-cyan-500/10",      // تدرج أزرق إلى سماوي
      techStack: ["BURP Suite", "OWASP ZAP", "Nuclei", "SQLMap"] // أدوات اختبار الويب
    },
    // ---------- الخدمة الثانية: اختبار اختراق الشبكات ----------
    // تركز على فحص البنية التحتية للشبكات واكتشاف نقاط الضعف
    {
      icon: <Network className="w-12 h-12 text-blue-400" />,
      title: t("services.networkTitle"),
      description: t("services.networkDesc"),
      features: [
        "Internal and external network scanning",       // فحص الشبكات الداخلية والخارجية
        "Firewall configuration review",                // مراجعة إعدادات جدار الحماية
        "Wireless security assessment",                 // تقييم أمان الشبكات اللاسلكية
        "Port and service enumeration",                 // تعداد المنافذ والخدمات المفتوحة
        "Network segmentation analysis",                // تحليل تقسيم الشبكة
        "VPN and remote access testing"                 // اختبار VPN والوصول عن بُعد
      ],
      gradient: "from-purple-500/10 to-pink-500/10",    // تدرج بنفسجي إلى وردي
      techStack: ["Nmap", "Metasploit", "Wireshark", "Nessus"] // أدوات اختبار الشبكات
    },
    // ---------- الخدمة الثالثة: عمليات الفريق الأحمر (Red Team) ----------
    // محاكاة هجوم حقيقي شامل لاختبار جاهزية المؤسسة
    {
      icon: <Server className="w-12 h-12 text-blue-400" />,
      title: t("services.redTeamTitle"),
      description: t("services.redTeamDesc"),
      features: [
        "Full-scope attack simulation",                 // محاكاة هجوم شامل
        "Social engineering campaigns",                 // حملات الهندسة الاجتماعية
        "Physical security testing",                    // اختبار الأمن المادي
        "Incident response validation",                 // التحقق من الاستجابة للحوادث
        "Purple team collaboration",                    // التعاون مع الفريق البنفسجي
        "Custom exploit development"                    // تطوير استغلالات مخصصة
      ],
      gradient: "from-violet-500/10 to-blue-500/10",    // تدرج بنفسجي إلى أزرق
      techStack: ["Cobalt Strike", "Empire", "Mimikatz", "BloodHound"] // أدوات الفريق الأحمر
    }
  ];

  // ============================================================
  // مصفوفة خطوات العملية (Process Steps Data Array)
  // ============================================================
  // هذه مصفوفة تحتوي على الخطوات الأربع التي نتبعها في تنفيذ أي خدمة
  // كل خطوة تحتوي على:
  //   - number: رقم الخطوة (يظهر في دائرة)
  //   - title: عنوان الخطوة (مترجم)
  //   - description: وصف الخطوة (مترجم)
  //   - icon: أيقونة توضيحية للخطوة
  const processSteps = [
    // الخطوة 1: الاستطلاع وجمع المعلومات
    {
      number: "01",
      title: t("services.step1"),
      description: t("services.step1Desc"),
      icon: <Search className="w-8 h-8 text-blue-400" />
    },
    // الخطوة 2: التخطيط ووضع الاستراتيجية
    {
      number: "02",
      title: t("services.step2"),
      description: t("services.step2Desc"),
      icon: <Shield className="w-8 h-8 text-blue-400" />
    },
    // الخطوة 3: تنفيذ الاختبار واكتشاف الثغرات
    {
      number: "03",
      title: t("services.step3"),
      description: t("services.step3Desc"),
      icon: <Bug className="w-8 h-8 text-blue-400" />
    },
    // الخطوة 4: كتابة التقرير وتقديم التوصيات
    {
      number: "04",
      title: t("services.step4"),
      description: t("services.step4Desc"),
      icon: <FileText className="w-8 h-8 text-blue-400" />
    }
  ];

  // ============================================================
  // القسم المُرجَع (Return) - واجهة المستخدم المرئية
  // ============================================================
  // كل ما بداخل return هو ما يراه المستخدم على الشاشة
  // نستخدم JSX وهو صيغة تجمع بين JavaScript و HTML
  // min-h-screen تجعل الصفحة تأخذ على الأقل ارتفاع الشاشة كاملاً
  return (
    <div className="min-h-screen">

      {/* ================================================================
          القسم الأول: قسم البطل (Hero Section)
          ================================================================
          هذا هو أول ما يراه الزائر عند فتح صفحة الخدمات.
          يحتوي على:
          - شارة صغيرة (badge) مع أيقونة الدرع
          - عنوان رئيسي كبير
          - فقرة وصفية

          الخصائص التصميمية:
          - pt-32: مسافة علوية كبيرة لترك مكان لشريط التنقل
          - pb-20: مسافة سفلية
          - relative: لتحديد موقع العناصر المطلقة بداخله
      */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">

        {/* عنصر زخرفي: دائرة ضبابية كبيرة في الخلفية
            تضيف تأثير إضاءة خافت خلف المحتوى
            - absolute: موقع مطلق (لا يأخذ مكاناً في التدفق الطبيعي)
            - blur-3xl: تأثير ضبابية قوي
            - pointer-events-none: لا يتفاعل مع نقرات الماوس
        */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* حاوية المحتوى الرئيسية - محدودة العرض ومتمركزة */}
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">

            {/* الشارة العلوية (Badge)
                - motion.div يضيف حركة ظهور تدريجي مع انزلاق من أسفل
                - initial: الحالة الابتدائية (مخفي ومنزاح 20px للأسفل)
                - animate: الحالة النهائية (مرئي وفي موقعه الطبيعي)
                - rounded-full: حواف دائرية بالكامل
                - bg-blue-500/10: خلفية زرقاء بشفافية 10%
            */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
            >
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">{t("services.badge")}</span>
            </motion.div>

            {/* العنوان الرئيسي للصفحة
                - motion.h1 يضيف حركة مع تأخير 0.1 ثانية
                - text-5xl: حجم خط كبير جداً (على الشاشات الصغيرة)
                - sm:text-6xl: حجم أكبر على الشاشات المتوسطة فما فوق
                - font-bold: خط عريض (غامق)
            */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl font-bold mb-6 leading-tight text-zinc-100"
            >
              {t("services.heroTitle")}
            </motion.h1>

            {/* الفقرة الوصفية تحت العنوان
                - تظهر بتأخير 0.2 ثانية بعد العنوان
                - max-w-3xl: عرض أقصى لتسهيل القراءة
                - leading-relaxed: تباعد مريح بين الأسطر
            */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-zinc-300 mb-10 leading-relaxed max-w-3xl mx-auto"
            >
              {t("services.heroSubtitle")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ================================================================
          القسم الثاني: شبكة الخدمات (Services Grid)
          ================================================================
          يعرض الخدمات الثلاث في شبكة من البطاقات (Cards).
          التصميم متجاوب:
          - على الشاشات الصغيرة: بطاقة واحدة في كل صف
          - md (768px+): بطاقتان في كل صف
          - lg (1024px+): ثلاث بطاقات في كل صف

          نستخدم map() للمرور على مصفوفة الخدمات وإنشاء بطاقة لكل خدمة
      */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* الشبكة المتجاوبة: grid مع أعمدة متغيرة حسب حجم الشاشة */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* حلقة map: تكرار لكل خدمة في المصفوفة وإنشاء بطاقة لها
                - key={index}: مفتاح فريد لكل عنصر (مطلوب من React)
                - transition delay: كل بطاقة تظهر بتأخير مختلف لتأثير متتابع
                - group: فئة Tailwind تسمح بتطبيق تأثيرات hover على العناصر الفرعية
                - backdrop-blur-sm: تأثير ضبابية خفيف على الخلفية
            */}
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="group relative p-8 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 hover:border-blue-400/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10"
              >
                {/* طبقة التدرج اللوني: تظهر فقط عند تمرير الماوس (hover)
                    - opacity-0: مخفية بشكل افتراضي
                    - group-hover:opacity-100: تظهر عند تمرير الماوس فوق البطاقة الأم
                */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                {/* محتوى البطاقة - relative لتكون فوق طبقة التدرج */}
                <div className="relative">

                  {/* أيقونة الخدمة داخل مربع بخلفية زرقاء شفافة */}
                  <div className="mb-6 inline-block p-4 rounded-xl bg-blue-500/10">
                    {service.icon}
                  </div>

                  {/* عنوان الخدمة */}
                  <h3 className="text-2xl font-bold mb-3 text-zinc-100">{service.title}</h3>

                  {/* وصف الخدمة */}
                  <p className="text-zinc-300 mb-6 leading-relaxed">{service.description}</p>

                  {/* قائمة مميزات الخدمة
                      كل ميزة تُعرض مع أيقونة علامة صح (CheckCircle) بجانبها
                      - flex-shrink-0: يمنع الأيقونة من التصغير
                      - mt-1: مسافة علوية صغيرة لمحاذاة الأيقونة مع النص
                  */}
                  <div className="mb-6 space-y-3">
                    {service.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" />
                        <span className="text-sm text-zinc-400">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* قسم الأدوات المستخدمة (Tech Stack)
                      يعرض أسماء الأدوات في شارات صغيرة (badges)
                      - flex-wrap: يسمح للأدوات بالالتفاف إلى سطر جديد إذا لم يكفِ المكان
                      - gap-2: مسافة بين الشارات
                  */}
                  <div className="mb-6">
                    <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wider">Tools Used</p>
                    <div className="flex flex-wrap gap-2">
                      {service.techStack.map((tech, tIndex) => (
                        <span
                          key={tIndex}
                          className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-zinc-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* رابط الدعوة للعمل (CTA Link)
                      يوجه المستخدم إلى صفحة التواصل
                      - group-hover:translate-x-1: السهم يتحرك لليمين عند تمرير الماوس
                  */}
                  <Link
                    to="/contact"
                    className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors group"
                  >
                    <span>{t("services.ctaBtn")}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          القسم الثالث: الخط الزمني للعملية (Process Timeline)
          ================================================================
          يعرض الخطوات الأربع التي نتبعها في تقديم خدماتنا:
          1. الاستطلاع  2. التخطيط  3. التنفيذ  4. التقرير

          كل خطوة في بطاقة مع رقم في دائرة وخط يربط بين الخطوات.
          - bg-gradient-to-b: تدرج لوني من شفاف إلى أزرق داكن خفيف
          - md:grid-cols-4: أربعة أعمدة على الشاشات المتوسطة فما فوق
      */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-blue-950/10">
        <div className="max-w-7xl mx-auto">

          {/* عنوان القسم والوصف الفرعي */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-zinc-100">
              {t("services.processTitle")}
            </h2>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
              {t("services.processSubtitle")}
            </p>
          </div>

          {/* شبكة الخطوات: 4 أعمدة على الشاشات المتوسطة */}
          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="relative"
              >
                {/* الخط الأفقي الذي يربط بين الخطوات
                    - يظهر فقط على الشاشات المتوسطة فما فوق (hidden md:block)
                    - لا يظهر بعد آخر خطوة (الشرط: index < processSteps.length - 1)
                    - يبدأ من منتصف البطاقة ويمتد بعرض البطاقة كاملاً
                */}
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-400/50 to-transparent"></div>
                )}

                {/* بطاقة الخطوة */}
                <div className="relative p-6 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 hover:border-blue-400/50 transition-all">

                  {/* رقم الخطوة في دائرة زرقاء
                      - absolute -top-4 -left-4: موضوع خارج حدود البطاقة قليلاً
                      - shadow-lg: ظل كبير لإبراز الدائرة
                  */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/25 text-zinc-100">
                    {step.number}
                  </div>

                  {/* أيقونة الخطوة */}
                  <div className="mb-4 mt-4">
                    {step.icon}
                  </div>

                  {/* عنوان الخطوة */}
                  <h3 className="text-xl font-bold mb-2 text-zinc-100">{step.title}</h3>

                  {/* وصف الخطوة */}
                  <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          القسم الرابع: الدعوة للعمل (Call To Action - CTA)
          ================================================================
          قسم بارز في نهاية الصفحة يدعو الزائر للتواصل معنا.
          يحتوي على:
          - خلفية بتدرج لوني من أزرق إلى بنفسجي
          - نمط شبكي (grid pattern) في الخلفية باستخدام SVG مشفر بـ base64
          - عنوان ونص تشجيعي
          - زر يوجه إلى صفحة التواصل
      */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* البطاقة الرئيسية لقسم CTA
              - bg-gradient-to-br: تدرج من أعلى اليسار إلى أسفل اليمين
              - overflow-hidden: إخفاء أي محتوى يتجاوز حدود البطاقة
          */}
          <div className="relative p-12 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 overflow-hidden">

            {/* طبقة النمط الشبكي في الخلفية
                - تستخدم صورة SVG مشفرة بـ base64 لرسم شبكة خطوط رفيعة
                - opacity-30: شفافية 30% لتكون خفيفة في الخلفية
            */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

            {/* محتوى قسم CTA */}
            <div className="relative text-center">
              {/* العنوان التشجيعي */}
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-zinc-100">
                {t("services.ctaTitle")}
              </h2>

              {/* النص الوصفي تحت العنوان */}
              <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
                {t("services.ctaSubtitle")}
              </p>

              {/* زر الانتقال لصفحة التواصل
                  - bg-blue-500 hover:bg-blue-600: لون أزرق يغمق عند تمرير الماوس
                  - hover:shadow-2xl: ظل كبير يظهر عند تمرير الماوس
                  - transition-all: انتقال سلس لجميع التأثيرات
              */}
              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all hover:shadow-2xl hover:shadow-blue-500/30 text-zinc-100"
              >
                <span>{t("services.ctaBtn")}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// تصدير المكوّن كتصدير افتراضي (default export)
// هذا يسمح لنا باستيراده في ملفات أخرى باستخدام:
// import ServicesPage from './pages/ServicesPage';
// يُستخدم عادةً في ملف التوجيه (Router) لربط المكوّن بمسار URL معين
export default ServicesPage;
