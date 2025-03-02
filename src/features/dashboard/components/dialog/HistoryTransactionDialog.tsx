import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { id } from 'date-fns/locale';

// ShadCN UI components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { EnhancedDatePicker } from '../datepicker/DatePicker';
import { useStore } from '../../hooks/useStore';
import { useHistoricalTransactions } from '../../hooks/useCollectorDeposit';
import { HistoryTransaction } from '../../types/historyTransaction.types';

interface HistoryTransactionDialogProps {
  storeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HistoryTransactionDialog: React.FC<HistoryTransactionDialogProps> = ({
  storeId,
  open,
  onOpenChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Format date for API request
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  // First section: Fetch store details using the existing hook
  const { data: store, isLoading: isStoreLoading } = useStore(
    open ? storeId : ''
  );

  // Second section: Fetch transaction history using the hook from useCollectorDeposit
  const { data: transactions, isLoading: isTransactionsLoading } =
    useHistoricalTransactions(
      open ? storeId : '',
      open ? formattedDate : undefined
    );

  const isLoading = isStoreLoading || isTransactionsLoading;

  const getTransactionHeaderText = () => {
    if (isToday(selectedDate)) {
      return 'Transaksi hari ini';
    } else {
      // Format the date as "Transaksi pada 16 Apr 2025"
      return `Transaksi pada ${format(selectedDate, 'd MMM yyyy', { locale: id })}`;
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // Map the API response to the format expected by the UI
  const mapTransactionsForUI = (
    transactions: HistoryTransaction[] | undefined
  ) => {
    if (!transactions) return [];

    return transactions.map((transaction) => ({
      date: format(new Date(transaction.created_at), 'd MMM yyyy', {
        locale: id,
      }),
      collector_name: transaction.created?.name || 'Unknown',
      store_status: transaction.is_open
        ? 'Buka'
        : ('Tutup' as 'Buka' | 'Tutup'),
      amount: transaction.deposit_amount,
      id: transaction.id,
    }));
  };

  const mappedTransactions = mapTransactionsForUI(transactions);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Riwayat transaksi
            </DialogTitle>
          </div>
          <DialogDescription>
            Rekap data riwayat setoran retribusi harian
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-md p-4 space-y-4">
              <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ) : (
          <>
            {/* First section: Store details from useStore hook */}
            <div className="p-0.5 mt-2 bg-[#FE8300] rounded-xl">
              <h3 className="py-2 mb-2 text-sm font-medium text-center text-white">
                DETAIL LAPAK
              </h3>
              <div className="px-5 py-4 space-y-1 bg-white rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Nama Lapak</span>
                  <span className="font-medium">{store?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Lokasi</span>
                  <span className="font-medium">{store?.location?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Target Retribusi Harian</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(store?.expected_deposit_amount || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  {store?.status === 'active' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-sm font-medium bg-green-50 text-green-600 border border-green-200">
                      <CheckCircle2 className="w-4 h-4 mr-1 stroke-2" />
                      Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-sm font-medium bg-red-50 text-red-600 border border-red-200">
                      <XCircle className="w-4 h-4 mr-1 stroke-2" />
                      Nonaktif
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-2" />

            {/* Second section: Transaction history from useHistoricalTransactions hook */}
            <div className="mt-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">
                  {getTransactionHeaderText()}
                </h3>
                <div className="flex items-center">
                  <EnhancedDatePicker
                    date={selectedDate}
                    onSelect={handleDateChange}
                    locale={id}
                  />
                </div>
              </div>

              {mappedTransactions.length > 0 ? (
                <div>
                  {mappedTransactions.map((transaction, index) => (
                    <div
                      key={transaction.id || index}
                      className="p-4 mb-2 border rounded-lg"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Tanggal Setoran</span>
                          <span className="font-medium">
                            {transaction.date}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-gray-600">Nama Collector</span>
                          <span className="font-medium">
                            {transaction.collector_name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-gray-600">Status Toko</span>
                          <div className="flex items-center">
                            <span
                              className={`mr-2 w-2 h-2 rounded-full ${transaction.store_status === 'Buka' ? 'bg-green-500' : 'bg-red-500'}`}
                            ></span>
                            <span className="font-medium">
                              {transaction.store_status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-gray-600">Nominal Setoran</span>
                          <span className="font-medium">
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(transaction.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500 border border-dashed rounded-lg">
                  Tidak ada transaksi pada tanggal ini
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HistoryTransactionDialog;
