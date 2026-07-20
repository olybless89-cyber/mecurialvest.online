import { PrismaClient, Role, AccountType, NotificationType, AuditAction } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nexbank.com' },
    update: {},
    create: {
      id: uuidv4(),
      email: 'admin@nexbank.com',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: Role.SUPER_ADMIN,
      isEmailVerified: true,
      isActive: true,
    },
  });

  // Create admin account
  const adminAccount = await prisma.account.upsert({
    where: { accountNumber: '0000000000' },
    update: {},
    create: {
      userId: admin.id,
      accountNumber: '0000000000',
      type: AccountType.CHECKING,
      balance: 1000000,
      isDefault: true,
      nickname: 'Admin Account',
    },
  });

  // Create demo user
  const userPassword = await bcrypt.hash('User@123456', 12);
  const user = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      id: uuidv4(),
      email: 'john.doe@example.com',
      password: userPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      role: Role.USER,
      isEmailVerified: true,
      isActive: true,
    },
  });

  // Create demo accounts
  const checkingAccount = await prisma.account.upsert({
    where: { accountNumber: '1234567890' },
    update: {},
    create: {
      userId: user.id,
      accountNumber: '1234567890',
      type: AccountType.CHECKING,
      balance: 15420.50,
      isDefault: true,
      nickname: 'Main Checking',
    },
  });

  const savingsAccount = await prisma.account.upsert({
    where: { accountNumber: '1234567891' },
    update: {},
    create: {
      userId: user.id,
      accountNumber: '1234567891',
      type: AccountType.SAVINGS,
      balance: 32800.00,
      nickname: 'Emergency Fund',
    },
  });

  const investmentAccount = await prisma.account.upsert({
    where: { accountNumber: '1234567892' },
    update: {},
    create: {
      userId: user.id,
      accountNumber: '1234567892',
      type: AccountType.INVESTMENT,
      balance: 88500.00,
      nickname: 'Investment Portfolio',
    },
  });

  // Create demo transactions for checking account
  const txRefs = Array.from({ length: 20 }, () => uuidv4());
  const now = new Date();
  const transactionData = [
    { amount: 3500.00, type: 'CREDIT', desc: 'Monthly Salary', category: 'Income', daysAgo: 2, balBefore: 11920.50, balAfter: 15420.50 },
    { amount: 85.00, type: 'DEBIT', desc: 'Netflix Subscription', category: 'Entertainment', daysAgo: 3, balBefore: 12005.50, balAfter: 11920.50 },
    { amount: 320.00, type: 'DEBIT', desc: 'Grocery Store', category: 'Food', daysAgo: 5, balBefore: 12325.50, balAfter: 12005.50 },
    { amount: 1200.00, type: 'DEBIT', desc: 'Rent Payment', category: 'Housing', daysAgo: 7, balBefore: 13525.50, balAfter: 12325.50 },
    { amount: 250.00, type: 'CREDIT', desc: 'Freelance Project', category: 'Income', daysAgo: 10, balBefore: 13275.50, balAfter: 13525.50 },
    { amount: 45.00, type: 'DEBIT', desc: 'Gas Station', category: 'Transport', daysAgo: 12, balBefore: 13320.50, balAfter: 13275.50 },
    { amount: 180.00, type: 'DEBIT', desc: 'Electric Bill', category: 'Utilities', daysAgo: 15, balBefore: 13500.50, balAfter: 13320.50 },
    { amount: 500.00, type: 'TRANSFER', desc: 'Transfer to Savings', category: 'Transfer', daysAgo: 18, balBefore: 14000.50, balAfter: 13500.50 },
    { amount: 3500.00, type: 'CREDIT', desc: 'Monthly Salary', category: 'Income', daysAgo: 32, balBefore: 10500.50, balAfter: 14000.50 },
    { amount: 150.00, type: 'DEBIT', desc: 'Restaurant', category: 'Food', daysAgo: 35, balBefore: 10650.50, balAfter: 10500.50 },
  ];

  for (let i = 0; i < transactionData.length; i++) {
    const tx = transactionData[i];
    const txDate = new Date(now.getTime() - tx.daysAgo * 24 * 60 * 60 * 1000);
    await prisma.transaction.upsert({
      where: { reference: txRefs[i] },
      update: {},
      create: {
        userId: user.id,
        debitAccountId: tx.type === 'DEBIT' || tx.type === 'TRANSFER' ? checkingAccount.id : undefined,
        creditAccountId: tx.type === 'CREDIT' ? checkingAccount.id : undefined,
        type: tx.type as any,
        status: 'COMPLETED',
        amount: tx.amount,
        reference: txRefs[i],
        description: tx.desc,
        category: tx.category,
        balanceBefore: tx.balBefore,
        balanceAfter: tx.balAfter,
        createdAt: txDate,
      },
    });
  }

  // Create beneficiaries
  await prisma.beneficiary.createMany({
    skipDuplicates: true,
    data: [
      { userId: user.id, name: 'Alice Johnson', accountNumber: '9876543210', bankName: 'Chase Bank', isInternal: false, nickname: 'Alice' },
      { userId: user.id, name: 'Bob Smith', accountNumber: '8765432109', bankName: 'Bank of America', isInternal: false, nickname: 'Bob' },
      { userId: user.id, name: 'Savings Account', accountNumber: '1234567891', bankName: 'NexBank', isInternal: true, nickname: 'My Savings' },
    ],
  });

  // Create notifications
  await prisma.notification.createMany({
    data: [
      { userId: user.id, type: NotificationType.TRANSACTION, title: 'Salary Received', message: 'Your salary of $3,500.00 has been credited to your account.', isRead: false },
      { userId: user.id, type: NotificationType.SECURITY, title: 'New Login Detected', message: 'A new login was detected from Chrome on Windows.', isRead: true },
      { userId: user.id, type: NotificationType.SYSTEM, title: 'Welcome to NexBank!', message: 'Thank you for joining NexBank. Your account is ready.', isRead: true },
    ],
  });

  // Create audit logs
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: AuditAction.REGISTER,
      resource: 'User',
      resourceId: user.id,
      details: { email: user.email },
      ipAddress: '127.0.0.1',
    },
  });

  console.log('✅ Seeding complete!');
  console.log('👤 Admin: admin@nexbank.com / Admin@123456');
  console.log('👤 Demo:  john.doe@example.com / User@123456');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
