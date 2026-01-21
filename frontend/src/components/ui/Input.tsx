import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error = false, ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full rounded border px-3 py-2 text-base placeholder:text-slate-400 focus:outline-none disabled:opacity-50 ${
        error
          ? 'border-red-400 focus:border-red-500'
          : 'border-slate-200 focus:border-slate-400'
      } ${className}`}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
