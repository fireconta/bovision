import { motion } from 'framer-motion';
import { Leaf, Droplets, Sun, AlertCircle, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Pasture = () => {
  const pastureData = [
    { week: 'Sem 1', available: 85, consumed: 65, regeneration: 45 },
    { week: 'Sem 2', available: 88, consumed: 68, regeneration: 48 },
    { week: 'Sem 3', available: 92, consumed: 72, regeneration: 52 },
    { week: 'Sem 4', available: 95, consumed: 75, regeneration: 55 },
  ];

  const paddocks = [
    { name: 'Piquete A', area: '2.5 ha', condition: 'Excelente', available: 92, quality: 'Alta', lastRotation: '3 dias' },
    { name: 'Piquete B', area: '2.0 ha', condition: 'Bom', available: 78, quality: 'Média', lastRotation: '5 dias' },
    { name: 'Piquete C', area: '3.0 ha', condition: 'Crítico', available: 45, quality: 'Baixa', lastRotation: '12 dias' },
    { name: 'Piquete D', area: '2.8 ha', condition: 'Bom', available: 82, quality: 'Média', lastRotation: '4 dias' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Leaf className="text-emerald-400" size={32} />
          Gestão de Pastagem
        </h2>
        <p className="text-gray-400">Monitoramento de disponibilidade e qualidade de forragem</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Disponibilidade Média', value: '90%', icon: Leaf, color: 'emerald' },
          { label: 'Consumo Diário', value: '72 kg/animal', icon: Droplets, color: 'cyan' },
          { label: 'Taxa Regeneração', value: '52 kg/ha', icon: TrendingDown, color: 'lime' },
          { label: 'Qualidade Forragem', value: 'Boa', icon: Sun, color: 'amber' },
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

      {/* Pasture Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Leaf className="text-emerald-400" size={24} />
          Evolução de Disponibilidade
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={pastureData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="week" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #10b981' }}
            />
            <Area type="monotone" dataKey="available" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Disponível" />
            <Area type="monotone" dataKey="consumed" stackId="1" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} name="Consumido" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Paddocks Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold mb-4">Status dos Piquetes</h3>
        <div className="space-y-3">
          {paddocks.map((paddock, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="p-4 rounded-lg bg-black/30 border border-cyan-500/20 grid grid-cols-1 md:grid-cols-6 gap-4 items-center"
            >
              <div>
                <p className="font-bold text-white">{paddock.name}</p>
                <p className="text-xs text-gray-500">{paddock.area}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Condição</p>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  paddock.condition === 'Excelente' ? 'bg-lime-500/20 text-lime-400' :
                  paddock.condition === 'Crítico' ? 'bg-red-500/20 text-red-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {paddock.condition}
                </span>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Disponível</p>
                <p className={`text-lg font-bold ${
                  paddock.available >= 80 ? 'text-lime-400' :
                  paddock.available >= 60 ? 'text-amber-400' :
                  'text-red-400'
                }`}>{paddock.available}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Qualidade</p>
                <p className="text-sm text-cyan-400">{paddock.quality}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Última Rotação</p>
                <p className="text-sm text-gray-400">{paddock.lastRotation}</p>
              </div>
              <div className="text-right">
                <button className="px-3 py-1 rounded text-xs font-bold bg-lime-500/20 text-lime-400 hover:bg-lime-500/30 transition">
                  Rotar
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
        className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/30 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="text-orange-400" size={24} />
          Recomendações de Manejo
        </h3>
        <div className="space-y-3">
          {[
            { title: 'Rotação Urgente', desc: 'Piquete C necessita rotação imediata (45% disponível)', priority: 'high' },
            { title: 'Irrigação Recomendada', desc: 'Piquetes A e D podem se beneficiar de irrigação', priority: 'medium' },
            { title: 'Adubação', desc: 'Aplicar adubo nitrogenado em Piquete B (regeneração lenta)', priority: 'medium' },
            { title: 'Monitoramento', desc: 'Continuar monitoramento diário de disponibilidade', priority: 'low' },
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
                <div>
                  <p className="font-bold text-white">{rec.title}</p>
                  <p className="text-sm text-gray-400">{rec.desc}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  rec.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-lime-500/20 text-lime-400'
                }`}>
                  {rec.priority === 'high' ? 'URGENTE' : rec.priority === 'medium' ? 'IMPORTANTE' : 'INFO'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Pasture;
