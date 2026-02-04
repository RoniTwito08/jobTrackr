import { Schema, Types, Document } from "mongoose";
import mongoose from "mongoose";

export interface Iuser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<Iuser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<Iuser>("User", userSchema);
