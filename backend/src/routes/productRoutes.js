import express from "express";
import { getAllProducts, getProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts)
router.get("/:id", getProduct)
router.post('/', () => {});
router.put('/:id', () => {});
router.delete('/:id', () => {});



export default router;
