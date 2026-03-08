import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
      <div
        className="hidden bg-cover bg-center bg-no-repeat lg:block lg:w-1/2"
        style={{
          backgroundImage: `url('/auth-bg.png')`,
        }}
      >
        <div className="h-full w-full" />
      </div>
    </div>
  );
}
