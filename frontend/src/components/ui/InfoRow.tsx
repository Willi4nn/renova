export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="group flex items-center justify-between py-1">
      <span className="text-sm text-slate-500 transition-colors group-hover:text-slate-700">
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-800 tabular-nums">
        {value}
      </span>
    </div>
  );
}
