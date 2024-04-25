import { Box } from '@mui/material';
import ListActionModal from '../ListActionModal';
import { GridValueGetterParams } from '@mui/x-data-grid';
import { useState } from 'react';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
import axios from 'axios';
import { getCapitalizeDashedWord } from '~/backendlib/util/getCapitalizedDashed';
import { getSentenceFromDashed } from '~/backendlib/util/getSentenceFromDashed';

interface InputParams {
  Editor: any;
  parentId: string;
  item: GridValueGetterParams;
  reFetch: () => void;
  childResourceUri: string;
  modelName: string;
  formContext?: any;
  transformErrors?: Function;
}

export function NestedItemActionWrapper({
  Editor,
  parentId,
  item,
  reFetch,
  childResourceUri,
  modelName,
  formContext,
  transformErrors
}: InputParams) {
  const row = item.row;
  const child = { ...row, parentId };
  const resourceCapitalized = getCapitalizeDashedWord(childResourceUri as any);
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();
  const uiInfoChildResourceUri = getSentenceFromDashed(childResourceUri as any);
  const { map, location } = row;

  const handleFormSubmit = async (formData: any, id: string) => {
    try {
      setSubmit(true);

      const res = await axios.put(
        getApiUrl(`/nested/${modelName}/${parentId}/${childResourceUri}/${id}`),
        formData[getCapitalizeDashedWord(childResourceUri as any)],
      );

      if (res) {
        reFetch && reFetch();
        openToast('success', `Successfully updated ${uiInfoChildResourceUri}`);
      }
    } catch (error: any) {
      openToast('error', error?.message || `Failed to update ${uiInfoChildResourceUri}`);
    } finally {
      setSubmit(false);
    }
  };

  return (
    <Box component={'div'}>
      <ListActionModal
        isActive={row.active}
        id={row._id}
        schema={`nested`}
        modelName={modelName}
        parentId={parentId}
        childResourceUri={childResourceUri}
        resourceName={resourceCapitalized}
        data={{ [resourceCapitalized]: child, ...child }}
        Editor={Editor}
        canActivate={false}
        canEdit={true}
        canDelete={true}
        canView={true}
        reFetch={reFetch}
        formContext={{ ...formContext, map, location }}
        onSubmit={handleFormSubmit}
      />
    </Box>
  );
}
