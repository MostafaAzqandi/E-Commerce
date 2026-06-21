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
    const {id} = req.params;
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a new product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { title, price, description, categories, remainings, productImages } = req.body;

    const product = new Product({
      title,
      price,
      description,
      categories, 
      remainings,
      productImages
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product successfully removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};