import { GridValueGetterParams } from '@mui/x-data-grid';
import dynamic from 'next/dynamic';
import React from 'react';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
const LandParcelBasicUtilEditor = dynamic(
  import('~/gen/data-views/landparcel_powerSources/landparcel_powerSourcesEditor.rtml'),
);
export default function PowerSources({ data, lpMap, lpData, modelName, reFetch }: any) {

  const childResourceUri = 'power-sources';

  const columnConfig = [
    {
      field: 'source',
      headerName: 'Source',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.source}`,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'size',
      headerName: 'Size',
      flex: 1,
    },
    {
      field: 'capacity',
      headerName: 'Capacity',
      flex: 1,
    },
  ];


  return <NestedResourceListComponent
    Editor={LandParcelBasicUtilEditor}
    data={data}
    parentData={lpData}
    reFetch={reFetch}
    modelName={modelName}
    childResourceUri={childResourceUri}
    columnConfig={columnConfig}
    formContext={{ map: lpMap }}
  />
}
