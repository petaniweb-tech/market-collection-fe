import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { SkeletonRow } from "../page/SkeletonRow";
import type { Location } from "../../types";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  MoreHorizontal,
  MapPin,
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
import { ConfirmationDeleteDialog } from "../dialog/ConfirmationDeleteDialog";
import { useDeleteLocation } from "../../hooks/useLocation";
import { toast } from "@/hooks/use-toast";

interface LocationTableProps {
  data: Location[];
  isLoading: boolean;
  isSubmitting: boolean;
  onDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEditComplete?: () => void;
}

const LocationTable = ({
  data,
  isLoading,
  isSubmitting,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  onEditComplete,
}: LocationTableProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [locationToEdit, setLocationToEdit] = useState<string | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const deleteLocation = useDeleteLocation();

  const handleEdit = (id: string) => {
    setLocationToEdit(id);
    setEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setLocationToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!locationToDelete) return;

    try {
      await deleteLocation.mutateAsync(locationToDelete);

      toast({
        title: "Berhasil menghapus lokasi",
        description: "Data lokasi telah dihapus dari sistem",
      });
    } catch (error) {
      console.error("Delete failed:", error);
      toast({
        title: "Gagal menghapus lokasi",
        description: error?.message || "Terjadi kesalahan saat menghapus lokasi",
        variant: "destructive",
      });
    } finally {
      setDeleteModalOpen(false);
      setLocationToDelete(null);
    }
  };

  // Calculate start index for row numbering
  const startIndex = (currentPage - 1) * 10; // Assuming 10 items per page

  const columns: ColumnDef<Location>[] = [
    {
      accessorKey: "id",
      header: "NO.",
      cell: ({ row }) => startIndex + row.index + 1,
    },
    {
      accessorKey: "name",
      header: "NAMA LOKASI",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-gray-500" />
          <span>{row.getValue("name")}</span>
        </div>
      ),
    },
    // {
    //   accessorKey: "latitude",
    //   header: "LATITUDE",
    //   cell: ({ row }) => row.getValue("latitude")?.toFixed(4) || '-',
    // },
    // {
    //   accessorKey: "longitude",
    //   header: "LONGITUDE",
    //   cell: ({ row }) => row.getValue("longitude")?.toFixed(4) || '-',
    // },
    {
      accessorKey: "description",
      header: "Keterangan",
      cell: ({ row }) => row.getValue("description") || "-",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const location = row.original;

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
                  onClick={() => handleEdit(location.id)}
                  className="cursor-pointer"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Ubah
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={() => handleDelete(location.id)}
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
                  Tidak ada data lokasi
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
      <ConfirmationDeleteDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Hapus Lokasi"
        description="Apakah anda yakin ingin menghapus lokasi ini? Tindakan ini tidak dapat dibatalkan."
      />

      {/* Add the EditLocationForm */}
      {/* <Sheet
        open={editModalOpen}
        onOpenChange={(open) => {
          setEditModalOpen(open);
          if (!open) {
            onEditComplete?.();
          }
        }}
      >
        {locationToEdit && (
          <EditLocationForm
            locationId={locationToEdit}
            isOpen={editModalOpen}
            onOpenChange={setEditModalOpen}
            setSubmitting={setIsEditSubmitting}
          />
        )}
      </Sheet> */}
    </>
  );
};

export default LocationTable;
