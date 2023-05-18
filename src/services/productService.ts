// productService.ts

import { Product } from '../models/product';
import { Prisma } from '@prisma/client';
import prisma from '../ormconfig';
interface FilterOptions {
    name?: string;
    price?: number;
    quantity?: number;
  }
interface SortOptions {
    field: string;
    direction: 'asc' | 'desc';
    }
export class ProductService {
    public async getProducts(page: number, limit: number, filterOptions: FilterOptions): Promise<Product[]> {
        const offset = (page - 1) * limit;
        const products = await prisma.product.findMany({
          skip: offset,
          take: limit,
          where: filterOptions,
        });
        return products;
      }

  public async createProduct(name: string, description: string, price: number, quantity: number): Promise<Product> {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        quantity,
      },
    });
    return product;
  }

  public async getProduct(productId: number): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    return product;
  }

  public async updateProduct(
    productId: number,
    name: string,
    description: string,
    price: number,
    quantity: number
  ): Promise<Product | null> {
    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        description,
        price,
        quantity,
      },
    });
    return product;
  }

  public async deleteProduct(productId: number): Promise<boolean> {
    const deleted = await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    return !!deleted;
  }
}
