import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated';
import { getCompany, registerCompany,getCompanyById, updateCompany,deleteCompany,exportCompanyApplicants } from '../controller/company.controller.js';
import { singleUpload } from '../middleware/multer.js';


 const router = express.Router();
 
 router.route("/register").post(isAuthenticated,registerCompany);
 router.route("/get").get(isAuthenticated,getCompany);
 router.route("/get/:id").get(isAuthenticated,getCompanyById);
 router.route("/update/:id").put(isAuthenticated,singleUpload, updateCompany);
 router.route("/delete/:id").delete(isAuthenticated, deleteCompany);
 router.route("/export/:id").get(isAuthenticated, exportCompanyApplicants);

 export default router;