import express from 'express';
import { config } from 'dotenv';
import productRoutes from './routes/productRoutes';
// import { sqsListener } from './services/sqsListener';

// ... existing code


config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use('/products', productRoutes);
// setInterval(sqsListener, 5000);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
