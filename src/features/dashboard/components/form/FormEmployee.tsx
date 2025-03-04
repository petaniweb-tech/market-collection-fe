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
import { useCreateEmployee } from '../../hooks/useEmployee';

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
import PersonSquare from '@/assets/icon/ic_person_square.svg';
import LocationComboBox from '../combobox/LocationComboBox';
import { CreateEmployeeDTO } from '../../types/employee.types';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Nama harus diisi' }),
  role: z.enum(['collector', 'manager', 'supervisor', 'admin'], {
    required_error: 'Pilih role pegawai',
  }),
  phone: z
    .string()
    .min(1, { message: 'Nomor HP harus diisi' })
    .regex(/^\+62[1-9][0-9]{8,11}$/, {
      message: 'Nomor HP harus diawali +62 dan maksimal 14 karakter',
    })
    .refine((val) => val.length <= 14, {
      message: 'Nomor HP tidak boleh lebih dari 14 karakter',
    }),
  email: z.string().email({ message: 'Email tidak valid' }),
  location: z.string().min(1, { message: 'Lokasi harus dipilih' }),
});

type FormValues = z.infer<typeof formSchema>;

interface FormEmployeeProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  setSubmitting: (loading: boolean) => void;
}

const FormEmployee = ({ onOpenChange, setSubmitting }: FormEmployeeProps) => {
  const createEmployee = useCreateEmployee();
  const { toast } = useToast();

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

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);

      const employeeData: CreateEmployeeDTO = {
        name: values.name,
        role: values.role,
        phone_number: values.phone,
        email: values.email,
        location_id: values.location,
      };

      await createEmployee.mutateAsync(employeeData);

      toast({
        title: 'Berhasil menambahkan pegawai',
        description: 'Undangan telah dikirim ke email pegawai',
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SheetContent className="w-full max-w-md rounded-lg sm:max-w-lg">
      <div className="pt-6">
        <div className="">
          <img src={PersonSquare} alt="Profile" className="mb-6" />

          <div className="mb-7">
            <h2 className="text-xl font-semibold">Tambah pegawai baru</h2>
            <div className="font-normal text-[#909090]">
              Isi data pegawai baru untuk ditambahkan ke sistem
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                      value={field.value}
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
                disabled={createEmployee.isPending}
              >
                {createEmployee.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </SheetContent>
  );
};

export default FormEmployee;
