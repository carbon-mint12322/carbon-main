import React from 'react';
import dynamic from 'next/dynamic';
const Add_collectivengmotestrecordEditor = dynamic(
  import('~/gen/data-views/add_collectivengmotestrecord/add_collectivengmotestrecordEditor.rtml'),
);
import { stringDateFormatter } from '~/utils/dateFormatter';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';

interface CollectiveNGMOTestRecordDetailsProps {
  data: any;
  reFetch: () => void;
  modelName: string;
}

export default function CollectiveNGMOTestRecordDetails({
  data,
  modelName,
  reFetch,
}: CollectiveNGMOTestRecordDetailsProps) {
  const childResourceUri = 'ngmo-test-records';

  const columnConfig = [
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'sampleId',
      headerName: 'Sample ID',
      flex: 1,
    },
    {
      field: 'sampleType',
      headerName: 'Sample Type',
      flex: 1,
    },
    {
      field: 'sampleReceivedDate',
      headerName: 'Sample Recieved Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) =>
        stringDateFormatter(params.row?.sampleReceivedDate),
    },
    {
      field: 'testStart',
      headerName: 'Test Start',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => stringDateFormatter(params.row?.testStart),
    },
    {
      field: 'testEnd',
      headerName: 'Test End',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => stringDateFormatter(params.row?.testEnd),
    },

    {
      field: 'laboratory',
      headerName: 'Laboratory',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => params.row?.laboratory,
    },
  ];

  return (
    <NestedResourceListComponent
      Editor={Add_collectivengmotestrecordEditor}
      data={data?.ngmoTestRecords}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
    />
  );
}
