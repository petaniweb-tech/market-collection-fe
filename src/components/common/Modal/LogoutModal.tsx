import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  
  interface LogoutModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
  }
  
  export function LogoutModal({ 
    open, 
    onOpenChange, 
    onConfirm 
  }: LogoutModalProps) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
          className="sm:max-w-[425px] rounded-2xl p-0 overflow-hidden"
        >
          <div className="relative">
            {/* Close button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute w-8 h-8 rounded-full top-4 right-4 hover:bg-gray-100"
              onClick={() => onOpenChange(false)}
            >
           
            </Button>
  
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-red-50">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="w-8 h-8 text-red-500"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
              </div>
  
              <DialogHeader className="text-center">
                <DialogTitle className="mb-2 text-xl font-semibold">
                  Keluar Aplikasi
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Apakah anda yakin ingin keluar dari aplikasi?
                </DialogDescription>
              </DialogHeader>
  
              <DialogFooter className="flex justify-center gap-4 mt-6">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  Batal
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={onConfirm}
                >
                  Keluar
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }