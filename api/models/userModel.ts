import mongoose from "mongoose";

interface User {
  username: String;
  password: String;
}

interface UserDocument extends User, mongoose.Document {}

interface UserSchemaProps {
  username: typeof String;
  password: typeof String;
}

type UserSchemaDefinition = mongoose.SchemaDefinition<UserSchemaProps>;

const schemaDefinition: UserSchemaDefinition = {
  username: String,
  password: String,
};

const userSchema = new mongoose.Schema<UserDocument>(schemaDefinition);

export default mongoose.model("User", userSchema);
