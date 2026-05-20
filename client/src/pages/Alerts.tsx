import { motion } from 'framer-motion';
import { AlertTriangle, Bell, CheckCircle, Clock, Zap } from 'lucide-react';

const Alerts = () => {
  const alerts = [
    {
      id: 1,
      title: 'Febre em Clover',
      description: 'Temperatura 39.5°C detectada. Recomenda-se isolamento e acompanhamento veterinário.',
      severity: 'critical',
      time: '2 horas atrás',
      animal: 'Clover',
      status: 'Ativo'
    },
    {
      id: 2,
      title: 'Vacinação Vencida',
      description: 'Bella necessita vacinação contra brucelose. Agendar com veterinário.',
      severity: 'high',
      time: '5 horas atrás',
      animal: 'Bella',
      status: 'Pendente'
    },
    {
      id: 3,
      title: 'Mastite Suspeita',
      description: 'Luna apresenta sinais de inflamação. Monitorar próximas 24h.',
      severity: 'high',
      time: '8 horas atrás',
      animal: 'Luna',
      status: 'Monitorando'
    },
    {
      id: 4,
      title: 'Piquete C - Pastagem Crítica',
      description: 'Disponibilidade de forragem em 45%. Rotação urgente recomendada.',
      severity: 'high',
      time: '1 dia atrás',
      animal: 'Piquete C',
      status: 'Ativo'
    },
    {
      id: 5,
      title: 'Manutenção de Equipamento',
      description: 'Ordenhadeira necessita revisão preventiva. Agendar para próxima semana.',
      severity: 'medium',
      time: '2 dias atrás',
      animal: 'Equipamento',
      status: 'Agendado'
    },
    {
      id: 6,
      title: 'Deficiência de Cálcio',
      description: 'Rebanho apresenta níveis baixos de cálcio. Aumentar suplementação.',
      severity: 'medium',
      time: '3 dias atrás',
      animal: 'Rebanho',
      status: 'Em Ação'
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'amber';
      default: return 'lime';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch(severity) {
      case 'critical': return 'CRÍTICO';
      case 'high': return 'ALTO';
      case 'medium': return 'MÉDIO';
      default: return 'BAIXO';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Ativo': return <AlertTriangle size={16} />;
      case 'Pendente': return <Clock size={16} />;
      case 'Monitorando': return <Zap size={16} />;
      case 'Agendado': return <Clock size={16} />;
      case 'Em Ação': return <Zap size={16} />;
      default: return <CheckCircle size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Bell className="text-red-400" size={32} />
          Alertas e Notificações
        </h2>
        <p className="text-gray-400">Monitoramento de eventos críticos e avisos do rebanho</p>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Críticos', value: '1', color: 'red' },
          { label: 'Altos', value: '3', color: 'orange' },
          { label: 'Médios', value: '2', color: 'amber' },
          { label: 'Resolvidos', value: '12', color: 'lime' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-xl bg-gradient-to-br from-${stat.color}-500/10 to-transparent border border-${stat.color}-500/30 backdrop-blur-sm`}
          >
            <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold text-${stat.color}-400`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((alert, i) => {
          const color = getSeverityColor(alert.severity);
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-lg bg-black/30 border-l-4 border-${color}-500 bg-${color}-500/5 backdrop-blur-sm`}
            >
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
                <div className="md:col-span-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`text-${color}-400 mt-1 flex-shrink-0`} size={20} />
                    <div>
                      <p className={`font-bold text-${color}-400`}>{alert.title}</p>
                      <p className="text-sm text-gray-400 mt-1">{alert.description}</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Animal/Local</p>
                  <p className="font-bold text-white">{alert.animal}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <div className={`flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-bold bg-${color}-500/20 text-${color}-400`}>
                    {getStatusIcon(alert.status)}
                    {alert.status}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-2">{alert.time}</p>
                  <button className={`px-3 py-1 rounded text-xs font-bold bg-${color}-500/20 text-${color}-400 hover:bg-${color}-500/30 transition`}>
                    Ação
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Alert Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold mb-4">Configurações de Alertas</h3>
        <div className="space-y-4">
          {[
            { title: 'Alertas de Saúde', enabled: true, desc: 'Notificações sobre febre, mastite e doenças' },
            { title: 'Alertas de Vacinação', enabled: true, desc: 'Lembretes de vacinação vencida' },
            { title: 'Alertas de Pastagem', enabled: true, desc: 'Notificações sobre disponibilidade de forragem' },
            { title: 'Alertas de Nutrição', enabled: false, desc: 'Deficiências nutricionais detectadas' },
            { title: 'Alertas de Equipamento', enabled: true, desc: 'Manutenção preventiva necessária' },
          ].map((setting, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="p-4 rounded-lg bg-black/30 border border-cyan-500/20 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-white">{setting.title}</p>
                <p className="text-sm text-gray-400">{setting.desc}</p>
              </div>
              <div className={`w-12 h-6 rounded-full transition ${
                setting.enabled ? 'bg-lime-500' : 'bg-gray-600'
              } flex items-center ${setting.enabled ? 'justify-end' : 'justify-start'} p-1 cursor-pointer`}>
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Alerts;
