import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUri = (file) => {
    if (!file || !file.buffer || !file.originalname) {
        console.error("Error: Invalid file object! Ensure 'buffer' and 'originalname' are present.");
        return null;
    }

    const parser = new DataUriParser();
    const extName = path.extname(file.originalname); // No need for .toString()
    
    try {
        return parser.format(extName, file.buffer);
    } catch (error) {
        console.error("Error converting file to Data URI:", error);
        return null;
    }
};

export default getDataUri;
