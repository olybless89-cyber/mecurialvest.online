import { prisma } from '../config/database';

export const generateAccountNumber = async (): Promise<string> => {
  let accountNumber: string;
  let exists = true;

  do {
    // Generate 10-digit account number starting with a non-zero digit
    const prefix = Math.floor(Math.random() * 9) + 1;
    const rest = Math.floor(Math.random() * 1_000_000_000).toString().padStart(9, '0');
    accountNumber = `${prefix}${rest}`;

    const account = await prisma.account.findUnique({ where: { accountNumber } });
    exists = !!account;
  } while (exists);

  return accountNumber;
};
