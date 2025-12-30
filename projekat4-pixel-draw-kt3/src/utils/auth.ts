import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config";
import AppDataSource from "../data-source";
import { User } from "../entities/User";

interface TokenPayload {
  user_id: string;
  iat: number;
  exp: number;
}

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];
  if (!header) {
    res.status(401).json({
      failed: true,
      code: "NOT_AUTHENTICATED",
    });
    return;
  }

  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    res.status(401).json({
      failed: true,
      code: "NOT_AUTHENTICATED",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET) as TokenPayload;
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ user_id: decoded.user_id });

    if (!user) {
      res.status(401).json({
        failed: true,
        code: "NOT_AUTHENTICATED",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("authGuard error:", error);
    res.status(401).json({
      failed: true,
      code: "NOT_AUTHENTICATED",
    });
  }
};
