/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/Employee.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import {
  useEmployees,
  useDeleteEmployee,
  useReactivateEmployee,
} from "../../hooks/useEmployee";
import FormEmployee from "../form/FormEmployee";
import EmployeeTable from "../table/EmployeeTable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LocationComboBox from "../combobox/LocationComboBox";
import ConfirmationEmployeeDialog from "../dialog/ConfimationEmployeeDialog";
import { usePermissions } from "@/hooks/usePermission";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Unauthorized from "@/components/common/unauthorize/Unauthorize";
import { Navigate } from "@tanstack/react-router";

type TabOption = "semua" | "collector" | "kepala" | "dinas";

const Employee = () => {
  const { isAuthenticated } = useAuth();
  const { isAdmin } = usePermissions();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [activeTab, setActiveTab] = useState<TabOption>("semua");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: string;
    status: boolean;
  } | null>(null);
  const [filterColumns, setFilterColumns] = useState<string[]>([]);
  const [filterValues, setFilterValues] = useState<string[]>([]);

  const { toast } = useToast();

  // Convert UI tab values to API role filter values
  const getRoleFilter = (): string | undefined => {
    switch (activeTab) {
      case "collector":
        return "collector";
      case "kepala":
        return "manager";
      case "dinas":
        return "supervisor";
      default:
        return undefined;
    }
  };

  // Get employees with filters
  const {
    data: employeeData,
    isLoading,
    refetch,
  } = useEmployees({
    page,
    limit,
    sort: "name",
    order: sortOrder,
    search: searchTerm || undefined,
    filter_column: filterColumns.length > 0 ? filterColumns : null,
    filter_value: filterValues.length > 0 ? filterValues : null,
  });

  const { mutateAsync: deleteEmployee, isSuccess: isSuccessDelete } =
    useDeleteEmployee();
  const { mutateAsync: reactivateEmployee, isSuccess: isSuccessReactivate } =
    useReactivateEmployee();

  const employees = employeeData?.records || [];
  const totalPages = employeeData?.totalPage || 1;

  useEffect(() => {
    if (!isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  // Update filters when tab/role changes
  useEffect(() => {
    updateFilters();
  }, [activeTab, selectedLocation]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    setPage(1); // Reset to first page when location changes
  };

  const handleRoleChange = (value) => {
    setActiveTab(value);
    setPage(1);
  };

  const updateFilters = () => {
    const newColumns: string[] = [];
    const newValues: string[] = [];

    // Add role filter if not "semua"
    if (activeTab !== "semua") {
      newColumns.push("role");

      let roleValue: string;
      switch (activeTab) {
        case "collector":
          roleValue = "collector";
          break;
        case "kepala":
          roleValue = "manager";
          break;
        case "dinas":
          roleValue = "supervisor";
          break;
        default:
          roleValue = "";
      }

      newValues.push(roleValue);
    }

    // Add location filter if selected
    if (selectedLocation) {
      newColumns.push("location");
      newValues.push(selectedLocation);
    }

    setFilterColumns(newColumns);
    setFilterValues(newValues);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusChange = async () => {
    if (!selectedEmployee) return;

    try {
      if (selectedEmployee.status) {
        await deleteEmployee(selectedEmployee.id);
        toast({
          title: "Berhasil menonaktifkan pegawai",
          description: "Status pegawai telah dinonaktifkan",
        });
      } else {
        await reactivateEmployee(selectedEmployee.id);
        toast({
          title: "Berhasil mengaktifkan pegawai",
          description: "Status pegawai telah diaktifkan",
        });
      }
      await refetch();
    } catch (error) {
      console.error("Failed to update employee status:", error);
      toast({
        title: "Gagal mengubah status pegawai",
        description:
          error?.message || "Terjadi kesalahan saat mengubah status pegawai",
        variant: "destructive",
      });
    } finally {
      setStatusDialogOpen(false);
      setSelectedEmployee(null);
    }
  };

  const handleDelete = (id: string) => {
    setSelectedEmployee({ id, status: true });
    setStatusDialogOpen(true);
  };

  const handleReactivate = (id: string) => {
    setSelectedEmployee({ id, status: false });
    setStatusDialogOpen(true);
  };

  // const handleReactivate = async (id: string) => {
  //   try {
  //     await reactivateEmployee(id);

  //     if (isSuccessReactivate) {
  //       refetch();
  //       toast({
  //         title: "Berhasil mengaktifkan pegawai",
  //         description: "Data pegawai telah diaktifkan kembali",
  //       });
  //     } else {
  //       toast({
  //         title: "Gagal mengaktifkan pegawai",
  //         description: "Terjadi kesalahan saat mengaktifkan data pegawai",
  //         variant: "destructive",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Delete employee error:", error);
  //   }
  // };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Show unauthorized page if user is not an admin
  if (!isAdmin()) {
    return <Unauthorized />;
  }

  return (
    <div className="h-full min-h-screen px-16 py-14 bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold">Manajemen Pegawai</h1>
          <p className="text-gray-500">
            Kelola status dan informasi pegawai dengan fleksibel
          </p>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="bg-[#282828] rounded-full py-4 px-7 hover:bg-orange-600">
              + Tambah Pegawai
            </Button>
          </SheetTrigger>
          <FormEmployee
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            setSubmitting={setIsSubmitting}
          />
        </Sheet>
      </div>

      <div className="flex items-center justify-between mb-6">
        {/* Left side tabs */}
        <div className="flex overflow-hidden bg-gray-100 rounded-lg">
          <Button
            className={`px-4 py-2 text-normal font-medium shadow-none border-none transition-all duration-300 ease-in-out ${
              activeTab === "semua"
                ? "bg-gradient-to-r from-[#FE7A00] to-[#ED3400] text-white"
                : "bg-transparent text-[#7D7D7D] hover:bg-white hover:bg-opacity-30"
            }`}
            onClick={() => handleRoleChange("semua")}
          >
            Semua
          </Button>

          <Button
            variant={activeTab === "collector" ? "default" : "ghost"}
            className={`px-4 py-2 text-normal font-medium shadow-none border-none transition-all duration-300 ease-in-out ${
              activeTab === "collector"
                ? "bg-gradient-to-r from-[#FE7A00] to-[#ED3400] text-white"
                : "bg-transparent text-[#7D7D7D] hover:bg-white hover:bg-opacity-30"
            }`}
            onClick={() => handleRoleChange("collector")}
          >
            Collector Lapak
          </Button>

          <Button
            variant={activeTab === "kepala" ? "default" : "ghost"}
            className={`px-4 py-2 text-normal font-medium shadow-none border-none transition-all duration-300 ease-in-out ${
              activeTab === "kepala"
                ? "bg-gradient-to-r from-[#FE7A00] to-[#ED3400] text-white"
                : "bg-transparent text-[#7D7D7D] hover:bg-white hover:bg-opacity-30"
            }`}
            onClick={() => handleRoleChange("kepala")}
          >
            Kepala Lokasi
          </Button>

          <Button
            variant={activeTab === "dinas" ? "default" : "ghost"}
            className={`px-4 py-2 text-normal font-medium shadow-none border-none transition-all duration-300 ease-in-out ${
              activeTab === "dinas"
                ? "bg-gradient-to-r from-[#FE7A00] to-[#ED3400] text-white"
                : "bg-transparent text-[#7D7D7D] hover:bg-white hover:bg-opacity-30"
            }`}
            onClick={() => handleRoleChange("dinas")}
          >
            Dinas Perdagangan Kota
          </Button>
        </div>

        {/* Right side search and filter */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Cari nama pegawai"
              className="w-64 py-2 pl-8 pr-4 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-2 top-1/2" />
          </div>

          <LocationComboBox
            value={selectedLocation}
            onChange={handleLocationChange}
            placeholder="Lokasi Kerja"
          />
        </div>
      </div>

      <EmployeeTable
        data={employees}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        onDelete={handleDelete}
        onReactivate={handleReactivate}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onEditComplete={() => refetch()}
      />

      <ConfirmationEmployeeDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onConfirm={handleStatusChange}
        variant={selectedEmployee?.status ? "deactivate" : "activate"}
      />
    </div>
  );
};

export default Employee;
