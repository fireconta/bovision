import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import {
  Menu, X, LogOut, Settings, Bell, Search,
  BarChart3, Beef, Heart, Leaf, Droplets, Pill,
  TrendingUp, AlertCircle, CheckCircle, Clock,
  ChevronRight, Home, Zap, Brain, FileText, Users
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================
type Module = {
  id: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
  category: "monitoring" | "management" | "insights";
};

const modules: Module[] = [
  { id: "cattle", icon: Beef, title: "Rebanho", desc: "Gestão completa do rebanho", color: "210", category: "monitoring" },
  { id: "health", icon: Heart, title: "Saúde", desc: "Monitoramento de saúde", color: "0", category: "monitoring" },
  { id: "weight", icon: TrendingUp, title: "Peso", desc: "Análise de ganho de peso", color: "60", category: "monitoring" },
  { id: "pasture", icon: Leaf, title: "Pastagem", desc: "Gestão de pastagem", color: "130", category: "management" },
  { id: "nutrition", icon: Droplets, title: "Nutrição", desc: "Plano nutricional", color: "280", category: "management" },
  { id: "vaccination", icon: Pill, title: "Vacinação", desc: "Calendário de vacinação", color: "40", category: "management" },
  { id: "analytics", icon: BarChart3, title: "Análises", desc: "Relatórios e dados", color: "200", category: "insights" },
  { id: "ai_insights", icon: Brain, title: "IA Insights", desc: "Recomendações inteligentes", color: "280", category: "insights" },
];

// ============================================================
// SIDEBAR COMPONENT
// ============================================================
function Sidebar({
  activeModule,
  setActiveModule,
  mobileOpen,
  setMobileOpen,
  onLogout,
}: {
  activeModule: string;
  setActiveModule: (id: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  onLogout: () => void;
}) {
  const navItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", desc: "Visão geral" },
    ...modules,
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-[oklch(0.75_0.18_210/0.1)]">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
            <span className="text-lg font-bold">🐄</span>
          </div>
          <div>
            <div className="font-display font-bold text-sm text-white leading-none">BOVISION</div>
            <div className="font-mono text-[0.55rem] text-[oklch(0.50_0.04_220)] tracking-widest mt-0.5">AI PLATFORM</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeModule === item.id;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveModule(item.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left
                ${isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-green-500/20 border border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold">{('title' in item) ? item.title : item.label}</div>
                {('desc' in item) && item.desc && <div className="text-[0.7rem] text-gray-500 truncate">{item.desc}</div>}
              </div>
              {isActive && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
            </motion.button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[oklch(0.75_0.18_210/0.08)]">
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all text-left"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs font-semibold">Sair</span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 flex-shrink-0 h-screen sticky top-0 bg-[oklch(0.08_0.012_240)] border-r border-[oklch(0.75_0.18_210/0.1)] flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              className="fixed left-0 top-0 h-screen w-64 bg-[oklch(0.08_0.012_240)] border-r border-[oklch(0.75_0.18_210/0.1)] z-50 lg:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================
// DASHBOARD CONTENT
// ============================================================
function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Visão geral do seu rebanho em tempo real</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total de Gado", value: "1.428", change: "+12.5%", icon: Beef, color: "from-cyan-500 to-blue-600" },
          { label: "Peso Médio", value: "482 kg", change: "+8.3%", icon: TrendingUp, color: "from-green-500 to-emerald-600" },
          { label: "Score de Saúde", value: "92/100", change: "+5.7%", icon: Heart, color: "from-red-500 to-pink-600" },
          { label: "Taxa de Crescimento", value: "1.24 kg/dia", change: "+15.2%", icon: Zap, color: "from-yellow-500 to-orange-600" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl border border-[oklch(0.75_0.18_210/0.2)] p-5 hover:border-[oklch(0.75_0.18_210/0.4)] transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-mono text-green-400">{stat.change}</span>
              </div>
              <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl border border-[oklch(0.75_0.18_210/0.2)] p-6"
      >
        <h2 className="text-lg font-bold text-white mb-4">Atividades Recentes</h2>
        <div className="space-y-3">
          {[
            { icon: CheckCircle, text: "Vacinação concluída para 45 animais", time: "2 horas atrás", color: "text-green-400" },
            { icon: AlertCircle, text: "3 animais com risco de infecção respiratória", time: "4 horas atrás", color: "text-yellow-400" },
            { icon: Clock, text: "Próxima alimentação em 30 minutos", time: "Agora", color: "text-blue-400" },
          ].map((activity, i) => {
            const Icon = activity.icon;
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${activity.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// MODULE CONTENT
// ============================================================
function ModuleContent({ moduleId }: { moduleId: string }) {
  const module = modules.find(m => m.id === moduleId);
  if (!module) return null;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{module.title}</h1>
        <p className="text-gray-400">{module.desc}</p>
      </div>

      {/* Placeholder Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl border border-[oklch(0.75_0.18_210/0.2)] p-8 text-center"
      >
        <div className={`w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500 to-green-500 flex items-center justify-center mx-auto mb-4`}>
          <module.icon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Módulo: {module.title}</h2>
        <p className="text-gray-400 mb-6">Conteúdo do módulo {module.title.toLowerCase()} será carregado aqui.</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm">
          <Zap className="w-4 h-4" />
          Em desenvolvimento
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function App() {
  const [, navigate] = useLocation();
  const [activeModule, setActiveModule] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Check session on mount
  useEffect(() => {
    const session = sessionStorage.getItem("bv_session");
    if (!session) {
      navigate("/aplicativo");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("bv_session");
    navigate("/aplicativo");
  };

  return (
    <div className="flex h-screen bg-[oklch(0.08_0.012_240)]">
      {/* Sidebar */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-[oklch(0.10_0.012_240)] border-b border-[oklch(0.75_0.18_210/0.1)] px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md bg-white/5 border border-[oklch(0.75_0.18_210/0.1)] rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar gado, tags, métricas..."
                className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-white/10 rounded-lg transition-all relative"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center text-sm font-bold">
              👨
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {activeModule === "dashboard" ? (
                <DashboardContent />
              ) : (
                <ModuleContent moduleId={activeModule} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
