import { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Smartphone, ChevronRight, Check } from 'lucide-react';

const PinLogin = () => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      setPin(pin + num);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (pin.length !== 6) {
      setError('PIN deve ter 6 dígitos');
      return;
    }

    setIsLoading(true);
    // Simular validação
    setTimeout(() => {
      if (pin === '123456') {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/app';
        }, 1500);
      } else {
        setError('PIN inválido');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key >= '0' && e.key <= '9') {
      handleNumberClick(e.key);
    } else if (e.key === 'Backspace') {
      handleBackspace();
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown as EventListener);
    return () => window.removeEventListener('keydown', handleKeyDown as EventListener);
  }, [pin]);

  const bgImage = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663677906549/T2VQu6STr22DABekAsCKWM/agro-bg-1-h7DYVoR3RjpZr7rGKPshop.webp';

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm px-6 flex flex-col items-center justify-center min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent to-cyan-400 rounded-full flex items-center justify-center shadow-lg shadow-accent/50"
          >
            <Smartphone size={40} className="text-black" />
          </motion.div>

          <h1 className="text-4xl font-bold mb-2">
            <span className="text-accent">BOVISION</span>
            <span className="text-white"> AI</span>
          </h1>
          <p className="text-gray-300 text-sm">Visão Inteligente para a Nova Pecuária</p>
        </motion.div>

        {/* PIN Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12 w-full"
        >
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8 }}
                animate={{ scale: pin.length > i ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition ${
                  pin.length > i
                    ? 'bg-accent/30 border-accent text-accent'
                    : 'bg-white/10 border-white/20 text-white/50'
                }`}
              >
                {pin.length > i ? '●' : '○'}
              </motion.div>
            ))}
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center text-red-400 text-sm font-medium mb-4"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-gray-400 text-sm">
            {pin.length === 0 ? 'Digite seu PIN de 6 dígitos' : `${6 - pin.length} dígitos restantes`}
          </p>
        </motion.div>

        {/* Keypad */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full mb-8"
        >
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNumberClick(num.toString())}
                disabled={pin.length >= 6 || isLoading}
                className="aspect-square rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-accent/50 text-white font-bold text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {num}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNumberClick('0')}
              disabled={pin.length >= 6 || isLoading}
              className="col-span-2 aspect-square rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-accent/50 text-white font-bold text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              0
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackspace}
              disabled={pin.length === 0 || isLoading}
              className="aspect-square rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 text-red-400 font-bold text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              ←
            </motion.button>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={pin.length !== 6 || isLoading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-accent to-cyan-400 text-black font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/50 hover:shadow-xl hover:shadow-accent/70 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
              />
              Verificando...
            </>
          ) : success ? (
            <>
              <Check size={20} />
              Acesso Concedido!
            </>
          ) : (
            <>
              Entrar
              <ChevronRight size={20} />
            </>
          )}
        </motion.button>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 text-center text-xs text-gray-400"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock size={14} />
            <span>Conexão Segura</span>
          </div>
          <p>Seu PIN é criptografado e seguro</p>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-20 left-10 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl"
      />
    </div>
  );
};

export default PinLogin;
