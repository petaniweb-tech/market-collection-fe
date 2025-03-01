import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { SkeletonRow } from "../page/SkeletonRow";
import type { Store } from "../../types/income.types";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  MoreHorizontal,
  Trash2,
  Building2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import EditStoreForm from "../form/EditStoreForm";

interface StoreTableProps {
  data: Store[];
  isLoading: boolean;
  isSubmitting: boolean;
  onDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEditComplete?: () => void;
}

const StoreTable = ({
  data,
  isLoading,
  isSubmitting,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  onEditComplete,
}: StoreTableProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [storeToEdit, setStoreToEdit] = useState<string | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  // Calculate start index for row numbering
  const startIndex = (currentPage - 1) * 10; // Assuming 10 items per page

  const handleEdit = (id: string) => {
    setStoreToEdit(id);
    setEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    // setStoreToDelete(id);
    // setDeleteModalOpen(true);
  };

  // const confirmDelete = () => {
  //   if (storeToDelete) {
  //     onDelete(storeToDelete);
  //     setDeleteModalOpen(false);
  //     setStoreToDelete(null);
  //   }
  // };

  const columns: ColumnDef<Store>[] = [
    {
      accessorKey: "id",
      header: "NO.",
      cell: ({ row }) => startIndex + row.index + 1,
    },
    {
      accessorKey: "name",
      header: "NAMA LAPAK",
    },
    {
      accessorKey: "location.name",
      header: "Lokasi",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">
              {row.original.location?.name || "Tidak ada lokasi"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "expected_deposit_amount",
      header: "NOMINAL RETRIBUSI",
      cell: ({ row }) => {
        const amount = row.getValue("expected_deposit_amount") as number;
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount);
      },
    },
    // {
    //   accessorKey: "status",
    //   header: "STATUS",
    //   cell: ({ row }) => {
    //     const isActive = row.getValue("status") as boolean;

    //     if (isActive) {
    //       return (
    //         <span className="inline-flex items-center px-2 py-0.5 rounded-md text-sm font-medium bg-green-50 text-green-600 border border-green-200">
    //           <CheckCircle2 className="w-4 h-4 mr-1 stroke-2" />
    //           Aktif
    //         </span>
    //       );
    //     } else {
    //       return (
    //         <span className="inline-flex items-center px-2 py-0.5 rounded-md text-sm font-medium bg-red-50 text-red-600 border border-red-200">
    //           <XCircle className="w-4 h-4 mr-1 stroke-2" />
    //           Nonaktif
    //         </span>
    //       );
    //     }
    //   },
    // },
    {
      id: "actions",
      cell: ({ row }) => {
        const store = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-8 h-8 p-0 bg-white">
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  onClick={() => handleEdit(store.id)}
                  className="cursor-pointer"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Ubah
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={() => handleDelete(store.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
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
        className="border-gray-200 rounded-md"
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

    // Add ellipsis if needed
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

      // Add last page
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

    // Add next button
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
            {isLoading || isSubmitting ? (
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
                  Tidak ada data lapak
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

      {/* Add the DeleteConfirmationModal */}
      {/* <ConfirmationDeleteDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Hapus Lapak"
        description="Apakah anda yakin ingin menghapus data lapak ini? Tindakan ini tidak dapat dibatalkan."
      /> */}

      {/* Add the EditStoreForm */}
      <Sheet
        open={editModalOpen}
        onOpenChange={(open) => {
          setEditModalOpen(open);
          if (!open) {
            onEditComplete?.();
          }
        }}
      >
        {storeToEdit && (
          <EditStoreForm
            storeId={storeToEdit}
            isOpen={editModalOpen}
            onOpenChange={setEditModalOpen}
            setSubmitting={setIsEditSubmitting}
          />
        )}
      </Sheet>
    </>
  );
};

export default StoreTable;
