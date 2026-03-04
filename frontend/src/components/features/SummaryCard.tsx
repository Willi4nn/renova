const stylesMap = {
  default: {
    bg: 'border-slate-100 bg-white',
    text: 'text-slate-500',
    val: 'text-slate-700 font-bold',
  },
  success: {
    bg: 'border-slate-100 bg-white',
    text: 'text-slate-500',
    val: 'text-emerald-600 font-bold',
  },
  primary: {
    bg: 'border-renova-teal/20 bg-renova-teal/10',
    text: 'text-renova-teal',
    val: 'text-renova-teal font-black',
  },
};

export const SummaryCard = ({
  title,
  value,
  variant = 'default',
  tooltip,
}: {
  title: string;
  value: string;
  variant?: 'default' | 'success' | 'primary';
  tooltip?: string;
}) => {
  const styles = stylesMap[variant];

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-md border p-3 shadow-sm ${styles.bg}`}
    >
      <span
        title={tooltip}
        className={`truncate text-[10px] font-semibold tracking-wider uppercase md:text-xs ${styles.text}`}
      >
        {title}
      </span>
      <span className={`mt-1 truncate text-base md:text-lg ${styles.val}`}>
        {value}
      </span>
    </div>
  );
};
