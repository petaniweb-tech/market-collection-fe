/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SheetContent } from '@/components/ui/sheet';
import { useCreateStore, useStores } from '../../hooks/useStore';
import type { CreateStoreDTO } from '../../types/store.types';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import LocationComboBox from '../combobox/LocationComboBox';
import StoreSquare from '@/assets/icon/ic_store_square.svg';

const formatToRupiah = (value: string | number) => {
  const numberValue =
    typeof value === 'string' ? parseInt(value.replace(/[^\d]/g, '')) : value;
  return new Intl.NumberFormat('id-ID').format(numberValue || 0);
};

const stripNonDigits = (value: string) => value.replace(/[^\d]/g, '');

// Form validation schema
const formSchema = z.object({
  store_name: z.string().min(2, { message: 'Nama lapak harus diisi' }),
  location: z.string().min(2, { message: 'Lokasi harus diisi' }),
  retribution: z
    .string()
    .min(1, { message: 'Nominal retribusi harus diisi' })
    .regex(/^\d+$/, { message: 'Nominal retribusi harus berupa angka' })
    .transform((val) => parseInt(stripNonDigits(val) || '0', 10)), // Convert to number here
  desc: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FormStoreProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  setSubmitting: (loading: boolean) => void;
}

const FormStore = ({ onOpenChange, setSubmitting }: FormStoreProps) => {
  const createStore = useCreateStore();
  const { refetch } = useStores();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { store_name: '', location: '', retribution: 0, desc: '' },
  });

  // Track the display value for the retribution field
  const [retributionDisplay, setRetributionDisplay] = useState('');

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);

      const storeData: CreateStoreDTO = {
        name: values.store_name,
        location_id: values.location,
        expected_deposit_amount: values.retribution, // Will be a number after transform
        status: 'active',
        // desc: values.desc || "",
        // created_at: new Date().toISOString(),
        // updated_at: new Date().toISOString(),
      };

      await createStore.mutateAsync(storeData);
      await refetch();

      toast({
        title: 'Berhasil menambahkan lapak',
        description: 'Data lapak baru telah tersimpan',
      });

      form.reset();
      setRetributionDisplay('');
      onOpenChange(false);
    } catch (error: any) {
      if (error?.statusCode === 400) {
        toast({
          title: 'Gagal menambahkan lapak',
          description: 'Input Error: Cek Kembali Inputan Anda',
          variant: 'destructive',
        });
      } else if (error?.statusCode === 500) {
        toast({
          title: 'Gagal menambahkan lapak',
          description: 'Server Error: Hubungi Admin',
          variant: 'destructive',
        });
      } else if (error?.statusCode === 401 || error?.statusCode === 404) {
        toast({
          title: 'Anda tidak memiliki akses ke halaman ini',
          description: 'Server Error: Hubungi Admin',
          variant: 'destructive',
        });
      } else {
        console.error('Failed to create employee:', error);
        toast({
          title: 'Gagal menambahkan lapak',
          description: 'Terjadi kesalahan saat menambahkan lapak baru',
          variant: 'destructive',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SheetContent className="w-full max-w-md rounded-lg sm:max-w-lg">
      <div className="pt-6">
        <div className="">
          <img src={StoreSquare} alt="Profile" className="mb-6" />

          <div className="mb-7">
            <h2 className="text-xl font-semibold">Tambah lapak baru</h2>
            <div className="font-normal text-[#909090]">
              Isi data lapak baru untuk ditambahkan ke sistem
            </div>
            <div className="h-px mt-4 bg-gray-200"></div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="store_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lapak</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan Nama Lapak" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi</FormLabel>
                  <FormControl>
                    <LocationComboBox
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pilih Lokasi"
                      isInsideSheet={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="retribution"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Target Retribusi Harian</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute text-gray-500 -translate-y-1/2 left-3 top-1/2">
                        Rp
                      </div>
                      <Input
                        className="pl-8"
                        placeholder="0"
                        value={retributionDisplay}
                        onChange={(e) => {
                          const rawValue = stripNonDigits(e.target.value);
                          setRetributionDisplay(formatToRupiah(rawValue));
                          onChange(rawValue); // Pass the raw string to be transformed by Zod
                        }}
                        {...fieldProps}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan Keterangan Lapak"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

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
                disabled={createStore.isPending}
              >
                {createStore.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </SheetContent>
  );
};

export default FormStore;
