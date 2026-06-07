import { eq, and, gte, lte, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, accounts, categories, transactions, budgets, savingsGoals } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

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

// ============ ACCOUNTS ============

export async function getUserAccounts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(accounts)
    .where(and(eq(accounts.userId, userId), eq(accounts.isActive, true)))
    .orderBy(accounts.createdAt);
}

export async function getAccountById(accountId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(accounts)
    .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAccount(userId: number, data: { name: string; type: string; balance?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(accounts).values({
    userId,
    name: data.name,
    type: data.type as any,
    balance: data.balance || "0",
  });
  
  return result;
}

// ============ CATEGORIES ============

export async function getUserCategories(userId: number, type?: "income" | "expense") {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(categories.userId, userId), eq(categories.isActive, true)];
  if (type) conditions.push(eq(categories.type, type));
  
  return db.select().from(categories)
    .where(and(...conditions))
    .orderBy(categories.name);
}

export async function createCategory(userId: number, data: { name: string; type: "income" | "expense"; icon: string; color: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(categories).values({
    userId,
    name: data.name,
    type: data.type,
    icon: data.icon,
    color: data.color,
  });
  
  return result;
}

// ============ TRANSACTIONS ============

export async function getUserTransactions(userId: number, filters?: { accountId?: number; categoryId?: number; startDate?: Date; endDate?: Date }) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(transactions.userId, userId)];
  
  if (filters?.accountId) conditions.push(eq(transactions.accountId, filters.accountId));
  if (filters?.categoryId) conditions.push(eq(transactions.categoryId, filters.categoryId));
  if (filters?.startDate) conditions.push(gte(transactions.date, filters.startDate));
  if (filters?.endDate) conditions.push(lte(transactions.date, filters.endDate));
  
  return db.select().from(transactions)
    .where(and(...conditions))
    .orderBy(desc(transactions.date));
}

export async function createTransaction(userId: number, data: {
  accountId: number;
  categoryId: number;
  type: "income" | "expense";
  description: string;
  amount: string;
  date: Date;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(transactions).values({
    userId,
    accountId: data.accountId,
    categoryId: data.categoryId,
    type: data.type,
    description: data.description,
    amount: data.amount,
    date: data.date,
    notes: data.notes,
  });
  
  return result;
}

// ============ BUDGETS ============

export async function getUserBudgets(userId: number, month?: string) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(budgets.userId, userId)];
  if (month) conditions.push(eq(budgets.month, month));
  
  return db.select().from(budgets)
    .where(and(...conditions))
    .orderBy(budgets.month);
}

export async function createBudget(userId: number, data: { categoryId: number; month: string; limit: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(budgets).values({
    userId,
    categoryId: data.categoryId,
    month: data.month,
    limit: data.limit,
  });
  
  return result;
}

// ============ SAVINGS GOALS ============

export async function getUserSavingsGoals(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(savingsGoals)
    .where(and(eq(savingsGoals.userId, userId), eq(savingsGoals.isActive, true)))
    .orderBy(savingsGoals.createdAt);
}

export async function createSavingsGoal(userId: number, data: {
  name: string;
  targetAmount: string;
  deadline?: Date;
  icon: string;
  color: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(savingsGoals).values({
    userId,
    name: data.name,
    targetAmount: data.targetAmount,
    deadline: data.deadline,
    icon: data.icon,
    color: data.color,
  });
  
  return result;
}
