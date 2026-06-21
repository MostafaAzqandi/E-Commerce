import express from 'express';
import cors from 'cors';
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js"

const app = express();

// Global Middlewares
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running successfully!' });
});
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);

export default app;