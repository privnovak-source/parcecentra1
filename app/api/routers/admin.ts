import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";

const ADMIN_PASSWORD = "ParceCentra123";

export const adminRouter = createRouter({
  login: publicQuery
    .input(z.object({ password: z.string() }))
    .mutation(async ({ input }) => {
      const isValid = input.password === ADMIN_PASSWORD;
      return { success: isValid };
    }),
});
