import { Request, Response } from 'express';
import prisma from '../ormconfig';
import { sendSQSMessage } from '../utils/sqsUtil';
import { publishMessageToTopic } from '../utils/snsUtil';
import { ProductService } from '../services/productService';
import jwt from 'jsonwebtoken';
interface FilterOptions {
    name?: string;
    price?: number;
    quantity?: number;
  }

const productService = new ProductService();
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, filter = {} } = req.query;
    
    const products = await productService.getProducts(
      parseInt(page as string),
      parseInt(limit as string),
      filter as FilterOptions,
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
       const { name, description, price, quantity } = req.body;
       const product = await productService.createProduct(name, description, price, quantity);
        const message = JSON.stringify(product);
        await sendSQSMessage(message);
        res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {

  try {
    const productId = parseInt(req.params.id);

    const product = await productService.getProduct(productId);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
 

  try {
    const productId = parseInt(req.params.id);
    const { name, description, price, quantity } = req.body;

    const product = await productService.updateProduct(productId, name, description, price, quantity);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    } else {
      res.status(200).json(product);
    }
    if (product.quantity < 10) {
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

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const decodedToken = jwt.verify(token, String(process.env.JWT_SECRET));
    if (!decodedToken || typeof decodedToken !== 'object') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const productId = req.params.id;

    const product = await productService.getProduct(parseInt(productId));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await productService.deleteProduct(product.id);

    return res.status(200).json({ message: 'Product deleted successfully' });
    // res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const generateToken = (req: Request, res: Response): Response => {
    try {
      const token = jwt.sign({ userId: req.query.user_id }, String(process.env.JWT_SECRET), { expiresIn: '1h' });
      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error generating JWT token:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
export const filterByPriceRange = async (req: Request, res: Response) => {
  try {
    const { minPrice, maxPrice } = req.query;

    // Validate and parse the price range parameters
    const parsedMinPrice = parseInt(minPrice as string);
    const parsedMaxPrice = parseInt(maxPrice as string);
    if (isNaN(parsedMinPrice) || isNaN(parsedMaxPrice)) {
      return res.status(400).json({ error: 'Invalid price range parameters' });
    }

    // Call the productService to filter products based on the price range
    const products = await productService.filterByPriceRange(parsedMinPrice, parsedMaxPrice);

    return res.json(products);
  } catch (error) {
    console.error('Error filtering products:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
