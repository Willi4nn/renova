import { type ReactNode } from 'react';

export const FormSection = ({
  title,
  children,
  className = 'grid gap-6 md:grid-cols-2',
  isHighlighted = false,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  isHighlighted?: boolean;
}) => (
  <section className={`card-base p-6 ${isHighlighted ? 'bg-slate-50/50' : ''}`}>
    <h3
      className={`mb-4 border-b pb-2 text-lg font-bold text-slate-800 ${isHighlighted ? 'border-slate-200' : 'border-slate-100'}`}
    >
      {title}
    </h3>
    <div className={className}>{children}</div>
  </section>
);
