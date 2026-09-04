'use server';

import { revalidatePath } from 'next/cache';

import { type ActionState } from '@/lib/admin/action-state';
import { requireAdmin } from '@/lib/admin/auth';
import {
  PROFILE_FIELDS,
  SETTINGS_FIELDS,
  TABLE_DEFS,
  type AdminTable,
  type FieldDef,
} from '@/lib/admin/schema';
import { normalizeUrl } from '@/lib/utils';

/** Converte os campos do formulario para o formato de cada coluna. */
function buildPayload(fields: FieldDef[], formData: FormData): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  for (const field of fields) {
    if (field.readOnly) continue;

    const raw = formData.get(field.name);

    switch (field.type) {
      case 'bool':
        payload[field.name] = raw === 'on' || raw === 'true';
        break;

      case 'int': {
        const value = typeof raw === 'string' ? Number.parseInt(raw, 10) : Number.NaN;
        payload[field.name] = Number.isFinite(value) ? value : 0;
        break;
      }

      case 'number': {
        const text = typeof raw === 'string' ? raw.trim().replace(',', '.') : '';
        const value = text ? Number.parseFloat(text) : Number.NaN;
        payload[field.name] = Number.isFinite(value) ? value : null;
        break;
      }

      case 'tags': {
        const text = typeof raw === 'string' ? raw : '';
        payload[field.name] = text
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
        break;
      }

      case 'url': {
        const text = typeof raw === 'string' ? raw.trim() : '';
        payload[field.name] = text ? normalizeUrl(text) : field.required ? '' : null;
        break;
      }

      case 'image': {
        const text = typeof raw === 'string' ? raw.trim() : '';
        payload[field.name] = text || null;
        break;
      }

      default:
        payload[field.name] = typeof raw === 'string' ? raw.trim() : '';
    }

    if (field.required) {
      const value = payload[field.name];
      if (value === null || value === '' || value === undefined) {
        throw new Error(`O campo "${field.label}" é obrigatório.`);
      }
    }
  }

  return payload;
}

function assertTable(value: string): AdminTable {
  if (!(value in TABLE_DEFS)) throw new Error('Tabela inválida.');
  return value as AdminTable;
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Não foi possível concluir a operação.';
}

/** Cria ou atualiza um registro de social_links / custom_links / affiliate_links / banners. */
export async function saveRecord(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const table = assertTable(String(formData.get('__table') ?? ''));
    const def = TABLE_DEFS[table];
    const id = String(formData.get('__id') ?? '').trim();

    const { supabase } = await requireAdmin();
    const payload = buildPayload(def.fields, formData);

    const { error } = id
      ? await supabase.from(def.table).update(payload).eq('id', id)
      : await supabase.from(def.table).insert(payload);

    if (error) throw new Error(error.message);

    revalidatePath(def.path);
    revalidatePath('/', 'layout');

    return { ok: true, message: id ? 'Alterações salvas.' : `Novo item adicionado.` };
  } catch (error) {
    return { ok: false, message: toMessage(error) };
  }
}

/** Remove um registro. */
export async function deleteRecord(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const table = assertTable(String(formData.get('__table') ?? ''));
    const def = TABLE_DEFS[table];
    const id = String(formData.get('__id') ?? '').trim();
    if (!id) throw new Error('Registro não informado.');

    const { supabase } = await requireAdmin();
    const { error } = await supabase.from(def.table).delete().eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePath(def.path);
    revalidatePath('/', 'layout');

    return { ok: true, message: 'Item removido.' };
  } catch (error) {
    return { ok: false, message: toMessage(error) };
  }
}

/** Ativa ou desativa um registro sem abrir o formulario. */
export async function toggleActive(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const table = assertTable(String(formData.get('__table') ?? ''));
    const def = TABLE_DEFS[table];
    const id = String(formData.get('__id') ?? '').trim();
    const active = formData.get('__active') === 'true';
    if (!id) throw new Error('Registro não informado.');

    const { supabase } = await requireAdmin();
    const { error } = await supabase.from(def.table).update({ active }).eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePath(def.path);
    revalidatePath('/', 'layout');

    return { ok: true, message: active ? 'Item ativado.' : 'Item desativado.' };
  } catch (error) {
    return { ok: false, message: toMessage(error) };
  }
}

/** Salva o perfil do streamer (cria a linha unica se ainda nao existir). */
export async function saveProfile(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const payload = buildPayload(PROFILE_FIELDS, formData);
    const id = String(formData.get('__id') ?? '').trim();

    const { error } =
      id && id !== 'default'
        ? await supabase.from('profiles').update(payload).eq('id', id)
        : await supabase.from('profiles').insert(payload);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/perfil');
    revalidatePath('/', 'layout');

    return { ok: true, message: 'Perfil atualizado.' };
  } catch (error) {
    return { ok: false, message: toMessage(error) };
  }
}

/** Salva as configuracoes gerais e de SEO. */
export async function saveSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const payload = buildPayload(SETTINGS_FIELDS, formData);
    const id = String(formData.get('__id') ?? '').trim();

    const { error } =
      id && id !== 'default'
        ? await supabase.from('site_settings').update(payload).eq('id', id)
        : await supabase.from('site_settings').insert(payload);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/configuracoes');
    revalidatePath('/', 'layout');

    return { ok: true, message: 'Configurações salvas.' };
  } catch (error) {
    return { ok: false, message: toMessage(error) };
  }
}

/** Liga/desliga o status "Ao vivo" direto do dashboard. */
export async function setLiveStatus(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const live = formData.get('__live') === 'true';
    const id = String(formData.get('__id') ?? '').trim();

    if (!id || id === 'default') {
      throw new Error('Cadastre o perfil antes de alterar o status.');
    }

    const { error } = await supabase.from('profiles').update({ live_status: live }).eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePath('/admin');
    revalidatePath('/', 'layout');

    return { ok: true, message: live ? 'Você está AO VIVO.' : 'Status alterado para offline.' };
  } catch (error) {
    return { ok: false, message: toMessage(error) };
  }
}
