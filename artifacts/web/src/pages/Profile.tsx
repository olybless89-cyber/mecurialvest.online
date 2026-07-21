import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useGetProfile,
  useUpdateProfile,
  useChangePassword,
  getGetProfileQueryKey,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  middleName: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  occupation: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function Profile() {
  const queryClient = useQueryClient();
  const { data: profileRes, isLoading } = useGetProfile();
  const profile = profileRes?.data;

  const updateMutation = useUpdateProfile();
  const passwordMutation = useChangePassword();

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      city: '',
      state: '',
      country: '',
      occupation: '',
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        middleName: (profile as any).middleName || '',
        phone: (profile as any).phone || '',
        dateOfBirth: (profile as any).dateOfBirth
          ? (profile as any).dateOfBirth.split('T')[0]
          : '',
        address: (profile as any).address || '',
        city: (profile as any).city || '',
        state: (profile as any).state || '',
        country: (profile as any).country || '',
        occupation: (profile as any).occupation || '',
      });
    }
  }, [profile, profileForm]);

  const onProfileSubmit = async (data: any) => {
    try {
      await updateMutation.mutateAsync({ data });
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update profile');
    }
  };

  const onPasswordSubmit = async (data: any) => {
    try {
      await passwordMutation.mutateAsync({
        data: { currentPassword: data.currentPassword, newPassword: data.newPassword },
      });
      toast.success('Password changed successfully');
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to change password');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-6" />
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Manage your personal information and security settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your contact details and address.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input {...profileForm.register('firstName')} />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input {...profileForm.register('lastName')} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Middle Name (Optional)</Label>
                    <Input {...profileForm.register('middleName')} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" {...profileForm.register('dateOfBirth')} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input type="tel" {...profileForm.register('phone')} />
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Label>Street Address</Label>
                  <Input {...profileForm.register('address')} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input {...profileForm.register('city')} />
                  </div>
                  <div className="space-y-2">
                    <Label>State / Province</Label>
                    <Input {...profileForm.register('state')} />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input {...profileForm.register('country')} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Occupation</Label>
                  <Input {...profileForm.register('occupation')} />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Change your password.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" {...passwordForm.register('currentPassword')} />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-xs text-destructive">
                      {passwordForm.formState.errors.currentPassword.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" {...passwordForm.register('newPassword')} />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-xs text-destructive">
                      {passwordForm.formState.errors.newPassword.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" {...passwordForm.register('confirmPassword')} />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-destructive">
                      {passwordForm.formState.errors.confirmPassword.message as string}
                    </p>
                  )}
                </div>
                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={passwordMutation.isPending}>
                    {passwordMutation.isPending ? 'Updating…' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="p-6 space-y-2">
              <h3 className="font-medium text-sm">Account Status</h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Verification</span>
                <span
                  className={
                    profile?.isEmailVerified
                      ? 'text-green-600 font-medium'
                      : 'text-yellow-600 font-medium'
                  }
                >
                  {profile?.isEmailVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Joined</span>
                <span>
                  {profile?.createdAt
                    ? format(new Date(profile.createdAt), 'MMMM yyyy')
                    : '—'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
