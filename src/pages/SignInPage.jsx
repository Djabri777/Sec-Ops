import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Shield, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLang } from "../contexts/LanguageContext";

const ROLE_PATHS = { admin: "/admin-dashboard", pentester: "/pentester-dashboard", client: "/client-dashboard" };

const SignInPage = () => {
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const { isDark } = useTheme();
  const { t } = useLang();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(false);

  // Once AuthContext resolves the role after sign-in, navigate to the correct dashboard
  useEffect(() => {
    if (pendingRedirect && currentUser && userRole) {
      navigate(ROLE_PATHS[userRole] || "/", { replace: true });
    }
  }, [pendingRedirect, currentUser, userRole]);

  const text    = isDark ? "text-zinc-100" : "text-slate-900";
  const muted   = isDark ? "text-zinc-400" : "text-slate-500";
  const label   = isDark ? "text-zinc-300" : "text-slate-700";
  const cardBg  = isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-xl";
  const inputBg = isDark
    ? "bg-white/5 border-white/10 text-zinc-100 placeholder-zinc-500 focus:border-blue-400"
    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500";

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      // Let AuthContext resolve the role, then the useEffect above will navigate
      setPendingRedirect(true);
    } catch (err) {
      setError(getErrorMsg(err.code, t));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Shield className="w-10 h-10 text-blue-400" strokeWidth={2} />
            <span className={`text-2xl font-bold ${text}`}>SecOps</span>
          </Link>
        </div>

        <div className={`p-8 rounded-2xl backdrop-blur-sm border ${cardBg}`}>
          <div className="mb-8">
            <h1 className={`text-3xl font-bold ${text} mb-2`}>{t("auth.welcomeBack")}</h1>
            <p className={muted}>{t("auth.signInSubtitle")}</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${label} mb-2`}>{t("auth.email")}</label>
              <div className="relative">
                <Mail className={`absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-zinc-500" : "text-slate-400"}`} />
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                  className={`w-full ps-11 pe-4 py-3 rounded-xl border ${inputBg} focus:outline-none transition-colors`}
                  placeholder={t("auth.emailPlaceholder")} />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${label} mb-2`}>{t("auth.password")}</label>
              <div className="relative">
                <Lock className={`absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-zinc-500" : "text-slate-400"}`} />
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required
                  className={`w-full ps-11 pe-4 py-3 rounded-xl border ${inputBg} focus:outline-none transition-colors`}
                  placeholder={t("auth.passwordPlaceholder")} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-blue-500" />
                <label htmlFor="remember" className={`ms-2 text-sm ${muted}`}>{t("auth.rememberMe")}</label>
              </div>
              <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">{t("auth.forgotPassword")}</Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full px-8 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 text-white">
              <span>{loading ? t("auth.signingIn") : t("auth.signIn")}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className={muted}>
              {t("auth.noAccount")}{" "}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">{t("auth.signUp")}</Link>
            </p>
          </div>
        </div>

        <div className={`mt-6 text-center text-sm ${muted}`}>
          <Lock className="w-4 h-4 inline-block me-1" /> {t("auth.encrypted")}
        </div>
      </motion.div>
    </div>
  );
};

const getErrorMsg = (code, t) => {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential": return t("auth.errors.invalidCredentials");
    case "auth/too-many-requests":  return t("auth.errors.tooManyRequests");
    case "auth/user-disabled":      return t("auth.errors.userDisabled");
    default:                        return t("auth.errors.signInFailed");
  }
};

export default SignInPage;
