import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, Fingerprint } from 'lucide-react';

export default function PinLogin() {
  const [deviceId, setDeviceId] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [state, setState] = useState<'loading' | 'new_device' | 'pin_entry' | 'verifying' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(5);

  useEffect(() => {
    // Simular carregamento e geração de Device ID
    const timer = setTimeout(() => {
      const storedDeviceId = localStorage.getItem('bovision_device_id');
      if (storedDeviceId) {
        setDeviceId(storedDeviceId);
        setState('pin_entry');
      } else {
        // Gerar novo Device ID
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
    
    // Simular verificação
    setTimeout(() => {
      if (pin === '123456') { // PIN de teste
        localStorage.setItem('bovision_session', 'token_' + Date.now());
        window.location.href = '/app';
      } else {
        setError('PIN incorreto. Tente novamente');
        setPin('');
        setState('pin_entry');
        setAttempts(attempts - 1);
        
        if (attempts <= 1) {
          setState('error');
          setError('Muitas tentativas. Tente novamente em 15 minutos');
        }
      }
    }, 1500);
  };

  const numpad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', ''],
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-secondary/5 opacity-30" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="glass rounded-2xl p-8 neon-glow">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center mx-auto mb-4 neon-glow">
              <span className="text-2xl">🐂</span>
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">BOVISION AI</h1>
            <p className="text-sm text-muted-foreground">AI PIN LOGIN</p>
          </motion.div>

          {/* Loading state */}
          {state === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Inicializando...</p>
            </motion.div>
          )}

          {/* Device ID display */}
          {(state === 'new_device' || state === 'pin_entry' || state === 'verifying' || state === 'error') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="border border-accent rounded-lg p-4 bg-accent/5 text-center">
                <p className="text-xs text-muted-foreground mb-1">DEVICE ID</p>
                <p className="text-lg font-mono font-bold gradient-text">{deviceId}</p>
              </div>
            </motion.div>
          )}

          {/* New device - create PIN */}
          {state === 'new_device' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <p className="text-center text-sm text-muted-foreground">
                Novo dispositivo detectado. Crie um PIN de 6 dígitos para segurança.
              </p>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">CRIAR PIN</p>
                <div className="flex justify-center gap-2 mb-6">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold ${
                        i < pin.length
                          ? 'border-accent bg-accent/20 text-accent'
                          : 'border-border bg-background'
                      }`}
                    >
                      {i < pin.length ? '●' : ''}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Numpad */}
              <div className="grid grid-cols-3 gap-3">
                {numpad.map((row, i) =>
                  row.map((digit, j) => (
                    <div key={`${i}-${j}`}>
                      {digit ? (
                        <button
                          onClick={() => handlePinInput(digit)}
                          disabled={pin.length >= 6}
                          className="w-full aspect-square rounded-lg border border-accent bg-background hover:bg-accent/10 text-white font-bold transition disabled:opacity-50"
                        >
                          {digit}
                        </button>
                      ) : (
                        <div />
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-accent text-accent hover:bg-accent/10"
                  onClick={handleBackspace}
                >
                  ← Voltar
                </Button>
                <Button
                  className="flex-1 bg-accent hover:bg-accent/90 text-background disabled:opacity-50"
                  disabled={pin.length !== 6}
                  onClick={() => {
                    setState('pin_entry');
                    setPin('');
                  }}
                >
                  Confirmar
                </Button>
              </div>
            </motion.div>
          )}

          {/* PIN entry */}
          {state === 'pin_entry' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <p className="text-center text-sm text-muted-foreground">
                Digite seu PIN de 6 dígitos
              </p>

              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">ENTER 6-DIGIT PIN</p>
                <div className="flex justify-center gap-2 mb-6">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold ${
                        i < pin.length
                          ? 'border-accent bg-accent/20 text-accent'
                          : 'border-border bg-background'
                      }`}
                    >
                      {i < pin.length ? '●' : ''}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Numpad */}
              <div className="grid grid-cols-3 gap-3">
                {numpad.map((row, i) =>
                  row.map((digit, j) => (
                    <div key={`${i}-${j}`}>
                      {digit ? (
                        <button
                          onClick={() => handlePinInput(digit)}
                          disabled={pin.length >= 6}
                          className="w-full aspect-square rounded-lg border border-accent bg-background hover:bg-accent/10 text-white font-bold transition disabled:opacity-50"
                        >
                          {digit}
                        </button>
                      ) : j === 1 ? (
                        <button
                          onClick={handleBackspace}
                          className="w-full aspect-square rounded-lg border border-accent bg-background hover:bg-accent/10 text-white font-bold transition"
                        >
                          ✕
                        </button>
                      ) : (
                        <div />
                      )}
                    </div>
                  ))
                )}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-red-500"
                >
                  {error}
                </motion.div>
              )}

              <Button
                className="w-full bg-accent hover:bg-accent/90 text-background disabled:opacity-50"
                disabled={pin.length !== 6}
                onClick={handleSubmitPin}
              >
                Entrar
              </Button>
            </motion.div>
          )}

          {/* Verifying state */}
          {state === 'verifying' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Verificando PIN...</p>
            </motion.div>
          )}

          {/* Error state */}
          {state === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-12 h-12 rounded-full border-2 border-red-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">⚠️</span>
              </div>
              <p className="text-sm text-red-500 mb-4">{error}</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-background"
                onClick={() => window.location.reload()}
              >
                Tentar Novamente
              </Button>
            </motion.div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Fingerprint className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">SYSTEM SECURE</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Todos os sistemas protegidos
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
