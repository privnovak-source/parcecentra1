import { createRouter, publicQuery } from "./middleware";
import { menuRouter } from "./routers/menu";
import { orderRouter } from "./routers/order";
import { adminRouter } from "./routers/admin";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  menu: menuRouter,
  order: orderRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
