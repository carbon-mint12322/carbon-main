import React from 'react';
import dynamic from 'next/dynamic';
const Add_collectivedocumentEditor = dynamic(
  import('~/gen/data-views/add_collectivedocument/add_collectivedocumentEditor.rtml'),
);
import { stringDateFormatter } from '~/utils/dateFormatter';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';

interface CollectiveDocumentDetailsProps {
  data: any;
  modelName: string;
  reFetch: () => void;
}

export default function CollectiveDocumentDetails({
  data,
  reFetch,
  modelName,
}: CollectiveDocumentDetailsProps) {
  const childResourceUri = 'document-details';

  const columnConfig = [
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'documentType',
      headerName: 'Type',
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
    },
    {
      field: 'documentDate',
      headerName: 'Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => stringDateFormatter(params.row?.documentDate),
    },
    {
      field: 'documentOwner',
      headerName: 'Owner',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
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
      Editor={Add_collectivedocumentEditor}
      data={data?.documentDetails}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
    />
  );
}
