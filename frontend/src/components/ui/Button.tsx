import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const styles =
    variant === 'secondary'
      ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
      : 'bg-renova-teal text-white hover:brightness-110';

  return (
    <button
      className={`rounded-md px-4 py-2 transition-colors disabled:opacity-50 ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
