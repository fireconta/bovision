import { motion } from 'framer-motion';
import { Leaf, Droplet } from 'lucide-react';

const Pasture = () => {
  const pastureData = [
    { name: 'Pasto Norte', quality: 85, moisture: 65, area: '12 hectares' },
    { name: 'Pasto Sul', quality: 72, moisture: 58, area: '8 hectares' },
    { name: 'Pasto Leste', quality: 90, moisture: 70, area: '15 hectares' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Gestão de Pastagem</h2>
        <p className="text-gray-400">Monitoramento de qualidade de pastagem</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pastureData.map((pasture, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-xl bg-gradient-to-br from-lime-500/5 to-transparent border border-lime-500/30"
          >
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="text-lime-400" size={20} />
              <h3 className="font-bold">{pasture.name}</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Qualidade</p>
                <div className="w-full bg-black/30 rounded-full h-2">
                  <div
                    className="bg-lime-400 h-2 rounded-full"
                    style={{ width: `${pasture.quality}%` }}
                  ></div>
                </div>
                <p className="text-sm font-bold mt-1">{pasture.quality}%</p>
              </div>
              <div className="flex items-center gap-2">
                <Droplet size={16} className="text-cyan-400" />
                <span className="text-sm">Umidade: {pasture.moisture}%</span>
              </div>
              <p className="text-xs text-gray-500">Área: {pasture.area}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Pasture;
