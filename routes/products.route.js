import express from "express"
import {adminCheck, createProduct, getAllProduct, getProductById, updateProduct} from "../controllers/products.controller.js"
import { verifyToken } from "../utils/generateToken.js";

const router = express.Router();

router.post("/create", verifyToken, adminCheck, createProduct)
router.get("/", getAllProduct)
router.get("/:id", getProductById)
router.patch("/:id", verifyToken, adminCheck, updateProduct)



export default router