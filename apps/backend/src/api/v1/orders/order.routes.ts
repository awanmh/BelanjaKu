import { Router } from 'express';
import OrderController from './order.controller';
import { createOrderValidator } from './order.validator';
import { validate } from '../../../middlewares/validator.middleware';
import { protect, authorize } from '../../../middlewares/auth.middleware';
import { body } from 'express-validator';

// Membuat instance router baru
const orderRouter = Router();

// --- Rute untuk Pembeli (User) ---
orderRouter.post(
  '/',
  protect,
  createOrderValidator,
  validate,
  OrderController.createOrder
);
orderRouter.get('/my-orders', protect, OrderController.getMyOrders);
orderRouter.get('/:id', protect, OrderController.getOrderById);


// --- Rute untuk Penjual (Seller) ---

/**
 * @route   GET /api/v1/orders/seller/my-orders
 * @desc    Mendapatkan semua pesanan yang masuk untuk penjual yang sedang login
 * @access  Private (Hanya Seller & Admin)
 */
orderRouter.get(
    '/seller/my-orders',
    protect,
    authorize('seller', 'admin'),
    OrderController.getSellerOrders
);

/**
 * @route   PUT /api/v1/orders/seller/update-status/:id
 * @desc    Memperbarui status pesanan oleh penjual
 * @access  Private (Hanya Seller & Admin)
 */
orderRouter.put(
    '/seller/update-status/:id',
    protect,
    authorize('seller', 'admin'),
    [ // Validasi sederhana untuk status
        body('status').isIn(['processing', 'shipped']).withMessage('Invalid status provided')
    ],
    validate,
    OrderController.updateOrderStatus
);


export default orderRouter;
