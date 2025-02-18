import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function RejectionSheet({ open, onClose, onSubmit }) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="p-4 rounded-t-xl bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
        <div className="space-y-4">
          <h3 className="mb-8 text-lg font-medium">Tolak konfirmasi</h3>
          <p className="text-sm text-gray-500">Tulis catatan</p>
          
          <Textarea 
            placeholder="Masukkan catatan"
            className="w-full min-h-[120px] resize-none "
          />

          <Button 
            onClick={onSubmit}
            className="w-full py-6 bg-gradient-to-b from-[#FE8300] to-[#ED3400] text-white rounded-full hover:bg-orange-600"
          >
            Kirim
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
