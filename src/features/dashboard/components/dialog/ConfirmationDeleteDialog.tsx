import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ConfirmationDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function ConfirmationDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Hapus lokasi",
  description = "Apakah anda yakin ingin menghapus data lokasi ini dari sistem?",
}: ConfirmationDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-lg">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute transition-opacity rounded-sm right-4 top-4 opacity-70 ring-offset-background hover:opacity-100"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03157 3.2184C3.80702 2.99385 3.44295 2.99385 3.2184 3.2184C2.99385 3.44295 2.99385 3.80702 3.2184 4.03157L6.68682 7.50005L3.2184 10.9685C2.99385 11.193 2.99385 11.5571 3.2184 11.7816C3.44295 12.0062 3.80702 12.0062 4.03157 11.7816L7.50005 8.31322L10.9685 11.7816C11.193 12.0062 11.5571 12.0062 11.7816 11.7816C12.0062 11.5571 12.0062 11.193 11.7816 10.9685L8.31322 7.50005L11.7816 4.03157Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="flex flex-col items-center pt-6">
          <div className="p-4 mb-4 rounded-full bg-red-50">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>

          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold">{title}</h2>
            <p className="text-gray-500">{description}</p>
          </div>

          <div className="flex w-full gap-3 mt-8">
            <Button
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              className="flex-1 rounded-full"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              Lanjutkan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}