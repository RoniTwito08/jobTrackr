import { Request, Response, NextFunction } from "express";
import { verifyGoogleToken, googleAuth } from "../services/google.service";
import { refreshCookieOptions } from "../utils/cookies";
import ApiError from "../utils/ApiError";

export const googleAuthController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      throw new ApiError(400, "ID token is required");
    }

    // Verify Google token
    const googleData = await verifyGoogleToken(idToken);

    // Create or get user and generate tokens
    const { accessToken, refreshToken } = await googleAuth(googleData);

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    return res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};
