import type { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function Section({ id, eyebrow, title, description, children }: SectionProps) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-7 space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon">{eyebrow}</p>
        ) : null}
        <h2 className="section-title">{title}</h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-slate-400">{description}</p>
        ) : null}
      </header>

      {children}
    </section>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="card border-dashed p-8 text-center text-sm text-slate-500">{message}</div>
  );
}
