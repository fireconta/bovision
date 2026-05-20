import { motion } from 'framer-motion';
import { Bell, Settings, LogOut, Menu, X } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useState } from 'react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'cattle', label: 'Visão Geral do Rebanho', icon: '🐄' },
    { id: 'analytics', label: 'Análises', icon: '📈' },
    { id: 'health', label: 'Monitor de Saúde', icon: '❤️' },
    { id: 'ai', label: 'Insights IA', icon: '🤖' },
    { id: 'pasture', label: 'Gestão de Pastagem', icon: '🌾' },
    { id: 'nutrition', label: 'Nutrição', icon: '🥕' },
    { id: 'reproduction', label: 'Reprodução', icon: '👶' },
    { id: 'movement', label: 'Movimento', icon: '🚶' },
    { id: 'alerts', label: 'Alertas', icon: '🔔' },
    { id: 'reports', label: 'Relatórios', icon: '📄' },
    { id: 'settings', label: 'Configurações', icon: '⚙️' },
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
    { id: '005', name: 'Rosie', breed: 'Brown Swiss', weight: 620, age: 5.0, status: 'Healthy', health: 94 },
    { id: '006', name: 'Luna', breed: 'Charolais', weight: 450, age: 2.3, status: 'Need Attention', health: 42 },
    { id: '007', name: 'Molly', breed: 'Holstein Friesian', weight: 544, age: 3.8, status: 'Healthy', health: 90 },
    { id: '008', name: 'Maple', breed: 'Angus', weight: 560, age: 4.1, status: 'At Risk', health: 71 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-cyan-500/20 px-4 sm:px-6 py-4"
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
                <p className="text-xs text-gray-500">Plataforma de Inteligência Pecuária</p>
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
                <p className="text-sm font-medium">Gerenciador de Fazenda</p>
                <p className="text-xs text-gray-500">Silver Valley Ranch</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-cyan-400 flex items-center justify-center text-black font-bold text-sm">
                GF
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex pt-20">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -280 }}
          animate={{ x: sidebarOpen ? 0 : -280 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed md:relative md:translate-x-0 left-0 top-20 md:top-0 bottom-0 w-64 bg-black/80 backdrop-blur-xl border-r border-cyan-500/20 overflow-y-auto z-40 md:z-0"
        >
          <div className="p-4 space-y-1">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left text-sm font-medium ${
                  item.id === 'dashboard'
                    ? 'bg-lime-400/10 border-l-2 border-lime-400 text-lime-400'
                    : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/5'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 right-4 p-4 bg-gradient-to-br from-lime-400/10 to-cyan-400/10 border border-cyan-500/30 rounded-lg">
            <p className="text-xs text-gray-500 mb-2 font-semibold">STATUS DO SISTEMA</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
              <p className="text-sm text-lime-400 font-bold">Todos os Sistemas Operacionais</p>
            </div>
            <p className="text-xs text-gray-500">Uptime: 99.9%</p>
          </div>
        </motion.div>

        {/* Overlay */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
          />
        )}

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl">
            {/* Title */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">Visão Geral do Dashboard</h2>
              <p className="text-sm text-gray-400">Inteligência de rebanho em tempo real e desempenho da fazenda</p>
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
                    <XAxis dataKey="date" stroke="#666" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#000/80',
                        border: '1px solid #00FF41',
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#00FF41"
                      strokeWidth={3}
                      dot={{ fill: '#00FF41', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
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
                    <Pie data={vaccineData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value" paddingAngle={2}>
                      {vaccineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#000/80',
                        border: '1px solid #00FF41',
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2 text-xs">
                  {vaccineData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                      <span className="text-gray-400">{item.name}</span>
                      <span className="ml-auto font-bold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Cattle Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Melhores Desempenhos</h3>
                <button className="text-xs text-cyan-400 hover:text-lime-400 transition font-semibold">Ver Todos</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cattleList.slice(0, 4).map((cattle, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    whileHover={{ y: -4 }}
                    className={`p-4 rounded-lg bg-gradient-to-br from-slate-800/50 to-transparent border ${
                      cattle.status === 'Healthy'
                        ? 'border-lime-500/30 hover:border-lime-500/60'
                        : cattle.status === 'At Risk'
                        ? 'border-yellow-500/30 hover:border-yellow-500/60'
                        : 'border-red-500/30 hover:border-red-500/60'
                    } transition backdrop-blur-sm`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-cyan-400">#{cattle.id}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          cattle.status === 'Healthy'
                            ? 'bg-lime-500/20 text-lime-400'
                            : cattle.status === 'At Risk'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {cattle.status === 'Healthy' ? '✓ Saudável' : cattle.status === 'At Risk' ? '⚠ Risco' : '⚠ Atenção'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold mb-1">{cattle.name}</h4>
                    <p className="text-xs text-gray-500 mb-3">{cattle.breed}</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Peso:</span>
                        <span className="text-cyan-400 font-semibold">{cattle.weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Idade:</span>
                        <span className="text-cyan-400 font-semibold">{cattle.age} anos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Saúde:</span>
                        <span className="text-lime-400 font-semibold">{cattle.health}/100</span>
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
