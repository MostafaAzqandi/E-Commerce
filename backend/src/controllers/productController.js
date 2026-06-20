import Product from '../models/productModel.js';

// @desc    Get all products
// @route   GET /api/v1/products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); 
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a product
// @route   GET /api/v1/products/:id
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById({id: req.params.id});
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};