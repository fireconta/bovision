import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Lock, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function PinLogin() {
  const [deviceId, setDeviceId] = useState('BV-7X9K2M4L');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const generateDeviceId = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let id = 'BV-';
      for (let i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setDeviceId(id);
    };
    generateDeviceId();
  }, []);

  const handlePinClick = (digit: string) => {
    if (pin.length < 6) {
      setPin(pin + digit);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleCopyDeviceId = () => {
    navigator.clipboard.writeText(deviceId);
    toast.success('Device ID copiado!');
  };

  const handleLogin = async () => {
    if (pin.length !== 6) {
      toast.error('PIN deve ter 6 dígitos');
      return;
    }
    setIsLoading(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setScanProgress(100);
      window.location.href = '/app';
    }, 2000);
  };

  const numpadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['👆', '0', '✕'],
  ];

  return (
    <div className="min-h-screen bg-black text-foreground overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Decorative lines */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-accent/50 to-transparent opacity-50"></div>
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-cyan-500/50 to-transparent opacity-50"></div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-2 border-accent/50 rounded-lg"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-2 border-cyan-500/50 rounded-lg"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-2 border-accent/50 rounded-lg"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-2 border-cyan-500/50 rounded-lg"></div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Logo e Título */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="mb-6 flex justify-center">
            <motion.div
              animate={{ rotateY: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="text-6xl"
            >
              🐂
            </motion.div>
          </div>
          <h1 className="text-5xl font-bold mb-2">
            <span className="text-accent">BOVISION</span>
            <span className="text-cyan-400"> AI</span>
          </h1>
          <p className="text-muted-foreground text-sm">Visão Inteligente para a Nova Pecuária</p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* AI PIN LOGIN Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-accent"></div>
              <span className="text-accent text-xs font-mono tracking-widest">AI PIN LOGIN</span>
              <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-accent"></div>
            </div>
            <p className="text-muted-foreground text-xs">Secure Access • Intelligent Protection</p>
          </div>

          {/* Device ID Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 p-4 border-2 border-accent/50 rounded-xl bg-black/50 backdrop-blur-sm hover:border-accent/80 transition group"
          >
            <p className="text-accent text-xs font-mono mb-2">DEVICE ID</p>
            <div className="flex items-center justify-between">
              <p className="text-accent text-2xl font-mono font-bold">{deviceId}</p>
              <button
                onClick={handleCopyDeviceId}
                className="p-2 hover:bg-accent/20 rounded-lg transition text-accent"
              >
                <Copy size={18} />
              </button>
            </div>
          </motion.div>

          {/* PIN Input Display */}
          <div className="mb-8">
            <p className="text-accent text-xs font-mono mb-4 text-center">ENTER 6-DIGIT PIN</p>
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono font-bold transition ${
                    index < pin.length
                      ? 'border-accent bg-accent/20 text-accent'
                      : 'border-accent/30 text-accent/30'
                  }`}
                >
                  {index < pin.length ? '●' : '○'}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Numpad */}
          <div className="mb-8 grid grid-cols-3 gap-3">
            {numpadButtons.map((row, rowIndex) => (
              <div key={rowIndex} className="contents">
                {row.map((btn, btnIndex) => (
                  <motion.button
                    key={`${rowIndex}-${btnIndex}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (btn === '✕') handleBackspace();
                      else if (btn !== '👆') handlePinClick(btn);
                    }}
                    className={`p-4 rounded-xl font-bold text-lg transition border-2 ${
                      btn === '✕'
                        ? 'border-red-500/50 bg-red-500/10 text-red-400 hover:border-red-500 hover:bg-red-500/20'
                        : 'border-accent/50 bg-black/50 text-white hover:border-accent hover:bg-accent/20'
                    }`}
                  >
                    {btn === '👆' ? '👆' : btn === '✕' ? '✕' : btn}
                  </motion.button>
                ))}
              </div>
            ))}
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={isLoading || pin.length !== 6}
            className="w-full py-3 rounded-xl font-bold text-black bg-gradient-to-r from-accent to-cyan-400 hover:shadow-lg hover:shadow-accent/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Autenticando...' : 'Entrar'}
          </motion.button>

          {/* Scan Progress */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 bg-accent/10 border border-accent/50 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-accent" />
                <span className="text-xs text-accent font-mono">Verificando segurança...</span>
              </div>
              <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scanProgress}%` }}
                  className="h-full bg-gradient-to-r from-accent to-cyan-400"
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-8 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-2">
            <Lock size={16} className="text-accent" />
            <span className="text-accent font-mono text-sm">SYSTEM SECURE</span>
          </div>
          <p className="text-muted-foreground text-xs">All Systems Protected</p>
          <p className="text-muted-foreground text-xs mt-4">BOVISION AI PROTECTION</p>
          <p className="text-muted-foreground text-xs">POWERED BY ADVANCED AI SECURITY</p>
        </motion.div>
      </div>
    </div>
  );
}
