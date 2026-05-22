var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/db.ts
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, longtext, date, uniqueIndex } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var devices = mysqlTable("devices", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceId: varchar("deviceId", { length: 32 }).notNull(),
  // BV-XXXXXXXX format
  userAgent: text("userAgent"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  operatingSystem: varchar("operatingSystem", { length: 64 }),
  browser: varchar("browser", { length: 64 }),
  lastAccessed: timestamp("lastAccessed").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
}, (table) => ({
  userDeviceUnique: uniqueIndex("user_device_unique").on(table.userId, table.deviceId)
}));
var pins = mysqlTable("pins", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceId: varchar("deviceId", { length: 32 }).notNull(),
  pinHash: varchar("pinHash", { length: 255 }).notNull(),
  // Hashed PIN
  attempts: int("attempts").default(0),
  lockedUntil: timestamp("lockedUntil"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var licenses = mysqlTable("licenses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  plan: mysqlEnum("plan", ["trial", "monthly", "annual"]).default("trial").notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  expirationDate: timestamp("expirationDate").notNull(),
  status: mysqlEnum("status", ["active", "expired", "cancelled"]).default("active").notNull(),
  isTrial: boolean("isTrial").default(true),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var animals = mysqlTable("animals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 128 }),
  breed: varchar("breed", { length: 128 }),
  age: int("age"),
  // in months
  sex: mysqlEnum("sex", ["male", "female"]),
  currentWeight: decimal("currentWeight", { precision: 8, scale: 2 }),
  photoUrl: varchar("photoUrl", { length: 512 }),
  photoKey: varchar("photoKey", { length: 255 }),
  // S3 key
  vacinationStatus: mysqlEnum("vacinationStatus", ["up_to_date", "pending", "overdue"]).default("pending"),
  healthStatus: mysqlEnum("healthStatus", ["healthy", "sick", "treatment"]).default("healthy"),
  notes: longtext("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var weights = mysqlTable("weights", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  animalId: int("animalId").notNull(),
  weight: decimal("weight", { precision: 8, scale: 2 }).notNull(),
  estimatedPrecision: decimal("estimatedPrecision", { precision: 5, scale: 2 }),
  // percentage
  method: mysqlEnum("method", ["manual", "ai_camera", "scale"]).default("manual"),
  photoUrl: varchar("photoUrl", { length: 512 }),
  // Photo from AI camera
  photoKey: varchar("photoKey", { length: 255 }),
  // S3 key
  aiReport: longtext("aiReport"),
  // JSON report from AI
  dailyGain: decimal("dailyGain", { precision: 8, scale: 2 }),
  // calculated
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var vaccines = mysqlTable("vaccines", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  animalId: int("animalId").notNull(),
  vaccineName: varchar("vaccineName", { length: 128 }).notNull(),
  vaccinationDate: date("vaccinationDate").notNull(),
  nextDueDate: date("nextDueDate"),
  veterinarian: varchar("veterinarian", { length: 128 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var financial = mysqlTable("financial", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["income", "expense"]).notNull(),
  category: varchar("category", { length: 128 }).notNull(),
  // e.g., "feed", "veterinary", "sales"
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  date: date("date").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  reportType: varchar("reportType", { length: 64 }).notNull(),
  // "weight", "vaccination", "financial", "productivity"
  title: varchar("title", { length: 256 }).notNull(),
  content: longtext("content"),
  // JSON content
  fileUrl: varchar("fileUrl", { length: 512 }),
  fileKey: varchar("fileKey", { length: 255 }),
  // S3 key
  format: mysqlEnum("format", ["pdf", "excel", "csv"]),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  metricType: varchar("metricType", { length: 64 }).notNull(),
  // "weight_gain", "disease_risk", "cost_prediction", "productivity"
  value: decimal("value", { precision: 12, scale: 2 }),
  prediction: longtext("prediction"),
  // JSON prediction data
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  // percentage
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  method: mysqlEnum("method", ["pix", "boleto"]).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "cancelled"]).default("pending"),
  plan: mysqlEnum("plan", ["monthly", "annual"]).notNull(),
  transactionId: varchar("transactionId", { length: 128 }),
  metadata: longtext("metadata"),
  // JSON metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceId: varchar("deviceId", { length: 32 }).notNull(),
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 64 }).notNull(),
  // "vaccination", "license", "ai_complete", "report", "admin"
  title: varchar("title", { length: 256 }).notNull(),
  content: text("content"),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var logs = mysqlTable("logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  deviceId: varchar("deviceId", { length: 32 }),
  action: varchar("action", { length: 128 }).notNull(),
  details: longtext("details"),
  // JSON details
  ipAddress: varchar("ipAddress", { length: 45 }),
  status: mysqlEnum("status", ["success", "failed", "warning"]).default("success"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var adminLogs = mysqlTable("admin_logs", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
  targetUserId: int("targetUserId"),
  action: varchar("action", { length: 128 }).notNull(),
  details: longtext("details"),
  // JSON details
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 256 }),
  summary: text("summary"),
  messageCount: int("messageCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var conversationMessages = mysqlTable("conversation_messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: longtext("content").notNull(),
  metadata: longtext("metadata"),
  // JSON metadata
  createdAt: timestamp("createdAt").defaultNow().notNull()
});

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/db.ts
import { eq, desc, and } from "drizzle-orm";
var _db = null;
async function getDb() {
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
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getDeviceByDeviceId(deviceId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(devices).where(eq(devices.deviceId, deviceId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createSession(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const crypto2 = __require("crypto");
  const sessionToken = crypto2.randomBytes(32).toString("hex");
  await db.insert(sessions).values({
    userId: data.userId || 0,
    deviceId: data.deviceId,
    sessionToken,
    expiresAt: data.expiresAt
  });
  return {
    sessionToken,
    expiresAt: data.expiresAt
  };
}
async function getUserAnimals(userId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(animals).where(eq(animals.userId, userId));
}
async function getAnimalById(animalId, userId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(animals).where(and(eq(animals.id, animalId), eq(animals.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createAnimal(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(animals).values(data);
}
async function getAnimalWeights(animalId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(weights).where(eq(weights.animalId, animalId)).orderBy(desc(weights.createdAt));
}
async function addWeight(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(weights).values(data);
}
async function getAnimalVaccines(animalId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(vaccines).where(eq(vaccines.animalId, animalId)).orderBy(desc(vaccines.vaccinationDate));
}
async function addVaccine(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(vaccines).values(data);
}
async function getUserConversations(userId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(conversations).where(eq(conversations.userId, userId)).orderBy(desc(conversations.updatedAt));
}
async function getConversationById(conversationId, userId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(conversations).where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createConversation(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(conversations).values({
    userId: data.userId,
    title: data.title || `Conversa ${(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")}`,
    messageCount: 0
  });
  return result;
}
async function getConversationMessages(conversationId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(conversationMessages).where(eq(conversationMessages.conversationId, conversationId)).orderBy(desc(conversationMessages.createdAt));
}
async function addConversationMessage(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(conversationMessages).values({
    conversationId: data.conversationId,
    userId: data.userId,
    role: data.role,
    content: data.content,
    metadata: data.metadata ? JSON.stringify(data.metadata) : null
  });
  const conv = await getConversationById(data.conversationId, data.userId);
  if (conv) {
    const messages = await getConversationMessages(data.conversationId);
    await db.update(conversations).set({ messageCount: messages.length }).where(eq(conversations.id, data.conversationId));
  }
}
async function deleteConversation(conversationId, userId) {
  const db = await getDb();
  if (!db) return;
  await db.delete(conversationMessages).where(eq(conversationMessages.conversationId, conversationId));
  await db.delete(conversations).where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId)));
}
async function searchAnimals(userId, query) {
  const db = await getDb();
  if (!db) return [];
  const searchTerm = `%${query}%`;
  return await db.select().from(animals).where(
    and(
      eq(animals.userId, userId)
      // Search by name or breed
      // Note: MySQL LIKE is case-insensitive by default
    )
  ).limit(50);
}
async function filterAnimals(userId, filters) {
  const db = await getDb();
  if (!db) return [];
  const allAnimals = await getUserAnimals(userId);
  return allAnimals.filter((animal) => {
    if (filters.breed && animal.breed !== filters.breed) return false;
    if (filters.sex && animal.sex !== filters.sex) return false;
    if (filters.healthStatus && animal.healthStatus !== filters.healthStatus) return false;
    if (filters.vacinationStatus && animal.vacinationStatus !== filters.vacinationStatus) return false;
    return true;
  });
}
async function getAnimalStats(userId) {
  const db = await getDb();
  if (!db) return null;
  const allAnimals = await getUserAnimals(userId);
  if (allAnimals.length === 0) {
    return {
      totalAnimals: 0,
      averageWeight: 0,
      healthyCount: 0,
      sickCount: 0,
      vaccinatedCount: 0
    };
  }
  const healthyCount = allAnimals.filter((a) => a.healthStatus === "healthy").length;
  const sickCount = allAnimals.filter((a) => a.healthStatus === "sick").length;
  const vaccinatedCount = allAnimals.filter((a) => a.vacinationStatus === "up_to_date").length;
  const weights2 = allAnimals.map((a) => parseFloat(a.currentWeight?.toString() || "0")).filter((w) => w > 0);
  const averageWeight = weights2.length > 0 ? weights2.reduce((a, b) => a + b, 0) / weights2.length : 0;
  return {
    totalAnimals: allAnimals.length,
    averageWeight: Math.round(averageWeight * 100) / 100,
    healthyCount,
    sickCount,
    vaccinatedCount
  };
}
async function getFinancialRecords(userId, startDate, endDate) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(financial).where(eq(financial.userId, userId));
  return await query.orderBy(desc(financial.date));
}
async function getFinancialSummary(userId, startDate, endDate) {
  const db = await getDb();
  if (!db) return null;
  const records = await getFinancialRecords(userId, startDate, endDate);
  const income = records.filter((r) => r.type === "income").reduce((sum, r) => sum + parseFloat(r.amount?.toString() || "0"), 0);
  const expenses = records.filter((r) => r.type === "expense").reduce((sum, r) => sum + parseFloat(r.amount?.toString() || "0"), 0);
  const profit = income - expenses;
  const byCategory = {};
  records.forEach((record) => {
    if (!byCategory[record.category]) {
      byCategory[record.category] = { income: 0, expense: 0 };
    }
    const amount = parseFloat(record.amount?.toString() || "0");
    if (record.type === "income") {
      byCategory[record.category].income += amount;
    } else {
      byCategory[record.category].expense += amount;
    }
  });
  return {
    totalIncome: Math.round(income * 100) / 100,
    totalExpenses: Math.round(expenses * 100) / 100,
    profit: Math.round(profit * 100) / 100,
    profitMargin: income > 0 ? Math.round(profit / income * 100) : 0,
    byCategory,
    recordCount: records.length
  };
}
async function addFinancialRecord(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(financial).values(data);
}
async function deleteFinancialRecord(recordId, userId) {
  const db = await getDb();
  if (!db) return;
  const record = await db.select().from(financial).where(
    and(eq(financial.id, recordId), eq(financial.userId, userId))
  ).limit(1);
  if (record.length === 0) return;
  await db.delete(financial).where(eq(financial.id, recordId));
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
      const taskUid = userInfo.taskUid ?? null;
      if (!taskUid) {
        throw ForbiddenError("Cron session missing task_uid");
      }
      return buildCronUser(userInfo);
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var CRON_OPEN_ID_PREFIX = "cron_";
function buildCronUser(userInfo) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/storageProxy.ts
function registerStorageProxy(app) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers/aiAssistant.ts
import { z as z2 } from "zod";

// server/_core/llm.ts
var ensureArray = (value) => Array.isArray(value) ? value : [value];
var normalizeContentPart = (part) => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }
  if (part.type === "text") {
    return part;
  }
  if (part.type === "image_url") {
    return part;
  }
  if (part.type === "file_url") {
    return part;
  }
  throw new Error("Unsupported message content part");
};
var normalizeMessage = (message) => {
  const { role, name, tool_call_id } = message;
  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content).map((part) => typeof part === "string" ? part : JSON.stringify(part)).join("\n");
    return {
      role,
      name,
      tool_call_id,
      content
    };
  }
  const contentParts = ensureArray(message.content).map(normalizeContentPart);
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text
    };
  }
  return {
    role,
    name,
    content: contentParts
  };
};
var normalizeToolChoice = (toolChoice, tools) => {
  if (!toolChoice) return void 0;
  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }
  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error(
        "tool_choice 'required' was provided but no tools were configured"
      );
    }
    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly"
      );
    }
    return {
      type: "function",
      function: { name: tools[0].function.name }
    };
  }
  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name }
    };
  }
  return toolChoice;
};
var resolveApiUrl = () => ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0 ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions` : "https://forge.manus.im/v1/chat/completions";
var assertApiKey = () => {
  if (!ENV.forgeApiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
};
var normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema
}) => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (explicitFormat.type === "json_schema" && !explicitFormat.json_schema?.schema) {
      throw new Error(
        "responseFormat json_schema requires a defined schema object"
      );
    }
    return explicitFormat;
  }
  const schema = outputSchema || output_schema;
  if (!schema) return void 0;
  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }
  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...typeof schema.strict === "boolean" ? { strict: schema.strict } : {}
    }
  };
};
async function invokeLLM(params) {
  assertApiKey();
  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format
  } = params;
  const payload = {
    model: "gemini-2.5-flash",
    messages: messages.map(normalizeMessage)
  };
  if (tools && tools.length > 0) {
    payload.tools = tools;
  }
  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }
  payload.max_tokens = 32768;
  payload.thinking = {
    "budget_tokens": 128
  };
  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema
  });
  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }
  const response = await fetch(resolveApiUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.forgeApiKey}`
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} \u2013 ${errorText}`
    );
  }
  return await response.json();
}

// server/routers/aiAssistant.ts
var aiAssistantRouter = router({
  chat: protectedProcedure.input(
    z2.object({
      messages: z2.array(
        z2.object({
          role: z2.enum(["user", "assistant", "system"]),
          content: z2.string()
        })
      )
    })
  ).mutation(async ({ input, ctx }) => {
    try {
      const systemPrompt = {
        role: "system",
        content: `Voc\xEA \xE9 um especialista em pecu\xE1ria e agroneg\xF3cio, especializado em IA para gest\xE3o de rebanho leiteiro. 
