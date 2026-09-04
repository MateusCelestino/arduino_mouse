import { NextResponse } from 'next/server';

import { createServerSupabase } from '@/lib/supabase/server';
import type { LinkType } from '@/lib/types';

const VALID_TYPES: LinkType[] = ['social', 'custom', 'affiliate', 'live'];

interface TrackPayload {
  link_id?: string | null;
  link_type?: string;
  label?: string | null;
}

/**
 * Registra um clique. Chamado pelo site publico (sem login) e protegido pela
 * funcao `register_click` no banco, que e a unica forma de escrever em
 * `click_events`.
 */
export async function POST(request: Request) {
  let payload: TrackPayload;

  try {
    payload = (await request.json()) as TrackPayload;
  } catch {
    return NextResponse.json({ error: 'JSON invalido' }, { status: 400 });
  }

  const linkType = payload.link_type as LinkType | undefined;

  if (!linkType || !VALID_TYPES.includes(linkType)) {
    return NextResponse.json({ error: 'link_type invalido' }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    // Sem Supabase configurado o clique simplesmente nao e contabilizado.
    return NextResponse.json({ ok: false, tracked: false });
  }

  const { error } = await supabase.rpc('register_click', {
    p_link_id: payload.link_id ?? null,
    p_link_type: linkType,
    p_label: payload.label ?? null,
    p_referrer: request.headers.get('referer'),
    p_user_agent: request.headers.get('user-agent'),
  });

  if (error) {
    return NextResponse.json({ ok: false, tracked: false, error: error.message }, { status: 200 });
  }

  return NextResponse.json({ ok: true, tracked: true });
}
