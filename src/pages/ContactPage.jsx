// ============================================
// صفحة اتصل بنا (Contact Page)
// ============================================
// هذه الصفحة تحتوي على نموذج الاتصال الذي يسمح
// للمستخدمين بإرسال رسائل إلى فريق الدعم.
// تتضمن الصفحة: نموذج اتصال، شريط جانبي بمعلومات
// التواصل (العنوان، البريد الإلكتروني، الهاتف)،
// وقسم الأسئلة الشائعة في الأسفل.
// ============================================

// ============================================
// استيراد المكتبات والأدوات المطلوبة (Imports)
// ============================================
// useState: خطاف (Hook) من React يسمح لنا بإنشاء متغيرات حالة (state)
// تتغير قيمتها وتُحدّث الواجهة تلقائياً عند التغيير
import { useState } from 'react';

// استيراد أيقونات من مكتبة lucide-react
// Mail: أيقونة البريد الإلكتروني
// MapPin: أيقونة الموقع على الخريطة
// Phone: أيقونة الهاتف
// Send: أيقونة الإرسال
// CheckCircle: أيقونة علامة النجاح (دائرة بداخلها صح)
// AlertCircle: أيقونة التحذير/الخطأ (دائرة بداخلها تعجب)
import {
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// motion: مكتبة لإضافة حركات وانتقالات سلسة (animations) على العناصر
import { motion } from 'framer-motion';

// useLang: خطاف مخصص للحصول على دالة الترجمة (t) التي تدعم تعدد اللغات
import { useLang } from '../contexts/LanguageContext';

// ============================================
// المكوّن الرئيسي لصفحة الاتصال (ContactPage Component)
// ============================================
// هذا هو المكوّن (Component) الرئيسي، وهو دالة تُرجع عناصر JSX
// التي تُشكّل واجهة صفحة "اتصل بنا"
const ContactPage = () => {
  // استخراج دالة الترجمة t من سياق اللغة
  // t("مفتاح") تُرجع النص المترجم حسب اللغة المختارة
  const { t } = useLang();

  // ============================================
  // متغيرات الحالة (State Variables)
  // ============================================

  // formData: كائن (Object) يحتوي على جميع بيانات النموذج
  // كل حقل في النموذج له قيمة مبدئية فارغة ''
  // setFormData: الدالة المستخدمة لتحديث بيانات النموذج
  // عندما يكتب المستخدم في أي حقل، يتم تحديث القيمة هنا
  const [formData, setFormData] = useState({
    name: '',       // اسم المستخدم
    email: '',      // البريد الإلكتروني
    company: '',    // اسم الشركة (اختياري)
    phone: '',      // رقم الهاتف
    serviceType: '', // نوع الخدمة المطلوبة
    message: ''     // نص الرسالة
  });

  // formStatus: متغير حالة لتتبع نتيجة إرسال النموذج
  // null = لم يتم الإرسال بعد
  // 'success' = تم الإرسال بنجاح
  // 'error' = حدث خطأ أثناء الإرسال
  const [formStatus, setFormStatus] = useState(null);

  // ============================================
  // مصفوفة أنواع الخدمات (Service Types Array)
  // ============================================
  // هذه المصفوفة تحتوي على أنواع الخدمات المتاحة
  // التي يمكن للمستخدم اختيار واحدة منها في القائمة المنسدلة
  // كل عنصر يستخدم دالة الترجمة t() للحصول على النص بلغة المستخدم
  const serviceTypes = [
    t("contact.serviceWeb"),        // خدمة أمن الويب
    t("contact.serviceNetwork"),    // خدمة أمن الشبكات
    t("contact.serviceRedTeam"),    // خدمة الفريق الأحمر (اختبار الاختراق)
    t("contact.serviceCompliance"), // خدمة الامتثال والمعايير
    t("contact.serviceOther"),      // خدمات أخرى
  ];

  // ============================================
  // دوال معالجة الأحداث (Event Handlers)
  // ============================================

  // handleChange: دالة تُستدعى في كل مرة يكتب فيها المستخدم في أي حقل
  // e: كائن الحدث (Event Object) الذي يحتوي على معلومات عن الحقل المتغيّر
  // e.target.name: اسم الحقل (مثلاً 'name', 'email', 'phone')
  // e.target.value: القيمة الجديدة التي كتبها المستخدم
  // ...formData: ينسخ جميع القيم القديمة ثم يستبدل الحقل المتغيّر فقط
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handleSubmit: دالة تُستدعى عند الضغط على زر "إرسال"
  // e.preventDefault(): يمنع إعادة تحميل الصفحة (السلوك الافتراضي للنموذج)
  // بعد الإرسال: يُعرض رسالة نجاح لمدة 3 ثوانٍ، ثم تُمسح الحقول
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData); // طباعة البيانات في وحدة التحكم (Console)
    setFormStatus('success'); // تعيين حالة النموذج إلى "نجاح"

    // بعد 3 ثوانٍ (3000 ميلي ثانية):
    // 1. مسح جميع حقول النموذج بإرجاعها لقيم فارغة
    // 2. إخفاء رسالة النجاح بإرجاع الحالة إلى null
    setTimeout(() => {
      setFormData({ name: '', email: '', company: '', phone: '', serviceType: '', message: '' });
      setFormStatus(null);
    }, 3000);
  };

  // ============================================
  // مصفوفة معلومات التواصل (Contact Info Array)
  // ============================================
  // هذه المصفوفة تحتوي على بيانات التواصل التي تظهر في الشريط الجانبي
  // كل عنصر هو كائن يحتوي على:
  // icon: الأيقونة المعروضة بجانب المعلومة
  // title: عنوان وسيلة التواصل
  // details: مصفوفة تحتوي على تفاصيل إضافية (سطر أو أكثر)
  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-blue-400" />,   // أيقونة الموقع
      title: t("contact.officeTitle"),                        // عنوان المكتب
      details: [t("contact.officeLocation"), "Available for remote consultations"] // الموقع + ملاحظة
    },
    {
      icon: <Mail className="w-6 h-6 text-blue-400" />,     // أيقونة البريد
      title: t("contact.emailTitle"),                         // عنوان البريد الإلكتروني
      details: ["contact@secops.dz", "Response within 24 hours"] // البريد + مدة الرد
    },
    {
      icon: <Phone className="w-6 h-6 text-blue-400" />,    // أيقونة الهاتف
      title: t("contact.phoneTitle"),                         // عنوان رقم الهاتف
      details: ["+213 665 869 346", "24/7 support for Enterprise clients"] // الرقم + ملاحظة الدعم
    }
  ];

  // ============================================
  // بداية JSX - الواجهة المرئية للصفحة
  // ============================================
  // العنصر الجذري: div يأخذ كامل ارتفاع الشاشة كحد أدنى
  return (
    <div className="min-h-screen">

      {/* ============================================ */}
      {/* قسم البطل / المقدمة (Hero Section) */}
      {/* ============================================ */}
      {/* هذا القسم يظهر في أعلى الصفحة ويحتوي على العنوان الرئيسي */}
      {/* والوصف التعريفي لصفحة الاتصال */}
      {/* pt-32: مسافة علوية كبيرة لترك مكان لشريط التنقل */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        {/* خلفية دائرية متدرجة زرقاء شفافة لإضافة تأثير بصري جمالي */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">

            {/* شارة صغيرة (Badge) في الأعلى مع أيقونة الإرسال */}
            {/* motion.div: يُضيف حركة ظهور تدريجية من الأسفل للأعلى */}
            {/* initial: الحالة الابتدائية (مخفي ومنزاح للأسفل) */}
            {/* animate: الحالة النهائية (مرئي وفي مكانه) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
            >
              <Send className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">{t("contact.badge")}</span>
            </motion.div>

            {/* العنوان الرئيسي للصفحة */}
            {/* يظهر بحركة تدريجية مع تأخير بسيط (delay: 0.1 ثانية) */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl font-bold mb-6 leading-tight text-zinc-100"
            >
              {t("contact.heroTitle")}
            </motion.h1>

            {/* الوصف الفرعي تحت العنوان الرئيسي */}
            {/* يظهر بحركة تدريجية مع تأخير أكبر (delay: 0.2 ثانية) */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-zinc-300 mb-10 leading-relaxed max-w-3xl mx-auto"
            >
              {t("contact.heroSubtitle")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* قسم النموذج + الشريط الجانبي (Contact Form + Sidebar) */}
      {/* ============================================ */}
      {/* هذا القسم مقسّم إلى عمودين باستخدام CSS Grid: */}
      {/* العمود الأيسر (2/3): نموذج الاتصال */}
      {/* العمود الأيمن (1/3): معلومات التواصل */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* ============================================ */}
            {/* نموذج الاتصال (Contact Form) */}
            {/* ============================================ */}
            {/* يأخذ عمودين من أصل 3 (lg:col-span-2) */}
            {/* يظهر بحركة انزلاق من اليسار */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              {/* بطاقة النموذج: خلفية شفافة مع حدود وتأثير ضبابي */}
              <div className="p-8 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10">
                <h2 className="text-3xl font-bold mb-6 text-zinc-100">
                  Send Us a Message
                </h2>

                {/* النموذج: عند الإرسال يتم استدعاء handleSubmit */}
                {/* space-y-6: مسافة عمودية بين كل حقل والآخر */}
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* -------- حقل الاسم (Name Field) -------- */}
                  {/* حقل نصي مطلوب (required) لإدخال اسم المستخدم */}
                  {/* النجمة الزرقاء (*) تشير إلى أن الحقل إلزامي */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                      {t("contact.nameLabel")} <span className="text-blue-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder={t("contact.namePlaceholder")}
                    />
                  </div>

                  {/* -------- حقل البريد الإلكتروني (Email Field) -------- */}
                  {/* حقل بريد إلكتروني مطلوب، يتحقق تلقائياً من صيغة البريد */}
                  {/* type="email" يجعل المتصفح يتأكد من أن القيمة بريد صحيح */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                      {t("contact.emailLabel")} <span className="text-blue-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder={t("contact.emailPlaceholder")}
                    />
                  </div>

                  {/* -------- حقل الشركة (Company Field) -------- */}
                  {/* حقل اختياري (بدون required) لإدخال اسم الشركة */}
                  {/* لاحظ عدم وجود النجمة (*) لأنه غير إلزامي */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-zinc-300 mb-2">
                      {t("contact.companyLabel")}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder={t("contact.companyPlaceholder")}
                    />
                  </div>

                  {/* -------- حقل رقم الهاتف (Phone Field) -------- */}
                  {/* حقل مطلوب لإدخال رقم الهاتف */}
                  {/* يحتوي على أيقونة هاتف على اليسار داخل الحقل */}
                  {/* pl-11: مسافة يسرى كبيرة لترك مكان للأيقونة */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-2">
                      {t("contact.phoneLabel")} <span className="text-blue-400">*</span>
                    </label>
                    <div className="relative">
                      {/* أيقونة الهاتف موضوعة بشكل مطلق (absolute) داخل الحقل */}
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-colors"
                        placeholder={t("contact.phonePlaceholder")}
                      />
                    </div>
                  </div>

                  {/* -------- حقل نوع الخدمة (Service Type Field) -------- */}
                  {/* قائمة منسدلة (select/dropdown) مطلوبة */}
                  {/* الخيار الأول فارغ كنص توجيهي (placeholder) */}
                  {/* باقي الخيارات تُولّد ديناميكياً من مصفوفة serviceTypes */}
                  {/* باستخدام .map() للتكرار على كل عنصر */}
                  <div>
                    <label htmlFor="serviceType" className="block text-sm font-medium text-zinc-300 mb-2">
                      {t("contact.serviceLabel")} <span className="text-blue-400">*</span>
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-100 focus:outline-none focus:border-blue-400 transition-colors"
                    >
                      <option value="" className="bg-[#020617]">{t("contact.servicePlaceholder")}</option>
                      {serviceTypes.map((service, index) => (
                        <option key={index} value={service} className="bg-[#020617]">
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* -------- حقل الرسالة (Message Field) -------- */}
                  {/* منطقة نصية كبيرة (textarea) مطلوبة لكتابة الرسالة */}
                  {/* rows={6}: عدد الأسطر المرئية (ارتفاع الحقل) */}
                  {/* resize-none: يمنع المستخدم من تغيير حجم الحقل */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">
                      {t("contact.messageLabel")} <span className="text-blue-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                      placeholder={t("contact.messagePlaceholder")}
                    />
                  </div>

                  {/* ============================================ */}
                  {/* زر الإرسال (Submit Button) */}
                  {/* ============================================ */}
                  {/* زر بعرض كامل يتغير لونه عند التمرير فوقه (hover) */}
                  {/* عند الضغط عليه يتم استدعاء handleSubmit */}
                  {/* يحتوي على نص الزر وأيقونة الإرسال */}
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all hover:shadow-2xl hover:shadow-blue-500/30 flex items-center justify-center space-x-2 text-zinc-100"
                  >
                    <span>{t("contact.sendBtn")}</span>
                    <Send className="w-5 h-5" />
                  </button>

                  {/* ============================================ */}
                  {/* رسالة النجاح (Success Message) */}
                  {/* ============================================ */}
                  {/* تظهر فقط عندما formStatus === 'success' */}
                  {/* تعرض أيقونة صح خضراء مع رسالة نجاح */}
                  {/* تختفي تلقائياً بعد 3 ثوانٍ (كما هو محدد في handleSubmit) */}
                  {formStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 p-4 rounded-lg bg-green-500/10 border border-green-500/30"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400">{t("contact.successMsg")}</span>
                    </motion.div>
                  )}

                  {/* ============================================ */}
                  {/* رسالة الخطأ (Error Message) */}
                  {/* ============================================ */}
                  {/* تظهر فقط عندما formStatus === 'error' */}
                  {/* تعرض أيقونة تحذير حمراء مع رسالة خطأ */}
                  {formStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30"
                    >
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400">{t("contact.errorMsg")}</span>
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>

            {/* ============================================ */}
            {/* الشريط الجانبي - معلومات التواصل (Contact Information Sidebar) */}
            {/* ============================================ */}
            {/* يأخذ عموداً واحداً (1/3 من العرض) */}
            {/* يظهر بحركة انزلاق من اليمين */}
            {/* يعرض معلومات التواصل: الموقع، البريد، الهاتف */}
            {/* يتم توليد العناصر ديناميكياً من مصفوفة contactInfo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="p-8 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10">
                <h3 className="text-2xl font-bold mb-6 text-zinc-100">
                  Contact Information
                </h3>

                {/* حلقة تكرار على مصفوفة contactInfo لعرض كل وسيلة تواصل */}
                {/* كل عنصر يحتوي على: أيقونة، عنوان، وتفاصيل */}
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      {/* حاوية الأيقونة بخلفية زرقاء شفافة */}
                      <div className="p-3 rounded-lg bg-blue-500/10">
                        {info.icon}
                      </div>
                      <div>
                        {/* عنوان وسيلة التواصل */}
                        <h4 className="font-semibold text-zinc-100 mb-1">{info.title}</h4>
                        {/* حلقة تكرار داخلية لعرض سطور التفاصيل */}
                        {info.details.map((detail, dIndex) => (
                          <p key={dIndex} className="text-zinc-400 text-sm">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* قسم الأسئلة الشائعة (FAQ Teaser Section) */}
      {/* ============================================ */}
      {/* قسم بسيط في أسفل الصفحة يدعو المستخدم لزيارة */}
      {/* صفحة الأسئلة الشائعة للحصول على إجابات سريعة */}
      {/* يحتوي على عنوان، وصف، ورابط للانتقال لصفحة الأسئلة */}
      {/* الخلفية متدرجة من شفاف إلى أزرق خفيف */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-blue-950/10">
        <div className="max-w-4xl mx-auto text-center">
          {/* عنوان قسم الأسئلة الشائعة */}
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-zinc-100">
            {t("contact.faqTitle")}
          </h2>
          {/* وصف فرعي يشجع المستخدم على زيارة الأسئلة الشائعة */}
          <p className="text-xl text-zinc-300 mb-8">
            {t("contact.faqSubtitle")}
          </p>
          {/* رابط للانتقال إلى صفحة الأسئلة الشائعة */}
          <a
            href="#"
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            <span>View FAQ</span>
            <CheckCircle className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

// ============================================
// تصدير المكوّن (Export)
// ============================================
// نقوم بتصدير المكوّن كتصدير افتراضي (default export)
// حتى يمكن استيراده في ملفات أخرى واستخدامه في نظام التوجيه (Router)
export default ContactPage;
