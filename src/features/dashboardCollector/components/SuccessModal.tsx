import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function SuccessModal({ isOpen, onClose }) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger />
      <SheetContent side="bottom" className="rounded-t-xl bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
        <div className="flex flex-col items-center pt-16 pb-8">
          <div className="w-16 h-16 mb-12 bg-gray-100 rounded-full" />

          <h2 className="mb-2 text-xl font-medium text-gray-900">
            Setoran berhasil dibuat!
          </h2>
          <p className="mb-12 text-sm text-center text-gray-500">
            Kamu telah berhasil menanmbahkan setoran untuk lapak ini.
          </p>

          <div className="w-full">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-center text-gray-500">Nama Lapak</div>
              <div className="text-sm text-center ">Lapak Blok A1</div>
            </div>
            <div className="flex items-center justify-between mb-9">
              <div className="text-sm text-center text-gray-500">Nominal Setoran</div>
              <div className="text-sm text-center ">Rp 10.000</div>
            </div>
          </div>

          <Button
            onClick={onClose}
            className="w-full py-6 bg-gradient-to-b from-[#FE8300] to-[#ED3400] text-white rounded-full"
          >
            Selesai
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
