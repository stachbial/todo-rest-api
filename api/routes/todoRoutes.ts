import express from "express";
import TodoController from "../controllers/todoController";
import checkAuth from "../middleware/checkAuth";

const router = express.Router();

// localhost:3000/todo
router.route("/").get(TodoController.getAll);
router.route("/").post(checkAuth, TodoController.createNew);

// localhost:3000/112314
router.route("/:id").get(TodoController.getById);
router.route("/:id").put(checkAuth, TodoController.updateTodo);
router.route("/:id").delete(checkAuth, TodoController.deleteTodo);

// localhost:3000/todo/order
router.patch("/order", checkAuth, TodoController.updateTodoOrder);

export default router;
