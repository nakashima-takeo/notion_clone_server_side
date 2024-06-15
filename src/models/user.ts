import mongoose from "mongoose";

export interface IUser {
  name: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser>("User", userSchema);
