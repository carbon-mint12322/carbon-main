import acl from './acl.json';

export const loginPage = acl.LOGIN_PAGE;

const pages = {
  login: acl.LOGIN_PAGE,
  development: ['/upload-demo', '/qrtest'],
};

export const getPublicPages = async (user: any) => acl.public;
export const getAgentPagesFarmbook = () => acl.agent;
export const getAdminPagesFarmbook = () => acl.admin;
export const getOperatorPagesFarmbook = () => acl.operator;

export const getAdminPagesEvlocker = () => acl.admin;

export enum UserRole {
  AGENT,
  OPERATOR,
  ADMIN,
  PUBLIC,
}

export const getPrivatePages = async (user: any) => {
  const role = await getUserRole(user);
  switch (role) {
    case UserRole.AGENT:
      return getAgentPagesFarmbook();
    case UserRole.OPERATOR:
      return getOperatorPagesFarmbook();
    case UserRole.ADMIN:
      return getAdminPagesFarmbook();
  }
  return getPublicPages(user);
};

export const getPublicHome = () => '/';
export const getHomePage = async (user: any) => {
  const role = await getUserRole(user);
  switch (role) {
    case UserRole.AGENT:
      return '/farmbook/agent';
    case UserRole.OPERATOR:
      return '/farmbook/operator';
    case UserRole.ADMIN:
      return '/admin';
  }
  return getPublicHome();
};

export const getUserRole = async (user: any): Promise<UserRole> => {
  if (!user) return UserRole.PUBLIC;

  if (user.email && /carbonmint.com$/.test(user.email)) {
    return UserRole.ADMIN;
  }
  if (user.email) {
    return UserRole.AGENT;
  }

  return UserRole.OPERATOR;
};
