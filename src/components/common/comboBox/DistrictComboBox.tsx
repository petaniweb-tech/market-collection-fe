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
import { useDistricts } from "@/hooks/useDistrict";

interface DistrictComboBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isInsideSheet?: boolean;
}

const DistrictComboBox = ({
  value,
  onChange,
  placeholder = "Pilih Kecamatan",
  isInsideSheet = false,
}: DistrictComboBoxProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedDistrictName, setSelectedDistrictName] =
    React.useState<string>("");

  // Fetch districts using the hook
  const { data: districtData, isLoading } = useDistricts({
    search: searchTerm || undefined,
    limit: 5,
    order: "asc",
  });

  const districts = districtData?.records || [];

  // Effect to update selected district name when districts change or value changes
  React.useEffect(() => {
    if (value && districts.length > 0) {
      const district = districts.find((dist) => dist.id === value);
      if (district) {
        setSelectedDistrictName(district.name);
      }
    }
  }, [value, districts]);

  // Effect to fetch initial selected district name if not in current results
  React.useEffect(() => {
    const fetchInitialDistrict = async () => {
      if (
        value &&
        !selectedDistrictName &&
        !districts.find((dist) => dist.id === value)
      ) {
        try {
          const response = await fetch(`/api/districts/${value}`);
          const district = await response.json();
          if (district && district.name) {
            setSelectedDistrictName(district.name || "");
          }
        } catch (error) {
          console.error("Error fetching district:", error);
        }
      }
    };

    fetchInitialDistrict();
  }, [value, selectedDistrictName, districts]);

  const handleSelect = (districtId: string, districtName: string) => {
    if (value === districtId) {
      onChange("");
      setSelectedDistrictName("");
    } else {
      onChange(districtId);
      setSelectedDistrictName(districtName);
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
          ) : selectedDistrictName ? (
            selectedDistrictName
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
            placeholder="Cari kecamatan..."
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
          ) : districts.length > 0 ? (
            districts.map((district) => (
              <div
                key={district.id}
                className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 rounded-sm"
                onClick={() => handleSelect(district.id, district.name)}
              >
                <div className="w-4 h-4">
                  {value === district.id && <Check className="w-4 h-4" />}
                </div>
                {district.name}
              </div>
            ))
          ) : (
            <div className="py-2 text-sm text-center text-gray-500">
              Kecamatan tidak ditemukan
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DistrictComboBox;
