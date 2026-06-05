import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "../../");

let supabaseClient: ReturnType<typeof createClient> | null = null;
let credentialsLoaded = false;

export function getSupabase() {
  // Load environment variables on first call only
  if (!credentialsLoaded) {
    dotenv.config({ path: path.join(appRoot, ".env.local") });
    dotenv.config({ path: path.join(appRoot, ".env") });
    credentialsLoaded = true;
  }

  if (supabaseClient) return supabaseClient;
  
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    console.error("❌ Supabase credentials not found!");
    console.error("  VITE_SUPABASE_URL:", url ? "✓" : "✗");
    console.error("  SUPABASE_SERVICE_ROLE_KEY:", key ? "✓" : "✗");
    console.error("  Available env vars:", Object.keys(process.env).filter(k => k.includes("SUPABASE")));
    // Return a proxy that will throw when methods are called
    return new Proxy({} as any, {
      get: () => {
        throw new Error(
          "Supabase credentials missing. Ensure .env.local has VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
        );
      },
    });
  }
  
  console.log("✓ Supabase client initialized");
  supabaseClient = createClient(url, key);
  return supabaseClient;
}

export const supabase = new Proxy({} as any, {
  get: (target, prop) => {
    const client = getSupabase();
    return (client as any)[prop];
  },
});
