import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useVerifyEmail } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function VerifyEmail() {
  const [location] = useLocation();
  const token = new URLSearchParams(window.location.search).get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  
  const verifyMutation = useVerifyEmail();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('No verification token provided.');
      return;
    }

    verifyMutation.mutate({ data: { token } }, {
      onSuccess: () => {
        setStatus('success');
      },
      onError: (err: any) => {
        setStatus('error');
        setErrorMsg(err?.message || 'Failed to verify email. Token may be invalid or expired.');
      }
    });
  }, [token]);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md shadow-lg text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {status === 'loading' && <Loader2 className="h-12 w-12 text-primary animate-spin" />}
            {status === 'success' && <CheckCircle2 className="h-12 w-12 text-green-500" />}
            {status === 'error' && <XCircle className="h-12 w-12 text-destructive" />}
          </div>
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Please wait while we verify your email address.'}
            {status === 'success' && 'Your email has been successfully verified. You can now access all features.'}
            {status === 'error' && errorMsg}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Link href="/dashboard">
            <Button className="w-full">Continue to Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}