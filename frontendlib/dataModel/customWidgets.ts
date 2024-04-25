export interface ErrorSchema {
  [key: string]: string;
}

export interface FormData {
  [key: string]: number | string | File | string[] | number[] | File[] | undefined | null | any;
}

export interface CustomWidgetsProps {
  autofocus: boolean;
  disabled: boolean;
  errorSchema: ErrorSchema;
  formContext: {
    [key: string]: string;
  };
  formData?: FormData;
  hideError: boolean;
  idPrefix?: any;
  idSchema: {
    [key: string]: string;
  };
  idSeparator?: any;
  name: string;
  onBlur: (value: any, errorSchema: ErrorSchema) => void;
  onChange: (value: any, errorSchema?: ErrorSchema) => void;
  onDropPropertyClick: () => void;
  onFocus: () => void;
  onKeyChange: (value: any, errorSchema: ErrorSchema) => void;
  rawErrors?: {
    [key: string]: string;
  };
  readonly: boolean;
  registry: {
    [key: string]: string;
  };
  required: boolean;
  uiSchema: {
    [key: string]: string;
  };
  wasPropertyKeyModified: boolean;
  schema: {
    title?: string;
    type: string;
    items?: {
      type: string;
      format: string;
    };
    format?: string;
    description?: string;
    definitions?: unknown;
    properties?: unknown;
    required?: unknown[];
    [key: string]: unknown;
  };
  value: any;
}
