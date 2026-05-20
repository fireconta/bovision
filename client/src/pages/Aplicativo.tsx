import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Delete, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
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

  // Rule 1: All same digit (111111, 222222, etc.)
  if (digits.every(d => d === digits[0])) {
    return { valid: false, reason: "PIN muito fraco: não use todos os dígitos iguais (ex: 111111)." };
  }

  // Rule 2: Sequential ascending (123456, 234567, etc.)
  const isAscSeq = digits.every((d, i) => i === 0 || d === digits[i - 1]! + 1);
  if (isAscSeq) return { valid: false, reason: "PIN muito fraco: não use sequências crescentes (ex: 123456)." };

  // Rule 3: Sequential descending (654321, 987654, etc.)
  const isDescSeq = digits.every((d, i) => i === 0 || d === digits[i - 1]! - 1);
  if (isDescSeq) return { valid: false, reason: "PIN muito fraco: não use sequências decrescentes (ex: 654321)." };

  // Rule 4: Pairs of repeated digits (112233, 445566, etc.)
  const isPairs = digits.every((d, i) => {
    const pairIdx = Math.floor(i / 2);
    return d === digits[pairIdx * 2];
  });
  if (isPairs && new Set(digits).size <= 3) {
    return { valid: false, reason: "PIN muito fraco: não use pares repetidos (ex: 112233)." };
  }

  // Rule 5: Max 3 consecutive same digits
  for (let i = 0; i < digits.length - 2; i++) {
    if (digits[i] === digits[i + 1] && digits[i + 1] === digits[i + 2]) {
      return { valid: false, reason: "PIN fraco: não use 3 ou mais dígitos iguais seguidos (ex: 111, 222)." };
    }
  }

  // Rule 6: Max 4 of the same digit in total
  const freq: Record<number, number> = {};
  for (const d of digits) freq[d] = (freq[d] || 0) + 1;
  if (Math.max(...Object.values(freq)) >= 4) {
    return { valid: false, reason: "PIN fraco: um mesmo dígito não pode aparecer 4 ou mais vezes." };
  }

  // Rule 7: Known weak PINs
  const knownWeak = ["123456", "654321", "112233", "332211", "445566", "665544", "000000", "999999", "121212", "010101"];
  if (knownWeak.includes(pin)) {
    return { valid: false, reason: "Este PIN é muito comum e não é permitido por segurança." };
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
    <div className="flex gap-3 justify-center my-6">
      {Array.from({ length: maxLen }).map((_, i) => (
        <motion.div
          key={i}
          animate={pin.length > i ? { scale: [1, 1.3, 1], backgroundColor: "oklch(0.75 0.18 210)" } : { scale: 1, backgroundColor: "oklch(0.20 0.04 220)" }}
          transition={{ duration: 0.15 }}
          className="w-4 h-4 rounded-full border border-[oklch(0.35_0.08_210)]"
        />
      ))}
    </div>
  );
}

