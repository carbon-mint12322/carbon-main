import { IJsonSchema } from '../types';
import fields from '~/components/form-widgets/form-fields';
import widgets from '~/components/form-widgets';
import { UploadFilesWithAttachmentsWidget } from '~/frontendlib/QR/UploadFilesWithAttachmentsWidget';
const { renderToStaticMarkup } = require('react-dom/server');
const React = require('react');
const validator = require('@rjsf/validator-ajv8').default;
const Form = require('@rjsf/mui').default;

interface InputProps {
  schema: IJsonSchema;
  uiSchema: Record<string, any>;
  data: Record<string, any>;
}

export function getHtmlFromSchemaAndData({ schema, uiSchema, data }: InputProps) {
  const props = {
    schema,
    uiSchema,
    validator,
    formData: data,
    readonly: true,
    widgets: {
      ...widgets,
      UploadFilesWithAttachmentsWidget,
    },
    fields,
  };

  return renderToStaticMarkup(React.createElement(Form, props, []));
}
