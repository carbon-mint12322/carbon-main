import { useState } from 'react';
import dynamic from 'next/dynamic';
import fields from '../form-widgets/form-fields';
import widgets from '../form-widgets';
import validator from '@rjsf/validator-ajv8';

const ReactJsonSchemaForm = dynamic(import('@rjsf/mui'));

function BaseReactJsonForm(props) {
  const formData = props.formData?.data || props.formData || {};
  return (
    <>
      <ReactJsonSchemaForm
        validator={validator}
        formData={formData}
        schema={props.schema}
        uiSchema={props.uiSchema}
        onSubmit={props.onSubmit}
        onChange={props.onChange}
        fields={props.fields || fields}
        widgets={props.widgets || widgets}
        templates={props.templates || {}}
        readonly={props.readonly}
      >
        {props.children || null}
      </ReactJsonSchemaForm>
    </>
  );
}

export default BaseReactJsonForm;
