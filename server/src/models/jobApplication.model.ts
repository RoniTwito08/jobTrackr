import { Schema, Types, Document } from "mongoose";
import mongoose from "mongoose";

export interface IJobApplication extends Document {
  userId: Types.ObjectId;
  companyName: string;
  jobUrl: string;
  applicationDate: Date;
  status: "applied" | "rejected" | "accepted" | "pending" | "interview";
  createdAt?: Date;
  updatedAt?: Date;
}

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    jobUrl: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    applicationDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "rejected", "accepted", "pending", "interview"],
      default: "applied",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IJobApplication>(
  "JobApplication",
  jobApplicationSchema,
);
