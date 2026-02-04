import express from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  createJobApplicationController,
  getJobApplicationsController,
  checkApplicationByUrlController,
  updateJobApplicationController,
  deleteJobApplicationController,
} from "../controllers/jobApplication.controller";

const router = express.Router();

router.post("/", requireAuth, createJobApplicationController);
router.get("/", requireAuth, getJobApplicationsController);
router.get("/check", requireAuth, checkApplicationByUrlController);
router.put("/:id", requireAuth, updateJobApplicationController);
router.delete("/:id", requireAuth, deleteJobApplicationController);

export default router;
