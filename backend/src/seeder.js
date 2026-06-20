import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import Product from './models/productModel.js';

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected for seeding...');

    await Product.deleteMany();
    console.log('Old products cleared.');

    const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen'];
    const fakeProductsArray = Array.from({ length: 100 }).map(() => ({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
      remainings: faker.number.int({ min: 0, max: 50 }),
      categories: faker.helpers.arrayElements(categories, { min: 1, max: 3 }),
      productImages: faker.image.url()
    }));


    await Product.insertMany(fakeProductsArray);
    console.log('100 Fake Products Inserted Successfully!');

    process.exit(0);
  } catch (error) {
    console.error(`Error with data seeding: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();