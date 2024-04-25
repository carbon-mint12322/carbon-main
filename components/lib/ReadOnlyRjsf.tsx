import { ObjectFieldTemplateProps, WidgetProps } from '@rjsf/utils';
import { Fragment, FunctionComponent } from 'react';
import BaseReactJsonSchemaForm from './BaseReactJsonSchemaForm';
import widgets from '../form-widgets';
import fields from '../form-widgets/form-fields';

type ReadOnlyViewProps = {
  schema: any;
  formData: any;
  uiSchema?: any;
  readonly?: boolean;
};

const noop = () => {};

function BaseInputTemplate(props: WidgetProps) {
  // eslint-disable-next-line
  const { schema, label, value, uiSchema, formContext, ...rest } = props;
  return (
    <div>
      {label}: <strong>{value}</strong>
    </div>
  );
}

function ObjectFieldTemplate(props: ObjectFieldTemplateProps) {
  return (
    <div>
      {props.properties.map(
        (element, i): JSX.Element => (
          <div key={i} className='property-wrapper'>
            {element.content}
          </div>
        ),
      )}
    </div>
  );
}

const CustomString = function (props: any) {
  // eslint-disable-next-line
  const { schema, formData, title, ...rest } = props;
  const label = schema.title;
  // console.log('CustomString, props', props);
  return (
    <div>
      {label}: <i>{formData}</i>
    </div>
  );
};

export const ReadOnlyView: FunctionComponent<ReadOnlyViewProps> = (props: ReadOnlyViewProps) => {
  const { schema, uiSchema, formData, readonly = true } = props;
  // TODO - may customize object and array templates as well
  const templates = {
    BaseInputTemplate,
    ObjectFieldTemplate,
  };
  // const fields = {
  //   StringField: CustomString,
  //   NumberField: CustomString,
  //   OneOfField: CustomString,
  //   AnyOfField: CustomString,
  //   // ObjectField: CustomString,
  //   DescriptionField: () => null,
  // };

  return (
    <BaseReactJsonSchemaForm
      schema={{ ...schema }}
      formData={{ ...formData }}
      uiSchema={uiSchema || {}}
      fields={fields}
      widgets={widgets}
      onChange={noop}
      onSubmit={noop}
      readonly={readonly}
    >
      <Fragment />
    </BaseReactJsonSchemaForm>
  );
};
export default ReadOnlyView;
