'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('No verification token provided.'); return; }
    authApi.verifyEmail(token)
      .then(() => { setStatus('success'); setMessage('Your email has been verified successfully!'); })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.');
      });
  }, [token]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl text-white shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && <Loader2 className="h-12 w-12 text-blue-400 animate-spin" />}
            {status === 'success' && <CheckCircle2 className="h-12 w-12 text-emerald-400" />}
            {status === 'error' && <XCircle className="h-12 w-12 text-red-400" />}
          </div>
          <CardTitle className="text-2xl">
            {status === 'loading' ? 'Verifying...' : status === 'success' ? 'Email Verified!' : 'Verification Failed'}
          </CardTitle>
          <CardDescription className="text-slate-400">{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {status === 'success' && (
            <Button onClick={() => router.push('/login')} className="w-full bg-blue-500 hover:bg-blue-400">
              Sign In Now
            </Button>
          )}
          {status === 'error' && (
            <Link href="/login"><Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">Back to Login</Button></Link>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
