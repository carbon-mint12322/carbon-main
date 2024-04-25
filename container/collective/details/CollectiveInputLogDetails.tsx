import React from 'react';
import dynamic from 'next/dynamic';
const Add_collectiveinputlogEditor = dynamic(
  import('~/gen/data-views/add_collectiveinputlog/add_collectiveinputlogEditor.rtml'),
);
import { stringDateFormatter } from '~/utils/dateFormatter';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';

interface CollectiveInputLogDetailsProps {
  data: any;
  reFetch: () => void;
  modelName: string;
}

export default function CollectiveInputLogDetails({
  data,
  reFetch,
  modelName,
}: CollectiveInputLogDetailsProps) {
  const childResourceUri = 'input-logs';

  const columnConfig = [
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'materialName',
      headerName: 'Material Name',
      flex: 1,
    },
    {
      field: 'brandName',
      headerName: 'Brand Name',
      flex: 1,
    },
    {
      field: 'dateOfPurchase',
      headerName: 'Date of Purchase',
      flex: 1,
      renderCell: (params: GridValueGetterParams) =>
        stringDateFormatter(params.row?.dateOfPurchase),
    },
    {
      field: 'purpose',
      headerName: 'Purpose',
      flex: 1,
    },
    {
      field: 'totalExpenditure',
      headerName: 'Total Expenditure',
      flex: 1,
    },
  ];

  return (
    <NestedResourceListComponent
      Editor={Add_collectiveinputlogEditor}
      data={data?.inputLogs}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
    />
  );
}
