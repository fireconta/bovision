import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, RotateCcw } from 'lucide-react';

const AiWeighing = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25;
      if (progress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setResults({
          weight: 612,
          confidence: 98.7,
          length: 183,
          height: 132,
          chest: 207,
          measurements: {
            bodyVolume: 418.6,
            density: 1.46,
            fatIndex: 12.4,
            muscleMass: 78.6,
            boneMass: 9.2,
          },
          scanTime: 2.34,
          temperature: 24.7,
          humidity: 45.2,
          timestamp: '2024-01-15 14:30:25',
        });
      }
      setScanProgress(progress);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-black text-foreground pt-20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-accent">BOVISION</span>
            <span className="text-cyan-400"> AI</span>
          </h1>
          <p className="text-muted-foreground">Smart Weighing System</p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scanning Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2"
          >
            <div className="relative bg-black/50 border-2 border-accent/30 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
              {!isScanning && !results && (
                <button
                  onClick={startScan}
                  className="px-6 py-3 bg-accent text-black font-bold rounded-lg hover:bg-accent/90 transition"
                >
                  Iniciar Scan 3D
                </button>
              )}

              {isScanning && (
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full mx-auto mb-4"
                  />
                  <p className="text-accent font-bold">3D SCAN IN PROGRESS</p>
                  <div className="w-48 h-1 bg-black/50 rounded-full overflow-hidden mx-auto mt-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${scanProgress}%` }}
                      className="h-full bg-gradient-to-r from-accent to-cyan-400"
                    />
                  </div>
                </div>
              )}

              {results && (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-6xl mb-4">
                    ✓
                  </motion.div>
                  <p className="text-accent font-bold">SCAN COMPLETO</p>
                  <p className="text-2xl font-bold text-accent mt-2">{results.weight} KG</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Side Panel */}
          <div className="space-y-4">
            {results && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 border border-accent/30 rounded-lg bg-black/50"
                >
                  <p className="text-xs text-muted-foreground mb-3">WEIGHT ESTIMATION</p>
                  <p className="text-4xl font-bold text-accent">{results.weight}</p>
                  <p className="text-xs text-green-400 mt-2">Confiança: {results.confidence}%</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 border border-accent/30 rounded-lg bg-black/50"
                >
                  <p className="text-xs text-muted-foreground mb-3">MEDIÇÕES</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Comprimento:</span>
                      <span className="text-accent">{results.length} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Altura:</span>
                      <span className="text-accent">{results.height} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Perímetro Torácico:</span>
                      <span className="text-accent">{results.chest} cm</span>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex gap-3 justify-end"
          >
            <button
              onClick={() => setResults(null)}
              className="flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/50 rounded hover:bg-accent/30 transition text-accent"
            >
              <RotateCcw size={16} />
              Novo Scan
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AiWeighing;
