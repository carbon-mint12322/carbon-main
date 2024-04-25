export interface IAuthRecord {
  email?: string;
  phone_number?: string;
  email_verified?: boolean;
  uid: string;
}

export interface IRoleObj {
  [key: string]: string[];
}

export type Device = {
  fcmToken: string;
  info: string;
};

export interface IDbUser {
  roles: IRoleObj;
  devices?: Device[];
  _id: string;
}

export type Role = string;
export type Token = string;
export type ITokenSource = any;

export interface IAuthAdapter {
  findToken: (request: ITokenSource) => Promise<Token>;
  verifyToken: (token: string) => Promise<IAuthRecord | null>;
  findDbUser: (authRecord: IAuthRecord | null) => Promise<IDbUser | null>;
  verifyIdToken: (token: string) => Promise<IAuthRecord | null>;
  checkAccess: (
    permittedRoles: Role[],
  ) => (user: IDbUser, serviceName: string, context: string) => Promise<boolean>;
}
