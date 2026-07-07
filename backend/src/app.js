import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimiterMiddleware } from "./middlewares/rateLimiterMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

const app = express();

// Global Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.set("trust proxy", true);
app.use(rateLimiterMiddleware(60, 100, "global"));

app.get("/", (req, res) => {
  res.json({ message: "E-commerce API is running successfully!" });
});
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/cart", cartRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
