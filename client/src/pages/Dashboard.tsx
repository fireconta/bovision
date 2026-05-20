import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LogOut } from 'lucide-react';

const dashboardData = {
  totalAnimals: 1428,
  avgWeight: 482,
  growthRate: 1.24,
  healthScore: 92,
  weightTrend: [
    { date: 'Jun 12', weight: 450 },
    { date: 'Jun 15', weight: 460 },
    { date: 'Jun 18', weight: 470 },
    { date: 'Jun 21', weight: 475 },
    { date: 'Jun 24', weight: 480 },
    { date: 'Jun 27', weight: 485 },
    { date: 'Jun 30', weight: 482 },
  ],
  vaccineStatus: [
    { name: 'Up to date', value: 1214, fill: '#00ff7f' },
    { name: 'Due soon', value: 156, fill: '#ffa500' },
    { name: 'Overdue', value: 58, fill: '#ff6b6b' },
  ],
  animalsList: [
    { id: '001', name: 'Bella', breed: 'Holstein', weight: 534, status: 'Healthy' },
    { id: '002', name: 'Midnight', breed: 'Angus', weight: 482, status: 'Healthy' },
    { id: '003', name: 'Clover', breed: 'Simmental', weight: 598, status: 'At Risk' },
    { id: '004', name: 'Daisy', breed: 'Jersey', weight: 412, status: 'Healthy' },
  ],
};

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
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Gestão inteligente do rebanho</p>
          </div>
          <Button
            variant="outline"
            className="border-accent text-accent hover:bg-accent/10"
            onClick={() => (window.location.href = '/')}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-8">
        {/* KPI Cards */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              label: 'Total de Animais',
              value: dashboardData.totalAnimals,
              icon: '🐂',
              change: '+12.5%',
            },
            {
              label: 'Peso Médio',
              value: `${dashboardData.avgWeight} kg`,
              icon: '⚖️',
              change: '+8.3%',
            },
            {
              label: 'Ganho Diário',
              value: `${dashboardData.growthRate} kg/dia`,
              icon: '📈',
              change: '+15.2%',
            },
            {
              label: 'Saúde Geral',
              value: `${dashboardData.healthScore}/100`,
              icon: '❤️',
              change: '+5.7%',
            },
          ].map((kpi, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="p-6 bg-background border-border hover:border-accent transition neon-glow">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{kpi.icon}</span>
                  <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded">
                    {kpi.change}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold gradient-text">{kpi.value}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Weight Trend */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="p-6 bg-background border-border neon-glow">
              <h3 className="text-lg font-bold mb-4 gradient-text">Tendência de Peso</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.weightTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,127,0.1)" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10, 10, 20, 0.9)',
                      border: '1px solid rgba(0, 255, 127, 0.3)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#00ff7f"
                    strokeWidth={2}
                    dot={{ fill: '#00ff7f', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Vaccine Status */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-background border-border neon-glow">
              <h3 className="text-lg font-bold mb-4 gradient-text">Status de Vacinação</h3>
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
                    {dashboardData.vaccineStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10, 10, 20, 0.9)',
                      border: '1px solid rgba(0, 255, 127, 0.3)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </motion.div>

        {/* Animals List */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 bg-background border-border neon-glow">
            <h3 className="text-lg font-bold mb-4 gradient-text">Rebanho Monitorado</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-4 text-muted-foreground">ID</th>
                    <th className="text-left py-2 px-4 text-muted-foreground">Nome</th>
                    <th className="text-left py-2 px-4 text-muted-foreground">Raça</th>
                    <th className="text-left py-2 px-4 text-muted-foreground">Peso</th>
                    <th className="text-left py-2 px-4 text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.animalsList.map((animal) => (
                    <tr key={animal.id} className="border-b border-border hover:bg-accent/5 transition">
                      <td className="py-3 px-4">
                        <span className="text-accent font-bold">#{animal.id}</span>
                      </td>
                      <td className="py-3 px-4">{animal.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{animal.breed}</td>
                      <td className="py-3 px-4">{animal.weight} kg</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            animal.status === 'Healthy'
                              ? 'bg-accent/20 text-accent'
                              : 'bg-red-500/20 text-red-500'
                          }`}
                        >
                          {animal.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
