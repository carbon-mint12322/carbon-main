import React, { useState } from 'react';
import Dialog from '~/components/lib/Feedback/Dialog';
import TableView from '~/container/landparcel/details/TableView';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { nestedItemCreate } from '~/frontendlib/nestedItemCreate';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
import { NestedItemActionWrapper } from '~/components/lib/NestedResources/NestItemActionWrapper';
import { getSentenceFromDashed } from '~/backendlib/util/getSentenceFromDashed';
import { has } from 'lodash';
import { getCapitalizeDashedWord } from '~/backendlib/util/getCapitalizedDashed';
import { convertToSingular } from '~/utils/convertToSingular';


interface INestedResourceListComponent {
  data: any,
  parentData: any,
  reFetch: () => void,
  Editor: any,
  childResourceUri: string,
  modelName: string,
  columnConfig: GridColDef[],
  formContext?: {},
  allowAdd?: boolean,
  transformErrors?: Function
}


export default function NestedResourceListComponent({
  data,
  parentData,
  reFetch,
  Editor,
  childResourceUri,
  modelName,
  columnConfig,
  formContext,
  allowAdd = true,
  transformErrors
}: INestedResourceListComponent) {
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const [openModal, setOpenModal] = useState(false);
  const toggleOpenModal = (e?: any) => {
    e?.preventDefault?.();
    setOpenModal((openModal) => !openModal);
  };

  const camelcasedChildResourceUri = getCapitalizeDashedWord(childResourceUri as any);
  const uiInfoChildResourceUri = getSentenceFromDashed(childResourceUri as any);
  const childResourceSingularUri = convertToSingular(uiInfoChildResourceUri);

  const handleFormSubmit = (data: any) => {

    const payload = data?.[camelcasedChildResourceUri];

    if (!payload) openToast('error', 'Something went wrong');

    return nestedItemCreate({
      baseUrl: getApiUrl(''),
      parentId: parentData._id || parentData.id,
      payload,
      childResourceUri,
      modelName,
      onSuccess: () => {
        openToast('success', `${uiInfoChildResourceUri} added`);
        reFetch?.();
      },
      onError: (error) =>
        openToast(
          'error',
          error?.response?.data.error || error?.message || `${uiInfoChildResourceUri} not added`,
        ),
    });
  };

  const handleFormSubmitAndClose = (data: any) => {
    handleFormSubmit(data);
    toggleOpenModal();
  };

  //
  const renderActionCell = (item: GridValueGetterParams) => {
    const parentId = parentData._id || parentData.id;

    return (
      <NestedItemActionWrapper
        Editor={Editor}
        parentId={parentId}
        item={item}
        reFetch={reFetch}
        childResourceUri={childResourceUri}
        modelName={modelName}
        formContext={formContext}
        transformErrors={transformErrors}
      />
    );
  };

  const columnConfigWithActions = [
    ...columnConfig,
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: renderActionCell,
    },
  ];

  const getId = (item: any) => {
    if (has(item, '_id')) return item._id;
    if (has(item, 'id')) return item.id;
    return new Date().getTime();
  };

  const getData = () => data?.map((item: any) => ({ map: parentData?.map, ...item }));

  return (
    <>
      <Dialog open={Boolean(openModal)} onClose={toggleOpenModal} fullWidth maxWidth={'md'}>
        <Editor
          formContext={formContext}
          onSubmit={handleFormSubmitAndClose}
          onCancelBtnClick={toggleOpenModal}
          transformErrors={transformErrors}
        />
      </Dialog>
      <TableView
        getRowId={getId}
        name={uiInfoChildResourceUri}
        columnConfig={columnConfigWithActions}
        key={`processing-${childResourceUri}`}
        data={getData()}
        addBtnVisible={allowAdd}
        addBtnTitle={`Add ${childResourceSingularUri}`}
        handleAddBtnClick={toggleOpenModal}
      />
    </>
  );
}
