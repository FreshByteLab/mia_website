interface KpiItem {
  label: string;
  value: string;
  hint?: string;
}

interface KpiRowProps {
  title?: string;
  items: KpiItem[];
}

export default function KpiRow({ title, items }: KpiRowProps) {
  return (
    <section>
      {title ? <h3 className="mb-4 text-sm uppercase tracking-[0.28em] text-accent/60">{title}</h3> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {items.map((item) => (
          <article key={item.label} className="glass-panel p-4">
            <p className="text-xs uppercase tracking-wider text-accent/60">{item.label}</p>
            <p className="mt-2 font-display text-2xl text-white">{item.value}</p>
            {item.hint ? <p className="mt-2 text-xs text-white/50">{item.hint}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
