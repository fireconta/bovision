import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, devices, pins, sessions, animals, weights, vaccines, notifications, conversations, conversationMessages, financial } from "../drizzle/schema";
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


// ============================================================
// AI CONVERSATIONS
// ============================================================
export async function getUserConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(conversations).where(eq(conversations.userId, userId)).orderBy(desc(conversations.updatedAt));
}

export async function getConversationById(conversationId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(conversations).where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createConversation(data: { userId: number; title?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(conversations).values({
    userId: data.userId,
    title: data.title || `Conversa ${new Date().toLocaleDateString('pt-BR')}`,
    messageCount: 0,
  });
  return result;
}

export async function getConversationMessages(conversationId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(conversationMessages).where(eq(conversationMessages.conversationId, conversationId)).orderBy(desc(conversationMessages.createdAt));
}

export async function addConversationMessage(data: { conversationId: number; userId: number; role: 'user' | 'assistant'; content: string; metadata?: any }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Add message
  await db.insert(conversationMessages).values({
    conversationId: data.conversationId,
    userId: data.userId,
    role: data.role,
    content: data.content,
    metadata: data.metadata ? JSON.stringify(data.metadata) : null,
  });
  
  // Update conversation message count and timestamp
  const conv = await getConversationById(data.conversationId, data.userId);
  if (conv) {
    const messages = await getConversationMessages(data.conversationId);
    await db.update(conversations).set({ messageCount: messages.length }).where(eq(conversations.id, data.conversationId));
  }
}

export async function deleteConversation(conversationId: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  
  // Delete all messages first
  await db.delete(conversationMessages).where(eq(conversationMessages.conversationId, conversationId));
  
  // Delete conversation
  await db.delete(conversations).where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId)));
}


// ============================================================
// SEARCH & FILTERS
// ============================================================
export async function searchAnimals(userId: number, query: string) {
  const db = await getDb();
  if (!db) return [];
  
  const searchTerm = `%${query}%`;
  return await db.select().from(animals).where(
    and(
      eq(animals.userId, userId),
      // Search by name or breed
      // Note: MySQL LIKE is case-insensitive by default
    )
  ).limit(50);
}

export async function filterAnimals(userId: number, filters: {
  breed?: string;
  sex?: 'male' | 'female';
  healthStatus?: 'healthy' | 'sick' | 'treatment';
  vacinationStatus?: 'up_to_date' | 'pending' | 'overdue';
}) {
  const db = await getDb();
  if (!db) return [];
  
  const allAnimals = await getUserAnimals(userId);
  
  return allAnimals.filter(animal => {
    if (filters.breed && animal.breed !== filters.breed) return false;
    if (filters.sex && animal.sex !== filters.sex) return false;
    if (filters.healthStatus && animal.healthStatus !== filters.healthStatus) return false;
    if (filters.vacinationStatus && animal.vacinationStatus !== filters.vacinationStatus) return false;
    return true;
  })
}

export async function getAnimalStats(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const allAnimals = await getUserAnimals(userId);
  
  if (allAnimals.length === 0) {
    return {
      totalAnimals: 0,
      averageWeight: 0,
      healthyCount: 0,
      sickCount: 0,
      vaccinatedCount: 0,
    };
  }
  
  const healthyCount = allAnimals.filter(a => a.healthStatus === 'healthy').length;
  const sickCount = allAnimals.filter(a => a.healthStatus === 'sick').length;
  const vaccinatedCount = allAnimals.filter(a => a.vacinationStatus === 'up_to_date').length;
  
  const weights = allAnimals
    .map(a => parseFloat(a.currentWeight?.toString() || '0'))
    .filter(w => w > 0);
  
  const averageWeight = weights.length > 0
    ? weights.reduce((a, b) => a + b, 0) / weights.length
    : 0;
  
  return {
    totalAnimals: allAnimals.length,
    averageWeight: Math.round(averageWeight * 100) / 100,
    healthyCount,
    sickCount,
    vaccinatedCount,
  };
}


// ============================================================
// FINANCIAL REPORTS
// ============================================================
export async function getFinancialRecords(userId: number, startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(financial).where(eq(financial.userId, userId));
  
  // Add date filters if provided
  // Note: This would require additional imports from drizzle-orm
  
  return await query.orderBy(desc(financial.date));
}

export async function getFinancialSummary(userId: number, startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return null;
  
  const records = await getFinancialRecords(userId, startDate, endDate);
  
  const income = records
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + parseFloat(r.amount?.toString() || '0'), 0);
  
  const expenses = records
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + parseFloat(r.amount?.toString() || '0'), 0);
  
  const profit = income - expenses;
  
  const byCategory: Record<string, { income: number; expense: number }> = {};
  
  records.forEach(record => {
    if (!byCategory[record.category]) {
      byCategory[record.category] = { income: 0, expense: 0 };
    }
    const amount = parseFloat(record.amount?.toString() || '0');
    if (record.type === 'income') {
      byCategory[record.category].income += amount;
    } else {
      byCategory[record.category].expense += amount;
    }
  });
  
  return {
    totalIncome: Math.round(income * 100) / 100,
    totalExpenses: Math.round(expenses * 100) / 100,
    profit: Math.round(profit * 100) / 100,
    profitMargin: income > 0 ? Math.round((profit / income) * 100) : 0,
    byCategory,
    recordCount: records.length,
  };
}

export async function addFinancialRecord(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(financial).values(data);
}

export async function deleteFinancialRecord(recordId: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  
  // Ensure user owns this record
  const record = await db.select().from(financial).where(
    and(eq(financial.id, recordId), eq(financial.userId, userId))
  ).limit(1);
  
  if (record.length === 0) return;
  
  await db.delete(financial).where(eq(financial.id, recordId));
}
