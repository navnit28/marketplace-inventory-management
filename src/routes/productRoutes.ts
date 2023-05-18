import { Router } from 'express';
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  generateToken,
  filterByPriceRange
} from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
// productRoutes.ts
// Route for generating JWT token
router.post('/auth/token', generateToken);
router.get('/price/filter', filterByPriceRange)
export default router;
