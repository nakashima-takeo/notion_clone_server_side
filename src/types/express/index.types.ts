import { HydratedDocument } from "mongoose";
import { IUser } from "../../models/user.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: HydratedDocument<IUser>;
  }
}
