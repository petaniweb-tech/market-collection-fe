// pages/Employee.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useEmployees } from '../hooks/useEmployee';
import FormEmployee from "./form/FormEmployee";
import EmployeeTable from "./table/EmployeeTable";

const Employee = () => {
  const { data: employees = [], isLoading, refetch } = useEmployees();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  return (
    <div className="h-full min-h-screen px-16 py-14 bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold">Manajemen Pegawai</h1>
          <p className="text-gray-500">
            Cupcake ipsum dolor sit amet jellybeans
          </p>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="bg-[#282828] rounded-full hover:bg-orange-600">
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

      <div className="flex justify-between mb-4 bg-white rounded-lg p-7 bg-opacity-40">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-gradient-to-b from-[#FE8300] to-[#ED3400] text-white"
          >
            Semua
          </Button>
          <Button variant="outline" className="text-gray-700 hover:bg-gray-100">
            Collector Lapak
          </Button>
          <Button variant="outline" className="text-gray-700 hover:bg-gray-100">
            Kepala Lokasi
          </Button>
          <Button variant="outline" className="text-gray-700 hover:bg-gray-100">
            Dinas Perdagangan Kota
          </Button>
        </div>

        <div className="flex justify-end gap-2">
          <Select defaultValue="lowokwaru">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lowokwaru">Lowokwaru</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="terbaru">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="terbaru">Terbaru</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <EmployeeTable 
        data={employees}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Employee;