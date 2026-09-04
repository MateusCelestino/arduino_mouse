'use client';

import { useId } from 'react';

import { ImageUpload } from '@/components/admin/ImageUpload';
import type { FieldDef } from '@/lib/admin/schema';

type Value = unknown;

function asText(value: Value): string {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

/** Renderiza um campo do formulario a partir da definicao da tabela. */
export function FormField({ field, value }: { field: FieldDef; value: Value }) {
  const id = useId();

  if (field.readOnly) {
    return (
      <div>
        <span className="label">{field.label}</span>
        <p className="rounded-xl border border-white/5 bg-base-900/60 px-3.5 py-2.5 text-sm text-slate-400">
          {asText(value) || '0'}
        </p>
      </div>
    );
  }

  if (field.type === 'image') {
    return (
      <ImageUpload
        name={field.name}
        label={field.label}
        defaultValue={asText(value)}
        help={field.help}
        required={field.required}
      />
    );
  }

  if (field.type === 'bool') {
    return (
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-base-900/60 px-3.5 py-3">
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={Boolean(value)}
          className="h-4 w-4 rounded border-white/20 bg-base-800 accent-neon"
        />
        <span className="text-sm font-medium text-slate-200">{field.label}</span>
      </label>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div>
        <label className="label" htmlFor={id}>
          {field.label}
          {field.required ? <span className="text-neon"> *</span> : null}
        </label>
        <textarea
          id={id}
          name={field.name}
          rows={3}
          defaultValue={asText(value)}
          placeholder={field.placeholder}
          required={field.required}
          className="input resize-y"
        />
        {field.help ? <p className="mt-1 text-xs text-slate-500">{field.help}</p> : null}
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div>
        <label className="label" htmlFor={id}>
          {field.label}
        </label>
        <select id={id} name={field.name} defaultValue={asText(value)} className="input">
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {field.help ? <p className="mt-1 text-xs text-slate-500">{field.help}</p> : null}
      </div>
    );
  }

  const inputType =
    field.type === 'number' ? 'number' : field.type === 'int' ? 'number' : 'text';

  return (
    <div>
      <label className="label" htmlFor={id}>
        {field.label}
        {field.required ? <span className="text-neon"> *</span> : null}
      </label>
      <input
        id={id}
        name={field.name}
        type={inputType}
        step={field.type === 'number' ? '0.01' : undefined}
        defaultValue={asText(value)}
        placeholder={field.placeholder}
        required={field.required}
        className="input"
      />
      {field.help ? <p className="mt-1 text-xs text-slate-500">{field.help}</p> : null}
    </div>
  );
}
