import React from 'react';
import dynamic from 'next/dynamic';
const Add_collectiveevaluationEditor = dynamic(
  import('~/gen/data-views/add_collectiveevaluation/add_collectiveevaluationEditor.rtml'),
);
import { stringDateFormatter } from '~/utils/dateFormatter';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';

interface CollectiveEvaluationDetailsProps {
  data: any;
  modelName: string;
  reFetch: () => void;
}

export default function CollectiveEvaluationDetails({
  data,
  reFetch,
  modelName,
}: CollectiveEvaluationDetailsProps) {
  const childResourceUri = 'evaluation-details';

  const columnConfig = [
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'evaluationType',
      headerName: 'Type',
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
    },
    {
      field: 'evaluationDate',
      headerName: 'Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) =>
        stringDateFormatter(params.row?.evaluationDate),
    },
    {
      field: 'evaluator',
      headerName: 'Evaluator',
      flex: 1,
    },
    {
      field: 'outcome',
      headerName: 'Outcome',
      flex: 1,
    },
    {
      field: 'attachments',
      headerName: 'Attachments',
      flex: 1,
    },
  ];

  return (
    <NestedResourceListComponent
      Editor={Add_collectiveevaluationEditor}
      data={data?.evaluationDetails}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
    />
  );
}
