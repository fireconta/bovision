import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Delete, Loader2, ShieldCheck, AlertTriangle, Lock, Smartphone, Eye, EyeOff } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

// ============================================================
// CONSTANTS
// ============================================================
const DEVICE_ID_KEY = "bv_device_id";
const SESSION_KEY = "bv_session";
const PIN_KEY = "bv_pin";

// ============================================================
// PIN SECURITY VALIDATION (banking-grade)
// ============================================================
function validatePinSecurity(pin: string): { valid: boolean; reason?: string } {
  if (!/^\d{6}$/.test(pin)) return { valid: false, reason: "O PIN deve ter exatamente 6 dígitos numéricos." };

  const digits = pin.split("").map(Number);

  // Rule 1: All same digit
  if (digits.every(d => d === digits[0])) {
    return { valid: false, reason: "PIN muito fraco: não use todos os dígitos iguais (ex: 111111)." };
  }

  // Rule 2: Sequential ascending
  const isAscSeq = digits.every((d, i) => i === 0 || d === digits[i - 1]! + 1);
  if (isAscSeq) return { valid: false, reason: "PIN muito fraco: não use sequências crescentes (ex: 123456)." };

  // Rule 3: Sequential descending
  const isDescSeq = digits.every((d, i) => i === 0 || d === digits[i - 1]! - 1);
  if (isDescSeq) return { valid: false, reason: "PIN muito fraco: não use sequências decrescentes (ex: 654321)." };

  // Rule 4: Pairs of repeated digits
  const isPairs = digits.every((d, i) => {
    const pairIdx = Math.floor(i / 2);
    return d === digits[pairIdx * 2];
  });
  if (isPairs && new Set(digits).size <= 3) {
    return { valid: false, reason: "PIN muito fraco: não use pares repetidos (ex: 112233)." };
  }

  // Rule 5: Alternating pairs
  let repeatBlockCount = 0;
  for (let i = 0; i < digits.length - 1; i++) {
    if (digits[i] === digits[i + 1]) repeatBlockCount++;
  }
  if (repeatBlockCount >= 4) {
    return { valid: false, reason: "PIN muito fraco: muitos dígitos repetidos consecutivos." };
  }

  // Rule 6: Known weak PINs
  const knownWeak = ["123456", "654321", "112233", "332211", "445566", "665544", "778899", "998877", "121212", "010101", "000000", "999999", "123123", "456456", "789789"];
  if (knownWeak.includes(pin)) {
    return { valid: false, reason: "Este PIN é muito comum e não é permitido por segurança." };
  }

  // Rule 7: Max 3 consecutive same digits
  for (let i = 0; i < digits.length - 2; i++) {
    if (digits[i] === digits[i + 1] && digits[i + 1] === digits[i + 2]) {
      return { valid: false, reason: "PIN fraco: não use 3 ou mais dígitos iguais seguidos (ex: 111, 222)." };
    }
  }

  // Rule 8: Max 4 of the same digit in total
  const freq: Record<number, number> = {};
  for (const d of digits) freq[d] = (freq[d] || 0) + 1;
  if (Math.max(...Object.values(freq)) >= 4) {
    return { valid: false, reason: "PIN fraco: um mesmo dígito não pode aparecer 4 ou mais vezes." };
  }

  return { valid: true };
}

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
// SUB-COMPONENTS
// ============================================================
function PinDots({ pin, maxLen = 6 }: { pin: string; maxLen?: number }) {
  return (
    <div className="flex gap-3 justify-center my-10">
      {Array.from({ length: maxLen }).map((_, i) => (
        <motion.div
          key={i}
          animate={
            pin.length > i 
              ? { scale: [1, 1.3, 1], backgroundColor: "#00ff88" } 
              : { scale: 1, backgroundColor: "rgba(0, 255, 136, 0.15)" }
          }
          transition={{ duration: 0.3, type: "spring" }}
          className="w-6 h-6 rounded-full border-2 border-green-400 shadow-lg shadow-green-500/50 backdrop-blur-sm"
        />
      ))}
    </div>
  );
}

