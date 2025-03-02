import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useLocations } from "../../hooks/useLocation";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface LocationComboBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isInsideSheet?: boolean;
}

const LocationComboBox = ({
  value,
  onChange,
  placeholder = "Pilih Lokasi",
  isInsideSheet = false,
}: LocationComboBoxProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedLocationName, setSelectedLocationName] =
    React.useState<string>("");

  // Fetch locations using the hook
  const { data: locationData, isLoading } = useLocations({
    search: searchTerm || undefined,
    order: "asc",
  });

  const locations = useMemo(
    () => locationData?.records || [],
    [locationData?.records]
  );

  // Effect to update selected location name when locations change or value changes
  React.useEffect(() => {
    if (value && locations.length > 0) {
      const location = locations.find((loc) => loc.id === value);
      if (location) {
        setSelectedLocationName(location.name);
      }
    }
  }, [value, locations]);

  // Effect to fetch initial selected location name if not in current results
  React.useEffect(() => {
    const fetchInitialLocation = async () => {
      if (
        value &&
        !selectedLocationName &&
        !locations.find((loc) => loc.id === value)
      ) {
        try {
          // Assuming you have an API endpoint to fetch a single location
          const response = await fetch(`/api/locations/${value}`);
          const location = await response.json();
          if (location && location.name) {
            setSelectedLocationName(location.name || "");
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      }
    };

    fetchInitialLocation();
  }, [value, selectedLocationName, locations]);

  const handleSelect = (locationId: string, locationName: string) => {
    if (value === locationId) {
      onChange("");
      setSelectedLocationName("");
    } else {
      onChange(locationId);
      setSelectedLocationName(locationName);
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
          ) : selectedLocationName ? (
            selectedLocationName
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
            placeholder="Cari lokasi..."
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
          ) : locations.length > 0 ? (
            locations.map((location) => (
              <div
                key={location.id}
                className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 rounded-sm"
                onClick={() => handleSelect(location.id, location.name)}
              >
                <div className="w-4 h-4">
                  {value === location.id && <Check className="w-4 h-4" />}
                </div>
                {location.name}
              </div>
            ))
          ) : (
            <div className="py-2 text-sm text-center text-gray-500">
              Lokasi tidak ditemukan
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LocationComboBox;