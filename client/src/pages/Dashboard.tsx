import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LogOut, Menu, X } from 'lucide-react';

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalAnimals: 0,
    avgWeight: 0,
    growthRate: 0,
    healthScore: 0,
    weightTrend: [],
    vaccineStatus: [],
    animalsList: [],
  });

  useEffect(() => {
    // Aqui você buscaria dados reais da API
    // Por enquanto, começamos com dados vazios
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('bovision_session');
    window.location.href = '/aplicativo';
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-bold gradient-text">BOVISION AI</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-accent/10 rounded-lg transition"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="bg-background w-64 h-full border-r border-border p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-6 gradient-text">Menu</h2>
            <nav className="space-y-2">
              <a href="/app" className="block p-3 rounded-lg hover:bg-accent/10 transition">Dashboard</a>
              <a href="/app/rebanho" className="block p-3 rounded-lg hover:bg-accent/10 transition">Rebanho</a>
              <a href="/app/assistente" className="block p-3 rounded-lg hover:bg-accent/10 transition">Assistente IA</a>
              <a href="/app/pesagem" className="block p-3 rounded-lg hover:bg-accent/10 transition">Pesagem</a>
            </nav>
            <Button
              className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </motion.div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-64 lg:bg-card/50 lg:border-r lg:border-border lg:p-6 lg:overflow-y-auto">
        <h1 className="text-2xl font-bold mb-8 gradient-text">BOVISION AI</h1>
        <nav className="space-y-2 mb-8">
          <a href="/app" className="block p-3 rounded-lg hover:bg-accent/10 transition font-semibold text-accent">Dashboard</a>
          <a href="/app/rebanho" className="block p-3 rounded-lg hover:bg-accent/10 transition">Rebanho</a>
          <a href="/app/assistente" className="block p-3 rounded-lg hover:bg-accent/10 transition">Assistente IA</a>
          <a href="/app/pesagem" className="block p-3 rounded-lg hover:bg-accent/10 transition">Pesagem</a>
        </nav>
        <Button
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 pt-20 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">Dashboard</h2>
            <p className="text-muted-foreground">Bem-vindo ao seu painel de controle</p>
          </motion.div>

          {/* Metrics Grid */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: 'Total de Animais', value: dashboardData.totalAnimals || '-', icon: '🐄' },
              { label: 'Peso Médio', value: dashboardData.avgWeight ? `${dashboardData.avgWeight} kg` : '-', icon: '⚖️' },
              { label: 'Taxa de Crescimento', value: dashboardData.growthRate ? `${dashboardData.growthRate}%` : '-', icon: '📈' },
              { label: 'Saúde Geral', value: dashboardData.healthScore ? `${dashboardData.healthScore}%` : '-', icon: '❤️' },
            ].map((metric, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="p-4 sm:p-6 border-border hover:border-accent transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">{metric.label}</p>
                      <p className="text-xl sm:text-2xl font-bold gradient-text">{metric.value}</p>
                    </div>
                    <span className="text-3xl sm:text-4xl">{metric.icon}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Grid */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8"
          >
            {/* Weight Trend Chart */}
            <motion.div variants={itemVariants}>
              <Card className="p-4 sm:p-6 border-border">
                <h3 className="text-lg font-bold mb-4">Tendência de Peso</h3>
                {dashboardData.weightTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.weightTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#999" />
                      <YAxis stroke="#999" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00ff7f' }}
                        labelStyle={{ color: '#00ff7f' }}
                      />
                      <Line type="monotone" dataKey="weight" stroke="#00ff7f" strokeWidth={2} dot={{ fill: '#00ff7f' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    Nenhum dado disponível
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Vaccine Status Chart */}
            <motion.div variants={itemVariants}>
              <Card className="p-4 sm:p-6 border-border">
                <h3 className="text-lg font-bold mb-4">Status de Vacinação</h3>
                {dashboardData.vaccineStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.vaccineStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dashboardData.vaccineStatus && dashboardData.vaccineStatus.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00ff7f' }}
                        labelStyle={{ color: '#00ff7f' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    Nenhum dado disponível
                  </div>
                )}
              </Card>
            </motion.div>
          </motion.div>

          {/* Animals List */}
          <motion.div variants={itemVariants}>
            <Card className="p-4 sm:p-6 border-border">
              <h3 className="text-lg font-bold mb-4">Animais Recentes</h3>
              {dashboardData.animalsList.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2">ID</th>
                        <th className="text-left py-2 px-2">Nome</th>
                        <th className="text-left py-2 px-2 hidden sm:table-cell">Raça</th>
                        <th className="text-left py-2 px-2">Peso</th>
                        <th className="text-left py-2 px-2 hidden sm:table-cell">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.animalsList && dashboardData.animalsList.length > 0 ? dashboardData.animalsList.map((animal: any) => (
                        <tr key={animal.id} className="border-b border-border/50 hover:bg-accent/5 transition">
                          <td className="py-2 px-2 text-accent">{animal.id}</td>
                          <td className="py-2 px-2">{animal.name}</td>
                          <td className="py-2 px-2 hidden sm:table-cell text-muted-foreground">{animal.breed}</td>
                          <td className="py-2 px-2">{animal.weight} kg</td>
                          <td className="py-2 px-2 hidden sm:table-cell">
                            <span className={`px-2 py-1 rounded text-xs ${
                              animal.status === 'Healthy' 
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {animal.status}
                            </span>
                          </td>
                        </tr>
                      )) : null}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum animal registrado ainda
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
