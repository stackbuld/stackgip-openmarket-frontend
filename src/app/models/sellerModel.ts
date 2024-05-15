import { ResponseModel } from '../shared/models/ResponseModel';

export interface ISeller {
  businessWebsite: string;
  businessEmail: string;
  businessPhone: string;
  businessCountryCode: string;
  businessState: string;
  businessCity: string;
  businessLogoUrl?: string | string;
  address: string;
  phoneNumber: string;
  businessApplicantAddress?: string;
  businessAddressLandmark?: string;
  businessApplicantID: string;
  businessIDType: string;
  userId: string;
  businessName: string;
  businessDescription: string;
  businessAddress: string;
  businessLogo?: string;
  businessRegistrationNumber: string;
  street: string;
  lga: string;
  isBusinessRegistered: boolean;
  state: string;
  landmark: string;
  coverPhotoUrl?: string | string;
  sellerApprovalStatus: string;
  userLga: string;
  idVerificationType: string;
  idVerificationNumber: string;
  userAddressLandMark: string;
  rejectionReason: string;
  profileImageUrl?: string;
}

export interface GetSeller extends ResponseModel {
  data: ISeller;
}

export interface SellerProfileData {
  firstName: string;
  lastName: string;
  email?: string;
  bio: string;
  nin?: string;
  profileImageUrl?: string;
  coverPhotoUrl?: string;
  alpha2CountryCode?: string;
  state: string;
  phoneNumber?: string;
}

export interface SellerBusinessProfileData {
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  businessPhone?: string;
  businessCountryCode: string;
  businessState: string;
  businessWebsite: string;
  businessSocialLinks: {
    twitter: string;
    facebook: string;
    instagram: string;
  };
}
