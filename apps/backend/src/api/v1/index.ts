import { Router } from 'express';
import authRouter from './auth/auth.routes';
import productRouter from './products/product.routes';
import categoryRouter from './categories/category.routes';
import orderRouter from './orders/order.routes';
import reviewRouter from './reviews/review.routes'; // 1. Impor router ulasan

const v1Router = Router();

// Daftarkan semua router untuk API v1 di sini
v1Router.use('/auth', authRouter);
v1Router.use('/products', productRouter);
v1Router.use('/categories', categoryRouter);
v1Router.use('/orders', orderRouter);
v1Router.use('/reviews', reviewRouter); // 2. Gunakan router ulasan

export default v1Router;

