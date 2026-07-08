import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import { clearCache } from "../utils/clearCache.js";

// @desc    Fetch all products with search, filtering, and pagination
// @route   GET /api/v1/products
// @access  Public
export const getAllProducts = asyncHandler(async (req, res) => {
  // Pagination
  const pageSize = 7;
  const page = Number(req.query.pageNumber) || 1;

  // Search Feature
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  // Filtering Feature
  const categoryFilter = req.query.category
    ? { categories: req.query.category }
    : {};

  const queryConditions = { ...keyword, ...categoryFilter };

  const count = await Product.countDocuments(queryConditions);

  const products = await Product.find(queryConditions)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.status(200).json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    totalProducts: count,
  });
});

// @desc    Get a product
// @route   GET /api/v1/products/:id
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404);
    throw new Error("Product Not found");
  }
});

// @desc    Create a new product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { title, price, description, categories, remainings, productImages } =
    req.body;

  // Basic validation check
  if (!title || !price) {
    res.status(400);
    throw new Error("Please provide at least a product title and price");
  }

  const product = new Product({
    title,
    price,
    description,
    categories,
    remainings,
    productImages,
  });

  const createdProduct = await product.save();

  await clearCache("cache:/api/v1/products*");

  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: true, runValidators: true },
  );

  if (updatedProduct) {
    await clearCache("cache:/api/v1/products*");
    return res.status(200).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  if (deletedProduct) {
    await clearCache("cache:/api/v1/products*");
    return res.status(200).json({ message: "Product successfully removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
