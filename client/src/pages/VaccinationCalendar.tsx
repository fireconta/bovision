import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const VaccinationCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const vaccinations = [
    {
      id: 1,
      animal: 'Bella',
      animalId: '001',
      vaccine: 'Febre Aftosa',
      date: '2024-01-20',
      status: 'Scheduled',
      daysUntil: 5,
    },
    {
      id: 2,
      animal: 'Midnight',
      animalId: '002',
      vaccine: 'Raiva',
      date: '2024-01-18',
      status: 'Overdue',
      daysUntil: -3,
    },
    {
      id: 3,
      animal: 'Clover',
      animalId: '003',
      vaccine: 'IBR',
      date: '2024-01-22',
      status: 'Scheduled',
      daysUntil: 7,
    },
    {
      id: 4,
      animal: 'Daisy',
      animalId: '004',
      vaccine: 'Brucela',
      date: '2024-01-10',
      status: 'Completed',
      daysUntil: -5,
    },
    {
      id: 5,
      animal: 'Rosie',
      animalId: '005',
      vaccine: 'Leptospirose',
      date: '2024-01-25',
      status: 'Scheduled',
      daysUntil: 10,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/20 border-green-500/40 text-green-400';
      case 'Scheduled':
        return 'bg-blue-500/20 border-blue-500/40 text-blue-400';
      case 'Overdue':
        return 'bg-red-500/20 border-red-500/40 text-red-400';
      default:
        return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle size={18} />;
      case 'Overdue':
        return <AlertCircle size={18} />;
      case 'Scheduled':
        return <Clock size={18} />;
      default:
        return <Calendar size={18} />;
    }
  };

  const upcomingVaccinations = vaccinations.filter((v) => v.status !== 'Completed').sort((a, b) => a.daysUntil - b.daysUntil);

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="text-accent">CALENDÁRIO</span> DE VACINAÇÃO
        </h1>
        <p className="text-gray-400">Acompanhe o cronograma de vacinação do rebanho</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 p-6 border border-accent/30 rounded-lg bg-black/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {new Date(selectedYear, selectedMonth).toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric',
              })}
            </h2>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMonth(selectedMonth === 0 ? 11 : selectedMonth - 1)}
                className="px-3 py-1 bg-accent/10 border border-accent/30 rounded-lg hover:bg-accent/20 transition"
              >
                ←
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMonth(selectedMonth === 11 ? 0 : selectedMonth + 1)}
                className="px-3 py-1 bg-accent/10 border border-accent/30 rounded-lg hover:bg-accent/20 transition"
              >
                →
              </motion.button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
              <div key={day} className="text-center text-xs text-gray-400 font-bold py-2">
                {day}
              </div>
            ))}

            {[...Array(35)].map((_, i) => {
              const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
              const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
              const day = i - firstDay + 1;
              const isCurrentMonth = day > 0 && day <= daysInMonth;
              const hasVaccination = isCurrentMonth && vaccinations.some(
                (v) => new Date(v.date).getDate() === day && new Date(v.date).getMonth() === selectedMonth
              );

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-2 rounded-lg text-center text-sm font-bold ${
                    isCurrentMonth
                      ? hasVaccination
                        ? 'bg-accent/20 border border-accent/60 text-accent'
                        : 'bg-black/50 border border-accent/20 text-white'
                      : 'text-gray-700'
                  }`}
                >
                  {isCurrentMonth && day}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming Vaccinations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 border border-accent/30 rounded-lg bg-black/50"
        >
          <h3 className="text-lg font-bold mb-4">Próximas Vacinações</h3>
          <div className="space-y-3">
            {upcomingVaccinations.slice(0, 5).map((vac, i) => (
              <motion.div
                key={vac.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className={`p-3 border rounded-lg flex items-start gap-3 ${getStatusColor(vac.status)}`}
              >
                <div className="mt-1">{getStatusIcon(vac.status)}</div>
                <div className="flex-1">
                  <p className="font-bold text-sm">#{vac.animalId} - {vac.animal}</p>
                  <p className="text-xs opacity-80">{vac.vaccine}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {vac.daysUntil > 0
                      ? `Em ${vac.daysUntil} dias`
                      : vac.daysUntil === 0
                      ? 'Hoje'
                      : `Atrasado ${Math.abs(vac.daysUntil)} dias`}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* All Vaccinations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-6 border border-accent/30 rounded-lg bg-black/50"
      >
        <h3 className="text-lg font-bold mb-4">Todas as Vacinações</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vaccinations.map((vac, i) => (
            <motion.div
              key={vac.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className={`p-4 border rounded-lg ${getStatusColor(vac.status)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold">#{vac.animalId} - {vac.animal}</p>
                  <p className="text-sm opacity-80">{vac.vaccine}</p>
                </div>
                {getStatusIcon(vac.status)}
              </div>
              <p className="text-xs opacity-70 mt-2">
                {new Date(vac.date).toLocaleDateString('pt-BR')}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default VaccinationCalendar;
