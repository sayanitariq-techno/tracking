import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Mail, Upload, Users, PieChart as PieChartIcon,
  Phone, CheckCircle2, AlertTriangle, Clock, FileSpreadsheet,
  ChevronRight, Search, Filter, Smartphone, Building2,
  ShieldCheck, Send, Plus, Download, Trash2, PencilLine
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import * as XLSX from "xlsx";

/**
 * Techno Messaging Platform — Single-file React app
 * - Dashboard for Email, WhatsApp/Text SMS campaigns, and Gate Pass process
 * - Contact management (clients & manpower)
 * - Message composer with templates
 * - Excel/CSV upload and local persistence
 * - Shutdown availability tracking & notifications
 * - Gate pass step-by-step tracking with WhatsApp outreach
 * - Real-time analytics (mock + live from actions)
 * - Mobile responsive, modern gradients, clean cards, smooth animations
 */

// Utilities
const gradientBg =
  "bg-[radial-gradient(1200px_600px_at_-10%_-10%,#1e3a8a22,transparent_60%),radial-gradient(1000px_500px_at_110%_-20%,#6d28d922,transparent_60%),radial-gradient(800px_400px_at_50%_120%,#0ea5e922,transparent_60%)]";

const cardClass =
  "rounded-2xl shadow-lg border border-white/10 bg-white/5 backdrop-blur p-4 md:p-6 hover:shadow-xl transition-shadow";

const pill = "px-2.5 py-1 rounded-full text-xs font-medium";

const STATUS = [
  { key: "applied", label: "Applied", color: "bg-blue-100 text-blue-700" },
  { key: "docs", label: "Docs Submitted", color: "bg-amber-100 text-amber-700" },
  { key: "approved", label: "Approved", color: "bg-emerald-100 text-emerald-700" },
  { key: "issued", label: "Gate Pass Issued", color: "bg-purple-100 text-purple-700" },
  { key: "denied", label: "Denied", color: "bg-rose-100 text-rose-700" },
];

const defaultTemplates = {
  clientEmail: [
    {
      name: "Project Update",
      subject: "Weekly Update: Progress & Next Steps",
      body:
        "Hello {{name}},\n\nHere is the weekly update for {{project}}. Key milestones achieved, blockers, and upcoming activities are summarized in the dashboard.\n\nBest regards,\n{{sender}}",
    },
    {
      name: "Shutdown Notification",
      subject: "Planned Shutdown — Availability & Support",
      body:
        "Dear {{name}},\n\nPlease be informed of the planned shutdown from {{from_date}} to {{to_date}}. Kindly confirm availability and gate pass requirements.\n\nThanks,\n{{sender}}",
    },
  ],
  manpowerWhatsApp: [
    {
      name: "Gate Pass Follow-up",
      text:
        "Hi {{name}}, this is a reminder to complete your gate pass process. Current status: {{status}}. Please share any pending documents.",
    },
    {
      name: "Shift Availability",
      text:
        "Hello {{name}}, please confirm your availability for the shutdown window {{from_date}}–{{to_date}}.",
    },
  ],
};

// Local storage helpers
const saveLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const readLS = (k, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(k));
    return v ?? fallback;
  } catch {
    return fallback;
  }
};

// CSV helper if XLSX fails
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = lines.shift().split(",").map((h) => h.trim());
  return lines.map((line) => {
    const parts = line.split(",");
    const o = {};
    headers.forEach((h, i) => (o[h] = (parts[i] || "").trim()));
    return o;
  });
}

// Seed data (minimal)
const seedClients = [
  { id: 1, name: "Apex Petrochem", email: "ops@apexpetro.com", project: "Turnaround-42", company: "Apex", phone: "+91 90000 00001" },
  { id: 2, name: "Nova Power Ltd", email: "maintenance@novapower.in", project: "Unit-3 Upgrade", company: "Nova", phone: "+91 90000 00002" },
];

const seedManpower = [
  { id: 1, name: "Rahul Singh", phone: "+91 98989 11111", role: "Fitter", status: "docs" },
  { id: 2, name: "Anita Kumar", phone: "+91 97777 22222", role: "Welder", status: "applied" },
  { id: 3, name: "Javed Ansari", phone: "+91 96666 33333", role: "Rigger", status: "approved" },
];

