import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateCollectorDepositDTO } from "../../types";
import MerchantComboBox from "../combobox/MerchantComboBox";
import { useState } from "react";
import { Store } from "@/features/dashboard/types/store.types";

// Create a schema for form validation
const formSchema = z.object({
  merchant_id: z.string({
    required_error: "Nama pedagang harus dipilih",
  }),
  target_amount: z.number().optional(),
  deposit_amount: z
    .string()
    .min(1, "Nominal setoran tidak boleh kosong")
    .refine(
      (val) => !isNaN(Number(val.replace(/\./g, "").replace(/,/g, ""))),
      "Nominal harus berupa angka"
    )
    .transform((val) => Number(val.replace(/\./g, "").replace(/,/g, ""))),
  status: z.string().default("Buka"),
  is_open: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface CollectorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCollectorDepositDTO) => void;
}

export default function CollectorForm({
  isOpen,
  onClose,
  onSubmit,
}: CollectorFormProps) {
  const [selectedMerchant, setSelectedMerchant] = useState<Store | null>(null);
  const [showTargetAmount, setShowTargetAmount] = useState(false);

  // Initialize form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      merchant_id: "",
      target_amount: 0,
      deposit_amount: 0,
      status: "Buka",
      is_open: true,
    },
  });

  // This handles merchant selection from MerchantComboBox
  const handleMerchantSelect = (merchantId: string, merchantData?: Store) => {
    console.log(merchantId);
    console.log(merchantData);
    if (merchantData) {
      setSelectedMerchant(merchantData);
      setShowTargetAmount(true);
      form.setValue("merchant_id", merchantId);
      form.setValue("target_amount", merchantData.expected_deposit_amount);
    } else {
      setSelectedMerchant(null);
      setShowTargetAmount(false);
      form.setValue("merchant_id", "");
      form.setValue("target_amount", 0);
    }
  };

  if (!isOpen) return null;

  // Format currency input
  const formatCurrency = (value: string): string => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    // Format with thousand separators
    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleFormSubmit = (values: FormValues) => {
    if (!selectedMerchant) {
      return; // Don't submit if no merchant is selected
    }

    // Transform form values to DTO
    const depositData: CreateCollectorDepositDTO = {
      merchant_id: values.merchant_id,
      deposit_amount: values.deposit_amount,
      is_open: values.status === "Buka",
    };

    onSubmit(depositData);
    // console.log(depositData);

    // Reset form and state after submission
    form.reset();
    setSelectedMerchant(null);
    setShowTargetAmount(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetTrigger />
        <SheetContent
          side="bottom"
          className="fixed bottom-0 left-0 right-0 p-6 bg-white rounded-t-xl"
        >
          <h2 className="mb-6 text-xl font-medium">Form Setoran</h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="merchant_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600">
                      Nama Lapak
                    </FormLabel>
                    <FormControl>
                      <MerchantComboBox
                        value={field.value}
                        onChange={(value, data) =>
                          handleMerchantSelect(value, data)
                        }
                        placeholder="Pilih Lapak"
                        isInsideSheet={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showTargetAmount && selectedMerchant && (
                <div className="flex items-center justify-between px-4 py-2 bg-[#EE3701] bg-opacity-5 rounded-lg">
                  <span className="text-gray-600">Target Setoran</span>
                  <span className="font-medium text-orange-500">
                    Rp.{" "}
                    {selectedMerchant.expected_deposit_amount
                      .toLocaleString("id-ID")
                      .replace(/,/g, ".")}
                  </span>
                </div>
              )}

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600">
                      Status Lapak
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);

                        if (value === "Tutup") {
                          form.setValue("deposit_amount", "0");
                          form.setValue("is_open", false);
                        } else {
                          form.setValue("is_open", true);
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full py-3 bg-white border border-gray-200 rounded-lg focus:outline-none">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Buka">Buka</SelectItem>
                        <SelectItem value="Tutup">Tutup</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("status") !== "Tutup" && (
                <FormField
                  control={form.control}
                  name="deposit_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-600">
                        Nominal Setoran
                      </FormLabel>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                          Rp
                        </span>
                        <FormControl>
                          <Input
                            placeholder="0"
                            className="w-full py-3 pl-12 pr-4 bg-white border border-gray-200 rounded-lg focus:outline-none"
                            {...field}
                            onChange={(e) => {
                              const formatted = formatCurrency(e.target.value);
                              field.onChange(formatted);
                            }}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button
                type="submit"
                className="w-full py-4 mt-4 font-medium text-white rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Memproses..." : "Buat Setoran"}
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}
