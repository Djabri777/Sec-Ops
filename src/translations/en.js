// ============================================
// ملف الترجمة الإنجليزية (English Translation File)
// ============================================
// هذا الملف يحتوي على جميع النصوص المستخدمة في التطبيق باللغة الإنجليزية
// يتم استدعاؤه من LanguageContext عندما تكون اللغة المختارة هي الإنجليزية
// الهيكل: كائن متداخل (nested object) حيث كل قسم يمثل جزءاً من التطبيق
// مثال للوصول: t("nav.services") → "Services"

export default {
  // ===== نصوص شريط التنقل (Navbar) =====
  nav: {
    services: "Services",          // رابط صفحة الخدمات
    about: "About",                // رابط صفحة عن الشركة
    contact: "Contact",            // رابط صفحة اتصل بنا
    home: "Home",                  // رابط الصفحة الرئيسية
    dashboard: "Dashboard",        // رابط لوحة التحكم
    signIn: "Sign In",            // زر تسجيل الدخول
    getStarted: "Get Started",    // زر البدء
    signOut: "Sign Out",          // زر تسجيل الخروج
    toggleLang: "عربي",           // زر تبديل اللغة (يظهر بالعربي لأن المستخدم يرى الإنجليزية حالياً)
  },

  // ===== نصوص صفحات المصادقة (تسجيل الدخول / إنشاء حساب) =====
  auth: {
    // ── صفحة تسجيل الدخول ──
    welcomeBack: "Welcome Back",                                    // عنوان ترحيبي
    signInSubtitle: "Sign in to access your security dashboard",    // نص فرعي
    email: "Email Address",                                         // تسمية حقل البريد
    emailPlaceholder: "you@example.com",                            // نص مؤقت في حقل البريد
    password: "Password",                                           // تسمية حقل كلمة المرور
    passwordPlaceholder: "Enter your password",                     // نص مؤقت في حقل كلمة المرور
    rememberMe: "Remember me",                                     // خيار تذكرني
    forgotPassword: "Forgot password?",                             // رابط نسيت كلمة المرور
    signIn: "Sign In",                                              // زر تسجيل الدخول
    signingIn: "Signing in…",                                       // نص أثناء التحميل
    noAccount: "Don't have an account?",                            // نص لمن لا يملك حساب
    signUp: "Sign Up",                                              // رابط إنشاء حساب
    encrypted: "Your connection is encrypted and secure",           // ملاحظة الأمان

    // ── صفحة إنشاء حساب ──
    createAccount: "Create Account",                                // عنوان صفحة التسجيل
    createSubtitle: "Get started with SecOps security platform",    // نص فرعي
    fullName: "Full Name",                                          // تسمية حقل الاسم
    fullNamePlaceholder: "Full Name",                               // نص مؤقت لحقل الاسم
    phone: "Mobile Phone",                                          // تسمية حقل الهاتف
    phonePlaceholder: "+213 XXX XXX XXX",                           // نص مؤقت لحقل الهاتف (رقم جزائري)
    role: "Account Role",                                           // تسمية حقل الدور
    serviceType: "Service Type",                                    // تسمية اختيار نوع الخدمة

    // أنواع الخدمات المتاحة عند التسجيل
    serviceTypes: {
      starter:    "Starter",       // الباقة الأولى: المبتدئ
      growth:     "Growth",        // الباقة الثانية: النمو
      enterprise: "Enterprise",    // الباقة الثالثة: المؤسسات
    },

    // وصف كل نوع خدمة
    serviceDescriptions: {
      starter:    "One-time basic security scan — perfect for early-stage validation.",          // وصف باقة المبتدئ
      growth:     "Full web application pentest with manual expert review.",                     // وصف باقة النمو
      enterprise: "Full infrastructure pentest with advanced red team operations.",              // وصف باقة المؤسسات
    },

    // حقول تأكيد كلمة المرور
    confirmPassword: "Confirm Password",                            // تسمية حقل تأكيد كلمة المرور
    confirmPlaceholder: "Confirm your password",                    // نص مؤقت
    passwordPlaceholder2: "Create a strong password",               // نص مؤقت لحقل كلمة المرور في صفحة التسجيل

    // شروط الخدمة
    termsAgree: "I agree to the",     // بداية جملة الموافقة على الشروط
    termsService: "Terms of Service", // رابط شروط الخدمة
    and: "and",                       // كلمة "و" بين الشروط والخصوصية
    privacy: "Privacy Policy",        // رابط سياسة الخصوصية
    creating: "Creating account…",    // نص أثناء إنشاء الحساب
    haveAccount: "Already have an account?", // نص لمن لديه حساب
    dataSecure: "Your data is encrypted and secure", // ملاحظة أمان البيانات

    // أسماء الأدوار
    roles: { client: "Client", pentester: "Pentester", admin: "Admin" },

    // ── رسائل الأخطاء ──
    // تظهر عند فشل تسجيل الدخول أو إنشاء الحساب
    errors: {
      invalidCredentials: "Invalid email or password.",                      // بريد أو كلمة مرور خاطئة
      tooManyRequests: "Too many failed attempts. Please try again later.",  // محاولات كثيرة (حماية Firebase)
      userDisabled: "This account has been disabled.",                       // حساب معطل
      signInFailed: "Sign-in failed. Please try again.",                    // فشل عام في تسجيل الدخول
      emailInUse: "An account with this email already exists.",             // البريد مستخدم مسبقاً
      invalidEmail: "Invalid email address.",                               // بريد غير صالح
      weakPassword: "Password must be at least 6 characters.",              // كلمة مرور ضعيفة
      registrationFailed: "Registration failed. Please try again.",         // فشل عام في التسجيل
      passwordMismatch: "Passwords do not match.",                          // كلمتا المرور غير متطابقتين
      passwordShort: "Password must be at least 6 characters.",             // كلمة مرور قصيرة
    },
  },

  // ===== نصوص الصفحة الرئيسية (Home Page) =====
  home: {
    badge: "Your Gateway to Professional Pentesting",                       // شارة صغيرة فوق العنوان
    heroTitle1: "Professional Security Audits for",                         // الجزء الأول من العنوان الرئيسي
    heroTitle2: "Start-Ups and Small Enterprises",                          // الجزء الملون بتدرج لوني
    heroSubtitle: "A dedicated digital gateway designed to provide startups with accessible, professional security assessments. We simplify the path to securing your digital assets through expert-led penetration testing.", // النص الفرعي التعريفي
    launchAudit: "Launch Your First Audit",   // زر الدعوة الرئيسي
    viewServices: "View Services",            // زر الدعوة الثانوي
    servicesTitle: "Security That Scales With You",                         // عنوان قسم الخدمات
    servicesSubtitle: "Modern security tooling designed for the pace of startup innovation", // نص فرعي لقسم الخدمات
    viewAllServices: "View All Services",     // رابط عرض كل الخدمات

    // ── قسم الأسعار ──
    pricingTitle: "The Trust Tiers",                                        // عنوان قسم الأسعار
    pricingSubtitle: "Transparent pricing for Algerian startups. No hidden fees.", // نص فرعي
    mostPopular: "Most Popular",              // شارة الخطة الأكثر شعبية

    // بطاقات الخدمات الثلاث في الصفحة الرئيسية
    services: {
      pentest: {
        title: "Continuous Pentesting",       // عنوان خدمة اختبار الاختراق المستمر
        desc: "Managed security audits that move at the speed of your code. Stay protected as you ship features.", // وصفها
      },
      vulnDash: {
        title: "Vulnerability Dashboard",     // عنوان لوحة تحكم الثغرات
        desc: "Real-time visibility into your security posture. Track, prioritize, and remediate threats efficiently.", // وصفها
      },
      compliance: {
        title: "Compliance Readiness",        // عنوان الاستعداد للامتثال
        desc: "Helping Algerian startups achieve global security standards. ISO 27001, SOC 2, and beyond.", // وصفها
      },
    },

    // ── تفاصيل خطط الأسعار الثلاث ──
    pricing: {
      // خطة المبتدئ (Starter) - 45,000 دج
      starter: {
        name: "Starter",                                   // اسم الخطة
        desc: "Perfect for early-stage validation",        // وصف الخطة
        cta: "Start Scan",                                 // نص زر الاشتراك
        f1: "One-time basic security scan",                // ميزة 1
        f2: "Automated vulnerability detection",           // ميزة 2
        f3: "Comprehensive PDF report",                    // ميزة 3
        f4: "Email support",                               // ميزة 4
      },
      // خطة النمو (Growth) - 120,000 دج - الأكثر شعبية
      growth: {
        name: "Growth",                                    // اسم الخطة
        desc: "For startups serious about security",       // وصف الخطة
        cta: "Launch Audit",                               // نص زر الاشتراك
        f1: "Full web application pentesting",             // ميزة 1
        f2: "Manual expert security review",               // ميزة 2
        f3: "OWASP Top 10 compliance",                     // ميزة 3
        f4: "Slack/Teams integration",                     // ميزة 4
        f5: "Quarterly re-testing included",               // ميزة 5
        f6: "Security roadmap consultation",               // ميزة 6
      },
      // خطة المؤسسات (Enterprise) - 400,000 دج
      enterprise: {
        name: "Enterprise",                                            // اسم الخطة
        desc: "Large-scale infrastructures requiring advanced adversary simulation", // وصف الخطة
        cta: "Contact Sales",                                          // نص زر الاشتراك
        f1: "Full infrastructure pentesting",                          // ميزة 1
        f2: "Advanced Adversary Simulation (Red Teaming)",             // ميزة 2
        f3: "Comprehensive Incident Response Planning",                // ميزة 3
        f4: "Remediation support included",                            // ميزة 4
        f5: "Incident response planning",                              // ميزة 5
        f6: "Unlimited pentesting credits",                            // ميزة 6
      },
    },
  },

  // ===== نصوص صفحة الخدمات (Services Page) =====
  services: {
    badge: "What We Offer",                        // شارة أعلى الصفحة
    heroTitle: "Comprehensive Security Services",  // العنوان الرئيسي
    heroSubtitle: "Enterprise-grade penetration testing and security assessment services tailored for Algerian startups and SMEs.", // النص الفرعي

    // ── الخدمات الثلاث الرئيسية ──
    webTitle: "Web Application Pentesting",        // عنوان خدمة اختبار تطبيقات الويب
    webDesc: "Full-spectrum web application security testing covering OWASP Top 10, business logic flaws, and advanced attack vectors.", // وصفها
    networkTitle: "Network Security Audits",       // عنوان خدمة تدقيق أمن الشبكة
    networkDesc: "Comprehensive network infrastructure assessment including firewall analysis, service enumeration, and exploitation testing.", // وصفها
    redTeamTitle: "Red Team Operations",           // عنوان خدمة عمليات الفريق الأحمر
    redTeamDesc: "Advanced adversary simulation mimicking real-world threat actors to test your organization's detection and response capabilities.", // وصفها

    // ── خطوات عملية الاختبار (4 خطوات) ──
    processTitle: "Our Testing Process",           // عنوان قسم العملية
    processSubtitle: "A structured, methodical approach to every engagement", // نص فرعي
    step1: "Scope Definition",                     // الخطوة 1: تحديد النطاق
    step1Desc: "Define targets, rules of engagement, and success criteria",
    step2: "Reconnaissance & Scanning",            // الخطوة 2: الاستطلاع والفحص
    step2Desc: "Passive and active information gathering and service enumeration",
    step3: "Exploitation",                         // الخطوة 3: الاستغلال
    step3Desc: "Controlled exploitation of identified vulnerabilities",
    step4: "Reporting",                            // الخطوة 4: إعداد التقارير
    step4Desc: "Detailed findings report with remediation recommendations",

    // ── قسم الدعوة للعمل (CTA) ──
    ctaTitle: "Ready to Secure Your Application?",
    ctaSubtitle: "Get a free security assessment consultation for your startup.",
    ctaBtn: "Get Free Assessment",                 // زر الدعوة
  },

  // ===== نصوص صفحة عن الشركة (About Page) =====
  about: {
    badge: "Our Mission",                          // شارة أعلى الصفحة
    heroTitle: "Securing Algeria's Digital Future", // العنوان الرئيسي
    heroSubtitle: "We believe every startup deserves enterprise-grade security, regardless of size or budget.", // النص الفرعي

    // ── الإحصائيات الأربع ──
    stat1Value: "100%",  stat1Label: "Client Satisfaction",    // رضا العملاء
    stat2Value: "24/7",  stat2Label: "Monitoring",             // المراقبة المستمرة
    stat3Value: "20+",   stat3Label: "Projects Completed",     // المشاريع المنجزة
    stat4Value: "2+",    stat4Label: "Years Experience",       // سنوات الخبرة

    // ── القيم الأساسية (3 قيم) ──
    valuesTitle: "Our Values",
    val1Title: "Startup-First Mindset",            // القيمة 1: عقلية الشركات الناشئة أولاً
    val1Desc: "We understand the constraints of early-stage companies and design our services accordingly.",
    val2Title: "Practical Security",               // القيمة 2: أمن عملي
    val2Desc: "No jargon, no fluff. We deliver actionable insights that your team can implement immediately.",
    val3Title: "Continuous Partnership",            // القيمة 3: شراكة مستمرة
    val3Desc: "Security is a journey, not a destination. We're with you every step of the way.",

    // ── قسم الفريق ──
    teamTitle: "Meet Our Team",
    founderTitle: "Founder & Lead Pentester",       // منصب المؤسس
    founderDesc: "Certified ethical hacker with expertise in web application security and red team operations. Passionate about making enterprise security accessible to Algerian startups.",

    // ── لماذا تختارنا المؤسسات (3 أسباب) ──
    whyTitle: "Why SMEs Choose Us",
    whySubtitle: "We understand the unique challenges facing small and medium enterprises in Algeria.",
    why1Title: "Cost-Effective",                   // السبب 1: فعّال من حيث التكلفة
    why1Desc: "Enterprise-grade security at startup-friendly prices in DZD.",
    why2Title: "Local Expertise",                  // السبب 2: خبرة محلية
    why2Desc: "Deep understanding of the Algerian regulatory and business environment.",
    why3Title: "Fast Turnaround",                  // السبب 3: سرعة في التسليم
    why3Desc: "Rapid assessment and reporting without compromising quality.",

    // ── قسم الدعوة للعمل ──
    ctaTitle: "Join the SecOps Family",
    ctaSubtitle: "Protect your startup with professional security services.",
    ctaBtn: "Get Started Today",
  },

  // ===== نصوص صفحة اتصل بنا (Contact Page) =====
  contact: {
    badge: "Get In Touch",                         // شارة أعلى الصفحة
    heroTitle: "Let's Secure Your Digital Future",  // العنوان الرئيسي
    heroSubtitle: "Have a project in mind? We'd love to hear about it. Send us a message and we'll get back to you as soon as possible.", // النص الفرعي

    // ── حقول نموذج الاتصال ──
    nameLabel: "Full Name",                        // تسمية حقل الاسم
    namePlaceholder: "Your full name",             // نص مؤقت
    emailLabel: "Email Address",                   // تسمية حقل البريد
    emailPlaceholder: "you@company.com",           // نص مؤقت
    companyLabel: "Company Name",                  // تسمية حقل الشركة
    companyPlaceholder: "Your company",            // نص مؤقت
    phoneLabel: "Phone Number",                    // تسمية حقل الهاتف
    phonePlaceholder: "+213 XXX XXX XXX",          // نص مؤقت
    serviceLabel: "Service Interest",              // تسمية حقل اختيار الخدمة
    servicePlaceholder: "Select a service",        // نص مؤقت

    // خيارات الخدمات في القائمة المنسدلة
    serviceWeb: "Web Application Pentesting",      // اختبار اختراق تطبيقات الويب
    serviceNetwork: "Network Security Audit",      // تدقيق أمن الشبكة
    serviceRedTeam: "Red Team Operations",         // عمليات الفريق الأحمر
    serviceCompliance: "Compliance Consulting",    // استشارات الامتثال
    serviceOther: "Other",                         // أخرى

    // حقل الرسالة وأزرار الإرسال
    messageLabel: "Message",                       // تسمية حقل الرسالة
    messagePlaceholder: "Tell us about your project and security needs…", // نص مؤقت
    sendBtn: "Send Message",                       // زر الإرسال
    sending: "Sending…",                           // نص أثناء الإرسال

    // رسائل النجاح والخطأ
    successMsg: "Message sent successfully! We'll be in touch soon.", // رسالة نجاح
    errorMsg: "Failed to send message. Please try again.",           // رسالة خطأ

    // ── معلومات الاتصال ──
    officeTitle: "Our Office",                     // عنوان المكتب
    officeLocation: "Djelfa, Algeria",             // الموقع: الجلفة، الجزائر
    emailTitle: "Email Us",                        // عنوان البريد
    phoneTitle: "Call Us",                         // عنوان الهاتف

    // ── الأسئلة الشائعة ──
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Check our FAQ for quick answers, or contact us directly.",
  },

  // ===== نصوص لوحات التحكم (Dashboard) =====
  // تُستخدم في لوحات تحكم المدير والمختبر والعميل
  dash: {
    // ── أسماء التبويبات في الشريط الجانبي ──
    overview: "Overview",              // نظرة عامة
    allAudits: "All Audits",          // جميع التدقيقات
    pentesters: "Pentesters",         // مختبرو الاختراق
    users: "Manage Users",            // إدارة المستخدمين
    reports: "Reports",               // التقارير
    scanResults: "Scan Results",      // نتائج الفحص
    myAudits: "My Audits",           // تدقيقاتي
    requestAudit: "Request Pentest",  // طلب اختبار اختراق

    // ── عناوين لوحات التحكم ──
    adminDashboard: "Admin Dashboard",         // لوحة تحكم المدير
    pentesterDashboard: "Pentester Dashboard", // لوحة تحكم المختبر
    clientDashboard: "Client Dashboard",       // لوحة تحكم العميل
    adminPanel: "Admin Panel",                 // لوحة المدير (في الشريط الجانبي)
    pentesterPanel: "Pentester Panel",         // لوحة المختبر
    clientPortal: "Client Portal",             // بوابة العميل

    // ── بطاقات الإحصائيات ──
    totalAudits: "Total Audits",       // إجمالي التدقيقات
    pending: "Pending",                // قيد الانتظار
    inProgress: "In Progress",         // قيد التنفيذ
    completed: "Completed",            // مكتملة
    assignedAudits: "Assigned Audits", // التدقيقات المُسنَدة
    vulnerabilities: "Vulnerabilities",// الثغرات
    totalRequests: "Total Requests",   // إجمالي الطلبات
    totalUsers: "Total Users",         // إجمالي المستخدمين

    // ── الرسوم البيانية ──
    auditStatusChart: "Audit Status Distribution",  // رسم بياني: توزيع حالات التدقيق
    auditsPerPentester: "Audits per Pentester",     // رسم بياني: تدقيقات كل مختبر

    // ── جدول التدقيقات وتعيينها ──
    auditAssignment: "Audit Assignment",   // عنوان قسم تعيين التدقيقات
    auditTitle: "Audit Title",             // عمود عنوان التدقيق
    client: "Client",                      // عمود العميل
    status: "Status",                      // عمود الحالة
    assignTo: "Assign To",                 // عمود التعيين
    selectPentester: "Select pentester…",  // نص مؤقت لاختيار المختبر
    assign: "Assign",                      // زر التعيين
    assigning: "Assigning…",              // نص أثناء التعيين
    noAudits: "No audits yet.",           // رسالة لا توجد تدقيقات
    noAuditRequests: "No pentest requests yet. Click 'Request Pentest' to get started.", // رسالة لا توجد طلبات
    refresh: "Refresh",                    // زر التحديث

    // ── الثغرات الأمنية ──
    submitVulnerability: "Submit Finding",              // زر إضافة ثغرة
    newVulnerability: "New Vulnerability",              // عنوان نموذج ثغرة جديدة
    severityBreakdown: "Severity Breakdown",            // رسم بياني: توزيع مستويات الخطورة
    vulnsFound: "Vulnerabilities Found",                // عدد الثغرات المكتشفة
    noVulns: "No vulnerabilities submitted yet.",       // رسالة لا توجد ثغرات
    selectAuditPrompt: "Select an audit from the sidebar to begin working.", // رسالة اختيار تدقيق
    total: "total",                                     // كلمة "الإجمالي"

    // ── نموذج طلب تدقيق جديد (العميل) ──
    requestNewAudit: "Request a New Pentest",           // عنوان النموذج
    titleField: "Title",                                // تسمية حقل العنوان
    descField: "Description",                           // تسمية حقل الوصف
    severityField: "Severity",                          // تسمية حقل مستوى الخطورة
    cvssField: "CVSS Score (0–10)",                     // تسمية حقل نقاط CVSS
    scopeField: "Scope / Targets",                      // تسمية حقل النطاق
    submitRequest: "Submit Request",                    // زر إرسال الطلب
    submitting: "Submitting…",                          // نص أثناء الإرسال
    cancel: "Cancel",                                   // زر الإلغاء
    successRequest: "Pentest request submitted successfully!", // رسالة نجاح

    // ── رسوم بيانية وجداول إضافية ──
    auditRequestsChart: "Pentest Requests Over Time",   // رسم بياني: الطلبات عبر الزمن
    myAuditRequests: "My Pentest Requests",             // عنوان قائمة طلباتي
    assignedTo: "Assigned to",                          // مُسنَد إلى
    scope: "Scope",                                     // النطاق
    welcomeAdmin: "Welcome back,",                      // رسالة ترحيب المدير

    // ── قائمة المختبرين (المدير) ──
    pentesterList: "Pentester Directory",                // عنوان دليل المختبرين
    noPentesters: "No pentesters registered yet.",      // رسالة لا يوجد مختبرون

    // ── نصوص مؤقتة للحقول ──
    auditTitlePlaceholder: "e.g. E-commerce Platform Pentest",                      // مثال لعنوان التدقيق
    descPlaceholder: "Describe what you need tested and any relevant context…",     // مثال للوصف
    scopePlaceholder: "e.g. https://app.example.com, 192.168.1.0/24",              // مثال للنطاق
    vulnTitlePlaceholder: "e.g. SQL Injection in login form",                       // مثال لعنوان الثغرة
    vulnDescPlaceholder: "Describe the vulnerability, steps to reproduce, impact…", // مثال لوصف الثغرة
    cvssPlaceholder: "e.g. 9.8",                                                    // مثال لنقاط CVSS

    // ── أقسام إضافية ──
    recentAudits: "Recent Pending Audits",              // أحدث التدقيقات المعلقة
    navigation: "Navigation",                           // عنوان قسم التنقل
    allUsers: "All Users",                              // جميع المستخدمين
    noUsers: "No users registered yet.",                // لا يوجد مستخدمون

    // ── أعمدة جدول المستخدمين ──
    userName: "Name",                                   // عمود الاسم
    userEmail: "Email",                                 // عمود البريد
    userRole: "Role",                                   // عمود الدور
    userSince: "Member Since",                          // عمود تاريخ الانضمام

    // ── التقارير ──
    downloadReport: "Download Report",                  // زر تحميل التقرير
    generateReport: "Generate Report",                  // زر إنشاء التقرير
    reportReady: "Report ready for download",           // رسالة جاهزية التقرير
    noReports: "No completed audits with reports yet.", // رسالة لا توجد تقارير

    // ── تتبع الحالة ──
    trackStatus: "Track Status",                        // تتبع حالة التدقيق
    projectDetails: "Project Details",                  // تفاصيل المشروع
    requestedOn: "Requested on",                        // تاريخ الطلب
    updateStatus: "Update Status",                      // تحديث الحالة
    markFixed: "Mark as Fixed",                         // وضع علامة "محلول"
    markVerified: "Mark as Verified",                   // وضع علامة "محقَّق"
    vulnStatus: "Vulnerability Status",                 // حالة الثغرة
    affectedAssets: "Affected Assets",                  // الأصول المتأثرة

    // ── المختبر: إدارة التدقيقات ──
    markCompleted: "Mark as Completed",                 // وضع علامة "مكتمل"
    submitScanResult: "Add Scan Result",                // إضافة نتيجة فحص
    scanType: "Scan Type",                              // نوع الفحص
    findings: "Findings",                               // النتائج
    scanTypePlaceholder: "e.g. Nmap, Burp Suite, OWASP ZAP",         // مثال لنوع الفحص
    findingsPlaceholder: "Describe what was found during this scan…", // مثال للنتائج
    noScanResults: "No scan results yet.",              // لا توجد نتائج فحص
    myScanResults: "Scan Results",                      // عنوان قسم نتائج الفحص

    // ── الأدلة (Evidence) ──
    evidence: "Evidence",                               // تسمية حقل الأدلة
    evidencePlaceholder: "Add evidence URL or description…", // نص مؤقت
    addEvidence: "Add Evidence",                        // زر إضافة دليل
  },

  // ===== حالات التدقيق والثغرات =====
  // تُستخدم لعرض شارات الحالة في الجداول
  status: {
    pending: "Pending",         // قيد الانتظار
    assigned: "Assigned",       // تم التعيين
    in_progress: "In Progress", // قيد التنفيذ
    completed: "Completed",     // مكتمل
    open: "Open",               // مفتوح (ثغرة)
    verified: "Verified",       // تم التحقق (ثغرة)
    fixed: "Fixed",             // تم الإصلاح (ثغرة)
  },

  // ===== مستويات خطورة الثغرات =====
  // تُستخدم في نماذج إضافة الثغرات والرسوم البيانية
  severity: {
    critical: "Critical",  // حرج - أعلى مستوى خطورة
    high: "High",          // عالي
    medium: "Medium",      // متوسط
    low: "Low",            // منخفض
    info: "Info",          // معلوماتي - أقل مستوى
  },

  // ===== نصوص مشتركة عامة =====
  // تُستخدم في أماكن متعددة في التطبيق
  common: {
    loading: "Loading…",       // نص التحميل
    signOut: "Sign Out",       // تسجيل الخروج
    cancel: "Cancel",          // إلغاء
    all: "All",                // الكل (فلتر)
    delete: "Delete",          // حذف
    confirmDelete: "Sure?",    // تأكيد الحذف
  },
};
