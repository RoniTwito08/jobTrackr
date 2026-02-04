import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  createJobApplication,
  getJobApplications,
  getApplicationByUrl,
  updateJobApplication,
  deleteJobApplication,
} from "../services/jobApplication.service";
import { createJobApplicationSchema } from "../validators/jobApplication.validators";
import ApiError from "../utils/ApiError";

export const createJobApplicationController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const result = createJobApplicationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const application = await createJobApplication(
      req.user.userId,
      result.data,
    );
    return res.status(201).json(application);
  } catch (err) {
    next(err);
  }
};

export const getJobApplicationsController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const applications = await getJobApplications(req.user.userId);
    return res.status(200).json(applications);
  } catch (err) {
    next(err);
  }
};

export const checkApplicationByUrlController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const { jobUrl } = req.query;
    if (!jobUrl || typeof jobUrl !== "string") {
      throw new ApiError(400, "Job URL is required");
    }

    const application = await getApplicationByUrl(req.user.userId, jobUrl);
    return res.status(200).json({ application });
  } catch (err) {
    next(err);
  }
};

export const updateJobApplicationController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const { id } = req.params;
    const application = await updateJobApplication(
      id,
      req.user.userId,
      req.body,
    );
    return res.status(200).json(application);
  } catch (err) {
    next(err);
  }
};

export const deleteJobApplicationController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const { id } = req.params;
    await deleteJobApplication(id, req.user.userId);
    return res.status(200).json({ message: "Application deleted" });
  } catch (err) {
    next(err);
  }
};
