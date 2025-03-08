import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useStores } from "@/features/dashboard/hooks/useStore";
import { Store } from "@/features/dashboard/types/store.types";

interface MerchantComboBoxProps {
  value: string;
  onChange: (value: string, data?: Store) => void;
  placeholder?: string;
  isInsideSheet?: boolean;
}

const MerchantComboBox = ({
  value,
  onChange,
  placeholder = "Pilih Lapak",
  isInsideSheet = false,
}: MerchantComboBoxProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedMerchantName, setSelectedMerchantName] = React.useState<string>("");

  // Fetch merchants using the hook
  const { data: merchantData, isLoading } = useStores({
    search: searchTerm || undefined,
    // limit: 5,
    order: "asc",
  });

  const merchants = merchantData?.records || [];

  // Effect to update selected merchant name when merchants change or value changes
  React.useEffect(() => {
    if (value && merchants.length > 0) {
      const merchant = merchants.find((merch) => merch.id === value);
      if (merchant) {
        setSelectedMerchantName(merchant.name);
      }
    }
  }, [value, merchants]);

  // Effect to fetch initial selected merchant name if not in current results
  React.useEffect(() => {
    const fetchInitialMerchant = async () => {
      if (value && !selectedMerchantName && !merchants.find(merch => merch.id === value)) {
        try {
          // Fetch a single merchant
          const response = await fetch(`/api/stores/${value}`);
          const merchant = await response.json();
          if (merchant && merchant.name) {
            setSelectedMerchantName(merchant.name || "");
          }
        } catch (error) {
          console.error('Error fetching merchant:', error);
        }
      }
    };

    fetchInitialMerchant();
  }, [value, selectedMerchantName, merchants]);

  const handleSelect = (merchant: Store) => {
    if (value === merchant.id) {
      onChange("", undefined);
      setSelectedMerchantName("");
    } else {
      onChange(merchant.id, merchant);
      setSelectedMerchantName(merchant.name);
    }
    setSearchTerm("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between w-44",
            isInsideSheet
              ? "bg-white focus:ring-1 focus:ring-orange-400 w-full border border-input"
              : "border-0 border-input"
          )}
        >
          {isLoading ? (
            <Skeleton className="h-4 w-[100px]" />
          ) : selectedMerchantName ? (
            selectedMerchantName
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "p-2",
          isInsideSheet ? "w-[--radix-popover-trigger-width]" : "w-44"
        )}
        align="start"
        sideOffset={4}
      >
        <div className="relative mb-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Cari lapak..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        <div className="max-h-[200px] overflow-auto">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="px-2 py-1.5">
                  <Skeleton className="w-full h-4" />
                </div>
              ))
          ) : merchants.length > 0 ? (
            merchants.map((merchant) => (
              <div
                key={merchant.id}
                className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 rounded-sm"
                onClick={() => handleSelect(merchant)}
              >
                <div className="w-4 h-4">
                  {value === merchant.id && <Check className="w-4 h-4" />}
                </div>
                {merchant.name}
              </div>
            ))
          ) : (
            <div className="py-2 text-sm text-center text-gray-500">
              Pedagang tidak ditemukan
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MerchantComboBox;