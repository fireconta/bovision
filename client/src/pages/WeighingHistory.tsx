import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeighingHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const weighingHistory = [
    {
      id: '001',
      name: 'Bella',
      date: '2024-01-15',
      weight: 534,
      confidence: 98.7,
      status: 'Completed',
      measurements: { length: 183, height: 132, chest: 207 },
    },
    {
      id: '002',
      name: 'Midnight',
      date: '2024-01-14',
      weight: 482,
      confidence: 97.2,
      status: 'Completed',
      measurements: { length: 175, height: 128, chest: 195 },
    },
    {
      id: '003',
      name: 'Clover',
      date: '2024-01-13',
      weight: 598,
      confidence: 96.5,
      status: 'Completed',
      measurements: { length: 190, height: 135, chest: 215 },
    },
    {
      id: '004',
      name: 'Daisy',
      date: '2024-01-12',
      weight: 412,
      confidence: 99.1,
      status: 'Completed',
      measurements: { length: 165, height: 125, chest: 185 },
    },
    {
      id: '005',
      name: 'Rosie',
      date: '2024-01-11',
      weight: 620,
      confidence: 98.3,
      status: 'Completed',
      measurements: { length: 195, height: 138, chest: 220 },
    },
  ];

  const chartData = [
    { date: 'Jan 7', weight: 520 },
    { date: 'Jan 8', weight: 525 },
    { date: 'Jan 9', weight: 530 },
    { date: 'Jan 10', weight: 532 },
    { date: 'Jan 11', weight: 535 },
    { date: 'Jan 12', weight: 534 },
    { date: 'Jan 13', weight: 538 },
    { date: 'Jan 14', weight: 540 },
    { date: 'Jan 15', weight: 543 },
  ];

  const filteredHistory = weighingHistory.filter(
    (item) =>
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.includes(searchQuery)) &&
      (filterStatus === 'all' || item.status === filterStatus)
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="text-accent">HISTÓRICO</span> DE PESAGENS
        </h1>
        <p className="text-gray-400">Acompanhe todas as pesagens realizadas</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar animal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/50 border border-accent/30 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-accent/60 focus:outline-none transition"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <Filter size={18} className="text-accent mt-2" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 bg-black/50 border border-accent/30 rounded-lg px-4 py-2 text-sm text-white focus:border-accent/60 focus:outline-none transition"
          >
            <option value="all">Todos os Status</option>
            <option value="Completed">Concluído</option>
            <option value="Pending">Pendente</option>
          </select>
        </div>

        {/* Export */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 bg-accent/10 border border-accent/30 rounded-lg px-4 py-2 text-accent hover:bg-accent/20 transition"
        >
          <Download size={18} />
          <span className="text-sm">Exportar</span>
        </motion.button>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 border border-accent/30 rounded-lg bg-black/50 mb-6"
      >
        <h3 className="text-lg font-bold mb-4">Evolução de Peso</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 65, 0.1)" />
            <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.5)" />
            <YAxis stroke="rgba(255, 255, 255, 0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(0, 255, 65, 0.3)',
              }}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#00FF41"
              strokeWidth={2}
              dot={{ fill: '#00FF41', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        {filteredHistory.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="p-4 border border-accent/30 rounded-lg bg-black/50 hover:border-accent/60 transition"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              {/* Animal Info */}
              <div>
                <p className="text-sm text-gray-400">Animal</p>
                <p className="font-bold">#{item.id} - {item.name}</p>
              </div>

              {/* Date */}
              <div>
                <p className="text-sm text-gray-400">Data</p>
                <p className="font-bold">{new Date(item.date).toLocaleDateString('pt-BR')}</p>
              </div>

              {/* Weight */}
              <div>
                <p className="text-sm text-gray-400">Peso</p>
                <p className="font-bold text-accent">{item.weight} kg</p>
              </div>

              {/* Confidence */}
              <div>
                <p className="text-sm text-gray-400">Confiança</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-black/50 border border-accent/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.confidence}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.05 }}
                      className="h-full bg-accent"
                    />
                  </div>
                  <span className="text-sm font-bold text-accent">{item.confidence}%</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-green-500/20 border border-green-500/40 text-green-400 rounded-full text-xs font-bold">
                  ✓ {item.status}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-accent/10 rounded-lg transition"
                >
                  📋
                </motion.button>
              </div>
            </div>

            {/* Measurements */}
            <div className="mt-3 pt-3 border-t border-accent/20 grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-gray-400">Comprimento:</span>
                <span className="text-accent font-bold ml-1">{item.measurements.length} cm</span>
              </div>
              <div>
                <span className="text-gray-400">Altura:</span>
                <span className="text-accent font-bold ml-1">{item.measurements.height} cm</span>
              </div>
              <div>
                <span className="text-gray-400">Perímetro Torácico:</span>
                <span className="text-accent font-bold ml-1">{item.measurements.chest} cm</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default WeighingHistory;
