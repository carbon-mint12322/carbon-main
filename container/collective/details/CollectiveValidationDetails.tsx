import React from 'react';
import dynamic from 'next/dynamic';
const Add_collectivevalidationEditor = dynamic(
  import('~/gen/data-views/add_collectivevalidation/add_collectivevalidationEditor.rtml'),
);
import { stringDateFormatter } from '~/utils/dateFormatter';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';

interface CollectiveValidationDetailsProps {
  data: any;
  reFetch: () => void;
  modelName: string;
}

export default function CollectiveValidationDetails({
  data,
  reFetch,
  modelName
}: CollectiveValidationDetailsProps) {
  const childResourceUri = 'validation-details';

  const columnConfig = [
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'validationType',
      headerName: 'Type',
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
    },
    {
      field: 'validationDate',
      headerName: 'Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) =>
        stringDateFormatter(params.row?.validationDate),
    },
    {
      field: 'doneBy',
      headerName: 'Done By',
      flex: 1,
    },
    {
      field: 'outcome',
      headerName: 'Outcome',
      flex: 1,
    },
    {
      field: 'attachments',
      headerName: 'Attachments',
      flex: 1,
    },
  ];

  return (
    <NestedResourceListComponent
      Editor={Add_collectivevalidationEditor}
      data={data?.validationDetails}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
    />
  );
}
