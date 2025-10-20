import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

//create a jwt token and return
export const generateJWT = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn : "1h"})
    return token
}

export const verifyToken = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded)
}