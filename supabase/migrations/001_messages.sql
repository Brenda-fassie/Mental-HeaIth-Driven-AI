-- Chat message history
CREATE TABLE IF NOT EXISTS messages (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text        NOT NULL CHECK (role IN ('user', 'assistant')),
  content     text        NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL
);

-- Index for fast per-user history lookups
CREATE INDEX IF NOT EXISTS messages_user_created ON messages (user_id, created_at);

-- Row-level security: users can only read/write their own messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);
