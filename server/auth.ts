import crypto from 'crypto';
import { getDb } from './db';
import { devices, pins, sessions } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Gera um Device ID único no formato BV-XXXXXXXX
 */
export function generateDeviceId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'BV-';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * Valida um PIN de 6 dígitos
 */
export function validatePin(pin: string): { valid: boolean; error?: string } {
  if (!pin || pin.length !== 6) {
    return { valid: false, error: 'PIN deve ter exatamente 6 dígitos' };
  }

  if (!/^\d{6}$/.test(pin)) {
    return { valid: false, error: 'PIN deve conter apenas números' };
  }

  // Verificar PINs fracos
  const weakPins = ['000000', '111111', '222222', '333333', '444444', '555555', '666666', '777777', '888888', '999999', '123456', '654321', '123321', '112233'];
  if (weakPins.includes(pin)) {
    return { valid: false, error: 'PIN muito fraco. Escolha uma sequência mais complexa' };
  }

  return { valid: true };
}

/**
 * Hash de PIN usando bcrypt-like approach
 */
export function hashPin(pin: string): string {
  return crypto.createHash('sha256').update(pin + process.env.JWT_SECRET).digest('hex');
}

/**
 * Verifica se o PIN está correto
 */
export function verifyPin(pin: string, hash: string): boolean {
  return hashPin(pin) === hash;
}

/**
 * Gera um token de sessão
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Registra um novo dispositivo
 */
export async function registerDevice(userId: number, userAgent?: string, ipAddress?: string): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const deviceId = generateDeviceId();
  
  await db.insert(devices).values({
    userId,
    deviceId,
    userAgent,
    ipAddress,
    lastAccessed: new Date(),
  });

  return deviceId;
}

/**
 * Cria uma nova sessão PIN
 */
export async function createPinSession(userId: number, deviceId: string, pin: string): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const pinHash = hashPin(pin);
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 horas

  // Verificar se já existe PIN para este dispositivo
  const existingPin = await db
    .select()
    .from(pins)
    .where(eq(pins.deviceId, deviceId))
    .limit(1);

  if (existingPin.length > 0) {
    // Atualizar PIN existente
    await db
      .update(pins)
      .set({ pinHash, attempts: 0, lockedUntil: null })
      .where(eq(pins.deviceId, deviceId));
  } else {
    // Criar novo PIN
    await db.insert(pins).values({
      userId,
      deviceId,
      pinHash,
      attempts: 0,
    });
  }

  // Criar sessão
  await db.insert(sessions).values({
    userId,
    deviceId,
    sessionToken,
    expiresAt,
  });

  return sessionToken;
}

/**
 * Verifica uma sessão PIN
 */
export async function verifyPinSession(deviceId: string, pin: string): Promise<{ valid: boolean; sessionToken?: string; error?: string }> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Buscar PIN do dispositivo
  const pinRecord = await db
    .select()
    .from(pins)
    .where(eq(pins.deviceId, deviceId))
    .limit(1);

  if (pinRecord.length === 0) {
    return { valid: false, error: 'Dispositivo não registrado' };
  }

  const pinData = pinRecord[0];

  // Verificar se está bloqueado
  if (pinData.lockedUntil && pinData.lockedUntil > new Date()) {
    return { valid: false, error: 'Dispositivo bloqueado temporariamente' };
  }

  // Verificar PIN
  if (!verifyPin(pin, pinData.pinHash)) {
    const newAttempts = (pinData.attempts || 0) + 1;
    
    // Bloquear após 5 tentativas
    if (newAttempts >= 5) {
      const lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
      await db
        .update(pins)
        .set({ attempts: newAttempts, lockedUntil })
        .where(eq(pins.deviceId, deviceId));
      
      return { valid: false, error: 'Muitas tentativas. Tente novamente em 15 minutos' };
    }

    await db
      .update(pins)
      .set({ attempts: newAttempts })
      .where(eq(pins.deviceId, deviceId));

    return { valid: false, error: `PIN incorreto. ${5 - newAttempts} tentativas restantes` };
  }

  // PIN correto - criar sessão
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);

  await db.insert(sessions).values({
    userId: pinData.userId,
    deviceId,
    sessionToken,
    expiresAt,
  });

  // Resetar tentativas
  await db
    .update(pins)
    .set({ attempts: 0, lockedUntil: null })
    .where(eq(pins.deviceId, deviceId));

  return { valid: true, sessionToken };
}

/**
 * Valida uma sessão existente
 */
export async function validateSession(sessionToken: string): Promise<{ valid: boolean; userId?: number; error?: string }> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.sessionToken, sessionToken))
    .limit(1);

  if (session.length === 0) {
    return { valid: false, error: 'Sessão não encontrada' };
  }

  const sessionData = session[0];

  // Verificar expiração
  if (sessionData.expiresAt < new Date()) {
    return { valid: false, error: 'Sessão expirada' };
  }

  return { valid: true, userId: sessionData.userId };
}
