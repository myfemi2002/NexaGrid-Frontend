"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

type DataTableColumn<T> = {
  id: string;
  header: string;
  accessor?: (row: T) => string | number | null | undefined;
  render?: (row: T) => React.ReactNode;
  searchable?: boolean;
  sortable?: boolean;
  className?: string;
};

type AdminDataTableProps<T> = {
  title?: string;
  description?: string;
  rows: T[];
  columns: Array<DataTableColumn<T>>;
  searchPlaceholder?: string;
  emptyMessage: string;
  initialSortColumn?: string;
  initialSortDirection?: "asc" | "desc";
  pageSize?: number;
};

export function AdminDataTable<T>({
  title,
  description,
  rows,
  columns,
  searchPlaceholder = "Search records...",
  emptyMessage,
  initialSortColumn,
  initialSortDirection = "asc",
  pageSize = 5,
}: AdminDataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(initialSortColumn ?? columns[0]?.id);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(initialSortDirection);

  const searchableColumns = columns.filter((column) => column.searchable !== false);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return rows;
    }

    return rows.filter((row) =>
      searchableColumns.some((column) => {
        const value =
          column.accessor?.(row) ??
          (typeof column.render === "function" ? "" : "");

        return String(value ?? "")
          .toLowerCase()
          .includes(normalizedQuery);
      })
    );
  }, [query, rows, searchableColumns]);

  const sortedRows = useMemo(() => {
    const column = columns.find((item) => item.id === sortColumn);

    if (!column || column.sortable === false || !column.accessor) {
      return filteredRows;
    }

    return [...filteredRows].sort((left, right) => {
      const leftValue = column.accessor?.(left);
      const rightValue = column.accessor?.(right);

      if (leftValue === rightValue) {
        return 0;
      }

      const comparison =
        String(leftValue ?? "").localeCompare(String(rightValue ?? ""), undefined, {
          numeric: true,
          sensitivity: "base",
        });

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [columns, filteredRows, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedRows = sortedRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSort = (column: DataTableColumn<T>) => {
    if (column.sortable === false) {
      return;
    }

    if (sortColumn === column.id) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortColumn(column.id);
    setSortDirection("asc");
  };

  return (
    <div className="rounded-[1.75rem] border border-[#c0c9be] bg-white p-6 shadow-sm">
      {title ? (
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h4 className="font-['Space_Grotesk'] text-[2rem] font-bold">{title}</h4>
            {description ? <p className="mt-2 text-sm text-[#404941]">{description}</p> : null}
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717970]" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              className="h-11 w-full rounded-xl border border-[#c0c9be] bg-[#fcf9f8] pl-10 pr-4 text-sm text-[#1b1c1c] placeholder:text-[#717970] focus:outline-none focus:ring-2 focus:ring-[#003b1b]/15"
              placeholder={searchPlaceholder}
              type="text"
            />
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`border-b border-[#c0c9be] px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-[#404941] ${column.className ?? ""}`}
                >
                  <button
                    type="button"
                    onClick={() => handleSort(column)}
                    className={`flex items-center gap-1 ${column.sortable === false ? "cursor-default" : ""}`}
                  >
                    <span>{column.header}</span>
                    {column.sortable === false ? null : sortColumn === column.id ? (
                      sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    ) : (
                      <ChevronDown className="h-4 w-4 opacity-40" />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length ? (
              paginatedRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="bg-white">
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={`border-b border-[#e5e2db] px-4 py-4 align-top text-sm text-[#1b1c1c] ${column.className ?? ""}`}
                    >
                      {column.render ? column.render(row) : String(column.accessor?.(row) ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-[#404941]"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-col gap-3 text-sm text-[#404941] md:flex-row md:items-center md:justify-between">
        <p>
          Showing {paginatedRows.length ? (safePage - 1) * pageSize + 1 : 0}-
          {Math.min(safePage * pageSize, sortedRows.length)} of {sortedRows.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={safePage <= 1}
            className="rounded-full border border-[#c0c9be] px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="font-medium">
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={safePage >= totalPages}
            className="rounded-full border border-[#c0c9be] px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
