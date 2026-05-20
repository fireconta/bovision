import { motion } from 'framer-motion';
import { Apple, Zap, Droplets, AlertCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Nutrition = () => {
  const nutritionData = [
    { nutrient: 'Proteína', current: 16.5, recommended: 17, unit: '%' },
    { nutrient: 'Fibra', current: 22, recommended: 25, unit: '%' },
    { nutrient: 'Cálcio', current: 0.8, recommended: 0.9, unit: '%' },
    { nutrient: 'Fósforo', current: 0.45, recommended: 0.5, unit: '%' },
  ];

  const feedSchedule = [
    { time: '06:00', feed: 'Silagem de Milho', amount: '25 kg', animals: '1.250' },
    { time: '12:00', feed: 'Concentrado + Minerais', amount: '8 kg', animals: '1.250' },
    { time: '18:00', feed: 'Silagem de Milho', amount: '25 kg', animals: '1.250' },
    { time: '22:00', feed: 'Feno Premium', amount: '15 kg', animals: '1.250' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Apple className="text-amber-400" size={32} />
          Nutrição e Alimentação
        </h2>
        <p className="text-gray-400">Gestão de dieta e suplementação do rebanho</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Custo Alimentação', value: 'R$ 2.450', icon: Zap, color: 'amber' },
          { label: 'Consumo Diário', value: '73 kg/animal', icon: Apple, color: 'lime' },
          { label: 'Eficiência Alimentar', value: '6.2:1', icon: TrendingUp, color: 'cyan' },
          { label: 'Qualidade Ração', value: '8.7/10', icon: Droplets, color: 'emerald' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-xl bg-gradient-to-br from-${stat.color}-500/10 to-transparent border border-${stat.color}-500/30 backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <Icon className={`text-${stat.color}-400`} size={20} />
              </div>
              <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Nutrition Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Apple className="text-amber-400" size={24} />
          Balanço Nutricional Atual
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={nutritionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="nutrient" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #f59e0b' }}
            />
            <Legend />
            <Bar dataKey="current" fill="#F59E0B" name="Atual" radius={[8, 8, 0, 0]} />
            <Bar dataKey="recommended" fill="#06B6D4" name="Recomendado" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Feed Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-xl bg-gradient-to-br from-lime-500/10 to-transparent border border-lime-500/30 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold mb-4">Cronograma de Alimentação</h3>
        <div className="space-y-3">
          {feedSchedule.map((feed, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="p-4 rounded-lg bg-black/30 border border-lime-500/20 grid grid-cols-1 md:grid-cols-5 gap-4 items-center"
            >
              <div>
                <p className="text-xs text-gray-500 mb-1">Horário</p>
                <p className="text-lg font-bold text-lime-400">{feed.time}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Alimento</p>
                <p className="font-bold text-white">{feed.feed}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Quantidade</p>
                <p className="font-bold text-cyan-400">{feed.amount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Animais</p>
                <p className="text-sm text-gray-400">{feed.animals}</p>
              </div>
              <div className="text-right">
                <button className="px-3 py-1 rounded text-xs font-bold bg-lime-500/20 text-lime-400 hover:bg-lime-500/30 transition">
                  Registrar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="text-cyan-400" size={24} />
          Recomendações Nutricionais
        </h3>
        <div className="space-y-3">
          {[
            {
              title: 'Aumentar Proteína',
              desc: 'Proteína atual 16.5%, recomendado 17%. Adicionar 2kg de concentrado proteico.',
              priority: 'medium',
              action: 'Implementar'
            },
            {
              title: 'Suplementação de Cálcio',
              desc: 'Deficiência de cálcio detectada. Risco de hipocalcemia pós-parto.',
              priority: 'high',
              action: 'Urgente'
            },
            {
              title: 'Otimizar Fibra',
              desc: 'Aumentar feno de qualidade para melhorar saúde ruminal.',
              priority: 'low',
              action: 'Próxima semana'
            },
          ].map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className={`p-4 rounded-lg bg-black/30 border-l-4 ${
                rec.priority === 'high' ? 'border-red-500 bg-red-500/5' :
                rec.priority === 'medium' ? 'border-amber-500 bg-amber-500/5' :
                'border-lime-500 bg-lime-500/5'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-bold text-white">{rec.title}</p>
                  <p className="text-sm text-gray-400">{rec.desc}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ml-4 ${
                  rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  rec.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-lime-500/20 text-lime-400'
                }`}>
                  {rec.action}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Cost Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/30 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold mb-4">Análise de Custos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Custo Diário/Animal</p>
            <p className="text-3xl font-bold text-orange-400">R$ 1,96</p>
            <p className="text-xs text-gray-500 mt-2">Média do mês</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Custo Mensal Total</p>
            <p className="text-3xl font-bold text-orange-400">R$ 73.500</p>
            <p className="text-xs text-gray-500 mt-2">1.250 animais</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Custo por Litro Leite</p>
            <p className="text-3xl font-bold text-orange-400">R$ 0,65</p>
            <p className="text-xs text-gray-500 mt-2">Eficiência ótima</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Nutrition;
