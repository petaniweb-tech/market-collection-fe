import { 
    UseQueryOptions, 
    useQuery, 
    UseMutationOptions,
    useMutation 
  } from '@tanstack/react-query';
//   import { ApiError } from '../types/api.types';
  
  export function useQueryWithConfig<T>(
    key: string[],
    fetchFn: () => Promise<T>,
    options?: Omit<UseQueryOptions<T, Error, T>, 'queryKey' | 'queryFn'>
  ) {
    return useQuery({
      queryKey: key,
      queryFn: fetchFn,
      ...options,
    });
  }
  
  export function useMutationWithConfig<TVariables, TData>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>
  ) {
    return useMutation({
      mutationFn,
      ...options,
    });
  }