import mongoose from "mongoose";
import { type } from "os";


/* ================= USER SCHEMA ================= */

const shippingAddressSchema = new mongoose.Schema({
  username: {type: String},
  email: {type: String},
  addressline1: {type:String},
  addressline2: {type:String},
  city: {type:String},
  state: {type:String},
  pincode: {type:String}
});

const UserSchema = new mongoose.Schema({
 
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  

  
  shippingAddress: shippingAddressSchema


}, {
  timestamps: true, // createdAt + updatedAt auto
});

const User = mongoose.model("User", UserSchema);

export default User;
