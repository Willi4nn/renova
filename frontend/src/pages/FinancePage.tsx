import { PageHeader } from '../components/ui/PageHeader';

export function FinancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Financeiro"
        description="Gerencie todo financeiro da estofaria"
      />

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-500">Em desenvolvimento...</p>
      </div>
    </div>
  );
}
