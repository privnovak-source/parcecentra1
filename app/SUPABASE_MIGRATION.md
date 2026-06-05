# Supabase Migration Guide

## Overview
You're migrating your menu and order system from MySQL + Drizzle ORM to Supabase with direct client queries.

## Steps to Complete Migration

### 1. Create a Supabase Project
- Go to [supabase.com](https://supabase.com) and create an account
- Click "New Project"
- Choose a name and region
- Note your **Project URL** and **Anon Key** (for frontend)

### 2. Set Up Environment Variables
Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
# Frontend access (exposed publicly)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-side only (keep secret)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Create Tables in Supabase
- Go to your Supabase Dashboard
- Click on "SQL Editor" in the left sidebar
- Click "New Query"
- Copy all content from `db/supabase-schema.sql`
- Run the SQL

This creates:
- `menu_items` table
- `orders` table
- `order_items` table
- Indexes for performance

### 4. Enable Row Level Security (Optional but Recommended)
In Supabase, go to **Authentication > Policies**:

For public read access to menu_items:
```sql
CREATE POLICY "Anyone can read menu items"
ON menu_items
FOR SELECT
TO anon
USING (true);
```

### 5. Add Initial Menu Data
In Supabase SQL Editor, run:
```sql
INSERT INTO menu_items (name, description, price, category, subcategory, sort_order) VALUES
  ('Pizza Margherita', 'Classic tomato and mozzarella', 8.99, 'Pizze', 'Klasične', 1),
  ('Burger', 'Delicious beef burger', 9.99, 'Burgers', 'Klasični', 1),
  -- Add more items...
;
```

### 6. Update Frontend for Auth (Optional)
Create a new Supabase client for the frontend:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

Use it in your auth context:
```typescript
// Sign up
await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Sign in
await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

## Files Changed

- ✅ `api/lib/supabase.ts` - New server-side Supabase client
- ✅ `api/context.ts` - Added Supabase client to context
- ✅ `api/routers/menu.ts` - Updated to use Supabase queries
- ✅ `api/routers/order.ts` - Updated to use Supabase queries
- ✅ `db/supabase-schema.sql` - New SQL schema for Supabase
- ✅ `.env.local.example` - Environment variables template

## Testing

1. Start your dev server: `npm run dev`
2. Check that menu loads correctly
3. Try creating an order
4. Monitor Supabase dashboard for data

## Troubleshooting

**"Missing VITE_SUPABASE_URL"** error:
- Make sure you created `.env.local` (not `.env.local.example`)
- Restart your dev server after adding environment variables

**"Failed to read auth header"** error:
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- The service role key is different from the anon key

**Queries returning empty results:
- Verify tables exist in Supabase SQL Editor
- Check that data was inserted correctly
- Look at Supabase dashboard "Editor" tab to inspect table data

## Next Steps

1. ✅ Frontend Supabase auth integration (optional)
2. Admin panel Supabase auth integration
3. Remove unused Drizzle imports from other routers
4. Consider adding Supabase real-time listeners for live updates
