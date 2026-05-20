import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Users, BarChart3, Activity, Shield, Search, Filter,
  ChevronDown, Check, X, Star, Lock, Unlock, RefreshCw,
  Building2, LogOut, TrendingUp, Database, Cpu, Globe,
  AlertCircle, Eye, Menu, Clock, Zap, DollarSign,
  KeyRound, History, Bell, CheckCircle2, XCircle, FileText, Trash2, Leaf
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ============================================================
// TYPES
// ============================================================
type BvUser = {
  id: number;
  bvId: string;
  pin: string;
  plan: "free" | "pro" | "enterprise";
  status: "active" | "blocked" | "suspended";
  isPremium: number;
  createdAt: Date;
  lastAccessAt: Date;
  subscriptionExpiresAt: Date | null;
};

// ============================================================
// CUSTOM TOOLTIP
// ============================================================
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass border border-green-500/30 rounded-xl px-4 py-3 text-xs">
        <p className="font-mono text-green-400 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-white">{entry.name}: <span className="text-green-400 font-bold">{entry.value}</span></p>
        ))}
      </div>
    );
  }
  return null;
};

// ============================================================
// STATS OVERVIEW
// ============================================================
function StatsOverview() {
  const cards = [
    { label: "Total Rebanhos", value: 1250, icon: Users, color: "from-green-400 to-green-600", change: "+12%" },
    { label: "Rebanhos Ativos", value: 980, icon: Activity, color: "from-cyan-400 to-cyan-600", change: "+8%" },
    { label: "Premium", value: 320, icon: Star, color: "from-amber-400 to-amber-600", change: "+24%" },
    { label: "Bloqueados", value: 45, icon: Shield, color: "from-red-400 to-red-600", change: "-2%" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="rounded-2xl border border-green-500/20 bg-slate-800/50 backdrop-blur-xl p-5 hover:border-green-500/40 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-mono tracking-wide uppercase">{card.label}</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${card.color}`}>
              <card.icon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="font-display text-3xl font-bold text-white mb-2">{card.value}</div>
          <div className={`text-xs font-mono ${card.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
            {card.change} este mês
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================
// CHARTS
// ============================================================
function ChartsSection() {
  const planData = [
    { name: "Free", value: 450, color: "#0ea5e9" },
    { name: "Pro", value: 320, color: "#00ff88" },
    { name: "Enterprise", value: 480, color: "#fbbf24" },
  ];

  const timeData = Array.from({ length: 7 }, (_, i) => ({
    day: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][i],
    acessos: Math.floor(Math.random() * 80 + 20),
    novos: Math.floor(Math.random() * 15 + 2),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Area Chart */}
      <div className="lg:col-span-2 rounded-2xl border border-green-500/20 bg-slate-800/50 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white text-sm">Acessos — Últimos 7 dias</h3>
            <p className="text-xs text-gray-400">Atividade da plataforma</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={timeData}>
            <defs>
              <linearGradient id="colorAcessos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNovos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 136, 0.08)" />
            <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="acessos" name="Acessos" stroke="#00ff88" fill="url(#colorAcessos)" strokeWidth={2} />
            <Area type="monotone" dataKey="novos" name="Novos" stroke="#0ea5e9" fill="url(#colorNovos)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="rounded-2xl border border-green-500/20 bg-slate-800/50 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white text-sm">Distribuição de Planos</h3>
            <p className="text-xs text-gray-400">Por tipo de assinatura</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={planData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
              {planData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 mt-4">
          {planData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                <span className="text-xs text-gray-400 font-mono">{item.name}</span>
              </div>
              <span className="text-xs font-bold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// USERS TABLE
// ============================================================
function UsersTable() {
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<BvUser | null>(null);
  const [showPinFor, setShowPinFor] = useState<string | null>(null);

  // Mock data
  const users: BvUser[] = [
    {
      id: 1,
      bvId: "BV-A1B2C3D4",
      pin: "123456",
      plan: "pro",
      status: "active",
      isPremium: 1,
      createdAt: new Date("2026-01-15"),
      lastAccessAt: new Date("2026-05-20"),
      subscriptionExpiresAt: new Date("2026-08-20"),
    },
    {
      id: 2,
      bvId: "BV-E5F6G7H8",
      pin: "654321",
      plan: "free",
      status: "active",
      isPremium: 0,
      createdAt: new Date("2026-02-10"),
      lastAccessAt: new Date("2026-05-19"),
      subscriptionExpiresAt: null,
    },
    {
      id: 3,
      bvId: "BV-I9J0K1L2",
      pin: "789012",
      plan: "pro",
      status: "blocked",
      isPremium: 1,
      createdAt: new Date("2026-03-05"),
      lastAccessAt: new Date("2026-05-10"),
      subscriptionExpiresAt: new Date("2026-07-10"),
    },
  ];

  const filtered = users.filter((u) => {
    if (filterPlan !== "all" && u.plan !== filterPlan) return false;
    if (filterStatus !== "all" && u.status !== filterStatus) return false;
    if (search && !u.bvId.includes(search.toUpperCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 border border-green-500/20 bg-slate-800/30 backdrop-blur flex-1 min-w-48">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por ID..."
            className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1 font-mono"
          />
        </div>
        <select value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)}
          className="rounded-xl px-4 py-2.5 border border-green-500/20 bg-slate-800/30 text-sm text-white outline-none">
          <option value="all">Todos os Planos</option>
          <option value="free">Free (Trial)</option>
          <option value="pro">Premium</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl px-4 py-2.5 border border-green-500/20 bg-slate-800/30 text-sm text-white outline-none">
          <option value="all">Todos os Status</option>
          <option value="active">Ativos</option>
          <option value="blocked">Bloqueados</option>
          <option value="suspended">Suspensos</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-green-500/20 bg-slate-800/50 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-green-500/10 bg-slate-900/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">ID Bovision</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">PIN</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">Plano</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">Premium</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">Último Acesso</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400 text-sm">Nenhum rebanho encontrado</td></tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="border-b border-green-500/10 hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-green-400 font-bold text-sm">{user.bvId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {showPinFor === user.bvId ? (
                          <span className="font-mono text-amber-400 font-bold text-sm tracking-widest">{user.pin}</span>
                        ) : (
                          <span className="font-mono text-gray-500 text-sm tracking-widest">••••••</span>
                        )}
                        <button
                          onClick={() => setShowPinFor(showPinFor === user.bvId ? null : user.bvId)}
                          className="p-1 rounded-md bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-all"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                        user.plan === "pro" ? "bg-amber-500/20 text-amber-400" : "bg-cyan-500/20 text-cyan-400"
                      }`}>
                        {user.plan === "pro" ? "PREMIUM" : "FREE"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                        user.status === "active" ? "bg-green-500/20 text-green-400" :
                        user.status === "suspended" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {user.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isPremium ? (
                        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 flex items-center gap-1 w-fit">
                          <Star className="w-3 h-3" /> SIM
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 font-mono">NÃO</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-gray-400">
                        {new Date(user.lastAccessAt).toLocaleDateString("pt-BR")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedUser(user)}
                          className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-all" title="Gerir">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all" title="Bloquear">
                          <Lock className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-green-500/10 flex items-center justify-between bg-slate-900/30">
          <span className="font-mono text-xs text-gray-400">{filtered.length} rebanhos encontrados</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-xs text-gray-400 tracking-widest">LIVE DATA</span>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-black/70 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="rounded-2xl border border-green-500/30 bg-slate-900/90 backdrop-blur-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-white text-xl flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-400" />
                    Gestão do Rebanho
                  </h3>
                  <button onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Device Info */}
                <div className="rounded-xl p-4 border border-green-500/20 bg-slate-800/50 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-mono text-2xl font-bold text-green-400">{selectedUser.bvId}</div>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                          selectedUser.plan === "pro" ? "bg-amber-500/20 text-amber-400" : "bg-cyan-500/20 text-cyan-400"
                        }`}>{selectedUser.plan === "pro" ? "PREMIUM" : "FREE"}</span>
                        <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                          selectedUser.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}>{selectedUser.status.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* PIN Row */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-green-500/10">
                    <KeyRound className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-400 font-mono">PIN:</span>
                    {showPinFor === selectedUser.bvId ? (
                      <span className="font-mono text-amber-400 font-bold text-base tracking-[0.3em]">
                        {selectedUser.pin}
                      </span>
                    ) : (
                      <span className="font-mono text-gray-500 tracking-[0.3em]">••••••</span>
                    )}
                    <button
                      onClick={() => setShowPinFor(showPinFor === selectedUser.bvId ? null : selectedUser.bvId)}
                      className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-mono transition-all">
                      <Eye className="w-3 h-3" />
                      {showPinFor === selectedUser.bvId ? "Ocultar" : "Revelar"}
                    </button>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-green-500/10">
                    <div>
                      <div className="text-xs text-gray-400 font-mono uppercase tracking-wide mb-1">Criado em</div>
                      <div className="font-mono text-sm text-white">{new Date(selectedUser.createdAt).toLocaleDateString("pt-BR")}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-mono uppercase tracking-wide mb-1">Último Acesso</div>
                      <div className="font-mono text-sm text-white">{new Date(selectedUser.lastAccessAt).toLocaleDateString("pt-BR")}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-sm font-semibold transition-all">
                    <Star className="w-4 h-4" /> Ativar Premium
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold transition-all">
                    <Lock className="w-4 h-4" /> Bloquear Rebanho
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-500/30 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 text-sm font-semibold transition-all">
                    <Trash2 className="w-4 h-4" /> Deletar Rebanho
                  </button>
                </div>

                <button onClick={() => setSelectedUser(null)} className="w-full mt-4 px-4 py-2 rounded-xl border border-gray-500/20 text-gray-400 hover:text-white transition-all">
                  Fechar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Admin() {
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-green-500/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">BOVISION ADMIN</h1>
              <p className="text-xs text-gray-400">Painel de Gestão</p>
            </div>
          </div>
          <button onClick={() => navigate("/")} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <StatsOverview />
        <ChartsSection />
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-green-400" />
            Gestão de Rebanhos
          </h2>
          <UsersTable />
        </div>
      </div>
    </div>
  );
}
