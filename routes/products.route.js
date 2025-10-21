import express from "express"
import {adminCheck, createProduct} from "../controllers/products.controller.js"
import { verifyToken } from "../utils/generateToken.js";

const router = express.Router();

router.get("/create", verifyToken, adminCheck, createProduct)



export default router