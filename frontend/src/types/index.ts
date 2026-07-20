export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';
export type AccountType = 'CHECKING' | 'SAVINGS' | 'INVESTMENT';
export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED';
export type TransactionType = 'CREDIT' | 'DEBIT' | 'TRANSFER' | 'FEE' | 'INTEREST' | 'REVERSAL';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
export type NotificationType = 'TRANSACTION' | 'SECURITY' | 'SYSTEM' | 'PROMOTION';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  role: Role;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  lastLoginIp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  type: AccountType;
  status: AccountStatus;
  balance: number;
  currency: string;
  nickname?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  debitAccountId?: string;
  creditAccountId?: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  reference: string;
  description?: string;
  category?: string;
  balanceBefore: number;
  balanceAfter: number;
  reversedAt?: string;
  createdAt: string;
  debitAccount?: Partial<Account>;
  creditAccount?: Partial<Account>;
}

export interface Transfer {
  id: string;
  senderId: string;
  receiverId?: string;
  fromAccountId: string;
  toAccountId: string;
  transactionId: string;
  amount: number;
  currency: string;
  note?: string;
  completedAt?: string;
  createdAt: string;
  fromAccount?: Partial<Account>;
  toAccount?: Partial<Account>;
  sender?: Partial<User>;
  receiver?: Partial<User>;
}

export interface Beneficiary {
  id: string;
  userId: string;
  name: string;
  accountNumber: string;
  bankName: string;
  bankCode?: string;
  isInternal: boolean;
  nickname?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: Partial<User>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AccountStats {
  accounts: Account[];
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface TransactionSummary {
  period: number;
  income: number;
  expenses: number;
  net: number;
  transactionCount: number;
  categoryBreakdown: { category: string; amount: number }[];
}

export interface AdminStats {
  users: { total: number; active: number; newThisMonth: number; growth: number };
  accounts: { total: number; totalBalance: number };
  transactions: { total: number; pending: number; monthlyVolume: number; volumeGrowth: number };
}
