import { OAuth2Client } from "google-auth-library";
import userModel from "../models/user.model";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import refreshTokenModel from "../models/refreshToken.model";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

export async function verifyGoogleToken(token: string) {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new ApiError(401, "Invalid Google token");
    }

    return {
      email: payload.email || "",
      firstName: payload.given_name || "",
      lastName: payload.family_name || "",
    };
  } catch (err) {
    throw new ApiError(401, "Invalid Google token");
  }
}

export async function googleAuth(googleData: {
  email: string;
  firstName: string;
  lastName: string;
}) {
  let user = await userModel.findOne({ email: googleData.email });

  // If user doesn't exist, create one
  if (!user) {
    user = await userModel.create({
      email: googleData.email,
      firstName: googleData.firstName,
      lastName: googleData.lastName,
      passwordHash: crypto.randomBytes(32).toString("hex"), // Random hash since OAuth doesn't use password
    });
  }

  // Generate tokens
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const secret = process.env.JWT_SECRET;
  const payload = { userId: user._id.toString(), email: user.email };
  const expiresIn = (process.env.JWT_EXPIRES_IN ??
    "1h") as jwt.SignOptions["expiresIn"];
  const options: jwt.SignOptions = { expiresIn };
  const accessToken = jwt.sign(payload, secret, options);

  const refreshToken = crypto.randomBytes(20).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await refreshTokenModel.create({
    userId: user._id,
    token: refreshToken,
    expiresAt,
  });

  return { accessToken, refreshToken };
}
