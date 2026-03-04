export function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="shrink-0 text-sm font-medium text-slate-500">
        {label}
      </span>
      <span className="min-w-0 text-right text-sm font-semibold wrap-break-word text-slate-800">
        {value}
      </span>
    </div>
  );
}
