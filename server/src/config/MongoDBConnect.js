import mongoose from 'mongoose'
import { initializeDefaultSettings } from '../Controllers/ProductController.js';

const MongoDBConnect = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        await initializeDefaultSettings()
        console.log("Connected to MongoDB");
    }catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }

}

export default MongoDBConnect;