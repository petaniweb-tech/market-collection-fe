import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Power, PowerOff } from "lucide-react";

interface ConfirmationEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  variant: "activate" | "deactivate";
  title?: string;
  description?: string;
}

const ConfirmationEmployeeDialog = ({
  open,
  onOpenChange,
  onConfirm,
  variant = "deactivate",
  title,
  description,
}: ConfirmationEmployeeDialogProps) => {
  const isDeactivate = variant === "deactivate";

  const defaultTitle = isDeactivate
    ? "Nonaktifkan pegawai"
    : "Aktifkan pegawai";
  const defaultDescription = isDeactivate
    ? "Apakah anda yakin ingin menonaktifkan pegawai ini dari sistem?"
    : "Apakah anda yakin ingin mengaktifkan kembali pegawai ini dari sistem?";

  const buttonText = isDeactivate ? "Nonaktifkan" : "Aktifkan";
  const IconComponent = isDeactivate ? PowerOff : Power;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute text-gray-500 right-4 top-4 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center pt-6">
          <div
            className={`p-4 rounded-full mb-4 ${
              isDeactivate ? "bg-red-50" : "bg-green-50"
            }`}
          >
            <IconComponent
              className={`w-6 h-6 ${
                isDeactivate ? "text-red-500" : "text-green-500"
              }`}
            />
          </div>

          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              {title || defaultTitle}
            </DialogTitle>
            <p className="mt-2 text-center text-gray-500">
              {description || defaultDescription}
            </p>
          </DialogHeader>

          <div className="flex w-full gap-3 mt-8">
            <Button
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              variant={isDeactivate ? "destructive" : "default"}
              className={`flex-1 rounded-full ${
                !isDeactivate &&
                "bg-gradient-to-b from-[#FE7A00] to-[#ED3400] hover:bg-orange-600"
              }`}
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationEmployeeDialog;
