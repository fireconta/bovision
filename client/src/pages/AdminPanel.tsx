import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, Menu, X, Plus, Trash2, Lock, Unlock, Search } from 'lucide-react';

export default function AdminPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState<any>({ bvId: '', pin: '', plan: 'trial', email: '' });
  const [activeTab, setActiveTab] = useState('users');

  const handleAdminLogin = () => {
    if (adminPassword === 'admin') {
      setIsAuthenticated(true);
      setAdminPassword('');
    } else {
      alert('Senha de administrador incorreta');
    }
  };

  const handleAddUser = () => {
    if (!newUser.bvId || !newUser.pin || !newUser.email) {
      alert('Preencha todos os campos');
      return;
    }
    setUsers([...users, { 
      id: Date.now(), 
      ...newUser, 
      status: 'active', 
      createdAt: new Date().toLocaleDateString('pt-BR'),
      lastLogin: new Date().toLocaleDateString('pt-BR')
    }]);
    setNewUser({ bvId: '', pin: '', plan: 'trial', email: '' });
    setShowAddUser(false);
  };

  const handleDeleteUser = (id: any) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleToggleUserStatus = (id: any) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const filteredUsers: any[] = users.filter((u: any) =>
    u.bvId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="p-6 sm:p-8 border-border">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 gradient-text text-center">BOVISION AI</h1>
            <p className="text-muted-foreground text-center mb-6 sm:mb-8 text-sm sm:text-base">Painel Administrativo</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-semibold mb-2 block">Senha de Administrador</label>
                <Input
                  type="password"
                  placeholder="Digite a senha"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                  className="bg-background border-border text-sm"
                />
              </div>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-background text-sm"
                onClick={handleAdminLogin}
              >
                Acessar Painel
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <h1 className="text-lg sm:text-xl font-bold gradient-text">Admin</h1>
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
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="bg-background w-64 h-full border-r border-border p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-6 gradient-text">Menu</h2>
            <nav className="space-y-2 mb-8">
              <button
                onClick={() => { setActiveTab('users'); setSidebarOpen(false); }}
                className={`w-full text-left p-3 rounded-lg transition text-sm ${
                  activeTab === 'users' ? 'bg-accent/20 text-accent' : 'hover:bg-accent/10'
                }`}
              >
                Utilizadores
              </button>
              <button
                onClick={() => { setActiveTab('stats'); setSidebarOpen(false); }}
                className={`w-full text-left p-3 rounded-lg transition text-sm ${
                  activeTab === 'stats' ? 'bg-accent/20 text-accent' : 'hover:bg-accent/10'
                }`}
              >
                Estatísticas
              </button>
            </nav>
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white text-sm"
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
        <p className="text-xs text-muted-foreground mb-8">Painel Administrativo</p>
        <nav className="space-y-2 mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-left p-3 rounded-lg transition ${
              activeTab === 'users' ? 'bg-accent/20 text-accent font-semibold' : 'hover:bg-accent/10'
            }`}
          >
            Utilizadores
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full text-left p-3 rounded-lg transition ${
              activeTab === 'stats' ? 'bg-accent/20 text-accent font-semibold' : 'hover:bg-accent/10'
            }`}
          >
            Estatísticas
          </button>
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              {activeTab === 'users' ? 'Gestão de Utilizadores' : 'Estatísticas'}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {activeTab === 'users' ? 'Gerencie todos os utilizadores da plataforma' : 'Visualize estatísticas gerais'}
            </p>
          </motion.div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Add User Button */}
              <Button
                className="bg-accent hover:bg-accent/90 text-background text-sm"
                onClick={() => setShowAddUser(!showAddUser)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Utilizador
              </Button>

              {/* Add User Form */}
              {showAddUser && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-4 sm:p-6 border-border">
                    <h3 className="text-base sm:text-lg font-bold mb-4">Novo Utilizador</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                      <div>
                        <label className="text-xs sm:text-sm font-semibold mb-2 block">BV-ID</label>
                        <Input
                          placeholder="BV-XXXXXXXX"
                          value={newUser.bvId}
                          onChange={(e) => setNewUser({ ...newUser, bvId: e.target.value })}
                          className="bg-background border-border text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-semibold mb-2 block">PIN (6 dígitos)</label>
                        <Input
                          placeholder="000000"
                          value={newUser.pin}
                          onChange={(e) => setNewUser({ ...newUser, pin: e.target.value })}
                          className="bg-background border-border text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-semibold mb-2 block">Email</label>
                        <Input
                          type="email"
                          placeholder="usuario@exemplo.com"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          className="bg-background border-border text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-semibold mb-2 block">Plano</label>
                        <select
                          value={newUser.plan}
                          onChange={(e) => setNewUser({ ...newUser, plan: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg p-2 text-foreground text-sm"
                        >
                          <option value="trial">Trial (30 dias)</option>
                          <option value="monthly">Mensal (R$ 299)</option>
                          <option value="annual">Anual (R$ 2.990)</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-accent hover:bg-accent/90 text-background text-sm"
                        onClick={handleAddUser}
                      >
                        Adicionar
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-accent/50 text-accent hover:bg-accent/10 text-sm"
                        onClick={() => setShowAddUser(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por BV-ID ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border text-sm"
                />
              </div>

              {/* Users Table */}
              <Card className="p-4 sm:p-6 border-border overflow-x-auto">
                {filteredUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 font-semibold">BV-ID</th>
                          <th className="text-left py-3 px-2 font-semibold hidden sm:table-cell">Email</th>
                          <th className="text-left py-3 px-2 font-semibold hidden md:table-cell">Plano</th>
                          <th className="text-left py-3 px-2 font-semibold hidden lg:table-cell">Status</th>
                          <th className="text-left py-3 px-2 font-semibold">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user: any) => (
                          <tr key={user.id} className="border-b border-border/50 hover:bg-accent/5 transition">
                            <td className="py-3 px-2 text-accent font-mono text-xs sm:text-sm">{user.bvId}</td>
                            <td className="py-3 px-2 hidden sm:table-cell text-muted-foreground text-xs sm:text-sm">{user.email}</td>
                            <td className="py-3 px-2 hidden md:table-cell">
                              <span className="text-xs px-2 py-1 rounded bg-accent/20 text-accent">
                                {user.plan === 'trial' ? 'Trial' : user.plan === 'monthly' ? 'Mensal' : 'Anual'}
                              </span>
                            </td>
                            <td className="py-3 px-2 hidden lg:table-cell">
                              <span className={`text-xs px-2 py-1 rounded ${
                                user.status === 'active'
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {user.status === 'active' ? 'Ativo' : 'Bloqueado'}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex gap-1 sm:gap-2">
                                <button
                                  onClick={() => handleToggleUserStatus(user.id)}
                                  className="p-1 hover:bg-accent/10 rounded transition"
                                  title={user.status === 'active' ? 'Bloquear' : 'Desbloquear'}
                                >
                                  {user.status === 'active' ? (
                                    <Lock className="w-4 h-4 text-yellow-500" />
                                  ) : (
                                    <Unlock className="w-4 h-4 text-green-500" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-1 hover:bg-red-500/10 rounded transition"
                                  title="Deletar"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Nenhum utilizador registrado
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <Card className="p-4 sm:p-6 border-border">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">Total de Utilizadores</p>
                <p className="text-2xl sm:text-3xl font-bold gradient-text">{users.length}</p>
              </Card>
              <Card className="p-4 sm:p-6 border-border">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">Utilizadores Ativos</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-400">{users.filter(u => u.status === 'active').length}</p>
              </Card>
              <Card className="p-4 sm:p-6 border-border">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">Utilizadores Bloqueados</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-400">{users.filter(u => u.status === 'blocked').length}</p>
              </Card>
              <Card className="p-4 sm:p-6 border-border">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">Planos Trial</p>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-400">{users.filter(u => u.plan === 'trial').length}</p>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
