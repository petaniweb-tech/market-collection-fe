import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SheetContent } from '@/components/ui/sheet';
import { UserRound } from 'lucide-react';
import { useUpdateEmployee, useEmployee } from '../../hooks/useEmployee';
import type { UpdateEmployeeDTO } from '../../types/employee.types';
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
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import PersonSquare from '@/assets/icon/ic_person_square.svg';
import LocationComboBox from '../combobox/LocationComboBox';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Nama harus diisi' }),
  role: z.enum(['collector', 'manager', 'supervisor', 'admin'], {
    required_error: 'Pilih role pegawai',
  }),
  phone: z.string().min(1, { message: 'Nomor HP harus diisi' }),
  email: z.string().email({ message: 'Email tidak valid' }),
  location: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditFormEmployeeProps {
  employeeId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  setSubmitting: (loading: boolean) => void;
}

const EditFormEmployee = ({
  employeeId,
  onOpenChange,
  setSubmitting,
}: EditFormEmployeeProps) => {
  const { data: employee, isLoading } = useEmployee(employeeId);
  const updateEmployee = useUpdateEmployee();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: undefined,
      phone: '',
      email: '',
      location: '',
    },
  });

  useEffect(() => {
    if (employee && !isLoading) {
      form.reset({
        name: employee.name,
        role: employee.role,
        phone: employee.phone_number,
        email: employee.email,
        location: employee.location_id || undefined,
      });
    }
  }, [employee, isLoading, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);

      const updateData: UpdateEmployeeDTO = {
        name: values.name,
        role: values.role,
        phone_number: values.phone,
        location_id: values.location || null,
      } as UpdateEmployeeDTO;

      await updateEmployee.mutateAsync({ id: employeeId, data: updateData });

      toast({
        title: 'Berhasil memperbarui pegawai',
        description: 'Data pegawai telah diperbarui',
      });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
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
            <p className="mt-2 text-sm text-gray-500">Memuat data pegawai...</p>
          </div>
        </div>
      </SheetContent>
    );
  }

  return (
    <SheetContent className="w-full max-w-md rounded-lg sm:max-w-lg">
      <div className="pt-6">
        <div>
          <img src={PersonSquare} alt="Profile" className="mb-6" />

          <div className="mb-7">
            <h2 className="text-xl font-semibold">Ubah detail pegawai</h2>
            <div className="font-normal text-[#909090]">
              Perbarui informasi pegawai sesuai kebutuhan
            </div>
            <div className="h-px mt-4 bg-gray-200"></div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role / Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Role / Level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value="collector"
                        className="flex items-center"
                      >
                        <div className="flex items-center">
                          <UserRound className="w-4 h-4 mr-2 text-blue-500" />
                          <span>Collector Lapak</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="manager" className="flex items-center">
                        <div className="flex items-center">
                          <UserRound className="w-4 h-4 mr-2 text-green-500" />
                          <span>Kepala Lokasi</span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="supervisor"
                        className="flex items-center"
                      >
                        <div className="flex items-center">
                          <UserRound className="w-4 h-4 mr-2 text-purple-500" />
                          <span>Dinas Perdagangan Kota</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin" className="flex items-center">
                        <div className="flex items-center">
                          <UserRound className="w-4 h-4 mr-2 text-orange-500" />
                          <span>Admin</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pegawai</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan Nama Pegawai" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor HP</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan Nomor HP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Masukkan Email"
                      {...field}
                      disabled
                    />
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
                  <FormLabel>Lokasi Kerja</FormLabel>
                  <FormControl>
                    <LocationComboBox
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Pilih Lokasi Kerja"
                      isInsideSheet={true}
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
                disabled={updateEmployee.isPending}
              >
                {updateEmployee.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </SheetContent>
  );
};

export default EditFormEmployee;
