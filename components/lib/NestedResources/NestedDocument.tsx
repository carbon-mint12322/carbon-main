import React from 'react';
import dynamic from 'next/dynamic';
import { stringDateFormatter } from '~/utils/dateFormatter';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
const nestedSupportDocumentEditor = dynamic(
  import('~/gen/data-views/nestedSupportDocuments/nestedSupportDocumentsEditor.rtml'),
);

interface NestedDocumentsProps {
  data: any;
  childResourceUri: string;
  modelName: string;
  reFetch: () => void;
}

export default function NestedDocument({ data, reFetch, childResourceUri, modelName }: NestedDocumentsProps) {
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
      Editor={nestedSupportDocumentEditor}
      data={data?.documents}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
    />
  );
}
