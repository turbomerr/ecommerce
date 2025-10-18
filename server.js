import cookieParser from "cookie-parser";
import express from "express"
import helmet from "helmet"
import { connectDB } from "./db/connectDB.js";
import authRouter from "./routes/auth.route.js";

const app = express();
app.use(helmet({contentSecurityPolicy : false }))
app.use(cookieParser())
app.use(express.json())


app.use("/api/auth", authRouter) //register login profile
// app.use("/api/products") //
// app.use("/api/cart")
// app.use("/api/orders")
// app.use("/api/payments")
// app.use("/api/reviews")

app.listen(4000, async() => {
    connectDB()
    console.log("Server running on port 4000")
})