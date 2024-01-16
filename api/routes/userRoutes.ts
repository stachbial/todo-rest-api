import express from "express";
import UsersController from "../controllers/usersController";

const router = express.Router();

router.post("/signup", UsersController.signup);
router.post("/login", UsersController.login);

export default router;
