"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type Column<Row> = {
  header: string;
  render: (row: Row) => React.ReactNode;
};

export function SecurityTableCard<Row>({
  title,
  subtitle,
  load,
  columns,
}: {
  title: string;
  subtitle: string;
  load: () => Promise<Row[]>;
  columns: Column<Row>[];
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    load()
      .then((items) => {
        if (!cancelled) {
          setRows(items);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("This request could not be processed at the moment.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [load]);

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {loading ? <p className="mt-6 text-sm text-muted-foreground">Loading security records...</p> : null}
      {error ? <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      {!loading && !error ? (
        <div className="mt-6 overflow-hidden rounded-3xl border border-border">
          <table className="min-w-full divide-y divide-border text-left">
            <thead className="bg-muted/40">
              <tr>
                {columns.map((column) => (
                  <th key={column.header} className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No records found.
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={index}>
                    {columns.map((column) => (
                      <td key={column.header} className="px-4 py-4 align-top text-sm text-charcoal">
                        {column.render(row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </Card>
  );
}
