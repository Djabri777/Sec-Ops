

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
    const reportId = "RPT-" + Date.now().toString(36).toUpperCase();

    const logoSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="52" height="62">
      <defs>
        <linearGradient id="shieldFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#dbeafe;stop-opacity:1"/>
          <stop offset="100%" style="stop-color:#bfdbfe;stop-opacity:1"/>
        </linearGradient>
      </defs>
      <path d="M60 8 L104 26 L104 68 C104 92 84 112 60 122 C36 112 16 92 16 68 L16 26 Z"
            fill="url(#shieldFill)" stroke="#2563eb" stroke-width="5" stroke-linejoin="round"/>
    </svg>`;

    const SEV = {
      critical: { bg: "#fef2f2", border: "#fca5a5", text: "#991b1b", dot: "#ef4444", label: "Critical" },
      high:     { bg: "#fff7ed", border: "#fdba74", text: "#92400e", dot: "#f97316", label: "High"     },
      medium:   { bg: "#fefce8", border: "#fde047", text: "#713f12", dot: "#eab308", label: "Medium"   },
      low:      { bg: "#f0fdf4", border: "#86efac", text: "#14532d", dot: "#22c55e", label: "Low"      },
      info:     { bg: "#eff6ff", border: "#93c5fd", text: "#1e3a8a", dot: "#3b82f6", label: "Info"     },
    };

    const counts = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    vulns.forEach((v) => { if (counts[v.severity] !== undefined) counts[v.severity]++; });

    const maxSev = counts.critical > 0 ? "Critical" : counts.high > 0 ? "High" : counts.medium > 0 ? "Medium" : counts.low > 0 ? "Low" : vulns.length > 0 ? "Info" : "Clean";
    const riskColor = { Critical: "#ef4444", High: "#f97316", Medium: "#eab308", Low: "#22c55e", Info: "#3b82f6", Clean: "#10b981" };

    const cvssBar = (score) => {
      const pct = Math.min(100, ((parseFloat(score) || 0) / 10) * 100);
      const col = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f97316" : pct >= 40 ? "#eab308" : "#22c55e";
      return `<div style="display:flex;align-items:center;gap:8px">
        <div style="flex:1;height:6px;background:#e2e8f0;border-radius:4px;overflow:hidden">
          <div style="width:${pct}%;height:100%;background:${col};border-radius:4px"></div>
        </div>
        <span style="font-weight:700;color:${col};min-width:28px">${score ?? "—"}</span>
      </div>`;
    };

    const vulnCards = vulns.map((v, i) => {
      const s = SEV[v.severity] || SEV.info;
      return `
      <div style="border:1px solid ${s.border};border-radius:12px;margin-bottom:16px;overflow:hidden;page-break-inside:avoid">
        <div style="background:${s.bg};padding:14px 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid ${s.border}">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="background:${s.dot};color:#fff;font-size:11px;font-weight:800;padding:2px 8px;border-radius:6px">#${i + 1}</span>
            <span style="font-size:15px;font-weight:700;color:#1e293b">${v.title || "Untitled"}</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <span style="background:${s.dot};color:#fff;font-size:11px;font-weight:800;padding:4px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:.05em">${s.label}</span>
            <span style="font-size:11px;color:${s.text};font-weight:600;text-transform:capitalize">${(v.status || "open").replace("_", " ")}</span>
          </div>
        </div>
        <div style="padding:16px 20px;background:#fff">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:14px">
            <div>
              <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">CVSS Score</div>
              ${cvssBar(v.cvssScore)}
            </div>
            <div>
              <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">Affected Assets</div>
              <div style="font-size:13px;color:#334155;font-weight:500">${v.affectedAssets || "—"}</div>
            </div>
          </div>
          ${v.description ? `<div style="margin-bottom:10px"><div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px">Description</div><div style="font-size:13px;color:#475569;line-height:1.6">${v.description}</div></div>` : ""}
          ${v.evidence ? `<div style="background:#f8fafc;border-radius:8px;padding:10px 14px;border-left:3px solid ${s.dot}"><div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px">Evidence</div><div style="font-size:12px;color:#475569;font-family:monospace;white-space:pre-wrap">${v.evidence}</div></div>` : ""}
        </div>
      </div>`;
    }).join("");

    const scanCards = scans.map((s) => `
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin-bottom:12px;page-break-inside:avoid">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <span style="font-size:13px;font-weight:700;color:#1e293b;text-transform:capitalize">${s.scanType || "Scan"}</span>
          <span style="font-size:11px;color:#94a3b8">${s.timestamp?.toDate ? s.timestamp.toDate().toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}) : "—"}</span>
        </div>
        <div style="font-size:13px;color:#475569;line-height:1.7;white-space:pre-wrap">${s.findings || "No findings recorded."}</div>
      </div>`).join("");

    const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<title>Security Report – ${audit.title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',system-ui,sans-serif; color:#1e293b; background:#fff; font-size:14px; line-height:1.6; }
  .cover { background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#1e293b 100%); color:#fff; padding:56px 52px 48px; position:relative; overflow:hidden; }
  .cover::before { content:''; position:absolute; top:-60px; right:-60px; width:300px; height:300px; background:radial-gradient(circle,rgba(59,130,246,.25),transparent 70%); }
  .cover::after  { content:''; position:absolute; bottom:-40px; left:30%; width:200px; height:200px; background:radial-gradient(circle,rgba(139,92,246,.15),transparent 70%); }
  .cover-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:48px; }
  .logo { display:flex; align-items:center; gap:14px; }
  .logo-name { font-size:22px; font-weight:900; letter-spacing:-.3px; }
  .logo-name span { color:#2563eb; }
  .logo-tag  { font-size:11px; color:#94a3b8; margin-top:2px; }
  .conf-badge { background:rgba(239,68,68,.15); border:1px solid rgba(239,68,68,.3); border-radius:6px; padding:5px 14px; font-size:11px; font-weight:700; color:#fca5a5; text-transform:uppercase; letter-spacing:.1em; }
  .cover-title { font-size:32px; font-weight:900; letter-spacing:-.5px; line-height:1.2; margin-bottom:12px; }
  .cover-desc  { font-size:14px; color:#94a3b8; max-width:580px; line-height:1.7; margin-bottom:36px; }
  .cover-meta  { display:flex; gap:32px; flex-wrap:wrap; }
  .meta-item   { display:flex; flex-direction:column; gap:3px; }
  .meta-label  { font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.1em; }
  .meta-value  { font-size:13px; font-weight:600; color:#e2e8f0; }
  .risk-strip  { background:#0f172a; padding:20px 52px; display:flex; align-items:center; gap:24px; border-bottom:1px solid #1e293b; }
  .risk-label  { font-size:11px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:.1em; }
  .risk-value  { font-size:16px; font-weight:900; }
  .sev-pills   { display:flex; gap:10px; flex-wrap:wrap; margin-left:auto; }
  .sev-pill    { display:flex; align-items:center; gap:6px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:20px; padding:4px 14px; }
  .sev-dot     { width:8px; height:8px; border-radius:50%; }
  .sev-txt     { font-size:12px; font-weight:600; color:#cbd5e1; }
  .sev-n       { font-size:12px; font-weight:800; color:#f1f5f9; }
  .body        { padding:44px 52px; }
  .section     { margin-bottom:44px; }
  .section-hdr { display:flex; align-items:center; gap:10px; margin-bottom:20px; padding-bottom:12px; border-bottom:2px solid #f1f5f9; }
  .section-num { width:28px; height:28px; background:linear-gradient(135deg,#3b82f6,#8b5cf6); border-radius:8px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:12px; font-weight:800; }
  .section-title { font-size:17px; font-weight:800; color:#1e293b; }
  .section-cnt   { margin-left:auto; background:#f1f5f9; border-radius:6px; padding:2px 10px; font-size:12px; font-weight:700; color:#64748b; }
  .info-row    { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:28px; }
  .info-box    { background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px 18px; }
  .info-lbl    { font-size:10px; font-weight:800; color:#94a3b8; text-transform:uppercase; letter-spacing:.08em; margin-bottom:5px; }
  .info-val    { font-size:14px; font-weight:700; color:#334155; }
  .status-badge { display:inline-block; padding:3px 10px; border-radius:16px; font-size:11px; font-weight:700; text-transform:capitalize; background:#dcfce7; color:#166534; }
  .empty-state  { text-align:center; padding:36px; color:#94a3b8; font-size:14px; background:#f8fafc; border:1px dashed #e2e8f0; border-radius:12px; }
  .page-footer  { margin-top:60px; padding:20px 52px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; background:#f8fafc; }
  .footer-l     { display:flex; align-items:center; gap:8px; font-size:12px; color:#64748b; }
  .footer-r     { font-size:11px; color:#94a3b8; }
  @media print {
    .cover { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .risk-strip { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  }
</style>
</head><body>

<!-- COVER -->
<div class="cover">
  <div class="cover-top">
    <div class="logo">
      ${logoSVG}
      <div>
        <div class="logo-name">Sec<span>Ops</span></div>
        <div class="logo-tag">Security Operations Platform</div>
      </div>
    </div>
    <div class="conf-badge">&#9888; Confidential</div>
  </div>
  <div class="cover-title">${audit.title || "Security Audit Report"}</div>
  <div class="cover-desc">${audit.description || "This document contains the findings and results of the security audit conducted by the SecOps team."}</div>
  <div class="cover-meta">
    <div class="meta-item"><div class="meta-label">Client</div><div class="meta-value">${audit.clientName || "—"}</div></div>
    <div class="meta-item"><div class="meta-label">Lead Pentester</div><div class="meta-value">${audit.pentesterName || "—"}</div></div>
    <div class="meta-item"><div class="meta-label">Date</div><div class="meta-value">${date}</div></div>
    <div class="meta-item"><div class="meta-label">Report ID</div><div class="meta-value">${reportId}</div></div>
  </div>
</div>

<!-- RISK STRIP -->
<div class="risk-strip" style="color:#fff">
  <div class="risk-label">Overall Risk Level</div>
  <div class="risk-value" style="color:${riskColor[maxSev]}">${maxSev}</div>
  <div class="sev-pills">
    <div class="sev-pill"><div class="sev-dot" style="background:#ef4444"></div><span class="sev-txt">Critical</span><span class="sev-n">${counts.critical}</span></div>
    <div class="sev-pill"><div class="sev-dot" style="background:#f97316"></div><span class="sev-txt">High</span><span class="sev-n">${counts.high}</span></div>
    <div class="sev-pill"><div class="sev-dot" style="background:#eab308"></div><span class="sev-txt">Medium</span><span class="sev-n">${counts.medium}</span></div>
    <div class="sev-pill"><div class="sev-dot" style="background:#22c55e"></div><span class="sev-txt">Low</span><span class="sev-n">${counts.low}</span></div>
    <div class="sev-pill"><div class="sev-dot" style="background:#3b82f6"></div><span class="sev-txt">Info</span><span class="sev-n">${counts.info}</span></div>
  </div>
</div>

<!-- BODY -->
<div class="body">

  <!-- 1. Audit Details -->
  <div class="section">
    <div class="section-hdr">
      <div class="section-num">1</div>
      <div class="section-title">Audit Details</div>
    </div>
    <div class="info-row">
      <div class="info-box"><div class="info-lbl">Client</div><div class="info-val">${audit.clientName || "—"}</div></div>
      <div class="info-box"><div class="info-lbl">Pentester</div><div class="info-val">${audit.pentesterName || "—"}</div></div>
      <div class="info-box"><div class="info-lbl">Scope / Targets</div><div class="info-val">${audit.scope || "—"}</div></div>
      <div class="info-box"><div class="info-lbl">Status</div><div class="info-val"><span class="status-badge">${(audit.status || "—").replace(/_/g, " ")}</span></div></div>
    </div>
  </div>

  <!-- 2. Executive Summary -->
  <div class="section">
    <div class="section-hdr">
      <div class="section-num">2</div>
      <div class="section-title">Executive Summary</div>
    </div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:22px 26px;font-size:14px;color:#475569;line-height:1.8">
      This report presents the results of a security audit performed on <strong style="color:#1e293b">${audit.scope || "the target systems"}</strong> for <strong style="color:#1e293b">${audit.clientName || "the client"}</strong>.
      The assessment identified a total of <strong style="color:#1e293b">${vulns.length} vulnerabilities</strong>
      ${counts.critical > 0 ? `, including <strong style="color:#ef4444">${counts.critical} Critical</strong>` : ""}
      ${counts.high > 0 ? ` and <strong style="color:#f97316">${counts.high} High</strong> severity issues` : ""}
      ${vulns.length === 0 ? " — no vulnerabilities were discovered during this audit" : ""}.
      ${counts.critical > 0 || counts.high > 0
        ? " Immediate remediation of critical and high severity findings is strongly recommended."
        : counts.medium > 0
        ? " The identified findings should be addressed in a timely manner to reduce exposure."
        : " The overall security posture appears satisfactory based on the scope of this audit."}
      A total of <strong style="color:#1e293b">${scans.length} scan${scans.length !== 1 ? "s" : ""}</strong> were performed during this engagement.
    </div>
  </div>

  <!-- 3. Vulnerabilities -->
  <div class="section">
    <div class="section-hdr">
      <div class="section-num">3</div>
      <div class="section-title">Vulnerabilities</div>
      <div class="section-cnt">${vulns.length} found</div>
    </div>
    ${vulns.length === 0
      ? '<div class="empty-state">&#10003; No vulnerabilities were reported for this audit.</div>'
      : vulnCards
    }
  </div>

  <!-- 4. Scan Results -->
  <div class="section">
    <div class="section-hdr">
      <div class="section-num">4</div>
      <div class="section-title">Scan Results</div>
      <div class="section-cnt">${scans.length} scans</div>
    </div>
    ${scans.length === 0
      ? '<div class="empty-state">No scan results have been recorded for this audit.</div>'
      : scanCards
    }
  </div>

  <!-- 5. Recommendations -->
  <div class="section">
    <div class="section-hdr">
      <div class="section-num">5</div>
      <div class="section-title">Recommendations</div>
    </div>
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:22px 26px">
      ${counts.critical > 0 ? `<div style="display:flex;gap:10px;margin-bottom:12px"><span style="color:#ef4444;font-weight:800;font-size:13px">&#9679; Critical:</span><span style="font-size:13px;color:#475569">Address all ${counts.critical} critical finding(s) immediately. These represent a direct and urgent risk to operations.</span></div>` : ""}
      ${counts.high > 0 ? `<div style="display:flex;gap:10px;margin-bottom:12px"><span style="color:#f97316;font-weight:800;font-size:13px">&#9679; High:</span><span style="font-size:13px;color:#475569">Remediate ${counts.high} high severity finding(s) within 7 days. Prioritize patch deployment and access control review.</span></div>` : ""}
      ${counts.medium > 0 ? `<div style="display:flex;gap:10px;margin-bottom:12px"><span style="color:#eab308;font-weight:800;font-size:13px">&#9679; Medium:</span><span style="font-size:13px;color:#475569">Plan remediation of ${counts.medium} medium severity finding(s) within 30 days. Review configuration hardening guides.</span></div>` : ""}
      ${counts.low > 0 ? `<div style="display:flex;gap:10px;margin-bottom:12px"><span style="color:#22c55e;font-weight:800;font-size:13px">&#9679; Low:</span><span style="font-size:13px;color:#475569">${counts.low} low severity finding(s) should be tracked and addressed during regular maintenance cycles.</span></div>` : ""}
      ${vulns.length === 0 ? `<div style="font-size:13px;color:#1e40af;font-weight:600">&#10003; No vulnerabilities found. Continue regular security assessments to maintain this posture.</div>` : ""}
      <div style="margin-top:14px;padding-top:14px;border-top:1px solid #bfdbfe;font-size:12px;color:#64748b">
        For further guidance or to schedule a follow-up assessment, contact SecOps at <strong>gabiselt777@gmail.com</strong>
      </div>
    </div>
  </div>

</div>

<!-- FOOTER -->
<div class="page-footer">
  <div class="footer-l">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="18" height="21" style="flex-shrink:0">
      <path d="M60 8 L104 26 L104 68 C104 92 84 112 60 122 C36 112 16 92 16 68 L16 26 Z" fill="#dbeafe" stroke="#2563eb" stroke-width="6" stroke-linejoin="round"/>
    </svg>
    <span><strong>Sec<span style="color:#2563eb">Ops</span></strong> &mdash; Confidential Security Report &mdash; ${reportId}</span>
  </div>
  <div class="footer-r">&copy; ${new Date().getFullYear()} SecOps. All rights reserved. Empowering Algerian SMEs with enterprise security.</div>
</div>

</body></html>`;

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 800);
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
