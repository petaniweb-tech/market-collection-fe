/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SheetContent } from '@/components/ui/sheet';
import { Store } from 'lucide-react';
import { useUpdateStore, useStores, useStore } from '../../hooks/useStore';
import type { UpdateStoreDTO } from '../../types/store.types';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
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

// Create a custom type for the form values
interface FormValuesRaw {
  store_name: string;
  location: string;
  retribution: string; // Keep as string in the form
  desc?: string;
  status?: 'active' | 'inactive';
}

// Form validation schema
const formSchema = z.object({
  store_name: z.string().min(2, { message: 'Nama lapak harus diisi' }),
  location: z.string().min(2, { message: 'Lokasi harus diisi' }),
  retribution: z
    .string()
    .min(1, { message: 'Nominal retribusi harus diisi' })
    .regex(/^\d+$/, { message: 'Nominal retribusi harus berupa angka' }),
});

type FormValues = z.infer<typeof formSchema>;

interface EditStoreFormProps {
  storeId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  setSubmitting: (loading: boolean) => void;
}

const EditStoreForm = ({
  storeId,
  onOpenChange,
  setSubmitting,
}: EditStoreFormProps) => {
  const updateStore = useUpdateStore();
  const { data: store, isLoading } = useStore(storeId);
  const { refetch } = useStores();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Track the display value for the retribution field
  const [retributionDisplay, setRetributionDisplay] = useState('');

  const form = useForm<FormValuesRaw>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      store_name: '',
      location: '',
      retribution: '0', // String type for form
      desc: '',
      status: 'active',
    },
  });

  // Update form when store data is loaded
  useEffect(() => {
    if (store) {
      // Convert the number to string for the form
      const retributionAsString = String(store.expected_deposit_amount || 0);

      form.reset({
        store_name: store.name,
        location: store.location_id,
        retribution: retributionAsString, // Convert to string for the form
        desc: store.desc || '',
        status: store.status || 'active',
      });

      // Update display value for retribution
      setRetributionDisplay(formatToRupiah(store.expected_deposit_amount));
    }
  }, [store, form]);

  const onSubmit = async (values: FormValuesRaw) => {
    try {
      setSubmitting(true);

      // Parse the retribution to a number explicitly
      const retributionValue = parseInt(
        stripNonDigits(values.retribution) || '0',
        10
      );

      const storeData: UpdateStoreDTO = {
        id: storeId,
        name: values.store_name,
        location_id: values.location,
        expected_deposit_amount: retributionValue, // Explicitly using a number here
        status: values.status || 'active',
      };

      await updateStore.mutateAsync({ id: storeId, data: storeData });

      // Invalidate queries to ensure data is refreshed
      queryClient.invalidateQueries({ queryKey: ['stores'] });

      toast({
        title: 'Berhasil memperbarui lapak',
        description: 'Data lapak telah diperbarui',
      });

      onOpenChange(false);
    } catch (error: any) {
      if (error?.statusCode === 400) {
        toast({
          title: 'Gagal menambahkan pegawai',
          description: 'Input Error: Cek Kembali Inputan Anda',
          variant: 'destructive',
        });
      } else if (error?.statusCode === 500) {
        toast({
          title: 'Gagal menambahkan pegawai',
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
          title: 'Gagal menambahkan pegawai',
          description: 'Terjadi kesalahan saat menambahkan pegawai baru',
          variant: 'destructive',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SheetContent className="w-full max-w-md rounded-lg sm:max-w-lg">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto border-4 rounded-full border-t-orange-500 border-b-orange-300 border-l-orange-300 border-r-orange-300 animate-spin"></div>
            <p className="mt-2 text-sm text-gray-500">Memuat data lapak...</p>
          </div>
        </div>
      </SheetContent>
    );
  }

  return (
    <SheetContent className="w-full max-w-md rounded-lg sm:max-w-lg">
      <div className="pt-6">
        <div className="">
          <img src={StoreSquare} alt="Profile" className="mb-6" />

          <div className="mb-7">
            <h2 className="text-xl font-semibold">Ubah detail lapak</h2>
            <div className="font-normal text-[#909090]">
              Perbarui informasi lokasi sesuai kebutuhan
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
                          onChange(rawValue); // Pass the raw string value
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="active">Aktif</option>
                      <option value="inactive">Tidak Aktif</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
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
                disabled={updateStore.isPending}
              >
                {updateStore.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </SheetContent>
  );
};

export default EditStoreForm;
