import mongoose from "mongoose";

interface Todo {
  index: {
    type: Number;
    required: [true, "Todo must have index"];
  };
  order: {
    type: Number;
    required: [true, "Todo must have order"];
  };
  text: {
    type: String;
    required: [true, "Todo must have text"];
  };
  isChecked: {
    type: Boolean;
    default: false;
  };
}

interface TodoDocument extends Todo, mongoose.Document {}

type TodoSchemaDefinition = mongoose.SchemaDefinition<Todo>;

const schemaDefinition = {
  index: {
    type: Number,
    required: [true, "Todo must have index"],
  },
  order: {
    type: Number,
    required: [true, "Todo must have order"],
  },
  text: {
    type: String,
    required: [true, "Todo must have text"],
  },
  isChecked: {
    type: Boolean,
    default: false,
  },
};

const todoSchema = new mongoose.Schema(schemaDefinition);

export default mongoose.model("Todo", todoSchema);
