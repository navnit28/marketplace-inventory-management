import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export default prisma.product;

