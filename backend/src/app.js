import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

const app = express();

// Global Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "E-commerce API is running successfully!" });
});
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
