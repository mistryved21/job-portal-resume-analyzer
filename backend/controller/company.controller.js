import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js"
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { Parser } from "json2csv"; 


export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;

        const file = req.file;
        // idhar cloudinary ayega
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;

        const updateData = { name, description, website, location, logo };

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message:"Company information updated.",
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}
export const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;

        const company = await Company.findByIdAndDelete(companyId);

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company deleted successfully.",
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};
export const exportCompanyApplicants = async (req, res) => {
    try {
        const { id } = req.params; // Company ID

        // Find all jobs under this company
        const jobs = await Job.find({ company: id }).select("_id title");

        if (jobs.length === 0) {
            return res.status(404).json({ success: false, message: "No jobs found for this company" });
        }

        const jobIds = jobs.map(job => job._id);

        // Find applications related to these jobs
        const applications = await Application.find({ job: { $in: jobIds } })
            .populate("applicant", "fullname email profile") // ✅ Ensure fullname is included
            .populate("job", "title");

        console.log("Applications Data:", applications);
        if (applications.length === 0) {
            return res.status(404).json({ success: false, message: "No applicants found for this company" });
        }

        // ✅ Define fixed columns with correct order
        const csvFields = ["Full Name", "Email", "Resume", "Applied Role", "Application Status", "Applied Date"];
        const csvData = applications.map(app => ({
            "Full Name": app.applicant?.fullName || "N/A",  // ✅ Match the database field
            "Email": app.applicant?.email || "N/A",
            "Resume": app.applicant?.resume || "No Resume",
            "Applied Role": app.job?.title || "N/A",
            "Application Status": app.status,
            "Applied Date": new Date(app.createdAt).toISOString().split("T")[0]
        }));
        

        const json2csvParser = new Parser({ fields: csvFields });
        const csv = json2csvParser.parse(csvData);

        res.header("Content-Type", "text/csv");
        res.attachment(`CompanyApplicants_${id}.csv`);
        return res.send(csv);
    } catch (error) {
        console.error("CSV Generation Error:", error);
        res.status(500).json({ success: false, message: "Error generating CSV" });
    }
};