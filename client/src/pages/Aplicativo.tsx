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

  // Rule 5: Alternating pairs (117744, 223344, etc.)
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
    <div className="flex gap-3 justify-center my-4">
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
    <div className="grid grid-cols-3 gap-2 w-full max-w-[240px] mx-auto mt-4">
      {keys.map((k, i) => {
        if (k === "") return <div key={i} />;
        const isDelete = k === "⌫";
        return (
          <motion.button
            key={i}
            whileTap={{ scale: 0.92 }}
            disabled={disabled}
            onClick={() => isDelete ? onDelete() : onPress(k)}
            className={`h-14 rounded-xl font-mono text-lg font-bold transition-all border
              ${isDelete
                ? "border-[oklch(0.30_0.06_0)] text-[oklch(0.60_0.08_0)] hover:bg-[oklch(0.18_0.04_0/0.5)] active:bg-[oklch(0.22_0.04_0/0.5)]"
                : "border-[oklch(0.28_0.06_210)] text-white hover:bg-[oklch(0.20_0.08_210/0.5)] hover:border-[oklch(0.55_0.18_210/0.6)] active:bg-[oklch(0.25_0.10_210/0.6)]"
              }
              disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {isDelete ? <Delete className="w-5 h-5 mx-auto" /> : k}
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
        setError("PIN incorreto. Tente novamente.");
        setPin("");
        setTimeout(() => {
          setFlowState("pin_entry");
          setError("");
        }, 1500);
      }
      return;
    }
  }, [pin, flowState, deviceId, navigate]);

  // ---- RENDER ----
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(oklch(0.75 0.18 210 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.18 210 / 0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.18 210 / 0.06) 0%, transparent 70%)" }} />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center drop-shadow-[0_0_12px_oklch(0.75_0.18_210/0.5)]">
            <span className="text-2xl font-bold">🐄</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[oklch(0.28_0.06_210/0.4)] bg-[oklch(0.10_0.02_220/0.85)] backdrop-blur-xl p-8 shadow-[0_0_40px_oklch(0.75_0.18_210/0.08)]">

          <AnimatePresence mode="wait">

            {/* LOADING */}
            {flowState === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-[oklch(0.75_0.18_210)]" />
                <p className="font-mono text-xs text-[oklch(0.45_0.04_220)] mt-3 tracking-widest">IDENTIFICANDO DISPOSITIVO...</p>
              </motion.div>
            )}

            {/* CREATE PIN */}
            {flowState === "new_device_create_pin" && (
              <motion.div key="create" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-2">
                  <ShieldCheck className="w-8 h-8 mx-auto text-[oklch(0.75_0.18_210)] mb-3" />
                  <h2 className="text-white font-bold text-lg">Criar PIN de Acesso</h2>
                  <p className="text-[oklch(0.50_0.04_220)] text-sm mt-1">Escolha um PIN de 6 dígitos seguro</p>
                </div>
                <div className="mt-1 mb-1 text-center">
                  <p className="font-mono text-[0.65rem] text-[oklch(0.40_0.06_210)] tracking-wider">ID: {deviceId}</p>
                </div>
                <PinDots pin={pin} />
                {pinError && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 bg-[oklch(0.18_0.06_30/0.5)] border border-[oklch(0.35_0.10_30/0.5)] rounded-lg p-3 mb-2">
                    <AlertTriangle className="w-4 h-4 text-[oklch(0.70_0.15_30)] shrink-0 mt-0.5" />
                    <p className="text-[oklch(0.70_0.15_30)] text-xs">{pinError}</p>
                  </motion.div>
                )}
                <NumericKeypad onPress={handlePinPress} onDelete={handlePinDelete} />
                <div className="mt-5 rounded-lg bg-[oklch(0.12_0.04_210/0.5)] border border-[oklch(0.22_0.06_210/0.4)] p-3">
                  <p className="text-[0.65rem] text-[oklch(0.40_0.06_210)] text-center leading-relaxed">
                    🔒 Segurança bancária: evite sequências (123456), repetições (111111) e padrões simples
                  </p>
                </div>
              </motion.div>
            )}

            {/* CONFIRM PIN */}
            {flowState === "new_device_confirm_pin" && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-2">
                  <ShieldCheck className="w-8 h-8 mx-auto text-[oklch(0.65_0.20_145)] mb-3" />
                  <h2 className="text-white font-bold text-lg">Confirmar PIN</h2>
                  <p className="text-[oklch(0.50_0.04_220)] text-sm mt-1">Digite o PIN novamente para confirmar</p>
                </div>
                <PinDots pin={pin} />
                <NumericKeypad onPress={handlePinPress} onDelete={handlePinDelete} />
              </motion.div>
            )}

            {/* PIN MISMATCH */}
            {flowState === "pin_mismatch" && (
              <motion.div key="mismatch" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 0.5 }}>
                  <AlertTriangle className="w-12 h-12 mx-auto text-[oklch(0.70_0.18_30)] mb-4" />
                </motion.div>
                <h2 className="text-white font-bold text-lg mb-2">PINs não coincidem</h2>
                <p className="text-[oklch(0.50_0.04_220)] text-sm">Vamos recomeçar o cadastro do PIN.</p>
                <div className="mt-4 h-1 bg-[oklch(0.20_0.04_220)] rounded-full overflow-hidden">
                  <motion.div initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 2.2, ease: "linear" }}
                    className="h-full bg-[oklch(0.70_0.18_30)]" />
                </div>
              </motion.div>
            )}

            {/* PIN ENTRY (existing device) */}
            {flowState === "pin_entry" && (
              <motion.div key="entry" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-2">
                  <h2 className="text-white font-bold text-lg">Acesso Seguro</h2>
                  <p className="text-[oklch(0.50_0.04_220)] text-sm mt-1">Digite seu PIN de 6 dígitos</p>
                  <p className="font-mono text-[0.65rem] text-[oklch(0.35_0.06_210)] mt-1 tracking-wider">{deviceId}</p>
                </div>
                <PinDots pin={pin} />
                {error && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 bg-[oklch(0.18_0.06_0/0.5)] border border-[oklch(0.35_0.10_0/0.5)] rounded-lg p-3 mb-2">
                    <AlertTriangle className="w-4 h-4 text-[oklch(0.65_0.18_0)] shrink-0" />
                    <p className="text-[oklch(0.65_0.18_0)] text-xs">{error}</p>
                  </motion.div>
                )}
                <NumericKeypad onPress={handlePinPress} onDelete={handlePinDelete} />
                <p className="text-center text-[0.55rem] text-[oklch(0.28_0.04_220)] mt-5 font-mono">
                  ID PERMANENTE · NÃO COMPARTILHE SEU PIN
                </p>
              </motion.div>
            )}

            {/* VERIFYING */}
            {flowState === "verifying" && (
              <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-[oklch(0.75_0.18_210)]" />
                <p className="font-mono text-xs text-[oklch(0.45_0.04_220)] mt-3 tracking-widest">VERIFICANDO...</p>
              </motion.div>
            )}

            {/* SUCCESS */}
            {flowState === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <ShieldCheck className="w-14 h-14 mx-auto text-[oklch(0.70_0.20_145)] mb-4" />
                </motion.div>
                <h2 className="text-white font-bold text-lg">Acesso Autorizado</h2>
                <p className="text-[oklch(0.50_0.04_220)] text-sm mt-1">Redirecionando...</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
