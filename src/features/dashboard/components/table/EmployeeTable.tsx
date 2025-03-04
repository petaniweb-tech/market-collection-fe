/* eslint-disable @typescript-eslint/no-unused-vars */
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
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  MoreHorizontal,
  XCircle,
  CheckCircle2,
  Building2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import EditEmployeeForm from "../form/EditEmployeeForm";
import { Sheet } from "@/components/ui/sheet";
import { Employee } from "../../types/employee.types";

interface EmployeeTableProps {
  data: Employee[];
  isLoading: boolean;
  isSubmitting: boolean;
  onDelete: (id: string) => void;
  onReactivate: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEditComplete?: () => void;
}

const EmployeeTable = ({
  data,
  isLoading,
  isSubmitting,
  onDelete,
  onReactivate,
  currentPage,
  totalPages,
  onPageChange,
  onEditComplete,
}: EmployeeTableProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<string | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleEdit = (id: string) => {
    setEmployeeToEdit(id);
    setEditModalOpen(true);
  };

  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case "collector":
        return "Collector Lapak";
      case "manager":
        return "Kepala Lokasi";
      case "supervisor":
        return "Dinas Perdagangan Kota";
      case "admin":
        return "Admin";
      default:
        return role;
    }
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case "collector":
        return "bg-blue-600";
      case "manager":
        return "bg-green-600";
      case "supervisor":
        return "bg-purple-600";
      case "admin":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  const startIndex = (currentPage - 1) * 10;

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "id",
      header: "NO.",
      cell: ({ row }) => startIndex + row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Nama Pegawai",
    },
    {
      accessorKey: "phone_number",
      header: "No. HP",
    },
    {
      accessorKey: "email",
      header: "Email",
    },

    {
      accessorKey: "location.name",
      header: "Lokasi Kerja",
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
      accessorKey: "role",
      header: "Role / Level",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const displayRole = getRoleDisplayName(role);
        const colorClass = getRoleColor(role);

        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-white rounded-lg w-fit">
            <div className={`h-2 w-2 rounded-full ${colorClass}`}></div>
            <span className="whitespace-nowrap">{displayRole}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("status") as boolean;

        if (isActive) {
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-sm font-medium bg-green-50 text-green-600 border border-green-200">
              <CheckCircle2 className="w-4 h-4 mr-1 stroke-2" />
              Aktif
            </span>
          );
        } else {
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-sm font-medium bg-red-50 text-red-600 border border-red-200">
              <XCircle className="w-4 h-4 mr-1 stroke-2" />
              Nonaktif
            </span>
          );
        }
      },
    },
    {
      id: "actions",
      size: 10,
      cell: ({ row }) => {
        const employee = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {employee.role != "admin" && (
                  <Button
                    variant="ghost"
                    className="relative w-8 h-8 p-0 hover:bg-gray-100"
                  >
                    <MoreHorizontal className="absolute w-4 h-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  onClick={() => handleEdit(employee.id)}
                  className="cursor-pointer"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Ubah
                </DropdownMenuItem>
                {employee.status ? (
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={() => onDelete(employee.id)}
                  >
                    <XCircle className="w-4 h-4 mr-2 text-red-600" />
                    Nonaktif
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="text-green-600 cursor-pointer"
                    onClick={() => onReactivate(employee.id)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                    Aktifkan
                  </DropdownMenuItem>
                )}
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
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
                    Tidak ada data pegawai
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 0 && (
        <div className="flex justify-end gap-2 mt-4">
          {getPaginationButtons()}
        </div>
      )}

      {/* Add the DeleteConfirmationModal */}
      {/* <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
        title="Nonaktifkan Pegawai"
        description="Apakah anda yakin ingin menonaktifkan pegawai ini?"
      /> */}

      {/* Add the EditEmployeeForm */}
      <Sheet
        open={editModalOpen}
        onOpenChange={(open) => {
          setEditModalOpen(open);
          if (!open) {
            onEditComplete?.();
          }
        }}
      >
        {employeeToEdit && (
          <EditEmployeeForm
            employeeId={employeeToEdit}
            isOpen={editModalOpen}
            onOpenChange={setEditModalOpen}
            setSubmitting={setIsEditSubmitting}
          />
        )}
      </Sheet>
    </>
  );
};

export default EmployeeTable;
