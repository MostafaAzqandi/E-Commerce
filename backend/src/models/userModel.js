import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, trim: true },
  age: { type: Number },
  address: { type: String },
  avatar: { type: String, default: 'https://placehold.co/150' },
  role: { type: String, enum: ['customer', 'admin', 'manager'], default: 'customer' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;