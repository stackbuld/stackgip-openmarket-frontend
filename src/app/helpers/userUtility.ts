import { IUser } from "src/app/models/IUserModel";
export const getLoggedInUser = (): IUser => {
  const user = localStorage.getItem("user");
  const userJson: IUser = JSON.parse(user);
  return userJson;
};
