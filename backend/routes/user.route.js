import express from 'express';
import { login, register, logout, updateprofile, sendOtp, resetPassword } from "../controller/user.controller.js";
import isAuthenticated from '../middleware/isAuthenticated';
import { singleUpload } from '../middleware/multer.js';


 const router = express.Router();
 
 router.route("/register").post(singleUpload,register);
 router.route("/login").post(login);
 router.route("/logout").get(logout);
 router.route("/profile/update").post(isAuthenticated,singleUpload,updateprofile);
 router.route("/send-otp").post(sendOtp);  // Sends OTP to the user's email
 router.route("/reset-password").post(resetPassword);  // Verifies OTP and resets password
 export default router;