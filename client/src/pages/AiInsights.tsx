import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Zap } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AiInsights = () => {
  const predictions = [
    { month: 'Jun', predicted: 3800, confidence: 94 },
    { month: 'Jul', predicted: 4100, confidence: 91 },
    { month: 'Ago', predicted: 4300, confidence: 88 },
    { month: 'Set', predicted: 4500, confidence: 85 },
  ];

  const insights = [
    {
      title: 'Otimização de Alimentação',
      description: 'Aumentar proteína em 5% pode melhorar ganho de peso em 12%',
      impact: '+12%',
      color: 'lime',
      icon: Lightbulb,
    },
    {
      title: 'Prevenção de Mastite',
      description: 'Clover apresenta risco 3x maior. Recomenda-se monitoramento diário',
      impact: 'Alto',
      color: 'red',
      icon: AlertTriangle,
    },
    {
      title: 'Melhor Período de Reprodução',
      description: 'Próxima semana é ideal para inseminação (ciclo estral ótimo)',
      impact: '95%',
      color: 'cyan',
      icon: TrendingUp,
    },
    {
      title: 'Economia de Custos',
      description: 'Ajustar horário de ordenha pode reduzir custos em 8%',
      impact: '-8%',
      color: 'amber',
      icon: Zap,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Brain className="text-lime-400" size={32} />
          IA Insights Agro
        </h2>
        <p className="text-gray-400">Análises preditivas e recomendações inteligentes para sua fazenda</p>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-xl bg-gradient-to-br from-${insight.color}-500/10 to-transparent border border-${insight.color}-500/30 backdrop-blur-sm`}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon className={`text-${insight.color}-400`} size={24} />
                <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${insight.color}-500/20 text-${insight.color}-400`}>
                  {insight.impact}
                </span>
              </div>
              <h3 className="font-bold mb-2">{insight.title}</h3>
              <p className="text-sm text-gray-400">{insight.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-xl bg-gradient-to-br from-lime-500/10 to-transparent border border-lime-500/30 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="text-lime-400" size={24} />
          Previsão de Produção (Próximos 4 Meses)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={predictions}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #22c55e' }}
              cursor={{ stroke: '#22c55e' }}
            />
            <Legend />
            <Line type="monotone" dataKey="predicted" stroke="#22C55E" strokeWidth={2} name="Produção Prevista (L)" />
            <Line type="monotone" dataKey="confidence" stroke="#06B6D4" strokeWidth={2} name="Confiança (%)" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold mb-4">Recomendações Personalizadas</h3>
        <div className="space-y-4">
          {[
            {
              title: 'Nutrição Otimizada',
              items: [
                'Aumentar suplementação de cálcio (Bella e Daisy)',
                'Reduzir grãos em 10% (Luna - risco de acidose)',
                'Adicionar probióticos (rebanho inteiro)',
              ]
            },
            {
              title: 'Manejo Sanitário',
              items: [
                'Aumentar frequência de limpeza (3x/dia)',
                'Monitorar Clover diariamente (febre)',
                'Agendar vacinação para próxima semana',
              ]
            },
            {
              title: 'Reprodução',
              items: [
                'Melhor período para inseminação: próxima semana',
                'Confiança de sucesso: 92%',
                'Custo estimado: R$ 450/animal',
              ]
            },
          ].map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="p-4 rounded-lg bg-black/30 border border-cyan-500/20"
            >
              <p className="font-bold text-cyan-400 mb-2">{rec.title}</p>
              <ul className="space-y-1">
                {rec.items.map((item, j) => (
                  <li key={j} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-lime-400 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Model Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold mb-4">Desempenho do Modelo IA</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Acurácia de Previsão</p>
            <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden border border-amber-500/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '94%' }}
                transition={{ duration: 1, delay: 0.7 }}
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">94% - Excelente</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Dados Processados</p>
            <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden border border-amber-500/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '87%' }}
                transition={{ duration: 1, delay: 0.8 }}
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">87% - Bom</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Confiabilidade</p>
            <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden border border-amber-500/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '91%' }}
                transition={{ duration: 1, delay: 0.9 }}
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">91% - Ótimo</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AiInsights;
