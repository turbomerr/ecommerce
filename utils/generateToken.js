import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

//create a jwt token and return
export const generateJWT = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" })

}

// export const verifyToken = (req, res, next) => {
//     try {
//         const token = req.cookies.token;
//         console.log("req token ", token)

//         if (!token) {
//             console.log("no token")
//             return res.status(401).json({ message: "Access denied. No token provided." });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.userId = decoded.userId;
//         next()

//     } catch (error) {
//          console.error("Token verification failed:", error);
//     return res.status(401).json({ message: "Invalid or expired token." });
//     }
// }

export const verifyToken = (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1]; // "Bearer <token>"
        }

        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;

        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};
