import express from 'express';
import { addOrderItems, getOrderById, getOrders, updateOrderToPaid } from '../controllers/orderController.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addOrderItems);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid)

router.get('/', protect, admin, getOrders);
export default router;