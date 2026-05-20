import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BarChart3,
  Heart,
  Leaf,
  Droplets,
  AlertCircle,
  FileText,
  Settings,
  Menu,
  X,
  ChevronRight,
  Zap,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useLocation } from 'wouter';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  color: string;
}

const DashboardApp = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();

  const navItems: NavItem[] = [
    { icon: <Home size={24} />, label: 'Home', path: '/app', color: 'from-blue-500 to-blue-600' },
    { icon: <BarChart3 size={24} />, label: 'Analytics', path: '/app/analytics', color: 'from-purple-500 to-purple-600' },
    { icon: <Heart size={24} />, label: 'Saúde', path: '/app/health', color: 'from-red-500 to-red-600' },
    { icon: <Zap size={24} />, label: 'IA Insights', path: '/app/ai-insights', color: 'from-yellow-500 to-yellow-600' },
    { icon: <Leaf size={24} />, label: 'Pastagem', path: '/app/pasture', color: 'from-green-500 to-green-600' },
    { icon: <Droplets size={24} />, label: 'Nutrição', path: '/app/nutrition', color: 'from-cyan-500 to-cyan-600' },
    { icon: <AlertCircle size={24} />, label: 'Alertas', path: '/app/alerts', color: 'from-orange-500 to-orange-600' },
    { icon: <FileText size={24} />, label: 'Relatórios', path: '/app/reports', color: 'from-indigo-500 to-indigo-600' },
    { icon: <Settings size={24} />, label: 'Configurações', path: '/app/settings', color: 'from-gray-500 to-gray-600' },
  ];

  const bgImage = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663677906549/T2VQu6STr22DABekAsCKWM/agro-bg-2-V5TRWAAkjW67BUKdDDGZwm.webp';

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="hidden md:flex md:w-72 bg-gradient-to-b from-black via-black/95 to-black/90 border-r border-accent/20 flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-accent/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-black">B</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">
                <span className="text-accent">BOVISION</span>
              </h1>
              <p className="text-xs text-gray-400">AI Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item, i) => {
            const isActive = location === item.path;
            return (
              <motion.button
                key={item.path}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight size={18} className="ml-auto" />}
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-accent/20">
          <div className="text-xs text-gray-500 text-center">
            <p>BOVISION AI v1.0</p>
            <p>© 2026 Agro Tech</p>
          </div>
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-64 bg-black border-r border-accent/20 z-50 flex flex-col"
            >
              {/* Logo */}
              <div className="p-6 border-b border-accent/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-cyan-400 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-black">B</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-accent">BOVISION</h1>
                    <p className="text-xs text-gray-400">AI</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = location === item.path;
                  return (
                    <motion.button
                      key={item.path}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        window.location.href = item.path;
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-b from-black/80 to-black/40 backdrop-blur-md border-b border-accent/20 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-accent">Dashboard</h2>
              <p className="text-xs text-gray-400">Bem-vindo ao seu painel Agro</p>
            </div>
          </div>

          {/* User Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-cyan-400 rounded-full flex items-center justify-center">
              <Users size={20} className="text-black" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold">Usuário</p>
              <p className="text-xs text-gray-400">Premium</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Content Area */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
          }}
        >
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardApp;
