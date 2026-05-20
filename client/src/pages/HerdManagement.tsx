import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const HerdManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'herd', label: 'Herd', icon: '🐄' },
    { id: 'health', label: 'Health', icon: '❤️' },
    { id: 'nutrition', label: 'Nutrition', icon: '🥕' },
    { id: 'reproduction', label: 'Reproduction', icon: '👶' },
    { id: 'movement', label: 'Movement', icon: '🚶' },
    { id: 'alerts', label: 'Alerts', icon: '🔔' },
    { id: 'reports', label: 'Reports', icon: '📄' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const animals = [
    {
      id: '001',
      name: 'Bella',
      breed: 'Holstein Friesian',
      age: 3.5,
      weight: 534,
      vaccination: 'Up to date',
      healthScore: 92,
      status: 'Healthy',
      lastUpdated: '2 min ago',
      chart: [
        { weight: 520 },
        { weight: 525 },
        { weight: 530 },
        { weight: 532 },
        { weight: 534 },
      ],
    },
    {
      id: '002',
      name: 'Midnight',
      breed: 'Angus',
      age: 2.8,
      weight: 482,
      vaccination: 'Up to date',
      healthScore: 89,
      status: 'Healthy',
      lastUpdated: '1 min ago',
      chart: [
        { weight: 470 },
        { weight: 475 },
        { weight: 478 },
        { weight: 480 },
        { weight: 482 },
      ],
    },
    {
      id: '003',
      name: 'Clover',
      breed: 'Simmental',
      age: 4.2,
      weight: 598,
      vaccination: 'Due in 5 days',
      healthScore: 68,
      status: 'At Risk',
      lastUpdated: '3 min ago',
      chart: [
        { weight: 585 },
        { weight: 590 },
        { weight: 595 },
        { weight: 597 },
        { weight: 598 },
      ],
    },
    {
      id: '004',
      name: 'Daisy',
      breed: 'Jersey',
      age: 3.1,
      weight: 412,
      vaccination: 'Up to date',
      healthScore: 91,
      status: 'Healthy',
      lastUpdated: '2 min ago',
      chart: [
        { weight: 405 },
        { weight: 408 },
        { weight: 410 },
        { weight: 411 },
        { weight: 412 },
      ],
    },
    {
      id: '005',
      name: 'Rosie',
      breed: 'Brown Swiss',
      age: 5.0,
      weight: 620,
      vaccination: 'Up to date',
      healthScore: 94,
      status: 'Healthy',
      lastUpdated: '1 min ago',
      chart: [
        { weight: 610 },
        { weight: 614 },
        { weight: 617 },
        { weight: 619 },
        { weight: 620 },
      ],
    },
    {
      id: '006',
      name: 'Luna',
      breed: 'Charolais',
      age: 2.3,
      weight: 450,
      vaccination: 'Overdue',
      healthScore: 42,
      status: 'Need Attention',
      lastUpdated: '4 min ago',
      chart: [
        { weight: 440 },
        { weight: 443 },
        { weight: 446 },
        { weight: 448 },
        { weight: 450 },
      ],
    },
    {
      id: '007',
      name: 'Molly',
      breed: 'Holstein Friesian',
      age: 3.8,
      weight: 544,
      vaccination: 'Up to date',
      healthScore: 90,
      status: 'Healthy',
      lastUpdated: '2 min ago',
      chart: [
        { weight: 535 },
        { weight: 538 },
        { weight: 541 },
        { weight: 542 },
        { weight: 544 },
      ],
    },
    {
      id: '008',
      name: 'Maple',
      breed: 'Angus',
      age: 4.1,
      weight: 560,
      vaccination: 'Due in 2 days',
      healthScore: 71,
      status: 'At Risk',
      lastUpdated: '3 min ago',
      chart: [
        { weight: 550 },
        { weight: 553 },
        { weight: 556 },
        { weight: 558 },
        { weight: 560 },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy':
        return 'border-accent';
      case 'At Risk':
        return 'border-yellow-500';
      case 'Need Attention':
        return 'border-yellow-500';
      default:
        return 'border-red-500';
    }
  };

  const getVaccinationColor = (vaccination: string) => {
    if (vaccination.includes('Up to date')) return 'text-green-400';
    if (vaccination.includes('Due')) return 'text-yellow-500';
    return 'text-red-500';
  };

  const filteredAnimals = animals.filter(
    (animal) =>
      animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.id.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur border-b border-accent/20 px-4 sm:px-6 py-3"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl">🐂</span>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold">
                <span className="text-accent">BOVISION</span>
                <span className="text-cyan-400"> AI</span>
              </h1>
              <p className="text-xs text-gray-400">Smart Herd, Stronger Future</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xs">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search cattle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-accent/30 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-accent/60 focus:outline-none transition"
              />
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
        <motion.div className="hidden md:block w-56 bg-black/80 backdrop-blur border-r border-accent/20 fixed left-0 top-16 bottom-0 overflow-y-auto z-30">
          <div className="p-4 space-y-1">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left text-sm ${
                  item.id === 'overview'
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
            <p className="text-xs text-green-400">Uptime: 99.9%</p>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 md:ml-56 p-4 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">HERD OVERVIEW</h2>
              <p className="text-sm text-gray-400">Real-time monitoring and AI-powered insights</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: 'TOTAL CATTLE', value: '128', change: '+12 this month', icon: '🐄' },
                { label: 'HEALTHY', value: '112', change: '87.5% of herd', icon: '❤️' },
                { label: 'AT RISK', value: '8', change: '6.3% of herd', icon: '⚠️' },
                { label: 'NEED ATTENTION', value: '8', change: '6.3% of herd', icon: '🔔' },
              ].map((kpi, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 sm:p-4 border border-accent/30 rounded-lg bg-black/50 hover:border-accent/60 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg sm:text-xl">{kpi.icon}</span>
                    <span className="text-xs text-gray-400">···</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{kpi.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-accent mb-1">{kpi.value}</p>
                  <p className="text-xs text-gray-500">{kpi.change}</p>
                </motion.div>
              ))}
            </div>

            {/* Animals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredAnimals.map((animal, i) => (
                <motion.div
                  key={animal.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 border-2 rounded-lg bg-black/50 hover:border-accent/80 transition ${getStatusColor(animal.status)}`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-accent">#{animal.id}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      animal.status === 'Healthy' ? 'text-green-400' : 'text-yellow-500'
                    }`}>
                      {animal.status === 'Healthy' && '❤️ Healthy'}
                      {animal.status === 'At Risk' && '⚠️ At Risk'}
                      {animal.status === 'Need Attention' && '🔔 Need Attention'}
                    </span>
                  </div>

                  {/* Image */}
                  <div className="w-full h-32 bg-gradient-to-br from-accent/10 to-cyan-400/10 rounded-lg mb-3 flex items-center justify-center text-5xl">
                    🐄
                  </div>

                  {/* Info */}
                  <h3 className="text-sm font-bold mb-1">{animal.name}</h3>
                  <p className="text-xs text-gray-400 mb-3">{animal.breed}</p>

                  {/* Metrics */}
                  <div className="space-y-2 mb-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">WEIGHT</span>
                      <span className="text-accent font-bold">{animal.weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">VACCINATION</span>
                      <span className={`font-bold ${getVaccinationColor(animal.vaccination)}`}>{animal.vaccination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">HEALTH SCORE</span>
                      <span className="text-accent font-bold">{animal.healthScore}/100</span>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="h-12 mb-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={animal.chart}>
                        <Line
                          type="monotone"
                          dataKey="weight"
                          stroke={animal.status === 'Healthy' ? '#00FF41' : '#FFB800'}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Footer */}
                  <p className="text-xs text-gray-500 text-center">Updated {animal.lastUpdated}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HerdManagement;