Voc\xEA ajuda fazendeiros com:
- Manejo de rebanho (alimenta\xE7\xE3o, vacina\xE7\xE3o, reprodu\xE7\xE3o)
- An\xE1lise de dados de produ\xE7\xE3o
- Preven\xE7\xE3o de doen\xE7as
- Otimiza\xE7\xE3o de custos
- Bem-estar animal
- Sustentabilidade

Sempre forne\xE7a respostas pr\xE1ticas e baseadas em dados. Se n\xE3o tiver informa\xE7\xE3o espec\xEDfica, sugira consultar um veterin\xE1rio.
Responda em portugu\xEAs do Brasil.`
      };
      const messages = [
        systemPrompt,
        ...input.messages.map((msg) => ({
          role: msg.role,
          content: msg.content
        }))
      ];
      const response = await invokeLLM({
        messages
      });
      const assistantMessage = response.choices[0]?.message?.content;
      if (typeof assistantMessage !== "string") {
        throw new Error("Invalid response from LLM");
      }
      return {
        success: true,
        message: assistantMessage,
        usage: response.usage
      };
    } catch (error) {
      console.error("AI Assistant error:", error);
      throw new Error(
        `Erro ao processar sua pergunta: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    }
  }),
  // Análise de rebanho com IA
  analyzeHerd: protectedProcedure.input(
    z2.object({
      herdStats: z2.object({
        totalAnimals: z2.number(),
        averageWeight: z2.number(),
        averageProduction: z2.number(),
        healthAlerts: z2.number(),
        lastVaccination: z2.string().optional()
      })
    })
  ).mutation(async ({ input }) => {
    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Voc\xEA \xE9 um especialista em an\xE1lise de rebanho leiteiro. Analise os dados fornecidos e forne\xE7a recomenda\xE7\xF5es."
          },
          {
            role: "user",
            content: `Analise meu rebanho com os seguintes dados:
- Total de animais: ${input.herdStats.totalAnimals}
- Peso m\xE9dio: ${input.herdStats.averageWeight} kg
- Produ\xE7\xE3o m\xE9dia: ${input.herdStats.averageProduction} L/dia
- Alertas de sa\xFAde: ${input.herdStats.healthAlerts}
- \xDAltima vacina\xE7\xE3o: ${input.herdStats.lastVaccination || "N\xE3o informado"}

Forne\xE7a uma an\xE1lise detalhada e recomenda\xE7\xF5es de a\xE7\xE3o.`
          }
        ]
      });
      const analysis = response.choices[0]?.message?.content;
      if (typeof analysis !== "string") {
        throw new Error("Invalid response from LLM");
      }
      return {
        success: true,
        analysis
      };
    } catch (error) {
      console.error("Herd analysis error:", error);
      throw new Error("Erro ao analisar rebanho");
    }
  }),
  // Recomendações nutricionais com IA
  getNutritionRecommendations: protectedProcedure.input(
    z2.object({
      animalWeight: z2.number(),
      productionLevel: z2.enum(["baixa", "m\xE9dia", "alta"]),
      currentFeed: z2.string().optional()
    })
  ).mutation(async ({ input }) => {
    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Voc\xEA \xE9 um nutricionista especializado em bovinos leiteiros. Forne\xE7a recomenda\xE7\xF5es nutricionais baseadas nos dados fornecidos."
          },
          {
            role: "user",
            content: `Forne\xE7a recomenda\xE7\xF5es nutricionais para:
- Peso do animal: ${input.animalWeight} kg
- N\xEDvel de produ\xE7\xE3o: ${input.productionLevel}
- Alimenta\xE7\xE3o atual: ${input.currentFeed || "N\xE3o informado"}

Inclua: prote\xEDna, fibra, minerais, vitaminas e custo estimado.`
          }
        ]
      });
      const recommendations = response.choices[0]?.message?.content;
      if (typeof recommendations !== "string") {
        throw new Error("Invalid response from LLM");
      }
      return {
        success: true,
        recommendations
      };
    } catch (error) {
      console.error("Nutrition recommendations error:", error);
      throw new Error("Erro ao gerar recomenda\xE7\xF5es nutricionais");
    }
  }),
  // Diagnóstico de saúde com IA
  getHealthDiagnosis: protectedProcedure.input(
    z2.object({
      symptoms: z2.string(),
      temperature: z2.number().optional(),
      weight: z2.number().optional()
    })
  ).mutation(async ({ input }) => {
    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `Voc\xEA \xE9 um veterin\xE1rio especializado em bovinos. Analise os sintomas fornecidos e forne\xE7a poss\xEDveis diagn\xF3sticos e recomenda\xE7\xF5es.
IMPORTANTE: Sempre recomende consulta com veterin\xE1rio para diagn\xF3stico definitivo.`
          },
          {
            role: "user",
            content: `Analise os seguintes sintomas:
- Sintomas: ${input.symptoms}
${input.temperature ? `- Temperatura: ${input.temperature}\xB0C` : ""}
${input.weight ? `- Peso: ${input.weight} kg` : ""}

Forne\xE7a poss\xEDveis diagn\xF3sticos e recomenda\xE7\xF5es de a\xE7\xE3o.`
          }
        ]
      });
      const diagnosis = response.choices[0]?.message?.content;
      if (typeof diagnosis !== "string") {
        throw new Error("Invalid response from LLM");
      }
      return {
        success: true,
        diagnosis
      };
    } catch (error) {
      console.error("Health diagnosis error:", error);
      throw new Error("Erro ao gerar diagn\xF3stico");
    }
  })
});

