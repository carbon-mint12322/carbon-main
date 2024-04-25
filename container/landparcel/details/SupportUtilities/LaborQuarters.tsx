import dynamic from 'next/dynamic';
import React from 'react';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
const LaborQuartersEditor = dynamic(
  import('~/gen/data-views/landparcel_laborQuarters/landparcel_laborQuartersEditor.rtml'),
);
export default function LaborQuarters({ data, lpData, modelName, reFetch, lpMap }: any) {
  const childResourceUri = 'labor-quarters';
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
      Editor={LaborQuartersEditor}
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
