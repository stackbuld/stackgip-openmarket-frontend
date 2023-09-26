export interface HttpCountryInfoResponse {
  code: string | null;
  data: RawCountryInfo[];
  errors: Array<any>;
  message: string;
  status: string;
  succeed: boolean;
}

export interface RawCountryInfo {
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  region: string;
  subRegion: string;
  flag: string;
  phoneCode: string;
  id: string;
  createdOn: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
  updatedOn: string | null;
  deletedOn: string | null;
  isActive: boolean;
  isDeleted: boolean;
}

export interface CountryInfo {
  alpha2code: string;
  phoneCode: string;
  countryName: string;
}
