'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRegister } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const schema = z.object({
  firstName: z.string().min(2, 'At least 2 characters'),
  lastName: z.string().min(2, 'At least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  password: z.string().min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const register2 = useRegister();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = ({ confirmPassword: _c, ...rest }: FormData) => register2.mutate(rest);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl text-white shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create account</CardTitle>
          <CardDescription className="text-slate-400">Join NexBank — it&apos;s free</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-200">First name</Label>
                <Input placeholder="John" className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-blue-500" {...register('firstName')} />
                {errors.firstName && <p className="text-red-400 text-xs">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-slate-200">Last name</Label>
                <Input placeholder="Doe" className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-blue-500" {...register('lastName')} />
                {errors.lastName && <p className="text-red-400 text-xs">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-200">Email address</Label>
              <Input type="email" placeholder="john@example.com" className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-blue-500" {...register('email')} />
              {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-slate-200">Phone <span className="text-slate-500">(optional)</span></Label>
              <Input type="tel" placeholder="+1 234 567 8900" className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-blue-500" {...register('phone')} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-200">Password</Label>
              <div className="relative">
                <Input type={showPass ? 'text' : 'password'} placeholder="Min 8 chars, upper, lower, number"
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-blue-500 pr-10"
                  {...register('password')} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-slate-200">Confirm password</Label>
              <Input type={showPass ? 'text' : 'password'} placeholder="Repeat your password"
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-blue-500"
                {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 h-11 font-semibold"
              disabled={isSubmitting || register2.isPending}>
              {(isSubmitting || register2.isPending) ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
              Create Account
            </Button>
            <p className="text-slate-500 text-xs text-center">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
