import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import getDataUri from '../utils/datauri.js'; // Ensure this function properly generates a Base64 URI

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded", success: false });
        }

        // Convert file to Data URI
        const fileUri = getDataUri(req.file);
        console.log("File URI Generated:", fileUri);

        // Upload to Cloudinary with public access
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            resource_type: "raw", // Ensures PDF, DOC, etc. are handled correctly
            folder: "resumes", // Optional: Organize uploads in a folder
            use_filename: true, // Keeps original filename
            unique_filename: false, // Prevents renaming
            access_mode: "public" // Ensures visibility
        });

        console.log("Cloudinary Response:", cloudResponse);

        return res.status(200).json({
            message: "Resume uploaded successfully",
            resumeUrl: cloudResponse.secure_url, // Public URL for display
            success: true
        });

    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        return res.status(500).json({ 
            message: "Upload failed", 
            error: error.message, 
            success: false 
        });
    }
};

export default cloudinary;
