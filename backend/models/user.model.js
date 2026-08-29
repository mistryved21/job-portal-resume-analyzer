import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
        
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['user','recruiter'],
        required:true
    },
    gender:{
        type:String,
        enum:['male','female'],
        required:true
    },
    address:{
        type:String,
        required:true,
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String}, // URL to resume file
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'}, 
        profilePhoto:{
            type:String,
            default:""
        }
    },
     // 🔹 Forgot Password Fields
     otp: {
        type: String, // Stores the OTP
        default: null
    },
    otpExpires: {
        type: Date, // Expiry time for OTP
        default: null
    }
},{timestamps:true});
export const User = mongoose.model('User', userSchema);