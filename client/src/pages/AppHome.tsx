import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Zap, Heart, Leaf, Droplets, ArrowRight, BarChart3 } from 'lucide-react';
import DashboardApp from '../components/DashboardApp';

const AppHome = () => {
  const stats = [
    {
      icon: <Heart size={28} />,
      label: 'Rebanho Saudável',
      value: '1.250',
      change: '+12%',
      color: 'from-red-500/20 to-red-600/20',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
    },
    {
      icon: <TrendingUp size={28} />,
      label: 'Ganho de Peso',
      value: '850 kg',
      change: '+8%',
      color: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
    },
    {
      icon: <Droplets size={28} />,
      label: 'Produção Leite',
      value: '45 L/dia',
      change: '+5%',
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
    },
    {
      icon: <Leaf size={28} />,
      label: 'Qualidade Pastagem',
      value: '92%',
      change: '+3%',
      color: 'from-emerald-500/20 to-emerald-600/20',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
    },
  ];

  const alerts = [
    { icon: <AlertCircle size={20} />, message: 'Vacinação vencida para 5 animais', severity: 'high', color: 'text-red-400' },
    { icon: <Heart size={20} />, message: 'Temperatura elevada detectada', severity: 'medium', color: 'text-yellow-400' },
    { icon: <Zap size={20} />, message: 'Análise de IA concluída', severity: 'low', color: 'text-blue-400' },
  ];

  const quickActions = [
    { icon: <BarChart3 size={24} />, label: 'Analytics', path: '/app/analytics', color: 'from-purple-500 to-purple-600' },
    { icon: <Heart size={24} />, label: 'Saúde', path: '/app/health', color: 'from-red-500 to-red-600' },
    { icon: <Zap size={24} />, label: 'IA', path: '/app/ai-insights', color: 'from-yellow-500 to-yellow-600' },
    { icon: <Leaf size={24} />, label: 'Pastagem', path: '/app/pasture', color: 'from-green-500 to-green-600' },
  ];

  return (
    <DashboardApp>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Bem-vindo de volta! 👋
          </h1>
          <p className="text-gray-400">Aqui está o resumo do seu rebanho hoje</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -5 }}
              className={`bg-gradient-to-br ${stat.color} border ${stat.borderColor} rounded-2xl p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-black/50 transition`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-black/30 ${stat.textColor}`}>
                  {stat.icon}
                </div>
                <span className="text-xs font-bold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map((action, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-br ${action.color} p-6 rounded-2xl flex flex-col items-center justify-center gap-2 text-white font-bold hover:shadow-lg hover:shadow-black/50 transition`}
              >
                {action.icon}
                <span className="text-sm">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Alerts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Alertas Recentes</h2>
            <motion.button
              whileHover={{ x: 5 }}
              className="text-accent hover:text-cyan-400 transition flex items-center gap-1 text-sm"
            >
              Ver Todos <ArrowRight size={16} />
            </motion.button>
          </div>

          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                whileHover={{ x: 5 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:bg-white/10 hover:border-accent/30 transition cursor-pointer"
              >
                <div className={`p-2 rounded-lg bg-black/30 ${alert.color}`}>
                  {alert.icon}
                </div>
                <p className="flex-1 text-sm text-gray-300">{alert.message}</p>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <ArrowRight size={16} className="text-gray-500" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
        >
          <h2 className="text-xl font-bold mb-4">Atividade Recente</h2>
          <div className="space-y-3">
            {[
              { time: '14:30', action: 'Pesagem de 45 animais realizada', icon: '⚖️' },
              { time: '12:15', action: 'Análise de IA concluída com sucesso', icon: '🤖' },
              { time: '10:45', action: 'Relatório de saúde gerado', icon: '📊' },
              { time: '09:20', action: 'Alerta de nutrição enviado', icon: '🌾' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-center gap-4 pb-3 border-b border-white/5 last:border-0"
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{item.action}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardApp>
  );
};

export default AppHome;
