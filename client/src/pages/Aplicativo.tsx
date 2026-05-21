'use client';

import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Smartphone, Lock, Shield, AlertTriangle, Eye, EyeOff, Check, X, Zap } from "lucide-react";
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

  if (digits.every(d => d === digits[0])) {
    return { valid: false, reason: "PIN muito fraco: não use todos os dígitos iguais (ex: 111111)." };
  }

  const isAscSeq = digits.every((d, i) => i === 0 || d === digits[i - 1]! + 1);
  if (isAscSeq) return { valid: false, reason: "PIN muito fraco: não use sequências crescentes (ex: 123456)." };

  const isDescSeq = digits.every((d, i) => i === 0 || d === digits[i - 1]! - 1);
  if (isDescSeq) return { valid: false, reason: "PIN muito fraco: não use sequências decrescentes (ex: 654321)." };

  const isPairs = digits.every((d, i) => {
    const pairIdx = Math.floor(i / 2);
    return d === digits[pairIdx * 2];
  });
  if (isPairs && new Set(digits).size <= 3) {
    return { valid: false, reason: "PIN muito fraco: não use pares repetidos (ex: 112233)." };
  }

  let repeatBlockCount = 0;
  for (let i = 0; i < digits.length - 1; i++) {
    if (digits[i] === digits[i + 1]) repeatBlockCount++;
  }
  if (repeatBlockCount >= 4) {
    return { valid: false, reason: "PIN muito fraco: muitos dígitos repetidos consecutivos." };
  }

  const knownWeak = ["123456", "654321", "112233", "332211", "445566", "665544", "778899", "998877", "121212", "010101", "000000", "999999", "123123", "456456", "789789"];
  if (knownWeak.includes(pin)) {
    return { valid: false, reason: "Este PIN é muito comum e não é permitido por segurança." };
  }

  for (let i = 0; i < digits.length - 2; i++) {
    if (digits[i] === digits[i + 1] && digits[i + 1] === digits[i + 2]) {
      return { valid: false, reason: "PIN fraco: não use 3 ou mais dígitos iguais seguidos (ex: 111, 222)." };
    }
  }

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
// MAIN COMPONENT
// ============================================================
export default function Aplicativo() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"entry" | "create" | "confirm">("entry");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [deviceId] = useState(() => getOrCreateDeviceId());
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  // Check if user has PIN on mount
  useEffect(() => {
    const storedPin = localStorage.getItem(PIN_KEY);
    const session = localStorage.getItem(SESSION_KEY);
    
    if (session && new Date(session) > new Date()) {
      setLocation("/app");
      return;
    }

    if (storedPin) {
      setMode("entry");
    } else {
      setMode("create");
    }
  }, [setLocation]);

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

  // Handle PIN submission
  const handleSubmit = useCallback(async () => {
    if (mode === "entry") {
      const storedPin = localStorage.getItem(PIN_KEY);
      if (pin === storedPin) {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 8);
        localStorage.setItem(SESSION_KEY, expiresAt.toISOString());
        setLocation("/app");
      } else {
        setError("PIN incorreto. Tente novamente.");
        setPin("");
      }
    } else if (mode === "create") {
      const validation = validatePinSecurity(pin);
      if (!validation.valid) {
        setError(validation.reason || "PIN inválido");
        setPin("");
      } else {
        setMode("confirm");
        setError(null);
      }
    } else if (mode === "confirm") {
      if (pin === confirmPin) {
        localStorage.setItem(PIN_KEY, pin);
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 8);
        localStorage.setItem(SESSION_KEY, expiresAt.toISOString());
        setLocation("/app");
      } else {
        setError("PINs não correspondem. Tente novamente.");
        setPin("");
        setConfirmPin("");
        setMode("create");
      }
    }
  }, [mode, pin, confirmPin, setLocation]);

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
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 relative">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 rounded-full blur-3xl"
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-emerald-500/20 rounded-full blur-3xl"
        animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
        transition={{ duration: 25, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 rounded-full blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, -100, 0] }}
        transition={{ duration: 30, repeat: Infinity }}
      />

      {/* Grid background with animation */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Animated particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400 rounded-full"
          animate={{
            x: [Math.random() * 100, Math.random() * 100],
            y: [Math.random() * 100, Math.random() * 100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            delay: i * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full max-w-md"
        >
          {/* Header with animated logo */}
          <div className="text-center mb-12">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-7xl mb-6 drop-shadow-2xl"
            >
              🐄
            </motion.div>
            
            <motion.h1 
              className="text-5xl font-black bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent mb-3 tracking-wider"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(0,255,136,0.5)",
                  "0 0 40px rgba(0,255,136,0.8)",
                  "0 0 20px rgba(0,255,136,0.5)",
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              BOVISION
            </motion.h1>

            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-emerald-400/80 text-xs tracking-[0.3em] font-semibold"
            >
              VISÃO INTELIGENTE
            </motion.div>
          </div>

          {/* Main card with glow effect */}
          <motion.div
            className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-800/60 via-slate-900/50 to-slate-900/60 border-2 border-emerald-500/40 rounded-3xl p-10 shadow-2xl overflow-hidden"
            animate={{ 
              boxShadow: [
                "0 0 30px rgba(0,255,136,0.1), inset 0 0 30px rgba(0,255,136,0.05)",
                "0 0 60px rgba(0,255,136,0.3), inset 0 0 60px rgba(0,255,136,0.1)",
                "0 0 30px rgba(0,255,136,0.1), inset 0 0 30px rgba(0,255,136,0.05)",
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {/* Inner glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-3xl"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Content inside card */}
            <div className="relative z-10">
              {/* Status badge with animation */}
              <motion.div 
                className="flex items-center justify-center gap-2 mb-8 px-4 py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/50 rounded-full w-fit mx-auto"
                animate={{ 
                  borderColor: [
                    "rgba(0,255,136,0.5)",
                    "rgba(0,255,136,1)",
                    "rgba(0,255,136,0.5)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Zap className="w-4 h-4 text-emerald-400" />
                </motion.div>
                <span className="text-xs font-bold text-emerald-300">ACESSO SEGURO</span>
              </motion.div>

              {/* Title */}
              <h2 className="text-center text-2xl font-black text-white mb-2">
                {mode === "entry" ? "Bem-vindo de Volta" : mode === "create" ? "Criar PIN Seguro" : "Confirmar PIN"}
              </h2>
              <p className="text-center text-sm text-emerald-200/70 mb-10">
                {mode === "entry" 
                  ? "Digite seu PIN de 6 dígitos" 
                  : mode === "create" 
                  ? "Crie um PIN seguro e memorável" 
                  : "Confirme seu PIN"}
              </p>

              {/* PIN dots with enhanced animation */}
              <div className="flex gap-4 justify-center mb-12">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: currentPin.length > i ? [1, 1.3, 1] : 1,
                      backgroundColor: currentPin.length > i ? "#00ff88" : "rgba(0, 255, 136, 0.1)",
                      boxShadow: currentPin.length > i 
                        ? ["0 0 10px rgba(0,255,136,0.5)", "0 0 30px rgba(0,255,136,0.8)", "0 0 10px rgba(0,255,136,0.5)"]
                        : "0 0 0px rgba(0,255,136,0)",
                    }}
                    transition={{ duration: 0.4 }}
                    className="w-14 h-14 rounded-full border-2 border-emerald-500/60 backdrop-blur-sm"
                  />
                ))}
              </div>

              {/* Error message with animation */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.8 }}
                  className="mb-8 p-4 bg-gradient-to-r from-red-500/20 to-red-600/10 border-2 border-red-500/50 rounded-xl flex gap-3 items-start"
                >
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                </motion.div>
              )}

              {/* Numeric keypad - 3x4 grid with 0 in the middle */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {/* Row 1: 1-3 */}
                {[1, 2, 3].map((num) => (
                  <motion.button
                    key={num}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.92 }}
                    onMouseDown={() => setClickedButton(num.toString())}
                    onMouseUp={() => setClickedButton(null)}
                    onClick={() => handlePinEntry(num.toString())}
                    disabled={currentPin.length >= 6}
                    className="h-16 rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 border-2 border-emerald-500/50 text-white font-bold text-xl hover:from-emerald-500/50 hover:to-cyan-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/50"
                  >
                    {num}
                  </motion.button>
                ))}

                {/* Row 2: 4-6 */}
                {[4, 5, 6].map((num) => (
                  <motion.button
                    key={num}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.92 }}
                    onMouseDown={() => setClickedButton(num.toString())}
                    onMouseUp={() => setClickedButton(null)}
                    onClick={() => handlePinEntry(num.toString())}
                    disabled={currentPin.length >= 6}
                    className="h-16 rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 border-2 border-emerald-500/50 text-white font-bold text-xl hover:from-emerald-500/50 hover:to-cyan-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/50"
                  >
                    {num}
                  </motion.button>
                ))}

                {/* Row 3: 7-9 */}
                {[7, 8, 9].map((num) => (
                  <motion.button
                    key={num}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.92 }}
                    onMouseDown={() => setClickedButton(num.toString())}
                    onMouseUp={() => setClickedButton(null)}
                    onClick={() => handlePinEntry(num.toString())}
                    disabled={currentPin.length >= 6}
                    className="h-16 rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 border-2 border-emerald-500/50 text-white font-bold text-xl hover:from-emerald-500/50 hover:to-cyan-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/50"
                  >
                    {num}
                  </motion.button>
                ))}

                {/* Row 4: 0 (center), Eye toggle, Delete */}
                <motion.button
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handlePinEntry("0")}
                  disabled={currentPin.length >= 6}
                  className="h-16 rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 border-2 border-emerald-500/50 text-white font-bold text-2xl hover:from-emerald-500/50 hover:to-cyan-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/50"
                >
                  0
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setShowPin(!showPin)}
                  className="h-16 rounded-xl bg-gradient-to-br from-slate-700/40 to-slate-800/40 border-2 border-slate-600/50 text-slate-300 hover:from-slate-700/60 hover:to-slate-800/60 transition-all flex items-center justify-center shadow-lg"
                >
                  {showPin ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleBackspace}
                  className="h-16 rounded-xl bg-gradient-to-br from-red-500/30 to-red-600/20 border-2 border-red-500/50 text-red-400 hover:from-red-500/50 hover:to-red-600/30 transition-all flex items-center justify-center shadow-lg hover:shadow-red-500/50"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Submit button with enhanced animation */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={currentPin.length !== 6 || loading}
                className="w-full h-16 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 text-white font-bold text-lg hover:from-emerald-600 hover:via-cyan-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl hover:shadow-emerald-500/50 relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-white/20 to-emerald-400/0"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {loading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                      <Smartphone className="w-6 h-6" />
                    </motion.div>
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-6 h-6" />
                    <span>{mode === "entry" ? "Entrar" : mode === "create" ? "Próximo" : "Confirmar"}</span>
                  </>
                )}
              </motion.button>

              {/* Device info with glow */}
              <motion.div 
                className="mt-10 pt-8 border-t border-emerald-500/20 text-center"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <p className="text-xs text-emerald-400/60 mb-2">Device ID</p>
                <p className="text-xs font-mono text-emerald-300 bg-emerald-500/10 px-3 py-2 rounded-lg inline-block border border-emerald-500/20">{deviceId}</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-10 text-xs text-emerald-400/50"
          >
            <p>Plataforma AgroTech com IA Avançada</p>
            <p className="mt-1">© 2026 BOVISION AI. Todos os direitos reservados.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
