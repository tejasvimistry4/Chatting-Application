import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers.authorization;

  if (!auth)
    return res.status(401).json({
      message: "Unauthorized",
    });

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    req.userId = decoded.id;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
