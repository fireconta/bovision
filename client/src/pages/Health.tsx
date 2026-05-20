import { motion } from 'framer-motion';
import { AlertCircle, Heart } from 'lucide-react';

const Health = () => {
  const healthAlerts = [
    { id: 1, animal: 'Clover', issue: 'Febre detectada', severity: 'high' },
    { id: 2, animal: 'Luna', issue: 'Mastite suspeita', severity: 'medium' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Monitoramento de Saúde</h2>
        <p className="text-gray-400">Status de saúde do rebanho</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-gradient-to-br from-lime-500/5 to-transparent border border-lime-500/30"
        >
          <div className="flex items-center gap-3 mb-2">
            <Heart className="text-lime-400" size={24} />
            <span className="text-gray-400">Saudáveis</span>
          </div>
          <p className="text-3xl font-bold text-lime-400">1.214</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/5 to-transparent border border-yellow-500/30"
        >
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-yellow-400" size={24} />
            <span className="text-gray-400">Em Risco</span>
          </div>
          <p className="text-3xl font-bold text-yellow-400">156</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/30"
        >
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-red-400" size={24} />
            <span className="text-gray-400">Doentes</span>
          </div>
          <p className="text-3xl font-bold text-red-400">58</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-xl bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/30"
      >
        <h3 className="text-lg font-bold mb-4 text-red-400">Alertas de Saúde</h3>
        <div className="space-y-3">
          {healthAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
              <div>
                <p className="font-semibold">{alert.animal}</p>
                <p className="text-sm text-gray-400">{alert.issue}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                alert.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {alert.severity === 'high' ? 'Alto' : 'Médio'}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Health;
