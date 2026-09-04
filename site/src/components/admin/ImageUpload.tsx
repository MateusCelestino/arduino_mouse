'use client';

import Image from 'next/image';
import { useId, useRef, useState } from 'react';

import { createBrowserSupabase } from '@/lib/supabase/client';

interface ImageUploadProps {
  name: string;
  label: string;
  defaultValue?: string | null;
  help?: string;
  required?: boolean;
}

const BUCKET = 'media';

/** Upload para o Supabase Storage com preview. Tambem aceita colar uma URL. */
export function ImageUpload({ name, label, defaultValue, help, required }: ImageUploadProps) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file: File) {
    const supabase = createBrowserSupabase();

    if (!supabase) {
      setError('Supabase não configurado.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const extension = file.name.split('.').pop()?.toLowerCase() ?? 'png';
      const path = `${name}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      setValue(data.publicUrl);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : 'Falha ao enviar a imagem.',
      );
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div>
      <span className="label">{label}</span>

      <input type="hidden" name={name} value={value} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-base-900">
          {value ? (
            <Image src={value} alt="" fill sizes="96px" className="object-cover" unoptimized />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-2xl text-white/15">
              ▣
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            id={inputId}
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            className="block w-full text-xs text-slate-400 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-neon/20 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-neon-soft hover:file:bg-neon/30"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />

          <input
            type="text"
            className="input text-xs"
            placeholder="ou cole uma URL de imagem"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            required={required && !value}
          />

          <div className="flex items-center gap-3 text-xs">
            {uploading ? <span className="text-neon-soft">Enviando…</span> : null}
            {value ? (
              <button
                type="button"
                className="text-slate-500 transition hover:text-red-300"
                onClick={() => setValue('')}
              >
                Remover imagem
              </button>
            ) : null}
          </div>

          {error ? <p className="text-xs text-red-300">{error}</p> : null}
          {help ? <p className="text-xs text-slate-500">{help}</p> : null}
        </div>
      </div>
    </div>
  );
}
