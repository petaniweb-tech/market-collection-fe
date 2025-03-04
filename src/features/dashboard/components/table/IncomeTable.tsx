import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { SkeletonRow } from "../loading/SkeletonRow";
import type { Income } from "../../types/income.types";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Building2,
  Store,
} from "lucide-react";
import { useState } from "react";
import CheckPercentage from "@/assets/icon/ic_check_percentage.svg";

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
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">
              {row.original.merchant_count} Lapak
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "total_expected_amount",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>TARGET HARIAN</span>
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
      accessorKey: "total_collected_amount",
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
            .getValue<number>("total_collected_amount")
            .toLocaleString("id-ID")}
        </div>
      ),
    },
    {
      accessorKey: "collection_percentage",
      header: "Status",
      cell: ({ row }) => {
        return (
          <div className="flex items-center text-sm w-fit font-normal text-black bg-[#282828] bg-opacity-5 px-2 h-8 rounded-lg">
            <div className="flex items-center gap-1 font-semibold text-orange-500">
              <img src={CheckPercentage} alt="percentage" />
              {row.original.collection_percentage}%
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
