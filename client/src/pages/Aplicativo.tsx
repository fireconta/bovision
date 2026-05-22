'use client';

import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Lock, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ============================================================
// CONSTANTS
// ============================================================
const DEVICE_ID_KEY = "bv_device_id";
const SESSION_KEY = "bv_session";

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
        setError("Erro ao verificar dispositivo");
        setMode("entry");
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

  // Handle PIN submission
  const handleSubmit = useCallback(async () => {
    if (mode === "entry") {
      if (pin.length !== 6) {
        setError("PIN deve ter 6 dígitos");
        return;
      }
      setLoading(true);
      try {
        const result = await verifyPinMutation.mutateAsync({ pin, deviceId });
        localStorage.setItem(SESSION_KEY, result.sessionToken);
        toast.success("Login bem-sucedido!");
        setLocation("/app");
      } catch (err: any) {
        setError(err.message || "Erro ao verificar PIN");
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
        setPin("");
        setConfirmPin("");
        setMode("create");
        return;
      }
      setLoading(true);
      try {
        const result = await createPinMutation.mutateAsync({ pin, confirmPin, deviceId });
        toast.success(result.message);
        setLocation("/app");
      } catch (err: any) {
        setError(err.message || "Erro ao criar PIN");
        setPin("");
        setConfirmPin("");
        setMode("create");
      } finally {
        setLoading(false);
      }
    }
  }, [mode, pin, confirmPin, deviceId, setLocation, createPinMutation, verifyPinMutation]);

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

      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-7xl mb-6"
            >
              🐄
            </motion.div>
            
            <motion.h1 
              className="text-5xl font-black bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent mb-3 tracking-wider"
              animate={{ textShadow: ["0 0 20px rgba(0,255,136,0.5)", "0 0 40px rgba(0,255,136,0.8)", "0 0 20px rgba(0,255,136,0.5)"] }}
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

          {/* Main card */}
          <motion.div
            className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-800/60 via-slate-900/50 to-slate-900/60 border-2 border-emerald-500/40 rounded-3xl p-10 shadow-2xl overflow-hidden"
            animate={{ boxShadow: ["0 0 30px rgba(0,255,136,0.1), inset 0 0 30px rgba(0,255,136,0.05)", "0 0 60px rgba(0,255,136,0.3), inset 0 0 60px rgba(0,255,136,0.1)", "0 0 30px rgba(0,255,136,0.1), inset 0 0 30px rgba(0,255,136,0.05)"] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {/* Inner glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-3xl"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Content */}
            <div className="relative z-10">
              {/* Status badge */}
              <motion.div 
                className="flex items-center justify-center gap-2 mb-8 px-4 py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/50 rounded-full w-fit mx-auto"
                animate={{ borderColor: ["rgba(0,255,136,0.5)", "rgba(0,255,136,1)", "rgba(0,255,136,0.5)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300">ACESSO SEGURO</span>
              </motion.div>

              {/* Title */}
              <h2 className="text-center text-2xl font-black text-white mb-2">
                {mode === "loading" ? "Carregando..." : mode === "entry" ? "Bem-vindo de Volta" : mode === "create" ? "Criar PIN Seguro" : "Confirmar PIN"}
              </h2>
              <p className="text-center text-sm text-emerald-200/70 mb-10">
                {mode === "loading" 
                  ? "Verificando dispositivo..." 
                  : mode === "entry" 
                  ? "Digite seu PIN de 6 dígitos" 
                  : mode === "create" 
                  ? "Crie um PIN seguro e memorável" 
                  : "Confirme seu PIN"}
              </p>

              {/* PIN dots */}
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

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="mb-8 p-4 bg-gradient-to-r from-red-500/20 to-red-600/10 border-2 border-red-500/50 rounded-xl flex gap-3 items-start"
                >
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                </motion.div>
              )}

              {/* Numeric keypad */}
              {(mode === "entry" || mode === "create" || mode === "confirm") && (
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((key, i) => {
                    if (key === "") return <div key={i} />;
                    const isDelete = key === "⌫";
                    return (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.88 }}
                        disabled={loading}
                        onClick={() => isDelete ? handleBackspace() : handlePinEntry(key)}
                        className={`h-14 rounded-xl font-mono text-lg font-bold transition-all border-2 ${
                          isDelete
                            ? "border-red-500/50 text-red-400 hover:bg-red-500/10"
                            : "border-emerald-500/50 text-white hover:bg-emerald-500/10"
                        } disabled:opacity-50`}
                      >
                        {isDelete ? "⌫" : key}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Submit button */}
              {(mode === "entry" || mode === "create" || mode === "confirm") && (currentPin.length === 6) && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processando...
                    </>
                  ) : mode === "entry" ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Entrar
                    </>
                  ) : mode === "create" ? (
                    "Próximo"
                  ) : (
                    "Confirmar"
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Device ID */}
          <div className="mt-12 text-center">
            <p className="text-xs text-slate-500 font-mono">ID: {deviceId}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
