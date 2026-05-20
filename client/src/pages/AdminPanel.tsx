import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Lock, Unlock, Trash2, Mail, LogOut, BarChart3, Users, Settings } from 'lucide-react';
import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'blocked';
  plan: 'trial' | 'monthly' | 'annual';
  joinDate: string;
  lastLogin: string;
  devices: number;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@fazenda.com',
    status: 'active',
    plan: 'monthly',
    joinDate: '2026-01-15',
    lastLogin: '2026-06-27',
    devices: 2,
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@fazenda.com',
    status: 'active',
    plan: 'annual',
    joinDate: '2026-02-10',
    lastLogin: '2026-06-26',
    devices: 1,
  },
  {
    id: 3,
    name: 'Pedro Costa',
    email: 'pedro@fazenda.com',
    status: 'blocked',
    plan: 'trial',
    joinDate: '2026-06-01',
    lastLogin: '2026-06-15',
    devices: 3,
  },
];

const stats = [
  { label: 'Utilizadores Ativos', value: '1,248', icon: '👥', change: '+12.5%' },
  { label: 'Receita Mensal', value: 'R$ 45.2k', icon: '💰', change: '+8.3%' },
  { label: 'Rebanhos Monitorados', value: '3,847', icon: '🐂', change: '+15.2%' },
  { label: 'Taxa de Retenção', value: '94.2%', icon: '📊', change: '+2.1%' },
];

export default function AdminPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Painel Administrativo</h1>
            <p className="text-sm text-muted-foreground">Gestão da plataforma BOVISION AI</p>
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
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 bg-background border-border neon-glow">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{stat.icon}</span>
                  <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded">
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="users" className="data-[state=active]:bg-accent/20">
              <Users className="w-4 h-4 mr-2" />
              Utilizadores
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-accent/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-accent/20">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Users List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2"
              >
                <Card className="p-6 bg-background border-border neon-glow">
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Pesquisar utilizadores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background border-border focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <motion.div
                        key={user.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedUser(user)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                          selectedUser?.id === user.id
                            ? 'border-accent bg-accent/10'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold">{user.name}</h4>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              user.status === 'active'
                                ? 'bg-accent/20 text-accent'
                                : 'bg-red-500/20 text-red-500'
                            }`}
                          >
                            {user.status === 'active' ? 'Ativo' : 'Bloqueado'}
                          </span>
                        </div>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>{user.plan}</span>
                          <span>Desde {user.joinDate}</span>
                          <span>{user.devices} dispositivos</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* User Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {selectedUser ? (
                  <Card className="p-6 bg-background border-border neon-glow sticky top-24">
                    <h3 className="text-lg font-bold mb-4 gradient-text">Ações</h3>

                    <div className="space-y-2">
                      <Button className="w-full bg-accent hover:bg-accent/90 text-background justify-start">
                        <Mail className="w-4 h-4 mr-2" />
                        Enviar Email
                      </Button>
                      {selectedUser.status === 'active' ? (
                        <Button
                          variant="outline"
                          className="w-full border-red-500 text-red-500 hover:bg-red-500/10 justify-start"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Bloquear Utilizador
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full border-accent text-accent hover:bg-accent/10 justify-start"
                        >
                          <Unlock className="w-4 h-4 mr-2" />
                          Desbloquear Utilizador
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="w-full border-red-500 text-red-500 hover:bg-red-500/10 justify-start"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Deletar Utilizador
                      </Button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">ÚLTIMO ACESSO</p>
                        <p className="font-bold">{selectedUser.lastLogin}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">PLANO</p>
                        <p className="font-bold capitalize">{selectedUser.plan}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">DISPOSITIVOS</p>
                        <p className="font-bold">{selectedUser.devices}</p>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-6 bg-background border-border neon-glow text-center">
                    <p className="text-muted-foreground">Selecione um utilizador</p>
                  </Card>
                )}
              </motion.div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="p-6 bg-background border-border neon-glow text-center">
              <p className="text-muted-foreground">Análises em desenvolvimento...</p>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="p-6 bg-background border-border neon-glow text-center">
              <p className="text-muted-foreground">Configurações em desenvolvimento...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
