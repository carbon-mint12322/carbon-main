export interface IRoleObj {
  [key: string]: string[];
}
export interface IFarmersObj {
  [key: string]: string[];
}

export interface User {
  _id: string;
  personalDetails: UserPersonalDetails;
  personalOrgDetails: UserPersonalOrgDetails;
  roles: IRoleObj;
  farmers: IFarmersObj;
  id: string;
  documents: any;
  history: any;
  histories: any;
  displayRoles?: any;
  reportsTo?: string;
  agent?: any;
  rolesCopy: any;
}
export interface agent {
  farmer_details: any;
}

export interface UserPersonalDetails {
  identityNumber: string;
  firstName: string;
  lastName: string;
  primaryPhone: string;
  address: UserPersonalDetailsAddress;
  fathersName: string;
  email: string;
  identityDetails: any;
}

export interface UserPersonalDetailsAddress {
  village: string;
  state: string;
  pincode: string;
}

export interface UserPersonalOrgDetails {
  orgName: string;
  identificationNumber: string;
  joiningDate: string;
}

export interface UserFormData {
  [key: string]: any;
}
