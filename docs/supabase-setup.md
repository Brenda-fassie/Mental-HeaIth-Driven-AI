# Supabase Setup

This app uses Supabase for authentication, session refresh, and conversation persistence.

## 1. Create a Supabase project

1. Create a Supabase project in the dashboard.
2. Copy the project URL and publishable key.
3. Add them to [.env.local](../.env.local):

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

## 2. Enable email auth

1. Open Authentication in Supabase.
2. Enable the Email provider.
3. Add these redirect URLs:
   - `http://localhost:3000`
   - `http://localhost:3000/auth/callback`

## 3. Run the SQL migration

Open the SQL editor and run:

- [supabase/migrations/20260414_fix_conversation_policies.sql](../supabase/migrations/20260414_fix_conversation_policies.sql)

That migration:
- adds the `messages.role` column
- backfills older messages
- replaces the recursive membership policy
- allows conversation creators to read and update their own conversations

## 4. How the app uses Supabase

The app uses:
- [middleware.ts](../middleware.ts)
- [utils/supabase/server.ts](../utils/supabase/server.ts)
- [utils/supabase/client.ts](../utils/supabase/client.ts)

These keep the auth session refreshed and available in server components and client components.

## 5. Conversation history and titles

Conversation history is stored in:
- `conversations`
- `conversation_members`
- `messages`

The app auto-generates short conversation titles from the chat content so the history sidebar shows readable names instead of repeated `New chat` labels.