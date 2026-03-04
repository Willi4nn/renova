import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

const variantsMap = {
  primary: 'bg-renova-teal text-white hover:brightness-110',
  secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-md px-3 py-2 font-medium transition-colors disabled:opacity-50 ${variantsMap[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