function NumericKeypad({ onPress, onDelete, disabled }: { onPress: (d: string) => void; onDelete: () => void; disabled?: boolean }) {
  const keys = ["1","2","3","4","5","6","7","8","9","","0","⌫"];
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-[280px] mx-auto mt-6">
      {keys.map((k, i) => {
        if (k === "") return <div key={i} />;
        const isDelete = k === "⌫";
        return (
          <motion.button
            key={i}
            whileTap={{ scale: 0.92 }}
            disabled={disabled}
            onClick={() => isDelete ? onDelete() : onPress(k)}
            className={`h-16 rounded-xl font-mono text-xl font-bold transition-all border
              ${isDelete
                ? "border-[oklch(0.30_0.06_0)] text-[oklch(0.60_0.08_0)] hover:bg-[oklch(0.18_0.04_0/0.5)] active:bg-[oklch(0.22_0.04_0/0.5)]"
                : "border-[oklch(0.28_0.06_210)] text-white hover:bg-[oklch(0.20_0.08_210/0.5)] hover:border-[oklch(0.55_0.18_210/0.6)] active:bg-[oklch(0.25_0.10_210/0.6)]"
              }
              disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {isDelete ? <Delete className="w-6 h-6 mx-auto" /> : k}
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      // Validate security
      const validation = validatePinSecurity(pin);
      if (!validation.valid) {
        setPinError(validation.reason || "PIN inválido.");
        setTimeout(() => { setPin(""); setPinError(""); }, 1800);
        return;
      }
      // Move to confirmation
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
        setTimeout(() => setFlowState("new_device_create_pin"), 2200);
        return;
      }
      // PINs match — save
      setFlowState("verifying");
      localStorage.setItem(PIN_KEY, pin);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ deviceId, expires: Date.now() + 8 * 60 * 60 * 1000 }));
      setTimeout(() => {
        setFlowState("success");
        setTimeout(() => navigate("/app"), 1200);
      }, 800);
      return;
    }

    if (flowState === "pin_entry") {
      setFlowState("verifying");
      const storedPin = localStorage.getItem(PIN_KEY);
      if (pin === storedPin) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ deviceId, expires: Date.now() + 8 * 60 * 60 * 1000 }));
        setTimeout(() => {
          setFlowState("success");
          setTimeout(() => navigate("/app"), 1200);
        }, 800);
      } else {
        setError("PIN incorreto");
        setPin("");
        setTimeout(() => {
          setFlowState("pin_entry");
          setError("");
        }, 1500);
      }
      return;
    }
  }, [pin, flowState, deviceId, navigate]);

  const bgImage = "https://d2xsxph8kpxj0f.cloudfront.net/310519663677906549/T2VQu6STr22DABekAsCKWM/agro-bg-1-h7DYVoR3RjpZr7rGKPshop.webp";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass rounded-3xl border border-[oklch(0.75_0.18_210/0.2)] p-8 shadow-2xl">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/50"
            >
              <div className="text-3xl font-bold text-black">🐄</div>
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">BOVISION AI</h1>
            <p className="text-[oklch(0.75_0.18_210)] text-sm">Visão Inteligente para a Nova Pecuária</p>
          </div>

          {/* Flow: Loading */}
          <AnimatePresence mode="wait">
            {flowState === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-400 mb-4" />
                <p className="text-[oklch(0.75_0.18_210)]">Inicializando...</p>
              </motion.div>
            )}

            {/* Flow: Create PIN */}
            {flowState === "new_device_create_pin" && (
              <motion.div
                key="create_pin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">Criar PIN de Segurança</h2>
                  <p className="text-sm text-[oklch(0.75_0.18_210)]">Escolha um PIN de 6 dígitos seguro</p>
                </div>
                <PinDots pin={pin} />
                <NumericKeypad onPress={handlePinPress} onDelete={handlePinDelete} />
                {pinError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center"
                  >
                    {pinError}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Flow: Confirm PIN */}
            {flowState === "new_device_confirm_pin" && (
              <motion.div
                key="confirm_pin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">Confirmar PIN</h2>
                  <p className="text-sm text-[oklch(0.75_0.18_210)]">Digite o PIN novamente para confirmar</p>
                </div>
                <PinDots pin={pin} />
                <NumericKeypad onPress={handlePinPress} onDelete={handlePinDelete} />
              </motion.div>
            )}

            {/* Flow: PIN Mismatch */}
            {flowState === "pin_mismatch" && (
              <motion.div
                key="pin_mismatch"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8"
              >
                <AlertTriangle className="w-12 h-12 mx-auto text-red-400 mb-4" />
                <h2 className="text-lg font-bold text-white mb-2">PINs não correspondem</h2>
                <p className="text-sm text-[oklch(0.75_0.18_210)]">Tente novamente...</p>
              </motion.div>
            )}

            {/* Flow: PIN Entry */}
            {flowState === "pin_entry" && (
              <motion.div
                key="pin_entry"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">Digite seu PIN</h2>
                  <p className="text-sm text-[oklch(0.75_0.18_210)]">Acesso seguro ao aplicativo</p>
                </div>
                <PinDots pin={pin} />
                <NumericKeypad onPress={handlePinPress} onDelete={handlePinDelete} />
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Flow: Verifying */}
            {flowState === "verifying" && (
              <motion.div
                key="verifying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-400 mb-4" />
                <p className="text-[oklch(0.75_0.18_210)]">Verificando PIN...</p>
              </motion.div>
            )}

            {/* Flow: Success */}
            {flowState === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <ShieldCheck className="w-12 h-12 mx-auto text-green-400 mb-4" />
                </motion.div>
                <h2 className="text-lg font-bold text-white mb-2">Acesso Concedido!</h2>
                <p className="text-sm text-[oklch(0.75_0.18_210)]">Redirecionando...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Device ID */}
          <div className="mt-8 pt-6 border-t border-[oklch(0.75_0.18_210/0.1)]">
            <div className="text-center">
              <p className="text-xs text-[oklch(0.50_0.04_220)] mb-1">Device ID</p>
              <p className="text-sm font-mono text-[oklch(0.75_0.18_210)] font-bold">{deviceId}</p>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span className="text-xs font-mono text-green-400">SISTEMA SEGURO</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
