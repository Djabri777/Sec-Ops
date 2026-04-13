

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  Shield, ClipboardList, PlusCircle, LogOut, RefreshCw,
  UserCheck, CheckCircle, Clock, AlertTriangle, X, Moon, Sun, Languages,
  Download, FileText, Activity, ChevronRight, Bug, Wifi,
} from "lucide-react";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

import { useAuth } from "../contexts/AuthContext";

import { useTheme } from "../contexts/ThemeContext";

import { useLang } from "../contexts/LanguageContext";

import { requestAudit, getClientAudits, getVulnerabilities, getScanResults } from "../services/firestoreService";

const STATUS_BADGE = {
  pending:     "bg-yellow-400/15 text-yellow-400 border-yellow-400/30",
  assigned:    "bg-blue-400/15 text-blue-400 border-blue-400/30",
  in_progress: "bg-purple-400/15 text-purple-400 border-purple-400/30",
  completed:   "bg-green-400/15 text-green-400 border-green-400/30",
};

const SEVERITY_BADGE = {
  critical: "bg-red-400/15 text-red-400 border-red-400/30",
  high:     "bg-orange-400/15 text-orange-400 border-orange-400/30",
  medium:   "bg-yellow-400/15 text-yellow-400 border-yellow-400/30",
  low:      "bg-green-400/15 text-green-400 border-green-400/30",
  info:     "bg-blue-400/15 text-blue-400 border-blue-400/30",
};

