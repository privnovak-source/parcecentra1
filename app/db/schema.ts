import {
  mysqlTable,
  serial,
  varchar,
  text,
  decimal,
  boolean,
  int,
  timestamp,
  mysqlEnum,
  bigint,
} from "drizzle-orm/mysql-core";

// Menu items table
export const menuItems = mysqlTable("menu_items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  subcategory: varchar("subcategory", { length: 100 }),
  imageUrl: varchar("image_url", { length: 500 }),
  isPopular: boolean("is_popular").default(false),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders table
export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  customerAddress: text("customer_address").notNull(),
  notes: text("notes"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", [
    "pending",
    "preparing",
    "delivering",
    "delivered",
    "cancelled",
  ]).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Order items table
export const orderItems = mysqlTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: bigint("order_id", { mode: "number", unsigned: true }).notNull(),
  menuItemId: bigint("menu_item_id", { mode: "number", unsigned: true }),
  itemName: varchar("item_name", { length: 255 }).notNull(),
  itemPrice: decimal("item_price", { precision: 10, scale: 2 }).notNull(),
  quantity: int("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});
