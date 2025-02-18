import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { User } from "lucide-react";
import { useCreateEmployee, useEmployees } from "../../hooks/useEmployee";
import type { CreateEmployeeDTO } from "../../types";
// import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface FormEmployeeProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  setSubmitting: (loading: boolean) => void;
}

const FormEmployee = ({ onOpenChange, setSubmitting }: FormEmployeeProps) => {
  const createEmployee = useCreateEmployee();
  const { refetch } = useEmployees();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const employeeData: CreateEmployeeDTO = {
      name: formData.get("name") as string,
      nip: formData.get("nip") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      location: formData.get("location") as string,
      role: formData.get("role") as string,
      password: "defaultPassword", // Add appropriate logic to handle password
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      setSubmitting(true);
      onOpenChange(false);
      await createEmployee.mutateAsync(employeeData);
      await refetch(); // Refetch the data after successful creation
      form.reset();
    } catch (error) {
      console.error("Failed to create employee:", error);
    } finally {
      setSubmitting(false);
    }
  };

  //TODO: OFFLINE FIRST NEED TO RESEARCH MORE
  // const createEmployee = useCreateEmployee();
  // const isOnline = useOnlineStatus();
  // const [isSubmitting, setIsSubmitting] = React.useState(false);

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   try {
  //     setIsSubmitting(true);
  //     const form = e.currentTarget;
  //     const formData = new FormData(form);

  //     const employeeData: CreateEmployeeDTO = {
  //       name: formData.get('name') as string,
  //       nip: formData.get('nip') as string,
  //       phone: formData.get('phone') as string,
  //       email: formData.get('email') as string,
  //       location: formData.get('location') as string,
  //       role: formData.get('role') as string,
  //       password: 'defaultPassword', // Add appropriate logic to handle password
  //       created_at: new Date().toISOString(),
  //       updated_at: new Date().toISOString(),
  //     };

  //     // Use mutateAsync if online, mutate if offline
  //     if (isOnline) {
  //       await createEmployee.mutateAsync(employeeData);
  //     } else {
  //       createEmployee.mutate(employeeData);
  //     }

  //     form.reset();
  //     onOpenChange(false);
  //   } catch (error) {
  //     console.error('Failed to create employee:', error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <SheetContent className="w-full max-w-md sm:max-w-lg">
      <SheetHeader>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <User className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <SheetTitle className="text-xl font-semibold">
              Tambah pegawai baru
            </SheetTitle>
            <p className="text-sm text-gray-500">
              Cupcake ipsum dolor sit amet jellybeans
            </p>
          </div>
        </div>
      </SheetHeader>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Pegawai</label>
          <Input
            name="name"
            placeholder="Masukkan Nama Pegawai"
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">NIP</label>
          <Input
            name="nip"
            placeholder="Masukkan NIP"
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nomor HP</label>
          <Input
            name="phone"
            placeholder="Masukkan Nomor HP"
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            name="email"
            type="email"
            placeholder="Masukkan Email"
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Lokasi</label>
          <Select name="location" required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Lokasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lowokwaru">Lowokwaru</SelectItem>
              <SelectItem value="klojen">Klojen</SelectItem>
              <SelectItem value="blimbing">Blimbing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Role / Level</label>
          <Select name="role" required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Role / Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Collector Lapak">Collector Lapak</SelectItem>
              <SelectItem value="Kepala Lokasi">Kepala Lokasi</SelectItem>
              <SelectItem value="Dinas Perdagangan Kota">
                Dinas Perdagangan Kota
              </SelectItem>
            </SelectContent>
          </Select>
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
            disabled={createEmployee.isPending}
          >
            {createEmployee.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </SheetContent>
  );
};

export default FormEmployee;
