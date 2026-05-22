import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { aiAssistantRouter } from "./routers/aiAssistant";
import { paymentsRouter } from "./routers/payments";
import { authRouter } from "./routers/auth";
import { pinAuthRouter } from "./routers/pinAuth";
import { conversationsRouter } from "./routers/conversations";
import { herdRouter } from "./routers/herd";
import { financialRouter } from "./routers/financial";
import { exportRouter } from "./routers/export";

export const appRouter = router({
  auth: authRouter,
  pinAuth: pinAuthRouter,
  system: systemRouter,
  aiAssistant: aiAssistantRouter,
  payments: paymentsRouter,
  conversations: conversationsRouter,
  herd: herdRouter,
  financial: financialRouter,
  export: exportRouter,

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
