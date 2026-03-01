import { PageHeader } from '../components/ui/PageHeader';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral da estofaria"
        titleSize="text-3xl"
      />

      <div className="card-base p-6">
        <p className="text-slate-500">Em desenvolvimento...</p>
      </div>
    </div>
  );
}
