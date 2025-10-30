import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { DataTablePagination } from "./DataTablePagination";
type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: {
    page: number;
    limit: number;
    totalRecords: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
};



export function DataTable<TData, TValue>({ columns, data, pagination }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: !!pagination, // important for server-side
    pageCount: pagination ? Math.ceil(pagination.totalRecords / pagination.limit) : undefined,
  });
console.log(data,">>>>>>>>>>>>>>>>");

  return (
    <div>
      <div className="w-full border rounded-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers?.map((header) => (
                  <th key={header.id} className="px-4 py-2 border-b font-semibold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.map((row, rowIndex) => (
              <tr key={row.id} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <DataTablePagination
          skip={pagination.page}
          take={pagination.limit}
          setSkip={pagination.onPageChange}
          setTake={pagination.onPageSizeChange}
          totalRecords={pagination.totalRecords}
          table={table}
        />
      )}
    </div>
  );
}
