import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SheetContent } from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateLocation, useLocation } from "../../hooks/useLocation";
import { useToast } from "@/hooks/use-toast";
import LocationSquare from "@/assets/icon/ic_location_square.svg";
import type { UpdateLocationDTO } from "../../types/location.types";
import DistrictComboBox from "@/components/common/comboBox/DistrictComboBox";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SkeletonSheet } from "../loading/SkeletonSheet";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Nama lokasi harus diisi" }),
  description: z.string().min(1, { message: "Keterangan harus diisi" }),
  district: z.string().min(1, { message: "Kecamatan harus dipilih" }),
});

type FormValues = z.infer<typeof formSchema>;

interface EditLocationFormProps {
  locationId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  setSubmitting: (loading: boolean) => void;
}

const EditLocationForm = ({
  locationId,
  onOpenChange,
  setSubmitting,
}: EditLocationFormProps) => {
  const { data: location, isLoading } = useLocation(locationId);
  const updateLocation = useUpdateLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      district: "",
    },
  });

  // Load location data when available
  useEffect(() => {
    if (location) {
      form.reset({
        name: location.name,
        description: location.description,
        district: location.district_id || "",
      });
    }
  }, [location, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);

      // Transform form values to match API expectations
      const locationData: UpdateLocationDTO = {
        name: values.name,
        description: values.description,
        district_id: values.district,
      } as unknown as UpdateLocationDTO;

      await updateLocation.mutateAsync({
        id: locationId,
        data: locationData,
      });

      toast({
        title: "Berhasil mengubah lokasi",
        description: "Data lokasi telah berhasil diperbarui",
      });

      form.reset();
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update location:", error);
      toast({
        title: "Gagal mengubah lokasi",
        description: "Terjadi kesalahan saat memperbarui data lokasi",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SheetContent className="w-full max-w-md rounded-lg sm:max-w-lg">
        <SkeletonSheet />
      </SheetContent>
    );
  }

  return (
    <SheetContent className="w-full max-w-md rounded-lg sm:max-w-lg">
      <div className="pt-6">
        <div className="">
          <img src={LocationSquare} alt="Location" className="mb-6" />

          <div className="mb-7">
            <h2 className="text-xl font-semibold">Edit lokasi</h2>
            <div className="font-normal text-[#909090]">
              Perbarui informasi lokasi dalam sistem
            </div>
            <div className="h-px mt-4 bg-gray-200"></div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lokasi</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan Nama Lokasi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kecamatan</FormLabel>
                  <FormControl>
                    <DistrictComboBox
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pilih Kecamatan"
                      isInsideSheet={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan Keterangan Lokasi"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-3">
              <Button
                className="rounded-full"
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 rounded-full hover:bg-orange-600"
                disabled={updateLocation.isPending}
              >
                {updateLocation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </SheetContent>
  );
};

export default EditLocationForm;
