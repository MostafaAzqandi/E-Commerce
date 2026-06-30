import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import createNotification from "../utils/createNotification.js";

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, shippingPrice } =
    req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  let calculatedItemsPrice = 0;
  const verifiedOrderItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      res.status(404);
      throw new Error(`Product not found for ID: ${item.product}`);
    }

    if (product.remainings < item.qty) {
      res.status(400);
      throw new Error(
        `Insufficient stock for "${product.title}". Only ${product.remainings} items left, but you requested ${item.qty}.`,
      );
    }

    const dbPrice = product.price;
    calculatedItemsPrice += dbPrice * item.qty;

    verifiedOrderItems.push({
      title: product.title,
      qty: item.qty,
      image:
        product.productImages && product.productImages.length > 0
          ? product.productImages[0]
          : "https://picsum.photos/200",
      price: dbPrice,
      product: product._id,
    });
  }

  const verifiedShippingPrice =
    shippingPrice !== undefined ? Number(shippingPrice) : 0;
  const verifiedTotalPrice = calculatedItemsPrice + verifiedShippingPrice;

  const order = new Order({
    user: req.user._id,
    orderItems: verifiedOrderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice: calculatedItemsPrice,
    shippingPrice: verifiedShippingPrice,
    totalPrice: verifiedTotalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "firstName lastName email",
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  const isOwner = order.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error("Order access denied");
  }

  res.status(200).json(order);
});

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "firstName lastName");
  res.status(200).json(orders);
});

// @desc    Update order to paid & decrease product stock
// @route   PUT /api/v1/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Order access denied");
  }
  if (order.isPaid) {
    res.status(400);
    throw new Error("This order has already been paid for");
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer?.email_address || req.body.email_address,
  };

  const updatedOrder = await order.save();

  const updateStockPromises = order.orderItems.map(async (item) => {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { remainings: -item.qty },
    });
  });

  await Promise.all(updateStockPromises);
  await createNotification({
    user: order.user,
    title: "Payment Received!",
    message: `Your payment for order #${order._id} was successful. We are packing your items!`,
    link: `/orders/${order._id}`,
  });
  res.status(200).json(updatedOrder);
});

// @desc    Update order to delivered
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.isDelivered) {
      res.status(400);
      throw new Error("Order is already delivered");
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    createNotification({
      user: order.user,
      title: "Order Delivered!",
      message: `Great news! Your order #${order._id} has been marked as delivered.`,
      link: `/orders/${order._id}`,
    });

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});
