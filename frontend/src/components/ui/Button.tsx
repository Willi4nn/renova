type ButtonProps = {
  children: React.ReactNode;
};

export function Button({ children }: ButtonProps) {
  return (
    <button className="bg-renova-teal rounded-md px-4 py-2 text-white hover:brightness-110">
      {children}
    </button>
  );
}
