import { motion } from 'framer-motion';
import { Apple, Droplet } from 'lucide-react';

const Nutrition = () => {
  const nutritionData = [
    { nutrient: 'Proteína', current: 16.5, recommended: 18, unit: '%' },
    { nutrient: 'Fibra', current: 22, recommended: 25, unit: '%' },
    { nutrient: 'Cálcio', current: 0.8, recommended: 1.0, unit: 'g/kg' },
    { nutrient: 'Fósforo', current: 0.5, recommended: 0.6, unit: 'g/kg' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Nutrição</h2>
        <p className="text-gray-400">Gestão nutricional do rebanho</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nutritionData.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-xl bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/30"
          >
            <div className="flex items-center gap-2 mb-4">
              <Apple className="text-orange-400" size={20} />
              <h3 className="font-bold">{item.nutrient}</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Atual</span>
                  <span className="text-sm font-bold">{item.current} {item.unit}</span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-2">
                  <div
                    className="bg-orange-400 h-2 rounded-full"
                    style={{ width: `${(item.current / item.recommended) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Recomendado: {item.recommended} {item.unit}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Nutrition;
