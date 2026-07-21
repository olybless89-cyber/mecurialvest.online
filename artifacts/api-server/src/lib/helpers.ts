import { v4 as uuidv4 } from "uuid";

export function generateAccountNumber(): string {
  const prefix = "NEX";
  const digits = Math.floor(Math.random() * 9000000000 + 1000000000).toString();
  return `${prefix}${digits}`;
}

export function generateRefNumber(): string {
  return `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export function generateToken(): string {
  return uuidv4().replace(/-/g, "") + uuidv4().replace(/-/g, "");
}

export function success(data: unknown, message = "Success") {
  return { success: true, message, data };
}

export function paginate<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
) {
  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
}
