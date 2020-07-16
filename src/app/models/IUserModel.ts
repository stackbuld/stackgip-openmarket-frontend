import { ResponseModel } from "./../shared/models/ResponseModel";
export interface IUserModel {}
export interface IUser {
  id: string;
  firstName?: any;
  lastName?: any;
  profileImageUrl?: any;
  email: string;
  address: string;
  alpha2CountryCode: string;
  state: string;
  phoneNumber: string;
  scope: string;
}

export interface IUserResponse extends ResponseModel {
  data: IUser;
}
