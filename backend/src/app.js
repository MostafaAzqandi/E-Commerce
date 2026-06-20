import express from 'express';
import cors from 'cors';
import productRouter from "./routes/productRoutes.js"

const app = express();

// Global Middlewares
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running successfully!' });
});
app.use("/api/v1/products/", productRouter);

export default app;