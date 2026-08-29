import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendNotification = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.JOB_NOTIFICATION_EMAIL,
                pass: process.env.JOB_NOTIFICATION_PASS
            }
        });

        const mailOptions = {
            from: process.env.JOB_NOTIFICATION_EMAIL,
            to,
            subject,
            text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Job Notification Email sent: ${info.response}`);
        return true;
    } catch (error) {
        console.error("Error sending notification:", error);
        return false;
    }
};

export default sendNotification;
