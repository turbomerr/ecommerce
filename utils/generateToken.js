import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

//create a jwt token and return
export const generateJWT = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn : "1h"})
    return token
}