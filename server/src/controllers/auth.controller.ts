import { Request, Response, NextFunction } from "express";
import { registerSchema } from "../validators/auth.validators";
import { register } from "../services/auth.service";
import { loginSchema } from "../validators/auth.validators";
import { login } from "../services/auth.service";
import { refreshCookieOptions } from "../utils/cookies";
import { AuthRequest } from "../middlewares/auth.middleware";
import ApiError from "../utils/ApiError";
import userModel from "../models/user.model";
import jwt from "jsonwebtoken";
import refreshTokenModel from "../models/refreshToken.model";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return res.status(400).json({
        message: "validation error",
        errors,
      });
    }
    const user = await register(result.data);
    return res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "validation error",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
    const { accessToken, refreshToken } = await login(result.data);

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    return res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

export const meController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await userModel
      .findById(req.user.userId)
      .select("_id email firstName lastName createdAt");
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    return res.status(200).json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
    });
  } catch (err) {
    next(err);
  }
};
export const refreshController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new ApiError(401, "Refresh token missing");
    }

    const storedToken = await refreshTokenModel.findOne({
      token: refreshToken,
    });
    if (!storedToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (storedToken.expiresAt < new Date()) {
      await storedToken.deleteOne();
      throw new ApiError(401, "Refresh token expired");
    }

    const user = await userModel.findById(storedToken.userId);
    if (!user) {
      throw new ApiError(401, "User not found");
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

    return res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await refreshTokenModel.deleteOne({ token: refreshToken });
    }

    res.clearCookie("refreshToken", refreshCookieOptions);

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};
