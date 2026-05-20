import { motion } from 'framer-motion';
import { Bell, Settings, LogOut, Menu, X, Home, BarChart3, Heart, Zap, Leaf, Users, Apple, Activity, AlertCircle, FileText, Cog } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useState } from 'react';
import { useLocation } from 'wouter';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/app' },
    { id: 'cattle', label: 'Rebanho', icon: Users, path: '/app/rebanho' },
    { id: 'analytics', label: 'Análises', icon: BarChart3, path: '/app/analytics' },
    { id: 'health', label: 'Saúde', icon: Heart, path: '/app/health' },
    { id: 'ai', label: 'IA Insights', icon: Zap, path: '/app/ai-insights' },
    { id: 'pesagem', label: 'Pesagem IA', icon: Activity, path: '/app/pesagem' },
    { id: 'pasture', label: 'Pastagem', icon: Leaf, path: '/app/pasture' },
    { id: 'nutrition', label: 'Nutrição', icon: Apple, path: '/app/nutrition' },
    { id: 'alerts', label: 'Alertas', icon: AlertCircle, path: '/app/alerts' },
    { id: 'reports', label: 'Relatórios', icon: FileText, path: '/app/reports' },
    { id: 'settings', label: 'Configurações', icon: Cog, path: '/app/settings' },
  ];

  const weightData = [
    { date: 'Jun 12', weight: 400 },
    { date: 'Jun 19', weight: 420 },
    { date: 'Jun 26', weight: 435 },
    { date: 'Jul 03', weight: 450 },
    { date: 'Jul 10', weight: 482 },
  ];

  const vaccineData = [
    { name: 'Atualizado', value: 85, fill: '#00FF41' },
    { name: 'Próximo', value: 11, fill: '#FFB800' },
    { name: 'Atrasado', value: 4, fill: '#FF4444' },
  ];

  const cattleList = [
    { id: '001', name: 'Bella', breed: 'Holstein Friesian', weight: 534, age: 3.5, status: 'Healthy', health: 92 },
    { id: '002', name: 'Midnight', breed: 'Angus', weight: 482, age: 2.8, status: 'Healthy', health: 89 },
    { id: '003', name: 'Clover', breed: 'Simmental', weight: 598, age: 4.2, status: 'At Risk', health: 68 },
    { id: '004', name: 'Daisy', breed: 'Jersey', weight: 412, age: 3.1, status: 'Healthy', health: 91 },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-cyan-500/20 px-4 sm:px-6 py-3 sm:py-4"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-cyan-500/10 rounded-lg transition"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-2">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663677906549/T2VQu6STr22DABekAsCKWM/bovision-logo-icon-N3FvpqH9Q3jqzfuhPUHYM9.webp" alt="BOVISION" className="w-8 h-8" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold">
                  <span className="text-lime-400">BOVISION</span>
                  <span className="text-cyan-400"> AI</span>
                </h1>
                <p className="text-xs text-gray-500">Plataforma Pecuária</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 hover:bg-cyan-500/10 rounded-lg transition relative">
              <Bell size={20} className="text-cyan-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-cyan-500/20">
              <div className="text-right">
                <p className="text-sm font-medium">Gerenciador</p>
                <p className="text-xs text-gray-500">Silver Valley</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-cyan-400 flex items-center justify-center text-black font-bold text-sm">
                GF
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex pt-16 md:pt-0">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -280 }}
          animate={{ x: sidebarOpen ? 0 : -280 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed md:relative md:translate-x-0 left-0 top-16 md:top-0 bottom-0 w-64 bg-gradient-to-b from-black/90 to-slate-950/90 backdrop-blur-xl border-r border-cyan-500/20 overflow-y-auto z-40 md:z-0"
        >
          <div className="p-4 space-y-1">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = location === item.path;
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    setLocation(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left text-sm font-medium ${
                    isActive
                      ? 'bg-lime-400/10 border-l-2 border-lime-400 text-lime-400'
                      : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/5'
                  }`}
                >
                  <IconComponent size={18} />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </div>

          <div className="absolute bottom-4 left-4 right-4 p-4 bg-gradient-to-br from-lime-400/10 to-cyan-400/10 border border-cyan-500/30 rounded-lg">
            <p className="text-xs text-gray-500 mb-2 font-semibold">STATUS DO SISTEMA</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
              <p className="text-sm text-lime-400 font-bold">Operacional</p>
            </div>
            <p className="text-xs text-gray-500">Uptime: 99.9%</p>
          </div>
        </motion.div>

        {/* Overlay */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
          />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto w-full p-4 sm:p-6 md:p-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl">
            {/* Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Visão Geral do Dashboard</h2>
              <p className="text-sm text-gray-400">Inteligência de rebanho em tempo real</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'TOTAL DE ANIMAIS', value: '1.428', change: '+12.5%', icon: '🐄', color: 'lime' },
                { label: 'PESO MÉDIO', value: '482 kg', change: '+8.3%', icon: '⚖️', color: 'cyan' },
                { label: 'SCORE DE SAÚDE', value: '92/100', change: '+5.7%', icon: '❤️', color: 'lime' },
                { label: 'TAXA DE CRESCIMENTO', value: '1.24 kg/dia', change: '+15.2%', icon: '📈', color: 'cyan' },
              ].map((kpi, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className={`p-5 rounded-xl bg-gradient-to-br from-${kpi.color}-500/5 to-transparent border border-${kpi.color}-500/30 hover:border-${kpi.color}-500/60 transition backdrop-blur-sm`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{kpi.icon}</span>
                    <span className={`text-xs font-mono text-${kpi.color}-400`}>{kpi.change}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2 font-semibold">{kpi.label}</p>
                  <p className={`text-2xl font-bold text-${kpi.color}-400`}>{kpi.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weight Trends */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-xl bg-gradient-to-br from-lime-500/5 to-transparent border border-lime-500/30 backdrop-blur-sm"
              >
                <h3 className="text-sm font-bold mb-4 text-lime-400 uppercase tracking-wide">Tendência de Peso</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={weightData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#00FF41" strokeWidth={2} dot={{ fill: '#00FF41' }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Vaccination Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/30 backdrop-blur-sm"
              >
                <h3 className="text-sm font-bold mb-4 text-cyan-400 uppercase tracking-wide">Status de Vacinação</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={vaccineData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {vaccineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Cattle Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-bold mb-4">Animais Principais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cattleList.map((cattle, i) => (
                  <motion.div
                    key={cattle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className={`p-4 rounded-lg border backdrop-blur-sm ${
                      cattle.status === 'Healthy'
                        ? 'bg-lime-500/5 border-lime-500/30'
                        : cattle.status === 'At Risk'
                        ? 'bg-orange-500/5 border-orange-500/30'
                        : 'bg-red-500/5 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-bold">{cattle.name}</p>
                        <p className="text-xs text-gray-500">{cattle.breed}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        cattle.status === 'Healthy'
                          ? 'bg-lime-500/20 text-lime-400'
                          : cattle.status === 'At Risk'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {cattle.status === 'Healthy' ? '✓' : cattle.status === 'At Risk' ? '⚠' : '✕'}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Peso:</span>
                        <span className="font-bold">{cattle.weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Idade:</span>
                        <span className="font-bold">{cattle.age} anos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Saúde:</span>
                        <span className={`font-bold ${cattle.health >= 80 ? 'text-lime-400' : cattle.health >= 60 ? 'text-orange-400' : 'text-red-400'}`}>
                          {cattle.health}/100
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
