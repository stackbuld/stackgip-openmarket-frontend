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

export interface ITransactionsResponse extends ResponseModel {
    message: string;
  status: string;
  data: TransactionsResponse;
}

export interface TransactionsResponse {
    items:           TransactionItem[];
    pageNumber:      number;
    totalPages:      number;
    totalCount:      number;
    hasPreviousPage: boolean;
    hasNextPage:     boolean;
}

export interface TransactionItem {
    referenceNo:         string;
    transactionTypeEnum: string;
    amount:              number;
    userId:              string;
    user:                null;
    transactionCategory: string;
    narration:           string;
    withdrawalRequests?:  Item;
    id:                  string;
    createdAt:           Date;
}

export interface IRequestResponse extends ResponseModel {
    message: string;
  status: string;
  data: Requests;
}
export interface Requests {
    items:           Item[];
    pageNumber:      number;
    totalPages:      number;
    totalCount:      number;
    hasPreviousPage: boolean;
    hasNextPage:     boolean;
}

export interface Item {
    userId:       string;
    status:       string;
    amount:       number;
    currencyCode: string;
    walletId:     string;
    wallet:       Wallet;
    failedReason: string;
    referenceNo:  string;
    id:           string;
    createdAt:    Date;
}

export interface Wallet {
    userId:             string;
    user:               null;
    availableAmount:    number;
    lockedAmount:       number;
    currencyCode:       string;
    walletType:         string;
    transactions:       any[];
    withdrawalRequests: any[];
    lockedFunds:        any[];
    id:                 string;
    createdAt:          Date;
    deletedAt:          null;
    isDeleted:          boolean;
    updatedAt:          null;
}