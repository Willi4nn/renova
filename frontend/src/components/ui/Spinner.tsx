export function Spinner() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="border-t-renova-teal mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200"></div>
      <p className="mt-3 text-slate-500">Carregando...</p>
    </div>
  );
}
