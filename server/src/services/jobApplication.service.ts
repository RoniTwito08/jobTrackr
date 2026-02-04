import jobApplicationModel from "../models/jobApplication.model";
import { Types } from "mongoose";
import ApiError from "../utils/ApiError";
import { CreateJobApplicationInput } from "../validators/jobApplication.validators";

export async function createJobApplication(
  userId: string,
  data: CreateJobApplicationInput,
) {
  try {
    const normalizedUrl = data.jobUrl.toLowerCase().trim();

    // Check if already applied to this URL
    const existingApplication = await jobApplicationModel.findOne({
      userId,
      jobUrl: normalizedUrl,
    });

    if (existingApplication) {
      throw new ApiError(409, "You have already applied for this position");
    }

    const application = await jobApplicationModel.create({
      userId,
      companyName: data.companyName,
      jobUrl: normalizedUrl,
      applicationDate: new Date(data.applicationDate),
      status: data.status || "applied",
    });

    return application;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new Error("Failed to create job application");
  }
}

export async function getJobApplications(userId: string) {
  const applications = await jobApplicationModel.find({ userId }).sort({
    applicationDate: -1,
  });
  return applications;
}

export async function getApplicationByUrl(userId: string, jobUrl: string) {
  const normalizedUrl = jobUrl.toLowerCase().trim();
  const application = await jobApplicationModel.findOne({
    userId,
    jobUrl: normalizedUrl,
  });
  return application;
}

export async function updateJobApplication(
  applicationId: string,
  userId: string,
  data: Partial<CreateJobApplicationInput>,
) {
  const application = await jobApplicationModel.findOne({
    _id: applicationId,
    userId,
  });

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (data.companyName) application.companyName = data.companyName;
  if (data.applicationDate)
    application.applicationDate = new Date(data.applicationDate);
  if (data.status) application.status = data.status;

  await application.save();
  return application;
}

export async function deleteJobApplication(
  applicationId: string,
  userId: string,
) {
  const result = await jobApplicationModel.deleteOne({
    _id: applicationId,
    userId,
  });

  if (result.deletedCount === 0) {
    throw new ApiError(404, "Application not found");
  }
}