const SEVERITY_COLOR = { critical: "#ef4444", high: "#f97316", medium: "#eab308", low: "#22c55e", info: "#3b82f6" };

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

  const [selectedProgressAudit, setSelectedProgressAudit] = useState(null);

  const [progressVulns, setProgressVulns] = useState([]);

  const [progressScans, setProgressScans] = useState([]);

  const [progressLoading, setProgressLoading] = useState(false);

  const [progressView, setProgressView] = useState("vulns");

  const [downloadingId, setDownloadingId] = useState(null);

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

  const handleSelectProgressAudit = async (audit) => {
    setSelectedProgressAudit(audit);  
    setProgressLoading(true);         
    setProgressView("vulns");         
    try {

      const [vulns, scans] = await Promise.all([
        getVulnerabilities(audit.id).catch(() => []),
        getScanResults(audit.id).catch(() => []),
      ]);
      setProgressVulns(vulns);   
      setProgressScans(scans);   
    } finally {
      setProgressLoading(false); 
    }
  };

  const generatePDF = (audit, vulns, scans) => {
    
    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    const vulnsRows = vulns.map((v) => `
      <tr>
        <td>${v.title || "—"}</td>
        <td><span style="color:${SEVERITY_COLOR[v.severity] || "#888"};font-weight:700;text-transform:capitalize">${v.severity || "—"}</span></td>
        <td style="font-weight:600">${v.cvssScore ?? "—"}</td>
        <td style="text-transform:capitalize">${(v.status || "—").replace("_", " ")}</td>
        <td>${v.affectedAssets || "—"}</td>
      </tr>`).join("");

    const scansRows = scans.map((s) => `
      <tr>
        <td style="font-weight:600;text-transform:capitalize">${s.scanType || "—"}</td>
        <td style="white-space:pre-wrap">${s.findings || "—"}</td>
        <td>${s.timestamp?.toDate ? s.timestamp.toDate().toLocaleDateString() : "—"}</td>
      </tr>`).join("");

    const html = `<!DOCTYPE html>
<html lang="en"><head>
  <meta charset="UTF-8">
  <title>Security Audit Report – ${audit.title}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; color:#1e293b; background:#fff; padding:48px; font-size:14px; line-height:1.6; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:3px solid #3b82f6; padding-bottom:28px; margin-bottom:36px; }
    .brand { display:flex; align-items:center; gap:14px; }
    .brand-icon { width:48px; height:48px; background:linear-gradient(135deg,#3b82f6,#9333ea); border-radius:12px; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:900; font-size:22px; }
    .brand-name { font-size:26px; font-weight:900; color:#1e293b; letter-spacing:-0.5px; }
    .brand-sub { font-size:12px; color:#64748b; margin-top:2px; }
    .report-meta { text-align:right; }
    .report-label { font-size:11px; font-weight:800; color:#94a3b8; text-transform:uppercase; letter-spacing:.1em; }
    .report-date { font-size:13px; color:#475569; margin-top:4px; font-weight:500; }
    h1 { font-size:28px; font-weight:900; color:#1e293b; margin-bottom:6px; letter-spacing:-0.5px; }
    .subtitle { font-size:14px; color:#64748b; margin-bottom:32px; max-width:600px; }
    .info-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; margin-bottom:40px; }
    .info-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px 20px; }
    .info-label { font-size:11px; font-weight:800; color:#94a3b8; text-transform:uppercase; letter-spacing:.08em; margin-bottom:6px; }
    .info-value { font-size:15px; font-weight:700; color:#334155; }
    .badge { display:inline-block; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; text-transform:capitalize; background:#dcfce7; color:#166534; border:1px solid #bbf7d0; }
    section { margin-bottom:40px; }
    h2 { font-size:17px; font-weight:800; color:#1e293b; margin-bottom:16px; padding-bottom:10px; border-bottom:2px solid #e2e8f0; display:flex; align-items:center; gap:8px; }
    .count { display:inline-flex; align-items:center; justify-content:center; width:24px; height:24px; background:#e2e8f0; border-radius:6px; font-size:13px; font-weight:700; color:#475569; }
    table { width:100%; border-collapse:collapse; font-size:13px; border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; }
    th { background:#f1f5f9; color:#475569; font-weight:800; text-transform:uppercase; font-size:10px; letter-spacing:.08em; padding:12px 16px; text-align:left; border-bottom:1px solid #e2e8f0; }
    td { padding:12px 16px; border-bottom:1px solid #f1f5f9; color:#334155; vertical-align:top; }
    tr:last-child td { border-bottom:none; }
    tr:hover td { background:#fafbfc; }
    .empty { text-align:center; padding:32px; color:#94a3b8; font-size:14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; }
    .footer { margin-top:56px; padding-top:20px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; }
    .footer-note { font-size:12px; color:#94a3b8; }
    .confidential { background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; padding:10px 16px; margin-bottom:32px; font-size:13px; color:#92400e; font-weight:600; }
    @media print { body { padding:24px; } }
  </style>
</head><body>
  <div class="header">
    <div class="brand">
      <div class="brand-icon">S</div>
      <div>
        <div class="brand-name">SecOps</div>
        <div class="brand-sub">Security Operations Platform</div>
      </div>
    </div>
    <div class="report-meta">
      <div class="report-label">Security Audit Report</div>
      <div class="report-date">Generated: ${date}</div>
    </div>
  </div>

  <div class="confidential">⚠ CONFIDENTIAL – This report contains sensitive security information. Handle with care.</div>

  <h1>${audit.title}</h1>
  <p class="subtitle">${audit.description || "No description provided."}</p>

  <div class="info-grid">
    <div class="info-card"><div class="info-label">Client</div><div class="info-value">${audit.clientName || "—"}</div></div>
    <div class="info-card"><div class="info-label">Pentester</div><div class="info-value">${audit.pentesterName || "—"}</div></div>
    <div class="info-card"><div class="info-label">Scope / Targets</div><div class="info-value">${audit.scope || "—"}</div></div>
    <div class="info-card"><div class="info-label">Status</div><div class="info-value"><span class="badge">${(audit.status || "—").replace("_", " ")}</span></div></div>
  </div>

  <section>
    <h2>Vulnerabilities Found <span class="count">${vulns.length}</span></h2>
    ${vulns.length === 0
      ? '<div class="empty">No vulnerabilities reported for this audit.</div>'
      : `<table>
          <thead><tr><th>Title</th><th>Severity</th><th>CVSS</th><th>Status</th><th>Affected Assets</th></tr></thead>
          <tbody>${vulnsRows}</tbody>
        </table>`
    }
  </section>

  <section>
    <h2>Scan Results <span class="count">${scans.length}</span></h2>
    ${scans.length === 0
      ? '<div class="empty">No scan results recorded for this audit.</div>'
      : `<table>
          <thead><tr><th>Scan Type</th><th>Findings</th><th>Date</th></tr></thead>
          <tbody>${scansRows}</tbody>
        </table>`
    }
  </section>

  <div class="footer">
    <div class="footer-note">© ${new Date().getFullYear()} SecOps – Confidential Security Report</div>
    <div class="footer-note">Empowering Algerian startups with enterprise security</div>
  </div>
</body></html>`;

    const w = window.open("", "_blank");
    if (!w) return; 
    w.document.write(html);   
    w.document.close();       
    w.focus();                
    
    setTimeout(() => { w.print(); }, 600);
  };

  const handleDownloadReport = async (audit) => {
    setDownloadingId(audit.id); 
    try {
      
      const [vulns, scans] = await Promise.all([
        getVulnerabilities(audit.id).catch(() => []),
        getScanResults(audit.id).catch(() => []),
      ]);
      
      generatePDF(audit, vulns, scans);
    } finally {
      setDownloadingId(null); 
    }
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

  const activeAudits    = audits.filter((a) => a.status === "assigned" || a.status === "in_progress");

  const sidebarItems = [
    { key: "my-audits", label: t("dash.myAudits"), icon: ClipboardList },
    { key: "progress",  label: "Pentest Progress", icon: Activity },
    { key: "reports",   label: t("dash.reports"),  icon: FileText },
  ];

  return (
    
    <div className={`min-h-screen flex ${bg} transition-colors duration-300`}>

      {}
      {isDark && (
        <>
          <div className="fixed top-0 left-64 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
          <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {}
      {}
      {}
      {}
      <aside className={`fixed inset-y-0 start-0 w-64 ${sidebarBg} ${isDark ? "border-e border-white/[0.06]" : "border-e border-slate-200"} flex flex-col z-20`}>

        {}
        {}
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

        {}
        {}
        {}
        <nav className="flex-1 p-3 space-y-1">
          {}
          <p className={`px-3 py-2 text-xs font-semibold uppercase tracking-widest ${muted}`}>{t("dash.navigation")}</p>

          {}
          {}
          {sidebarItems.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => { setActiveTab(key); setSelectedProgressAudit(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === key
                  ? isDark
                    ? "bg-gradient-to-r from-blue-600/25 to-purple-600/15 text-white border border-white/10 shadow-lg"
                    : "bg-blue-50 text-blue-600 border border-blue-100"
                  : `${muted} ${isDark ? "hover:bg-white/5 hover:text-white/80" : "hover:bg-slate-100"}`
              }`}>
              {}
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

          {}
          <button onClick={() => setShowForm(true)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${muted} ${isDark ? "hover:bg-white/5 hover:text-white/80" : "hover:bg-slate-100"}`}>
            <div className={`p-1.5 rounded-lg ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
              <PlusCircle className="w-3.5 h-3.5" />
            </div>
            {t("dash.requestAudit")}
          </button>
        </nav>

        {}
        {}
        <div className={`p-3 border-t ${sideBorder} space-y-2`}>

          {}
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${isDark ? "bg-white/[0.03] border border-white/[0.06]" : "bg-slate-50 border border-slate-100"}`}>
            {}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 text-white text-sm font-bold shadow-md shadow-blue-500/30">
              {userProfile?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-medium truncate ${text}`}>{userProfile?.name}</p>
              <p className={`text-xs ${muted}`}>{t("auth.roles.client")}</p>
            </div>
          </div>

          {}
          <div className="flex items-center gap-2 px-1">
            {}
            <button onClick={toggleTheme} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs border transition-all ${isDark ? "border-white/10 text-white/50 hover:text-white hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-100"}`}>
              {isDark ? <><Sun className="w-3.5 h-3.5" /> Light</> : <><Moon className="w-3.5 h-3.5" /> Dark</>}
            </button>
            {}
            <button onClick={toggleLang} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs border transition-all ${isDark ? "border-white/10 text-white/50 hover:text-white hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-100"}`}>
              <Languages className="w-3.5 h-3.5" /> {t("nav.toggleLang")}
            </button>
          </div>

          {}
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors text-red-400 hover:bg-red-400/10">
            <LogOut className="w-4 h-4" /> {t("common.signOut")}
          </button>
        </div>
      </aside>

      {}
      {}
      {}
      {}
      <div className="flex-1 ms-64 flex flex-col min-h-screen">

        {}
        {}
        <header className={`sticky top-0 z-10 ${headerBg} border-b px-8 py-4 flex items-center justify-between`}>
          <div>
            {}
            <h1 className={`text-lg font-bold ${text}`}>{t("dash.clientDashboard")}</h1>
            {}
            <p className={`text-xs ${muted}`}>{t("dash.welcomeAdmin")} {userProfile?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            {}
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20">
              <PlusCircle className="w-4 h-4" /> {t("dash.requestAudit")}
            </button>
            {}
            <button onClick={fetchAudits} className={`p-2 rounded-lg border transition-all ${isDark ? "border-white/10 text-white/50 hover:text-white hover:border-blue-500/40 hover:bg-blue-500/5" : "border-slate-200 text-slate-500 hover:text-blue-600"}`}>
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {}
        <main className="flex-1 p-8 space-y-8">

          {}
          {success && (
            <div className="px-5 py-3 rounded-xl bg-green-400/10 border border-green-400/30 text-green-400 text-sm font-medium">
              {success}
            </div>
          )}

          {}
          {}
          {}
          {}
          {}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className={`p-5 rounded-2xl border ${cardBg} relative overflow-hidden hover:border-white/15 transition-all`}>
                {}
                {isDark && <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />}
                <div className="relative flex items-start justify-between mb-4">
                  <div>
                    {}
                    <p className={`text-xs font-medium uppercase tracking-wider ${muted} mb-1`}>{s.label}</p>
                    {}
                    <p className={`text-3xl font-bold ${text}`}>{s.value}</p>
                  </div>
                  {}
                  <div className={`p-3 rounded-xl ${s.iconBg} shadow-lg ${s.glow}`}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {}
          {}
          {}
          {}
          {}
          {activeTab === "my-audits" && (
            <>
              {}
              {}
              {}
              {chartData.length > 0 && (
                <div className={`p-6 rounded-2xl border ${cardBg}`}>
                  <h2 className={`text-sm font-semibold ${text} mb-5`}>{t("dash.auditRequestsChart")}</h2>
                  {}
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      {}
                      <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      {}
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} />
                      {}
                      <XAxis dataKey="month" stroke={isDark ? "#ffffff15" : "#94a3b8"} tick={{ fill: isDark ? "#ffffff50" : "#64748b" }} />
                      {}
                      <YAxis stroke={isDark ? "#ffffff15" : "#94a3b8"} tick={{ fill: isDark ? "#ffffff50" : "#64748b" }} allowDecimals={false} />
                      {}
                      <Tooltip contentStyle={tooltipStyle} />
                      {}
                      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 4, strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {}
              {}
              <div className={`rounded-2xl border ${cardBg} overflow-hidden`}>
                {}
                <div className={`px-6 py-4 border-b ${sideBorder} flex items-center justify-between`}>
                  <h2 className={`font-semibold ${text}`}>{t("dash.myAuditRequests")}</h2>
                  <span className={`text-xs ${muted}`}>{audits.length} {t("dash.total")}</span>
                </div>

                {}
                {}
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
                            {}
                            <div className="flex items-start gap-3 min-w-0">
                              {}
                              <div className={`mt-0.5 p-2 rounded-xl shrink-0 ${STATUS_BADGE[audit.status]?.split(" ").slice(1).join(" ") || ""}`}>
                                <Icon className={`w-4 h-4 ${STATUS_BADGE[audit.status]?.split(" ")[0] || muted}`} />
                              </div>
                              <div className="min-w-0">
                                {}
                                <p className={`font-semibold ${text}`}>{audit.title}</p>
                                {}
                                <p className={`text-xs ${muted} mt-0.5 line-clamp-1`}>{audit.description || "—"}</p>
                                {}
                                <p className={`text-xs ${muted} mt-1`}>
                                  <span className={isDark ? "text-white/70" : "text-slate-700"}>{t("dash.scope")}:</span> {audit.scope}
                                </p>
                              </div>
                            </div>

                            {}
                            <div className="text-end shrink-0 flex flex-col items-end gap-2">
                              {}
                              <span className={`px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${STATUS_BADGE[audit.status] || ""}`}>
                                {t(`status.${audit.status}`) || audit.status?.replace("_", " ")}
                              </span>
                              {}
                              {audit.pentesterName && (
                                <p className={`text-xs ${muted}`}>{t("dash.assignedTo")} {audit.pentesterName}</p>
                              )}
                              {}
                              {}
                              {(audit.status === "assigned" || audit.status === "in_progress") && (
                                <button onClick={() => { setActiveTab("progress"); handleSelectProgressAudit(audit); }}
                                  className={`flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors`}>
                                  View Progress <ChevronRight className="w-3 h-3" />
                                </button>
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

          {}
          {}
          {}
          {}
          {}
          {}
          {activeTab === "progress" && (
            <div className="space-y-6">

              {}
              {}
              {!selectedProgressAudit ? (
                <>
                  {}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className={`text-lg font-bold ${text}`}>Pentest Progress</h2>
                      <p className={`text-sm ${muted} mt-0.5`}>Track vulnerabilities and scan results for your active audits</p>
                    </div>
                    <span className={`text-sm ${muted}`}>{activeAudits.length} active</span>
                  </div>

                  {}
                  {loading ? (
                    <div className={`p-12 text-center ${muted}`}>{t("common.loading")}</div>
                  ) : fetchError ? (
                    <div className="px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/30 text-red-400 text-sm">{fetchError}</div>
                  ) : activeAudits.length === 0 ? (
                    
                    <div className={`p-16 rounded-2xl border ${cardBg} text-center ${muted}`}>
                      <Activity className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p className="font-medium">No active audits at the moment</p>
                      <p className="text-sm mt-1 opacity-70">Your assigned or in-progress audits will appear here</p>
                    </div>
                  ) : (
                    
                    <div className={`rounded-2xl border ${cardBg} overflow-hidden divide-y ${divider}`}>
                      {activeAudits.map((audit) => (
                        <button key={audit.id} onClick={() => handleSelectProgressAudit(audit)}
                          className={`w-full px-6 py-5 ${rowHover} transition-colors flex items-center justify-between gap-4 text-left`}>
                          <div className="flex items-start gap-3 min-w-0">
                            {}
                            <div className="p-2.5 rounded-xl bg-purple-400/10 shrink-0">
                              <Activity className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="min-w-0">
                              <p className={`font-semibold ${text}`}>{audit.title}</p>
                              <p className={`text-xs ${muted} mt-0.5`}>{audit.description || "—"}</p>
                              <p className={`text-xs ${muted} mt-1`}>
                                <span className={isDark ? "text-white/70" : "text-slate-700"}>{t("dash.scope")}:</span> {audit.scope}
                              </p>
                              {audit.pentesterName && (
                                <p className={`text-xs ${muted} mt-0.5`}>{t("dash.assignedTo")} <span className={isDark ? "text-white/70" : "text-slate-700"}>{audit.pentesterName}</span></p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            {}
                            <span className={`px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${STATUS_BADGE[audit.status] || ""}`}>
                              {t(`status.${audit.status}`) || audit.status?.replace("_", " ")}
                            </span>
                            {}
                            <ChevronRight className={`w-4 h-4 ${muted}`} />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (

                <div className="space-y-5">

                  {}
                  <div className="flex items-center gap-3 flex-wrap">
                    {}
                    <button onClick={() => setSelectedProgressAudit(null)}
                      className={`flex items-center gap-1.5 text-sm ${muted} hover:text-blue-400 transition-colors`}>
                      ← Back
                    </button>
                    <span className={`text-sm ${muted}`}>/</span>
                    {}
                    <span className={`text-sm font-medium ${text}`}>{selectedProgressAudit.title}</span>
                    {}
                    <span className={`ms-auto px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${STATUS_BADGE[selectedProgressAudit.status] || ""}`}>
                      {t(`status.${selectedProgressAudit.status}`) || selectedProgressAudit.status?.replace("_", " ")}
                    </span>
                  </div>

                  {}
                  {}
                  <div className={`p-5 rounded-2xl border ${cardBg}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wider ${muted} mb-1`}>{t("dash.scope")}</p>
                        <p className={`text-sm font-medium ${text}`}>{selectedProgressAudit.scope}</p>
                      </div>
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wider ${muted} mb-1`}>Pentester</p>
                        <p className={`text-sm font-medium ${text}`}>{selectedProgressAudit.pentesterName || "—"}</p>
                      </div>
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wider ${muted} mb-1`}>Description</p>
                        <p className={`text-sm ${text} line-clamp-2`}>{selectedProgressAudit.description || "—"}</p>
                      </div>
                    </div>
                  </div>

                  {}
                  {}
                  {}
                  <div className={`flex gap-2 p-1 rounded-xl ${isDark ? "bg-white/[0.04]" : "bg-slate-100"} w-fit`}>
                    <button onClick={() => setProgressView("vulns")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${progressView === "vulns" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20" : muted}`}>
                      <span className="flex items-center gap-1.5"><Bug className="w-4 h-4" /> Vulnerabilities {!progressLoading && `(${progressVulns.length})`}</span>
                    </button>
                    <button onClick={() => setProgressView("scans")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${progressView === "scans" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20" : muted}`}>
                      <span className="flex items-center gap-1.5"><Wifi className="w-4 h-4" /> Scan Results {!progressLoading && `(${progressScans.length})`}</span>
                    </button>
                  </div>

                  {}
                  {progressLoading ? (
                    
                    <div className={`p-12 text-center ${muted}`}>{t("common.loading")}</div>
                  ) : progressView === "vulns" ? (

                    <div className={`rounded-2xl border ${cardBg} overflow-hidden`}>
                      <div className={`px-6 py-4 border-b ${sideBorder} flex items-center justify-between`}>
                        <h3 className={`font-semibold ${text}`}>Vulnerabilities Found</h3>
                        <span className={`text-xs ${muted}`}>{progressVulns.length} {t("dash.total")}</span>
                      </div>
                      {progressVulns.length === 0 ? (
                        
                        <div className={`p-12 text-center ${muted}`}>
                          <Bug className="w-10 h-10 mx-auto mb-3 opacity-30" />
                          <p>No vulnerabilities reported yet</p>
                        </div>
                      ) : (
                        
                        <div className={`divide-y ${divider}`}>
                          {progressVulns.map((v) => (
                            <div key={v.id} className={`px-6 py-4 ${rowHover} transition-colors`}>
                              <div className="flex items-start justify-between gap-3 flex-wrap">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    {}
                                    <p className={`font-semibold text-sm ${text}`}>{v.title}</p>
                                    {}
                                    <span className={`px-2 py-0.5 rounded-full border text-xs font-medium capitalize ${SEVERITY_BADGE[v.severity] || ""}`}>
                                      {v.severity}
                                    </span>
                                    {}
                                    {v.cvssScore > 0 && (
                                      <span className={`text-xs font-semibold ${muted}`}>CVSS {v.cvssScore}</span>
                                    )}
                                  </div>
                                  {}
                                  <p className={`text-xs ${muted} line-clamp-2`}>{v.description || "—"}</p>
                                  {}
                                  {v.affectedAssets && (
                                    <p className={`text-xs ${muted} mt-1`}>
                                      <span className={isDark ? "text-white/70" : "text-slate-700"}>Affected:</span> {v.affectedAssets}
                                    </p>
                                  )}
                                </div>
                                {}
                                <span className={`px-2.5 py-1 rounded-full border text-xs font-medium capitalize shrink-0 ${STATUS_BADGE[v.status] || ""}`}>
                                  {t(`status.${v.status}`) || v.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (

                    <div className={`rounded-2xl border ${cardBg} overflow-hidden`}>
                      <div className={`px-6 py-4 border-b ${sideBorder} flex items-center justify-between`}>
                        <h3 className={`font-semibold ${text}`}>Scan Results</h3>
                        <span className={`text-xs ${muted}`}>{progressScans.length} {t("dash.total")}</span>
                      </div>
                      {progressScans.length === 0 ? (
                        
                        <div className={`p-12 text-center ${muted}`}>
                          <Wifi className="w-10 h-10 mx-auto mb-3 opacity-30" />
                          <p>No scan results yet</p>
                        </div>
                      ) : (
                        
                        <div className={`divide-y ${divider}`}>
                          {progressScans.map((s) => (
                            <div key={s.id} className={`px-6 py-4 ${rowHover} transition-colors`}>
                              <div className="flex items-start gap-3">
                                {}
                                <div className={`p-2 rounded-lg shrink-0 ${isDark ? "bg-blue-400/10" : "bg-blue-50"}`}>
                                  <Wifi className="w-4 h-4 text-blue-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    {}
                                    <p className={`font-semibold text-sm ${text} capitalize`}>{s.scanType}</p>
                                    {}
                                    {s.timestamp?.toDate && (
                                      <span className={`text-xs ${muted}`}>{s.timestamp.toDate().toLocaleDateString()}</span>
                                    )}
                                  </div>
                                  {}
                                  <p className={`text-xs ${muted} whitespace-pre-wrap`}>{s.findings || "—"}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {}
          {}
          {}
          {}
          {}
          {activeTab === "reports" && (
            <div className="space-y-6">
              {}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-lg font-bold ${text}`}>{t("dash.reports")}</h2>
                  <p className={`text-sm ${muted} mt-0.5`}>Download full PDF security reports for completed audits</p>
                </div>
                <span className={`text-sm ${muted}`}>{completedAudits.length} {t("dash.total")}</span>
              </div>

              {}
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
                        {}
                        <div className="p-2 rounded-xl bg-green-400/10 shrink-0">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="min-w-0">
                          {}
                          <p className={`font-semibold ${text}`}>{audit.title}</p>
                          {}
                          <p className={`text-xs ${muted} mt-0.5`}>{t("dash.assignedTo")} {audit.pentesterName || "—"}</p>
                          {}
                          <p className={`text-xs ${muted} mt-0.5`}><span className={isDark ? "text-white/70" : "text-slate-700"}>{t("dash.scope")}:</span> {audit.scope}</p>
                        </div>
                      </div>
                      {}
                      {}
                      {}
                      <button onClick={() => handleDownloadReport(audit)} disabled={downloadingId === audit.id}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-500/20 shrink-0">
                        <Download className="w-4 h-4" />
                        {downloadingId === audit.id ? "Generating PDF…" : "Download PDF Report"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {}
      {}
      {}
      {}
      {}
      {}
      {showForm && (
        
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          {}
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl ${isDark ? "bg-[#0a1240] border-white/10" : "bg-white border-slate-200"}`}>

            {}
            <div className={`px-6 py-5 border-b ${sideBorder} flex items-center justify-between`}>
              <h2 className={`text-base font-semibold ${text}`}>{t("dash.requestNewAudit")}</h2>
              {}
              <button onClick={() => { setShowForm(false); setFormError(""); }}
                className={`p-1.5 rounded-lg ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"} ${muted} hover:text-red-400 transition-colors`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {}
            <div className="p-6">
              {}
              {formError && <div className="mb-4 px-4 py-2 rounded-xl bg-red-400/10 border border-red-400/30 text-red-400 text-sm">{formError}</div>}

              {}
              <form onSubmit={handleSubmit} className="space-y-4">
                {}
                <div>
                  <label className={`block text-sm font-medium ${text} mb-1.5`}>{t("dash.titleField")} *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm`}
                    placeholder={t("dash.auditTitlePlaceholder")} />
                </div>

                {}
                <div>
                  <label className={`block text-sm font-medium ${text} mb-1.5`}>{t("dash.descField")}</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none`}
                    placeholder={t("dash.descPlaceholder")} />
                </div>

                {}
                <div>
                  <label className={`block text-sm font-medium ${text} mb-1.5`}>{t("dash.scopeField")} *</label>
                  <input type="text" value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm`}
                    placeholder={t("dash.scopePlaceholder")} />
                </div>

                {}
                <div className="flex justify-end gap-3 pt-2">
                  {}
                  <button type="button" onClick={() => setShowForm(false)}
                    className={`px-4 py-2 rounded-xl text-sm ${muted} ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"} transition-colors`}>
                    {t("dash.cancel")}
                  </button>
                  {}
                  {}
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
