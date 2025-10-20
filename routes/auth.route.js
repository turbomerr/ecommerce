import express from "express"
import {login, signup, logout, profile, verify} from "../controllers/authController.js"
import { verifyToken } from "../utils/generateToken.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.get("/profile", verifyToken, profile)
router.get("/verify/:token", verify)


export default router;