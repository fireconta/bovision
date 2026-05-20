import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

const AiWeighing = () => {
  const metrics = [
    { label: 'Body Volume', value: '418.6 dm³', icon: '📦' },
    { label: 'Density', value: '1.46 g/cm³', icon: '⚖️' },
    { label: 'Fat Index', value: '12.4%', icon: '🍖' },
    { label: 'Muscle Mass', value: '78.6%', icon: '💪' },
    { label: 'Bone Mass', value: '8.2%', icon: '🦴' },
  ];

  const analysisItems = [
    { label: 'Body Structure', status: 'COMPLETE', color: 'text-green-400' },
    { label: 'Volume Calculation', status: 'COMPLETE', color: 'text-green-400' },
    { label: 'Weight Estimation', status: 'COMPLETE', color: 'text-green-400' },
    { label: 'Health Assessment', status: 'COMPLETE', color: 'text-green-400' },
    { label: 'Anomaly Detection', status: 'CLEAR', color: 'text-green-400' },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden pb-24">
      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur border-b border-accent/20 px-4 sm:px-6 py-3"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl">🐂</span>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold">
                <span className="text-accent">BOVISION</span>
                <span className="text-cyan-400"> AI</span>
              </h1>
              <p className="text-xs text-gray-400">Smart Weighing System</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="text-center">
              <p className="text-gray-400">AI MODEL</p>
              <p className="text-accent font-bold">BoviVision Pro v2.4</p>
            </div>
            <div className="hidden sm:block text-center">
              <p className="text-gray-400">CAMERA</p>
              <p className="text-accent font-bold">4K Ultra HD</p>
            </div>
            <div className="hidden sm:block text-center">
              <p className="text-gray-400">STATUS</p>
              <p className="text-accent font-bold">Scanning...</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">CONNECTED</p>
              <p className="text-accent font-bold">UltraLink Network</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="pt-20 px-4 sm:px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 relative z-10">
          {/* Left Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Live Feed */}
            <div className="p-4 border-2 border-accent/40 rounded-lg bg-black/50 backdrop-blur">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-accent">LIVE FEED</p>
                <p className="text-xs text-gray-400">04K</p>
              </div>
              <div className="w-full h-32 bg-gradient-to-br from-accent/20 to-cyan-400/20 rounded-lg flex items-center justify-center text-4xl">
                🐄
              </div>
              <p className="text-xs text-gray-400 mt-2">Channel 01</p>
            </div>

            {/* Animal Profile */}
            <div className="p-4 border-2 border-accent/40 rounded-lg bg-black/50 backdrop-blur">
              <p className="text-sm font-bold text-accent mb-3">ANIMAL PROFILE</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">ID:</span>
                  <span className="text-accent">BOV-2024-00158</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Breed:</span>
                  <span className="text-accent">Angus</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Age:</span>
                  <span className="text-accent">24 Months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Gender:</span>
                  <span className="text-accent">Male</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Condition:</span>
                  <span className="text-green-400">Optimal</span>
                </div>
              </div>
            </div>

            {/* Weight Estimation */}
            <div className="p-4 border-2 border-accent/40 rounded-lg bg-black/50 backdrop-blur">
              <p className="text-sm font-bold text-accent mb-3">WEIGHT ESTIMATION</p>
              <div className="text-center">
                <p className="text-4xl font-bold text-accent mb-2">612</p>
                <p className="text-xs text-gray-400 mb-3">KG</p>
                <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '98.7%' }}
                    transition={{ duration: 2 }}
                    className="h-full bg-gradient-to-r from-accent to-cyan-400"
                  ></motion.div>
                </div>
                <p className="text-xs text-accent">Confidence: 98.7%</p>
              </div>
            </div>

            {/* Stability */}
            <div className="p-4 border-2 border-accent/40 rounded-lg bg-black/50 backdrop-blur">
              <p className="text-sm font-bold text-accent mb-3">STABILITY</p>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">96%</p>
              </div>
            </div>
          </motion.div>

          {/* Center Panel - 3D Scan */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 p-6 border-2 border-accent/40 rounded-lg bg-black/50 backdrop-blur"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-accent">3D SCAN IN PROGRESS</p>
              <p className="text-xs text-gray-400">SCANNING...</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden mb-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 3 }}
                className="h-full bg-gradient-to-r from-accent to-cyan-400"
              ></motion.div>
            </div>

            {/* 3D Visualization */}
            <div className="relative w-full h-64 sm:h-80 bg-gradient-to-br from-accent/5 to-cyan-400/5 rounded-lg flex items-center justify-center mb-6 overflow-hidden">
              {/* Animated Cow */}
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="text-6xl sm:text-8xl"
              >
                🐄
              </motion.div>

              {/* Measurement Lines */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <motion.div
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-center"
                >
                  <p className="text-xs text-accent font-mono mb-2">LENGTH</p>
                  <p className="text-lg sm:text-2xl font-bold text-accent">183 cm</p>
                </motion.div>
              </div>

              {/* Side Measurements */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <motion.div
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="text-center"
                >
                  <p className="text-xs text-cyan-400 font-mono">HEIGHT</p>
                  <p className="text-lg font-bold text-cyan-400">132 cm</p>
                </motion.div>
              </div>

              <div className="absolute right-4 top-1/3">
                <motion.div
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="text-center"
                >
                  <p className="text-xs text-accent font-mono">CHEST</p>
                  <p className="text-lg font-bold text-accent">207 cm</p>
                </motion.div>
              </div>
            </div>

            {/* Body Structure Analysis */}
            <div className="p-4 bg-black/50 rounded-lg border border-accent/30">
              <p className="text-xs text-gray-400 mb-3 text-center">ANALYZING BODY STRUCTURE...</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {metrics.map((metric, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="p-3 border border-accent/30 rounded-lg text-center"
                  >
                    <p className="text-lg mb-1">{metric.icon}</p>
                    <p className="text-xs text-gray-400 mb-1">{metric.label}</p>
                    <p className="text-sm font-bold text-accent">{metric.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {/* AI Analysis */}
            <div className="p-4 border-2 border-accent/40 rounded-lg bg-black/50 backdrop-blur">
              <p className="text-sm font-bold text-accent mb-4">AI ANALYSIS</p>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🧠</span>
                <div>
                  <p className="text-lg font-bold text-accent">98.7%</p>
                  <p className="text-xs text-gray-400">Accuracy</p>
                </div>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '98.7%' }}
                  transition={{ duration: 2 }}
                  className="h-full bg-gradient-to-r from-green-400 to-accent"
                ></motion.div>
              </div>
            </div>

            {/* Analysis Checklist */}
            <div className="p-4 border-2 border-accent/40 rounded-lg bg-black/50 backdrop-blur">
              <p className="text-sm font-bold text-accent mb-3">ANALYSIS STATUS</p>
              <div className="space-y-2">
                {analysisItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <span className={`text-lg ${item.color}`}>✓</span>
                    <span className="text-xs text-gray-400">{item.label}</span>
                    <span className={`text-xs font-bold ml-auto ${item.color}`}>{item.status}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Scan Quality */}
            <div className="p-4 border-2 border-accent/40 rounded-lg bg-black/50 backdrop-blur">
              <p className="text-sm font-bold text-accent mb-3">SCAN QUALITY</p>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent mb-2">98%</p>
                <p className="text-xs text-accent font-bold">EXCELLENT</p>
              </div>
            </div>

            {/* System Status */}
            <div className="p-4 border-2 border-accent/40 rounded-lg bg-black/50 backdrop-blur">
              <p className="text-sm font-bold text-accent mb-3">SYSTEM STATUS</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>All Systems Operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Camera</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>AI Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Sensors</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Network</span>
                </div>
              </div>
            </div>

            {/* Download Report */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-gradient-to-r from-accent to-cyan-400 text-black font-bold rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/50 transition"
            >
              <Download size={18} />
              Download Report
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur border-t border-accent/20 px-4 sm:px-6 py-3"
      >
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs sm:text-sm">
          <div>
            <p className="text-gray-400">SCANNING TIME</p>
            <p className="text-accent font-bold">2.34 s</p>
          </div>
          <div>
            <p className="text-gray-400">TEMPERATURE</p>
            <p className="text-accent font-bold">24.7°C</p>
          </div>
          <div>
            <p className="text-gray-400">HUMIDITY</p>
            <p className="text-accent font-bold">45.2%</p>
          </div>
          <div className="col-span-2 sm:col-span-2">
            <p className="text-gray-400">TIMESTAMP</p>
            <p className="text-accent font-bold">2024-01-15 14:30:25</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AiWeighing;
