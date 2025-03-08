import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useStore } from "@/features/dashboard/hooks/useStore";
import { Store } from "@/features/dashboard/types/store.types";
import { CheckCircle } from "lucide-react";
import lottie from "lottie-web";
import successAnimation from "@/assets/lotties/lottie_success.json";
import { useEffect, useRef } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  depositData?: {
    merchant?: Store;
    merchant_id: string;
    deposit_amount: number;
    is_open: boolean;
    target_amount?: number;
  };
}

export default function SuccessModal({
  isOpen,
  onClose,
  depositData,
}: SuccessModalProps) {
  const { data: merchant } = useStore(depositData?.merchant_id || "");
  const animationContainer = useRef<HTMLDivElement>(null);

  // Format number as currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("id-ID").replace(/,/g, ".");
  };

  useEffect(() => {
    let animationInstance: any = null;

    if (isOpen) {
      // Use requestAnimationFrame to ensure DOM is ready
      const animationFrame = requestAnimationFrame(() => {
        if (animationContainer.current) {
          // Load Lottie animation
          animationInstance = lottie.loadAnimation({
            container: animationContainer.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: successAnimation,
          });

          // Apply styles to SVG elements after a delay to ensure the SVG is loaded
          setTimeout(() => {
            if (animationContainer.current) {
              const svg = animationContainer.current.querySelector("svg");
              if (svg) {
                svg.style.width = "100%";
                svg.style.height = "100%";
                svg.style.borderRadius = "50%";
                svg.style.overflow = "hidden";

                const backgroundElements = svg.querySelectorAll(
                  'rect[fill="rgb(255,255,255)"], rect[fill="#FFFFFF"], rect[fill="#ffffff"]'
                );
                backgroundElements.forEach((el) => {
                  el.parentNode?.removeChild(el);
                });
              }
            }
          }, 100);
        }
      });

      return () => {
        cancelAnimationFrame(animationFrame);
        if (animationInstance) {
          animationInstance.destroy();
        }
      };
    }
  }, [isOpen]);
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger />
      <SheetContent
        side="bottom"
        className="rounded-t-xl bg-gradient-to-b from-gradients-background-from to-gradients-background-to"
      >
        <div className="flex flex-col items-center pt-16 pb-8">
          <div className="flex items-center justify-center w-24 h-24 mb-12 overflow-hidden bg-orange-500 rounded-full">
            <div ref={animationContainer} className="w-full h-full" />
          </div>

          <h2 className="mb-2 text-xl font-medium text-gray-900">
            Setoran berhasil dibuat!
          </h2>
          <p className="mb-12 text-sm text-center text-gray-500">
            Kamu telah berhasil menambahkan setoran untuk lapak ini.
          </p>

          <div className="w-full">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-500">Nama Lapak</div>
              <div className="text-sm font-medium">
                {merchant?.name || "Lapak"}
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-500">Target Setoran</div>
              <div className="text-sm font-medium">
                {merchant?.expected_deposit_amount
                  ? `Rp ${formatCurrency(merchant?.expected_deposit_amount)}`
                  : "Rp 0"}
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-500">Status</div>
              <div className="text-sm font-medium">
                {depositData?.is_open ? "Buka" : "Tutup"}
              </div>
            </div>
            <div className="flex items-center justify-between mb-9">
              <div className="text-sm text-gray-500">Nominal Setoran</div>
              <div className="text-sm font-medium">
                {depositData?.deposit_amount
                  ? `Rp ${formatCurrency(depositData.deposit_amount)}`
                  : "Rp 0"}
              </div>
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
