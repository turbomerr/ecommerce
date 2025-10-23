import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";

//admin check, user is admin or not, after that he can forward another endpoint
export const adminCheck = async (req, res, next) => {

    try {
        const user = await User.findById(req.userId);
        if (!user.role === "admin") {
            res.status(200).json({ message: "Just Admin can create a product" })

        }
        next()

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "You are not admin, you cannot create a product" })
    }
}

export const createProduct = async (req, res) => {

    try {
        const { data } = req.body;
        const admin = await User.findById(req.userId); // it musst be admin !
        if (!admin) {
            return res.status(404).json({ message: "You cannot be here" })
            // res.redirect("/")
        }
        if (!data) {
            return res.status(400).json({ message: "Inputs must be filled" })
        }

        const newProduct = await Product.create({
            ...data,
            createdBy: admin._id
        })
        await newProduct.save()
        return res.status(201).json({ message: "Product created successfully", data })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Create product failed" })
    }
}

export const getAllProduct = async (req, res) => {
    try {
        const allProducts = await Product.find();
        if (!allProducts) {
            return res.status(400).json({ message: "No products found" })
        }
        return res.status(200).json({ message: "Fetch all products", allProducts, length: allProducts.length })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Fetch all products error" })
    }
}

export const getProductById = async (req, res) => {

    try {
        const { id } = req.params;
        const choosenProduct = await Product.findById(id)
        //console.log(choosenProduct)
        if (!choosenProduct) {
            return res.status(404).json({ message: "Product ist not exist in database" })
        }
        return res.status(200).json({ message: "Product founded", choosenProduct })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Fetch product by id error " })
    }
}

export const updateProduct = async (req, res) => {

    try {
        const { id } = req.params;
        const { data } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        )

        if (!updatedProduct) {
            return res.status(404).json({ message: "Updated Product not found" })
        }
        return res.status(201).json({ message: "Product updated successfully", updatedProduct })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Update product failed" })
    }
}


export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id)
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        const leftProducts = await Product.find()
        return res.status(200).json({message : "Product deleted successfully", leftProducts})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Error by deleting product"})
    }
}