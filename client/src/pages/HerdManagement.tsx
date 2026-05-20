import { useState } from 'react';
import { motion } from 'framer-motion';

const HerdManagement = () => {
  const [selectedCattle, setSelectedCattle] = useState<any>(null);

  const cattleList = [
    { id: '001', name: 'Bella', breed: 'Holstein Friesian', weight: 534, age: 3.5, status: 'Healthy', health: 92, vaccination: 'Up to date', lastUpdate: 'Updated 2 min ago' },
    { id: '002', name: 'Midnight', breed: 'Angus', weight: 482, age: 2.8, status: 'Healthy', health: 89, vaccination: 'Up to date', lastUpdate: 'Updated 1 min ago' },
    { id: '003', name: 'Clover', breed: 'Simmental', weight: 598, age: 4.2, status: 'At Risk', health: 68, vaccination: 'Due in 5 days', lastUpdate: 'Updated 3 min ago' },
    { id: '004', name: 'Daisy', breed: 'Jersey', weight: 412, age: 3.1, status: 'Healthy', health: 91, vaccination: 'Up to date', lastUpdate: 'Updated 2 min ago' },
    { id: '005', name: 'Rosie', breed: 'Brown Swiss', weight: 620, age: 5.0, status: 'Healthy', health: 94, vaccination: 'Up to date', lastUpdate: 'Updated 1 min ago' },
    { id: '006', name: 'Luna', breed: 'Charolais', weight: 450, age: 2.3, status: 'Need Attention', health: 42, vaccination: 'Overdue', lastUpdate: 'Updated 4 min ago' },
    { id: '007', name: 'Molly', breed: 'Holstein Friesian', weight: 544, age: 3.8, status: 'Healthy', health: 90, vaccination: 'Up to date', lastUpdate: 'Updated 3 min ago' },
    { id: '008', name: 'Maple', breed: 'Angus', weight: 560, age: 4.1, status: 'At Risk', health: 71, vaccination: 'Due in 2 days', lastUpdate: 'Updated 3 min ago' },
  ];

  return (
    <div className="min-h-screen bg-black text-foreground pt-20 p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">HERD OVERVIEW</h1>
          <p className="text-muted-foreground">Real-time monitoring and AI-powered insights</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'TOTAL CATTLE', value: '128', icon: '🐄', change: '+12 this month' },
            { label: 'HEALTHY', value: '112', icon: '❤️', change: '87.5% of herd' },
            { label: 'AT RISK', value: '8', icon: '⚠️', change: '6.3% of herd' },
            { label: 'NEED ATTENTION', value: '8', icon: '🔒', change: '6.3% of herd' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="p-4 border border-accent/30 rounded-lg bg-black/50 hover:border-accent/60 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-accent">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-xl font-bold mb-4">CATTLE INVENTORY</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cattleList.map((cattle, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }} onClick={() => setSelectedCattle(cattle)} className="p-4 border border-accent/30 rounded-lg bg-black/50 hover:border-accent/60 transition cursor-pointer hover:bg-black/70">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-accent">#{cattle.id}</span>
                  <span className={`text-xs px-2 py-1 rounded font-bold ${cattle.status === 'Healthy' ? 'bg-green-500/20 text-green-400' : cattle.status === 'At Risk' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-orange-500/20 text-orange-400'}`}>{cattle.status}</span>
                </div>
                <div className="aspect-square bg-gradient-to-br from-accent/20 to-cyan-500/20 rounded-lg flex items-center justify-center mb-3 text-4xl">🐄</div>
                <h3 className="text-sm font-bold mb-1">{cattle.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{cattle.breed}</p>
                <div className="space-y-2 text-xs mb-3 pb-3 border-b border-accent/20">
                  <div className="flex justify-between"><span>Weight:</span><span className="text-accent">{cattle.weight} kg</span></div>
                  <div className="flex justify-between"><span>Age:</span><span className="text-accent">{cattle.age} years</span></div>
                  <div className="flex justify-between"><span>Vaccination:</span><span className={cattle.vaccination === 'Up to date' ? 'text-green-400' : 'text-yellow-400'}>{cattle.vaccination}</span></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Health Score</span>
                  <span className="text-sm font-bold text-accent">{cattle.health}/100</span>
                </div>
                <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden mt-1">
                  <div className={`h-full ${cattle.health >= 80 ? 'bg-green-500' : cattle.health >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${cattle.health}%` }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">{cattle.lastUpdate}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {selectedCattle && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedCattle(null)} className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="bg-black border-2 border-accent/30 rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{selectedCattle.name}</h2>
                <button onClick={() => setSelectedCattle(null)} className="text-2xl text-muted-foreground hover:text-accent transition">✕</button>
              </div>
              <div className="text-4xl mb-4 text-center">🐄</div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between"><span>ID:</span><span className="text-accent font-bold">{selectedCattle.id}</span></div>
                <div className="flex justify-between"><span>Raça:</span><span className="text-accent font-bold">{selectedCattle.breed}</span></div>
                <div className="flex justify-between"><span>Peso:</span><span className="text-accent font-bold">{selectedCattle.weight} kg</span></div>
                <div className="flex justify-between"><span>Idade:</span><span className="text-accent font-bold">{selectedCattle.age} anos</span></div>
                <div className="flex justify-between"><span>Status:</span><span className="text-accent font-bold">{selectedCattle.status}</span></div>
                <div className="flex justify-between"><span>Saúde:</span><span className="text-accent font-bold">{selectedCattle.health}/100</span></div>
                <div className="flex justify-between"><span>Vacinação:</span><span className="text-accent font-bold">{selectedCattle.vaccination}</span></div>
              </div>
              <button onClick={() => setSelectedCattle(null)} className="w-full py-2 bg-accent text-black font-bold rounded-lg hover:bg-accent/90 transition">Fechar</button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HerdManagement;