function NumericKeypad({ onPress, onDelete, disabled }: { onPress: (d: string) => void; onDelete: () => void; disabled?: boolean }) {
  const keys = ["1","2","3","4","5","6","7","8","9","","0","⌫"];
  
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-sm mx-auto mt-10">
      {keys.map((k, i) => {
        if (k === "") return <div key={i} />;
        const isDelete = k === "⌫";
        return (
          <motion.button
            key={i}
            whileTap={{ scale: 0.85, y: 2 }}
            whileHover={{ scale: 1.08, y: -2 }}
            disabled={disabled}
            onClick={() => isDelete ? onDelete() : onPress(k)}
            className={`h-20 rounded-2xl font-mono text-2xl font-bold transition-all border-2 backdrop-blur-md shadow-lg
              ${isDelete
                ? "border-red-500/60 text-red-300 bg-gradient-to-br from-red-500/20 to-red-600/10 hover:from-red-500/30 hover:to-red-600/20 active:from-red-500/40 active:to-red-600/30 shadow-red-500/30"
                : "border-green-400/70 text-white bg-gradient-to-br from-green-500/20 to-green-600/10 hover:from-green-500/30 hover:to-green-600/20 active:from-green-500/40 active:to-green-600/30 shadow-green-500/40"
              }
              disabled:opacity-30 disabled:cursor-not-allowed transform transition-all`}
          >
            {isDelete ? <Delete className="w-7 h-7 mx-auto" /> : k}
          </motion.button>
        );
      })}
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
type FlowState =
  | "loading"
  | "new_device_create_pin"
  | "new_device_confirm_pin"
  | "pin_mismatch"
  | "pin_entry"
  | "verifying"
  | "success";

export default function Aplicativo() {
  const [, navigate] = useLocation();
  const [deviceId] = useState<string>(getOrCreateDeviceId);
  const [flowState, setFlowState] = useState<FlowState>("loading");
  const [pin, setPin] = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [error, setError] = useState("");
  const [pinError, setPinError] = useState("");
  const [showPin, setShowPin] = useState(false);

  // Check session or device on mount
  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.deviceId && parsed.expires > Date.now()) {
          navigate("/app");
          return;
        }
      } catch { /* ignore */ }
      sessionStorage.removeItem(SESSION_KEY);
    }
    // Check if device has PIN
    const hasPin = !!localStorage.getItem(PIN_KEY);
    setFlowState(hasPin ? "pin_entry" : "new_device_create_pin");
  }, [navigate]);

  const handlePinPress = useCallback((digit: string) => {
    if (pin.length >= 6) return;
    setPin(prev => prev + digit);
    setError("");
    setPinError("");
  }, [pin]);

  const handlePinDelete = useCallback(() => {
    setPin(prev => prev.slice(0, -1));
    setError("");
    setPinError("");
  }, []);

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (pin.length !== 6) return;

    if (flowState === "new_device_create_pin") {
      const validation = validatePinSecurity(pin);
      if (!validation.valid) {
        setPinError(validation.reason || "PIN inválido.");
        setTimeout(() => { setPin(""); setPinError(""); }, 2000);
        return;
      }
      setFirstPin(pin);
      setPin("");
      setFlowState("new_device_confirm_pin");
      return;
    }

    if (flowState === "new_device_confirm_pin") {
      if (pin !== firstPin) {
        setFlowState("pin_mismatch");
        setPin("");
        setFirstPin("");
        setTimeout(() => setFlowState("new_device_create_pin"), 2500);
        return;
      }
      setFlowState("verifying");
      localStorage.setItem(PIN_KEY, pin);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ deviceId, expires: Date.now() + 8 * 60 * 60 * 1000 }));
      setTimeout(() => {
        setFlowState("success");
        setTimeout(() => navigate("/app"), 1500);
      }, 1000);
      return;
    }

    if (flowState === "pin_entry") {
      setFlowState("verifying");
      const storedPin = localStorage.getItem(PIN_KEY);
      if (pin === storedPin) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ deviceId, expires: Date.now() + 8 * 60 * 60 * 1000 }));
        setTimeout(() => {
          setFlowState("success");
          setTimeout(() => navigate("/app"), 1500);
        }, 1000);
      } else {
        setError("PIN incorreto. Tente novamente.");
        setPin("");
        setTimeout(() => {
          setFlowState("pin_entry");
          setError("");
        }, 1800);
      }
      return;
    }
  }, [pin, flowState, deviceId, navigate]);

  // ---- RENDER ----
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex flex-col items-center justify-center relative overflow-hidden px-4 py-8">
      {/* Animated background with multiple layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid background */}
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(0, 255, 136, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        
        {/* Animated orbs */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-96 h-96 bg-green-500/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header with animated logo */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 150 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-green-400 via-green-500 to-cyan-500 mb-8 shadow-2xl shadow-green-500/60 relative"
          >
            <motion.span 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl"
            >
              🐄
            </motion.span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-green-400/50 to-cyan-500/50 via-transparent"
            />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl font-black bg-gradient-to-r from-green-400 via-green-300 to-cyan-400 bg-clip-text text-transparent mb-3 tracking-tight"
          >
            BOVISION
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-400 text-sm font-light tracking-[0.2em] uppercase"
          >
            Acesso Seguro
          </motion.p>
        </div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="rounded-3xl border border-green-500/40 bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-2xl p-10 shadow-2xl shadow-green-500/30 relative overflow-hidden"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
          
          <div className="relative z-10">
            <AnimatePresence mode="wait">

              {/* LOADING */}
              {flowState === "loading" && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Loader2 className="w-12 h-12 mx-auto text-green-400" />
                  </motion.div>
                  <p className="font-mono text-xs text-gray-400 mt-6 tracking-[0.15em] uppercase">Identificando Dispositivo...</p>
                </motion.div>
              )}

              {/* CREATE PIN */}
              {flowState === "new_device_create_pin" && (
                <motion.div key="create" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.5 }}>
                  <div className="text-center mb-6">
                    <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
                      <Lock className="w-12 h-12 mx-auto text-green-400 mb-6" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-3">Criar PIN</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">Escolha um PIN de 6 dígitos seguro para proteger sua conta</p>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 border border-green-500/25 rounded-2xl p-5 mb-8 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Smartphone className="w-5 h-5 text-green-400" />
                      <p className="font-mono text-xs text-gray-300">{deviceId}</p>
                    </div>
                    <p className="text-xs text-gray-500 font-light">ID do dispositivo único</p>
                  </motion.div>

                  <PinDots pin={pin} />

                  {pinError && (
                    <motion.div initial={{ opacity: 0, y: -15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="flex items-start gap-3 bg-red-500/15 border border-red-500/40 rounded-2xl p-5 mb-8 backdrop-blur-sm">
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-red-300 text-sm font-light leading-relaxed">{pinError}</p>
                    </motion.div>
                  )}

                  <NumericKeypad onPress={handlePinPress} onDelete={handlePinDelete} />

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-10 rounded-2xl bg-gradient-to-br from-green-500/10 to-cyan-500/5 border border-green-500/25 p-5 backdrop-blur-sm"
                  >
                    <p className="text-xs text-gray-300 text-center leading-relaxed font-light">
                      🔒 <span className="text-green-400 font-semibold">Segurança Bancária:</span> Evite sequências, repetições e padrões simples
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {/* CONFIRM PIN */}
              {flowState === "new_device_confirm_pin" && (
                <motion.div key="confirm" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.5 }}>
                  <div className="text-center mb-6">
                    <ShieldCheck className="w-12 h-12 mx-auto text-cyan-400 mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-3">Confirmar PIN</h2>
                    <p className="text-gray-400 text-sm">Digite o PIN novamente para confirmar</p>
                  </div>

                  <PinDots pin={pin} />
                  <NumericKeypad onPress={handlePinPress} onDelete={handlePinDelete} />
                </motion.div>
              )}

              {/* PIN MISMATCH */}
              {flowState === "pin_mismatch" && (
                <motion.div key="mismatch" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
                  <motion.div animate={{ rotate: [0, -20, 20, -20, 20, 0], scale: [1, 1.15, 1] }} transition={{ duration: 0.7 }}>
                    <AlertTriangle className="w-16 h-16 mx-auto text-red-400 mb-6" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-3">PINs não coincidem</h2>
                  <p className="text-gray-400 text-sm mb-8">Vamos recomeçar o cadastro do PIN.</p>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 2.5, ease: "linear" }} className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-red-600" />
                  </div>
                </motion.div>
              )}

              {/* PIN ENTRY (existing device) */}
              {flowState === "pin_entry" && (
                <motion.div key="entry" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.5 }}>
                  <div className="text-center mb-6">
                    <Lock className="w-12 h-12 mx-auto text-green-400 mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-3">Acesso Seguro</h2>
                    <p className="text-gray-400 text-sm">Digite seu PIN de 6 dígitos</p>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 border border-green-500/25 rounded-2xl p-5 mb-8 backdrop-blur-sm"
                  >
                    <p className="font-mono text-xs text-gray-300 text-center">{deviceId}</p>
                  </motion.div>

                  <PinDots pin={pin} />

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="flex items-center gap-3 bg-red-500/15 border border-red-500/40 rounded-2xl p-5 mb-8 backdrop-blur-sm">
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                      <p className="text-red-300 text-sm font-light">{error}</p>
                    </motion.div>
                  )}

                  <NumericKeypad onPress={handlePinPress} onDelete={handlePinDelete} />

                  <p className="text-center text-xs text-gray-500 mt-10 font-mono tracking-wide">
                    ⚠️ NÃO COMPARTILHE SEU PIN COM NINGUÉM
                  </p>
                </motion.div>
              )}

              {/* VERIFYING */}
              {flowState === "verifying" && (
                <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Loader2 className="w-12 h-12 mx-auto text-cyan-400" />
                  </motion.div>
                  <p className="font-mono text-xs text-gray-400 mt-6 tracking-[0.15em] uppercase">Verificando PIN...</p>
                </motion.div>
              )}

              {/* SUCCESS */}
              {flowState === "success" && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
                  <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="mb-6">
                    <ShieldCheck className="w-16 h-16 mx-auto text-green-400" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-3">Acesso Autorizado</h2>
                  <p className="text-gray-400 text-sm mb-8">Redirecionando para o dashboard...</p>
                  <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.5, ease: "easeInOut" }} className="h-1.5 bg-gradient-to-r from-green-500 via-cyan-500 to-green-400 rounded-full" />
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center text-xs text-gray-600 mt-10 font-light tracking-wide"
        >
          Versão 1.0 • Segurança Bancária • 2026
        </motion.p>
      </motion.div>
    </div>
  );
}
