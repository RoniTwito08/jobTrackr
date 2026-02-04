import userModel from "../models/user.model";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { RegisterInput } from "../validators/auth.validators";
import { LoginInput } from "../validators/auth.validators";
import refreshTokenModel from "../models/refreshToken.model";

export async function register({ email, userName, password }: RegisterInput) {
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    email,
    userName,
    passwordHash,
  });

  return {
    id: user._id,
    email: user.email,
    userName: user.userName,
    createdAt: user.createdAt,
  };
}

export async function login({ email, password }: LoginInput) {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(401, "invalid credentials");
  }
  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    throw new ApiError(401, "invalid credentials");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  const secret = process.env.JWT_SECRET;
  const payload = { userId: user._id.toString(), email: user.email };
  const expiresIn = (process.env.JWT_EXPIRES_IN ??
    "1h") as jwt.SignOptions["expiresIn"];
  const options: jwt.SignOptions = { expiresIn };
  const accessToken = jwt.sign(payload, secret, options);
  const refreshToken = crypto.randomBytes(40).toString("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await refreshTokenModel.create({
    userId: user._id,
    token: refreshToken,
    expiresAt,
  });

  return { accessToken, refreshToken };
}
