import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getDb } from "./queries/connection";
import { getSupabase } from "./lib/supabase";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  db: ReturnType<typeof getDb>;
  supabase: ReturnType<typeof getSupabase>;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  return {
    req: opts.req,
    resHeaders: opts.resHeaders,
    db: getDb(),
    supabase: getSupabase(),
  };
}
