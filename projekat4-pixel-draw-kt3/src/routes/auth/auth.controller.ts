import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../../config";
import AppDataSource from "../../data-source";
import { User } from "../../entities/User";
import { LoginReq, UserCreationReq } from "../../types";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as LoginReq;

    const userRepo = AppDataSource.getRepository(User);
    const foundUser = await userRepo.findOneBy({ username });

    if (!foundUser || foundUser.password !== password) {
      res.status(401).json({
        failed: true,
        code: "INCORRECT_CREDENTIALS",
      });
      return;
    }

    // Create token
    const token = jwt.sign({ user_id: foundUser.user_id }, TOKEN_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      failed: false,
      token,
      user_id: foundUser.user_id,
      username: foundUser.username,
    });
    return;
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      failed: true,
      code: "INTERNAL_ERROR",
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as UserCreationReq;

    const userRepo = AppDataSource.getRepository(User);

    const existingUser = await userRepo.findOneBy({ username });
    if (existingUser) {
      res.status(400).json({
        failed: true,
        code: "DUPLICATE_USERNAME",
      });
      return;
    }

    const newUser = userRepo.create({ username, password });
    await userRepo.save(newUser);

    res.json({
      failed: false,
      user_id: newUser.user_id,
    });
    return;
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      failed: true,
      code: "INTERNAL_ERROR",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.json({ success: true });
};
