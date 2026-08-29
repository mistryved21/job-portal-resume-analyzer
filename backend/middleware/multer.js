import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);  // Accept PDF file
    } else {
        cb(new Error("Only PDF files are allowed!"), false);
    }
};

export const singleUpload = multer({storage}).single("file");


