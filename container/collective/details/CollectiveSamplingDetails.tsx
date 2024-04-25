import React from 'react';
import dynamic from 'next/dynamic';
const Add_collectivesamplingEditor = dynamic(
  import('~/gen/data-views/add_collectivesampling/add_collectivesamplingEditor.rtml'),
);
import { stringDateFormatter } from '~/utils/dateFormatter';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
import { useOperator } from '~/contexts/OperatorContext';
import axios from 'axios';

interface CollectiveSamplingDetailsProps {
  data: any;
  reFetch: () => void;
  modelName: string;
}

export default function CollectiveSamplingDetails({
  data,
  reFetch,
  modelName
}: CollectiveSamplingDetailsProps) {
  const { getAPIPrefix } = useOperator();

  const childResourceUri = 'sampling-details';

  const columnConfig = [
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'collectionDate',
      headerName: 'Collection Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) =>
        stringDateFormatter(params.row?.collectionDate),
    },
    {
      field: 'aggregationPlan',
      headerName: 'Aggregation Plan',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => params.row?.aggregationPlan?.name,
    },

    {
      field: 'cb',
      headerName: 'Certification Body',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => params.row?.cb?.name,
    },
    {
      field: 'sampleReference',
      headerName: 'Sample Reference',
      flex: 1,
    },
  ];

  async function collectiveSamplingFilter(options: any) {
    if (options?.uiOptions.filterKey === 'aggregationPlan') {
      return data?.aggregationPlanDetails;
    } else {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `${options.schemaId}`);
      return res.data;
    }
  }

  const formContext: any = {
    foreignObjectLoader: collectiveSamplingFilter,
  };

  return (
    <NestedResourceListComponent
      Editor={Add_collectivesamplingEditor}
      data={data?.samplingDetails}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
      formContext={formContext}
    />
  );
}
