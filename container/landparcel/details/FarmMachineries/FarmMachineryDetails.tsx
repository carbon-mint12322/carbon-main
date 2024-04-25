import { GridValueGetterParams } from '@mui/x-data-grid';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
export default function FarmMachineryDetails({ data, lpMap, modelName, reFetch, Editor }: any) {
  const childResourceUri = 'farm-machineries';
  const columnConfig = [
    {
      field: 'machineryType',
      headerName: 'Type',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.machineryType}`,
    },
    {
      field: 'machineryBrand',
      headerName: 'Brand',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.machineryBrand}`,
    },
    {
      field: 'machineryPower',
      headerName: 'Power (hp)',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.machineryPower}`,
    },
    {
      field: 'machineryDate',
      headerName: 'Purchase Date',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.machineryDate}`,
    },
  ]
  return (
    <NestedResourceListComponent
      Editor={Editor}
      data={data?.farmMachineries}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
      formContext={{ map: lpMap }}
    />
  );
}





