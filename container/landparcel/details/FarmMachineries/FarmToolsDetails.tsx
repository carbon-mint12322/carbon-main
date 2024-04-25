import { GridValueGetterParams } from '@mui/x-data-grid';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
export default function FarmToolsDetails({ data, lpMap, modelName, reFetch, Editor }: any) {
  const childResourceUri = 'farm-tools';
  const columnConfig = [
    {
      field: 'toolType',
      headerName: 'Type',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.toolType}`,
    },
    {
      field: 'toolBrand',
      headerName: 'Brand',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.toolBrand}`,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.quantity}`,
    },
    {
      field: 'toolDate',
      headerName: 'Purchase Date',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.toolDate}`,
    }
  ]
  return (
    <NestedResourceListComponent
      Editor={Editor}
      data={data?.farmTools}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
      formContext={{ map: lpMap }}
    />
  );
}