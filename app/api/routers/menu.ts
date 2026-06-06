import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";

// Map Supabase category names to frontend category names
const categoryMapping: Record<string, string> = {
  "PIZZA 32CM": "PIZZA_32CM",
  "PIZZA 50CM": "PIZZA_50CM",
  "SLATKA PIZZA 32CM": "SLATKA_PIZZA_32CM",
  "SLATKA PIZZA 50CM": "SLATKA_PIZZA_50CM",
  "PALAČINKA": "PALAČINKA",
  "PALA?INKA": "PALAČINKA",
  "SOMUN": "SOMUN",
  "SOMUNI": "SOMUN",
  "PIĆE": "PIĆE",
  "PI?E": "PIĆE",
  "POHOVANO": "POHOVANO",
  "Pohovano razno": "POHOVANO",
  "SALATA": "SALATA",
  "OBROK SALATE": "SALATA",
  "POMFRIT": "POMFRIT",
  "MINI_PIZZA": "MINI_PIZZA",
  "MINI PIZZE PUNJENE KORICE": "MINI_PIZZA",
  "DORUČAK": "DORUČAK",
  "DORUCAK": "DORUČAK",
  "PIZZA PARCE": "PIZZA_PARCE",
};

function mapCategory(category: string): string {
  return categoryMapping[category] || category;
}

export const menuRouter = createRouter({
  getAll: publicQuery.query(async ({ ctx }) => {
  console.log("🚨 MENU ROUTER VERSION 123 🚨");

  const { count, error } = await ctx.supabase
    .from("menu_items")
    .select("*", { count: "exact", head: true });

  console.log("COUNT =", count);
  console.log("COUNT ERROR =", error);
    try {
      console.log("📋 Fetching all menu items from Supabase...");
      const { data, error } = await ctx.supabase
        .from("menu_items")
        .select("*");

      if (error) {
        console.error("❌ Supabase error:", error);
        throw error;
      }
      console.log("✓ Loaded", data?.length, "menu items");
      console.log("📋 Sample item:", data?.[0]);
      
      // Transform data to match frontend expectations
      const transformedData = data?.map((item: any, index: number) => ({
        id: item.id || index,
        name: item.Name || item.name,
        description: item.Description || item.description,
        price: parseFloat(String(item.Price || item.price || "0").replace(/[^\d.]/g, "")),
        category: mapCategory(item.Category || item.category),
        subcategory: item.subcategory,
        image_url: item.Url || item.URL2 || item.image_url,
        is_popular: item.is_popular,
        sort_order: item.sort_order,
        created_at: item.created_at,
      })) || [];
      
      console.log("📋 Transformed sample:", transformedData[0]);
      return transformedData;
    } catch (err) {
      console.error("Error in getAll:", err);
      throw err;
    }
  }),

  getByCategory: publicQuery
    .input(z.object({ category: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        console.log("📋 Fetching menu items for category:", input.category);
        const { data, error } = await ctx.supabase
          .from("menu_items")
          .select("*")
          .eq("Category", input.category);

        if (error) {
          console.error("❌ Supabase error:", error);
          throw error;
        }
        console.log("✓ Loaded", data?.length, "items for", input.category);
        
        // Transform data to match frontend expectations
        const transformedData = data?.map((item: any, index: number) => ({
          id: item.id || index,
          name: item.Name || item.name,
          description: item.Description || item.description,
          price: parseFloat(String(item.Price || item.price || "0").replace(/[^\d.]/g, "")),
          category: mapCategory(item.Category || item.category),
          subcategory: item.subcategory,
          image_url: item.Url || item.URL2 || item.image_url,
          is_popular: item.is_popular,
          sort_order: item.sort_order,
          created_at: item.created_at,
        })) || [];
        
        return transformedData;
      } catch (err) {
        console.error("Error in getByCategory:", err);
        throw err;
      }
    }),

  getPopular: publicQuery.query(async ({ ctx }) => {
    try {
      console.log("📋 Fetching popular menu items...");
      const { data, error } = await ctx.supabase
  .from("menu_items")
  .select("*");

console.log("RAW ERROR =", error);
console.log("RAW DATA LENGTH =", data?.length);
console.log("RAW DATA SAMPLE =", data?.[0]);

      if (error) {
        console.error("❌ Supabase error:", error);
        throw error;
      }
      console.log("✓ Loaded", data?.length, "popular items");
      
      // Transform data to match frontend expectations
      const transformedData = data?.map((item: any, index: number) => ({
        id: item.id || index,
        name: item.Name || item.name,
        description: item.Description || item.description,
        price: parseFloat(String(item.Price || item.price || "0").replace(/[^\d.]/g, "")),
        category: mapCategory(item.Category || item.category),
        subcategory: item.subcategory,
        image_url: item.Url || item.URL2 || item.image_url,
        is_popular: item.is_popular,
        sort_order: item.sort_order,
        created_at: item.created_at,
      })) || [];
      
      return transformedData;
    } catch (err) {
      console.error("Error in getPopular:", err);
      throw err;
    }
  }),

  getCategories: publicQuery.query(async ({ ctx }) => {
    try {
      console.log("📋 Fetching categories...");
      const { data, error } = await ctx.supabase
        .from("menu_items")
        .select("Category")
        .order("Category");

      if (error) {
        console.error("❌ Supabase error:", error);
        throw error;
      }
      const categories = data?.map((item: { Category: string }) => item.Category) ?? [];
      const unique = [...new Set(categories)] as string[];
      const mappedCategories = unique.map((cat: string) => mapCategory(cat));
      console.log("✓ Loaded", unique.length, "categories:", unique);
      console.log("✓ Mapped categories:", mappedCategories);
      return mappedCategories;
    } catch (err) {
      console.error("Error in getCategories:", err);
      throw err;
    }
  }),
});
