import { Request, Response, NextFunction } from "express";
import Todo from "../models/todoModel";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Todo.find();

    res.status(200).json({
      message: "All todos:",
      results: result.length,
      data: {
        result,
      },
    });
  } catch (err) {
    res.status(204).json({
      message: "no Todo data",
    });
  }
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const result = await Todo.findById(id);

    res.status(200).json({
      message: `Todo with id: ${id}:`,
      data: result,
    });
  } catch (err) {
    res.status(404).json({
      message: "no data",
    });
  }
};

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Todo.updateMany({}, { $inc: { order: 1 } });
    const todo = new Todo({
      index: req.body.index,
      order: 0,
      text: req.body.text,
      isChecked: false,
    });

    const result = await todo.save();

    res.status(201).json({
      message: "Added new todo",
      data: result,
    });
  } catch (err) {
    res.status(403).json({
      message: "Error while creating a Todo",
    });
  }
};

const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
  //desired order : [notCheckTodosAscendingByOrder, updatedItem, checkedTodosAscendingByOrder]

  try {
    const id = req.params.id;
    const todo = await Todo.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!todo) throw `Could not find updated Todo`;

    if (req.body.isChecked) {
      await Todo.updateMany(
        { order: { $gt: todo.order } },
        { $inc: { order: -1 } }
      );

      await Todo.updateMany({ isChecked: true }, { $inc: { order: 1 } });
      const [lastUncheckedItem, lastButOneUncheckedItem] = await Todo.find({
        isChecked: false,
      })
        .sort("-order")
        .limit(2);

      if (!lastButOneUncheckedItem.order || !lastUncheckedItem.order)
        throw new Error();

      const newOrderValue = req.body.isChecked
        ? lastUncheckedItem.order + 1
        : lastButOneUncheckedItem.order + 1;

      await Todo.findByIdAndUpdate(id, {
        order: newOrderValue,
      });
    }

    res.status(200).json({
      message: `Updated Todo with id: ${id}`,
      reqBody: req.body,
      data: todo,
    });
  } catch (err) {
    res.status(403).json({
      message: "Failed to update the Todo",
      data: err,
    });
  }
};

const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo || !deletedTodo.order) throw new Error();
    const { order: deletedTodoOrder } = deletedTodo;

    await Todo.updateMany(
      { order: { $gt: deletedTodoOrder } },
      { $inc: { order: -1 } }
    );

    res.status(200).json({
      message: `Deleted a Todo with id: ${id}`,
      data: deletedTodo,
    });
  } catch (err) {
    res.status(403).json({
      message: "Failed to delete the Todo",
    });
  }
};

const updateTodoOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //desired order : [notCheckTodosAscendingByOrder, updatedItem, checkedTodosAscendingByOrder]
    const { sourceOrder, destinationOrder } = req.body;

    if (destinationOrder > sourceOrder) {
      await Todo.updateOne({ order: sourceOrder }, { order: -1 });
      await Todo.updateMany(
        {
          order: { $gt: sourceOrder, $lte: destinationOrder },
        },
        { $inc: { order: -1 } }
      );
      await Todo.updateOne({ order: -1 }, { order: destinationOrder });
    }

    if (destinationOrder < sourceOrder) {
      await Todo.updateOne({ order: sourceOrder }, { order: -1 });
      await Todo.updateMany(
        {
          order: { $gte: destinationOrder, $lt: sourceOrder },
        },
        { $inc: { order: 1 } }
      );
      await Todo.updateOne({ order: -1 }, { order: destinationOrder });
    }

    res.status(200).json({
      message: `Changed order of the Todo`,
      sourceOrder: sourceOrder,
      destinationOrder: destinationOrder,
    });
  } catch (err) {
    res.status(403).json({
      message: "Colud not updtade the order of Todos",
    });
  }
};

const TodoController = {
  getAll,
  getById,
  createNew,
  updateTodo,
  deleteTodo,
  updateTodoOrder,
} as const;

export default TodoController;
