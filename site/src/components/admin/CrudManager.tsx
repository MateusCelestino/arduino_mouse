'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { deleteRecord, saveRecord, toggleActive } from '@/app/admin/actions';
import { EMPTY_STATE } from '@/lib/admin/action-state';
import { FormField } from '@/components/admin/FormField';
import { TABLE_DEFS, type AdminTable } from '@/lib/admin/schema';
import { cn } from '@/lib/utils';

export type Record_ = Record<string, unknown>;

interface CrudManagerProps {
  table: AdminTable;
  records: Record_[];
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? 'Salvando…' : label}
    </button>
  );
}

export function CrudManager({ table, records }: CrudManagerProps) {
  const def = TABLE_DEFS[table];
  const [editing, setEditing] = useState<string | null>(null);

  const [saveState, saveAction] = useActionState(saveRecord, EMPTY_STATE);
  const [deleteState, deleteAction] = useActionState(deleteRecord, EMPTY_STATE);
  const [toggleState, toggleAction] = useActionState(toggleActive, EMPTY_STATE);

  useEffect(() => {
    if (saveState.ok) setEditing(null);
  }, [saveState]);

  const feedback = [saveState, deleteState, toggleState].find((state) => state.message);
  const current = editing && editing !== 'new' ? records.find((r) => r.id === editing) : undefined;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">
          {records.length} {records.length === 1 ? 'item cadastrado' : 'itens cadastrados'}
        </p>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setEditing((value) => (value === 'new' ? null : 'new'))}
        >
          {editing === 'new' ? 'Cancelar' : `+ Nova ${def.singular}`}
        </button>
      </div>

      {feedback ? (
        <p
          className={cn(
            'rounded-xl px-4 py-3 text-sm',
            feedback.ok
              ? 'border border-accent/30 bg-accent/10 text-accent'
              : 'border border-red-500/30 bg-red-500/10 text-red-300',
          )}
        >
          {feedback.message}
        </p>
      ) : null}

      {editing ? (
        <form action={saveAction} className="card space-y-4 p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-white">
            {editing === 'new' ? `Nova ${def.singular}` : `Editar ${def.singular}`}
          </h2>

          <input type="hidden" name="__table" value={table} />
          <input type="hidden" name="__id" value={editing === 'new' ? '' : editing} />

          <div className="grid gap-4 sm:grid-cols-2">
            {def.fields.map((field) => (
              <div
                key={field.name}
                className={field.type === 'textarea' || field.type === 'image' ? 'sm:col-span-2' : ''}
              >
                <FormField field={field} value={current?.[field.name]} />
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-1">
            <SubmitButton label={editing === 'new' ? 'Adicionar' : 'Salvar alterações'} />
            <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>
              Cancelar
            </button>
          </div>
        </form>
      ) : null}

      <ul className="space-y-3">
        {records.map((record) => {
          const id = String(record.id);
          const active = Boolean(record.active);
          const title = String(record[def.titleField] ?? '') || '(sem título)';

          return (
            <li key={id} className="card flex flex-wrap items-center gap-3 p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-semibold text-slate-400">
                {String(record.sort_order ?? 0)}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">{title}</p>
                <p className="truncate text-xs text-slate-500">
                  {String(record.url ?? record.affiliate_url ?? record.link_url ?? '—')}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {record.featured ? (
                  <span className="badge bg-neon/15 text-neon-soft">Destaque</span>
                ) : null}

                {'click_count' in record ? (
                  <span className="badge bg-white/5 text-slate-400">
                    {String(record.click_count ?? 0)} cliques
                  </span>
                ) : null}

                <span
                  className={cn(
                    'badge',
                    active ? 'bg-accent/15 text-accent' : 'bg-white/5 text-slate-500',
                  )}
                >
                  {active ? 'Ativo' : 'Inativo'}
                </span>

                <form action={toggleAction}>
                  <input type="hidden" name="__table" value={table} />
                  <input type="hidden" name="__id" value={id} />
                  <input type="hidden" name="__active" value={String(!active)} />
                  <button type="submit" className="btn-secondary px-3 py-1.5 text-xs">
                    {active ? 'Desativar' : 'Ativar'}
                  </button>
                </form>

                <button
                  type="button"
                  className="btn-secondary px-3 py-1.5 text-xs"
                  onClick={() => setEditing((value) => (value === id ? null : id))}
                >
                  Editar
                </button>

                <form
                  action={deleteAction}
                  onSubmit={(event) => {
                    if (!window.confirm(`Remover "${title}"?`)) event.preventDefault();
                  }}
                >
                  <input type="hidden" name="__table" value={table} />
                  <input type="hidden" name="__id" value={id} />
                  <button type="submit" className="btn-danger px-3 py-1.5 text-xs">
                    Excluir
                  </button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>

      {records.length === 0 && !editing ? (
        <p className="card border-dashed p-8 text-center text-sm text-slate-500">
          Nada cadastrado ainda. Clique em “+ Nova {def.singular}”.
        </p>
      ) : null}
    </div>
  );
}
