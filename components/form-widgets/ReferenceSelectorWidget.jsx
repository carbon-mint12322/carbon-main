import React, { useMemo, useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SelectionDlg from './selection-dlg';

import { useOperator } from '~/contexts/OperatorContext';
import { useQuery } from '@tanstack/react-query';
import { listWithSchemaId } from '~/frontendlib/model-lib/crud';

const ReferenceSelectorFieldWidget = (props) => {
  /*
    schema: The JSON schema for this field;
    uiSchema: The uiSchema for this field;
    idSchemaa: The tree of unique ids for every child field;
    formData: The data for this field;
    errorSchema: The tree of errors for this field and its children;
    registry: A registry object (read next).
    formContext: A formContext object (read next).
  */
  const {
    schema,
    uiSchema,
    idSchema,
    errorSchema,
    registry,
    formContext,
    placeholder,
    value, // current value
    required, // boolean indicating if this field is required
    onChange: notifyForm,
    readonly,
  } = props;

  const { getApiUrl } = useOperator();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = (_value) => {
    setOpen(false);
    notifyForm(_value?._id);
  };

  const uiOptions = uiSchema['ui:options'] || {};
  const filterKey = uiOptions.filterKey; // query filter to be sent to DB
  const foreignSchemaId = uiSchema?.foreignSchemaId;
  const defaultListUrl = useMemo(
    () => getApiUrl(foreignSchemaId)?.replace('/api', ''),
    [foreignSchemaId],
  );

  function defaultListingFunction({ filter }) {
    const queryOptions = {};
    return listWithSchemaId(defaultListUrl, filter, queryOptions);
  }

  const listingFunction =
    uiSchema.foreignObjectLoader || formContext?.foreignObjectLoader || defaultListingFunction;
  const filter = formContext?.getFilter ? formContext.getFilter(filterKey) : {};
  const { isLoading, error, isError, isFetching, data } = useQuery([filterKey], () =>
    listingFunction({ schemaId: foreignSchemaId, filter, formContext, uiOptions }),
  );

  const LoadingWidget = () => <div>Loading...</div>;
  if (isLoading || isFetching) {
    return <LoadingWidget />;
  }

  const selectedObject = data?.find((obj) => obj?._id === value);

  const ForeignLabelWidget = getForeignLabelWidget(foreignSchemaId, uiSchema.foreignLabelWidget);

  const objectName =
    (selectedObject && <ForeignLabelWidget object={selectedObject} />) ||
    placeholder ||
    '<not set>';

  return (
    <Typography sx={{ variant: 'caption' }}>
      {schema.title}: {objectName} &nbsp;&nbsp;
      {!readonly && (
        <Button
          id={schema?.title.toLowerCase().concat('Select')}
          variant='outlined'
          onClick={handleClickOpen}
        >
          Click here
        </Button>
      )}
      {open && (
        <SelectionDlg
          foreignSchemaId={foreignSchemaId}
          foreignLabelWidget={ForeignLabelWidget}
          foreignObjects={data}
          selectedValue={selectedObject}
          open={open}
          title={schema.title}
          onClose={handleClose}
        />
      )}
    </Typography>
  );
};

// Widgets used to display in the list to be selected
const BatchLabelWidget = ({ object }) => object.batchId;
const NameLabelWidget = ({ object }) => object.name;
const UserNameWidget = ({ object }) => {
  if (!object) return '-';
  try {
    return `${object.personalDetails.firstName} ${object.personalDetails.lastName || ''}`;
  } catch (err) {
    // Backward compatibility
    if (object.firstName) {
      return `${object.firstName} ${object.lastName || ''}`;
    }
    return '---';
  }
};

/**
 * Add more widgets here
 */
const objectLabelWidgets = {
  UserNameWidget,
  BatchLabelWidget,
};

// name comes from YAML files
const getForeignLabelWidget = (schemaId, name) =>
  objectLabelWidgets[name] ? objectLabelWidgets[name] : NameLabelWidget;

export default ReferenceSelectorFieldWidget;
