import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Zap, Star, Check, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLang } from "../contexts/LanguageContext";
import { createCheckout } from "../services/chargilyService";

const PLANS = [
  {
    id: "starter",
    ar: { name: "المبتدئ", period: "سنوياً", popular: "", subscribe: "اشترك الآن" },
    en: { name: "Starter",  period: "/ year",  popular: "", subscribe: "Subscribe Now" },
    price: "45,000",
    icon: Shield,
    color: "from-blue-500 to-cyan-500",
    border: "border-blue-500/30",
    features: {
      ar: ["فحص أمني أساسي", "تقرير مبسط باللغتين", "دعم عبر البريد", "تغطية OWASP Top 5"],
      en: ["Basic security scan", "Bilingual simplified report", "Email support", "OWASP Top 5 coverage"],
    },
  },
  {
    id: "growth",
    ar: { name: "النمو",    period: "سنوياً", popular: "الأكثر طلباً", subscribe: "اشترك الآن" },
    en: { name: "Growth",   period: "/ year",  popular: "Most Popular",   subscribe: "Subscribe Now" },
    price: "120,000",
    icon: Zap,
    color: "from-purple-500 to-pink-500",
    border: "border-purple-500/30",
    popular: true,
    features: {
      ar: ["تدقيق OWASP Top 10 كامل", "تقرير تفصيلي احترافي", "دعم على مدار الساعة", "فحص البنية التحتية", "توصيات إصلاح مفصّلة"],
      en: ["Full OWASP Top 10 audit", "Detailed professional report", "24/7 support", "Infrastructure scanning", "Detailed remediation recommendations"],
    },
  },
  {
    id: "enterprise",
    ar: { name: "المؤسسي",  period: "سنوياً", popular: "", subscribe: "اشترك الآن" },
    en: { name: "Enterprise", period: "/ year", popular: "", subscribe: "Subscribe Now" },
    price: "400,000",
    icon: Star,
    color: "from-amber-500 to-orange-500",
    border: "border-amber-500/30",
    features: {
      ar: ["اختبار اختراق شامل", "فريق Red Team مخصص", "تدريب الموظفين", "متابعة على مدى السنة", "تقارير تنفيذية وتقنية", "دعم VIP فوري"],
      en: ["Full penetration testing", "Dedicated Red Team", "Staff training", "Year-round monitoring", "Executive & technical reports", "Instant VIP support"],
    },
  },
];

const UI = {
  ar: {
    badge:    "اختر الخطة المناسبة لمؤسستك",
    title:    "خطط",
    subtitle: "حماية سيبرانية احترافية للمؤسسات الصغيرة والمتوسطة — مدفوع بأمان عبر Chargily Pay",
    currency: "دج",
    error:    "حدث خطأ أثناء إنشاء جلسة الدفع. حاول مجدداً.",
    footer:   "الدفع مؤمَّن عبر",
    support:  "يدعم CIB و Edahabia",
    contact:  "للاستفسارات:",
  },
  en: {
    badge:    "Choose the right plan for your organization",
    title:    "Plans",
    subtitle: "Professional cybersecurity for SMEs — secured payments via Chargily Pay",
    currency: "DZD",
    error:    "An error occurred while creating the checkout session. Please try again.",
    footer:   "Payments secured by",
    support:  "Supports CIB & Edahabia",
    contact:  "Contact:",
  },
};

export default function PricingPage() {
  const { currentUser } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  const ui = UI[lang];
  const isRTL = lang === "ar";

  const handleSubscribe = async (planId) => {
    if (!currentUser) { navigate("/signin"); return; }
    setLoading(planId);
    setError("");
    try {
      const checkoutUrl = await createCheckout({ plan: planId, userId: currentUser.uid, locale: lang });
      window.location.href = checkoutUrl;
    } catch (e) {
      console.error(e);
      setError(ui.error);
      setLoading(null);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-950 via-[#0a0f1e] to-gray-950 text-white py-16 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-cyan-400 text-sm mb-5">
          <Shield size={14} />
          {ui.badge}
        </div>
        <h1 className="text-4xl font-bold mb-3">
          {isRTL ? (
            <>{ui.title}{" "}<span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">SecOps</span></>
          ) : (
            <><span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">SecOps</span>{" "}{ui.title}</>
          )}
        </h1>
        <p className="text-gray-400 text-base max-w-lg mx-auto">{ui.subtitle}</p>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const t = plan[lang];
          const feats = plan.features[lang];
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border ${plan.border} bg-white/5 backdrop-blur p-7 flex flex-col transition-transform hover:-translate-y-1 ${
                plan.popular ? "ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/10" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  {t.popular}
                </div>
              )}

              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                <Icon size={20} className="text-white" />
              </div>

              <div className="mb-1 text-lg font-bold">{t.name}</div>

              <div className="mb-6 mt-2">
                <span className="text-3xl font-extrabold">{plan.price}</span>
                <span className="text-gray-400 text-sm mx-1">{ui.currency} {t.period}</span>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {feats.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check size={14} className="text-green-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all bg-gradient-to-r ${plan.color} hover:opacity-90 disabled:opacity-50`}
              >
                {loading === plan.id ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    {t.subscribe}
                    <ArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {error && <p className="text-center text-red-400 mt-6 text-sm">{error}</p>}

      <div className="text-center text-gray-500 text-xs mt-10 space-y-1">
        <p>
          {ui.footer}{" "}
          <span className="text-purple-400 font-semibold">Chargily Pay</span>
          {" — "}{ui.support}
        </p>
        <p>
          {ui.contact}{" "}
          <a href="mailto:gabiselt777@gmail.com" className="text-cyan-400 hover:underline">
            gabiselt777@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
