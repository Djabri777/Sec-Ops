import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, ClipboardList, PlusCircle, LogOut, RefreshCw,
  UserCheck, CheckCircle, Clock, AlertTriangle, X, Moon, Sun, Languages,
  Download, FileText,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLang } from "../contexts/LanguageContext";
import { requestAudit, getClientAudits } from "../services/firestoreService";

const STATUS_BADGE = {
  pending:     "bg-yellow-400/15 text-yellow-400 border-yellow-400/30",
  assigned:    "bg-blue-400/15 text-blue-400 border-blue-400/30",
  in_progress: "bg-purple-400/15 text-purple-400 border-purple-400/30",
  completed:   "bg-green-400/15 text-green-400 border-green-400/30",
};

const STATUS_ICONS = { pending: Clock, assigned: UserCheck, in_progress: AlertTriangle, completed: CheckCircle };

const EMPTY_FORM = { title: "", description: "", scope: "" };

const ClientDashboard = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t, toggleLang } = useLang();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("my-audits");
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [success, setSuccess] = useState("");

  // Vision UI design tokens
  const bg        = isDark ? "bg-[#060b17]"   : "bg-slate-100";
  const sidebarBg = isDark ? "bg-[#080f23]"   : "bg-white";
  const cardBg    = isDark ? "bg-white/[0.04] backdrop-blur-xl border-white/[0.08]" : "bg-white border-slate-200 shadow-sm";
  const headerBg  = isDark ? "bg-[#060b17]/80 backdrop-blur-xl border-white/[0.06]" : "bg-white/90 border-slate-200";
  const text      = isDark ? "text-white"      : "text-slate-900";
  const muted     = isDark ? "text-white/50"   : "text-slate-500";
  const inputBg   = isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-slate-100 border-slate-300 text-slate-800 placeholder-slate-400";
  const rowHover  = isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50";
  const divider   = isDark ? "divide-white/[0.06]" : "divide-slate-100";
  const sideBorder = isDark ? "border-white/[0.06]" : "border-slate-100";
  const tooltipStyle = {
    backgroundColor: isDark ? "#080f23" : "#fff",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
    borderRadius: "8px",
    color: isDark ? "#fff" : "#0f172a",
  };

  const fetchAudits = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const data = await getClientAudits(currentUser.uid);
      setAudits(data);
    } catch (err) {
      setFetchError(err?.message || "Failed to load audits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAudits(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.scope.trim()) { setFormError(`${t("dash.titleField")} & ${t("dash.scopeField")} required.`); return; }
    setFormError("");
    setSubmitting(true);
    try {
      await requestAudit(currentUser.uid, userProfile?.name || "Client", form);
      setSuccess(t("dash.successRequest"));
      setForm(EMPTY_FORM);
      setShowForm(false);
      await fetchAudits();
      setTimeout(() => setSuccess(""), 4000);
    } catch {
      setFormError("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => { await logout(); navigate("/signin"); };

  const handleDownloadReport = (audit) => {
    const report = {
      title: audit.title,
      client: audit.clientName,
      pentester: audit.pentesterName || "N/A",
      scope: audit.scope,
      description: audit.description,
      status: audit.status,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${audit.title.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const monthCounts = audits.reduce((acc, a) => {
    if (!a.requestedAt) return acc;
    const d = a.requestedAt.toDate ? a.requestedAt.toDate() : new Date(a.requestedAt);
    const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(monthCounts).map(([month, count]) => ({ month, count }));

  const stats = [
    { label: t("dash.totalRequests"), value: audits.length,
      icon: ClipboardList, iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",    glow: "shadow-blue-500/30" },
    { label: t("dash.pending"),       value: audits.filter((a) => a.status === "pending").length,
      icon: Clock,         iconBg: "bg-gradient-to-br from-yellow-400 to-orange-500", glow: "shadow-yellow-500/30" },
    { label: t("dash.inProgress"),    value: audits.filter((a) => a.status === "assigned" || a.status === "in_progress").length,
      icon: AlertTriangle, iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",   glow: "shadow-purple-500/30" },
    { label: t("dash.completed"),     value: audits.filter((a) => a.status === "completed").length,
      icon: CheckCircle,   iconBg: "bg-gradient-to-br from-green-400 to-teal-500",    glow: "shadow-green-500/30" },
  ];

  const completedAudits = audits.filter((a) => a.status === "completed");

  const sidebarItems = [
    { key: "my-audits", label: t("dash.myAudits"), icon: ClipboardList },
    { key: "reports",   label: t("dash.reports"),  icon: FileText },
  ];

  return (
    <div className={`min-h-screen flex ${bg} transition-colors duration-300`}>
      {/* Background glow orbs */}
      {isDark && (
        <>
          <div className="fixed top-0 left-64 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
          <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* ─── Sidebar ───────────────────────────────────────────────── */}
      <aside className={`fixed inset-y-0 start-0 w-64 ${sidebarBg} ${isDark ? "border-e border-white/[0.06]" : "border-e border-slate-200"} flex flex-col z-20`}>
        <div className={`px-5 py-5 border-b ${sideBorder}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`font-bold text-sm ${text}`}>SecOps</p>
              <p className={`text-xs ${muted}`}>{t("dash.clientPortal")}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <p className={`px-3 py-2 text-xs font-semibold uppercase tracking-widest ${muted}`}>{t("dash.navigation")}</p>
          {sidebarItems.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === key
                  ? isDark
                    ? "bg-gradient-to-r from-blue-600/25 to-purple-600/15 text-white border border-white/10 shadow-lg"
                    : "bg-blue-50 text-blue-600 border border-blue-100"
                  : `${muted} ${isDark ? "hover:bg-white/5 hover:text-white/80" : "hover:bg-slate-100"}`
              }`}>
              <div className={`p-1.5 rounded-lg transition-all ${
                activeTab === key
                  ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-md shadow-blue-500/30"
                  : isDark ? "bg-white/5" : "bg-slate-100"
              }`}>
                <Icon className={`w-3.5 h-3.5 ${activeTab === key ? "text-white" : ""}`} />
              </div>
              {label}
            </button>
          ))}
          <button onClick={() => setShowForm(true)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${muted} ${isDark ? "hover:bg-white/5 hover:text-white/80" : "hover:bg-slate-100"}`}>
            <div className={`p-1.5 rounded-lg ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
              <PlusCircle className="w-3.5 h-3.5" />
            </div>
            {t("dash.requestAudit")}
          </button>
        </nav>

        <div className={`p-3 border-t ${sideBorder} space-y-2`}>
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${isDark ? "bg-white/[0.03] border border-white/[0.06]" : "bg-slate-50 border border-slate-100"}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 text-white text-sm font-bold shadow-md shadow-blue-500/30">
              {userProfile?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-medium truncate ${text}`}>{userProfile?.name}</p>
              <p className={`text-xs ${muted}`}>{t("auth.roles.client")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-1">
            <button onClick={toggleTheme} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs border transition-all ${isDark ? "border-white/10 text-white/50 hover:text-white hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-100"}`}>
              {isDark ? <><Sun className="w-3.5 h-3.5" /> Light</> : <><Moon className="w-3.5 h-3.5" /> Dark</>}
            </button>
            <button onClick={toggleLang} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs border transition-all ${isDark ? "border-white/10 text-white/50 hover:text-white hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-100"}`}>
              <Languages className="w-3.5 h-3.5" /> {t("nav.toggleLang")}
            </button>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors text-red-400 hover:bg-red-400/10">
            <LogOut className="w-4 h-4" /> {t("common.signOut")}
          </button>
        </div>
      </aside>

      {/* ─── Main content ──────────────────────────────────────────── */}
      <div className="flex-1 ms-64 flex flex-col min-h-screen">
        <header className={`sticky top-0 z-10 ${headerBg} border-b px-8 py-4 flex items-center justify-between`}>
          <div>
            <h1 className={`text-lg font-bold ${text}`}>{t("dash.clientDashboard")}</h1>
            <p className={`text-xs ${muted}`}>{t("dash.welcomeAdmin")} {userProfile?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20">
              <PlusCircle className="w-4 h-4" /> {t("dash.requestAudit")}
            </button>
            <button onClick={fetchAudits} className={`p-2 rounded-lg border transition-all ${isDark ? "border-white/10 text-white/50 hover:text-white hover:border-blue-500/40 hover:bg-blue-500/5" : "border-slate-200 text-slate-500 hover:text-blue-600"}`}>
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 space-y-8">
          {success && (
            <div className="px-5 py-3 rounded-xl bg-green-400/10 border border-green-400/30 text-green-400 text-sm font-medium">
              {success}
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className={`p-5 rounded-2xl border ${cardBg} relative overflow-hidden hover:border-white/15 transition-all`}>
                {isDark && <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />}
                <div className="relative flex items-start justify-between mb-4">
                  <div>
                    <p className={`text-xs font-medium uppercase tracking-wider ${muted} mb-1`}>{s.label}</p>
                    <p className={`text-3xl font-bold ${text}`}>{s.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${s.iconBg} shadow-lg ${s.glow}`}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ─── MY AUDITS TAB ─────────────────────────────────────── */}
          {activeTab === "my-audits" && (
            <>
              {chartData.length > 0 && (
                <div className={`p-6 rounded-2xl border ${cardBg}`}>
                  <h2 className={`text-sm font-semibold ${text} mb-5`}>{t("dash.auditRequestsChart")}</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} />
                      <XAxis dataKey="month" stroke={isDark ? "#ffffff15" : "#94a3b8"} tick={{ fill: isDark ? "#ffffff50" : "#64748b" }} />
                      <YAxis stroke={isDark ? "#ffffff15" : "#94a3b8"} tick={{ fill: isDark ? "#ffffff50" : "#64748b" }} allowDecimals={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 4, strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className={`rounded-2xl border ${cardBg} overflow-hidden`}>
                <div className={`px-6 py-4 border-b ${sideBorder} flex items-center justify-between`}>
                  <h2 className={`font-semibold ${text}`}>{t("dash.myAuditRequests")}</h2>
                  <span className={`text-xs ${muted}`}>{audits.length} {t("dash.total")}</span>
                </div>
                {loading ? (
                  <div className={`p-12 text-center ${muted}`}>{t("common.loading")}</div>
                ) : fetchError ? (
                  <div className="p-12 text-center text-red-400 text-sm">{fetchError}</div>
                ) : audits.length === 0 ? (
                  <div className={`p-16 text-center ${muted}`}>
                    <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>{t("dash.noAuditRequests")}</p>
                  </div>
                ) : (
                  <div className={`divide-y ${divider}`}>
                    {audits.map((audit) => {
                      const Icon = STATUS_ICONS[audit.status] || Clock;
                      return (
                        <div key={audit.id} className={`px-6 py-5 ${rowHover} transition-colors`}>
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex items-start gap-3 min-w-0">
                              <div className={`mt-0.5 p-2 rounded-xl shrink-0 ${STATUS_BADGE[audit.status]?.split(" ").slice(1).join(" ") || ""}`}>
                                <Icon className={`w-4 h-4 ${STATUS_BADGE[audit.status]?.split(" ")[0] || muted}`} />
                              </div>
                              <div className="min-w-0">
                                <p className={`font-semibold ${text}`}>{audit.title}</p>
                                <p className={`text-xs ${muted} mt-0.5 line-clamp-1`}>{audit.description || "—"}</p>
                                <p className={`text-xs ${muted} mt-1`}>
                                  <span className={isDark ? "text-white/70" : "text-slate-700"}>{t("dash.scope")}:</span> {audit.scope}
                                </p>
                              </div>
                            </div>
                            <div className="text-end shrink-0">
                              <span className={`px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${STATUS_BADGE[audit.status] || ""}`}>
                                {t(`status.${audit.status}`) || audit.status?.replace("_", " ")}
                              </span>
                              {audit.pentesterName && (
                                <p className={`text-xs ${muted} mt-1`}>{t("dash.assignedTo")} {audit.pentesterName}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ─── REPORTS TAB ───────────────────────────────────────── */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-bold ${text}`}>{t("dash.reports")}</h2>
                <span className={`text-sm ${muted}`}>{completedAudits.length} {t("dash.total")}</span>
              </div>
              {loading ? (
                <p className={muted}>{t("common.loading")}</p>
              ) : fetchError ? (
                <div className="px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/30 text-red-400 text-sm">{fetchError}</div>
              ) : completedAudits.length === 0 ? (
                <div className={`p-16 rounded-2xl border ${cardBg} text-center ${muted}`}>
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>{t("dash.noReports")}</p>
                </div>
              ) : (
                <div className={`rounded-2xl border ${cardBg} overflow-hidden divide-y ${divider}`}>
                  {completedAudits.map((audit) => (
                    <div key={audit.id} className={`px-6 py-5 ${rowHover} transition-colors flex items-center justify-between gap-4 flex-wrap`}>
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2 rounded-xl bg-green-400/10 shrink-0">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="min-w-0">
                          <p className={`font-semibold ${text}`}>{audit.title}</p>
                          <p className={`text-xs ${muted} mt-0.5`}>{t("dash.assignedTo")} {audit.pentesterName || "—"}</p>
                          <p className={`text-xs ${muted} mt-0.5`}><span className={isDark ? "text-white/70" : "text-slate-700"}>{t("dash.scope")}:</span> {audit.scope}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDownloadReport(audit)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-500/20 shrink-0">
                        <Download className="w-4 h-4" /> {t("dash.downloadReport")}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ─── Request Pentest Modal ──────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl ${isDark ? "bg-[#0a1240] border-white/10" : "bg-white border-slate-200"}`}>
            <div className={`px-6 py-5 border-b ${sideBorder} flex items-center justify-between`}>
              <h2 className={`text-base font-semibold ${text}`}>{t("dash.requestNewAudit")}</h2>
              <button onClick={() => { setShowForm(false); setFormError(""); }}
                className={`p-1.5 rounded-lg ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"} ${muted} hover:text-red-400 transition-colors`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              {formError && <div className="mb-4 px-4 py-2 rounded-xl bg-red-400/10 border border-red-400/30 text-red-400 text-sm">{formError}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${text} mb-1.5`}>{t("dash.titleField")} *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm`}
                    placeholder={t("dash.auditTitlePlaceholder")} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${text} mb-1.5`}>{t("dash.descField")}</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none`}
                    placeholder={t("dash.descPlaceholder")} />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${text} mb-1.5`}>{t("dash.scopeField")} *</label>
                  <input type="text" value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm`}
                    placeholder={t("dash.scopePlaceholder")} />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className={`px-4 py-2 rounded-xl text-sm ${muted} ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"} transition-colors`}>
                    {t("dash.cancel")}
                  </button>
                  <button type="submit" disabled={submitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 rounded-xl text-sm font-semibold text-white transition-all shadow-md shadow-blue-500/20">
                    {submitting ? t("dash.submitting") : t("dash.submitRequest")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
