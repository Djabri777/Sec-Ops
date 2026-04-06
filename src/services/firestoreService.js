// ============================================
// خدمة Firestore - عمليات قاعدة البيانات
// ============================================
// هذا الملف يحتوي على جميع دوال التعامل مع قاعدة البيانات Firestore
// Firestore = قاعدة بيانات NoSQL من Firebase تخزن البيانات في مجموعات (collections) ومستندات (documents)
//
// هيكل قاعدة البيانات:
// ├── users/                    ← مجموعة المستخدمين
// │   └── {uid}/                ← مستند لكل مستخدم (المعرف = uid)
// ├── audits/                   ← مجموعة عمليات التدقيق الأمني
// │   └── {auditId}/            ← مستند لكل عملية تدقيق
// │       ├── vulnerabilities/  ← مجموعة فرعية: الثغرات المكتشفة
// │       └── scanResults/      ← مجموعة فرعية: نتائج الفحص

// ============ استيراد دوال Firestore ============
import {
  doc,              // إنشاء مرجع لمستند محدد
  getDoc,           // جلب مستند واحد
  setDoc,           // إنشاء أو استبدال مستند
  deleteDoc,        // حذف مستند
  collection,       // إنشاء مرجع لمجموعة
  addDoc,           // إضافة مستند جديد (بمعرف تلقائي)
  updateDoc,        // تحديث حقول محددة في مستند
  query,            // إنشاء استعلام مع شروط
  where,            // شرط التصفية (مثل: where("role", "==", "admin"))
  getDocs,          // جلب جميع مستندات استعلام
  orderBy,          // ترتيب النتائج (تصاعدي أو تنازلي)
  serverTimestamp,  // طابع زمني من الخادم (أدق من وقت العميل)
} from "firebase/firestore";

// استيراد مرجع قاعدة البيانات
import { db } from "../firebase";

// ═══════════════════════════════════════════════
// ██ المستخدمون (Users)
// ═══════════════════════════════════════════════

// ===== إنشاء مستند مستخدم جديد =====
// يُستدعى بعد تسجيل حساب جديد في Firebase Auth
// uid: المعرف الفريد للمستخدم من Firebase
// data: بيانات المستخدم (الاسم، البريد، الهاتف، الدور، نوع الخدمة)
export const createUserDocument = async (uid, data) => {
  await setDoc(doc(db, "users", uid), {
    uid,                                      // المعرف الفريد
    name: data.name,                          // اسم المستخدم
    email: data.email,                        // البريد الإلكتروني
    phone: data.phone || "",                  // رقم الهاتف (اختياري)
    role: data.role || "client",              // الدور: admin, pentester, أو client (الافتراضي)
    serviceType: data.serviceType || "starter", // نوع الخدمة: starter, professional, أو enterprise
    createdAt: serverTimestamp(),              // تاريخ إنشاء الحساب
  });
};

// ===== جلب بيانات مستخدم واحد =====
// تأخذ uid المستخدم وترجع بياناته من قاعدة البيانات
// ترجع null إذا لم يُوجد المستخدم
export const getUserDocument = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

// ===== جلب جميع مختبري الاختراق =====
// تبحث في مجموعة users عن المستخدمين الذين دورهم "pentester"
export const getAllPentesters = async () => {
  const q = query(collection(db, "users"), where("role", "==", "pentester"));
  const snap = await getDocs(q);
  // تحويل النتائج إلى مصفوفة من كائنات البيانات
  return snap.docs.map((d) => d.data());
};

// ===== جلب جميع المستخدمين =====
// تجلب كل المستخدمين مع إضافة uid لكل واحد
export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
};

// ═══════════════════════════════════════════════
// ██ عمليات التدقيق الأمني (Audits)
// ═══════════════════════════════════════════════

// ===== طلب تدقيق أمني جديد =====
// يُستدعى عندما يطلب العميل فحص أمني لنظامه
// clientId: معرف العميل
// clientName: اسم العميل
// formData: بيانات النموذج (العنوان، الوصف، النطاق)
export const requestAudit = async (clientId, clientName, formData) => {
  return addDoc(collection(db, "audits"), {
    clientId,                    // معرف العميل الذي طلب التدقيق
    clientName,                  // اسم العميل
    title: formData.title,       // عنوان التدقيق (مثل: "فحص أمني لموقع الشركة")
    description: formData.description, // وصف تفصيلي
    scope: formData.scope,       // نطاق الفحص (ما الذي سيتم فحصه)
    status: "pending",           // الحالة الابتدائية: "معلق" (في انتظار التعيين)
    pentesterId: null,           // لم يُعيَّن مختبر بعد
    pentesterName: null,
    requestedAt: serverTimestamp(), // تاريخ الطلب
    assignedAt: null,            // لم يُعيَّن بعد
    completedAt: null,           // لم يكتمل بعد
  });
};

// ===== جلب جميع عمليات التدقيق =====
// تجلب كل التدقيقات وترتبها بالأحدث أولاً
export const getAllAudits = async () => {
  const snap = await getDocs(collection(db, "audits"));
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  // ترتيب حسب تاريخ الطلب (الأحدث أولاً)
  return docs.sort((a, b) => {
    const ta = a.requestedAt?.toDate?.() ?? new Date(0); // تحويل لتاريخ JavaScript
    const tb = b.requestedAt?.toDate?.() ?? new Date(0);
    return tb - ta; // ترتيب تنازلي
  });
};

