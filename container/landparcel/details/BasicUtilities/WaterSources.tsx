import { GridValueGetterParams } from '@mui/x-data-grid';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
const LandParcelBasicUtilEditor = dynamic(
  import('~/gen/data-views/landparcel_waterSources/landparcel_waterSourcesEditor.rtml'),
);
export default function WaterSources({ data, lpMap, modelName, lpData, reFetch }: any) {
  const childResourceUri = 'water-sources';

  const columnConfig = [
    {
      field: 'source',
      headerName: 'Source',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.source}`,
    },
    {
      field: 'details.name',
      headerName: 'Name',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.name}`,
    },
    {
      field: 'details.depth',
      headerName: 'Depth (meters)',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.depth}`,
    },
    {
      field: 'details.diameter',
      headerName: 'Diameter (inches)',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.diameter}`,
    },
  ];

  return (
    <NestedResourceListComponent
      Editor={LandParcelBasicUtilEditor}
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
