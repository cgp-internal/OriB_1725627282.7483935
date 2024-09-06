import UserModel from "../models/user-model";
import jwt from "jsonwebtoken";
import { appConfig } from "./config";
import { UnauthorizedError } from "../models/exceptions";

export function createToken(user: UserModel): string {
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;
  const container = { userWithoutPassword }; // token container
  // const option = { expiresIn: "3h" };
  const option = {};
  const token = jwt.sign(container, appConfig.tokenSecreteKey, option);
  return token;
}

export function verifyToken(
  token: string,
  adminRequired: boolean = false
): UserModel {
  // throw exception or return UserModel if ok

  if (!token) throw new UnauthorizedError();

  try {
    // verify will throw error if not valid
    const res = jwt.verify(token, appConfig.tokenSecreteKey) as {
      userWithoutPassword: UserModel;
    };

    if (adminRequired && !res.userWithoutPassword.isAdmin) {
      throw new Error("");
    }
    return res.userWithoutPassword;
  } catch (error) {
    throw new UnauthorizedError();
  }
}
