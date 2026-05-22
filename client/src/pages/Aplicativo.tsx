import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Copy, Fingerprint, X, Shield, CheckCircle2 } from "lucide-react";

// ============================================================
// CONSTANTS
// ============================================================
const DEVICE_ID_KEY = "bv_device_id";
const SESSION_KEY = "bv_session";
const LOGO_URL = "/manus-storage/bovision-logo-icon_195d1afa.png";

// ============================================================
// DEVICE ID GENERATION
// ============================================================
function getOrCreateDeviceId(): string {
  const stored = localStorage.getItem(DEVICE_ID_KEY);
  if (stored && /^BV-[A-Z0-9]{8}$/.test(stored)) return stored;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "BV-";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  localStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Aplicativo() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"loading" | "entry" | "create" | "confirm">("loading");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceId] = useState(() => getOrCreateDeviceId());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [shouldShake, setShouldShake] = useState(false);
  const [errorType, setErrorType] = useState<'none' | 'weak' | 'mismatch' | 'incorrect'>('none');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // tRPC mutations
  const getDeviceStatus = trpc.pinAuth.getDeviceStatus.useQuery({ deviceId }, { enabled: mode === "loading" });
  const createPinMutation = trpc.pinAuth.createPin.useMutation();
  const verifyPinMutation = trpc.pinAuth.verifyPin.useMutation();

  // Check device status on mount
  useEffect(() => {
    if (mode !== "loading") return;

    const checkDevice = async () => {
      try {
        const result = await getDeviceStatus.refetch();
        if (result.data?.exists) {
          setMode("entry");
        } else {
          setMode("create");
        }
      } catch (err) {
        console.error("Device check error:", err);
        setMode("create");
      }
    };

    const timer = setTimeout(checkDevice, 500);
    return () => clearTimeout(timer);
  }, [mode, getDeviceStatus]);

  // Handle PIN entry
  const handlePinEntry = useCallback((digit: string) => {
    if (mode === "entry" || mode === "create") {
      if (pin.length < 6) {
        setPin(prev => prev + digit);
        setError(null);
      }
    } else if (mode === "confirm") {
      if (confirmPin.length < 6) {
        setConfirmPin(prev => prev + digit);
        setError(null);
      }
    }
  }, [pin, confirmPin, mode]);

  // Handle backspace
  const handleBackspace = useCallback(() => {
    if (mode === "entry" || mode === "create") {
      setPin(prev => prev.slice(0, -1));
    } else if (mode === "confirm") {
      setConfirmPin(prev => prev.slice(0, -1));
    }
  }, [mode]);

  // Handle transition animation
  const startTransition = useCallback(async (callback: () => void) => {
    setIsTransitioning(true);
    
    // Animate progress bar from 0 to 100
    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds total
    
    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setTransitionProgress(progress);
      
      if (progress < 100) {
        requestAnimationFrame(animateProgress);
      } else {
        // Animation complete, execute callback
        setTimeout(() => {
          callback();
          setIsTransitioning(false);
          setTransitionProgress(0);
        }, 200);
      }
    };
    
    animateProgress();
  }, []);

  // Handle PIN submission
  const handleSubmit = useCallback(async () => {
    if (mode === "entry") {
      if (pin.length !== 6) {
        setError("PIN deve ter 6 dígitos");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const result = await verifyPinMutation.mutateAsync({ pin, deviceId });
        localStorage.setItem(SESSION_KEY, result.sessionToken);
        sessionStorage.setItem(SESSION_KEY, result.sessionToken);
        
        // Show success animation
        setShowSuccessAnimation(true);
        
        // Wait for success animation to complete
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Start transition animation
        await startTransition(() => {
          setLocation("/app");
        });
      } catch (err: any) {
        console.error("Verify PIN error:", err);
        setError(err.message || "Erro ao verificar PIN");
        setErrorType('incorrect');
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 600);
        setPin("");
      } finally {
        setLoading(false);
      }
    } else if (mode === "create") {
      if (pin.length !== 6) {
        setError("PIN deve ter 6 dígitos");
        return;
      }
      setMode("confirm");
      setError(null);
    } else if (mode === "confirm") {
      if (confirmPin.length !== 6) {
        setError("Confirmação deve ter 6 dígitos");
        return;
      }
      if (pin !== confirmPin) {
        setError("Os PINs não correspondem!");
        setErrorType('mismatch');
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 600);
        setPin("");
        setConfirmPin("");
        setMode("create");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const result = await createPinMutation.mutateAsync({ pin, confirmPin, deviceId });
        localStorage.setItem(SESSION_KEY, result.sessionToken);
        sessionStorage.setItem(SESSION_KEY, result.sessionToken);
        
        // Show success animation
        setShowSuccessAnimation(true);
        
        // Wait for success animation to complete
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Start transition animation
        await startTransition(() => {
          setLocation("/app");
        });
      } catch (err: any) {
        console.error("Create PIN error:", err);
        setError(err.message || "Erro ao criar PIN");
        setPin("");
        setConfirmPin("");
        setMode("create");
      } finally {
        setLoading(false);
      }
    }
  }, [mode, pin, confirmPin, deviceId, setLocation, createPinMutation, verifyPinMutation, loading, startTransition]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) {
        handlePinEntry(e.key);
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Enter" && ((mode === "entry" && pin.length === 6) || (mode === "create" && pin.length === 6) || (mode === "confirm" && confirmPin.length === 6))) {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePinEntry, handleBackspace, handleSubmit, mode, pin, confirmPin]);

  const currentPin = mode === "confirm" ? confirmPin : pin;

  return (
    <div className="min-h-screen w-full overflow-hidden bg-black relative flex items-center justify-center">
      {/* Success animation overlay */}
      {showSuccessAnimation && !isTransitioning && (
        <motion.div
          className="fixed inset-0 z-50 bg-gradient-to-br from-green-500/30 to-emerald-500/20 backdrop-blur-md flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Success checkmark with pulse */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="mb-8 relative"
          >
            {/* Outer ring pulse */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-green-400"
              animate={{ scale: [1, 1.3], opacity: [1, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            
            {/* Middle ring */}
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-green-400/50"
              animate={{ scale: [1, 1.2], opacity: [1, 0] }}
              transition={{ duration: 1.2, delay: 0.2, repeat: Infinity }}
            />
            
            {/* Checkmark icon */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative z-10"
            >
              <CheckCircle2 className="w-24 h-24 text-green-400" strokeWidth={1} />
            </motion.div>
          </motion.div>

          {/* Success text */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold text-green-400 mb-2 font-mono"
          >
            PIN Validado!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-green-300 font-mono text-sm mb-8"
          >
            Acesso Autorizado
          </motion.p>

          {/* Animated checkmarks falling */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ y: -50, opacity: 1, x: Math.random() * 100 - 50 }}
                animate={{ y: window.innerHeight + 50, opacity: 0 }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  ease: "easeIn",
                }}
                className="absolute left-1/2 text-2xl text-green-400"
              >
                ✓
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Transition overlay with progress */}
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-50 bg-gradient-to-br from-green-500/20 to-cyan-500/20 backdrop-blur-sm flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Success checkmark */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <CheckCircle2 className="w-20 h-20 text-green-400" strokeWidth={1.5} />
            </motion.div>
          </motion.div>

          {/* Status text */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl font-bold text-green-400 mb-2 font-mono"
          >
            Validação Concluída
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-cyan-400 font-mono text-sm mb-8"
          >
            Carregando aplicação...
          </motion.p>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden"
            style={{ originX: 0 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"
              style={{ width: `${transitionProgress}%` }}
              transition={{ type: "tween", ease: "easeInOut" }}
            />
          </motion.div>

          {/* Progress percentage */}
          <motion.p
            className="text-gray-400 font-mono text-xs mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {Math.round(transitionProgress)}%
          </motion.p>

          {/* Animated dots */}
          <motion.div
            className="flex gap-2 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-cyan-400"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-black to-slate-950" />
      
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-500/10 to-cyan-500/5 rounded-full blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-green-500/5 rounded-full blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 25, repeat: Infinity }}
      />

      {/* Decorative circuit lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-1 h-32 bg-gradient-to-b from-green-500 to-transparent" />
        <div className="absolute top-0 right-1/4 w-1 h-32 bg-gradient-to-b from-cyan-500 to-transparent" />
        <div className="absolute bottom-0 left-1/3 w-1 h-32 bg-gradient-to-t from-green-500 to-transparent" />
        <div className="absolute bottom-0 right-1/3 w-1 h-32 bg-gradient-to-t from-cyan-500 to-transparent" />
      </div>

      {/* Main container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: shouldShake ? [0, -10, 10, -10, 10, 0] : 0,
        }}
        transition={{
          duration: shouldShake ? 0.6 : 0.5,
        }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Top decorative border */}
        <div className="mb-8 flex items-center justify-center">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-green-500" />
          <div className="mx-4 w-0.5 h-12 bg-gradient-to-b from-green-500 to-cyan-500" />
          <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-cyan-500" />
        </div>

        {/* Logo and title */}
        <div className="text-center mb-8">
          {/* Logo Image */}
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="w-24 h-24 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-cyan-400 rounded-lg opacity-20 blur-xl" />
              <div className="absolute inset-0 border-2 border-green-400 rounded-lg" />
              <div className="absolute inset-1 border border-cyan-400 rounded-lg" />
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
                <img 
                  src={LOGO_URL} 
                  alt="BOVISION Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          <h1 className="text-4xl font-bold mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-300">BOVISION</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">AI</span>
          </h1>

          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-green-400" />
            <span className="text-sm font-mono text-green-400">AI PIN LOGIN</span>
            <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-cyan-400" />
          </div>

          <p className="text-xs text-gray-400 font-mono">
            Secure Access <span className="text-green-400">•</span> Intelligent Protection
          </p>
        </div>

        {/* Device ID */}
        <motion.div
          className="mb-8 p-4 rounded-lg border-2 border-green-400/50 bg-black/50 backdrop-blur-sm"
          whileHover={{ borderColor: "rgb(34, 197, 94)" }}
        >
          <label className="text-xs font-mono text-green-400 mb-2 block">DEVICE ID</label>
          <div className="flex items-center justify-between">
            <span className="text-lg font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
              {deviceId}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(deviceId);
                toast.success("Device ID copiado!");
              }}
              className="p-2 hover:bg-green-400/10 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4 text-green-400" />
            </button>
          </div>
        </motion.div>

        {/* PIN display */}
        <div className="mb-8">
          <label className="text-xs font-mono text-green-400 mb-4 block text-center">ENTER 6-DIGIT PIN</label>
          <div className="flex justify-center gap-3 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8 }}
                animate={{ scale: currentPin.length > i ? 1.1 : 1 }}
                className="w-8 h-8 rounded-full border-2 border-cyan-400/50 flex items-center justify-center"
              >
                {currentPin.length > i && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-cyan-400"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`mb-6 p-4 rounded-lg border-2 text-sm text-center font-mono font-bold transition-all ${
              errorType === 'incorrect' || errorType === 'mismatch'
                ? 'bg-red-500/20 border-red-500 text-red-300 shadow-lg shadow-red-500/30'
                : 'bg-red-500/10 border-red-500/50 text-red-400'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {(errorType === 'incorrect' || errorType === 'mismatch') && (
                <motion.div
                  animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                  className="text-lg"
                >
                  ⚠️
                </motion.div>
              )}
              {error}
            </div>
          </motion.div>
        )}

        {/* Numeric keypad */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <motion.button
              key={num}
              onClick={() => handlePinEntry(num.toString())}
              disabled={loading || isTransitioning}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-lg border-2 border-green-400/50 bg-black/50 backdrop-blur-sm text-white font-bold text-xl hover:border-green-400 hover:bg-green-400/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">{num}</span>
            </motion.button>
          ))}

          {/* Fingerprint button */}
          <motion.button
            onClick={() => handlePinEntry("0")}
            disabled={loading || isTransitioning}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 rounded-lg border-2 border-green-400/50 bg-black/50 backdrop-blur-sm text-green-400 hover:border-green-400 hover:bg-green-400/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Fingerprint className="w-6 h-6 relative z-10 mx-auto" />
          </motion.button>

          {/* Zero button */}
          <motion.button
            onClick={() => handlePinEntry("0")}
            disabled={loading || isTransitioning}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 rounded-lg border-2 border-green-400/50 bg-black/50 backdrop-blur-sm text-white font-bold text-xl hover:border-green-400 hover:bg-green-400/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">0</span>
          </motion.button>

          {/* Delete button */}
          <motion.button
            onClick={handleBackspace}
            disabled={loading || isTransitioning}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 rounded-lg border-2 border-green-400/50 bg-black/50 backdrop-blur-sm text-green-400 hover:border-green-400 hover:bg-green-400/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <X className="w-6 h-6 relative z-10 mx-auto" />
          </motion.button>
        </div>

        {/* Submit button */}
        <motion.button
          onClick={handleSubmit}
          disabled={loading || isTransitioning || (mode === "entry" && pin.length !== 6) || (mode === "create" && pin.length !== 6) || (mode === "confirm" && confirmPin.length !== 6)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-4 rounded-lg border-2 border-green-400/50 bg-gradient-to-r from-green-400/10 to-cyan-400/10 backdrop-blur-sm text-white font-bold hover:border-green-400 hover:from-green-400/20 hover:to-cyan-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading || isTransitioning ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-4 border-2 border-green-400 border-t-cyan-400 rounded-full" />
                Processando...
              </>
            ) : mode === "confirm" ? (
              "Confirmar PIN"
            ) : mode === "create" ? (
              "Criar PIN"
            ) : (
              "Entrar"
            )}
          </span>
        </motion.button>

        {/* Security status */}
        <motion.div
          className="p-4 rounded-lg border-2 border-green-400/30 bg-black/50 backdrop-blur-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full border-2 border-green-400 flex items-center justify-center">
              <Shield className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-sm font-mono text-green-400">SYSTEM SECURE</span>
          </div>
          <p className="text-xs text-gray-400">All Systems Protected</p>
        </motion.div>

        {/* Bottom decorative border */}
        <div className="mt-8 flex items-center justify-center">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-green-500" />
          <div className="mx-4 w-0.5 h-12 bg-gradient-to-b from-cyan-500 to-green-500" />
          <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-cyan-500" />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs font-mono text-gray-500 space-y-1">
          <p>BOVISION AI PROTECTION</p>
          <p>POWERED BY ADVANCED AI SECURITY</p>
        </div>
      </motion.div>
    </div>
  );
}
