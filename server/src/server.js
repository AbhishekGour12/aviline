import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ProductRoutes from "./Routes/ProductRoutes.js";
import MongoDBConnect from "./config/MongoDBConnect.js";
import path from "path"
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

MongoDBConnect();
app.use(
  "/uploads/products",
  express.static(path.join(process.cwd(), "uploads", "products"))
);
app.use("/api/product", ProductRoutes)

app.get("/", (req, res) =>{
    res.send("Hello World");
})
app.listen(process.env.PORT || 5000, () =>{
    console.log(`Server is running on port ${process.env.PORT }`);
})