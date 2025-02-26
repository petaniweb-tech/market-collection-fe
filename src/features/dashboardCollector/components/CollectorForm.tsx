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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateCollectorDepositDTO } from "../types";
import MerchantComboBox from "./combobox/MerchantComboBox";

// Create a schema for form validation
const formSchema = z.object({
  merchant_id: z.string({
    required_error: "Nama pedagang harus dipilih",
  }),
  deposit_amount: z
    .string()
    .min(1, "Nominal setoran tidak boleh kosong")
    .refine(
      (val) => !isNaN(Number(val.replace(/\./g, "").replace(/,/g, ""))),
      "Nominal harus berupa angka"
    )
    .transform((val) => Number(val.replace(/\./g, "").replace(/,/g, ""))),
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
  // Initialize form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      merchant_id: "",
      deposit_amount: 0,
      is_open: true,
    },
  });

  if (!isOpen) return null;

  // Format currency input
  const formatCurrency = (value: string): string => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    // Format with thousand separators
    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleFormSubmit = (values: FormValues) => {
    // Transform form values to DTO
    const depositData: CreateCollectorDepositDTO = {
      merchant_id: values.merchant_id,
      deposit_amount: values.deposit_amount,
      is_open: values.is_open,
    };

    onSubmit(depositData);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetTrigger />
        <SheetContent
          side="bottom"
          className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-b from-gradients-background-from to-gradients-background-to rounded-t-xl animate-in slide-in-from-bottom"
        >
          <h2 className="mb-6 text-lg font-medium">Form Setoran</h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="merchant_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama lapak</FormLabel>
                    <FormControl>
                      <MerchantComboBox
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Pilih Lapak"
                        isInsideSheet={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deposit_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nominal Setoran</FormLabel>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                        Rp
                      </span>
                      <FormControl>
                        <Input
                          placeholder="10.000"
                          className="w-full py-3 pl-12 pr-4 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none"
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
{/* 
              <FormField
                control={form.control}
                name="target_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nominal Setoran</FormLabel>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                        Rp
                      </span>
                      <FormControl>
                        <Input
                          placeholder="10.000"
                          className="w-full py-3 pl-12 pr-4 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none"
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
              /> */}

              <Button
                type="submit"
                className="w-full bg-gradient-to-b from-[#FE8300] to-[#ED3400] text-white rounded-full"
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