export default function TechnoMessagingDashboard() {
  const [tab, setTab] = useState("dashboard");
  const [clients, setClients] = useState(() => readLS("clients", seedClients));
  const [manpower, setManpower] = useState(() => readLS("manpower", seedManpower));
  const [availability, setAvailability] = useState(() => readLS("availability", []));
  const [notifications, setNotifications] = useState(() => readLS("notifications", []));
  const [campaigns, setCampaigns] = useState(() => readLS("campaigns", []));
  const [templates, setTemplates] = useState(() => readLS("templates", defaultTemplates));
  const [filter, setFilter] = useState("");

  // Persist
  useEffect(() => saveLS("clients", clients), [clients]);
  useEffect(() => saveLS("manpower", manpower), [manpower]);
  useEffect(() => saveLS("availability", availability), [availability]);
  useEffect(() => saveLS("notifications", notifications), [notifications]);
  useEffect(() => saveLS("campaigns", campaigns), [campaigns]);
  useEffect(() => saveLS("templates", templates), [templates]);

  // Derived metrics
  const metrics = useMemo(() => {
    const totalClients = clients.length;
    const totalManpower = manpower.length;
    const byStatus = STATUS.reduce((acc, s) => {
      acc[s.key] = manpower.filter((m) => m.status === s.key).length;
      return acc;
    }, {});
    const pending = byStatus.applied + byStatus.docs;
    const completed = byStatus.issued + byStatus.approved;
    return { totalClients, totalManpower, byStatus, pending, completed };
  }, [clients, manpower]);

  // Analytics sample series
  const lineSeries = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 8 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (7 - i));
      const label = `${d.getDate()}/${d.getMonth() + 1}`;
      return {
        day: label,
        emails: Math.floor(20 + Math.random() * 30),
        whatsapp: Math.floor(25 + Math.random() * 35),
      };
    });
  }, [campaigns.length, notifications.length]);

  const pieData = useMemo(() => [
    { name: "Applied", value: metrics.byStatus.applied },
    { name: "Docs", value: metrics.byStatus.docs },
    { name: "Approved", value: metrics.byStatus.approved },
    { name: "Issued", value: metrics.byStatus.issued },
    { name: "Denied", value: metrics.byStatus.denied },
  ], [metrics]);

  // Actions
  const addNotification = (text) =>
    setNotifications((n) => [{ id: Date.now(), text, at: new Date().toISOString() }, ...n].slice(0, 40));

  const updateManpowerStatus = (id, status) => {
    setManpower((arr) => arr.map((m) => (m.id === id ? { ...m, status } : m)));
    const mp = manpower.find((m) => m.id === id);
    addNotification(`Gate Pass status for ${mp?.name || id} → ${STATUS.find(s=>s.key===status)?.label}`);
  };

  const handleUpload = async (file, type) => {
    try {
      const buf = await file.arrayBuffer();
      const workbook = XLSX.read(buf, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      if (type === "clients") {
        const mapped = json.map((r, idx) => ({
          id: Date.now() + idx,
          name: r.name || r.Name || r.client || "Unnamed",
          email: r.email || r.Email || "",
          project: r.project || r.Project || "",
          company: r.company || r.Company || "",
          phone: r.phone || r.Phone || r.Mobile || "",
        }));
        setClients((c) => [...c, ...mapped]);
        addNotification(`Imported ${mapped.length} clients from Excel`);
      } else {
        const mapped = json.map((r, idx) => ({
          id: Date.now() + idx,
          name: r.name || r.Name || r.fullname || "Unnamed",
          phone: r.phone || r.Phone || r.Mobile || "",
          role: r.role || r.Role || r.Skill || "",
          status: (r.status || "applied").toString().toLowerCase(),
        }));
        setManpower((m) => [...m, ...mapped]);
        addNotification(`Imported ${mapped.length} manpower records from Excel`);
      }
    } catch (e) {
      // Fallback to CSV
      const text = await file.text();
      const rows = parseCSV(text);
      if (type === "clients") {
        const mapped = rows.map((r, idx) => ({
          id: Date.now() + idx,
          name: r.name || r.Name || r.client || "Unnamed",
          email: r.email || r.Email || "",
          project: r.project || r.Project || "",
          company: r.company || r.Company || "",
          phone: r.phone || r.Phone || r.Mobile || "",
        }));
        setClients((c) => [...c, ...mapped]);
        addNotification(`Imported ${mapped.length} clients from CSV`);
      } else {
        const mapped = rows.map((r, idx) => ({
          id: Date.now() + idx,
          name: r.name || r.Name || r.fullname || "Unnamed",
          phone: r.phone || r.Phone || r.Mobile || "",
          role: r.role || r.Role || r.Skill || "",
          status: (r.status || "applied").toString().toLowerCase(),
        }));
        setManpower((m) => [...m, ...mapped]);
        addNotification(`Imported ${mapped.length} manpower records from CSV`);
      }
    }
  };

  const filteredClients = useMemo(() =>
    clients.filter((c) =>
      [c.name, c.email, c.company, c.project, c.phone]
        .join(" ")
        .toLowerCase()
        .includes(filter.toLowerCase())
    ), [clients, filter]
  );

  const filteredManpower = useMemo(() =>
    manpower.filter((m) =>
      [m.name, m.phone, m.role, m.status]
        .join(" ")
        .toLowerCase()
        .includes(filter.toLowerCase())
    ), [manpower, filter]
  );

  return (
    <div className={`min-h-screen text-slate-100 ${gradientBg}`}>
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
          <Smartphone className="w-6 h-6 text-indigo-300" />
          <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Techno Messaging Platform</h1>
          <span className={`${pill} bg-indigo-500/10 text-indigo-300 ml-2`}>v1.0</span>
          <div className="ml-auto flex items-center gap-2 w-64">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search clients, manpower…"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
              />
            </div>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-4 md:px-6 pb-3 flex gap-2">
          {[
            { key: "dashboard", label: "Dashboard", icon: PieChartIcon },
            { key: "contacts", label: "Contacts", icon: Users },
            { key: "composer", label: "Composer", icon: MessageSquare },
            { key: "gatepass", label: "Gate Pass", icon: ShieldCheck },
            { key: "uploads", label: "Upload", icon: Upload },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${tab===key?"bg-indigo-500/20 border-indigo-400/40":"bg-white/5 border-white/10 hover:bg-white/10"}`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <AnimatePresence mode="wait">
          {tab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
              {/* KPI Cards */}
              <div className="grid md:grid-cols-4 gap-4">
                <KPI icon={Mail} title="Clients" value={metrics.totalClients} sub="Total in CRM" />
                <KPI icon={Users} title="Manpower" value={metrics.totalManpower} sub="Active records" />
                <KPI icon={ShieldCheck} title="Gate Pass - Completed" value={metrics.completed} sub="Approved/Issued" />
                <KPI icon={Clock} title="Gate Pass - Pending" value={metrics.pending} sub="Applied/Docs" />
              </div>

              {/* Campaign lanes */}
              <div className="grid lg:grid-cols-3 gap-4">
                <div className={`${cardClass} lg:col-span-2`}>
                  <SectionHeader icon={PieChartIcon} title="Engagement Overview" subtitle="Email & WhatsApp activity (last 7 days)" />
                  <div className="h-56 md:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineSeries}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="emails" />
                        <Line type="monotone" dataKey="whatsapp" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className={cardClass}>
                  <SectionHeader icon={ShieldCheck} title="Gate Pass Status" subtitle="Live process distribution" />
                  <div className="h-56 md:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100}>
                          {pieData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className={cardClass}>
                <SectionHeader icon={Bell} title="Notifications" subtitle="Auto-generated system events" />
                <ul className="divide-y divide-white/10">
                  {notifications.slice(0, 8).map((n) => (
                    <li key={n.id} className="py-3 flex items-center gap-3">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <div className="flex-1">
                        <div className="text-sm">{n.text}</div>
                        <div className="text-xs text-slate-400">{new Date(n.at).toLocaleString()}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {tab === "contacts" && (
            <motion.div key="contacts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-4">
                <div className={cardClass}>
                  <SectionHeader icon={Building2} title="Clients" subtitle="Manage client records" />
                  <ContactTable
                    rows={filteredClients}
                    columns={["name", "email", "company", "project", "phone"]}
                    actions={(row) => (
                      <div className="flex items-center gap-2">
                        <a
                          className="text-indigo-300 hover:underline"
                          href={`mailto:${encodeURIComponent(row.email)}?subject=${encodeURIComponent("Regarding " + (row.project || "your project"))}`}
                        >Email</a>
                        <a
                          className="text-emerald-300 hover:underline"
                          href={`https://wa.me/${row.phone.replace(/\D/g,"")}?text=${encodeURIComponent("Hello " + row.name + ", we would like to share an update on " + (row.project || "your project") + ".")}`}
                          target="_blank" rel="noreferrer"
                        >WhatsApp</a>
                      </div>
                    )}
                    onDelete={(id) => setClients((c) => c.filter((x) => x.id !== id))}
                  />
                </div>
                <div className={cardClass}>
                  <SectionHeader icon={Users} title="Manpower" subtitle="Track roles and gate pass status" />
                  <ManpowerTable
                    rows={filteredManpower}
                    onStatus={(id, st) => updateManpowerStatus(id, st)}
                    onDelete={(id) => setManpower((m) => m.filter((x) => x.id !== id))}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {tab === "composer" && (
            <motion.div key="composer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-4">
                <div className={`${cardClass} lg:col-span-2`}>
                  <SectionHeader icon={MessageSquare} title="Message Composer" subtitle="Email & WhatsApp templates" />
                  <Composer templates={templates} clients={clients} manpower={manpower} onSend={(type, payload)=>{
                    setCampaigns(c=>[{ id: Date.now(), type, payload, at: new Date().toISOString() }, ...c]);
                    addNotification(`${type.toUpperCase()} composed to ${payload.to?.name || payload.to?.phone || "recipient"}`);
                  }} />
                </div>
                <div className={cardClass}>
                  <SectionHeader icon={Clock} title="Shutdown Availability" subtitle="Track confirmations" />
                  <AvailabilityPanel availability={availability} setAvailability={setAvailability} manpower={manpower} addNotification={addNotification} />
                </div>
              </div>
            </motion.div>
          )}

          {tab === "gatepass" && (
            <motion.div key="gatepass" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
              <div className={cardClass}>
                <SectionHeader icon={ShieldCheck} title="Gate Pass Workflow" subtitle="Step-by-step tracking with WhatsApp follow-ups" />
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-slate-300">
                      <tr>
                        <th className="text-left py-2">Name</th>
                        <th className="text-left py-2">Role</th>
                        <th className="text-left py-2">Phone</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {manpower.map((m) => (
                        <tr key={m.id}>
                          <td className="py-3">{m.name}</td>
                          <td className="py-3">{m.role}</td>
                          <td className="py-3">{m.phone}</td>
                          <td className="py-3">
                            <select
                              value={m.status}
                              onChange={(e)=>updateManpowerStatus(m.id, e.target.value)}
                              className="bg-white/10 border border-white/10 rounded-lg px-2 py-1"
                            >
                              {STATUS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                            </select>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <a
                                className="inline-flex items-center gap-1 text-emerald-300 hover:underline"
                                href={`https://wa.me/${m.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${m.name}, your gate pass status is '${STATUS.find(s=>s.key===m.status)?.label}'. Please complete next steps if pending.`)}`}
                                target="_blank" rel="noreferrer"
                              >
                                <Send className="w-4 h-4"/> WhatsApp
                              </a>
                              <button className="text-rose-300 hover:text-rose-200" onClick={()=>setManpower(arr=>arr.filter(x=>x.id!==m.id))}><Trash2 className="w-4 h-4"/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {tab === "uploads" && (
            <motion.div key="uploads" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <UploadCard
                  title="Import Client Emails"
                  subtitle="Upload Excel (.xlsx) or CSV with columns: name, email, company, project, phone"
                  onFile={(f)=>handleUpload(f, "clients")}
                />
                <UploadCard
                  title="Import Manpower"
                  subtitle="Upload Excel (.xlsx) or CSV with columns: name, phone, role, status"
                  onFile={(f)=>handleUpload(f, "manpower")}
                />
              </div>
              <div className={cardClass}>
                <SectionHeader icon={FileSpreadsheet} title="Export Backup" subtitle="Download current data as JSON" />
                <div className="flex gap-3">
                  <DownloadButton label="Clients.json" data={clients} filename="clients.json" />
                  <DownloadButton label="Manpower.json" data={manpower} filename="manpower.json" />
                  <DownloadButton label="Availability.json" data={availability} filename="availability.json" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto px-4 md:px-6 py-8 text-xs text-slate-400">
        © {new Date().getFullYear()} Techno Messaging Platform · Designed for clarity and speed.
      </footer>
    </div>
  );
}

// ——— Components ———
function KPI({ icon: Icon, title, value, sub }) {
  return (
    <motion.div whileHover={{ y: -2 }} className={`${cardClass} flex items-center gap-4`}>
      <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/20">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-2xl font-semibold">{value}</div>
        <div className="text-sm text-slate-300">{title}</div>
        <div className="text-xs text-slate-400">{sub}</div>
      </div>
    </motion.div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/5 border border-white/10"><Icon className="w-4 h-4" /></div>
        <div>
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function ContactTable({ rows, columns, actions, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-slate-300">
          <tr>
            {columns.map((c) => (
              <th key={c} className="text-left py-2 capitalize">{c}</th>
            ))}
            <th className="text-left py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map((r) => (
            <tr key={r.id}>
              {columns.map((c) => (
                <td key={c} className="py-3 pr-4">{r[c]}</td>
              ))}
              <td className="py-3">
                <div className="flex items-center gap-3">
                  {actions?.(r)}
                  <button className="text-rose-300 hover:text-rose-200" onClick={()=>onDelete(r.id)}><Trash2 className="w-4 h-4"/></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ManpowerTable({ rows, onStatus, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-slate-300">
          <tr>
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Role</th>
            <th className="text-left py-2">Phone</th>
            <th className="text-left py-2">Status</th>
            <th className="text-left py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="py-3">{r.name}</td>
              <td className="py-3">{r.role}</td>
              <td className="py-3">{r.phone}</td>
              <td className="py-3">
                <span className={`${pill} ${STATUS.find(s=>s.key===r.status)?.color || "bg-slate-100 text-slate-700"}`}>{STATUS.find(s=>s.key===r.status)?.label || r.status}</span>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <select
                    value={r.status}
                    onChange={(e)=>onStatus(r.id, e.target.value)}
                    className="bg-white/10 border border-white/10 rounded-lg px-2 py-1"
                  >
                    {STATUS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                  <a
                    className="inline-flex items-center gap-1 text-emerald-300 hover:underline"
                    href={`https://wa.me/${r.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${r.name}, please note your gate pass status: '${STATUS.find(s=>s.key===r.status)?.label}'.`)}`}
                    target="_blank" rel="noreferrer"
                  >
                    <Send className="w-4 h-4"/> WhatsApp
                  </a>
                  <button className="text-rose-300 hover:text-rose-200" onClick={()=>onDelete(r.id)}><Trash2 className="w-4 h-4"/></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UploadCard({ title, subtitle, onFile }) {
  const [drag, setDrag] = useState(false);
  return (
    <div className={`${cardClass}`}
      onDragOver={(e)=>{e.preventDefault();setDrag(true);}}
      onDragLeave={()=>setDrag(false)}
      onDrop={(e)=>{e.preventDefault();setDrag(false); const f = e.dataTransfer.files?.[0]; if(f) onFile(f);}}
    >
      <SectionHeader icon={Upload} title={title} subtitle={subtitle} />
      <div className={`border-2 border-dashed ${drag?"border-indigo-400 bg-indigo-500/10":"border-white/10"} rounded-2xl p-6 text-center`}>
        <FileSpreadsheet className="w-8 h-8 mx-auto mb-2" />
        <p className="text-sm text-slate-300">Drag & drop Excel/CSV here</p>
        <div className="mt-3">
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-400/40 cursor-pointer">
            <Upload className="w-4 h-4"/> Choose file
            <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e)=>{const f=e.target.files?.[0]; if(f) onFile(f);}} />
          </label>
        </div>
      </div>
    </div>
  );
}

function DownloadButton({ data, filename, label }) {
  const handle = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button onClick={handle} className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 inline-flex items-center gap-2">
      <Download className="w-4 h-4"/> {label}
    </button>
  );
}

function Composer({ templates, clients, manpower, onSend }) {
  const [mode, setMode] = useState("email"); // email | whatsapp
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipient, setRecipient] = useState(null);

  useEffect(()=>{
    if(!selectedTemplate) return;
    if(mode === "email") {
      setSubject(selectedTemplate.subject || "");
      setBody(selectedTemplate.body || "");
    } else {
      setSubject("");
      setBody(selectedTemplate.text || "");
    }
  }, [selectedTemplate, mode]);

  const persons = mode === "email" ? clients : manpower;

  const fill = (tpl, p) =>
    (tpl || "")
      .replaceAll("{{name}}", p?.name || "")
      .replaceAll("{{project}}", p?.project || "")
      .replaceAll("{{sender}}", "Techno Team")
      .replaceAll("{{from_date}}", new Date().toLocaleDateString())
      .replaceAll("{{to_date}}", new Date(Date.now()+3*86400000).toLocaleDateString())
      .replaceAll("{{status}}", p?.status || "");

  const handleSend = () => {
    if(!recipient) return;
    if(mode === "email") {
      const link = `mailto:${encodeURIComponent(recipient.email)}?subject=${encodeURIComponent(fill(subject, recipient))}&body=${encodeURIComponent(fill(body, recipient))}`;
      window.location.href = link;
      onSend("email", { to: recipient, subject: fill(subject, recipient) });
    } else {
      const phone = recipient.phone?.replace(/\D/g, "");
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(fill(body, recipient))}`, "_blank");
      onSend("whatsapp", { to: recipient, text: fill(body, recipient) });
    }
  };

  const tplSet = mode === "email" ? templates.clientEmail : templates.manpowerWhatsApp;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button onClick={()=>setMode("email")} className={`px-3 py-2 rounded-xl border ${mode==='email'?"bg-indigo-500/20 border-indigo-400/40":"bg-white/5 border-white/10"}`}><Mail className="w-4 h-4 inline mr-1"/> Email</button>
        <button onClick={()=>setMode("whatsapp")} className={`px-3 py-2 rounded-xl border ${mode==='whatsapp'?"bg-emerald-500/20 border-emerald-400/40":"bg-white/5 border-white/10"}`}><MessageSquare className="w-4 h-4 inline mr-1"/> WhatsApp</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {mode === "email" && (
            <input value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="Subject" className="w-full mb-3 px-3 py-2 rounded-xl bg-white/10 border border-white/10" />
          )}
          <textarea value={body} onChange={(e)=>setBody(e.target.value)} placeholder="Write your message…" rows={10} className="w-full mb-3 px-3 py-2 rounded-xl bg-white/10 border border-white/10" />
          <button onClick={handleSend} className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-90 inline-flex items-center gap-2">
            <Send className="w-4 h-4"/> Send
          </button>
        </div>
        <div>
          <div className="mb-3">
            <label className="block text-xs text-slate-300 mb-1">Template</label>
            <select className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10" value={selectedTemplate?.name || ""} onChange={(e)=>{
              const tpl = tplSet.find(t=>t.name===e.target.value);
              setSelectedTemplate(tpl);
            }}>
              <option value="">— Choose —</option>
              {tplSet.map(tpl => <option key={tpl.name} value={tpl.name}>{tpl.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">Recipient</label>
            <select className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10" value={recipient?.id || ""} onChange={(e)=>{
              const p = persons.find(x=>String(x.id)===e.target.value);
              setRecipient(p || null);
              if(selectedTemplate){
                // preview fill
                if(mode==='email') setSubject((s)=>fill(selectedTemplate.subject, p));
                setBody((b)=>fill(mode==='email'?selectedTemplate.body:selectedTemplate.text, p));
              }
            }}>
              <option value="">— Choose —</option>
              {persons.map(p => <option key={p.id} value={p.id}>{p.name} {mode==='email'?`· ${p.email}`:`· ${p.phone}`}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function AvailabilityPanel({ availability, setAvailability, manpower, addNotification }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState("");

  const confirm = () => {
    if(!selected || !from || !to) return;
    const mp = manpower.find(m=>String(m.id)===selected);
    const rec = { id: Date.now(), manpowerId: mp.id, name: mp.name, window: { from, to }, confirmed: true };
    setAvailability((arr)=>[rec, ...arr]);
    addNotification(`${mp.name} confirmed availability for ${from} → ${to}`);
    window.open(`https://wa.me/${mp.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi ${mp.name}, recorded your availability for ${from} to ${to}. Thank you!`)}`,'_blank');
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <select value={selected} onChange={(e)=>setSelected(e.target.value)} className="px-3 py-2 rounded-xl bg-white/10 border border-white/10">
          <option value="">Select manpower…</option>
          {manpower.map(m => <option key={m.id} value={m.id}>{m.name} · {m.role}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} className="px-3 py-2 rounded-xl bg-white/10 border border-white/10"/>
          <input type="date" value={to} onChange={(e)=>setTo(e.target.value)} className="px-3 py-2 rounded-xl bg-white/10 border border-white/10"/>
        </div>
      </div>
      <button onClick={confirm} className="px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Record & WhatsApp</button>

      <div className="mt-4 max-h-52 overflow-auto divide-y divide-white/10">
        {availability.slice(0,8).map(a => (
          <div key={a.id} className="py-2 text-sm flex items-center justify-between">
            <div>
              <div className="font-medium">{a.name}</div>
              <div className="text-slate-400">{a.window.from} → {a.window.to}</div>
            </div>
            <span className={`${pill} bg-emerald-100 text-emerald-700`}>Confirmed</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Temporary shim for missing icon in props typing above
function Bell(){ return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V4a2 2 0 1 0-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
