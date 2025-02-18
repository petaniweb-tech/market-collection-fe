import { Employee, CreateEmployeeDTO } from "../types";

// Dummy data
let DUMMY_EMPLOYEES: Employee[] = [
  {
    id: 1,
    name: "John Doe",
    nip: "318745712",
    password: "••••••••••••",
    phone: "081336664589",
    email: "johndoe@gmail.com",
    location: "Lowokwaru",
    role: "Collector Lapak",
    is_synced: false,
    created_at: "",
    updated_at: "",
  },
  {
    id: 2,
    name: "John Doe",
    nip: "318745712",
    password: "••••••••••••",
    phone: "081336664589",
    email: "johndoe@gmail.com",
    location: "Lowokwaru",
    role: "Collector Lapak",
    is_synced: false,
    created_at: "",
    updated_at: "",
  },
  {
    id: 3,
    name: "John Doe",
    nip: "318745712",
    password: "••••••••••••",
    phone: "081336664589",
    email: "johndoe@gmail.com",
    location: "Lowokwaru",
    role: "Collector Lapak",
    is_synced: false,
    created_at: "",
    updated_at: "",
  },
  {
    id: 4,
    name: "John Doe",
    nip: "318745712",
    password: "••••••••••••",
    phone: "081336664589",
    email: "johndoe@gmail.com",
    location: "Lowokwaru",
    role: "Collector Lapak",
    is_synced: false,
    created_at: "",
    updated_at: "",
  },
  {
    id: 5,
    name: "John Doe",
    nip: "318745712",
    password: "••••••••••••",
    phone: "081336664589",
    email: "johndoe@gmail.com",
    location: "Lowokwaru",
    role: "Collector Lapak",
    is_synced: false,
    created_at: "",
    updated_at: "",
  },
];

// Mock API service
export const employeeService = {
  getEmployees: async (): Promise<Employee[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [...DUMMY_EMPLOYEES];
  },

  createEmployee: async (data: CreateEmployeeDTO): Promise<Employee> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newEmployee: Employee = {
      id: DUMMY_EMPLOYEES.length + 1,
      ...data,
      is_synced: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    DUMMY_EMPLOYEES = [...DUMMY_EMPLOYEES, newEmployee]; // Update the reference
    return newEmployee;
  },
};

//TODO: OFFLINE FIRST NEED TO RESEARCH MORE
// import axiosInstance from '../../../lib/axios';
// import type { Employee, CreateEmployeeDTO } from '../types';

// const LOCAL_STORAGE_KEY = 'employees';

// export const employeeService = {
//   // Helper function to get local data - exported to be used as initialData
//   getLocalData: (): Employee[] => {
//     try {
//       const data = localStorage.getItem(LOCAL_STORAGE_KEY);
//       return data ? JSON.parse(data) : [];
//     } catch (error) {
//       console.error('Error reading from localStorage:', error);
//       return [];
//     }
//   },

//   // Helper function to save local data
//   saveLocalData: (data: Employee[]) => {
//     try {
//       localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
//     } catch (error) {
//       console.error('Error saving to localStorage:', error);
//     }
//   },

//   getAll: async (): Promise<Employee[]> => {
//     if (navigator.onLine) {
//       try {
//         const response = await axiosInstance.get('/api/employee');
//         const employees = Array.isArray(response.data) ? response.data :
//                         ((response.data as { data: Employee[] })?.data || []);

//         employeeService.saveLocalData(employees);
//         return employees;
//       } catch (error) {
//         console.error('API Error, falling back to local data:', error);
//         return employeeService.getLocalData();
//       }
//     }
//     return employeeService.getLocalData();
//   },

//   create: async (data: CreateEmployeeDTO): Promise<Employee> => {
//     const newEmployee: Employee = {
//       ...data,
//       id: crypto.randomUUID(),
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       is_synced: false,
//     };

//     // Always update local storage first
//     const currentEmployees = employeeService.getLocalData();
//     const updatedEmployees = [newEmployee, ...currentEmployees];
//     employeeService.saveLocalData(updatedEmployees);

//     if (navigator.onLine) {
//       try {
//         const response = await axiosInstance.post('/api/employee', data);
//         const serverEmployee = (response.data as { data: Employee }).data || response.data;

//         // Update local storage with server data
//         const syncedEmployees = updatedEmployees.map(emp =>
//           emp.id === newEmployee.id ? { ...serverEmployee, is_synced: true } : emp
//         );
//         employeeService.saveLocalData(syncedEmployees);
//         return serverEmployee;
//       } catch (error) {
//         console.error('Failed to sync with API:', error);
//       }
//     }

//     return newEmployee;
//   },

//   syncPendingChanges: async (): Promise<void> => {
//     if (!navigator.onLine) return;

//     const employees = employeeService.getLocalData();
//     const unsyncedEmployees = employees.filter(emp => !emp.is_synced);

//     for (const employee of unsyncedEmployees) {
//       try {
//         const response = await axiosInstance.post('/api/employee', employee);
//         const serverEmployee = (response.data as { data: Employee }).data || response.data;

//         const updatedEmployees = employees.map(emp =>
//           emp.id === employee.id ? { ...serverEmployee, is_synced: true } : emp
//         );
//         employeeService.saveLocalData(updatedEmployees);
//       } catch (error) {
//         console.error(`Failed to sync employee ${employee.id}:`, error);
//       }
//     }
//   }
// };
