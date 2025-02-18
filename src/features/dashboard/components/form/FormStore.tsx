import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { User } from "lucide-react";
import { useCreateStore, useStores } from "../../hooks/useStore";
import { CreateStoreDTO } from "../../types";
// import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface FormStoreProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  setSubmitting: (loading: boolean) => void;
}

const FormLocation = ({ onOpenChange, setSubmitting }: FormStoreProps) => {
  const createStore = useCreateStore();
  const { refetch } = useStores();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const storeData: CreateStoreDTO = {
      store_name: formData.get("store_name") as string,
      desc: formData.get("desc") as string,
      location: formData.get("location") as string,
      retribution: formData.get("retribution") as string,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      setSubmitting(true);
      onOpenChange(false); // Close the sheet
      await createStore.mutateAsync(storeData);
      await refetch();
      form.reset(); // Reset the form
    } catch (error) {
      console.error("Failed to create employee:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SheetContent className="w-full max-w-md sm:max-w-lg">
      <SheetHeader>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <User className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <SheetTitle className="text-xl font-semibold">
              Tambah Lapak baru
            </SheetTitle>
            <p className="text-sm text-gray-500">
              Cupcake ipsum dolor sit amet jellybeans
            </p>
          </div>
        </div>
      </SheetHeader>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Lapak</label>
          <Input
            name="store_name"
            placeholder="Masukkan Nama Lapak"
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Lokasi</label>
          <Input
            name="location"
            placeholder="Masukkan Lokasi"
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Nominal Retribusi Harian
          </label>
          <Input
            name="retribution"
            placeholder="Masukkan Nominal Retribusi Harian"
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Keterangan</label>
          <Input
            name="desc"
            placeholder="Masukkan Keterangan"
            className="w-full"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600"
            disabled={createStore.isPending}
          >
            {createStore.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </SheetContent>
  );
};

export default FormLocation;
