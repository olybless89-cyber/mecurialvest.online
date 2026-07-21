import { useState } from 'react';
import { Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForgotPassword } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const forgotPasswordMutation = useForgotPassword();

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      await forgotPasswordMutation.mutateAsync({ data });
      setIsSubmitted(true);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to process request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md shadow-lg border-muted">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight">Reset Password</CardTitle>
          <CardDescription className="text-base">
            {isSubmitted 
              ? 'Check your email for a reset link.'
              : 'Enter your email address and we will send you a link to reset your password.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m.scott@example.com" 
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className="py-4 text-center">
              <p className="text-muted-foreground">
                If an account exists with that email, we have sent a password reset link. Please check your spam folder if you don't see it.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t p-6">
          <Link href="/login" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}