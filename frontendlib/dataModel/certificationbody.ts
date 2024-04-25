export interface CertificationBody {
  _id: string;
  name: string;
  slug: string;
  schemes: [Scheme];
  id: string;
  address: CBAddress;
  email: string;
  poc: string;
  users: any;
  phone: string;
  certificationAuthority: string;
  registrationDocumentFile: string;
  documents: any;
  history: any;
}

export interface CBAddress {
  village: string;
  state: string;
  pincode: string;
}

export interface Scheme {
  id: string;
  name: string;
}
