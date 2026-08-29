import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import sendNotification from "../utils/sendNotification.js"; 

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        // create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};
export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateStatus = async (req, res) => {
    try {
        const { status, email } = req.body; // Extract status and optional email
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({ success: false, message: "Status is required" });
        }

        // Fetch application with applicant and job details
        const application = await Application.findById(applicationId).populate("applicant job");

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        // Update status
        application.status = status.toLowerCase();
        await application.save();

        // Email notification if status is rejected
        if (status.toLowerCase() === "rejected") {
            const recipientEmail = email || application.applicant.email; // Use provided email or default to applicant email
            
            const emailText = `
Dear ${application.applicant.fullname},

We regret to inform you that your application for "${application.job.title}" has been rejected. However, we have new job opportunities for you.

Check the latest job openings on our platform.

Best Regards,  
Job Portal Team`;

            await sendNotification(recipientEmail, "Job Application Update", emailText);
        }

        return res.status(200).json({ success: true, message: "Application status updated successfully" });
    } catch (error) {
        console.error("Error updating status:", error); // Log the exact error
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};



// DELETE an Applicant from a Job Application
export const deleteApplicant = async (req, res) => {
    try {
        const applicationId = req.params.id;

        // Find the application
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        // Remove the application from the job's applications list
        await Job.updateOne(
            { _id: application.job },
            { $pull: { applications: applicationId } }
        );

        // Delete the application from the database
        await Application.findByIdAndDelete(applicationId);

        return res.status(200).json({
            message: "Applicant deleted successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong.",
            success: false
        });
    }
};
