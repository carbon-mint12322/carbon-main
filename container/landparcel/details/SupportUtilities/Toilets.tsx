import dynamic from 'next/dynamic';
import React from 'react';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
const ToiletsEditor = dynamic(
  import('~/gen/data-views/landparcel_toilets/landparcel_toiletsEditor.rtml'),
);
export default function Toilets({ data, lpData, modelName, reFetch, lpMap }: any) {
  const childResourceUri = 'toilets';
  const columnConfig = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.name}`,
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.type}`,
    },
    {
      field: 'condition',
      headerName: 'Condition',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.condition ? params.row.condition : ''} `,
    },
  ];

  return (
    <NestedResourceListComponent
      Editor={ToiletsEditor}
      data={data}
      parentData={lpData}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
      formContext={{ map: lpMap }}
    />
  );
}
