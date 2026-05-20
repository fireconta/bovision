import { motion } from 'framer-motion';
import { AlertCircle, Heart, Activity, Zap, Shield } from 'lucide-react';

const Health = () => {
  const healthAlerts = [
    { id: 1, animal: 'Clover', issue: 'Febre detectada (39.5°C)', severity: 'high', action: 'Veterinário' },
    { id: 2, animal: 'Luna', issue: 'Mastite suspeita - Inflamação', severity: 'medium', action: 'Monitorar' },
    { id: 3, animal: 'Bella', issue: 'Vacinação vencida', severity: 'medium', action: 'Agendar' },
  ];

  const healthMetrics = [
    { animal: 'Bella', status: 'Saudável', score: 92, temp: '38.2°C', weight: '580 kg', lastCheck: '2h atrás' },
    { animal: 'Midnight', status: 'Saudável', score: 89, temp: '38.1°C', weight: '620 kg', lastCheck: '1h atrás' },
    { animal: 'Clover', status: 'Risco', score: 68, temp: '39.5°C', weight: '550 kg', lastCheck: '30m atrás' },
    { animal: 'Daisy', status: 'Saudável', score: 91, temp: '38.3°C', weight: '595 kg', lastCheck: '45m atrás' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Heart className="text-red-400" size={32} />
          Monitoramento de Saúde
        </h2>
        <p className="text-gray-400">Status de saúde do rebanho em tempo real com alertas</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Saudáveis', value: '1.214', icon: Heart, color: 'lime' },
          { label: 'Em Risco', value: '156', icon: AlertCircle, color: 'amber' },
          { label: 'Doentes', value: '58', icon: Zap, color: 'red' },
          { label: 'Imunizados', value: '1.289', icon: Shield, color: 'cyan' },
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
              <p className={`text-3xl font-bold text-${stat.color}-400`}>{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Alerts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/30 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold mb-4 text-red-400 flex items-center gap-2">
          <AlertCircle size={24} />
          Alertas de Saúde Urgentes
        </h3>
        <div className="space-y-3">
          {healthAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + alert.id * 0.1 }}
              className={`p-4 rounded-lg bg-black/40 border-l-4 ${
                alert.severity === 'high' ? 'border-red-500 bg-red-500/5' : 'border-amber-500 bg-amber-500/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-bold text-white">{alert.animal}</p>
                  <p className={`text-sm ${
                    alert.severity === 'high' ? 'text-red-400' : 'text-amber-400'
                  }`}>{alert.issue}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    alert.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {alert.severity === 'high' ? 'CRÍTICO' : 'Atenção'}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">{alert.action}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Health Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Activity className="text-cyan-400" size={24} />
          Dados Vitais do Rebanho
        </h3>
        <div className="space-y-3">
          {healthMetrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="p-4 rounded-lg bg-black/30 border border-cyan-500/20 grid grid-cols-1 md:grid-cols-5 gap-4 items-center"
            >
              <div>
                <p className="font-bold text-white">{metric.animal}</p>
                <p className={`text-xs font-bold ${
                  metric.status === 'Saudável' ? 'text-lime-400' : 'text-orange-400'
                }`}>{metric.status}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Score</p>
                <p className={`text-lg font-bold ${
                  metric.score >= 90 ? 'text-lime-400' : metric.score >= 75 ? 'text-amber-400' : 'text-red-400'
                }`}>{metric.score}/100</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Temperatura</p>
                <p className="text-lg font-bold text-cyan-400">{metric.temp}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Peso</p>
                <p className="text-lg font-bold text-cyan-400">{metric.weight}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Último Check</p>
                <p className="text-sm text-gray-400">{metric.lastCheck}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Health;
