export interface RtmlElement {
  name?: string;
  tag: string;
  props?: any;
  children?: any[];
  component?: boolean;
  imported?: boolean;
  importPath?: string | null;
  data?: any;

  layout?: string;
  components?: RtmlElement[];
}

export interface StrictRtmlElement {
  component: boolean;
  name: string;
  tag: string;
  props: any;
  children: any[];
  imported: boolean;
  importPath: string | null;
  data?: any;
}
