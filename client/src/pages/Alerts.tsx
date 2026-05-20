import { motion } from 'framer-motion';
import { AlertCircle, Bell, Trash2 } from 'lucide-react';

const Alerts = () => {
  const alerts = [
    { id: 1, title: 'Febre Detectada', message: 'Animal Clover apresenta febre', severity: 'critical', time: '2 horas atrás' },
    { id: 2, title: 'Vacinação Vencida', message: 'Luna precisa de vacinação', severity: 'high', time: '5 horas atrás' },
    { id: 3, title: 'Peso Baixo', message: 'Rosie abaixo do peso esperado', severity: 'medium', time: '1 dia atrás' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Alertas & Notificações</h2>
        <p className="text-gray-400">Gerenciamento de alertas do sistema</p>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-lg border flex items-start justify-between ${
              alert.severity === 'critical' ? 'bg-red-500/5 border-red-500/30' :
              alert.severity === 'high' ? 'bg-orange-500/5 border-orange-500/30' :
              'bg-yellow-500/5 border-yellow-500/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className={`flex-shrink-0 mt-1 ${
                alert.severity === 'critical' ? 'text-red-400' :
                alert.severity === 'high' ? 'text-orange-400' :
                'text-yellow-400'
              }`} size={20} />
              <div>
                <h3 className="font-bold">{alert.title}</h3>
                <p className="text-sm text-gray-400">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <Trash2 size={16} className="text-gray-400" />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
