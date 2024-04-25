import { GridValueGetterParams } from '@mui/x-data-grid';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
export default function FarmTractorDetails({ data, lpMap, modelName, reFetch, Editor }: any) {
  const childResourceUri = 'farm-tractors';
  const columnConfig = [
    {
      field: 'tractorType',
      headerName: 'Type',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.tractorType}`,
    },
    {
      field: 'tractorBrand',
      headerName: 'Brand',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.tractorBrand}`,
    },
    {
      field: 'fuelType',
      headerName: 'Fuel',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.fuelType}`,
    },
    {
      field: 'tractorModel',
      headerName: 'Model',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.tractorModel}`,
    },
    {
      field: 'usage',
      headerName: 'Usage (hrs)',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.usage}`,
    },
    {
      field: 'tractorPower',
      headerName: 'Power (hp)',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.tractorPower}`,
    },
    {
      field: 'tractorDate',
      headerName: 'Purchase Date',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.tractorDate}`,
    },
  ]
  return (
    <NestedResourceListComponent
      Editor={Editor}
      data={data?.farmTractors}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
      formContext={{ map: lpMap }}
    />
  );
}