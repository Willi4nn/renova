import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
  label: string;
  accessor: keyof T | string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
  mobileHidden?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  actions?: (item: T) => React.ReactNode;
  mobileCard?: (item: T, actions?: React.ReactNode) => React.ReactNode;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  actions,
  mobileCard,
  emptyMessage = 'Nenhum registro encontrado',
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (accessor: string) => {
    if (sortColumn === accessor) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : null);
      if (sortDirection === 'desc') setSortColumn(null);
    } else {
      setSortColumn(accessor);
      setSortDirection('asc');
    }
  };

  const getValue = (item: T, accessor: string): React.ReactNode => {
    const result = accessor.split('.').reduce<unknown>((obj, key) => {
      if (obj && typeof obj === 'object' && key in obj) {
        return (obj as Record<string, unknown>)[key];
      }
      return undefined;
    }, item as unknown);

    return result as React.ReactNode;
  };

  const sortedData = [...data].sort((itemA, itemB) => {
    if (!sortColumn || !sortDirection) return 0;

    const valueA = getValue(itemA, sortColumn);
    const valueB = getValue(itemB, sortColumn);

    if (valueA === valueB) return 0;
    if (valueA == null) return 1;
    if (valueB == null) return -1;

    const comparison = valueA < valueB ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const getSortIcon = (accessor: string) => {
    if (sortColumn !== accessor)
      return <ArrowUpDown size={14} className="opacity-50" />;
    return sortDirection === 'asc' ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full">
          <thead className="border-b border-slate-300 bg-slate-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-left text-sm font-bold text-gray-900 ${column.mobileHidden ? 'hidden md:table-cell' : ''} ${column.className || ''}`}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.accessor as string)}
                      className="flex items-center gap-1.5 hover:text-gray-700"
                    >
                      {column.label}
                      {getSortIcon(column.accessor as string)}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((item) => (
              <tr key={keyExtractor(item)} className="hover:bg-gray-50">
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className={`px-4 py-3 text-sm ${column.mobileHidden ? 'hidden md:table-cell' : ''} ${column.className || ''}`}
                  >
                    {column.render
                      ? column.render(item)
                      : getValue(item, column.accessor as string)}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {actions(item)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="space-y-3 md:hidden">
        {sortedData.map((item) => {
          const itemActions = actions ? actions(item) : undefined;
          return mobileCard ? (
            mobileCard(item, itemActions)
          ) : (
            <div
              key={keyExtractor(item)}
              className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex-1">
                  {columns
                    .filter((col) => !col.mobileHidden)
                    .slice(0, 2)
                    .map((column, index) => (
                      <div
                        key={index}
                        className={
                          index === 0
                            ? 'font-medium text-gray-900'
                            : 'text-sm text-gray-600'
                        }
                      >
                        {column.render
                          ? column.render(item)
                          : getValue(item, column.accessor as string)}
                      </div>
                    ))}
                </div>
                {itemActions && <div className="flex gap-2">{itemActions}</div>}
              </div>
              <div className="space-y-1">
                {columns
                  .filter((col) => !col.mobileHidden)
                  .slice(2)
                  .map((column, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {column.render
                        ? column.render(item)
                        : getValue(item, column.accessor as string)}
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
