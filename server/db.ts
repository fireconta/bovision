import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, devices, pins, sessions, animals, weights, vaccines, notifications } from "../drizzle/schema";
import { ENV } from './_core/env';
import { eq, desc, and } from "drizzle-orm";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// ============================================================
// DEVICE & PIN MANAGEMENT
// ============================================================
export async function getDeviceByDeviceId(deviceId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(devices).where(eq(devices.deviceId, deviceId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createDevice(data: { deviceId: string; pinHash?: string; userId?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(devices).values({
    userId: data.userId || 0,
    deviceId: data.deviceId,
  });
  const device = await getDeviceByDeviceId(data.deviceId);
  if (!device) throw new Error("Failed to create device");
  return device;
}

export async function incrementPinAttempts(deviceId: number) {
  const db = await getDb();
  if (!db) return;
  // Placeholder for PIN attempt tracking
  // This would be implemented with a separate pins table
}

export async function resetPinAttempts(deviceId: number) {
  const db = await getDb();
  if (!db) return;
  // Placeholder for PIN attempt reset
}

export async function updateDevicePin(deviceId: number, pinHash: string) {
  const db = await getDb();
  if (!db) return;
  // Placeholder for PIN update
  // This would update the pins table
}

// ============================================================
// SESSION MANAGEMENT
// ============================================================
export async function createSession(data: { deviceId: string; userId?: number; expiresAt: Date }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const crypto = require("crypto");
  const sessionToken = crypto.randomBytes(32).toString("hex");
  
  await db.insert(sessions).values({
    userId: data.userId || 0,
    deviceId: data.deviceId,
    sessionToken,
    expiresAt: data.expiresAt,
  });
  
  return {
    sessionToken,
    expiresAt: data.expiresAt,
  };
}

export async function getSessionByToken(sessionToken: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(sessions).where(eq(sessions.sessionToken, sessionToken)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================
// ANIMALS & HERD MANAGEMENT
// ============================================================
export async function getUserAnimals(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(animals).where(eq(animals.userId, userId));
}

export async function getAnimalById(animalId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(animals).where(and(eq(animals.id, animalId), eq(animals.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAnimal(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(animals).values(data);
}

// ============================================================
// WEIGHT TRACKING
// ============================================================
export async function getAnimalWeights(animalId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(weights).where(eq(weights.animalId, animalId)).orderBy(desc(weights.createdAt));
}

export async function addWeight(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(weights).values(data);
}

// ============================================================
// VACCINATION TRACKING
// ============================================================
export async function getAnimalVaccines(animalId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(vaccines).where(eq(vaccines.animalId, animalId)).orderBy(desc(vaccines.vaccinationDate));
}

export async function addVaccine(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(vaccines).values(data);
}

// ============================================================
// NOTIFICATIONS
// ============================================================
export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
}

export async function createNotification(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(notifications).values(data);
}
