// ============================================
// ملف إعدادات Firebase - الخدمات السحابية
// ============================================
// Firebase هي منصة من Google توفر خدمات خلفية (Backend) جاهزة
// نستخدم منها:
// 1. Authentication (المصادقة) - لتسجيل الدخول والتسجيل
// 2. Firestore (قاعدة البيانات) - لتخزين البيانات
// 3. Analytics (التحليلات) - لتتبع استخدام التطبيق

// استيراد الدوال الأساسية من Firebase
import { initializeApp } from "firebase/app";        // لتهيئة تطبيق Firebase
import { getAnalytics } from "firebase/analytics";    // لتفعيل التحليلات
import { getAuth } from "firebase/auth";              // لخدمة المصادقة (تسجيل الدخول)
import { getFirestore } from "firebase/firestore";    // لقاعدة البيانات Firestore

// إعدادات الاتصال بمشروع Firebase الخاص بالتطبيق
// هذه المفاتيح تربط تطبيقنا بمشروع Firebase المحدد
const firebaseConfig = {
  apiKey: "AIzaSyBvQia9fpyIiiwDKB3vjjcrcJmF1m0PpMQ",          // مفتاح API
  authDomain: "sec-ops-5dcf1.firebaseapp.com",                  // نطاق المصادقة
  projectId: "sec-ops-5dcf1",                                    // معرف المشروع
  storageBucket: "sec-ops-5dcf1.firebasestorage.app",           // مخزن الملفات
  messagingSenderId: "814658252902",                              // معرف المراسلة
  appId: "1:814658252902:web:b5e86b44c1492686d7bda7",           // معرف التطبيق
  measurementId: "G-TJEWXNQHST"                                  // معرف التحليلات
};

// تهيئة تطبيق Firebase باستخدام الإعدادات أعلاه
const app = initializeApp(firebaseConfig);
// تفعيل خدمة التحليلات
getAnalytics(app);
// إنشاء وتصدير كائن المصادقة (auth) لاستخدامه في باقي التطبيق
export const auth = getAuth(app);
// إنشاء وتصدير كائن قاعدة البيانات (db) لاستخدامه في باقي التطبيق
export const db = getFirestore(app);

// تصدير تطبيق Firebase كتصدير افتراضي
export default app;
