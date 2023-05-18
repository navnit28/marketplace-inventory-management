import { Request, Response } from 'express';
import prisma from '../ormconfig';
import { sendSQSMessage } from '../utils/sqsUtil';
import { publishMessageToTopic } from '../utils/snsUtil';
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, quantity } = req.body;

  try {
    const product = await prisma.product.create({
      data: { name, description, price, quantity },
    });
    const message = JSON.stringify(product);
    await sendSQSMessage(message);
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, description, price, quantity },
    });
    if(!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    if (quantity < 10) {
        const message = `Product ID: ${product.id} quantity is below the threshold.`;
        await publishMessageToTopic('arn:aws:sns:us-east-1:000000000000:test-topic', message);
      }
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({ where: { id: parseInt(id) } });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
