

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  Shield, Users, ClipboardList, LogOut, Clock,
  UserCheck, BarChart2, RefreshCw, AlertTriangle, Moon, Sun, Languages, Bug, UserCog, Trash2, UserPlus, X, Eye, EyeOff,
} from "lucide-react";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

import { useAuth } from "../contexts/AuthContext";

import { useTheme } from "../contexts/ThemeContext";

import { useLang } from "../contexts/LanguageContext";

import { getAllAudits, getAllPentesters, assignAudit, getAllUsers, deleteAudit, adminCreateUser } from "../services/firestoreService";

const PIE_COLORS = ["#facc15", "#3b82f6", "#a855f7", "#22c55e"];

const STATUS_BADGE = {
  pending:     "bg-yellow-400/15 text-yellow-400 border-yellow-400/30",
  assigned:    "bg-blue-400/15 text-blue-400 border-blue-400/30",
  in_progress: "bg-purple-400/15 text-purple-400 border-purple-400/30",
  completed:   "bg-green-400/15 text-green-400 border-green-400/30",
};

const ROLE_BADGE = {
  admin:     "bg-red-400/15 text-red-400 border-red-400/30",
  pentester: "bg-blue-400/15 text-blue-400 border-blue-400/30",
  client:    "bg-green-400/15 text-green-400 border-green-400/30",
};

const STATUS_FILTER = ["all", "pending", "assigned", "in_progress", "completed"];

