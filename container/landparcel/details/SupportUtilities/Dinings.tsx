import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import Dialog from '~/components/lib/Feedback/Dialog';
import TableView from '~/container/landparcel/details/TableView';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
const DiningsEditor = dynamic(
  import('~/gen/data-views/landparcel_dinings/landparcel_diningsEditor.rtml'),
);
export default function Dinings({ data, lpData, modelName, reFetch, lpMap }: any) {

  const childResourceUri = 'dinings';
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
      field: 'size',
      headerName: 'Size (sqyd)',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.size}`,
    },
  ];

  return <NestedResourceListComponent
    Editor={DiningsEditor}
    data={data}
    parentData={lpData}
    reFetch={reFetch}
    modelName={modelName}
    childResourceUri={childResourceUri}
    columnConfig={columnConfig}
    formContext={{ map: lpMap }}
  />

}
