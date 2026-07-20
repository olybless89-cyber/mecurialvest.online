'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Camera, Loader2, Save, Key, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/components/ui/use-toast';
import { extractError } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const profileSchema = z.object({
  firstName: z.string().min(2, 'At least 2 characters'),
  lastName: z.string().min(2, 'At least 2 characters'),
  phone: z.string().optional(),
});
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(8, 'At least 8 characters').regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const { register: regProfile, handleSubmit: hProfile, formState: { errors: errs1, isDirty: dirty1 } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' },
  });
  const { register: regPwd, handleSubmit: hPwd, reset: resetPwd, formState: { errors: errs2 } } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const updateProfile = useMutation({
    mutationFn: (data: ProfileForm) => profileApi.update(data),
    onSuccess: (res) => { setUser(res.data.data); qc.invalidateQueries({ queryKey: ['profile'] }); toast({ title: 'Profile updated!' }); },
    onError: (e) => toast({ title: 'Error', description: extractError(e), variant: 'destructive' }),
  });

  const changePassword = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) => profileApi.changePassword(data),
    onSuccess: () => { toast({ title: 'Password changed!' }); resetPwd(); },
    onError: (e) => toast({ title: 'Error', description: extractError(e), variant: 'destructive' }),
  });

  const uploadAvatar = async (file: File) => {
    setAvatarUploading(true);
    try {
      const res = await profileApi.uploadAvatar(file);
      setUser({ avatarUrl: res.data.data?.avatarUrl });
      toast({ title: 'Avatar updated!' });
    } catch (e) {
      toast({ title: 'Upload failed', description: extractError(e), variant: 'destructive' });
    } finally {
      setAvatarUploading(false);
    }
  };

  const deleteAvatar = useMutation({
    mutationFn: () => profileApi.deleteAvatar(),
    onSuccess: () => { setUser({ avatarUrl: undefined }); toast({ title: 'Avatar removed' }); },
    onError: (e) => toast({ title: 'Error', description: extractError(e), variant: 'destructive' }),
  });

  const onPasswordSubmit = ({ currentPassword, newPassword }: PasswordForm) => changePassword.mutate({ currentPassword, newPassword });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground text-sm">Manage your personal information</p>
      </div>

      {/* Avatar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader><CardTitle className="text-base">Profile Picture</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatarUrl || ''} />
                <AvatarFallback className="bg-blue-500 text-white text-xl font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              {avatarUploading && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) uploadAvatar(e.target.files[0]); }} />
              <Button variant="outline" size="sm" className="gap-2" onClick={() => fileRef.current?.click()} disabled={avatarUploading}>
                <Camera className="h-3.5 w-3.5" />Change Photo
              </Button>
              {user?.avatarUrl && (
                <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive" onClick={() => deleteAvatar.mutate()} disabled={deleteAvatar.isPending}>
                  <Trash2 className="h-3.5 w-3.5" />Remove
                </Button>
              )}
              <p className="text-xs text-muted-foreground">JPG, PNG, or WebP. Max 5MB.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
          <CardDescription>Update your name and contact details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={hProfile((d) => updateProfile.mutate(d))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input {...regProfile('firstName')} />
                {errs1.firstName && <p className="text-red-500 text-xs">{errs1.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input {...regProfile('lastName')} />
                {errs1.lastName && <p className="text-red-500 text-xs">{errs1.lastName.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email <span className="text-muted-foreground">(cannot change)</span></Label>
              <Input value={user?.email || ''} disabled className="opacity-60" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input type="tel" placeholder="+1 234 567 8900" {...regProfile('phone')} />
            </div>
            <Button type="submit" className="gap-2" disabled={updateProfile.isPending || !dirty1}>
              {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Key className="h-4 w-4" />Change Password</CardTitle>
          <CardDescription>Keep your account secure with a strong password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={hPwd(onPasswordSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" {...regPwd('currentPassword')} />
              {errs2.currentPassword && <p className="text-red-500 text-xs">{errs2.currentPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" {...regPwd('newPassword')} />
              {errs2.newPassword && <p className="text-red-500 text-xs">Must be 8+ chars with uppercase, lowercase, number</p>}
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type="password" {...regPwd('confirmPassword')} />
              {errs2.confirmPassword && <p className="text-red-500 text-xs">{errs2.confirmPassword.message}</p>}
            </div>
            <Button type="submit" variant="outline" className="gap-2" disabled={changePassword.isPending}>
              {changePassword.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
