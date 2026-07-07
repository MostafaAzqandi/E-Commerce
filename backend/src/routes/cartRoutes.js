import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getCart, syncCart } from "../controllers/cartController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getCart).put(syncCart); // PUT replaces the entire cart resource with the new state

export default router;
