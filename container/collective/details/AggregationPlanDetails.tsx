import React from 'react';
import dynamic from 'next/dynamic';
import { stringDateFormatter } from '~/utils/dateFormatter';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
import { useOperator } from '~/contexts/OperatorContext';
import axios from 'axios';
const Add_aggregationplanEditor = dynamic(
  import('~/gen/data-views/add_aggregationplan/add_aggregationplanEditor.rtml'),
);

interface AggregationPlanDetailsProps {
  data: any;
  reFetch: () => void;
  modelName: string;
}

export default function AggregationPlanDetails({ data, reFetch, modelName }: AggregationPlanDetailsProps) {
  const { getAPIPrefix } = useOperator();
  const childResourceUri = 'aggregation-plan-details';

  const columnConfig = [
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'cb',
      headerName: 'Certfication Body',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => params.row?.cb?.name,
    },
    {
      field: 'hu',
      headerName: 'Harvest Update',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => params.row?.hu?.name,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => stringDateFormatter(params.row?.startDate),
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => stringDateFormatter(params.row?.endDate),
    },
    {
      field: 'crop',
      headerName: 'Crop',
      flex: 1,
    },
    {
      field: 'variety',
      headerName: 'Variety',
      flex: 1,
    },
    {
      field: 'otherRemarks',
      headerName: 'Remarks',
      flex: 1,
    },
  ];

  async function collectiveAggregationPlanFilter(options: any) {
    if (options?.uiOptions.filterKey === 'harvestUpdate') {
      return data?.harvestUpdateDetails;
    } else {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `${options.schemaId}`);
      return res.data;
    }
  }

  const formContext: any = {
    foreignObjectLoader: collectiveAggregationPlanFilter,
  };

  return (
    <NestedResourceListComponent
      Editor={Add_aggregationplanEditor}
      data={data?.aggregationPlanDetails}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
      formContext={formContext}
    />
  );
}
