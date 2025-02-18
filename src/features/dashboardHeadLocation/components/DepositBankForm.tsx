import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import BillIcon from "@/assets/icon/ic_bill.svg";
import { FileText, Trash2 } from "lucide-react"; // Import icons

interface FormData {
    nominal: string;
    buktiSetoran: File | null;
  }

export default function DepositBankForm({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState<FormData>({
    nominal: "",
    buktiSetoran: null,
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, buktiSetoran: file });
    }
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, buktiSetoran: null });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger />
      <SheetContent
        side="bottom"
        className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-b from-gradients-background-from to-gradients-background-to rounded-t-3xl"
      >
        <h2 className="mb-6 text-xl font-semibold">Setoran ke Bank</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Nominal Input */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Nominal Setoran</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                Rp
              </span>
              <Input
                type="number"
                value={formData.nominal}
                onChange={(e) =>
                  setFormData({ ...formData, nominal: e.target.value })
                }
                placeholder="0"
                className="h-12 pl-12 bg-transparent"
              />
            </div>
          </div>

          {/* Upload Section */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Bukti Setoran</label>
            {formData.buktiSetoran ? (
              // Show file name and delete button when file is selected
              <div className="flex items-center justify-between p-4 border-2 border-[#282828] border-opacity-20 border-dashed rounded-xl">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-600">
                    {formData.buktiSetoran.name}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                   className="w-8 h-8 text-red-400 rounded-lg bg-[#F22225] bg-opacity-5 hover:bg-red-100 hover:text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              // Show upload UI when no file is selected
              <div className="flex flex-col items-center border-2 border-[#282828] border-opacity-20 border-dashed p-7 rounded-xl ">
                <img src={BillIcon} alt="Profile" className="mb-4" />
                <p className="mb-3 text-sm text-gray-600">
                  Upload struk setoran dari Bank
                </p>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('file-upload')?.click();
                  }}
                  variant="ghost"
                  className="relative px-4 py-2 text-sm text-black group hover:bg-transparent hover:text-orange-500"
                >
                  <div className="absolute inset-0 rounded-full bg-[#F24D01] opacity-[0.02]" />
                  <div className="absolute inset-0 border-2 border-[#F24D01] border-opacity-[0.14] rounded-full" />
                  <span className="relative flex items-center">Pilih file</span>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-b from-[#FE8300] to-[#ED3400] text-white rounded-full"
          >
            Buat Bukti Setoran
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}