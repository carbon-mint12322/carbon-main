import React from 'react';
import dynamic from 'next/dynamic';
const Add_collectivenonconfirmityEditor = dynamic(
  import('~/gen/data-views/add_collectivenonconfirmity/add_collectivenonconfirmityEditor.rtml'),
);
import { stringDateFormatter } from '~/utils/dateFormatter';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
import axios from 'axios';
import { useOperator } from '~/contexts/OperatorContext';

interface CollectiveNonCofirmityDetailsProps {
  data: any;
  reFetch: () => void;
  modelName: string;
}

export default function CollectiveNonCofirmityDetails({
  data,
  reFetch,
  modelName
}: CollectiveNonCofirmityDetailsProps) {
  const { getAPIPrefix } = useOperator();

  const childResourceUri = 'non-confirmity-details';

  const columnConfig = [
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'ncDate',
      headerName: 'NC Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => stringDateFormatter(params.row?.ncDate),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
    },
    {
      field: 'cb',
      headerName: 'Certification Body',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => params.row?.cb?.name,
    },
    {
      field: 'severity',
      headerName: 'Severity',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
    },
    {
      field: 'targetDate',
      headerName: 'Target Date',
      flex: 1,
    },
  ];

  async function defaultListFilter(options: any) {
    const res: {
      data: any;
    } = await axios.get(getAPIPrefix() + `${options.schemaId}`);
    return res.data;
  }

  const formContext: any = {
    foreignObjectLoader: defaultListFilter,
  };

  return (
    <NestedResourceListComponent
      Editor={Add_collectivenonconfirmityEditor}
      data={data?.nonConfirmityDetails}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
      formContext={formContext}
    />
  );
}
