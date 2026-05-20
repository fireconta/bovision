import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Camera, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const mockAnimals = [
  { id: 1, name: 'Bella', breed: 'Holstein', age: 5, weight: 534, lastWeigh: '2026-06-27', status: 'Healthy', vaccineDate: '2026-05-15' },
  { id: 2, name: 'Midnight', breed: 'Angus', age: 3, weight: 482, lastWeigh: '2026-06-27', status: 'Healthy', vaccineDate: '2026-05-20' },
  { id: 3, name: 'Clover', breed: 'Simmental', age: 4, weight: 598, lastWeigh: '2026-06-26', status: 'At Risk', vaccineDate: '2026-04-10' },
];

export default function HerdManagement() {
  const [selectedAnimal, setSelectedAnimal] = useState<typeof mockAnimals[0] | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold gradient-text">Gestão do Rebanho</h1>
              <p className="text-sm text-muted-foreground">Cadastro e monitoramento de animais</p>
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-background">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Animal
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Animals List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 bg-background border-border neon-glow">
              <h3 className="text-lg font-bold mb-4 gradient-text">Animais Cadastrados ({mockAnimals.length})</h3>
              
              <div className="space-y-3">
                {mockAnimals.map((animal) => (
                  <motion.div
                    key={animal.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedAnimal(animal)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                      selectedAnimal?.id === animal.id
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-lg">{animal.name}</h4>
                        <p className="text-sm text-muted-foreground">{animal.breed} • {animal.age} anos</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          animal.status === 'Healthy'
                            ? 'bg-accent/20 text-accent'
                            : 'bg-red-500/20 text-red-500'
                        }`}
                      >
                        {animal.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Peso</p>
                        <p className="font-bold">{animal.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Última Pesagem</p>
                        <p className="font-bold">{animal.lastWeigh}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Vacinação</p>
                        <p className="font-bold">{animal.vaccineDate}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Animal Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {selectedAnimal ? (
              <Card className="p-6 bg-background border-border neon-glow sticky top-24">
                <h3 className="text-lg font-bold mb-4 gradient-text">Detalhes do Animal</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="w-full h-40 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-lg flex items-center justify-center border border-accent/30">
                    <Camera className="w-8 h-8 text-accent" />
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">NOME</p>
                    <p className="font-bold text-lg">{selectedAnimal.name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">RAÇA</p>
                      <p className="font-bold">{selectedAnimal.breed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">IDADE</p>
                      <p className="font-bold">{selectedAnimal.age} anos</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">PESO ATUAL</p>
                      <p className="font-bold text-lg gradient-text">{selectedAnimal.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">STATUS</p>
                      <p className={`font-bold ${selectedAnimal.status === 'Healthy' ? 'text-accent' : 'text-red-500'}`}>
                        {selectedAnimal.status}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-background">
                    <Camera className="w-4 h-4 mr-2" />
                    Pesagem por IA
                  </Button>
                  <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/10">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Deletar
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-6 bg-background border-border neon-glow text-center">
                <p className="text-muted-foreground">Selecione um animal para ver detalhes</p>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Timeline */}
        {selectedAnimal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Card className="p-6 bg-background border-border neon-glow">
              <h3 className="text-lg font-bold mb-6 gradient-text">Histórico de {selectedAnimal.name}</h3>
              
              <div className="space-y-4">
                {[
                  { date: '2026-06-27', event: 'Pesagem por IA', weight: '534 kg', icon: '⚖️' },
                  { date: '2026-06-20', event: 'Vacinação aplicada', vaccine: 'Brucela', icon: '💉' },
                  { date: '2026-06-15', event: 'Exame de saúde', result: 'Normal', icon: '🏥' },
                  { date: '2026-06-10', event: 'Pesagem manual', weight: '530 kg', icon: '📊' },
                ].map((entry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 pb-4 border-b border-border last:border-b-0"
                  >
                    <div className="text-2xl">{entry.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{entry.date}</p>
                      <p className="font-bold">{entry.event}</p>
                      {entry.weight && <p className="text-sm text-accent">{entry.weight}</p>}
                      {entry.vaccine && <p className="text-sm text-accent">{entry.vaccine}</p>}
                      {entry.result && <p className="text-sm text-accent">{entry.result}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
