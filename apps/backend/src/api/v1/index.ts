import { Router } from 'express';
import authRouter from './auth/auth.routes';
import productRouter from './products/product.routes';
import categoryRouter from './categories/category.routes';
import orderRouter from './orders/order.routes';
import reviewRouter from './reviews/review.routes';
import userRouter from './users/user.routes';
import sellerRouter from './sellers/seller.routes';
import paymentRouter from './payments/payment.routes';
import shippingRouter from './shipping/shipping.routes'; // 1. Impor router pengiriman

const v1Router = Router();

// Daftarkan semua router untuk API v1 di sini
v1Router.use('/auth', authRouter);
v1Router.use('/products', productRouter);
v1Router.use('/categories', categoryRouter);
v1Router.use('/orders', orderRouter);
v1Router.use('/reviews', reviewRouter);
v1Router.use('/users', userRouter);
v1Router.use('/sellers', sellerRouter);
v1Router.use('/payments', paymentRouter);
v1Router.use('/shipping', shippingRouter); // 2. Gunakan router pengiriman

export default v1Router;