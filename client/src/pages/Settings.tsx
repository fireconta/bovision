import { motion } from 'framer-motion';
import { Cog, Bell, Lock, User, LogOut } from 'lucide-react';
import { useState } from 'react';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Configurações</h2>
        <p className="text-gray-400">Gerenciar preferências e segurança</p>
      </div>

      {/* Perfil */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/30"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-lime-400 to-cyan-400 flex items-center justify-center text-black font-bold text-xl">
            GF
          </div>
          <div>
            <h3 className="text-xl font-bold">Gerenciador de Fazenda</h3>
            <p className="text-gray-400">Silver Valley Ranch</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 hover:border-cyan-500/60 transition font-semibold"
        >
          Editar Perfil
        </motion.button>
      </motion.div>

      {/* Notificações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-xl bg-gradient-to-br from-lime-500/5 to-transparent border border-lime-500/30"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Bell size={20} className="text-lime-400" />
          Notificações
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span>Ativar notificações</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <span>Alertas de saúde</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <span>Atualizações de sistema</span>
          </label>
        </div>
      </motion.div>

      {/* Segurança */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-xl bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/30"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Lock size={20} className="text-orange-400" />
          Segurança
        </h3>
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:border-orange-500/60 transition font-semibold"
          >
            Alterar PIN
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:border-red-500/60 transition font-semibold text-red-400"
          >
            <LogOut className="inline mr-2" size={16} />
            Sair
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
