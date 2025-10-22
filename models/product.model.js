import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    price : {
        type : Number,
        required :true
    },
    categories : {
        type : ["String"],
        default : ["Uncategorized"],
        required : true
    },
    image : {
        type : String,
        required : true
    },
    stock : {
        type : Number,
        default : 0,
        required : true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
}, {timestamps : true})


export const Product = mongoose.model("Product", productSchema)