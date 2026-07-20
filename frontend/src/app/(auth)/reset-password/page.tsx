'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { useState } from 'react';
import { useResetPassword } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const schema = z.object({
  password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });
type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [show, setShow] = useState(false);
  const params = useSearchParams();
  const token = params.get('token') || '';
  const reset = useResetPassword();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = ({ password }: FormData) => reset.mutate({ token, password });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl text-white shadow-2xl">
        <CardHeader>
          <div className="p-2 rounded-full bg-blue-500/20 w-fit mb-2"><Lock className="h-5 w-5 text-blue-400" /></div>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription className="text-slate-400">Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-200">New Password</Label>
              <div className="relative">
                <Input type={show ? 'text' : 'password'} placeholder="Min 8 chars, upper, lower, number"
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-blue-500 pr-10"
                  {...register('password')} />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs">Must be 8+ chars with uppercase, lowercase, and number</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-slate-200">Confirm Password</Label>
              <Input type={show ? 'text' : 'password'} placeholder="Repeat password"
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-blue-500"
                {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>}
            </div>
            {!token && <p className="text-red-400 text-sm">Invalid reset link. Please request a new one.</p>}
            <Button type="submit" disabled={isSubmitting || reset.isPending || !token}
              className="w-full bg-blue-500 hover:bg-blue-400 h-11 font-semibold">
              {reset.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Set New Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
