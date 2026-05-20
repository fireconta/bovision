import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Bell, Settings, LogOut, TrendingUp, Heart, AlertTriangle, Zap } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'cattle', label: 'Cattle Overview', icon: '🐄' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'health', label: 'Health Monitor', icon: '❤️' },
    { id: 'ai', label: 'AI Insights', icon: '🤖' },
    { id: 'pasture', label: 'Pasture Management', icon: '🌾' },
    { id: 'nutrition', label: 'Nutrition', icon: '🥕' },
    { id: 'reproduction', label: 'Reproduction', icon: '👶' },
    { id: 'movement', label: 'Movement', icon: '🚶' },
    { id: 'alerts', label: 'Alerts & Notifications', icon: '🔔' },
    { id: 'reports', label: 'Reports', icon: '📄' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const weightTrendData = [
    { date: 'May 15', weight: 400 },
    { date: 'May 22', weight: 420 },
    { date: 'May 29', weight: 435 },
    { date: 'Jun 05', weight: 450 },
    { date: 'Jun 12', weight: 482 },
  ];

  const vaccineData = [
    { name: 'Up to date', value: 85, fill: '#00FF41' },
    { name: 'Due soon', value: 11, fill: '#FFB800' },
    { name: 'Overdue', value: 4, fill: '#FF4444' },
  ];

  const cattleCards = [
    { id: '001', name: 'Bella', breed: 'Holstein Friesian', weight: 534, age: 3.5, status: 'Healthy', health: 92 },
    { id: '002', name: 'Midnight', breed: 'Angus', weight: 482, age: 2.8, status: 'Healthy', health: 89 },
    { id: '003', name: 'Clover', breed: 'Simmental', weight: 598, age: 4.2, status: 'At Risk', health: 68 },
    { id: '004', name: 'Daisy', breed: 'Jersey', weight: 412, age: 3.1, status: 'Healthy', health: 91 },
  ];

  return (
    <div className="min-h-screen bg-black text-foreground">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur border-b border-accent/20"
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-accent/10 rounded-lg transition"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐂</span>
              <div>
                <h1 className="text-xl font-bold">
                  <span className="text-accent">BOVISION</span>
                  <span className="text-cyan-400"> AI</span>
                </h1>
                <p className="text-xs text-muted-foreground">Cattle Intelligence Platform</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search cattle, tags, metrics..."
              className="hidden md:block px-4 py-2 bg-black/50 border border-accent/30 rounded-lg text-sm focus:outline-none focus:border-accent"
            />
            <button className="p-2 hover:bg-accent/10 rounded-lg transition relative">
              <Bell size={20} className="text-accent" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-accent/10 rounded-lg transition">
              <span className="text-2xl">👤</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          transition={{ duration: 0.3 }}
          className="fixed left-0 top-16 bottom-0 w-64 bg-black/80 backdrop-blur border-r border-accent/20 overflow-y-auto z-30"
        >
          <div className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === item.id
                    ? 'bg-accent/20 border border-accent text-accent'
                    : 'hover:bg-accent/10 text-muted-foreground'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* System Status */}
          <div className="absolute bottom-4 left-4 right-4 p-4 bg-accent/10 border border-accent/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">SYSTEM STATUS</p>
            <p className="text-sm text-accent font-bold">All Systems Operational</p>
            <p className="text-xs text-green-400">99.9% Uptime</p>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 p-4 sm:p-6`}>
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Title */}
              <div>
                <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
                <p className="text-muted-foreground">Real-time cattle intelligence and ranch performance</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'TOTAL CATTLE', value: '1,428', change: '+12.5%', icon: '🐄' },
                  { label: 'AVG WEIGHT', value: '482 kg', change: '+8.3%', icon: '⚖️' },
                  { label: 'HEALTH SCORE', value: '92/100', change: '+5.7%', icon: '❤️' },
                  { label: 'GROWTH RATE', value: '1.24 kg/day', change: '+15.2%', icon: '📈' },
                ].map((kpi, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 border border-accent/30 rounded-lg bg-black/50 hover:border-accent/60 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{kpi.icon}</span>
                      <span className="text-xs text-green-400 font-mono">{kpi.change}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
                    <p className="text-2xl font-bold text-accent">{kpi.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Weight Trends */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-4 border border-accent/30 rounded-lg bg-black/50"
                >
                  <h3 className="text-sm font-bold mb-4">WEIGHT TRENDS</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={weightTrendData}>
                      <XAxis dataKey="date" stroke="#666" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #00FF41' }} />
                      <Line type="monotone" dataKey="weight" stroke="#00FF41" strokeWidth={2} dot={{ fill: '#00FF41' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Vaccination Status */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 border border-accent/30 rounded-lg bg-black/50"
                >
                  <h3 className="text-sm font-bold mb-4">VACCINATION STATUS</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={vaccineData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
                        {vaccineData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2 text-xs">
                    {vaccineData.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                        <span>{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Cattle Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-lg font-bold mb-4">TOP PERFORMERS</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {cattleCards.map((cattle, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="p-4 border border-accent/30 rounded-lg bg-black/50 hover:border-accent/60 transition"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-accent">#{cattle.id}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          cattle.status === 'Healthy' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {cattle.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold mb-1">{cattle.name}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{cattle.breed}</p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Weight:</span>
                          <span className="text-accent">{cattle.weight} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Age:</span>
                          <span className="text-accent">{cattle.age} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Health Score:</span>
                          <span className="text-accent">{cattle.health}/100</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'cattle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">Cattle Overview - Coming Soon</p>
            </motion.div>
          )}

          {/* Other tabs placeholder */}
          {activeTab !== 'overview' && activeTab !== 'cattle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground capitalize">{activeTab} - Coming Soon</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
