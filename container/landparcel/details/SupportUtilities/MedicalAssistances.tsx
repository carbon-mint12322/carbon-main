import dynamic from 'next/dynamic';
import React from 'react';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
const MedicalAssistancesEditor = dynamic(
  import('~/gen/data-views/landparcel_medicalAssistances/landparcel_medicalAssistancesEditor.rtml'),
);
export default function MedicalAssistances({ data, lpData, modelName, reFetch, lpMap }: any) {

  const childResourceUri = 'medical-assistances';
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
    Editor={MedicalAssistancesEditor}
    data={data}
    parentData={lpData}
    reFetch={reFetch}
    modelName={modelName}
    childResourceUri={childResourceUri}
    columnConfig={columnConfig}
    formContext={{ map: lpMap }}
  />

}
