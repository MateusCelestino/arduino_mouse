'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { saveProfile, saveSettings } from '@/app/admin/actions';
import { EMPTY_STATE } from '@/lib/admin/action-state';
import { FormField } from '@/components/admin/FormField';
import type { FieldDef } from '@/lib/admin/schema';
import { cn } from '@/lib/utils';

interface SingletonFormProps {
  kind: 'profile' | 'settings';
  fields: FieldDef[];
  record: Record<string, unknown>;
  submitLabel?: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="btn-primary px-6" disabled={pending}>
      {pending ? 'Salvando…' : label}
    </button>
  );
}

/** Formulario das tabelas de linha unica (perfil e configuracoes). */
export function SingletonForm({ kind, fields, record, submitLabel }: SingletonFormProps) {
  const action = kind === 'profile' ? saveProfile : saveSettings;
  const [state, formAction] = useActionState(action, EMPTY_STATE);

  return (
    <form action={formAction} className="card space-y-5 p-5 sm:p-6">
      <input type="hidden" name="__id" value={String(record.id ?? '')} />

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.name}
            className={
              field.type === 'textarea' || field.type === 'image' || field.type === 'tags'
                ? 'sm:col-span-2'
                : ''
            }
          >
            <FormField field={field} value={record[field.name]} />
          </div>
        ))}
      </div>

      {state.message ? (
        <p
          className={cn(
            'rounded-xl px-4 py-3 text-sm',
            state.ok
              ? 'border border-accent/30 bg-accent/10 text-accent'
              : 'border border-red-500/30 bg-red-500/10 text-red-300',
          )}
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton label={submitLabel ?? 'Salvar'} />
    </form>
  );
}
