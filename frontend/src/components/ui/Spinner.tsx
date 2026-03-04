export function Spinner() {
  return (
    <div className="pt-20 text-center">
      <div className="border-t-renova-teal mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200"></div>
      <p className="mt-3 text-slate-500">Carregando...</p>
    </div>
  );
}
