import ProductModel, { Product } from '../models/product';

export const getProduct = async (id: number): Promise<Product | null> => {
  return await ProductModel.findUnique({ where: { id } });
};

export const updateProductQuantity = async (id: number, quantity: number): Promise<Product | null> => {
  return await ProductModel.update({ where: { id }, data: { quantity } });
};
