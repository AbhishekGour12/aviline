import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ProductRoutes from "./Routes/ProductRoutes.js";
import MongoDBConnect from "./config/MongoDBConnect.js";
import path from "path";
import UserRoutes from "./Routes/UserRoutes.js";
import { initializeDatabase } from "./config/initDB.js";
import CategoryRoutes from "./Routes/CategoryRoutes.js";
import CarouselRoutes from "./Routes/CarouselRoutes.js";
import IntrestedRoutes from "./Routes/IntrestedRoutes.js";
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

MongoDBConnect();

app.use(
  "/uploads/products",
  express.static(path.join(process.cwd(), "uploads", "products"))
);
app.use(
  "/uploads/carousel",
  express.static(path.join(process.cwd(), "uploads", "carousel"))
);
app.use("/api/product", ProductRoutes)
app.use("/api/auth", UserRoutes);
app.use("/api/category", CategoryRoutes);
app.use("/api/carousel", CarouselRoutes)
app.use("/api/user-interests", IntrestedRoutes);
app.get("/", (req, res) =>{
    res.send("Hello World");
})
app.listen(process.env.PORT || 5000, () =>{
    console.log(`Server is running on port ${process.env.PORT }`);
})