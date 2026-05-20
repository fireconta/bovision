import { motion } from 'framer-motion';
import { FileText, Download, Calendar, BarChart3, TrendingUp } from 'lucide-react';

const Reports = () => {
  const reports = [
    {
      id: 1,
      title: 'Relatório de Produção Mensal',
      description: 'Análise completa de produção de leite, ganho de peso e eficiência',
      date: 'Maio 2026',
      type: 'Produção',
      status: 'Disponível',
      size: '2.4 MB'
    },
    {
      id: 2,
      title: 'Relatório de Saúde do Rebanho',
      description: 'Status de vacinação, doenças detectadas e alertas de saúde',
      date: 'Maio 2026',
      type: 'Saúde',
      status: 'Disponível',
      size: '1.8 MB'
    },
    {
      id: 3,
      title: 'Análise Financeira',
      description: 'Custos de alimentação, receitas e análise de lucratividade',
      date: 'Maio 2026',
      type: 'Financeiro',
      status: 'Disponível',
      size: '3.2 MB'
    },
    {
      id: 4,
      title: 'Relatório de Nutrição',
      description: 'Balanço nutricional, consumo de ração e recomendações',
      date: 'Maio 2026',
      type: 'Nutrição',
      status: 'Disponível',
      size: '1.5 MB'
    },
    {
      id: 5,
      title: 'Análise de Pastagem',
      description: 'Disponibilidade de forragem, rotação de piquetes e regeneração',
      date: 'Maio 2026',
      type: 'Pastagem',
      status: 'Disponível',
      size: '2.1 MB'
    },
    {
      id: 6,
      title: 'Previsões IA - Próximos 3 Meses',
      description: 'Previsões de produção, saúde e recomendações personalizadas',
      date: 'Maio 2026',
      type: 'IA Insights',
      status: 'Processando',
      size: '—'
    },
  ];

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Produção': return 'lime';
      case 'Saúde': return 'red';
      case 'Financeiro': return 'amber';
      case 'Nutrição': return 'orange';
      case 'Pastagem': return 'emerald';
      case 'IA Insights': return 'cyan';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FileText className="text-cyan-400" size={32} />
          Relatórios e Análises
        </h2>
        <p className="text-gray-400">Geração e download de relatórios detalhados</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Gerar Relatório', desc: 'Criar novo relatório personalizado', icon: BarChart3 },
          { title: 'Agendar Relatório', desc: 'Configurar envio automático mensal', icon: Calendar },
          { title: 'Exportar Dados', desc: 'Baixar dados em Excel ou CSV', icon: Download },
        ].map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-gradient-to-br from-lime-500/10 to-transparent border border-lime-500/30 backdrop-blur-sm cursor-pointer hover:border-lime-500/50 transition"
            >
              <Icon className="text-lime-400 mb-3" size={24} />
              <p className="font-bold mb-1">{action.title}</p>
              <p className="text-sm text-gray-400">{action.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold mb-4">Relatórios Disponíveis</h3>
        <div className="space-y-3">
          {reports.map((report, i) => {
            const color = getTypeColor(report.type);
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="p-4 rounded-lg bg-black/30 border border-cyan-500/20 grid grid-cols-1 md:grid-cols-6 gap-4 items-center"
              >
                <div className="md:col-span-2">
                  <p className="font-bold text-white">{report.title}</p>
                  <p className="text-sm text-gray-400 mt-1">{report.description}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Tipo</p>
                  <span className={`px-2 py-1 rounded text-xs font-bold bg-${color}-500/20 text-${color}-400`}>
                    {report.type}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Data</p>
                  <p className="font-bold text-white">{report.date}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    report.status === 'Disponível' 
                      ? 'bg-lime-500/20 text-lime-400' 
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <div className="text-right">
                  {report.status === 'Disponível' ? (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">{report.size}</p>
                      <button className="px-3 py-1 rounded text-xs font-bold bg-lime-500/20 text-lime-400 hover:bg-lime-500/30 transition flex items-center gap-1 ml-auto">
                        <Download size={14} />
                        Download
                      </button>
                    </div>
                  ) : (
                    <div className="animate-pulse">
                      <p className="text-xs text-amber-400">Processando...</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Report Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="text-amber-400" size={24} />
          Modelos de Relatório
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Produção Semanal', desc: 'Resumo de produção e eficiência' },
            { name: 'Saúde Mensal', desc: 'Análise de vacinação e doenças' },
            { name: 'Financeiro Trimestral', desc: 'Análise de custos e receitas' },
            { name: 'IA Preditiva', desc: 'Previsões e recomendações' },
          ].map((template, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="p-4 rounded-lg bg-black/30 border border-amber-500/20 cursor-pointer hover:border-amber-500/50 transition"
            >
              <p className="font-bold text-white mb-1">{template.name}</p>
              <p className="text-sm text-gray-400 mb-3">{template.desc}</p>
              <button className="px-3 py-1 rounded text-xs font-bold bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition">
                Usar Modelo
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;