// server/routers/payments.ts
import { z as z3 } from "zod";
var paymentsRouter = router({
  // Gerar QR Code PIX
  generatePixQrCode: protectedProcedure.input(
    z3.object({
      planId: z3.string(),
      amount: z3.number().positive(),
      description: z3.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    try {
      const pixKey = `${ctx.user.id}-${Date.now()}`;
      const qrCode = `00020126580014br.gov.bcb.pix0136${pixKey}520400005303986540510.005802BR5913BOVISION6009BRASILIA62410503***63041D3D`;
      return {
        success: true,
        pixKey,
        qrCode,
        amount: input.amount,
        expiresAt: new Date(Date.now() + 30 * 60 * 1e3)
        // 30 minutos
      };
    } catch (error) {
      console.error("PIX QR Code generation error:", error);
      throw new Error("Erro ao gerar QR Code PIX");
    }
  }),
  // Gerar Boleto
  generateBoleto: protectedProcedure.input(
    z3.object({
      planId: z3.string(),
      amount: z3.number().positive(),
      dueDate: z3.date().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    try {
      const boletoNumber = `${Math.random().toString().slice(2, 6)}.${Math.random().toString().slice(2, 6)} ${Math.random().toString().slice(2, 6)}.${Math.random().toString().slice(2, 6)} ${Math.random().toString().slice(2, 6)}.${Math.random().toString().slice(2, 6)} ${Math.random().toString().slice(2, 6)}`;
      const dueDate = input.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
      return {
        success: true,
        boletoNumber,
        amount: input.amount,
        dueDate,
        barcode: boletoNumber.replace(/\D/g, ""),
        pdfUrl: `/boletos/${ctx.user.id}-${Date.now()}.pdf`
      };
    } catch (error) {
      console.error("Boleto generation error:", error);
      throw new Error("Erro ao gerar boleto");
    }
  }),
  // Verificar status de pagamento
  checkPaymentStatus: protectedProcedure.input(
    z3.object({
      paymentId: z3.string()
    })
  ).query(async ({ input, ctx }) => {
    try {
      return {
        success: true,
        paymentId: input.paymentId,
        status: "pending",
        // pending, completed, failed, expired
        amount: 29.9,
        createdAt: /* @__PURE__ */ new Date(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1e3)
      };
    } catch (error) {
      console.error("Payment status check error:", error);
      throw new Error("Erro ao verificar status do pagamento");
    }
  }),
  // Listar planos disponíveis
  getPlans: protectedProcedure.query(async () => {
    try {
      return {
        success: true,
        plans: [
          {
            id: "trial",
            name: "Trial Gratuito",
            description: "30 dias de acesso completo",
            price: 0,
            duration: 30,
            features: [
              "At\xE9 100 animais",
              "Pesagem por IA",
              "Relat\xF3rios b\xE1sicos",
              "Suporte por email"
            ]
          },
          {
            id: "basic",
            name: "Plano B\xE1sico",
            description: "Ideal para pequenas fazendas",
            price: 29.9,
            duration: 30,
            features: [
              "At\xE9 500 animais",
              "Pesagem por IA ilimitada",
              "Relat\xF3rios avan\xE7ados",
              "Assistente IA",
              "Suporte por chat"
            ]
          },
          {
            id: "professional",
            name: "Plano Profissional",
            description: "Para fazendas m\xE9dias",
            price: 79.9,
            duration: 30,
            features: [
              "At\xE9 2000 animais",
              "Pesagem por IA ilimitada",
              "Relat\xF3rios customizados",
              "Assistente IA avan\xE7ado",
              "An\xE1lises preditivas",
              "Suporte priorit\xE1rio"
            ]
          },
          {
            id: "enterprise",
            name: "Plano Enterprise",
            description: "Para grandes opera\xE7\xF5es",
            price: 199.9,
            duration: 30,
            features: [
              "Animais ilimitados",
              "Pesagem por IA ilimitada",
              "Relat\xF3rios customizados",
              "Assistente IA avan\xE7ado",
              "An\xE1lises preditivas",
              "Integra\xE7\xE3o com sistemas",
              "Suporte 24/7",
              "API access"
            ]
          }
        ]
      };
    } catch (error) {
      console.error("Get plans error:", error);
      throw new Error("Erro ao buscar planos");
    }
  }),
  // Processar webhook de pagamento (para integração real)
  processPaymentWebhook: protectedProcedure.input(
    z3.object({
      paymentId: z3.string(),
      status: z3.enum(["completed", "failed", "pending"]),
      amount: z3.number(),
      planId: z3.string()
    })
  ).mutation(async ({ input, ctx }) => {
    try {
      if (input.status === "completed") {
        console.log(`Payment completed for user ${ctx.user.id}, plan ${input.planId}`);
      }
      return {
        success: true,
        message: "Webhook processado com sucesso"
      };
    } catch (error) {
      console.error("Webhook processing error:", error);
      throw new Error("Erro ao processar webhook");
    }
  })
});

// server/routers/auth.ts
import { z as z4 } from "zod";
import { TRPCError as TRPCError3 } from "@trpc/server";
function validatePinSecurity(pin) {
  if (!/^\d{6}$/.test(pin)) return { valid: false, reason: "PIN deve ter 6 d\xEDgitos" };
  const digits = pin.split("").map(Number);
  if (digits.every((d) => d === digits[0])) {
    return { valid: false, reason: "PIN muito fraco: n\xE3o use d\xEDgitos iguais" };
  }
  const isAscSeq = digits.every((d, i) => i === 0 || d === digits[i - 1] + 1);
  if (isAscSeq) return { valid: false, reason: "PIN muito fraco: n\xE3o use sequ\xEAncias" };
  const knownWeak = ["123456", "654321", "112233", "000000", "999999"];
  if (knownWeak.includes(pin)) {
    return { valid: false, reason: "Este PIN \xE9 muito comum" };
  }
  return { valid: true };
}
var authRouter = router({
  // Get current user
  me: publicProcedure.query((opts) => opts.ctx.user),
  // Logout
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true };
  }),
  // Create PIN for new device
  createPin: publicProcedure.input(z4.object({
    deviceId: z4.string().regex(/^BV-[A-Z0-9]{8}$/),
    pin: z4.string().length(6)
  })).mutation(async ({ input }) => {
    const validation = validatePinSecurity(input.pin);
    if (!validation.valid) {
      throw new TRPCError3({
        code: "BAD_REQUEST",
        message: validation.reason
      });
    }
    return {
      success: true,
      deviceId: input.deviceId,
      message: "PIN criado com sucesso"
    };
  }),
  // Verify PIN for login
  verifyPin: publicProcedure.input(z4.object({
    deviceId: z4.string().regex(/^BV-[A-Z0-9]{8}$/),
    pin: z4.string().length(6)
  })).mutation(async ({ input }) => {
    const validation = validatePinSecurity(input.pin);
    if (!validation.valid) {
      throw new TRPCError3({
        code: "UNAUTHORIZED",
        message: "PIN incorreto"
      });
    }
    const session = await createSession({
      deviceId: input.deviceId,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1e3)
      // 8 hours
    });
    return {
      success: true,
      sessionToken: session.sessionToken,
      expiresAt: session.expiresAt
    };
  }),
  // Get device info
  getDevice: publicProcedure.input(z4.object({
    deviceId: z4.string()
  })).query(async ({ input }) => {
    const device = await getDeviceByDeviceId(input.deviceId);
    if (!device) {
      throw new TRPCError3({
        code: "NOT_FOUND",
        message: "Dispositivo n\xE3o encontrado"
      });
    }
    return {
      deviceId: device.deviceId,
      createdAt: device.createdAt,
      lastAccessed: device.lastAccessed
    };
  })
});

