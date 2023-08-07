import { ResponseModel } from "../shared/models/ResponseModel";

export interface IWallet {
    availableAmount: number;
    createdAt:       Date;
    currencyCode:    string;
    id:              string;
    isActive:        boolean;
    lockedAmount:    number;
    userId:          string;
    walletType:      string;
}

export interface IWalletResponse extends ResponseModel {
    message: string;
  status: string;
  data: IWallet[];
}


export interface IBankAccount {
    message:   string;
    succeeded: boolean;
    errors:    string[];
    data:      bankData[];
}

export interface bankData {
    id:            string;
    createdAt:     Date;
    userId:        string;
    bankName:      string;
    bankCode:      string;
    accountNumber: string;
    accountName:   string;
}