import redisClient from "../configs/redis.js";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

// @desc    Get current user's cart from Redis
// @route   GET /api/v1/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
  const cartKey = `cart:${req.user._id}`;

  const cachedCart = await redisClient.get(cartKey);

  if (!cachedCart) {
    return res.status(200).json({ items: [] });
  }

  res.status(200).json(JSON.parse(cachedCart));
});

// @desc    Sync/Overwrite entire cart state
// @route   PUT /api/v1/cart
// @access  Private
export const syncCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cartKey = `cart:${userId}`;
  const { items } = req.body;

  if (!items || items.length === 0) {
    await redisClient.del(cartKey);
    return res.status(200).json({ message: "Cart cleared", items: [] });
  }

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      res.status(444);
      throw new Error(`Product with ID ${item.productId} no longer exists.`);
    }

    if (item.quantity > product.remainings) {
      return res.status(400).json({
        message: `Stock limit exceeded for "${product.title}". Only ${product.remainings} left in stock, but you requested ${item.quantity}.`,
      });
    }
  }

  // Construct our schema-less Redis data object
  const cartData = {
    userId,
    items,
    updatedAt: new Date(),
  };

  // Save to Redis with a 14-day expiration (14 days * 24h * 60m * 60s)
  await redisClient.set(
    cartKey,
    JSON.stringify(cartData),
    "EX",
    14 * 24 * 60 * 60,
  );

  res.status(200).json({ message: "Cart synced successfully", cart: cartData });
});
