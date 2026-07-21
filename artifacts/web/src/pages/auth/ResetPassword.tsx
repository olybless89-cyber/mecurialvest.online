import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResetPassword } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const token = new URLSearchParams(window.location.search).get('token') || '';
  const [isLoading, setIsLoading] = useState(false);
  const resetPasswordMutation = useResetPassword();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error('No reset token provided. Please request a new link.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordMutation.mutateAsync({ 
        data: { token, newPassword: data.password } 
      });
      toast.success('Password reset successfully. You can now log in.');
      setLocation('/login');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md shadow-lg border-muted">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight">Set New Password</CardTitle>
          <CardDescription className="text-base">
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {token ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  {...register('password')}
                  className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  {...register('confirmPassword')}
                  className={errors.confirmPassword ? 'border-destructive' : ''}
                />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
              </div>

              <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          ) : (
            <div className="py-4 text-center">
              <p className="text-destructive mb-4">Invalid or missing reset token.</p>
              <Link href="/forgot-password">
                <Button variant="outline">Request New Link</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}