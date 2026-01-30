import React, { useState } from 'react';
import { Checkbox } from '../../atoms/Checkbox/Checkbox';
import { Badge } from '../../atoms/Badge/Badge';

export type SortDirection = 'asc' | 'desc' | null;

export interface DataTableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  data: T[];
  onRowClick?: (row: T, index: number) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  selectable?: boolean;
  rowKey?: string | ((row: T) => string);
  className?: string;
}

export const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  onSelectionChange,
  selectable = false,
  rowKey = 'id',
  className = '',
}: DataTableProps<T>) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const getRowKey = (row: T): string => {
    return typeof rowKey === 'function' ? rowKey(row) : String(row[rowKey]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = new Set(data.map(getRowKey));
      setSelectedRows(allKeys);
      if (onSelectionChange) {
        onSelectionChange(data);
      }
    } else {
      setSelectedRows(new Set());
      if (onSelectionChange) {
        onSelectionChange([]);
      }
    }
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    const key = getRowKey(row);
    const newSelected = new Set(selectedRows);

    if (checked) {
      newSelected.add(key);
    } else {
      newSelected.delete(key);
    }

    setSelectedRows(newSelected);

    if (onSelectionChange) {
      const selected = data.filter((r) => newSelected.has(getRowKey(r)));
      onSelectionChange(selected);
    }
  };

  const handleSort = (columnKey: string) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const getSortedData = () => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === bVal) return 0;

      let comparison = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const sortedData = getSortedData();
  const allSelected = data.length > 0 && selectedRows.size === data.length;
  const someSelected = selectedRows.size > 0 && !allSelected;

  return (
    <div className={`overflow-x-auto ${className}`} role="region" aria-label="Data table">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="border-b border-border bg-muted">
            {selectable && (
              <th className="p-md w-12 text-left">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={`p-md text-${column.align || 'left'} text-small font-semibold text-text-primary ${
                  column.width ? `w-[${column.width}]` : ''
                }`}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.sortable ? (
                  <button
                    onClick={() => handleSort(column.key)}
                    className="flex items-center gap-xs hover:text-primary transition-colors duration-fast"
                    aria-label={`Sort by ${column.label}`}
                  >
                    <span>{column.label}</span>
                    <span className="material-symbols-outlined text-lg">
                      {sortColumn === column.key ? (
                        sortDirection === 'asc' ? (
                          'arrow_upward'
                        ) : (
                          'arrow_downward'
                        )
                      ) : (
                        'unfold_more'
                      )}
                    </span>
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="p-xl text-center text-text-secondary"
              >
                <div className="flex flex-col items-center gap-md">
                  <span className="material-symbols-outlined text-4xl">
                    inbox
                  </span>
                  <p className="text-body">No data available</p>
                </div>
              </td>
            </tr>
          ) : (
            sortedData.map((row, index) => {
              const key = getRowKey(row);
              const isSelected = selectedRows.has(key);

              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row, index)}
                  className={`border-b border-border transition-colors duration-fast ${
                    isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                  aria-selected={isSelected}
                >
                  {selectable && (
                    <td className="p-md">
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectRow(row, e.target.checked);
                        }}
                        aria-label={`Select row ${index + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`p-md text-${column.align || 'left'} text-body text-text-primary`}
                    >
                      {column.render
                        ? column.render(row[column.key], row, index)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

DataTable.displayName = 'DataTable';
