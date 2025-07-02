import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    firstName:{
        type:String,
        trim:true,
        required:true
    },
    lastName:{
        type:String,
        trim:true,
        required:true
    },
    profilePicture:{
        type:String,

    }
},{timestamps:true})

const User = mongoose.models.User || mongoose.model("user",userSchema);
export default User;