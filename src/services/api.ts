// import axios from 'axios';
// import { Employee, CreateEmployeeDTO } from '../types/api.types';

// const api = axios.create({
//   baseURL: process.env.BASE_URL,
// });

// export const employeeApi = {
//   getAll: async (): Promise<Employee[]> => {
//     const response = await api.get('/api/employee');
//     return response.data;
//   },
  
//   create: async (data: CreateEmployeeDTO): Promise<Employee> => {
//     const response = await api.post('/api/employee', data);
//     return response.data;
//   },
// };