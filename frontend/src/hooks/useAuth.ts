import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi, profileApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { extractError } from '@/lib/utils';
import { toast } from '@/hooks/useToast';

export const useCurrentUser = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await profileApi.get();
      return data.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
};

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (creds: { email: string; password: string }) => {
      const { data } = await authApi.login(creds);
      return data.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      qc.invalidateQueries({ queryKey: ['profile'] });
      router.push('/dashboard');
    },
    onError: (error) => {
      toast({ title: 'Login failed', description: extractError(error), variant: 'destructive' });
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => {
      const { data: res } = await authApi.register(data);
      return res;
    },
    onSuccess: (_, vars) => {
      toast({ title: 'Account created!', description: 'Please check your email to verify your account.' });
      router.push(`/login?email=${encodeURIComponent(vars.email)}`);
    },
    onError: (error) => {
      toast({ title: 'Registration failed', description: extractError(error), variant: 'destructive' });
    },
  });
};

export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearAuth();
      qc.clear();
      router.push('/login');
    },
  });
};

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => toast({ title: 'Email sent', description: 'Check your inbox for a password reset link.' }),
    onError: (e) => toast({ title: 'Failed', description: extractError(e), variant: 'destructive' }),
  });

export const useResetPassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: { token: string; password: string }) => authApi.resetPassword(data),
    onSuccess: () => {
      toast({ title: 'Password reset!', description: 'You can now sign in with your new password.' });
      router.push('/login');
    },
    onError: (e) => toast({ title: 'Failed', description: extractError(e), variant: 'destructive' }),
  });
};
