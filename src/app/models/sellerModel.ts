import { ResponseModel } from '../shared/models/ResponseModel';

export interface ISeller {
  // businessName: "string";
  // businessAddress: "string";
  businessEmail: 'string';
  businessPhone: 'string';
  businessCountryCode: 'string';
  businessState: 'string';
  businessCity: 'string';
  businessLogoUrl?: 'string' | string;
  // businessRegistrationNumber?: "string";
  address: 'string';
  phoneNumber: 'string';
  businessApplicantAddress?: string;
  businessAddressLandmark?: string;
  businessApplicantID: string;
  businessIDType: string;
  userId: 'string';
  businessName: 'string';
  businessDescription: 'string';
  businessAddress: 'string';
  businessLogo?: 'string' | string;
  businessRegistrationNumber: 'string';
  street: 'string';
  lga: 'string';
  isBusinessRegistered: boolean;
  state: 'string';
  landmark: 'string';
  applicant: {
    idType: 'string';
    idNumber: 'string';
    dateOfBirth: '10-10-string';
  };
}

export interface GetSeller extends ResponseModel {
  data: ISeller;
}

export interface SellerProfileData {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  profileImageUrl?: string;
  alpha2CountryCode?: string;
  state: string;
  phoneNumber: string;
}

export interface SellerBusinessProfileData {
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  businessPhone: string;
  businessCountryCode: string;
  businessState: string;
  businessWebsite: string;
  businessSocialLinks: {
    twitter: string;
    facebook: string;
    instagram: string;
  };
}
