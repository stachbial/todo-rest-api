import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel";

const signup = async (req: Request, res: Response) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (!!existingUser)
      throw "User with such name already exists, please pick a different one";

    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hash,
    });

    await user.save();

    res
      .status(201)
      .json({ message: `Created a user with nick: ${req.body.username}` });
  } catch (err: any) {
    console.error(err);
    res.status(500).json(err);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user)
      return res.status(401).json({
        message: `Auth error: can not find a user with username: ${req.body.username}`,
      });

    const result = await bcrypt.compare(
      req.body.password,
      user.password.toString()
    );
    if (!result)
      return res
        .status(401)
        .json({ message: "Auth error: password incorrect" });

    const JWT_KEY = process.env.JWT_KEY ?? "";
    const token = jwt.sign({ message: "Ala ma kota" }, JWT_KEY, {
      expiresIn: "3h",
    });
    res.status(200).json(token);
  } catch (err: any) {
    res.status(500).json(err);
  }
};

const UserController = { signup, login } as const;

export default UserController;
