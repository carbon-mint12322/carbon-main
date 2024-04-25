import dynamic from 'next/dynamic';
import React from 'react';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
const SolarDryerUnitsEditor = dynamic(
  import('~/gen/data-views/landparcel_solarDryerUnits/landparcel_solarDryerUnitsEditor.rtml'),
);
export default function SolarDryerUnits({ data, lpData, modelName, reFetch, lpMap }: any) {
  const processingSystemFilter = {
    landParcel: lpData._id,
  };
  const childResourceUri = 'solar-dryer-units';
  const columnConfig = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.name}`,
    },
    {
      field: 'area',
      headerName: 'Collector Area (sqm)',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.area}`,
    },
    {
      field: 'capacity',
      headerName: 'Capacity (Kgs)',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.capacity}`,
    },
  ];
  const formContext: any = {
    getFilter: (key: string) => {
      switch (key) {
        case 'processingSystem': // this key is defined as ui:options in yaml
          return processingSystemFilter;
        default:
          break;
      }
      throw new Error(`Unknown filter key in ui:options ${key}`);
    },
  };

  return (
    <NestedResourceListComponent
      Editor={SolarDryerUnitsEditor}
      data={data}
      parentData={lpData}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
      formContext={formContext}
    />
  );
}
