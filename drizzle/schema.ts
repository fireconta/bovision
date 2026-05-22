import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, longtext, json, date, uniqueIndex } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Device tracking for PIN authentication
export const devices = mysqlTable("devices", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceId: varchar("deviceId", { length: 32 }).notNull(), // BV-XXXXXXXX format
  userAgent: text("userAgent"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  operatingSystem: varchar("operatingSystem", { length: 64 }),
  browser: varchar("browser", { length: 64 }),
  lastAccessed: timestamp("lastAccessed").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userDeviceUnique: uniqueIndex("user_device_unique").on(table.userId, table.deviceId),
}));

export type Device = typeof devices.$inferSelect;
export type InsertDevice = typeof devices.$inferInsert;

// PIN storage for authentication
export const pins = mysqlTable("pins", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceId: varchar("deviceId", { length: 32 }).notNull(),
  pinHash: varchar("pinHash", { length: 255 }).notNull(), // Hashed PIN
  attempts: int("attempts").default(0),
  lockedUntil: timestamp("lockedUntil"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Pin = typeof pins.$inferSelect;
export type InsertPin = typeof pins.$inferInsert;

// License management
export const licenses = mysqlTable("licenses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  plan: mysqlEnum("plan", ["trial", "monthly", "annual"]).default("trial").notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  expirationDate: timestamp("expirationDate").notNull(),
  status: mysqlEnum("status", ["active", "expired", "cancelled"]).default("active").notNull(),
  isTrial: boolean("isTrial").default(true),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type License = typeof licenses.$inferSelect;
export type InsertLicense = typeof licenses.$inferInsert;

// Animals management
export const animals = mysqlTable("animals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 128 }),
  breed: varchar("breed", { length: 128 }),
  age: int("age"), // in months
  sex: mysqlEnum("sex", ["male", "female"]),
  currentWeight: decimal("currentWeight", { precision: 8, scale: 2 }),
  photoUrl: varchar("photoUrl", { length: 512 }),
  photoKey: varchar("photoKey", { length: 255 }), // S3 key
  vacinationStatus: mysqlEnum("vacinationStatus", ["up_to_date", "pending", "overdue"]).default("pending"),
  healthStatus: mysqlEnum("healthStatus", ["healthy", "sick", "treatment"]).default("healthy"),
  notes: longtext("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Animal = typeof animals.$inferSelect;
export type InsertAnimal = typeof animals.$inferInsert;

// Weight tracking
export const weights = mysqlTable("weights", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  animalId: int("animalId").notNull(),
  weight: decimal("weight", { precision: 8, scale: 2 }).notNull(),
  estimatedPrecision: decimal("estimatedPrecision", { precision: 5, scale: 2 }), // percentage
  method: mysqlEnum("method", ["manual", "ai_camera", "scale"]).default("manual"),
  photoUrl: varchar("photoUrl", { length: 512 }), // Photo from AI camera
  photoKey: varchar("photoKey", { length: 255 }), // S3 key
  aiReport: longtext("aiReport"), // JSON report from AI
  dailyGain: decimal("dailyGain", { precision: 8, scale: 2 }), // calculated
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Weight = typeof weights.$inferSelect;
export type InsertWeight = typeof weights.$inferInsert;

// Vaccination tracking
export const vaccines = mysqlTable("vaccines", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  animalId: int("animalId").notNull(),
  vaccineName: varchar("vaccineName", { length: 128 }).notNull(),
  vaccinationDate: date("vaccinationDate").notNull(),
  nextDueDate: date("nextDueDate"),
  veterinarian: varchar("veterinarian", { length: 128 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Vaccine = typeof vaccines.$inferSelect;
export type InsertVaccine = typeof vaccines.$inferInsert;

// Financial tracking
export const financial = mysqlTable("financial", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["income", "expense"]).notNull(),
  category: varchar("category", { length: 128 }).notNull(), // e.g., "feed", "veterinary", "sales"
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  date: date("date").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Financial = typeof financial.$inferSelect;
export type InsertFinancial = typeof financial.$inferInsert;

// Reports storage
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  reportType: varchar("reportType", { length: 64 }).notNull(), // "weight", "vaccination", "financial", "productivity"
  title: varchar("title", { length: 256 }).notNull(),
  content: longtext("content"), // JSON content
  fileUrl: varchar("fileUrl", { length: 512 }),
  fileKey: varchar("fileKey", { length: 255 }), // S3 key
  format: mysqlEnum("format", ["pdf", "excel", "csv"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

// Analytics and predictions
export const analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  metricType: varchar("metricType", { length: 64 }).notNull(), // "weight_gain", "disease_risk", "cost_prediction", "productivity"
  value: decimal("value", { precision: 12, scale: 2 }),
  prediction: longtext("prediction"), // JSON prediction data
  confidence: decimal("confidence", { precision: 5, scale: 2 }), // percentage
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;

// Payment tracking
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  method: mysqlEnum("method", ["pix", "boleto"]).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "cancelled"]).default("pending"),
  plan: mysqlEnum("plan", ["monthly", "annual"]).notNull(),
  transactionId: varchar("transactionId", { length: 128 }),
  metadata: longtext("metadata"), // JSON metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// Session management
export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceId: varchar("deviceId", { length: 32 }).notNull(),
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

// Notifications
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 64 }).notNull(), // "vaccination", "license", "ai_complete", "report", "admin"
  title: varchar("title", { length: 256 }).notNull(),
  content: text("content"),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// Logs for security and debugging
export const logs = mysqlTable("logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  deviceId: varchar("deviceId", { length: 32 }),
  action: varchar("action", { length: 128 }).notNull(),
  details: longtext("details"), // JSON details
  ipAddress: varchar("ipAddress", { length: 45 }),
  status: mysqlEnum("status", ["success", "failed", "warning"]).default("success"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Log = typeof logs.$inferSelect;
export type InsertLog = typeof logs.$inferInsert;

// Admin logs
export const adminLogs = mysqlTable("admin_logs", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
  targetUserId: int("targetUserId"),
  action: varchar("action", { length: 128 }).notNull(),
  details: longtext("details"), // JSON details
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdminLog = typeof adminLogs.$inferSelect;
export type InsertAdminLog = typeof adminLogs.$inferInsert;


// AI Conversations
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 256 }),
  summary: text("summary"),
  messageCount: int("messageCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

// Conversation Messages
export const conversationMessages = mysqlTable("conversation_messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: longtext("content").notNull(),
  metadata: longtext("metadata"), // JSON metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ConversationMessage = typeof conversationMessages.$inferSelect;
export type InsertConversationMessage = typeof conversationMessages.$inferInsert;
