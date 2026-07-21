import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';

// Public Pages
import Landing from '@/pages/Landing';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import VerifyEmail from '@/pages/auth/VerifyEmail';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';

// Protected Pages
import Dashboard from '@/pages/Dashboard';
import Accounts from '@/pages/Accounts';
import AccountDetail from '@/pages/AccountDetail';
import Transactions from '@/pages/Transactions';
import Transfer from '@/pages/Transfer';
import Beneficiaries from '@/pages/Beneficiaries';
import Notifications from '@/pages/Notifications';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminTransactions from '@/pages/admin/AdminTransactions';
import AdminAuditLogs from '@/pages/admin/AdminAuditLogs';

// Fallback
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />

      {/* Protected Routes */}
      <Route path="/dashboard">
        <ProtectedRoute><ProtectedLayout><Dashboard /></ProtectedLayout></ProtectedRoute>
      </Route>
      <Route path="/accounts">
        <ProtectedRoute><ProtectedLayout><Accounts /></ProtectedLayout></ProtectedRoute>
      </Route>
      <Route path="/accounts/:id">
        <ProtectedRoute><ProtectedLayout><AccountDetail /></ProtectedLayout></ProtectedRoute>
      </Route>
      <Route path="/transactions">
        <ProtectedRoute><ProtectedLayout><Transactions /></ProtectedLayout></ProtectedRoute>
      </Route>
      <Route path="/transfer">
        <ProtectedRoute><ProtectedLayout><Transfer /></ProtectedLayout></ProtectedRoute>
      </Route>
      <Route path="/beneficiaries">
        <ProtectedRoute><ProtectedLayout><Beneficiaries /></ProtectedLayout></ProtectedRoute>
      </Route>
      <Route path="/notifications">
        <ProtectedRoute><ProtectedLayout><Notifications /></ProtectedLayout></ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute><ProtectedLayout><Profile /></ProtectedLayout></ProtectedRoute>
      </Route>
      <Route path="/settings">
        <ProtectedRoute><ProtectedLayout><Settings /></ProtectedLayout></ProtectedRoute>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin">
        <ProtectedRoute adminOnly><ProtectedLayout><AdminDashboard /></ProtectedLayout></ProtectedRoute>
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute adminOnly><ProtectedLayout><AdminUsers /></ProtectedLayout></ProtectedRoute>
      </Route>
      <Route path="/admin/transactions">
        <ProtectedRoute adminOnly><ProtectedLayout><AdminTransactions /></ProtectedLayout></ProtectedRoute>
      </Route>
      <Route path="/admin/audit-logs">
        <ProtectedRoute adminOnly><ProtectedLayout><AdminAuditLogs /></ProtectedLayout></ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;