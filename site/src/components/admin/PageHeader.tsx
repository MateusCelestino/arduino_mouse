export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="mb-7 space-y-1.5">
      <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {title}
      </h1>
      {description ? <p className="text-sm text-slate-400">{description}</p> : null}
    </header>
  );
}
