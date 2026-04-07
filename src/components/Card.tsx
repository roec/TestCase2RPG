import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

interface CardProps extends PropsWithChildren {
  className?: string;
}

export const Card = ({ className, children }: CardProps) => (
  <section className={clsx('rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200', className)}>
    {children}
  </section>
);
