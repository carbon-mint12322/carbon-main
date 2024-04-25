export interface PageConfig {
  appName: string;
  title: string;
  menuItems: MenuItem[];
  homePage: string;
}

export interface MenuItem {
  title: string;
  href: string;
  selected: boolean;
  subMenu?: MenuItem[];
}
