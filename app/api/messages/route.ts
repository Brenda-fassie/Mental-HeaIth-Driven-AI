import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();

  if (!claims?.claims?.sub) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('messages')
    .select('id, role, content, created_at')
    .eq('user_id', claims.claims.sub)
    .order('created_at', { ascending: true });

  if (error) {
    return Response.json({ messages: [] }, { status: 500 });
  }

  return Response.json({ messages: data ?? [] });
}
