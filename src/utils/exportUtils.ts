import * as XLSX from 'xlsx';
import { format } from 'date-fns';

// Generic type for any deposit data
type DepositData = {
  id: string;
  created_at: string;
  deposit_amount: number;
  created_by_name?: string;
  merchant?: { name: string };
  location_name?: string;
  collector_name?: string;
  verification?: boolean;
  proof_of_payment_url?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export const exportToExcel = <T extends DepositData>(
  data: T[],
  type: 'collector' | 'manager' | 'bank'
): void => {
  if (!data.length) {
    console.warn('No data to export');
    return;
  }

  // Format date for filename
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  
  // Prepare the worksheet data
  const worksheetData = data.map((item, index) => {
    const baseData = {
      'No.': index + 1,
      'Tanggal': format(new Date(item.created_at), 'dd/MM/yyyy'),
      'Nominal Retribusi': item.deposit_amount,
    };
    
    // Add type-specific columns
    if (type === 'collector') {
      return {
        ...baseData,
        'Nama Collector Lapak': item.created_by_name || '-',
        'Nama Lapak': item.merchant?.name || '-',
        'Lokasi': item.location_name || '-',
      };
    } else if (type === 'manager') {
      return {
        ...baseData,
        'Nama Kepala Lokasi': item.created_by_name || '-',
        'Nama Collector': item.collector_name || '-',
        'Lokasi': item.location_name || '-',
        'Status Verifikasi': item.verification ? 'Diverifikasi' : 'Belum Diverifikasi',
      };
    } else { // bank
      return {
        ...baseData,
        'Nama Kepala Lokasi': item.created_by_name || '-',
        'Lokasi': item.location_name || '-',
        'Bukti Bayar': item.proof_of_payment_url ? 'Ada' : 'Tidak Ada',
      };
    }
  });

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(worksheetData);
  
  // Set column widths
  const columnWidths = [
    { wch: 5 },   // No.
    { wch: 12 },  // Tanggal
    { wch: 25 },  // Nama fields
    { wch: 25 },  // More name fields
    { wch: 20 },  // Lokasi
    { wch: 15 },  // Nominal
    { wch: 15 },  // Status/Extra fields
  ];
  ws['!cols'] = columnWidths;

  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Get sheet name based on type
  const sheetName = 
    type === 'collector' ? 'Setoran Collector' : 
    type === 'manager' ? 'Setoran Kepala Lokasi' : 
    'Setoran Bank';
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // Get filename based on type
  const fileName = `${
    type === 'collector' ? 'setoran-collector' : 
    type === 'manager' ? 'setoran-kepala-lokasi' : 
    'setoran-bank'
  }-${currentDate}.xlsx`;
  
  // Export to file
  XLSX.writeFile(wb, fileName);
};

export const exportToCSV = <T extends DepositData>(
  data: T[],
  type: 'collector' | 'manager' | 'bank'
): void => {
  if (!data.length) {
    console.warn('No data to export');
    return;
  }

  // Format date for filename
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  
  // Prepare the CSV data with headers and rows
  let headers: string[] = ['No.', 'Tanggal', 'Nominal Retribusi'];
  
  // Add type-specific headers
  if (type === 'collector') {
    headers = [...headers, 'Nama Collector Lapak', 'Nama Lapak', 'Lokasi'];
  } else if (type === 'manager') {
    headers = [...headers, 'Nama Kepala Lokasi', 'Nama Collector', 'Lokasi', 'Status Verifikasi'];
  } else { // bank
    headers = [...headers, 'Nama Kepala Lokasi', 'Lokasi', 'Bukti Bayar'];
  }
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  // Add rows
  data.forEach((item, index) => {
    const formattedDate = format(new Date(item.created_at), 'dd/MM/yyyy');
    
    let row = [
      index + 1,
      `"${formattedDate}"`,
      item.deposit_amount
    ];
    
    // Add type-specific data
    if (type === 'collector') {
      row = [
        ...row,
        `"${item.created_by_name || '-'}"`,
        `"${item.merchant?.name || '-'}"`,
        `"${item.location_name || '-'}"`
      ];
    } else if (type === 'manager') {
      row = [
        ...row,
        `"${item.created_by_name || '-'}"`,
        `"${item.collector_name || '-'}"`,
        `"${item.location_name || '-'}"`,
        `"${item.verification ? 'Diverifikasi' : 'Belum Diverifikasi'}"`
      ];
    } else { // bank
      row = [
        ...row,
        `"${item.created_by_name || '-'}"`,
        `"${item.location_name || '-'}"`,
        `"${item.proof_of_payment_url ? 'Ada' : 'Tidak Ada'}"`
      ];
    }
    
    csvContent += row.join(',') + '\n';
  });
  
  // Create downloadable link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Set filename based on type
  const fileName = `${
    type === 'collector' ? 'setoran-collector' : 
    type === 'manager' ? 'setoran-kepala-lokasi' : 
    'setoran-bank'
  }-${currentDate}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};