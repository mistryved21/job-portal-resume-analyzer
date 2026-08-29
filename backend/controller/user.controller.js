import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import crypto from "crypto";
import  otpStorage from "../utils/otpStorage.js";
import sendEmail from "../utils/sendEmail.js";

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body; // Only email required

        if (!email) {
            return res.status(400).json({ message: "Email is required", success: false });
        }

        // Check if user exists (ignore role)
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        // Generate OTP & Expiry
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
        otpStorage[email] = { otp, otpExpiry };

        // Send OTP via email
        await sendEmail(email, "Password Reset OTP", `Your OTP is: ${otp}. It expires in 5 minutes.`);

        return res.status(200).json({ message: "OTP sent to email", success: true });
    } catch (error) {
        console.error("Error in sendOtp:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        // Validate OTP
        const storedOtpData = otpStorage[email];
        if (!storedOtpData) {
            return res.status(400).json({ message: "No OTP request found for this email", success: false });
        }

        // Check OTP Expiry
        if (Date.now() > storedOtpData.otpExpiry) {
            delete otpStorage[email]; // Remove expired OTP
            return res.status(400).json({ message: "OTP has expired", success: false });
        }

        // Check if OTP is correct
        if (storedOtpData.otp !== parseInt(otp)) {
            return res.status(400).json({ message: "Invalid OTP", success: false });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password for the user (ignoring role)
        const user = await User.findOneAndUpdate(
            { email }, // Role is not needed
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        // Remove OTP after successful password reset
        delete otpStorage[email];

        return res.status(200).json({ message: "Password reset successful", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};


export const register = async (req, res) => {
     console.log("Register Request:", req.body);
    try {
        const { fullname, email, phoneNumber, password, role, address, gender } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role || !address || !gender) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        const file = req.file
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);


        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            address,
            gender,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
        message: "Internal Server Error",
        success: false
    });
}
}
export const login = async (req, res) => {
    console.log("Login Request:", req.body);
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({
        email,
        role: { $regex: new RegExp(`^${role}$`, "i") } // Case-insensitive search
    });

    console.log("User found:", user);
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            gender:user.gender,
            address:user.address,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
        message: "Internal Server Error",
        success: false
    });
}
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
        message: "Internal Server Error",
        success: false
    });
}
}
export const updateprofile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const userId = req.id;

        let user = await User.findById(userId);
        if (!user) return res.status(400).json({ message: "User not found", success: false });

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = Array.isArray(skills) ? skills : skills.split(",").map(skill => skill.trim());

        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, { resource_type: "raw", folder: "resumes" });
            user.profile.resume = cloudResponse.secure_url;
        }

        await user.save();
        return res.status(200).json({ message: "Profile updated successfully", user, success: true });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};