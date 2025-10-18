import express from "express"
import {login, signup, logout, profile, verify} from "../controllers/authController.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.post("/profile", profile)
router.get("/verify/:token", verify)


export default router;