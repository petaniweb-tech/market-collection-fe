import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useStores, useDeleteStore } from "../../hooks/useStore";
import FormStore from "../form/FormStore";
import StoreTable from "../table/StoreTable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDeleteDialog } from "../dialog/ConfirmationDeleteDialog";
import LocationComboBox from "../combobox/LocationComboBox";

const Store = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState("");

  const { toast } = useToast();

  // Get stores with filters
  const {
    data: storeData,
    isLoading,
    refetch,
  } = useStores({
    page,
    limit,
    sort: "name",
    order: sortOrder,
    search: searchTerm || undefined,
  });

  const { mutateAsync: deleteStore } = useDeleteStore();

  const stores = storeData?.records || [];
  const totalPages = storeData?.totalPage || 1;
  const totalStores = storeData?.total || 0;

  React.useEffect(() => {
    if (!isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  // const handleSortChange = (value: string) => {
  //   setSortOrder(value === "terbaru" ? "desc" : "asc");
  // };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteRequest = (id: string) => {
    setStoreToDelete(id);
    setShowDeleteModal(true);
  };

  const handleLocationChange = (value: string) => {
    console.log("Selected location:", value);
    setSelectedLocation(value);
    setPage(1); // Reset to first page when location changes
  };

  const handleDeleteConfirm = async () => {
    if (!storeToDelete) return;

    try {
      await deleteStore(storeToDelete);
      toast({
        title: "Berhasil menghapus lapak",
        description: "Data lapak telah dihapus dari sistem",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Gagal menghapus lapak",
        description: "Terjadi kesalahan saat menghapus data lapak",
        variant: "destructive",
      });
      console.error("Delete store error:", error);
    } finally {
      setShowDeleteModal(false);
      setStoreToDelete(null);
    }
  };

  return (
    <div className="h-full min-h-screen px-16 py-14 bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold">Manajemen Lapak</h1>
          <p className="text-gray-500">
            Atur dan kelola semua informasi lapak dalam sistem
          </p>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="bg-[#282828] rounded-full hover:bg-orange-600">
              + Tambah Lapak
            </Button>
          </SheetTrigger>
          <FormStore
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
            {totalStores} Data Lapak{" "}
          </span>
          <span>ditampilkan</span>
        </div>

        {/* Right side search and filter */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Cari nama lapak"
              className="w-64 py-2 pl-8 pr-4 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-2 top-1/2" />
          </div>

          <LocationComboBox
            value={selectedLocation}
            onChange={handleLocationChange}
            placeholder="Lokasi"
          />
        </div>
      </div>

      <StoreTable
        data={stores}
        isLoading={isLoading}
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
        title="Hapus Lapak"
        description="Apakah anda yakin ingin menghapus data lapak ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
};

export default Store;
