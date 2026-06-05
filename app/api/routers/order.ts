import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";

export const orderRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        customerName: z.string().min(1, "Ime je obavezno"),
        customerPhone: z.string().min(6, "Telefon je obavezan"),
        customerAddress: z.string().min(1, "Adresa je obavezna"),
        notes: z.string().optional(),
        items: z
          .array(
            z.object({
              menuItemId: z.number(),
              name: z.string(),
              price: z.number(),
              quantity: z.number().min(1),
            }),
          )
          .min(1, "Korpa je prazna"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("📋 Creating order:", input);
      const totalAmount = input.items.reduce(
        (sum: number, item: { price: number; quantity: number }) =>
          sum + item.price * item.quantity,
        0,
      );
      console.log("💰 Total amount:", totalAmount);

      // Insert order
      const { data: orderData, error: orderError } = await ctx.supabase
        .from("orders")
        .insert({
          customer_name: input.customerName,
          customer_phone: input.customerPhone,
          customer_address: input.customerAddress,
          notes: input.notes || null,
          total_amount: totalAmount.toFixed(2),
          status: "pending",
        })
        .select();

      if (orderError) {
        console.error("❌ Order creation error:", orderError);
        throw orderError;
      }
      const orderId = orderData?.[0]?.id;
      console.log("✓ Order created with ID:", orderId);

      // Insert order items
      const { error: itemsError } = await ctx.supabase
        .from("order_items")
        .insert(
          input.items.map((item: { menuItemId: number; name: string; price: number; quantity: number }) => ({
            order_id: orderId,
            menu_item_id: item.menuItemId,
            item_name: item.name,
            item_price: item.price.toFixed(2),
            quantity: item.quantity,
          })),
        );

      if (itemsError) throw itemsError;

      return { id: orderId };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { data: order, error: orderError } = await ctx.supabase
        .from("orders")
        .select("*")
        .eq("id", input.id)
        .single();

      if (orderError) {
        if (orderError.code === "PGRST116") return null; // Not found
        throw orderError;
      }

      const { data: items, error: itemsError } = await ctx.supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id);

      if (itemsError) throw itemsError;

      return { ...order, items };
    }),

  getAll: publicQuery.query(async ({ ctx }) => {
    console.log("📋 Fetching all orders from Supabase...");
    const { data: allOrders, error: ordersError } = await ctx.supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("❌ Orders error:", ordersError);
      throw ordersError;
    }
    console.log("✓ Loaded", allOrders?.length, "orders");
    console.log("📋 Sample order:", allOrders?.[0]);

    const ordersWithItems = await Promise.all(
      (allOrders || []).map(async (order: any) => {
        const { data: items, error: itemsError } = await ctx.supabase
          .from("order_items")
          .select("*")
          .eq("order_id", order.id);

        if (itemsError) {
          console.error("❌ Order items error:", itemsError);
          throw itemsError;
        }
        console.log("📋 Sample order items:", items?.[0]);

        // Transform order data to match frontend expectations
        const transformedOrder = {
          id: order.id,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          customerAddress: order.customer_address,
          notes: order.notes,
          totalAmount: order.total_amount,
          status: order.status,
          created_at: order.created_at,
          updated_at: order.updated_at,
          items: items?.map((item: any) => ({
            id: item.id,
            orderId: item.order_id,
            menuItemId: item.menu_item_id,
            itemName: item.item_name,
            itemPrice: item.item_price,
            quantity: item.quantity,
            created_at: item.created_at,
          })) || [],
        };

        return transformedOrder;
      }),
    );

    return ordersWithItems;
  }),

  updateStatus: publicQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum([
          "pending",
          "preparing",
          "delivering",
          "delivered",
          "cancelled",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from("orders")
        .update({ status: input.status })
        .eq("id", input.id);

      if (error) throw error;

      return { success: true };
    }),
});
