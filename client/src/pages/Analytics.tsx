import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { Leaf, TrendingUp, Droplets, Zap } from 'lucide-react';

const Analytics = () => {
  const productivityData = [
    { month: 'Jan', milk: 2400, weight: 450, efficiency: 85 },
    { month: 'Fev', milk: 2800, weight: 480, efficiency: 88 },
    { month: 'Mar', milk: 3200, weight: 510, efficiency: 90 },
    { month: 'Abr', milk: 3100, weight: 520, efficiency: 87 },
    { month: 'Mai', milk: 3600, weight: 540, efficiency: 92 },
  ];

  const breedData = [
    { name: 'Angus', value: 35, fill: '#22C55E' },
    { name: 'Holstein', value: 30, fill: '#06B6D4' },
    { name: 'Simmental', value: 20, fill: '#F59E0B' },
    { name: 'Jersey', value: 15, fill: '#EF4444' },
  ];

  const pastureData = [
    { week: 'Sem 1', available: 85, consumed: 65, regeneration: 45 },
    { week: 'Sem 2', available: 88, consumed: 68, regeneration: 48 },
    { week: 'Sem 3', available: 92, consumed: 72, regeneration: 52 },
    { week: 'Sem 4', available: 95, consumed: 75, regeneration: 55 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Leaf className="text-lime-400" size={32} />
          Análises Agro
        </h2>
        <p className="text-gray-400">Dados de produtividade, saúde e desempenho do rebanho</p>
      </div>

      {/* KPI Cards - Agro Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Produção Leite', value: '3,220 L', change: '+12%', icon: Droplets, color: 'cyan' },
          { label: 'Ganho Médio', value: '1.8 kg/dia', change: '+8%', icon: TrendingUp, color: 'lime' },
          { label: 'Eficiência', value: '89.2%', change: '+5%', icon: Zap, color: 'amber' },
          { label: 'Saúde Rebanho', value: '94.5%', change: '+3%', icon: Leaf, color: 'emerald' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-xl bg-gradient-to-br from-${kpi.color}-500/10 to-transparent border border-${kpi.color}-500/30 backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500">{kpi.label}</p>
                <Icon className={`text-${kpi.color}-400`} size={20} />
              </div>
              <p className={`text-2xl font-bold text-${kpi.color}-400 mb-2`}>{kpi.value}</p>
              <p className={`text-xs text-${kpi.color}-400/70`}>{kpi.change} vs mês anterior</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produção e Ganho de Peso */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl bg-gradient-to-br from-lime-500/10 to-transparent border border-lime-500/30 backdrop-blur-sm"
        >
          <h3 className="text-sm font-bold mb-4 text-lime-400 uppercase flex items-center gap-2">
            <Droplets size={16} />
            Produção de Leite & Ganho de Peso
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #22c55e' }}
                cursor={{ stroke: '#22c55e' }}
              />
              <Legend />
              <Line type="monotone" dataKey="milk" stroke="#22C55E" strokeWidth={2} name="Leite (L)" />
              <Line type="monotone" dataKey="weight" stroke="#06B6D4" strokeWidth={2} name="Peso (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribuição de Raças */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 backdrop-blur-sm"
        >
          <h3 className="text-sm font-bold mb-4 text-cyan-400 uppercase flex items-center gap-2">
            <Leaf size={16} />
            Distribuição de Raças
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={breedData} cx="50%" cy="50%" outerRadius={100} paddingAngle={5} dataKey="value">
                {breedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #06b6d4' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Eficiência Alimentar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 backdrop-blur-sm"
        >
          <h3 className="text-sm font-bold mb-4 text-amber-400 uppercase flex items-center gap-2">
            <Zap size={16} />
            Eficiência Alimentar
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #f59e0b' }}
              />
              <Bar dataKey="efficiency" fill="#F59E0B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Disponibilidade de Pastagem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 backdrop-blur-sm"
        >
          <h3 className="text-sm font-bold mb-4 text-emerald-400 uppercase flex items-center gap-2">
            <Leaf size={16} />
            Gestão de Pastagem
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={pastureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="week" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #10b981' }}
              />
              <Area type="monotone" dataKey="available" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
              <Area type="monotone" dataKey="consumed" stackId="1" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/30 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold mb-6">Indicadores de Desempenho Agro</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Taxa de Conversão Alimentar</p>
              <span className="text-sm font-bold text-lime-400">78%</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden border border-lime-500/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '78%' }}
                transition={{ duration: 1, delay: 0.8 }}
                className="h-full bg-gradient-to-r from-lime-400 to-emerald-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Excelente - Acima da média</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Saúde do Rebanho</p>
              <span className="text-sm font-bold text-cyan-400">92%</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden border border-cyan-500/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '92%' }}
                transition={{ duration: 1, delay: 0.9 }}
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Ótimo - Sem alertas</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Cobertura Vacinação</p>
              <span className="text-sm font-bold text-amber-400">88%</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden border border-amber-500/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '88%' }}
                transition={{ duration: 1, delay: 1.0 }}
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Bom - Manutenção necessária</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
