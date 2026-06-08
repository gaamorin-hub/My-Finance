import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createAuthContext(userId: number = 1): TrpcContext {
  return {
    user: {
      id: userId,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("transactions", () => {
  describe("list", () => {
    it("should list transactions for the user", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const transactions = await caller.transactions.list({});

      expect(Array.isArray(transactions)).toBe(true);
    });

    it("should return array for different user", async () => {
      const ctx = createAuthContext(999);
      const caller = appRouter.createCaller(ctx);

      const transactions = await caller.transactions.list({});

      expect(Array.isArray(transactions)).toBe(true);
    });
  });
});
