import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

const PinLogin = () => {
  const [pin, setPin] = useState('');
  const [deviceId] = useState('BV-7X9K2M4L');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNumpad = (num: string) => {
    if (pin.length < 6) setPin(pin + num);
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleLogin = () => {
    if (pin.length === 6) {
      setIsLoading(true);
      setTimeout(() => {
        window.location.href = '/app';
      }, 1500);
    }
  };

  const copyDeviceId = () => {
    navigator.clipboard.writeText(deviceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Decorative Side Lines */}
      <div className="fixed left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-accent/50 to-transparent opacity-30"></div>
      <div className="fixed right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-cyan-400/50 to-transparent opacity-30"></div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8 sm:mb-10"
        >
          {/* Animated Logo */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="relative w-24 h-24 sm:w-28 sm:h-28"
            >
              {/* Outer hexagon */}
              <div className="absolute inset-0 border-2 border-accent rounded-lg opacity-40 transform rotate-45"></div>
              {/* Inner hexagon */}
              <div className="absolute inset-2 border border-cyan-400 rounded-lg opacity-60 transform rotate-45"></div>
              {/* Center B */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-accent to-cyan-400 bg-clip-text text-transparent">B</span>
              </div>
            </motion.div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-wider">
            <span className="text-accent">BOVISION</span>
            <br />
            <span className="text-cyan-400">AI</span>
          </h1>

          {/* Subtitle */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-px bg-accent/50"></div>
            <p className="text-xs sm:text-sm text-gray-400 tracking-widest font-mono">AI PIN LOGIN</p>
            <div className="w-8 h-px bg-accent/50"></div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-500 tracking-wide">Secure Access • Intelligent Protection</p>
        </motion.div>

        {/* Device ID Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8 sm:mb-10"
        >
          <div className="relative border-2 border-accent/60 rounded-2xl p-5 sm:p-6 bg-black/60 backdrop-blur-sm hover:border-accent/100 transition-all duration-300 group">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-cyan-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <p className="text-xs sm:text-sm text-gray-400 mb-2 relative z-10 tracking-widest font-mono">DEVICE ID</p>
            <div className="flex items-center justify-between relative z-10">
              <p className="text-xl sm:text-3xl font-mono font-bold text-accent tracking-wider">{deviceId}</p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyDeviceId}
                className="p-2 hover:bg-accent/20 rounded-lg transition-all duration-200"
                title="Copiar Device ID"
              >
                {copied ? (
                  <Check size={20} className="text-green-400" />
                ) : (
                  <Copy size={20} className="text-accent" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* PIN Input Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-4 sm:mb-5"
        >
          <p className="text-xs sm:text-sm text-gray-400 text-center tracking-widest font-mono">ENTER 6-DIGIT PIN</p>
        </motion.div>

        {/* PIN Dots Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="flex justify-center gap-3 sm:gap-4 mb-8 sm:mb-10"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8 }}
              animate={{ scale: pin.length > i ? 1.2 : 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-200 ${
                pin.length > i
                  ? 'bg-accent border-accent shadow-lg shadow-accent/50'
                  : 'border-accent/40 bg-transparent'
              }`}
            ></motion.div>
          ))}
        </motion.div>

        {/* Numpad Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10"
        >
          {/* Numbers 1-9 */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.05, borderColor: '#00FF41' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNumpad(num.toString())}
              disabled={pin.length >= 6}
              className="aspect-square rounded-2xl border-2 border-accent/60 bg-black/50 backdrop-blur-sm text-lg sm:text-2xl font-bold text-white hover:border-accent hover:bg-accent/10 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {num}
            </motion.button>
          ))}

          {/* Row 4: Biometric, 0, Backspace */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="aspect-square rounded-2xl border-2 border-accent/60 bg-black/50 backdrop-blur-sm text-xl sm:text-2xl hover:border-accent hover:bg-accent/10 transition-all duration-200"
            title="Biometric"
          >
            👆
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, borderColor: '#00FF41' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNumpad('0')}
            disabled={pin.length >= 6}
            className="aspect-square rounded-2xl border-2 border-accent/60 bg-black/50 backdrop-blur-sm text-lg sm:text-2xl font-bold text-white hover:border-accent hover:bg-accent/10 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            0
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, borderColor: '#00FF41' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackspace}
            className="aspect-square rounded-2xl border-2 border-accent/60 bg-black/50 backdrop-blur-sm text-xl hover:border-accent hover:bg-accent/10 transition-all duration-200"
            title="Backspace"
          >
            ✕
          </motion.button>
        </motion.div>

        {/* Login Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          disabled={pin.length !== 6 || isLoading}
          className="w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-accent to-cyan-400 text-black font-bold text-sm sm:text-base hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-6 sm:mb-8 tracking-wide"
        >
          {isLoading ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
              ⟳
            </motion.span>
          ) : (
            'ENTRAR'
          )}
        </motion.button>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="p-5 sm:p-6 rounded-2xl border-2 border-accent/40 bg-black/60 backdrop-blur-sm text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-400 rounded-full"
            ></motion.div>
            <p className="text-xs sm:text-sm font-bold text-accent tracking-widest">SYSTEM SECURE</p>
          </div>
          <p className="text-xs text-gray-500 tracking-wide">All Systems Protected</p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-8 sm:mt-10 text-xs text-gray-600 tracking-widest space-y-1"
        >
          <p>BOVISION AI PROTECTION</p>
          <p>POWERED BY ADVANCED AI SECURITY</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PinLogin;
