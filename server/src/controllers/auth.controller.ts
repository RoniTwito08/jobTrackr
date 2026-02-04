import { Request, Response, NextFunction } from "express";
import { registerSchema } from "../validators/auth.validators";
import { register } from "../services/auth.service";
import { loginSchema } from "../validators/auth.validators";
import { login } from "../services/auth.service";
import { refreshCookieOptions } from "../utils/cookies";
import { AuthRequest } from "../middlewares/auth.middleware";
import ApiError from "../utils/ApiError";
import userModel from "../models/user.model";

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
        errors: result.error.issues,
      });
    }
    const { accessToken, refreshToken } = await login(result.data);

    res.cookie("refresToken", refreshToken, refreshCookieOptions);
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
      .select("_id email userName createdAt");
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    return res.status(200).json({
      id: user._id,
      email: user.email,
      userName: user.userName,
      createdAt: user.createdAt,
    });
  } catch (err) {
    next(err);
  }
};
