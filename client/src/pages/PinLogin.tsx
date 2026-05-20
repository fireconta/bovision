import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, Copy } from 'lucide-react';

export default function PinLogin() {
  const [deviceId, setDeviceId] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [state, setState] = useState<'loading' | 'new_device' | 'pin_entry' | 'verifying' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(5);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedDeviceId = localStorage.getItem('bovision_device_id');
      if (storedDeviceId) {
        setDeviceId(storedDeviceId);
        setState('pin_entry');
      } else {
        const newDeviceId = `BV-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        localStorage.setItem('bovision_device_id', newDeviceId);
        setDeviceId(newDeviceId);
        setState('new_device');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handlePinInput = (digit: string) => {
    if (pin.length < 6) {
      setPin(pin + digit);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmitPin = async () => {
    if (pin.length !== 6) {
      setError('PIN deve ter 6 dígitos');
      return;
    }

    setState('verifying');
    
    setTimeout(() => {
      // Aqui você implementaria a verificação real do PIN
      // Por enquanto, apenas simulamos o fluxo
      setError('Por favor, configure seu PIN no painel administrativo');
      setPin('');
      setState('pin_entry');
    }, 1500);
  };

  const copyDeviceId = () => {
    navigator.clipboard.writeText(deviceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const numpad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['👆', '0', '✕'],
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-2 sm:p-4 overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-transparent to-secondary" />
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Vertical neon lines - hidden on mobile */}
      <div className="hidden sm:block absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent to-transparent opacity-30" />
      <div className="hidden sm:block absolute right-4 sm:right-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-secondary to-transparent opacity-30" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10 px-2 sm:px-0"
      >
        {/* Main container with futuristic border */}
        <div className="relative">
          {/* Outer glow effect */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-accent/30 via-transparent to-secondary/30 blur-2xl opacity-50" />
          
          {/* Main glass container */}
          <div className="relative bg-background/80 backdrop-blur-xl border-2 border-accent/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl">
            {/* Decorative corner elements - hidden on mobile */}
            <div className="hidden sm:block absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-accent opacity-50" />
            <div className="hidden sm:block absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-secondary opacity-50" />
            <div className="hidden sm:block absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-accent opacity-50" />
            <div className="hidden sm:block absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-secondary opacity-50" />

            {/* Logo Section */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-6 sm:mb-8"
            >
              {/* Animated logo */}
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-accent/30 opacity-30"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 rounded-full border border-secondary/30 opacity-20"
                />
                <img 
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663677906549/T2VQu6STr22DABekAsCKWM/bovision-logo-icon-N3FvpqH9Q3jqzfuhPUHYM9.webp"
                  alt="BOVISION AI"
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold mb-1">
                <span className="gradient-text">BOVISION</span>
                <br />
                <span className="text-accent">AI</span>
              </h1>
              
              <div className="flex items-center justify-center gap-2 my-2 sm:my-3 text-accent">
                <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-transparent to-accent" />
                <span className="text-xs sm:text-sm font-mono font-bold">AI PIN LOGIN</span>
                <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-l from-transparent to-accent" />
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground">Acesso Seguro • Proteção Inteligente</p>
            </motion.div>

            {/* Loading state */}
            {state === 'loading' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 sm:py-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 sm:w-12 h-10 sm:h-12 border-2 border-accent/30 border-t-accent rounded-full mx-auto mb-4"
                />
                <p className="text-xs sm:text-sm text-muted-foreground">Inicializando sistema...</p>
              </motion.div>
            )}

            {/* Device ID display */}
            {(state === 'new_device' || state === 'pin_entry' || state === 'verifying' || state === 'error') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 sm:mb-8"
              >
                <p className="text-xs text-muted-foreground text-center mb-2 font-mono">DEVICE ID</p>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition" />
                  <button
                    onClick={copyDeviceId}
                    className="relative w-full border-2 border-accent/50 rounded-lg p-3 sm:p-4 bg-background/50 text-center hover:border-accent transition"
                  >
                    <p className="text-lg sm:text-xl font-mono font-bold gradient-text tracking-widest break-all">{deviceId}</p>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition">
                      <Copy className="w-4 h-4 text-accent" />
                    </div>
                    {copied && (
                      <p className="text-xs text-accent mt-1">Copiado!</p>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* PIN entry section */}
            {(state === 'new_device' || state === 'pin_entry') && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-3 sm:mb-4 font-mono">DIGITE PIN DE 6 DÍGITOS</p>
                  <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 flex items-center justify-center font-bold text-sm transition ${
                          i < pin.length
                            ? 'border-accent bg-accent/20 text-accent shadow-lg shadow-accent/50'
                            : 'border-accent/30 bg-background/50'
                        }`}
                      >
                        {i < pin.length ? '●' : ''}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Numpad */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {numpad.map((row, i) =>
                    row.map((digit, j) => {
                      const isFingerprint = digit === '👆';
                      const isBackspace = digit === '✕';
                      const isNumber = !isFingerprint && !isBackspace;

                      return (
                        <motion.button
                          key={`${i}-${j}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (isBackspace) handleBackspace();
                            else if (isNumber) handlePinInput(digit);
                          }}
                          disabled={isFingerprint || (isNumber && pin.length >= 6)}
                          className={`aspect-square rounded-lg border-2 font-bold text-base sm:text-lg transition ${
                            isFingerprint
                              ? 'border-accent/30 bg-background/50 text-accent/50 cursor-not-allowed'
                              : 'border-accent/50 bg-background/50 hover:border-accent hover:bg-accent/10 text-white hover:shadow-lg hover:shadow-accent/30'
                          }`}
                        >
                          {digit}
                        </motion.button>
                      );
                    })
                  )}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-xs sm:text-sm text-red-500 font-mono"
                  >
                    ⚠ {error}
                  </motion.div>
                )}

                {state === 'new_device' && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-accent/50 text-accent hover:bg-accent/10 text-xs sm:text-sm"
                      onClick={handleBackspace}
                    >
                      ← Limpar
                    </Button>
                    <Button
                      className="flex-1 bg-accent hover:bg-accent/90 text-background disabled:opacity-50 text-xs sm:text-sm"
                      disabled={pin.length !== 6}
                      onClick={() => {
                        setState('pin_entry');
                        setPin('');
                      }}
                    >
                      Confirmar
                    </Button>
                  </div>
                )}

                {state === 'pin_entry' && (
                  <Button
                    className="w-full bg-accent hover:bg-accent/90 text-background disabled:opacity-50 font-bold text-xs sm:text-sm"
                    disabled={pin.length !== 6}
                    onClick={handleSubmitPin}
                  >
                    Entrar no Sistema
                  </Button>
                )}
              </motion.div>
            )}

            {/* Verifying state */}
            {state === 'verifying' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 sm:py-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 sm:w-12 h-10 sm:h-12 border-2 border-accent/30 border-t-accent rounded-full mx-auto mb-4"
                />
                <p className="text-xs sm:text-sm text-muted-foreground">Verificando PIN...</p>
              </motion.div>
            )}

            {/* Error state */}
            {state === 'error' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6 sm:py-8"
              >
                <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full border-2 border-red-500/50 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl sm:text-3xl">⚠️</span>
                </div>
                <p className="text-xs sm:text-sm text-red-500 mb-4 font-mono">{error}</p>
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-background text-xs sm:text-sm"
                  onClick={() => window.location.reload()}
                >
                  Tentar Novamente
                </Button>
              </motion.div>
            )}

            {/* Footer with security info */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-accent/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                <span className="text-xs text-accent font-mono font-bold">SISTEMA SEGURO</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Todos os sistemas protegidos
              </p>
              <p className="text-xs text-muted-foreground text-center mt-2">
                BOVISION AI PROTECTION
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Powered by Advanced AI Security
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
