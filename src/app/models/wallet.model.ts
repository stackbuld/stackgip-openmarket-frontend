import { ResponseModel } from '../shared/models/ResponseModel';

export interface IWallet {
  availableAmount: number;
  createdAt: Date;
  currencyCode: string;
  id: string;
  isActive: boolean;
  lockedAmount: number;
  userId: string;
  walletType: string;
}

export interface IWalletResponse extends ResponseModel {
  message: string;
  status: string;
  data: IWallet[];
}

export interface IBankAccount {
  message: string;
  succeeded: boolean;
  errors: string[];
  data: bankData[];
}

export interface bankData {
  id?: string;
  status?: boolean;
  createdAt?: Date;
  userId: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
}

export interface ITransactionsResponse extends ResponseModel {
  message: string;
  status: string;
  data: TransactionsResponse;
}

export interface TransactionsResponse {
  items: TransactionItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface LockedFundsResponse {
  items: LockedFunds[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface TransactionItem extends Transaction {
  referenceNo: string;
  transactionTypeEnum: string;
  amount: number;
  userId: string;
  user: null;
  transactionCategory: string;
  narration: string;
  withdrawalRequests: Item | null;
  id: string;
  createdAt: Date;
}

interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  roles: any;
}

export interface LockedFunds {
  userId: string;
  walletId: string;
  reason: string;
  amount: number;
  currencyCode: string;
  lockType: string;
  referenceNo: string;
  transactionType: string;
  status: string;
  id: string;
  createdAt: Date;
}

interface Transaction extends LockedFunds {
  referenceNo: string;
  transactionTypeEnum: string;
  amount: number;
  userId: string;
  user: User;
  transactionCategory: string;
  narration: string;
  withdrawalRequests: {
    userId: string;
    status: string;
    amount: number;
    currencyCode: string;
    walletId: string;
    wallet: any; // You can replace 'any' with the actual type of wallet if known
    failedReason: string;
    referenceNo: string;
    id: string;
    createdAt: Date;
  } | null;
  id: string;
  createdAt: Date;
}

export interface IRequestResponse extends ResponseModel {
  message: string;
  status: string;
  data: Requests;
}
export interface Requests {
  items: Item[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Item {
  userId: string;
  status: string;
  amount: number;
  currencyCode: string;
  walletId: string;
  wallet: Wallet;
  failedReason: string;
  referenceNo: string;
  id: string;
  createdAt: Date;
}

export interface Wallet {
  userId: string;
  user: null;
  availableAmount: number;
  lockedAmount: number;
  currencyCode: string;
  walletType: string;
  transactions: any[];
  withdrawalRequests: any[];
  lockedFunds: any[];
  id: string;
  createdAt: Date;
  deletedAt: null;
  isDeleted: boolean;
  updatedAt: null;
}

export interface WalletWithdrawalRequest {
  amount: number;
  walletId: string;
  bankaccountId: string;
  currencyCode: string;
  otp: string;
}
export interface WalletActionsResponse {
  message: string;
  succeeded: boolean;
  errors: string[] | any;
  data?: bankData;
}

export interface BankAccountDetails {
  bankCode: string;
  accountNumber: string;
  countryCode: string;
}
