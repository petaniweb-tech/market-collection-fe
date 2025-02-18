import { useQueryWithConfig, useMutationWithConfig } from '../../../hooks/useQueryWithConfig';
import { employeeService } from '../services/employeeService';
import { queryClient } from '../../../lib/react-query';
// import type { CreateEmployeeDTO } from '../types';

export const QUERY_KEYS = {
  employees: ['employees'] as const,
};

export function useEmployees() {
  return useQueryWithConfig(
    [...QUERY_KEYS.employees],
    employeeService.getEmployees,
    {
      refetchOnWindowFocus: false, // Optional: prevent refetch on window focus
      staleTime: 0, // Ensure data is always considered stale and will refetch
    }
  );
}

export function useCreateEmployee() {
  return useMutationWithConfig(
    employeeService.createEmployee,
    {
      onSuccess: () => {
        // Invalidate and refetch employees query after successful creation
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees });
      },
    }
  );
}


//TODO: OFFLINE FIRST NEED TO RESEARCH MORE
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { employeeService } from '../services/employeeService';
// import { useOnlineStatus } from '../../../hooks/useOnlineStatus';
// import type { Employee, CreateEmployeeDTO } from '../types';

// export const QUERY_KEYS = {
//   employees: ['employees'] as const,
// };

// export function useEmployees() {
//   const isOnline = useOnlineStatus();

//   return useQuery({
//     queryKey: QUERY_KEYS.employees,
//     queryFn: employeeService.getAll,
//     staleTime: isOnline ? 1000 * 60 : Infinity,
//     initialData: employeeService.getLocalData,
//     networkMode: 'always', // Add this to ensure it works offline
//   });
// }

// export function useCreateEmployee() {
//   const queryClient = useQueryClient();
//   const isOnline = useOnlineStatus();

//   return useMutation({
//     mutationFn: employeeService.create,
//     onMutate: async (newEmployeeData: CreateEmployeeDTO) => {
//       // Cancel any outgoing refetches
//       await queryClient.cancelQueries({ queryKey: QUERY_KEYS.employees });

//       // Get current data
//       const previousEmployees = queryClient.getQueryData<Employee[]>(QUERY_KEYS.employees) || [];

//       // Create optimistic employee
//       const newEmployee: Employee = {
//         ...newEmployeeData,
//         id: crypto.randomUUID(),
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//         is_synced: false,
//       };

//       // Update cache immediately
//       queryClient.setQueryData<Employee[]>(
//         QUERY_KEYS.employees,
//         [newEmployee, ...previousEmployees]
//       );

//       return { previousEmployees };
//     },
//     onError: (_, __, context) => {
//       // On error, restore previous data
//       if (context?.previousEmployees) {
//         queryClient.setQueryData(QUERY_KEYS.employees, context.previousEmployees);
//       }
//     },
//     onSettled: (data) => {
//       console.log(data);
//       // Only invalidate queries when online
//       if (isOnline) {
//         queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees });
//       }
//     },
//   });
// }