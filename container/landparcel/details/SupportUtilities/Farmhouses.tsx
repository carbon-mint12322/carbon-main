import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import Dialog from '~/components/lib/Feedback/Dialog';
import TableView from '~/container/landparcel/details/TableView';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
const FarmhousesEditor = dynamic(
  import('~/gen/data-views/landparcel_farmhouses/landparcel_farmhousesEditor.rtml'),
);
export default function Farmhouses({ data, lpData, modelName, reFetch, lpMap }: any) {
  const childResourceUri = 'farmhouses';
  const columnConfig = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.name}`,
    },
    {
      field: 'size',
      headerName: 'Size (sqyd)',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.size}`,
    },
    {
      field: 'condition',
      headerName: 'Condition',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.condition ? params.row.condition : ''}`,
    },
  ];

  return (
    <NestedResourceListComponent
      Editor={FarmhousesEditor}
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
