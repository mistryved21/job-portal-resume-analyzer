import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Upload PDF as a raw file
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "raw",
            folder: "resumes", // Optional: Stores files in a "resumes" folder in Cloudinary
        });

        // Remove file from server after upload
        fs.unlinkSync(req.file.path);

        return res.json({ url: result.secure_url });
    } catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({ error: "File upload failed" });
    }
};
