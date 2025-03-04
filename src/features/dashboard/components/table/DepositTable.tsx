/* eslint-disable @typescript-eslint/no-explicit-any */
// components/table/DepositTable.tsx
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
import { ChevronLeft, ChevronRight, Building2, MapPin } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { CollectorDeposit } from "../../types/collectorDeposit.types";
import { BankDeposit } from "../../types/bankDeposit.types";
import { ManagerDeposit } from "../../types/managerDeposit.types";

interface DepositTableProps {
  depositType: "collector" | "manager" | "bank";
  data: (CollectorDeposit | ManagerDeposit | BankDeposit)[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const DepositTable = ({
  depositType,
  data,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: DepositTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Format date to DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Calculate start index for row numbering
  const startIndex = (currentPage - 1) * 10; // Assuming 10 items per page

  // Define columns based on deposit type
  const getColumns = (): ColumnDef<any>[] => {
    const baseColumns: ColumnDef<any>[] = [
      {
        accessorKey: "id",
        header: "No.",
        size: 70,
        cell: ({ row }) => startIndex + row.index + 1,
      },
      {
        accessorKey: "created_at",
        header: "Tanggal",
        size: 120,
        cell: ({ row }) => formatDate(row.getValue("created_at")),
      },
    ];

    if (depositType === "collector") {
      return [
        ...baseColumns,
        {
          accessorKey: "created_by_name",
          header: "Nama Collector Lapak",
          size: 200,
          cell: ({ row }) => {
            const deposit = row.original;
            return deposit.created_by_name || "-";
          },
        },
        {
          accessorKey: "merchant.name",
          header: "Nama Lapak",
          size: 200,
          cell: ({ row }) => {
            const deposit = row.original;
            return (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{deposit.merchant?.name || "-"}</span>
              </div>
            );
          },
        },
        {
          accessorKey: "location_name",
          header: "Lokasi",
          size: 200,
          cell: ({ row }) => {
            const deposit = row.original;
            return (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span>{deposit.location_name || "-"}</span>
              </div>
            );
          },
        },
        {
          accessorKey: "deposit_amount",
          header: "Nominal Retribusi Harian",
          size: 200,
          cell: ({ row }) => {
            return (
              <div className="font-medium text-red-500">
                {formatCurrency(row.getValue("deposit_amount"))}
              </div>
            );
          },
        },
      ];
    } else if (depositType === "manager") {
      return [
        ...baseColumns,
        {
          accessorKey: "created_by_name",
          header: "Nama Kepala Lokasi",
          size: 200,
          cell: ({ row }) => {
            const deposit = row.original;
            return deposit.created_by_name || "-";
          },
        },
        {
          accessorKey: "collector_name",
          header: "Nama Collector",
          size: 200,
          cell: ({ row }) => {
            const deposit = row.original;
            return deposit.collector_name || "-";
          },
        },
        {
          accessorKey: "location_name",
          header: "Lokasi",
          size: 200,
          cell: ({ row }) => {
            const deposit = row.original;
            return (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span>{deposit.location_name || "-"}</span>
              </div>
            );
          },
        },
        {
          accessorKey: "deposit_amount",
          header: "Nominal Retribusi Harian",
          size: 200,
          cell: ({ row }) => {
            return (
              <div className="font-medium text-red-500">
                {formatCurrency(row.getValue("deposit_amount"))}
              </div>
            );
          },
        },
        {
          accessorKey: "verification",
          header: "Status Verifikasi",
          size: 150,
          cell: ({ row }) => {
            const verification = row.original.verification;
            return (
              <div
                className={`px-3 py-1 text-sm rounded-full ${verification ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
              >
                {verification ? "Diverifikasi" : "Belum Diverifikasi"}
              </div>
            );
          },
        },
      ];
    } else {
      // Bank deposit columns
      return [
        ...baseColumns,
        {
          accessorKey: "created_by_name",
          header: "Nama Kepala Lokasi",
          size: 200,
          cell: ({ row }) => {
            const deposit = row.original;
            return deposit.created_by_name || "-";
          },
        },
        {
          accessorKey: "location_name",
          header: "Lokasi",
          size: 200,
          cell: ({ row }) => {
            const deposit = row.original;
            return (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span>{deposit.location_name || "-"}</span>
              </div>
            );
          },
        },
        {
          accessorKey: "deposit_amount",
          header: "Nominal Retribusi Harian",
          size: 200,
          cell: ({ row }) => {
            return (
              <div className="font-medium text-red-500">
                {formatCurrency(row.getValue("deposit_amount"))}
              </div>
            );
          },
        },
        {
          accessorKey: "proof_of_payment_url",
          header: "Bukti Bayar",
          size: 120,
          cell: ({ row }) => {
            const url = row.original.proof_of_payment_url;
            return url ? (
              <Button
                variant="link"
                className="h-auto p-0 text-blue-600"
                onClick={() => window.open(url, "_blank")}
              >
                Lihat Bukti
              </Button>
            ) : (
              <span className="text-gray-400">-</span>
            );
          },
        },
      ];
    }
  };

  const columns = getColumns();

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

  // Determine which page buttons to show
  const getPaginationButtons = (): JSX.Element[] => {
    const buttons: JSX.Element[] = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < maxVisibleButtons - 1) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // Add previous button
    buttons.push(
      <Button
        key="prev"
        variant="outline"
        className="w-8 h-8 p-0 border-0 rounded-md"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isLoading}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
    );

    // Add page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          className={`w-8 h-8 p-0 ${
            i === currentPage
              ? "rounded-md bg-orange-500 text-white border-orange-500"
              : "rounded-md border-0 text-gray-600"
          }`}
          onClick={() => onPageChange(i)}
          disabled={isLoading}
        >
          {i}
        </Button>
      );
    }

    // Add ellipsis if needed
    if (endPage < totalPages) {
      buttons.push(
        <Button
          key="ellipsis"
          variant="outline"
          className="w-8 h-8 p-0 border-0 rounded-md"
          disabled
        >
          ...
        </Button>
      );

      // Add last page
      buttons.push(
        <Button
          key={totalPages}
          variant="outline"
          className="w-8 h-8 p-0 border-0 rounded-md"
          onClick={() => onPageChange(totalPages)}
          disabled={isLoading}
        >
          {totalPages}
        </Button>
      );
    }

    // Add next button
    buttons.push(
      <Button
        key="next"
        variant="outline"
        className="w-8 h-8 p-0 border-0 rounded-md"
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
      <div className="overflow-hidden bg-white rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            {/* <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-200">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500"
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
            </thead> */}
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
                    Tidak ada data setoran
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 0 && (
        <div className="flex justify-end gap-1 mt-4">
          {getPaginationButtons()}
        </div>
      )}
    </>
  );
};

export default DepositTable;
