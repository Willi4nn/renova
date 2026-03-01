import { PageHeader } from '../components/ui/PageHeader';

export function FinancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Financeiro"
        description="Gerencie todo financeiro da estofaria"
      />

      <div className="card-base p-6">
        <p className="text-slate-500">Em desenvolvimento...</p>
      </div>
    </div>
  );
}