// server/routers/pinAuth.ts
import { TRPCError as TRPCError4 } from "@trpc/server";
import { z as z5 } from "zod";
import { eq as eq2 } from "drizzle-orm";
import crypto from "crypto";
function validatePinSecurity2(pin) {
  if (!/^\d{6}$/.test(pin)) return { valid: false, reason: "O PIN deve ter exatamente 6 d\xEDgitos num\xE9ricos." };
  const digits = pin.split("").map(Number);
  if (digits.every((d) => d === digits[0])) {
    return { valid: false, reason: "PIN muito fraco: n\xE3o use todos os d\xEDgitos iguais." };
  }
  const isAscSeq = digits.every((d, i) => i === 0 || d === digits[i - 1] + 1);
  if (isAscSeq) return { valid: false, reason: "PIN muito fraco: n\xE3o use sequ\xEAncias crescentes." };
  const isDescSeq = digits.every((d, i) => i === 0 || d === digits[i - 1] - 1);
  if (isDescSeq) return { valid: false, reason: "PIN muito fraco: n\xE3o use sequ\xEAncias decrescentes." };
  const knownWeak = ["123456", "654321", "112233", "332211", "445566", "665544", "000000", "999999"];
  if (knownWeak.includes(pin)) {
    return { valid: false, reason: "Este PIN \xE9 muito comum e n\xE3o \xE9 permitido." };
  }
  for (let i = 0; i < digits.length - 2; i++) {
    if (digits[i] === digits[i + 1] && digits[i + 1] === digits[i + 2]) {
      return { valid: false, reason: "PIN fraco: n\xE3o use 3 ou mais d\xEDgitos iguais seguidos." };
    }
  }
  const freq = {};
  for (const d of digits) freq[d] = (freq[d] || 0) + 1;
  if (Math.max(...Object.values(freq)) >= 4) {
    return { valid: false, reason: "PIN fraco: um mesmo d\xEDgito n\xE3o pode aparecer 4 ou mais vezes." };
  }
  return { valid: true };
}
function hashPin(pin) {
  return crypto.createHash("sha256").update(pin).digest("hex");
}
function generateDeviceId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "BV-";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
var pinAuthRouter = router({
  // Create PIN for new device
  createPin: publicProcedure.input(z5.object({
    pin: z5.string().length(6),
    confirmPin: z5.string().length(6),
    deviceId: z5.string().optional()
  })).mutation(async ({ input }) => {
    const validation = validatePinSecurity2(input.pin);
    if (!validation.valid) {
      throw new TRPCError4({ code: "BAD_REQUEST", message: validation.reason });
    }
    if (input.pin !== input.confirmPin) {
      throw new TRPCError4({ code: "BAD_REQUEST", message: "Os PINs n\xE3o correspondem." });
    }
    const db = await getDb();
    if (!db) throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Banco de dados indispon\xEDvel" });
    let deviceId = input.deviceId || generateDeviceId();
    try {
      await db.insert(devices).values({
        userId: 0,
        deviceId,
        userAgent: "web",
        ipAddress: "0.0.0.0"
      });
      const pinHash = hashPin(input.pin);
      await db.insert(pins).values({
        userId: 0,
        deviceId,
        pinHash,
        attempts: 0
      });
      const expirationDate = /* @__PURE__ */ new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      await db.insert(licenses).values({
        userId: 0,
        plan: "trial",
        expirationDate,
        status: "active",
        isTrial: true,
        isActive: true
      });
      return {
        success: true,
        deviceId,
        message: "PIN criado com sucesso! Voc\xEA tem 30 dias de trial."
      };
    } catch (error) {
      if (error.message?.includes("Duplicate entry")) {
        throw new TRPCError4({ code: "CONFLICT", message: "Dispositivo j\xE1 registrado." });
      }
      throw error;
    }
  }),
  // Verify PIN and create session
  verifyPin: publicProcedure.input(z5.object({
    pin: z5.string().length(6),
    deviceId: z5.string()
  })).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Banco de dados indispon\xEDvel" });
    try {
      const device = await db.query.devices.findFirst({
        where: eq2(devices.deviceId, input.deviceId)
      });
      if (!device) {
        throw new TRPCError4({ code: "NOT_FOUND", message: "Dispositivo n\xE3o encontrado." });
      }
      const pinRecord = await db.query.pins.findFirst({
        where: eq2(pins.deviceId, input.deviceId)
      });
      if (!pinRecord) {
        throw new TRPCError4({ code: "NOT_FOUND", message: "PIN n\xE3o configurado para este dispositivo." });
      }
      if (pinRecord.lockedUntil && new Date(pinRecord.lockedUntil) > /* @__PURE__ */ new Date()) {
        throw new TRPCError4({ code: "TOO_MANY_REQUESTS", message: "Dispositivo bloqueado. Tente novamente mais tarde." });
      }
      const pinHash = hashPin(input.pin);
      if (pinHash !== pinRecord.pinHash) {
        const newAttempts = (pinRecord.attempts || 0) + 1;
        const isLocked = newAttempts >= 5;
        await db.update(pins).set({
          attempts: newAttempts,
          lockedUntil: isLocked ? new Date(Date.now() + 15 * 60 * 1e3) : null
        }).where(eq2(pins.deviceId, input.deviceId));
        throw new TRPCError4({
          code: "UNAUTHORIZED",
          message: isLocked ? "Muitas tentativas. Dispositivo bloqueado por 15 minutos." : `PIN incorreto. Tentativas restantes: ${5 - newAttempts}`
        });
      }
      await db.update(pins).set({
        attempts: 0,
        lockedUntil: null
      }).where(eq2(pins.deviceId, input.deviceId));
      const license = await db.query.licenses.findFirst({
        where: eq2(licenses.userId, device.userId)
      });
      if (!license || license.status !== "active") {
        throw new TRPCError4({ code: "FORBIDDEN", message: "Licen\xE7a inativa ou expirada." });
      }
      return {
        success: true,
        deviceId: input.deviceId,
        message: "PIN verificado com sucesso!",
        sessionToken: crypto.randomBytes(32).toString("hex")
      };
    } catch (error) {
      if (error instanceof TRPCError4) throw error;
      throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao verificar PIN" });
    }
  }),
  // Get device status
  getDeviceStatus: publicProcedure.input(z5.object({ deviceId: z5.string() })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return { exists: false, status: "not_found" };
    try {
      const device = await db.query.devices.findFirst({
        where: eq2(devices.deviceId, input.deviceId)
      });
      if (!device) {
        return { exists: false, status: "not_found" };
      }
      const license = await db.query.licenses.findFirst({
        where: eq2(licenses.userId, device.userId)
      });
      const pinRecord = await db.query.pins.findFirst({
        where: eq2(pins.deviceId, input.deviceId)
      });
      return {
        exists: true,
        status: license?.status || "no_license",
        isLocked: pinRecord?.lockedUntil ? new Date(pinRecord.lockedUntil) > /* @__PURE__ */ new Date() : false,
        plan: license?.plan || "none"
      };
    } catch {
      return { exists: false, status: "error" };
    }
  }),
  // Admin: Block device
  blockDevice: protectedProcedure.input(z5.object({ deviceId: z5.string() })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Banco de dados indispon\xEDvel" });
    if (ctx.user.role !== "admin") {
      throw new TRPCError4({ code: "FORBIDDEN", message: "Apenas admins podem bloquear dispositivos." });
    }
    try {
      const device = await db.query.devices.findFirst({
        where: eq2(devices.deviceId, input.deviceId)
      });
      if (!device) {
        throw new TRPCError4({ code: "NOT_FOUND", message: "Dispositivo n\xE3o encontrado." });
      }
      await db.update(licenses).set({
        status: "cancelled"
      }).where(eq2(licenses.userId, device.userId));
      return { success: true, message: "Dispositivo bloqueado com sucesso." };
    } catch (error) {
      if (error instanceof TRPCError4) throw error;
      throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao bloquear dispositivo" });
    }
  }),
  // Admin: Unblock device
  unblockDevice: protectedProcedure.input(z5.object({ deviceId: z5.string() })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Banco de dados indispon\xEDvel" });
    if (ctx.user.role !== "admin") {
      throw new TRPCError4({ code: "FORBIDDEN", message: "Apenas admins podem desbloquear dispositivos." });
    }
    try {
      const device = await db.query.devices.findFirst({
        where: eq2(devices.deviceId, input.deviceId)
      });
      if (!device) {
        throw new TRPCError4({ code: "NOT_FOUND", message: "Dispositivo n\xE3o encontrado." });
      }
      await db.update(licenses).set({
        status: "active"
      }).where(eq2(licenses.userId, device.userId));
      return { success: true, message: "Dispositivo desbloqueado com sucesso." };
    } catch (error) {
      if (error instanceof TRPCError4) throw error;
      throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao desbloquear dispositivo" });
    }
  })
});