const AdminDashboard = () => {

  const { userProfile, logout } = useAuth();

  const { isDark, toggleTheme } = useTheme();

  const { t, toggleLang } = useLang();
  
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  
  const [audits, setAudits] = useState([]);
  
  const [pentesters, setPentesters] = useState([]);
  
  const [users, setUsers] = useState([]);
  
  const [loading, setLoading] = useState(true);
  
  const [assigning, setAssigning] = useState(null);

  const [selectedPentester, setSelectedPentester] = useState({});
  
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [deleting, setDeleting] = useState(null);

  const [showAddUser, setShowAddUser] = useState(false);
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  const [addUserForm, setAddUserForm] = useState({ name: "", email: "", password: "", role: "client", phone: "", serviceType: "starter" });
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const bg        = isDark ? "bg-[#060b17]"   : "bg-slate-100";
  
  const sidebarBg = isDark ? "bg-[#080f23]"   : "bg-white";
  
  const cardBg    = isDark ? "bg-white/[0.04] backdrop-blur-xl border-white/[0.08]" : "bg-white border-slate-200 shadow-sm";
  
  const headerBg  = isDark ? "bg-[#060b17]/80 backdrop-blur-xl border-white/[0.06]" : "bg-white/90 border-slate-200";
  
  const text      = isDark ? "text-white"      : "text-slate-900";
  
  const muted     = isDark ? "text-white/50"   : "text-slate-500";
  
  const inputBg   = isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-100 border-slate-300 text-slate-800";
  
  const rowHover  = isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50";
  
  const divider   = isDark ? "divide-white/[0.06]" : "divide-slate-100";
  
  const sideBorder = isDark ? "border-white/[0.06]" : "border-slate-100";
  
  const tooltipStyle = {
    backgroundColor: isDark ? "#080f23" : "#fff",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
    borderRadius: "8px",
    color: isDark ? "#fff" : "#0f172a",
  };

  const fetchData = async () => {
    setLoading(true);
    const [a, p, u] = await Promise.all([getAllAudits(), getAllPentesters(), getAllUsers()]);
    setAudits(a);
    setPentesters(p);
    setUsers(u);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = async () => { await logout(); navigate("/signin"); };

  const handleDelete = async (auditId) => {
    setDeleting(auditId);
    await deleteAudit(auditId);
    setAudits((prev) => prev.filter((a) => a.id !== auditId));
    setConfirmDelete(null);
    setDeleting(null);
  };

  const handleAssign = async (auditId) => {
    const pid = selectedPentester[auditId];
    if (!pid) return;
    const pentester = pentesters.find((p) => p.uid === pid);
    setAssigning(auditId);
    await assignAudit(auditId, pid, pentester?.name || "");
    await fetchData();
    setAssigning(null);
    setSelectedPentester((prev) => { const n = { ...prev }; delete n[auditId]; return n; });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddUserLoading(true);
    setAddUserError("");
    try {
      await adminCreateUser(addUserForm);
      await fetchData();
      setShowAddUser(false);
      setAddUserForm({ name: "", email: "", password: "", role: "client", phone: "", serviceType: "starter" });
    } catch (err) {
      setAddUserError(err.message);
    } finally {
      setAddUserLoading(false);
    }
  };

  const statusCounts = ["pending", "assigned", "in_progress", "completed"].map((s) => ({
    name: t(`status.${s}`),
    value: audits.filter((a) => a.status === s).length,
  }));

  const barData = pentesters.map((p) => ({
    name: p.name.split(" ")[0],
    audits: audits.filter((a) => a.pentesterId === p.uid).length,
  }));

  const stats = [
    { label: t("dash.totalAudits"), value: audits.length,
      icon: ClipboardList, iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",   glow: "shadow-blue-500/30" },
    { label: t("dash.pending"),     value: audits.filter((a) => a.status === "pending").length,
      icon: Clock,         iconBg: "bg-gradient-to-br from-yellow-400 to-orange-500", glow: "shadow-yellow-500/30" },
    { label: t("dash.inProgress"),  value: audits.filter((a) => a.status === "assigned" || a.status === "in_progress").length,
      icon: AlertTriangle, iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",   glow: "shadow-purple-500/30" },
    { label: t("dash.totalUsers"),  value: users.length,
      icon: Users,         iconBg: "bg-gradient-to-br from-green-400 to-teal-500",    glow: "shadow-green-500/30" },
  ];

  const filteredAudits = statusFilter === "all" ? audits : audits.filter((a) => a.status === statusFilter);

  const sidebarItems = [
    { key: "overview",   label: t("dash.overview"),   icon: BarChart2,     badge: null },
    { key: "all-audits", label: t("dash.allAudits"),  icon: ClipboardList, badge: audits.filter((a) => a.status === "pending").length || null },
    { key: "pentesters", label: t("dash.pentesters"), icon: Bug,           badge: null },
    { key: "users",      label: t("dash.users"),      icon: UserCog,       badge: null },
  ];

  return (
    
    <div className={`min-h-screen flex ${bg} transition-colors duration-300`}>

      {}
      {}
      {}
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
              <p className={`text-xs ${muted}`}>{t("dash.adminPanel")}</p>
            </div>
          </div>
        </div>

        {}
        {}
        {}
        {}
        {}
        <nav className="flex-1 p-3 space-y-1">
          <p className={`px-3 py-2 text-xs font-semibold uppercase tracking-widest ${muted}`}>{t("dash.navigation")}</p>
          {sidebarItems.map(({ key, label, icon: Icon, badge }) => (
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
              {}
              {badge > 0 && (
                <span className="ms-auto bg-yellow-400/20 text-yellow-400 text-xs px-1.5 py-0.5 rounded-full border border-yellow-400/30">{badge}</span>
              )}
            </button>
          ))}
        </nav>

        {}
        {}
        <div className={`p-3 border-t ${sideBorder} space-y-2`}>

          {}
          {}
          {}
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${isDark ? "bg-white/[0.03] border border-white/[0.06]" : "bg-slate-50 border border-slate-100"}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 text-white text-sm font-bold shadow-md shadow-blue-500/30">
              {userProfile?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-medium truncate ${text}`}>{userProfile?.name}</p>
              <p className={`text-xs capitalize ${muted}`}>{t("auth.roles.admin")}</p>
            </div>
          </div>

          {}
          {}
          {}
          <div className="flex items-center gap-2 px-1">
            <button onClick={toggleTheme} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs border transition-all ${isDark ? "border-white/10 text-white/50 hover:text-white hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-100"}`}>
              {isDark ? <><Sun className="w-3.5 h-3.5" /> Light</> : <><Moon className="w-3.5 h-3.5" /> Dark</>}
            </button>
            <button onClick={toggleLang} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs border transition-all ${isDark ? "border-white/10 text-white/50 hover:text-white hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-100"}`}>
              <Languages className="w-3.5 h-3.5" /> {t("nav.toggleLang")}
            </button>
          </div>

          {}
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
        {}
        {}
        <header className={`sticky top-0 z-10 ${headerBg} border-b px-8 py-4 flex items-center justify-between`}>
          <div>
            <h1 className={`text-lg font-bold ${text}`}>{t("dash.adminDashboard")}</h1>
            <p className={`text-xs ${muted}`}>{t("dash.welcomeAdmin")} {userProfile?.name}</p>
          </div>
          <button onClick={fetchData} className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-all ${isDark ? "border-white/10 text-white/50 hover:text-white hover:border-blue-500/40 hover:bg-blue-500/5" : "border-slate-200 text-slate-500 hover:text-blue-600"}`}>
            <RefreshCw className="w-4 h-4" /> {t("dash.refresh")}
          </button>
        </header>

        {}
        {}
        <main className="flex-1 p-8 space-y-8">

          {}
          {}
          {}
          {}
          {}
          {activeTab === "overview" && (
            <>
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
              <div className="grid lg:grid-cols-2 gap-6">

                {}
                {}
                {}
                <div className={`p-6 rounded-2xl border ${cardBg}`}>
                  <h2 className={`text-sm font-semibold ${text} mb-5`}>{t("dash.auditStatusChart")}</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={statusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {statusCounts.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Legend />
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {}
                {}
                {}
                <div className={`p-6 rounded-2xl border ${cardBg}`}>
                  <h2 className={`text-sm font-semibold ${text} mb-5`}>{t("dash.auditsPerPentester")}</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={barData}>
                      {}
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                      </defs>
                      {}
                      <XAxis dataKey="name" stroke={isDark ? "#ffffff20" : "#94a3b8"} tick={{ fill: isDark ? "#ffffff50" : "#64748b" }} />
                      {}
                      <YAxis stroke={isDark ? "#ffffff20" : "#94a3b8"} tick={{ fill: isDark ? "#ffffff50" : "#64748b" }} allowDecimals={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      {}
                      <Bar dataKey="audits" fill={isDark ? "url(#barGrad)" : "#3b82f6"} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {}
              {}
              {}
              {}
              <div className={`rounded-2xl border ${cardBg} overflow-hidden`}>
                <div className={`px-6 py-4 border-b ${sideBorder} flex items-center justify-between`}>
                  <h2 className={`font-semibold ${text}`}>{t("dash.recentAudits")}</h2>
                  <button onClick={() => setActiveTab("all-audits")} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    {t("dash.allAudits")} →
                  </button>
                </div>
                <AuditTableRows audits={audits.filter((a) => a.status === "pending").slice(0, 5)} pentesters={pentesters} selectedPentester={selectedPentester} setSelectedPentester={setSelectedPentester} handleAssign={handleAssign} assigning={assigning} loading={loading} t={t} isDark={isDark} muted={muted} text={text} rowHover={rowHover} divider={divider} inputBg={inputBg} sideBorder={sideBorder} noMsg={t("dash.noAudits")} confirmDelete={confirmDelete} setConfirmDelete={setConfirmDelete} handleDelete={handleDelete} deleting={deleting} />
              </div>
            </>
          )}

          {}
          {}
          {}
          {}
          {}
          {}
          {}
          {activeTab === "all-audits" && (
            <div className={`rounded-2xl border ${cardBg} overflow-hidden`}>
              {}
              <div className={`px-6 py-4 border-b ${sideBorder}`}>
                <h2 className={`font-semibold ${text} mb-4`}>{t("dash.auditAssignment")}</h2>
                {}
                <div className="flex flex-wrap gap-2">
                  {STATUS_FILTER.map((f) => (
                    <button key={f} onClick={() => setStatusFilter(f)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all capitalize ${
                        statusFilter === f
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/20"
                          : isDark ? "bg-white/5 text-white/50 hover:text-white border border-white/10" : "bg-slate-100 text-slate-500 hover:text-slate-900"
                      }`}>
                      {f === "all" ? t("common.all") : t(`status.${f}`)}
                    </button>
                  ))}
                </div>
              </div>
              {}
              {}
              <AuditTableRows audits={filteredAudits} pentesters={pentesters} selectedPentester={selectedPentester} setSelectedPentester={setSelectedPentester} handleAssign={handleAssign} assigning={assigning} loading={loading} t={t} isDark={isDark} muted={muted} text={text} rowHover={rowHover} divider={divider} inputBg={inputBg} sideBorder={sideBorder} noMsg={t("dash.noAudits")} confirmDelete={confirmDelete} setConfirmDelete={setConfirmDelete} handleDelete={handleDelete} deleting={deleting} />
            </div>
          )}

          {}
          {}
          {}
          {}
          {}
          {activeTab === "pentesters" && (
            <div className="space-y-6">
              <h2 className={`text-lg font-bold ${text}`}>{t("dash.pentesterList")}</h2>
              {}
              {loading ? (
                <p className={muted}>{t("common.loading")}</p>
              ) : pentesters.length === 0 ? (
                
                <div className={`p-12 rounded-2xl border ${cardBg} text-center ${muted}`}>{t("dash.noPentesters")}</div>
              ) : (
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pentesters.map((p) => {
                    
                    const active = audits.filter((a) => a.pentesterId === p.uid && a.status !== "completed").length;
                    
                    const done   = audits.filter((a) => a.pentesterId === p.uid && a.status === "completed").length;
                    return (
                      <div key={p.uid} className={`p-5 rounded-2xl border ${cardBg} flex flex-col gap-3 hover:border-blue-500/30 transition-all`}>
                        {}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/30">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className={`font-semibold truncate ${text}`}>{p.name}</p>
                            <p className={`text-xs truncate ${muted}`}>{p.email}</p>
                          </div>
                        </div>
                        {}
                        <div className={`pt-3 border-t ${sideBorder} flex items-center justify-around`}>
                          <div className="text-center">
                            <p className={`text-xl font-bold ${text}`}>{active}</p>
                            <p className={`text-xs ${muted}`}>{t("dash.inProgress")}</p>
                          </div>
                          {}
                          <div className={`w-px h-8 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                          <div className="text-center">
                            <p className="text-xl font-bold text-green-400">{done}</p>
                            <p className={`text-xs ${muted}`}>{t("dash.completed")}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {}
          {}
          {}
          {}
          {}
          {}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-bold ${text}`}>{t("dash.allUsers")}</h2>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${muted}`}>{users.length} {t("dash.total")}</span>
                  <button
                    onClick={() => { setShowAddUser(true); setAddUserError(""); }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all"
                  >
                    <UserPlus className="w-4 h-4" /> Add User
                  </button>
                </div>
              </div>

              {/* Filter bar */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-1.5">
                  {["all", "client", "pentester", "admin"].map((role) => (
                    <button
                      key={role}
                      onClick={() => setUserRoleFilter(role)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all border ${
                        userRoleFilter === role
                          ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20"
                          : isDark
                          ? "bg-white/5 border-white/10 text-zinc-400 hover:text-zinc-100 hover:bg-white/10"
                          : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                      }`}
                    >
                      {role === "all" ? t("common.all") : t(`auth.roles.${role}`) || role}
                      <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        userRoleFilter === role ? "bg-white/20" : isDark ? "bg-white/10" : "bg-slate-200"
                      }`}>
                        {role === "all" ? users.length : users.filter(u => u.role === role).length}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by name or email…"
                  className={`flex-1 min-w-[180px] px-3 py-1.5 rounded-lg text-sm border outline-none transition-colors ${inputBg}`}
                />
              </div>

              {/* Add User Modal */}
              {showAddUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <div className={`w-full max-w-md rounded-2xl border shadow-2xl ${isDark ? "bg-[#080f23] border-white/10" : "bg-white border-slate-200"}`}>
                    <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? "border-white/10" : "border-slate-100"}`}>
                      <h3 className={`font-bold text-base ${text}`}>Add New User</h3>
                      <button onClick={() => setShowAddUser(false)} className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/50 hover:text-white" : "hover:bg-slate-100 text-slate-400"}`}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <form onSubmit={handleAddUser} className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Full Name *</label>
                          <input required value={addUserForm.name} onChange={(e) => setAddUserForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder="John Doe"
                            className={`w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/40 ${inputBg}`} />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Phone</label>
                          <input value={addUserForm.phone} onChange={(e) => setAddUserForm((f) => ({ ...f, phone: e.target.value }))}
                            placeholder="+213 ..."
                            className={`w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/40 ${inputBg}`} />
                        </div>
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Email *</label>
                        <input required type="email" value={addUserForm.email} onChange={(e) => setAddUserForm((f) => ({ ...f, email: e.target.value }))}
                          placeholder="user@example.com"
                          className={`w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/40 ${inputBg}`} />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Password *</label>
                        <div className="relative">
                          <input required type={showPassword ? "text" : "password"} minLength={6} value={addUserForm.password} onChange={(e) => setAddUserForm((f) => ({ ...f, password: e.target.value }))}
                            placeholder="Min 6 characters"
                            className={`w-full px-3 py-2 pr-10 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/40 ${inputBg}`} />
                          <button type="button" onClick={() => setShowPassword((v) => !v)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${muted}`}>
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Role *</label>
                          <select value={addUserForm.role} onChange={(e) => setAddUserForm((f) => ({ ...f, role: e.target.value }))}
                            className={`w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/40 ${inputBg}`}>
                            <option value="client">Client</option>
                            <option value="pentester">Pentester</option>
                          </select>
                        </div>
                        {addUserForm.role === "client" && (
                          <div>
                            <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Service Plan</label>
                            <select value={addUserForm.serviceType} onChange={(e) => setAddUserForm((f) => ({ ...f, serviceType: e.target.value }))}
                              className={`w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/40 ${inputBg}`}>
                              <option value="starter">Starter</option>
                              <option value="growth">Growth</option>
                              <option value="enterprise">Enterprise</option>
                            </select>
                          </div>
                        )}
                      </div>
                      {addUserError && (
                        <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{addUserError}</p>
                      )}
                      <div className="flex gap-3 pt-1">
                        <button type="button" onClick={() => setShowAddUser(false)}
                          className={`flex-1 py-2 rounded-xl text-sm border transition-all ${isDark ? "border-white/10 text-white/50 hover:text-white hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                          Cancel
                        </button>
                        <button type="submit" disabled={addUserLoading}
                          className="flex-1 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20">
                          {addUserLoading ? "Creating…" : "Create User"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {}
              {loading ? (
                <p className={muted}>{t("common.loading")}</p>
              ) : (() => {
                const filtered = users.filter((u) => {
                  const matchRole = userRoleFilter === "all" || u.role === userRoleFilter;
                  const q = userSearch.toLowerCase();
                  const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
                  return matchRole && matchSearch;
                });
                return filtered.length === 0 ? (
                  <div className={`p-12 rounded-2xl border ${cardBg} text-center ${muted}`}>
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    {userSearch || userRoleFilter !== "all" ? "No users match your filter." : t("dash.noUsers")}
                  </div>
                ) : (
                <div className={`rounded-2xl border ${cardBg} overflow-hidden`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={`border-b ${sideBorder} ${muted} text-xs uppercase tracking-wider`}>
                          {[t("dash.userName"), t("dash.userEmail"), t("dash.userRole"), t("dash.userSince")].map((h, i) => (
                            <th key={i} className="px-6 py-3 font-semibold text-start">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${divider}`}>
                        {filtered.map((u) => (
                          <tr key={u.uid} className={`${rowHover} transition-colors`}>
                            {}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-md shadow-blue-500/20">
                                  {u.name?.charAt(0).toUpperCase()}
                                </div>
                                <p className={`font-medium ${text}`}>{u.name}</p>
                              </div>
                            </td>
                            {}
                            <td className={`px-6 py-4 ${muted}`}>{u.email}</td>
                            {}
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${ROLE_BADGE[u.role] || ""}`}>
                                {t(`auth.roles.${u.role}`) || u.role}
                              </span>
                            </td>
                            {}
                            <td className={`px-6 py-4 ${muted} text-xs`}>
                              {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                );
              })()}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const AuditTableRows = ({ audits, pentesters, selectedPentester, setSelectedPentester, handleAssign, assigning, loading, t, isDark, muted, text, rowHover, divider, inputBg, sideBorder, noMsg, confirmDelete, setConfirmDelete, handleDelete, deleting }) => {
  
  if (loading) return <div className={`p-12 text-center ${muted}`}>{t("common.loading")}</div>;
  
  if (audits.length === 0) return (
    <div className={`p-12 text-center ${muted}`}>
      <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
      {noMsg}
    </div>
  );
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        {}
        {}
        <thead>
          <tr className={`border-b ${sideBorder} ${muted} text-left text-xs uppercase tracking-wider`}>
            {[t("dash.auditTitle"), t("dash.client"), t("dash.status"), t("dash.assignTo"), "", ""].map((h, i) => (
              <th key={i} className="px-6 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        {}
        <tbody className={`divide-y ${divider}`}>
          {audits.map((audit) => (
            <tr key={audit.id} className={`${rowHover} transition-colors`}>
              {}
              {}
              <td className="px-6 py-4">
                <p className={`font-medium ${text}`}>{audit.title}</p>
                <p className={`text-xs ${muted} truncate max-w-[180px]`}>{audit.scope}</p>
              </td>
              {}
              <td className={`px-6 py-4 ${muted}`}>{audit.clientName}</td>
              {}
              {}
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${STATUS_BADGE[audit.status] || ""}`}>
                  {t(`status.${audit.status}`) || audit.status}
                </span>
              </td>
              {}
              {}
              {}
              <td className="px-6 py-4">
                {audit.status === "pending" ? (
                  <select value={selectedPentester[audit.id] || ""}
                    onChange={(e) => setSelectedPentester((p) => ({ ...p, [audit.id]: e.target.value }))}
                    style={{ colorScheme: "light" }}
                    className={`rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 border ${isDark ? "bg-[#1e2a50] border-white/10 text-white" : "bg-slate-100 border-slate-300 text-slate-800"}`}>
                    <option value="">{t("dash.selectPentester")}</option>
                    {pentesters.map((p) => <option key={p.uid} value={p.uid}>{p.name}</option>)}
                  </select>
                ) : (
                  <span className={`text-xs ${muted}`}>{audit.pentesterName || "—"}</span>
                )}
              </td>
              {}
              {}
              {}
              <td className="px-6 py-4">
                {audit.status === "pending" && (
                  <button onClick={() => handleAssign(audit.id)} disabled={!selectedPentester[audit.id] || assigning === audit.id}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-semibold text-white transition-all shadow-sm shadow-blue-500/20">
                    {assigning === audit.id ? t("dash.assigning") : t("dash.assign")}
                  </button>
                )}
              </td>
              {}
              {}
              {}
              {}
              <td className="px-6 py-4">
                {confirmDelete === audit.id ? (
                  
                  <div className="flex items-center gap-1.5">
                    {}
                    <button onClick={() => handleDelete(audit.id)} disabled={deleting === audit.id}
                      className="px-2.5 py-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-lg text-xs font-semibold text-white transition-colors">
                      {deleting === audit.id ? "…" : t("common.confirmDelete")}
                    </button>
                    {}
                    <button onClick={() => setConfirmDelete(null)}
                      className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${isDark ? "border-white/10 text-white/50 hover:text-white" : "border-slate-200 text-slate-500 hover:text-slate-800"}`}>
                      {t("common.cancel")}
                    </button>
                  </div>
                ) : (
                  
                  <button onClick={() => setConfirmDelete(audit.id)}
                    className="p-1.5 rounded-lg transition-colors text-red-400/60 hover:text-red-400 hover:bg-red-400/10"
                    title={t("common.delete")}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
