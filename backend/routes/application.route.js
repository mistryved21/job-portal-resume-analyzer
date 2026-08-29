import express from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import { applyJob, getApplicants, getAppliedJobs, updateStatus, deleteApplicant } from "../controller/application.controller.js";

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
router.route("/applicant/:id").delete(isAuthenticated, deleteApplicant);

export default router;
