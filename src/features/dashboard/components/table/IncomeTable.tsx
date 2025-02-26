import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { SkeletonRow } from "../page/SkeletonRow";
import type { Income } from "../../types";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Building2,
} from "lucide-react";
import { useState } from "react";

interface IncomeTableProps {
  data: Income[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const IncomeTable = ({
  data,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: IncomeTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Calculate start index for row numbering
  const startIndex = (currentPage - 1) * 10;

  const columns: ColumnDef<Income>[] = [
    {
      accessorKey: "id",
      header: "NO.",
      cell: ({ row }) => startIndex + row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Lokasi",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-500" />
          <span>{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "merchant_count",
      header: "Lapak",
      cell: ({ row }) => <div>{row.getValue("merchant_count")} Lapak</div>,
    },
    {
      accessorKey: "total_expected_amount",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>PENDAPATAN</span>
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </div>
        );
      },
      cell: ({ row }) => (
        <div>
          Rp{" "}
          {row
            .getValue<number>("total_expected_amount")
            .toLocaleString("id-ID")}
        </div>
      ),
    },
    {
      accessorKey: "collection_percentage",
      header: "Status",
      cell: ({ row }) => {
        const percentage = row.getValue<number>("collection_percentage");
        let colorClass = "bg-green-100 text-green-800";

        if (percentage < 50) {
          colorClass = "bg-red-100 text-red-800";
        } else if (percentage < 80) {
          colorClass = "bg-yellow-100 text-yellow-800";
        }

        return (
          // <div className="">
          //   <span className={`inline-block px-2 py-1 rounded ${colorClass}`}>
          //     {percentage}%
          //   </span>
          // </div>
          <div className="flex items-center text-sm w-fit font-normal text-black bg-[#282828] bg-opacity-5 px-2 h-8 rounded-lg">
            <div className="flex items-center gap-1 font-semibold text-orange-500">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm3.707-11.707L11 13.586V8a1 1 0 00-2 0v6c0 .266.105.52.293.707l5 5a.997.997 0 001.414 0 .999.999 0 000-1.414l-4.293-4.293 4.293-4.293a.999.999 0 10-1.414-1.414z" />
              </svg>
              100%
            </div>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      sorting,
    },
  });

  // Pagination buttons component
  const getPaginationButtons = (): JSX.Element[] => {
    const buttons: JSX.Element[] = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage < maxVisibleButtons - 1) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    buttons.push(
      <Button
        key="prev"
        variant="outline"
        className="border-gray-200 rounded-md"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isLoading}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
    );

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          className={
            i === currentPage
              ? "rounded-md bg-orange-500 text-white border-orange-500"
              : "rounded-md border-gray-200"
          }
          onClick={() => onPageChange(i)}
          disabled={isLoading}
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      buttons.push(
        <Button
          key="ellipsis"
          variant="outline"
          className="border-gray-200 rounded-md"
          disabled
        >
          ...
        </Button>
      );

      buttons.push(
        <Button
          key={totalPages}
          variant="outline"
          className="border-gray-200 rounded-md"
          onClick={() => onPageChange(totalPages)}
          disabled={isLoading}
        >
          {totalPages}
        </Button>
      );
    }

    buttons.push(
      <Button
        key="next"
        variant="outline"
        className="border-gray-200 rounded-md"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    );

    return buttons;
  };

  return (
    <>
      <div className="mb-2 overflow-hidden bg-white rounded-lg shadow">
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
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              Array(5)
                .fill(null)
                .map((_, index) => <SkeletonRow key={index} />)
            ) : data.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Tidak ada data pendapatan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="flex justify-end gap-2 mt-4">
          {getPaginationButtons()}
        </div>
      )}
    </>
  );
};

export default IncomeTable;
