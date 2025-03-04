import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useLocations, useDeleteLocation } from "../../hooks/useLocation";
import FormLocation from "../form/FormLocation";
import LocationTable from "../table/LocationTable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DistrictComboBox from "@/components/common/comboBox/DistrictComboBox";
import { ConfirmationDeleteDialog } from "../dialog/ConfirmationDeleteDialog";

const Location = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [filterColumns, setFilterColumns] = useState<string[]>([]);
  const [filterValues, setFilterValues] = useState<string[]>([]);

  const { toast } = useToast();

  // Get locations with filters
  const {
    data: locationData,
    isLoading,
    refetch,
  } = useLocations({
    page,
    limit,
    sort: "name",
    order: sortOrder,
    search: searchTerm || undefined,
    filter_column: filterColumns.length > 0 ? filterColumns : null,
    filter_value: filterValues.length > 0 ? filterValues : null,
  });

  const { mutateAsync: deleteLocation, isPending: isDeleting } =
    useDeleteLocation();

  const locations = locationData?.records || [];
  const totalPages = locationData?.totalPage || 1;
  const totalLocations = locationData?.total || 0;

  React.useEffect(() => {
    if (!isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    updateFilters();
  }, [selectedDistrict]);

  const updateFilters = () => {
    const newColumns: string[] = [];
    const newValues: string[] = [];

    if (selectedDistrict) {
      newColumns.push("district");
      newValues.push(selectedDistrict);
    }

    setFilterColumns(newColumns);
    setFilterValues(newValues);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleDistrictChange = (value: string) => {
    console.log("Selected location:", value);
    setSelectedDistrict(value);
    setPage(1); // Reset to first page when location changes
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteRequest = (id: string) => {
    setLocationToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!locationToDelete) return;

    try {
      await deleteLocation(locationToDelete);
      toast({
        title: "Berhasil menghapus lokasi",
        description: "Data lokasi telah dihapus dari sistem",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Gagal menghapus lokasi",
        description:
          error?.message || "Terjadi kesalahan saat menghapus lokasi",
        variant: "destructive",
      });
      console.error("Delete location error:", error);
    } finally {
      setShowDeleteModal(false);
      setLocationToDelete(null);
    }
  };

  return (
    <div className="h-full min-h-screen px-16 py-14 bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold">Manajemen Lokasi</h1>
          <p className="text-gray-500">
            Atur dan kelola semua informasi lokasi dalam sistem
          </p>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="bg-[#282828] rounded-full py-4 px-7 hover:bg-orange-600">
              + Tambah Lokasi
            </Button>
          </SheetTrigger>
          <FormLocation
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            setSubmitting={setIsSubmitting}
          />
        </Sheet>
      </div>

      <div className="flex items-center justify-between mb-6">
        {/* Left side total count */}
        <div>
          <span className="text-[#EE3701] font-semibold">
            {totalLocations} Data Lokasi
          </span>
          <span> ditampilkan</span>
        </div>

        {/* Right side search and filter */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Cari nama lokasi"
              className="w-64 py-2 pl-8 pr-4 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-2 top-1/2" />
          </div>

          {/* <Select 
            defaultValue="terbaru" 
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="bg-white border-0 min-w-32 focus:ring-1 focus:ring-orange-400">
              <SelectValue placeholder="Terbaru" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="terbaru">Terbaru</SelectItem>
              <SelectItem value="terlama">Terlama</SelectItem>
            </SelectContent>
          </Select> */}
          <DistrictComboBox
            value={selectedDistrict}
            onChange={handleDistrictChange}
            placeholder="Pilih Kecamatan"
          />
        </div>
      </div>

      <LocationTable
        data={locations}
        isLoading={isLoading || isDeleting}
        isSubmitting={isSubmitting}
        onDelete={handleDeleteRequest}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onEditComplete={() => refetch()}
      />

      <ConfirmationDeleteDialog
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Location;
