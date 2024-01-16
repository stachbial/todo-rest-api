import { config as envConfig } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import bodyParser from "body-parser";

import userRoutes from "./api/routes/userRoutes";
import todoRoutes from "./api/routes/todoRoutes";

envConfig();
const app = express();
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.re8z6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
);

app.use(morgan("combined"));
app.use(bodyParser.json());

app.use("/todo", todoRoutes);
app.use("/user", userRoutes);

app.use((_, res) => {
  res.status(404).json({ message: "Not found :/" });
});

export default app;
