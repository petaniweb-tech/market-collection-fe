import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CollectorForm({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    namaLapak: "",
    nominal: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetTrigger />
        <SheetContent
          side="bottom"
          className="fixed bottom-0 left-0 right-0 p-4 bg-white rounded-t-xl animate-in slide-in-from-bottom"
        >
          <h2 className="mb-6 text-lg font-medium">Form Setoran</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="namaLapak"
                className="block mb-2 text-sm font-medium"
              >
                Nama Lapak
              </label>
              <Select>
                <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none">
                  <SelectValue placeholder="Lapak Blok A3" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a1">Lapak Blok A1</SelectItem>
                  <SelectItem value="a2">Lapak Blok A2</SelectItem>
                  <SelectItem value="a3">Lapak Blok A3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="nominal"
                className="block mb-2 text-sm font-medium"
              >
                Nominal Setoran
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                  Rp
                </span>
                <input
                  id="nominal"
                  type="text"
                  value={formData.nominal}
                  onChange={(e) =>
                    setFormData({ ...formData, nominal: e.target.value })
                  }
                  placeholder="10.000"
                  className="w-full py-3 pl-12 pr-4 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full text-white bg-orange-500 hover:bg-orange-600"
            >
              Buat Setoran
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
