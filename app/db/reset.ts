import { drizzle } from "drizzle-orm/mysql2";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const db = drizzle(DATABASE_URL, { mode: "planetscale" });

async function resetOrders() {
  console.log("Resetting shift orders...");
  await db.execute("TRUNCATE TABLE order_items;");
  await db.execute("TRUNCATE TABLE orders;");
  console.log("Orders reset complete.");
}

resetOrders().catch((error) => {
  console.error(error);
  process.exit(1);
});