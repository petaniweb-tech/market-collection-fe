import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function SuccessModal({ isOpen, onClose, title, desc}) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetTrigger />
        <SheetContent side="bottom" className="rounded-t-xl bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
          <div className="flex flex-col items-center pt-16 pb-8">
            <div className="w-16 h-16 mb-12 bg-gray-100 rounded-full" />
            
            <h2 className="mb-2 text-xl font-medium text-gray-900">
              {title}
            </h2>
            <p className="mb-12 text-sm text-center text-gray-500">
              {desc}
            </p>
  
            <Button 
              onClick={onClose}
              className="w-full bg-gradient-to-b from-[#FE8300] to-[#ED3400] text-white rounded-full"
            >
              Selesai
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }