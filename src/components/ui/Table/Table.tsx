import { useState } from 'react';
import styles from './Table.module.css';
import Button from '../Button';
import { TableProps } from '../../../types';

function Table<T extends { id: string }>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  selectedRows = [],
  onSelectionChange,
  pagination,
  className = '',
  ...props
}: TableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleRowSelection = (itemId: string, selected: boolean) => {
    if (!onSelectionChange) return;

    if (selected) {
      onSelectionChange([...selectedRows, itemId]);
    } else {
      onSelectionChange(selectedRows.filter(id => id !== itemId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (!onSelectionChange) return;

    if (selected) {
      onSelectionChange(data.map(item => item.id));
    } else {
      onSelectionChange([]);
    }
  };

  const getSortedData = () => {
    if (!sortColumn) return data;

    const column = columns.find(col => col.key === sortColumn);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aValue = (a as any)[sortColumn];
      const bValue = (b as any)[sortColumn];

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return sortDirection === 'desc' ? -comparison : comparison;
    });
  };

  const sortedData = getSortedData();
  const hasSelection = onSelectionChange !== undefined;
  const allSelected = selectedRows.length === data.length && data.length > 0;
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  const tableClasses = [
    styles.table,
    loading && styles.tableLoading,
    className
  ].filter(Boolean).join(' ');

  if (loading) {
    return (
      <div className={styles.tableContainer} {...props}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}>
            <svg
              className={styles.spinner}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="31.416"
                strokeDashoffset="31.416"
              />
            </svg>
          </div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={styles.tableContainer} {...props}>
        <div className={styles.emptyState}>
          <svg
            className={styles.emptyIcon}
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <p className={styles.emptyMessage}>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer} {...props}>
      <div className={styles.tableWrapper}>
        <table className={tableClasses}>
          <thead className={styles.tableHeader}>
            <tr>
              {hasSelection && (
                <th className={styles.tableHeaderCell}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={input => {
                        if (input) input.indeterminate = someSelected;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxCustom}></span>
                  </label>
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${styles.tableHeaderCell} ${column.sortable ? styles.sortable : ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className={styles.headerContent}>
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className={styles.sortIcon}>
                        {sortColumn === column.key ? (
                          sortDirection === 'asc' ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M7 14l5-5 5 5M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {sortedData.map((item) => (
              <tr
                key={item.id}
                className={`${styles.tableRow} ${onRowClick ? styles.clickableRow : ''} ${
                  selectedRows.includes(item.id) ? styles.selectedRow : ''
                }`}
                onClick={() => onRowClick?.(item)}
              >
                {hasSelection && (
                  <td className={styles.tableCell}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleRowSelection(item.id, e.target.checked);
                        }}
                        className={styles.checkbox}
                      />
                      <span className={styles.checkboxCustom}></span>
                    </label>
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className={styles.tableCell}>
                    {column.render 
                      ? column.render(item) 
                      : (item as any)[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Showing {((pagination.currentPage - 1) * 10) + 1}-{Math.min(pagination.currentPage * 10, data.length)} of {data.length} results
          </div>
          <div className={styles.paginationControls}>
            <Button
              variant="outline"
              size="small"
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            >
              Previous
            </Button>
            
            <div className={styles.pageNumbers}>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNumber;
                if (pagination.totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  pageNumber = pagination.totalPages - 4 + i;
                } else {
                  pageNumber = pagination.currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === pagination.currentPage ? "primary" : "ghost"}
                    size="small"
                    onClick={() => pagination.onPageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="small"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;