import { Inbox } from "lucide-react";
import EmptyState from "./EmptyState";
import Skeleton from "./Skeleton";

const DataTable = ({
  columns,
  data,
  keyField = "_id",
  loading = false,
  minWidth = 850,
  loadingRows = 5,
  emptyState,
  className = "",
}) => {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden
        ${className}
      `}
    >
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: `${minWidth}px` }}>
          <thead>
            <tr className="bg-light-blue">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`
                    px-4 py-3 text-left text-xs font-semibold text-slate-600 whitespace-nowrap
                    ${col.headerClassName || ""}
                  `}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: loadingRows }).map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-slate-100 last:border-0"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-4">
                      <Skeleton className="h-4 max-w-[150px]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-4">
                  {emptyState || (
                    <EmptyState
                      icon={Inbox}
                      title="No data found"
                      description="No records are available right now."
                    />
                  )}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row[keyField] ?? rowIndex}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`
                        px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap
                        ${col.className || ""}
                      `}
                    >
                      {col.render ? col.render(row) : (row[col.key] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;