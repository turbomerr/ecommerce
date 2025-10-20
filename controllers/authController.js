import { User } from "../models/user.model.js";
import { Resend } from "resend";
import dotenv from "dotenv"
import { generateJWT, verifyToken } from "../utils/generateToken.js"

dotenv.config()

const resend = new Resend(process.env.RESEND_KEY);

export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "Inputs must be completed" })
            
        }

        const existUser = await User.findOne({ email }).select("-password");
        if (existUser) {
            return res.status(400).json({ message: "Email already exist" })
        }
        const newUser = await User.create({
            fullname,
            email,
            password
        })
        const token = generateJWT(newUser._id);
        newUser.verifyToken = token;
        newUser.verifyTokenExpire = Date.now() + 60 * 60 * 1000; // 1 hour

        await newUser.save()

        const verifyUrl = `http://localhost:4000/api/auth/verify/${token}`;

        const {data, error} = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: "Verify your account",
            html: `
        <h2>Welcome, ${fullname}!</h2>
        <p>Please verify your account by clicking the link below:</p>
        <a href="${verifyUrl}" style="color:blue">Verify Account</a>
      `,
        });
        if(error) return res.status(400).json({message : "Verify Email error"})

        res.status(200).json({ message: "Verification email sent", data : newUser});


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Registration failed" });
    }


}

export const login = async (req, res) => {

    const {email, password} = req.body;

    try {
        if(!email || !password) {
            return res.status(400).json({message : "Inputs must be completed"})
        }

        const existUser = await User.findOne({email}).select("-password")

        if(!existUser){
            return res.status(404).json({message : "User not found"})
        }

        const isMatched = existUser.comparePassword(password)
        if(!isMatched){
            return res.status(400).json({message : "Password not match, please try again!"})
        }

        const token = generateJWT({userId : existUser.id})
        console.log("Token for user", token)

        res.cookie("token", token, {
            httpOnly : true,
            sameSite : "strict",
            maxAge: 60 * 60 * 1000,
        })
        

        return res.status(200).json({message : "User loggedin successfully", data : existUser})
        
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login failed" });
    }


}


export const logout = async (req, res) => {


}


export const profile = async (req, res) => {

   

}
export const verify = async (req, res) => {
    const { token } = req.params;

    try {
        const verifiedUser = await User.findOne({
            verifyToken: token,
            verifyTokenExpire: { $gt: Date.now() } //greater than now 
        }).select("-password")

        if (!verifiedUser) return res.status(400).json({ message: "Invalid or expired token" })

        verifiedUser.verified = true;
        verifiedUser.verifyToken = undefined;
        verifiedUser.verifyTokenExpire = undefined;

        await verifiedUser.save()


        await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: verifiedUser.email,
            subject: "Your Email Verified",
            html: `<h2>Welcome, ${verifiedUser.fullname}!</h2>`
        })
        res.json({ message: "Email verified successfully", user : verifiedUser});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Email verification failed"});
    }
}