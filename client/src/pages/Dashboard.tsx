import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const Dashboard = () => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
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

  const weightData = [
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur border-b border-accent/20 px-4 sm:px-6 py-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl">🐂</span>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold">
                <span className="text-accent">BOVISION</span>
                <span className="text-cyan-400"> AI</span>
              </h1>
              <p className="text-xs text-gray-400">Cattle Intelligence Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 hover:bg-accent/10 rounded-lg transition relative">
              <Bell size={20} className="text-accent" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-accent/10 rounded-lg transition">
              <span className="text-lg sm:text-xl">👤</span>
            </button>
          </div>
        </div>
      </motion.div>

      <div className="flex pt-16">
        {/* Sidebar */}
        <motion.div className="hidden md:block w-64 bg-black/80 backdrop-blur border-r border-accent/20 fixed left-0 top-16 bottom-0 overflow-y-auto z-30">
          <div className="p-4 space-y-2">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left text-sm ${
                  item.id === 'dashboard'
                    ? 'bg-accent/10 border-l-2 border-accent text-accent'
                    : 'text-gray-400 hover:text-accent hover:bg-accent/5'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 right-4 p-4 bg-accent/10 border border-accent/30 rounded-lg">
            <p className="text-xs text-gray-400 mb-2">SYSTEM STATUS</p>
            <p className="text-sm text-accent font-bold">All Systems Operational</p>
            <p className="text-xs text-green-400">99.9% Uptime</p>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 md:ml-64 p-4 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">Dashboard Overview</h2>
              <p className="text-sm text-gray-400">Real-time cattle intelligence and ranch performance</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
                  <p className="text-xs text-gray-400 mb-1">{kpi.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-accent">{kpi.value}</p>
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
                <h3 className="text-sm font-bold mb-4 text-accent">WEIGHT TRENDS</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weightData}>
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
                <h3 className="text-sm font-bold mb-4 text-accent">VACCINATION STATUS</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={vaccineData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
                      {vaccineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Cattle Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <h3 className="text-lg font-bold mb-4">TOP PERFORMERS</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { id: '001', name: 'Bella', breed: 'Holstein Friesian', weight: 534, age: 3.5, status: 'Healthy', health: 92 },
                  { id: '002', name: 'Midnight', breed: 'Angus', weight: 482, age: 2.8, status: 'Healthy', health: 89 },
                  { id: '003', name: 'Clover', breed: 'Simmental', weight: 598, age: 4.2, status: 'At Risk', health: 68 },
                  { id: '004', name: 'Daisy', breed: 'Jersey', weight: 412, age: 3.1, status: 'Healthy', health: 91 },
                ].map((cattle, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="p-4 border border-accent/30 rounded-lg bg-black/50 hover:border-accent/60 transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-accent">#{cattle.id}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        cattle.status === 'Healthy' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {cattle.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold mb-1">{cattle.name}</h4>
                    <p className="text-xs text-gray-400 mb-3">{cattle.breed}</p>
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
                        <span>Health:</span>
                        <span className="text-accent">{cattle.health}/100</span>
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