// ===== جلب تدقيقات عميل محدد =====
// تجلب فقط التدقيقات التي طلبها عميل معين
export const getClientAudits = async (clientId) => {
  const q = query(
    collection(db, "audits"),
    where("clientId", "==", clientId) // شرط: clientId يساوي معرف العميل
  );
  const snap = await getDocs(q);
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  // ترتيب حسب تاريخ الطلب (الأحدث أولاً)
  return docs.sort((a, b) => {
    const ta = a.requestedAt?.toDate?.() ?? new Date(0);
    const tb = b.requestedAt?.toDate?.() ?? new Date(0);
    return tb - ta;
  });
};

// ===== جلب تدقيقات مختبر اختراق محدد =====
// تجلب التدقيقات المُعينة لمختبر اختراق معين
export const getPentesterAudits = async (pentesterId) => {
  const q = query(
    collection(db, "audits"),
    where("pentesterId", "==", pentesterId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ===== تعيين مختبر اختراق لتدقيق =====
// المدير يعيّن مختبر اختراق لتنفيذ تدقيق معين
export const assignAudit = async (auditId, pentesterId, pentesterName) => {
  await updateDoc(doc(db, "audits", auditId), {
    pentesterId,                   // معرف المختبر المُعيَّن
    pentesterName,                 // اسم المختبر
    status: "assigned",            // تغيير الحالة إلى "مُعيَّن"
    assignedAt: serverTimestamp(), // تاريخ التعيين
  });
};

// ===== تحديث حالة تدقيق =====
// تغيير حالة التدقيق (مثل: من "assigned" إلى "in_progress")
export const updateAuditStatus = async (auditId, status) => {
  await updateDoc(doc(db, "audits", auditId), { status });
};

// ===== تعليم تدقيق كمكتمل =====
// تغيير الحالة إلى "completed" مع تسجيل تاريخ الإكمال
export const markAuditCompleted = async (auditId) => {
  await updateDoc(doc(db, "audits", auditId), {
    status: "completed",
    completedAt: serverTimestamp(),
  });
};

// ===== حذف تدقيق =====
// حذف مستند التدقيق نهائياً من قاعدة البيانات
export const deleteAudit = async (auditId) => {
  await deleteDoc(doc(db, "audits", auditId));
};

// ═══════════════════════════════════════════════
// ██ الثغرات الأمنية (Vulnerabilities) - مجموعة فرعية
// ═══════════════════════════════════════════════
// الثغرات تُخزن كمجموعة فرعية داخل كل تدقيق
// المسار: audits/{auditId}/vulnerabilities/{vulnId}

// ===== إرسال ثغرة أمنية مكتشفة =====
// المختبر يسجل ثغرة وجدها أثناء الفحص
export const submitVulnerability = async (auditId, pentesterId, formData) => {
  return addDoc(collection(db, "audits", auditId, "vulnerabilities"), {
    title: formData.title,                        // عنوان الثغرة (مثل: "SQL Injection")
    description: formData.description,             // وصف تفصيلي للثغرة
    severity: formData.severity,                   // الخطورة: critical, high, medium, low
    cvssScore: parseFloat(formData.cvssScore) || 0, // درجة CVSS (نظام تقييم الثغرات 0-10)
    affectedAssets: formData.affectedAssets || "",  // الأصول المتأثرة (مثل: خادم الويب)
    evidence: formData.evidence || "",             // الأدلة والإثباتات
    status: "open",                                // الحالة: مفتوحة (لم تُعالج بعد)
    pentesterId,                                   // من اكتشف الثغرة
    discoveredAt: serverTimestamp(),               // تاريخ الاكتشاف
  });
};

// ===== جلب ثغرات تدقيق محدد =====
// تجلب جميع الثغرات المكتشفة في تدقيق معين، مرتبة بالأحدث أولاً
export const getVulnerabilities = async (auditId) => {
  const q = query(
    collection(db, "audits", auditId, "vulnerabilities"),
    orderBy("discoveredAt", "desc") // ترتيب تنازلي حسب تاريخ الاكتشاف
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ===== تحديث حالة ثغرة =====
// تغيير حالة الثغرة (مثل: من "open" إلى "fixed" أو "accepted")
export const updateVulnerabilityStatus = async (auditId, vulnId, status) => {
  await updateDoc(doc(db, "audits", auditId, "vulnerabilities", vulnId), { status });
};

// ═══════════════════════════════════════════════
// ██ نتائج الفحص (Scan Results) - مجموعة فرعية
// ═══════════════════════════════════════════════
// نتائج الفحص الآلي تُخزن كمجموعة فرعية داخل كل تدقيق
// المسار: audits/{auditId}/scanResults/{resultId}

// ===== إرسال نتيجة فحص =====
// المختبر يسجل نتائج أداة فحص آلية
export const submitScanResult = async (auditId, pentesterId, formData) => {
  return addDoc(collection(db, "audits", auditId, "scanResults"), {
    scanType: formData.scanType,     // نوع الفحص (مثل: "Network Scan", "Web App Scan")
    findings: formData.findings,     // النتائج والاكتشافات
    pentesterId,                     // من أجرى الفحص
    timestamp: serverTimestamp(),    // تاريخ الفحص
  });
};

// ===== جلب نتائج فحص تدقيق محدد =====
// تجلب جميع نتائج الفحص لتدقيق معين، مرتبة بالأحدث أولاً
export const getScanResults = async (auditId) => {
  const q = query(
    collection(db, "audits", auditId, "scanResults"),
    orderBy("timestamp", "desc") // ترتيب تنازلي حسب التاريخ
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
