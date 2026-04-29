import { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DataTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-card shadow-card">
      <table className="data-table">
        <thead>
          <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Pagination({ current = 1, total = 5 }: { current?: number; total?: number }) {
  return (
    <nav className="flex items-center justify-between mt-4 text-sm" aria-label="Pagination">
      <div className="text-muted-foreground">Page {current} of {total}</div>
      <ul className="flex items-center gap-1">
        <li>
          <button className="p-2 rounded border border-border hover:bg-surface focus-ring" aria-label="Previous">
            <ChevronLeft className="h-4 w-4" />
          </button>
        </li>
        {Array.from({ length: total }).map((_, i) => {
          const n = i + 1;
          const active = n === current;
          return (
            <li key={n}>
              <button className={`min-w-9 px-3 py-1.5 rounded border focus-ring ${active ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-surface"}`}>
                {n}
              </button>
            </li>
          );
        })}
        <li>
          <button className="p-2 rounded border border-border hover:bg-surface focus-ring" aria-label="Next">
            <ChevronRight className="h-4 w-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
