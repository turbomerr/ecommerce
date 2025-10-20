import mongoose from "mongoose";
import bcrypt from "bcryptjs"


const userSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password : {
        type : String,
        required : true,
        minLength : 6,
    },
    role : {
        type : String,
        enum : ["admin", "user"],
        default : "user"
    },
    address :{
        street : String,
        city : String,
        zip : String,
        country : String
    },
    verified : {
        type : Boolean,
        default : false
    },
    verifyToken : {
        type : String
    },
    verifyTokenExpire : {
        type : Date
    },

}, {timestamps : true})
//hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})
//compare password
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

export const User = mongoose.model("User", userSchema)