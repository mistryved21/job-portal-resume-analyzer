import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated';
import { getAdminJobs,getAllJobs, getJobById, postJob, deleteJob} from '../controller/job.controller.js';


 const router = express.Router();
 
 router.route("/post").post(isAuthenticated,postJob);
 router.route("/get").get(isAuthenticated,getAllJobs);
 router.route("/getadminjobs").get(isAuthenticated,getAdminJobs);
 router.route("/get/:id").get(isAuthenticated,getJobById);
 router.route("/delete/:id",isAuthenticated, deleteJob);
 router.route("/delete/:id").delete(isAuthenticated, deleteJob); 

 export default router;