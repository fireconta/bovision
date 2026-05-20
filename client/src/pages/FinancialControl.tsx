import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const FinancialControl = () => {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');

  const monthlyData = [
    { month: 'Jan', income: 15000, expense: 8000 },
    { month: 'Fev', income: 16000, expense: 8500 },
    { month: 'Mar', income: 14500, expense: 7800 },
    { month: 'Abr', income: 17000, expense: 9200 },
    { month: 'Mai', income: 18000, expense: 9500 },
    { month: 'Jun', income: 16500, expense: 8800 },
  ];

  const expenseBreakdown = [
    { name: 'Alimentação', value: 45, color: '#00FF41' },
    { name: 'Veterinário', value: 25, color: '#00D9FF' },
    { name: 'Medicamentos', value: 15, color: '#9D4EDD' },
    { name: 'Outros', value: 15, color: '#FFB800' },
  ];

  const transactions = [
    { id: 1, type: 'income', description: 'Venda de leite', amount: 5000, date: '2024-01-15', category: 'Vendas' },
    { id: 2, type: 'expense', description: 'Ração para animais', amount: -2500, date: '2024-01-14', category: 'Alimentação' },
    { id: 3, type: 'income', description: 'Venda de carne', amount: 8000, date: '2024-01-13', category: 'Vendas' },
    { id: 4, type: 'expense', description: 'Consulta veterinária', amount: -800, date: '2024-01-12', category: 'Veterinário' },
    { id: 5, type: 'expense', description: 'Medicamentos', amount: -450, date: '2024-01-11', category: 'Medicamentos' },
  ];

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = Math.abs(transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="text-accent">CONTROLE</span> FINANCEIRO
          </h1>
          <p className="text-gray-400">Gestão de receitas e despesas da fazenda</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddTransaction(!showAddTransaction)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-lg font-bold hover:shadow-lg hover:shadow-accent/50 transition"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Adicionar</span>
        </motion.button>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        {[
          { label: 'Receita Total', value: `R$ ${totalIncome.toLocaleString('pt-BR')}`, icon: TrendingUp, color: 'text-green-400' },
          { label: 'Despesa Total', value: `R$ ${totalExpense.toLocaleString('pt-BR')}`, icon: TrendingDown, color: 'text-red-400' },
          { label: 'Lucro Líquido', value: `R$ ${netProfit.toLocaleString('pt-BR')}`, icon: DollarSign, color: 'text-accent' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="p-4 border border-accent/30 rounded-lg bg-black/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{kpi.label}</p>
                  <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                </div>
                <Icon size={32} className={kpi.color} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 p-6 border border-accent/30 rounded-lg bg-black/50"
        >
          <h3 className="text-lg font-bold mb-4">Receita vs Despesa (6 Meses)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 65, 0.1)" />
              <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.5)" />
              <YAxis stroke="rgba(255, 255, 255, 0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(0, 255, 65, 0.3)',
                }}
              />
              <Legend />
              <Bar dataKey="income" fill="#00FF41" />
              <Bar dataKey="expense" fill="#FF6B6B" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 border border-accent/30 rounded-lg bg-black/50"
        >
          <h3 className="text-lg font-bold mb-4">Distribuição de Despesas</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-xs">
            {expenseBreakdown.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-6 border border-accent/30 rounded-lg bg-black/50"
      >
        <h3 className="text-lg font-bold mb-4">Transações Recentes</h3>
        <div className="space-y-2">
          {transactions.map((transaction, i) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="p-3 border border-accent/20 rounded-lg flex items-center justify-between hover:border-accent/60 transition"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp size={20} className="text-green-400" />
                  ) : (
                    <TrendingDown size={20} className="text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{transaction.description}</p>
                  <p className="text-xs text-gray-400">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {transaction.type === 'income' ? '+' : '-'} R$ {Math.abs(transaction.amount).toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-400">{new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddTransaction(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-black border-2 border-accent/40 rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Adicionar Transação</h3>

            <div className="space-y-4">
              {/* Type Selection */}
              <div className="flex gap-2">
                {['income', 'expense'].map((type) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTransactionType(type as 'income' | 'expense')}
                    className={`flex-1 py-2 rounded-lg font-bold transition ${
                      transactionType === type
                        ? type === 'income'
                          ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                          : 'bg-red-500/20 border border-red-500/40 text-red-400'
                        : 'bg-black/50 border border-accent/30 text-gray-400'
                    }`}
                  >
                    {type === 'income' ? 'Receita' : 'Despesa'}
                  </motion.button>
                ))}
              </div>

              {/* Form Fields */}
              <input
                type="text"
                placeholder="Descrição"
                className="w-full bg-black/50 border border-accent/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-accent/60 focus:outline-none transition"
              />
              <input
                type="number"
                placeholder="Valor"
                className="w-full bg-black/50 border border-accent/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-accent/60 focus:outline-none transition"
              />
              <select className="w-full bg-black/50 border border-accent/30 rounded-lg px-4 py-2 text-white focus:border-accent/60 focus:outline-none transition">
                <option>Alimentação</option>
                <option>Veterinário</option>
                <option>Medicamentos</option>
                <option>Vendas</option>
                <option>Outros</option>
              </select>

              {/* Buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddTransaction(false)}
                  className="flex-1 py-2 bg-black/50 border border-accent/30 rounded-lg text-accent hover:bg-accent/10 transition"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2 bg-accent text-black rounded-lg font-bold hover:shadow-lg hover:shadow-accent/50 transition"
                >
                  Adicionar
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FinancialControl;