// server/routers/conversations.ts
import { z as z6 } from "zod";
import { TRPCError as TRPCError5 } from "@trpc/server";
var conversationsRouter = router({
  // Get all conversations for user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError5({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    return await getUserConversations(ctx.user.id);
  }),
  // Get conversation with messages
  getById: protectedProcedure.input(z6.object({ conversationId: z6.number() })).query(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError5({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    const conversation = await getConversationById(input.conversationId, ctx.user.id);
    if (!conversation) {
      throw new TRPCError5({
        code: "NOT_FOUND",
        message: "Conversa n\xE3o encontrada"
      });
    }
    const messages = await getConversationMessages(input.conversationId);
    return {
      ...conversation,
      messages
    };
  }),
  // Create new conversation
  create: protectedProcedure.input(z6.object({ title: z6.string().optional() })).mutation(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError5({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    await createConversation({
      userId: ctx.user.id,
      title: input.title
    });
    return {
      success: true,
      message: "Conversa criada com sucesso"
    };
  }),
  // Add message to conversation
  addMessage: protectedProcedure.input(z6.object({
    conversationId: z6.number(),
    role: z6.enum(["user", "assistant"]),
    content: z6.string()
  })).mutation(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError5({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    const conversation = await getConversationById(input.conversationId, ctx.user.id);
    if (!conversation) {
      throw new TRPCError5({
        code: "NOT_FOUND",
        message: "Conversa n\xE3o encontrada"
      });
    }
    await addConversationMessage({
      conversationId: input.conversationId,
      userId: ctx.user.id,
      role: input.role,
      content: input.content
    });
    return {
      success: true,
      message: "Mensagem adicionada com sucesso"
    };
  }),
  // Delete conversation
  delete: protectedProcedure.input(z6.object({ conversationId: z6.number() })).mutation(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError5({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    const conversation = await getConversationById(input.conversationId, ctx.user.id);
    if (!conversation) {
      throw new TRPCError5({
        code: "NOT_FOUND",
        message: "Conversa n\xE3o encontrada"
      });
    }
    await deleteConversation(input.conversationId, ctx.user.id);
    return {
      success: true,
      message: "Conversa deletada com sucesso"
    };
  })
});

// server/routers/herd.ts
import { z as z7 } from "zod";
import { TRPCError as TRPCError6 } from "@trpc/server";
var herdRouter = router({
  // Get all animals
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError6({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    return await getUserAnimals(ctx.user.id);
  }),
  // Get animal by ID
  getById: protectedProcedure.input(z7.object({ animalId: z7.number() })).query(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError6({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    const animal = await getAnimalById(input.animalId, ctx.user.id);
    if (!animal) {
      throw new TRPCError6({
        code: "NOT_FOUND",
        message: "Animal n\xE3o encontrado"
      });
    }
    const weights2 = await getAnimalWeights(input.animalId);
    const vaccines2 = await getAnimalVaccines(input.animalId);
    return {
      ...animal,
      weights: weights2,
      vaccines: vaccines2
    };
  }),
  // Search animals
  search: protectedProcedure.input(z7.object({ query: z7.string() })).query(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError6({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    return await searchAnimals(ctx.user.id, input.query);
  }),
  // Filter animals
  filter: protectedProcedure.input(z7.object({
    breed: z7.string().optional(),
    sex: z7.enum(["male", "female"]).optional(),
    healthStatus: z7.enum(["healthy", "sick", "treatment"]).optional(),
    vacinationStatus: z7.enum(["up_to_date", "pending", "overdue"]).optional()
  })).query(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError6({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    return await filterAnimals(ctx.user.id, input);
  }),
  // Get herd statistics
  getStats: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError6({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    return await getAnimalStats(ctx.user.id);
  }),
  // Create animal
  create: protectedProcedure.input(z7.object({
    name: z7.string(),
    breed: z7.string(),
    age: z7.number().optional(),
    sex: z7.enum(["male", "female"]).optional(),
    currentWeight: z7.number().optional()
  })).mutation(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError6({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    await createAnimal({
      userId: ctx.user.id,
      name: input.name,
      breed: input.breed,
      age: input.age,
      sex: input.sex,
      currentWeight: input.currentWeight
    });
    return {
      success: true,
      message: "Animal criado com sucesso"
    };
  }),
  // Add weight record
  addWeight: protectedProcedure.input(z7.object({
    animalId: z7.number(),
    weight: z7.number(),
    method: z7.enum(["manual", "ai_camera", "scale"]).optional()
  })).mutation(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError6({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    const animal = await getAnimalById(input.animalId, ctx.user.id);
    if (!animal) {
      throw new TRPCError6({
        code: "NOT_FOUND",
        message: "Animal n\xE3o encontrado"
      });
    }
    await addWeight({
      userId: ctx.user.id,
      animalId: input.animalId,
      weight: input.weight,
      method: input.method || "manual"
    });
    return {
      success: true,
      message: "Peso registrado com sucesso"
    };
  }),
  // Add vaccine record
  addVaccine: protectedProcedure.input(z7.object({
    animalId: z7.number(),
    vaccineName: z7.string(),
    vaccinationDate: z7.string(),
    nextDueDate: z7.string().optional()
  })).mutation(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError6({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    const animal = await getAnimalById(input.animalId, ctx.user.id);
    if (!animal) {
      throw new TRPCError6({
        code: "NOT_FOUND",
        message: "Animal n\xE3o encontrado"
      });
    }
    await addVaccine({
      userId: ctx.user.id,
      animalId: input.animalId,
      vaccineName: input.vaccineName,
      vaccinationDate: input.vaccinationDate,
      nextDueDate: input.nextDueDate
    });
    return {
      success: true,
      message: "Vacina\xE7\xE3o registrada com sucesso"
    };
  })
});

// server/routers/financial.ts
import { z as z8 } from "zod";
import { TRPCError as TRPCError7 } from "@trpc/server";
var financialRouter = router({
  // Get all financial records
  getRecords: protectedProcedure.input(z8.object({
    startDate: z8.string().optional(),
    endDate: z8.string().optional()
  })).query(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError7({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    const startDate = input.startDate ? new Date(input.startDate) : void 0;
    const endDate = input.endDate ? new Date(input.endDate) : void 0;
    return await getFinancialRecords(ctx.user.id, startDate, endDate);
  }),
  // Get financial summary
  getSummary: protectedProcedure.input(z8.object({
    startDate: z8.string().optional(),
    endDate: z8.string().optional()
  })).query(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError7({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    const startDate = input.startDate ? new Date(input.startDate) : void 0;
    const endDate = input.endDate ? new Date(input.endDate) : void 0;
    return await getFinancialSummary(ctx.user.id, startDate, endDate);
  }),
  // Add financial record
  addRecord: protectedProcedure.input(z8.object({
    type: z8.enum(["income", "expense"]),
    category: z8.string(),
    amount: z8.number().positive(),
    description: z8.string().optional(),
    date: z8.string()
  })).mutation(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError7({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    await addFinancialRecord({
      userId: ctx.user.id,
      type: input.type,
      category: input.category,
      amount: input.amount,
      description: input.description,
      date: new Date(input.date)
    });
    return {
      success: true,
      message: "Registro financeiro adicionado com sucesso"
    };
  }),
  // Delete financial record
  deleteRecord: protectedProcedure.input(z8.object({ recordId: z8.number() })).mutation(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError7({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    await deleteFinancialRecord(input.recordId, ctx.user.id);
    return {
      success: true,
      message: "Registro financeiro deletado com sucesso"
    };
  })
});

// server/routers/export.ts
import { z as z9 } from "zod";
import { TRPCError as TRPCError8 } from "@trpc/server";
function convertToCSV(data, headers) {
  const headerRow = headers.join(",");
  const dataRows = data.map((row) => {
    return headers.map((header) => {
      const value = row[header];
      if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || "";
    }).join(",");
  });
  return [headerRow, ...dataRows].join("\n");
}
var exportRouter = router({
  // Export animals to CSV
  exportAnimals: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError8({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    const animals2 = await getUserAnimals(ctx.user.id);
    if (animals2.length === 0) {
      return {
        success: false,
        message: "Nenhum animal para exportar"
      };
    }
    const headers = ["id", "name", "breed", "age", "sex", "currentWeight", "healthStatus", "vacinationStatus"];
    const csv = convertToCSV(animals2, headers);
    return {
      success: true,
      data: csv,
      filename: `animals_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`,
      mimeType: "text/csv"
    };
  }),
  // Export financial records to CSV
  exportFinancial: protectedProcedure.input(z9.object({
    startDate: z9.string().optional(),
    endDate: z9.string().optional()
  })).query(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError8({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    const startDate = input.startDate ? new Date(input.startDate) : void 0;
    const endDate = input.endDate ? new Date(input.endDate) : void 0;
    const records = await getFinancialRecords(ctx.user.id, startDate, endDate);
    if (records.length === 0) {
      return {
        success: false,
        message: "Nenhum registro financeiro para exportar"
      };
    }
    const headers = ["id", "type", "category", "amount", "description", "date"];
    const csv = convertToCSV(records, headers);
    return {
      success: true,
      data: csv,
      filename: `financial_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`,
      mimeType: "text/csv"
    };
  }),
  // Export herd statistics to CSV
  exportHerdStats: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError8({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    const stats = await getAnimalStats(ctx.user.id);
    if (!stats) {
      return {
        success: false,
        message: "Nenhuma estat\xEDstica para exportar"
      };
    }
    const data = [stats];
    const headers = ["totalAnimals", "averageWeight", "healthyCount", "sickCount", "vaccinatedCount"];
    const csv = convertToCSV(data, headers);
    return {
      success: true,
      data: csv,
      filename: `herd_stats_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`,
      mimeType: "text/csv"
    };
  }),
  // Export financial summary to CSV
  exportFinancialSummary: protectedProcedure.input(z9.object({
    startDate: z9.string().optional(),
    endDate: z9.string().optional()
  })).query(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError8({
        code: "UNAUTHORIZED",
        message: "Usu\xE1rio n\xE3o autenticado"
      });
    }
    const startDate = input.startDate ? new Date(input.startDate) : void 0;
    const endDate = input.endDate ? new Date(input.endDate) : void 0;
    const summary = await getFinancialSummary(ctx.user.id, startDate, endDate);
    if (!summary) {
      return {
        success: false,
        message: "Nenhum resumo financeiro para exportar"
      };
    }
    const flatData = {
      totalIncome: summary.totalIncome,
      totalExpenses: summary.totalExpenses,
      profit: summary.profit,
      profitMargin: summary.profitMargin,
      recordCount: summary.recordCount
    };
    const data = [flatData];
    const headers = Object.keys(flatData);
    const csv = convertToCSV(data, headers);
    return {
      success: true,
      data: csv,
      filename: `financial_summary_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`,
      mimeType: "text/csv"
    };
  })
});

// server/routers.ts
var appRouter = router({
  auth: authRouter,
  pinAuth: pinAuthRouter,
  system: systemRouter,
  aiAssistant: aiAssistantRouter,
  payments: paymentsRouter,
  conversations: conversationsRouter,
  herd: herdRouter,
  financial: financialRouter,
  export: exportRouter
  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs2 from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var PROJECT_ROOT = import.meta.dirname;
var LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
var MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
var TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}
function trimLogFile(logPath, maxSize) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }
    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines = [];
    let keptBytes = 0;
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}
`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }
    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
  }
}
function writeToLogFile(source, entries) {
  if (entries.length === 0) return;
  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);
  const lines = entries.map((entry) => {
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });
  fs.appendFileSync(logPath, `${lines.join("\n")}
`, "utf-8");
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}
function vitePluginManusDebugCollector() {
  return {
    name: "manus-debug-collector",
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true
            },
            injectTo: "head"
          }
        ]
      };
    },
    configureServer(server) {
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }
        const handlePayload = (payload) => {
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };
        const reqBody = req.body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    }
  };
}
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
