import { motion } from 'framer-motion';
import { FileText, Download, Calendar } from 'lucide-react';

const Reports = () => {
  const reports = [
    { name: 'Relatório Mensal - Maio', date: '31/05/2024', type: 'PDF', size: '2.4 MB' },
    { name: 'Análise de Saúde - Abril', date: '30/04/2024', type: 'PDF', size: '1.8 MB' },
    { name: 'Financeiro - Q1 2024', date: '31/03/2024', type: 'PDF', size: '3.2 MB' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Relatórios</h2>
        <p className="text-gray-400">Geração e download de relatórios</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/30"
      >
        <h3 className="text-lg font-bold mb-4">Gerar Novo Relatório</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 rounded-lg bg-lime-500/10 border border-lime-500/30 hover:border-lime-500/60 transition"
          >
            <FileText className="text-lime-400 mb-2" size={24} />
            <p className="font-bold">Relatório Mensal</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/60 transition"
          >
            <FileText className="text-cyan-400 mb-2" size={24} />
            <p className="font-bold">Análise de Saúde</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:border-orange-500/60 transition"
          >
            <FileText className="text-orange-400 mb-2" size={24} />
            <p className="font-bold">Financeiro</p>
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-bold">Relatórios Recentes</h3>
        {reports.map((report, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            className="p-4 rounded-lg bg-black/30 border border-cyan-500/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <FileText className="text-cyan-400" size={20} />
              <div>
                <p className="font-bold">{report.name}</p>
                <p className="text-xs text-gray-500">{report.date} • {report.size}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-cyan-500/10 rounded-lg transition"
            >
              <Download className="text-cyan-400" size={20} />
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Reports;
