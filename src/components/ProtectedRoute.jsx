// ============================================
// مكون المسار المحمي (Protected Route)
// ============================================
// هذا المكون يحمي الصفحات الخاصة من الوصول غير المصرح
// يتحقق من:
// 1. هل المستخدم مسجل دخوله؟ إذا لا ← يحوله لصفحة تسجيل الدخول
// 2. هل لديه الدور المطلوب؟ إذا لا ← يحوله للوحة تحكمه الصحيحة
//
// مثال الاستخدام:
// <ProtectedRoute allowedRole="admin">
//   <AdminDashboard />    ← هذه الصفحة لن تظهر إلا للمدير
// </ProtectedRoute>

import React from "react";
// Navigate: مكون لإعادة التوجيه التلقائي لصفحة أخرى
import { Navigate } from "react-router-dom";
// استيراد hook المصادقة للوصول لبيانات المستخدم الحالي
import { useAuth } from "../contexts/AuthContext";

// ===== خريطة الأدوار والمسارات =====
// تربط كل دور بمسار لوحة التحكم الخاصة به
const ROLE_PATHS = {
  admin: "/admin-dashboard",        // المدير ← لوحة تحكم المدير
  pentester: "/pentester-dashboard", // مختبر الاختراق ← لوحة تحكم المختبر
  client: "/client-dashboard",      // العميل ← لوحة تحكم العميل
};

// ============ مكون المسار المحمي ============
// children = المحتوى الذي سيظهر إذا كان المستخدم مصرحاً
// allowedRole = الدور المطلوب للوصول لهذا المسار
const ProtectedRoute = ({ children, allowedRole }) => {
  // جلب بيانات المستخدم الحالي ودوره
  const { currentUser, userRole } = useAuth();

  // ===== التحقق 1: هل المستخدم مسجل دخوله؟ =====
  if (!currentUser) {
    // غير مسجل ← تحويله لصفحة تسجيل الدخول
    // replace: يستبدل الصفحة الحالية في التاريخ (لا يمكنه الرجوع بزر Back)
    return <Navigate to="/signin" replace />;
  }

  // ===== التحقق 2: هل لديه الدور الصحيح؟ =====
  if (allowedRole && userRole !== allowedRole) {
    // الدور غير مطابق ← تحويله للوحة تحكمه الصحيحة
    // مثال: عميل يحاول الوصول للوحة المدير ← يذهب للوحة العميل
    return <Navigate to={ROLE_PATHS[userRole] || "/"} replace />;
  }

  // ===== كل شيء صحيح ← عرض المحتوى =====
  return children;
};

// تصدير المكون
export default ProtectedRoute;
