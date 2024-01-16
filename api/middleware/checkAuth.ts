import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) throw new Error();
    const JWT_KEY = process.env.JWT_KEY ?? "";
    const token = req.headers.authorization.split("=")[1];
    jwt.verify(token, JWT_KEY);
    next();
  } catch (err) {
    res.status(401).json({ message: "Auth error", err });
  }
};

export default checkAuth;
