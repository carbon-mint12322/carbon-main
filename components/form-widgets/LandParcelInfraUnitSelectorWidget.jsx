import React, { useMemo, useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SelectionDlg from './selection-dlg';
import useFetch from 'hooks/useFetch';
import { useOperator } from '~/contexts/OperatorContext';
import { useQuery } from '@tanstack/react-query';
import { listWithSchemaId } from '~/frontendlib/model-lib/crud';
import { useRouter } from 'next/router';

const LandParcelInfraUnitSelectorWidget = (props) => {
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
  } = props;

  const { getApiUrl, changeRoute, getAPIPrefix } = useOperator();
  const router = useRouter();
  const landParcelId = router.query.id;

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = (_value) => {
    setOpen(false);
    notifyForm(_value?._id);
  };

  const queryOptions = {};
  const LoadingWidget = () => <div>Loading...</div>;

  const API_URL = getAPIPrefix() + `/landparcel/${landParcelId}`;
  const { isLoading, data, reFetch } = useFetch(API_URL);

  if (isLoading) {
    return <LoadingWidget />;
  }

  const selectedObject = data?.[0]?.solarDryerUnits.find((obj) => obj?._id === value);

  const objectName =
    (selectedObject && <NameLabelWidget object={selectedObject} />) || placeholder || '<not set>';

  return (
    <Typography sx={{ variant: 'caption' }}>
      {schema.title}: {objectName} &nbsp;&nbsp;
      <Button variant='outlined' onClick={handleClickOpen}>
        Click here
      </Button>
      {open && (
        <SelectionDlg
          foreignSchemaId={'/landparel'}
          foreignLabelWidget={NameLabelWidget}
          foreignObjects={data?.[0]?.solarDryerUnits}
          selectedObject={selectedObject}
          open={open}
          title={schema.title}
          onClose={handleClose}
        />
      )}
    </Typography>
  );
};

// Widgets used to display in the list to be selected
const NameLabelWidget = ({ object }) => object.name;

export default LandParcelInfraUnitSelectorWidget;
