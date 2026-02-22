import type { ReactNode } from "react";

interface StudyControlsProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function StudyControls({ title, description, actions, children }: StudyControlsProps) {
  return (
    <section className="glass-panel p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/60">{description}</p>
          ) : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
