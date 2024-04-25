import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import Dialog from '~/components/lib/Feedback/Dialog';
import TableView from '~/container/landparcel/details/TableView';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
const AttractionsEditor = dynamic(
  import('~/gen/data-views/landparcel_attractions/landparcel_attractionsEditor.rtml'),
);

export default function Attractions({ data, lpData, modelName, reFetch, lpMap }: any) {
  const childResourceUri = 'attractions';

  const columnConfig = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.name}`,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.description ? params.row.description : ''}`,
    },
    {
      field: 'size',
      headerName: 'Size (sqyd)',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.size}`,
    },
  ];

  return (
    <NestedResourceListComponent
      Editor={AttractionsEditor}
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
