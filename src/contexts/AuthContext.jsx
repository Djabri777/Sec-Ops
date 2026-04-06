// ============================================
// سياق المصادقة (Authentication Context)
// ============================================
// هذا الملف مسؤول عن إدارة حالة تسجيل الدخول في التطبيق
// يوفر معلومات المستخدم الحالي (اسمه، دوره، بياناته) لجميع المكونات
//
// Context في React = طريقة لمشاركة البيانات بين المكونات بدون تمريرها عبر props
// بدلاً من تمرير البيانات من مكون لمكون، نضعها في "سياق" يستطيع أي مكون الوصول إليه

// استيراد الأدوات اللازمة من React
import React, { createContext, useContext, useEffect, useState } from "react";
// استيراد دوال المصادقة من Firebase
import { onAuthStateChanged, signOut } from "firebase/auth";
// استيراد كائن المصادقة من إعدادات Firebase
import { auth } from "../firebase";
// استيراد دوال جلب وإنشاء بيانات المستخدم من قاعدة البيانات
import { getUserDocument, createUserDocument } from "../services/firestoreService";

// إنشاء السياق - هذا هو "الصندوق" الذي سيحتوي على بيانات المصادقة
const AuthContext = createContext(null);

// ============ مكون موفر المصادقة (AuthProvider) ============
// هذا المكون يغلف التطبيق ويوفر بيانات المستخدم لجميع المكونات الأبناء
export const AuthProvider = ({ children }) => {
  // ===== متغيرات الحالة (State) =====
  const [currentUser, setCurrentUser] = useState(null);     // كائن المستخدم من Firebase (يحتوي على البريد والمعرف)
  const [userRole, setUserRole] = useState(null);            // دور المستخدم: "admin" أو "pentester" أو "client"
  const [userProfile, setUserProfile] = useState(null);      // بيانات المستخدم الكاملة من قاعدة البيانات
  const [loading, setLoading] = useState(true);              // هل التطبيق لا يزال يتحقق من حالة تسجيل الدخول؟

  // ===== مراقبة حالة تسجيل الدخول =====
  // useEffect ينفذ الكود عند تحميل المكون لأول مرة
  useEffect(() => {
    // onAuthStateChanged: مراقب من Firebase يُنبهنا عند تغير حالة المستخدم
    // (تسجيل دخول، تسجيل خروج، تحديث الصفحة)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // المستخدم مسجل دخوله ← جلب بياناته من قاعدة البيانات
        let profile = await getUserDocument(user.uid);

        // إذا لم يكن لديه مستند في Firestore، إنشاء واحد افتراضي
        if (!profile) {
          const defaultData = {
            name: user.displayName || user.email?.split('@')[0] || "User",
            email: user.email,
            phone: "",
            role: "client",  // الدور الافتراضي
            serviceType: "starter"
          };
          await createUserDocument(user.uid, defaultData);
          profile = await getUserDocument(user.uid);
        }

        setCurrentUser(user);                    // حفظ كائن المستخدم
        setUserProfile(profile);                 // حفظ بيانات الملف الشخصي
        setUserRole(profile?.role || "client");   // حفظ الدور (admin/pentester/client)
      } else {
        // المستخدم غير مسجل ← مسح جميع البيانات
        setCurrentUser(null);
        setUserProfile(null);
        setUserRole(null);
      }
      // انتهى التحقق ← إخفاء شاشة التحميل
      setLoading(false);
    });

    // إلغاء الاشتراك في المراقب عند إزالة المكون (تنظيف الذاكرة)
    return unsubscribe;
  }, []); // [] = ينفذ مرة واحدة فقط عند التحميل

  // ===== دالة تسجيل الخروج =====
  const logout = () => signOut(auth);

  // ===== توفير البيانات لجميع المكونات الأبناء =====
  return (
    <AuthContext.Provider value={{ currentUser, userRole, userProfile, loading, logout }}>
      {/* لا نعرض المحتوى إلا بعد انتهاء التحقق من حالة المصادقة */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ===== Hook مخصص للوصول إلى بيانات المصادقة =====
// بدلاً من كتابة useContext(AuthContext) في كل مكون
// نستخدم useAuth() وهي أبسط وأوضح
export const useAuth = () => useContext(AuthContext);
