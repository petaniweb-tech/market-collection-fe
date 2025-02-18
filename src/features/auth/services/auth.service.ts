import axios from '@/lib/axios';
import type { LoginFormType } from '@/features/auth/types/auth.types';

export const authService = {
  login: async (credentials: LoginFormType) => {
    const { data } = await axios.post('/auth/login', credentials);
    return data;
  },
};