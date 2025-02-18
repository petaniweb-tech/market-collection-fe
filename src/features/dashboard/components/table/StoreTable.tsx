import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { SkeletonRow } from "../SkeletonRow";
import type { Store } from "../../types";

interface StoreTableProps {
  data: Store[];
  isLoading: boolean;
  isSubmitting: boolean;
}

const StoreTable = ({ data, isLoading, isSubmitting }: StoreTableProps) => {
  const columns: ColumnDef<Store>[] = [
    {
      accessorKey: "id",
      header: "No.",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "store_name",
      header: "Nama Lapak",
    },
    {
      accessorKey: "location",
      header: "Lokasi",
    },
    {
      accessorKey: "retribution",
      header: "Nominal Retribusi Harian",
    },
    {
      accessorKey: "desc",
      header: "Keterangan",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-blue-400 bg-opacity-50 divide-y divide-gray-200">
            {isLoading || isSubmitting
              ? Array(5)
                  .fill(null)
                  .map((_, index) => <SkeletonRow key={index} />)
              : table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        {Array.from({ length: table.getPageCount() }, (_, i) => (
          <Button
            key={i}
            variant="outline"
            className={
              i === table.getState().pagination.pageIndex
                ? "text-white bg-orange-500"
                : ""
            }
            onClick={() => table.setPageIndex(i)}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default StoreTable;
