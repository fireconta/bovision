import { motion } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';

const AIInsights = () => {
  const insights = [
    { title: 'Otimização de Peso', description: 'Aumentar proteína em 15% para melhor ganho de peso', impact: 'Alto' },
    { title: 'Alerta de Saúde', description: '3 animais com risco de infecção respiratória', impact: 'Crítico' },
    { title: 'Nutrição Recomendada', description: 'Ajustar alimentação conforme mudanças climáticas', impact: 'Médio' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">IA Insights</h2>
        <p className="text-gray-400">Recomendações inteligentes baseadas em IA</p>
      </div>

      <div className="space-y-4">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/30"
          >
            <div className="flex items-start gap-4">
              <Zap className="text-cyan-400 flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">{insight.title}</h3>
                <p className="text-gray-400 mb-3">{insight.description}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  insight.impact === 'Crítico' ? 'bg-red-500/20 text-red-400' :
                  insight.impact === 'Alto' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-lime-500/20 text-lime-400'
                }`}>
                  Impacto: {insight.impact}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
