'use client';

import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Smartphone, Lock, Shield, AlertTriangle, Eye, EyeOff, Check, X } from "lucide-react";
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
        // Simulate API call
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
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-full blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🐄
            </motion.div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              BOVISION
            </h1>
            <p className="text-cyan-400/80 text-sm tracking-widest">VISÃO INTELIGENTE PARA A NOVA PECUÁRIA</p>
          </div>

          {/* Main card */}
          <motion.div
            className="backdrop-blur-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-emerald-500/20 rounded-2xl p-8 shadow-2xl"
            animate={{ boxShadow: ["0 0 20px rgba(0,255,136,0.1)", "0 0 40px rgba(0,255,136,0.2)", "0 0 20px rgba(0,255,136,0.1)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {/* Status badge */}
            <div className="flex items-center justify-center gap-2 mb-8 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full w-fit mx-auto">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">ACESSO SEGURO</span>
            </div>

            {/* Title */}
            <h2 className="text-center text-xl font-bold text-white mb-2">
              {mode === "entry" ? "Bem-vindo de Volta" : mode === "create" ? "Criar PIN de Segurança" : "Confirmar PIN"}
            </h2>
            <p className="text-center text-sm text-slate-400 mb-8">
              {mode === "entry" 
                ? "Digite seu PIN para acessar" 
                : mode === "create" 
                ? "Crie um PIN seguro com 6 dígitos" 
                : "Confirme seu PIN"}
            </p>

            {/* PIN dots */}
            <div className="flex gap-3 justify-center mb-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: currentPin.length > i ? [1, 1.2, 1] : 1,
                    backgroundColor: currentPin.length > i ? "#00ff88" : "rgba(0, 255, 136, 0.1)",
                    boxShadow: currentPin.length > i ? "0 0 20px rgba(0,255,136,0.6)" : "none",
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-12 h-12 rounded-full border-2 border-emerald-500/40"
                />
              ))}
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-2 items-start"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Numeric keypad */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <motion.button
                  key={num}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePinEntry(num.toString())}
                  disabled={currentPin.length >= 6}
                  className="h-14 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-white font-bold text-lg hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {num}
                </motion.button>
              ))}
            </div>

            {/* 0 and action buttons */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePinEntry("0")}
                disabled={currentPin.length >= 6}
                className="h-14 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-white font-bold text-lg hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed col-span-1"
              >
                0
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPin(!showPin)}
                className="h-14 rounded-lg bg-gradient-to-br from-slate-700/40 to-slate-800/40 border border-slate-600/40 text-slate-300 hover:from-slate-700/60 hover:to-slate-800/60 transition-all flex items-center justify-center"
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackspace}
                className="h-14 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/40 text-red-400 hover:from-red-500/30 hover:to-red-600/30 transition-all flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={currentPin.length !== 6 || loading}
              className="w-full h-14 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg hover:from-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                    <Smartphone className="w-5 h-5" />
                  </motion.div>
                  Processando...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  {mode === "entry" ? "Entrar" : mode === "create" ? "Próximo" : "Confirmar"}
                </>
              )}
            </motion.button>

            {/* Device info */}
            <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
              <p className="text-xs text-slate-500 mb-2">Device ID</p>
              <p className="text-xs font-mono text-emerald-400/60">{deviceId}</p>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8 text-xs text-slate-500"
          >
            <p>Plataforma AgroTech com IA avançada</p>
            <p className="mt-1">© 2026 BOVISION AI. Todos os direitos reservados.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
