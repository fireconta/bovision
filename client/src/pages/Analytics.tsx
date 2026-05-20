import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Analytics = () => {
  const productivityData = [
    { month: 'Jan', production: 2400, efficiency: 85 },
    { month: 'Fev', production: 2800, efficiency: 88 },
    { month: 'Mar', production: 3200, efficiency: 90 },
    { month: 'Abr', production: 3100, efficiency: 87 },
    { month: 'Mai', production: 3600, efficiency: 92 },
  ];

  const breedData = [
    { name: 'Angus', value: 35, fill: '#00FF41' },
    { name: 'Holstein', value: 30, fill: '#00D9FF' },
    { name: 'Simmental', value: 20, fill: '#FFB800' },
    { name: 'Jersey', value: 15, fill: '#FF6B6B' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Análises</h2>
        <p className="text-gray-400">Dados de produtividade e desempenho</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Produção Média', value: '3,220 L', change: '+12%', color: 'lime' },
          { label: 'Eficiência', value: '89.2%', change: '+5%', color: 'cyan' },
          { label: 'Crescimento', value: '1.8 kg/dia', change: '+8%', color: 'orange' },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-xl bg-gradient-to-br from-${kpi.color}-500/5 to-transparent border border-${kpi.color}-500/30`}
          >
            <p className="text-sm text-gray-500 mb-2">{kpi.label}</p>
            <p className={`text-2xl font-bold text-${kpi.color}-400 mb-2`}>{kpi.value}</p>
            <p className={`text-xs text-${kpi.color}-400`}>{kpi.change} vs mês anterior</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl bg-gradient-to-br from-lime-500/5 to-transparent border border-lime-500/30"
        >
          <h3 className="text-sm font-bold mb-4 text-lime-400 uppercase">Tendência de Produção</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="production" stroke="#00FF41" strokeWidth={2} />
              <Line type="monotone" dataKey="efficiency" stroke="#00D9FF" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Breed Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/30"
        >
          <h3 className="text-sm font-bold mb-4 text-cyan-400 uppercase">Distribuição de Raças</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={breedData} cx="50%" cy="50%" outerRadius={100} paddingAngle={5} dataKey="value">
                {breedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-xl bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/30"
      >
        <h3 className="text-lg font-bold mb-4">Métricas de Desempenho</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Taxa de Conversão Alimentar</p>
            <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '78%' }}
                transition={{ duration: 1, delay: 0.6 }}
                className="h-full bg-gradient-to-r from-lime-400 to-cyan-400"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">78% - Excelente</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Saúde do Rebanho</p>
            <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '92%' }}
                transition={{ duration: 1, delay: 0.7 }}
                className="h-full bg-gradient-to-r from-lime-400 to-cyan-400"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">92% - Ótimo</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
