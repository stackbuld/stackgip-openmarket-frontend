import { IUser } from "../models/IUserModel";
export const getLoggedInUser = (): IUser => {
  const user = localStorage.getItem("user");
  const userJson: IUser = user ? JSON.parse(user) : null;
  return userJson;
};
