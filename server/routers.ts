import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ ACCOUNTS ============
  accounts: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserAccounts(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1, "Nome da conta é obrigatório"),
        type: z.enum(["wallet", "checking", "savings", "credit_card", "other"]),
        balance: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createAccount(ctx.user.id, input);
      }),
  }),

  // ============ CATEGORIES ============
  categories: router({
    list: protectedProcedure
      .input(z.object({
        type: z.enum(["income", "expense"]).optional(),
      }))
      .query(async ({ ctx, input }) => {
        return db.getUserCategories(ctx.user.id, input.type);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1, "Nome da categoria é obrigatório"),
        type: z.enum(["income", "expense"]),
        icon: z.string().default("tag"),
        color: z.string().regex(/^#[0-9A-F]{6}$/i, "Cor inválida"),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createCategory(ctx.user.id, input);
      }),
  }),

  // ============ TRANSACTIONS ============
  transactions: router({
    list: protectedProcedure
      .input(z.object({
        accountId: z.number().optional(),
        categoryId: z.number().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }))
      .query(async ({ ctx, input }) => {
        return db.getUserTransactions(ctx.user.id, input);
      }),

    create: protectedProcedure
      .input(z.object({
        accountId: z.number().min(1, "Selecione uma conta"),
        categoryId: z.number().min(1, "Selecione uma categoria"),
        type: z.enum(["income", "expense"]),
        description: z.string().min(1, "Descrição é obrigatória"),
        amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Valor inválido"),
        date: z.date(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createTransaction(ctx.user.id, input);
      }),
  }),

  // ============ BUDGETS ============
  budgets: router({
    list: protectedProcedure
      .input(z.object({
        month: z.string().optional(),
      }))
      .query(async ({ ctx, input }) => {
        return db.getUserBudgets(ctx.user.id, input.month);
      }),

    create: protectedProcedure
      .input(z.object({
        categoryId: z.number().min(1, "Selecione uma categoria"),
        month: z.string().regex(/^\d{4}-\d{2}$/, "Formato de mês inválido (YYYY-MM)"),
        limit: z.string().regex(/^\d+(\.\d{1,2})?$/, "Valor inválido"),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createBudget(ctx.user.id, input);
      }),
  }),

  // ============ SAVINGS GOALS ============
  savingsGoals: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserSavingsGoals(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1, "Nome da meta é obrigatório"),
        targetAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Valor inválido"),
        deadline: z.date().optional(),
        icon: z.string().default("target"),
        color: z.string().regex(/^#[0-9A-F]{6}$/i, "Cor inválida"),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createSavingsGoal(ctx.user.id, input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
