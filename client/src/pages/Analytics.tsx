import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Analytics = () => {
  const data = [
    { month: 'Jan', revenue: 4000, expenses: 2400 },
    { month: 'Fev', revenue: 3000, expenses: 1398 },
    { month: 'Mar', revenue: 2000, expenses: 9800 },
    { month: 'Abr', revenue: 2780, expenses: 3908 },
    { month: 'Mai', revenue: 1890, expenses: 4800 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Análises</h2>
        <p className="text-gray-400">Análise detalhada de desempenho</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-gradient-to-br from-lime-500/5 to-transparent border border-lime-500/30 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold mb-4 text-lime-400">Receita vs Despesa</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#00FF41" />
            <Bar dataKey="expenses" fill="#00D9FF" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Analytics;
