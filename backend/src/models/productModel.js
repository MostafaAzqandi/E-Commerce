import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  remainings: { type: Number, required: true, default: 0 },
  categories: [{ type: String }],
  productImages: [{ type: String }]
}, { timestamps: true });


const Product = mongoose.model('Product', productSchema);

export default Product;